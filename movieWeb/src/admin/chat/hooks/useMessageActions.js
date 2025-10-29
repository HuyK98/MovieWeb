export const formatTime = (ts) => {
  try {
    return new Date(ts).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

export const linkify = (text) => {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return text.replace(urlRegex, (url) => {
    const href = url.startsWith('www') ? `http://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

export const highlightText = (text, keyword) => {
  if (!keyword.trim()) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const processText = (text, keyword) => {
  let processed = linkify(text);
  if (keyword) processed = highlightText(processed, keyword);
  return processed;
};

// download image
export async function downloadImage(url, filename = 'image.jpg') {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}
