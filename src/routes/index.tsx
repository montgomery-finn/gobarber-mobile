import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthNavigator from './auth.routes';
import AppNavigator from './app.routes';

import { useAuth } from '../hooks/auth';

export const Routes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
};
