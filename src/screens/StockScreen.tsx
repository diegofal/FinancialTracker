import React from 'react';
import { StyleSheet, View } from 'react-native';
import StockTabs from '../navigation/StockTabs';
import theme from '../constants/theme';

const StockScreen = () => {
  return (
    <View style={styles.container}>
      <StockTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  }
});

export default StockScreen;
