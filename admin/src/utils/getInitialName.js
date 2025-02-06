export function getInitials(name) {
    const words = name.trim().split(/\s+/); // Tách tên thành các từ
  
    let initials = "";
  
    if (words.length === 1) {
      initials = words[0][0].toUpperCase(); // Nếu chỉ có 1 từ, lấy ký tự đầu tiên
    } else if (words.length >= 2) {
      initials = words[0][0].toUpperCase(); // Lấy ký tự đầu tiên của từ đầu tiên
  
      initials = initials + words[words.length - 1].slice(0, 1).toUpperCase();
    }
  
    return initials;
  }
  