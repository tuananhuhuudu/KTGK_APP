import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { FieldStatus } from '../types';

export default function StatusBadge({ status }: { status: FieldStatus }) {
  const active = status === 'Hoạt động';
  return (
    <View style={[styles.badge, { backgroundColor: active ? colors.active : colors.maintenance }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.card,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
