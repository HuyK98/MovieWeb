/**
 * Chuan hoa text: bo dau, lowercase, trim
 * @param {string} text - text can chuan hoa
 * @returns {string} - text da chuan hoa
 */

export const normalize = (text = '') => {
    return text
        .toString()
        .normalize('NFD')                    // Tách dấu thanh
        .replace(/[\u0300-\u036f]/g, '')     // Xóa dấu
        .toLowerCase()                        // Chữ thường
        .trim();                              // Xóa khoảng trắng 2 đầu
};

/**
 * Truncate text với length tối đa
 * @param {string} text - Text cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Text đã cắt + '...'
 */

export const truncate = (text = '', maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * kiem tra text co chua keyword (bo dau, khong phan biet hoa thuong, loai bo khoang trang)
 * @param {string} text - Text cần check
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {boolean}
 */

export const searchMatch = (text = '', keyword = '') => {
    if (!keyword.trim()) return true;
    return normalize(text).includes(normalize(keyword));
};