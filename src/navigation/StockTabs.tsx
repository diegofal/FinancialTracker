import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import theme from '../constants/theme';

// Screens
import CurrentStockScreen from '../screens/CurrentStockScreen';
import DiscontinuedStockScreen from '../screens/DiscontinuedStockScreen';

const Tab = createMaterialTopTabNavigator();

const StockTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.light,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none',
        },
      }}
    >
      <Tab.Screen
        name="CurrentStock"
        component={CurrentStockScreen}
        options={{
          tabBarLabel: 'Actual',
        }}
      />
      <Tab.Screen
        name="DiscontinuedStock"
        component={DiscontinuedStockScreen}
        options={{
          tabBarLabel: 'Discontinuado',
        }}
      />
    </Tab.Navigator>
  );
};

export default StockTabs;
