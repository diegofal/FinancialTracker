import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../constants/theme';

// Screens
import AccountsReceivableScreen from '../screens/AccountsReceivableScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import StockScreen from '../screens/StockScreen';

const Tab = createMaterialTopTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
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
        name="AccountsReceivable"
        component={AccountsReceivableScreen}
        options={{
          tabBarLabel: 'Cuentas Corriente',
          tabBarIcon: ({ color }) => (
            <Icon name="users" color={color} size={16} />
          ),
        }}
      />
      <Tab.Screen
        name="Invoices"
        component={InvoicesScreen}
        options={{
          tabBarLabel: 'Facturas',
          tabBarIcon: ({ color }) => (
            <IconFA5 name="file-invoice-dollar" color={color} size={16} />
          ),
        }}
      />
      <Tab.Screen
        name="Stock"
        component={StockScreen}
        options={{
          tabBarLabel: 'Stock',
          tabBarIcon: ({ color }) => (
            <IconFA5 name="box-open" color={color} size={16} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
