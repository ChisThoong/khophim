

/**
 * Loại bỏ thẻ HTML và decode một số HTML entities phổ biến
 * @param str input string
 * @returns string đã làm sạch
 */
export function cleanText(str: string): string {
    if (!str) return "";
  
    // Loại bỏ tất cả thẻ HTML
    let text = str.replace(/<\/?[^>]+(>|$)/g, "");
  
    // Decode một số entity phổ biến
    const entities: Record<string, string> = {
      "&#8211;": "–",
      "&amp;": "&",
      "&nbsp;": " ",
      "&quot;": '"',
      "&lt;": "<",
      "&gt;": ">",
      "&apos;": "'",
    };
  
    Object.entries(entities).forEach(([entity, char]) => {
      text = text.replaceAll(entity, char);
    });
  
    return text.trim();
  }
  