export type FieldType = '5 người' | '7 người';
export type FieldStatus = 'Hoạt động' | 'Bảo trì';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}

export interface Booking {
  id: string;
  fieldId: string;
  customerName: string;
  phone: string;
  date: string;
  startHour: number;
  hours: number;
}

export type RootStackParamList = {
  FieldList: undefined;
  FieldForm: { fieldId?: string };
  FieldDetail: { fieldId: string };
};
