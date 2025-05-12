/**
 * Entry point for the React Native Financial & Inventory Dashboard application
 */
import { AppRegistry } from 'react-native';
import App from './App';

// Register the application
AppRegistry.registerComponent('main', () => App);

// For web support
if (module.hot) {
  module.hot.accept();
}

// Ensure the app is visible on the right port
export default App;
