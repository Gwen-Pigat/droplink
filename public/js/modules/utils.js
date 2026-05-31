/**
 * Utility: Format bytes to human readable format
 * @param {number} bytes Size in bytes
 * @param {number} decimals Decimal precision
 * @returns {string} Formatted size (e.g. 10.25 Mo)
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Octets';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Utility: Map file extensions to suitable Font Awesome icon classes
 * @param {string} filename Original filename
 * @returns {string} Font Awesome class (e.g. fa-file-pdf)
 */
export function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return 'fa-file-pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp': return 'fa-file-image';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z': return 'fa-file-zipper';
    case 'doc':
    case 'docx': return 'fa-file-word';
    case 'xls':
    case 'xlsx': return 'fa-file-excel';
    case 'mp3':
    case 'wav':
    case 'ogg': return 'fa-file-audio';
    case 'mp4':
    case 'mov':
    case 'avi': return 'fa-file-video';
    case 'txt':
    case 'md': return 'fa-file-lines';
    default: return 'fa-file';
  }
}
