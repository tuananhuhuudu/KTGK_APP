import { Booking } from '../types';

export function isOverlapped(
  startA: number,
  hoursA: number,
  startB: number,
  hoursB: number,
): boolean {
  return startA < startB + hoursB && startB < startA + hoursA;
}

export function findConflictBooking(
  bookings: Booking[],
  fieldId: string,
  date: string,
  startHour: number,
  hours: number,
): Booking | undefined {
  return bookings.find(
    b =>
      b.fieldId === fieldId &&
      b.date === date &&
      isOverlapped(startHour, hours, b.startHour, b.hours),
  );
}

export function validatePhone(phone: string): string | null {
  const value = phone.trim();
  if (!value) {
    return 'Số điện thoại không được để trống';
  }
  if (!/^0\d{9}$/.test(value)) {
    return 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0';
  }
  return null;
}

export function validateDate(date: string): string | null {
  const value = date.trim();
  if (!value) {
    return 'Ngày không được để trống';
  }
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return 'Ngày phải có định dạng dd/mm/yyyy';
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getDate() !== day ||
    parsed.getMonth() !== month - 1 ||
    parsed.getFullYear() !== year
  ) {
    return 'Ngày không tồn tại';
  }
  return null;
}

export function validateStartHour(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return 'Giờ bắt đầu không được để trống';
  }
  const hour = Number(value);
  if (!Number.isInteger(hour)) {
    return 'Giờ bắt đầu phải là số nguyên';
  }
  if (hour < 6 || hour > 22) {
    return 'Giờ bắt đầu phải từ 6 đến 22';
  }
  return null;
}

export function validateHours(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return 'Số giờ thuê không được để trống';
  }
  const hours = Number(value);
  if (!Number.isInteger(hours)) {
    return 'Số giờ thuê phải là số nguyên';
  }
  if (hours < 1 || hours > 3) {
    return 'Số giờ thuê phải từ 1 đến 3';
  }
  return null;
}

export function validateEndHour(startHour: number, hours: number): string | null {
  if (startHour + hours > 23) {
    return 'Giờ kết thúc không được quá 23h';
  }
  return null;
}

export function validateFieldName(name: string, duplicated: boolean): string | null {
  if (!name.trim()) {
    return 'Tên sân không được để trống';
  }
  if (duplicated) {
    return 'Tên sân đã tồn tại';
  }
  return null;
}

export function validatePrice(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return 'Giá thuê không được để trống';
  }
  const price = Number(value);
  if (Number.isNaN(price)) {
    return 'Giá thuê phải là số';
  }
  if (price <= 0) {
    return 'Giá thuê phải lớn hơn 0';
  }
  return null;
}
