export function whatsappUrl(dial: string, message: string): string {
  return `https://wa.me/${dial}?text=${encodeURIComponent(message)}`;
}
