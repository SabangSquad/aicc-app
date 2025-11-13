import { StatusBar } from 'expo-status-bar';
import { RootNavigation } from '@/app';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#222222' }} edges={['top', 'left', 'right']}>
                <RootNavigation />
                <StatusBar style="light" backgroundColor="#222222" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
