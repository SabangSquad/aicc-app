import { StatusBar } from 'expo-status-bar';

import './global.css';
import { Navigation } from '@/widgets';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#222222',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#222222' }}
          edges={['top', 'left', 'right']}>
          <Navigation />
          <StatusBar style="light" backgroundColor="#222222" />
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
