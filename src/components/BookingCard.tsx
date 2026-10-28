import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { Booking } from '../types';
import { formatHourRange, formatMoney } from '../utils/format';

interface Props {
  booking: Booking;
  pricePerHour: number;
  onCancel: () => void;
}

export default function BookingCard({ booking, pricePerHour, onCancel }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{booking.customerName}</Text>
        <Pressable
          onPress={onCancel}
          hitSlop={8}
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
          <Text style={styles.cancelText}>Huỷ</Text>
        </Pressable>
      </View>

      <Text style={styles.info}>{booking.phone}</Text>
      <Text style={styles.info}>
        {booking.date} · {formatHourRange(booking.startHour, booking.hours)}
      </Text>
      <Text style={styles.total}>{formatMoney(pricePerHour * booking.hours)} đ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  cancel: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  cancelText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.danger,
  },
  pressed: {
    opacity: 0.75,
  },
  info: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  total: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
});
