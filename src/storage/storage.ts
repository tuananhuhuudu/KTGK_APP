import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Field } from '../types';
import { seedBookings, seedFields } from './seed';

const FIELDS_KEY = '@football:fields';
const BOOKINGS_KEY = '@football:bookings';

export async function loadData(): Promise<{ fields: Field[]; bookings: Booking[] }> {
  const [rawFields, rawBookings] = await Promise.all([
    AsyncStorage.getItem(FIELDS_KEY),
    AsyncStorage.getItem(BOOKINGS_KEY),
  ]);

  if (rawFields === null || rawBookings === null) {
    await Promise.all([
      AsyncStorage.setItem(FIELDS_KEY, JSON.stringify(seedFields)),
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(seedBookings)),
    ]);
    return { fields: seedFields, bookings: seedBookings };
  }

  return {
    fields: JSON.parse(rawFields),
    bookings: JSON.parse(rawBookings),
  };
}

export async function saveFields(fields: Field[]): Promise<void> {
  await AsyncStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}
