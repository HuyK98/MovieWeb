/**
 * kiem tra user co dang typing khong
 * @param {Object} typingState - Object typing state { userId: true/false }
 * @param {string} userId - ID user can check
 * @returns {boolean}
 */

export const isUserTyping = (typingState = {}, userId) => {
    if (!userId) return false;
    return !!typingState[userId];
};

/**
 * create message object chuan
 * @param {Object} params 
 * @returns {Object}
 */

export const createMessage = ({
    text = '',
    imageUrl = null,
    cloudinaryId = null,
    sender = 'unknown',
    userId,
    isAdmin = false,
    timestamp = new Date().toISOString(),
}) => {
    return {
        text,
        imageUrl,
        cloudinaryId,
        sender,
        userId,
        isAdmin,
        timestamp,
    };
};

/**
 * Filter messages theo search term
 * @param {Array} messages - Danh sách messages
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Array} - Messages đã filter
 */

export const filterMessages = (messages = [], searchTerm = '') => {
    if (!searchTerm.trim()) return messages;

    return messages.filter(msg => {
        const text = (msg.text || '').toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });
};

/**
 * Sắp xếp users theo last message timestamp
 * @param {Array} users - Danh sách users
 * @returns {Array} - Users đã sắp xếp
 */

export const sortUsersByLastMessage = (users = []) => {
    return [...users].sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
};