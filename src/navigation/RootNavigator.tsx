import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import FieldFormScreen from '../screens/FieldFormScreen';
import FieldListScreen from '../screens/FieldListScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.card,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen
          name="FieldList"
          component={FieldListScreen}
          options={{ title: 'Quản lý sân bóng' }}
        />
        <Stack.Screen name="FieldForm" component={FieldFormScreen} />
        <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
