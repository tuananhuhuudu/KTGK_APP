import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Booking, Field } from '../types';
import { loadData, saveBookings, saveFields } from '../storage/storage';

interface AppContextValue {
  fields: Field[];
  bookings: Booking[];
  loading: boolean;
  addField: (data: Omit<Field, 'id'>) => void;
  updateField: (id: string, data: Omit<Field, 'id'>) => void;
  deleteField: (id: string) => void;
  addBooking: (data: Omit<Booking, 'id'>) => void;
  deleteBooking: (id: string) => void;
  getField: (id: string) => Field | undefined;
  getBookingsOfField: (fieldId: string) => Booking[];
  isNameDuplicated: (name: string, excludeId?: string) => boolean;
  hasBooking: (fieldId: string) => boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then(data => {
      setFields(data.fields);
      setBookings(data.bookings);
      setLoading(false);
    });
  }, []);

  const commitFields = useCallback((next: Field[]) => {
    setFields(next);
    saveFields(next);
  }, []);

  const commitBookings = useCallback((next: Booking[]) => {
    setBookings(next);
    saveBookings(next);
  }, []);

  const addField = useCallback(
    (data: Omit<Field, 'id'>) => {
      commitFields([...fields, { ...data, id: createId() }]);
    },
    [fields, commitFields],
  );

  const updateField = useCallback(
    (id: string, data: Omit<Field, 'id'>) => {
      commitFields(fields.map(f => (f.id === id ? { ...data, id } : f)));
    },
    [fields, commitFields],
  );

  const deleteField = useCallback(
    (id: string) => {
      commitFields(fields.filter(f => f.id !== id));
    },
    [fields, commitFields],
  );

  const addBooking = useCallback(
    (data: Omit<Booking, 'id'>) => {
      commitBookings([...bookings, { ...data, id: createId() }]);
    },
    [bookings, commitBookings],
  );

  const deleteBooking = useCallback(
    (id: string) => {
      commitBookings(bookings.filter(b => b.id !== id));
    },
    [bookings, commitBookings],
  );

  const getField = useCallback((id: string) => fields.find(f => f.id === id), [fields]);

  const getBookingsOfField = useCallback(
    (fieldId: string) => bookings.filter(b => b.fieldId === fieldId),
    [bookings],
  );

  const isNameDuplicated = useCallback(
    (name: string, excludeId?: string) =>
      fields.some(
        f => f.id !== excludeId && f.name.trim().toLowerCase() === name.trim().toLowerCase(),
      ),
    [fields],
  );

  const hasBooking = useCallback(
    (fieldId: string) => bookings.some(b => b.fieldId === fieldId),
    [bookings],
  );

  const value = useMemo(
    () => ({
      fields,
      bookings,
      loading,
      addField,
      updateField,
      deleteField,
      addBooking,
      deleteBooking,
      getField,
      getBookingsOfField,
      isNameDuplicated,
      hasBooking,
    }),
    [
      fields,
      bookings,
      loading,
      addField,
      updateField,
      deleteField,
      addBooking,
      deleteBooking,
      getField,
      getBookingsOfField,
      isNameDuplicated,
      hasBooking,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp phải được dùng bên trong AppProvider');
  }
  return ctx;
}
