import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { Field } from '../types';
import { formatPrice } from '../utils/format';
import StatusBadge from './StatusBadge';

interface Props {
  field: Field;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FieldCard({ field, onPress, onEdit, onDelete }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.name}>{field.name}</Text>
        <StatusBadge status={field.status} />
      </View>

      <Text style={styles.type}>{field.type}</Text>
      <Text style={styles.price}>{formatPrice(field.pricePerHour)}</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.editText}>Sửa</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.deleteText}>Xoá</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  type: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  price: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.md,
  },
  action: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  editText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.danger,
  },
});
