export function formatMoney(value: number): string {
  return value.toLocaleString('vi-VN').replace(/,/g, '.');
}

export function formatPrice(value: number): string {
  return `${formatMoney(value)} đ/giờ`;
}

export function formatHourRange(startHour: number, hours: number): string {
  return `${startHour}h - ${startHour + hours}h`;
}
