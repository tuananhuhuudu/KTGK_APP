import { Booking, Field } from '../types';

export const seedFields: Field[] = [
  { id: 'f1', name: 'Sân A1', type: '5 người', pricePerHour: 300000, status: 'Hoạt động' },
  { id: 'f2', name: 'Sân A2', type: '5 người', pricePerHour: 350000, status: 'Hoạt động' },
  { id: 'f3', name: 'Sân B1', type: '7 người', pricePerHour: 500000, status: 'Hoạt động' },
  { id: 'f4', name: 'Sân B2', type: '7 người', pricePerHour: 550000, status: 'Bảo trì' },
];

export const seedBookings: Booking[] = [
  {
    id: 'b1',
    fieldId: 'f1',
    customerName: 'Nguyễn Văn An',
    phone: '0901234567',
    date: '28/10/2026',
    startHour: 17,
    hours: 2,
  },
  {
    id: 'b2',
    fieldId: 'f1',
    customerName: 'Trần Bình',
    phone: '0912345678',
    date: '28/10/2026',
    startHour: 19,
    hours: 1,
  },
  {
    id: 'b3',
    fieldId: 'f3',
    customerName: 'Lê Cường',
    phone: '0987654321',
    date: '29/10/2026',
    startHour: 18,
    hours: 2,
  },
];
