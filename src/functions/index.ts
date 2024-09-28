export function formatPostDescription(description: string, limit = 100) {
    const cleanText = description.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText.length > limit ? cleanText.substring(0, limit) + "..." : cleanText;
  }