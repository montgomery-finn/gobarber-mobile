import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../pages/profile';
import AppointmentCreated from '../pages/appointmentCreated';
import CreateAppointment from '../pages/createAppointment';
import Dashboard from '../pages/dashboard';

const App = createStackNavigator();

export const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
    initialRouteName="Dashboard">
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />

    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
