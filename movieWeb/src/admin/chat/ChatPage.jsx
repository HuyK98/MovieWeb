import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ChatPage.css';
import './styles/common.css';
import { getUsersWithLastMessage, getMessages, sendMessageAPI, uploadImageAPI } from './services/chat.api';
import useChatSocket from './hooks/useChatSocket';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import ImagePreviewModal from './components/ImagePreviewModal'
import { normalize, searchMatch } from './utils/textUtils';
import { isUserTyping, createMessage, filterMessages } from './utils/chatUtils';
import { SENDER, TYPING_FROM, ERROR_MESSAGES, PLACEHOLDERS } from './utils/constants';

export default function ChatPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messagesByUser, setMessagesByUser] = useState({});
    const [draft, setDraft] = useState('');
    const [isTyping, setIsTyping] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const endRef = useRef(null);
    const navigate = useNavigate();

    //socket setup
    const { emitMessage, emitTyping, emitStopTyping } = useChatSocket(
        // Callback nhan message
        (data) => {
            setMessagesByUser((prev) => ({
                ...prev,
                [data.userId]: [...(prev[data.userId] || []), data],
            }));

            // Cập nhật last message trong users
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === data.userId
                        ? { ...user, lastMessage: data }
                        : user
                )
            );
        },
        {
            onTyping: ({ userId }) => {
                setIsTyping((prev) => ({ ...prev, [userId]: true }));
            },
            onStopTyping: ({ userId }) => {
                setIsTyping((prev) => ({ ...prev, [userId]: false }));
            },
        }
    );

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const res = await getUsersWithLastMessage();
                setUsers(res.data);

                // khoi tao message map voi last message
                const messagesMap = {};
                res.data.forEach(user => {
                    if (user.lastMessage) {
                        messagesMap[user._id] = [user.lastMessage];
                    }
                });
                setMessagesByUser(messagesMap);

                setError(null);
            } catch (e) {
                console.error('Lỗi load users:', e);
                setError(ERROR_MESSAGES.LOAD_USERS);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesByUser, selectedUser]);

    //select user
    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        try {
            const { data } = await getMessages(user._id);
            setMessagesByUser((prev) => ({ ...prev, [user._id]: data }));
        } catch (e) {
            console.error('Lỗi load messages:', e);
        }
    };

    //filter users voi useMemo(searchQuery)
    const filteredUsers = useMemo(() => {
        const query = normalize(searchQuery);
        if (!query) return users;

        return users.filter((user) => {
            return (
                searchMatch(user.name, query) ||
                searchMatch(user.email, query) ||
                searchMatch(user.lastMessage?.text, query)
            );
        });
    }, [users, searchQuery]);

    const handleSendText = async () => {
        if (!draft.trim() || !selectedUser) return;

        const msg = createMessage({
            text: draft,
            sender: SENDER.ADMIN,
            userId: selectedUser._id,
            isAdmin: true,
        });

        try {
            await sendMessageAPI(msg);
            emitMessage(msg);
            setDraft('');
            emitStopTyping({
                userId: selectedUser._id,
                from: TYPING_FROM.ADMIN
            });
        } catch (e) {
            console.error('Lỗi send message:', e);
            alert(ERROR_MESSAGES.SEND_MESSAGE);
        }
    };

    const handleSendImage = async (file) => {
        if (!file || !selectedUser) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await uploadImageAPI(formData);

            const msg = createMessage({
                text: PLACEHOLDERS.IMAGE_ALT,
                imageUrl: data.imageUrl,
                cloudinaryId: data.cloudinaryId,
                sender: SENDER.ADMIN,
                userId: selectedUser._id,
                isAdmin: true,
            });

            await sendMessageAPI(msg);
            emitMessage(msg);
        } catch (e) {
            console.error('Lỗi send image:', e);
            alert(ERROR_MESSAGES.SEND_IMAGE);
        } finally {
            setIsUploading(false);
        }
    };

    const handleTypingChange = (value) => {
        if (!selectedUser) return;

        if (value.trim().length > 0) {
            emitTyping({
                userId: selectedUser._id,
                from: TYPING_FROM.ADMIN
            });
        } else {
            emitStopTyping({
                userId: selectedUser._id,
                from: TYPING_FROM.ADMIN
            });
        }
    };

    const typingForSelected = isUserTyping(isTyping, selectedUser?._id);

    // filter messages voi util function(filterMessages)
    const filteredMessages = filterMessages(
        messagesByUser[selectedUser?._id] || [],
        searchTerm
    );

    return (
        <div className="chat-container-modern">
            <ChatSidebar
                users={filteredUsers}
                selectedUser={selectedUser}
                onSelectUser={handleSelectUser}
                isLoading={isLoading}
                error={error}
                onBack={() => navigate('/admin')}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                typingUsers={isTyping}
            />

            <div className="chat-main-modern">
                {selectedUser ? (
                    <>
                        <ChatHeader
                            user={selectedUser}
                            onSearchClick={setSearchTerm}
                        />
                        <ChatMessages
                            items={filteredMessages}
                            onImageClick={setPreviewImage}
                            endRef={endRef}
                            isTyping={typingForSelected}
                            searchTerm={searchTerm}
                        />
                        <ChatInput
                            value={draft}
                            onChange={(val) => {
                                setDraft(val);
                                handleTypingChange(val);
                            }}
                            onSend={handleSendText}
                            onSendImage={handleSendImage}
                            disabled={isUploading}
                        />
                    </>
                ) : (
                    <div className="chat-placeholder-admin">
                        <h3>{PLACEHOLDERS.NO_USER_SELECTED}</h3>
                    </div>
                )}
            </div>

            {previewImage && (
                <ImagePreviewModal
                    src={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}