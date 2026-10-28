import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { Booking, Field } from '../types';
import { formatMoney } from '../utils/format';
import {
  findConflictBooking,
  validateDate,
  validateEndHour,
  validateHours,
  validatePhone,
  validateStartHour,
} from '../utils/validate';
import AppButton from './AppButton';
import AppInput from './AppInput';

interface Props {
  visible: boolean;
  field: Field;
  bookings: Booking[];
  onClose: () => void;
  onSubmit: (data: Omit<Booking, 'id'>) => void;
}

export default function BookingModal({ visible, field, bookings, onClose, onSubmit }: Props) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState('');
  const [hours, setHours] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const hoursNumber = Number(hours.trim());
  const total =
    Number.isInteger(hoursNumber) && hoursNumber > 0 ? field.pricePerHour * hoursNumber : 0;

  const reset = () => {
    setCustomerName('');
    setPhone('');
    setDate('');
    setStartHour('');
    setHours('');
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const next: Record<string, string | null> = {
      customerName: customerName.trim() ? null : 'Tên khách không được để trống',
      phone: validatePhone(phone),
      date: validateDate(date),
      startHour: validateStartHour(startHour),
      hours: validateHours(hours),
    };

    if (!next.startHour && !next.hours) {
      const start = Number(startHour.trim());
      const duration = Number(hours.trim());
      next.hours = validateEndHour(start, duration);

      if (!next.hours && !next.date) {
        const conflict = findConflictBooking(bookings, field.id, date.trim(), start, duration);
        if (conflict) {
          next.startHour = `Trùng lịch với lượt đặt ${conflict.startHour}h - ${
            conflict.startHour + conflict.hours
          }h`;
        }
      }
    }

    setErrors(next);

    if (Object.values(next).some(Boolean)) {
      return;
    }

    onSubmit({
      fieldId: field.id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      date: date.trim(),
      startHour: Number(startHour.trim()),
      hours: Number(hours.trim()),
    });
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Đặt {field.name}</Text>
              <Pressable
                onPress={handleClose}
                hitSlop={8}
                style={({ pressed }) => pressed && styles.pressed}>
                <Text style={styles.close}>Đóng</Text>
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <AppInput
                label="Tên khách"
                value={customerName}
                onChangeText={text => {
                  setCustomerName(text);
                  setErrors(prev => ({ ...prev, customerName: null }));
                }}
                error={errors.customerName}
                placeholder="Nguyễn Văn A"
              />

              <AppInput
                label="Số điện thoại"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  setErrors(prev => ({ ...prev, phone: null }));
                }}
                error={errors.phone}
                placeholder="0901234567"
                keyboardType="phone-pad"
                maxLength={10}
              />

              <AppInput
                label="Ngày đặt"
                value={date}
                onChangeText={text => {
                  setDate(text);
                  setErrors(prev => ({ ...prev, date: null }));
                }}
                error={errors.date}
                placeholder="dd/mm/yyyy"
                keyboardType="numeric"
                maxLength={10}
              />

              <AppInput
                label="Giờ bắt đầu (6 - 22)"
                value={startHour}
                onChangeText={text => {
                  setStartHour(text);
                  setErrors(prev => ({ ...prev, startHour: null }));
                }}
                error={errors.startHour}
                placeholder="17"
                keyboardType="numeric"
                maxLength={2}
              />

              <AppInput
                label="Số giờ thuê (1 - 3)"
                value={hours}
                onChangeText={text => {
                  setHours(text);
                  setErrors(prev => ({ ...prev, hours: null }));
                }}
                error={errors.hours}
                placeholder="2"
                keyboardType="numeric"
                maxLength={1}
              />

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Thành tiền</Text>
                <Text style={styles.totalValue}>{formatMoney(total)} đ</Text>
              </View>

              <AppButton title="Xác nhận đặt sân" onPress={handleSubmit} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    maxHeight: '90%',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  close: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  totalLabel: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
});
