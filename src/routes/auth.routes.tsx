import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/signin';
import SignUp from '../pages/signup';

const Auth = createStackNavigator();

export const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
    initialRouteName="SignIn">
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
