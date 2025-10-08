import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { getUsers, getMessages, sendMessageAPI, uploadImageAPI } from './services/chat.api';
import useChatSocket from './hooks/useChatSocket';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import ImagePreviewModal from './components/ImagePreviewModal';

export default function ChatPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messagesByUser, setMessagesByUser] = useState({});
    const [draft, setDraft] = useState('');
    const [isTyping, setIsTyping] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const endRef = useRef(null);
    const navigate = useNavigate();

    // nhan message va typing qua socket
    const { emitMessage, emitTyping, emitStopTyping } = useChatSocket((data) => {
        setMessagesByUser((prev) => ({
            ...prev,
            [data.userId]: [...(prev[data.userId] || []), data],
        }));
    },
        {
            //onTyping
            onTyping: ({ userId }) => {
                setIsTyping((p) => ({ ...p, [userId]: true }));
            },
            //stopTyping
            onStopTyping: ({ userId }) => {
                setIsTyping((p) => ({ ...p, [userId]: false }))
            },
        }
    );

    // load users
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await getUsers();
                setUsers(res.data);
                setError(null);
            } catch (e) {
                setError('Lỗi khi tải danh sách người dùng');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // auto scroll
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messagesByUser, selectedUser]);

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        try {
            const { data } = await getMessages(user._id);
            setMessagesByUser((prev) => ({ ...prev, [user._id]: data }));
        } catch (e) {
            console.error('Lỗi khi lấy tin nhắn:', e);
        }
    };

    const handleSendText = async () => {
        if (!draft.trim() || !selectedUser) return;
        const msg = {
            text: draft,
            timestamp: new Date().toISOString(),
            sender: 'admin',
            userId: selectedUser._id,
            isAdmin: true,
        };
        try {
            await sendMessageAPI(msg);
            emitMessage(msg);
            setMessagesByUser((prev) => ({
                ...prev,
                [selectedUser._id]: [...(prev[selectedUser._id] || []), msg],
            }));
            setDraft('');
            emitStopTyping({ userId: selectedUser._id, from: 'admin' }); //ngung go sau khi da gui
        } catch (e) {
            console.error('Lỗi khi gửi tin nhắn:', e);
        }
    };

    const handleSendImage = async (file) => {
        if (!file || !selectedUser) return;
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await uploadImageAPI(formData);
            const msg = {
                text: '[Hình ảnh]',
                imageUrl: data.imageUrl,
                timestamp: new Date().toISOString(),
                sender: 'admin',
                userId: selectedUser._id,
                isAdmin: true,
            };
            await sendMessageAPI(msg);
            emitMessage(msg);
            setMessagesByUser((prev) => ({
                ...prev,
                [selectedUser._id]: [...(prev[selectedUser._id] || []), msg],
            }));
        } catch (e) {
            console.error('Error sending image:', e);
        }
    };

    const handleTypingChange = (val) => {
        if (!selectedUser) return;

        if (val.trim().length > 0) {
            emitTyping({ userId: selectedUser._id, from: 'admin' });
        } else {
            emitStopTyping({ userId: selectedUser._id, from: 'admin' });
        }
    };

    let typingForSelected = false;

    if (selectedUser) {
        const typingState = isTyping[selectedUser._id];
        if (typingState) {
            typingForSelected = true;
        } else {
            typingForSelected = false;
        }
    } else {
        typingForSelected = false;
    }


    return (
        <div className="chat-container-modern">
            <ChatSidebar
                users={users}
                messagesByUser={messagesByUser}
                selectedUser={selectedUser}
                onSelectUser={handleSelectUser}
                isLoading={isLoading}
                error={error}
                onBack={() => navigate('/admin')}
            />

            <div className="chat-main-modern">
                {selectedUser ? (
                    <>
                        <ChatHeader user={selectedUser} />
                        <ChatMessages
                            items={messagesByUser[selectedUser._id] || []}
                            onImageClick={setPreviewImage}
                            endRef={endRef}
                            isTyping={typingForSelected} //truyen flag de render
                        />
                        <ChatInput
                            value={draft}
                            onChange={(val) => { setDraft(val); handleTypingChange(val); }}
                            onSend={handleSendText}
                            onSendImage={handleSendImage}
                        />
                    </>
                ) : (
                    <div className="chat-placeholder-admin">
                        <h3>Chọn một người dùng để bắt đầu chat</h3>
                    </div>
                )}
            </div>

            {previewImage && (
                <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
            )}
        </div>
    );
}
