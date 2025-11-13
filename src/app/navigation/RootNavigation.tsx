import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Navigation } from './Navigation';
import { Chatbot } from '@/pages/chatbot';
import { VoiceBot } from '@/pages/voicebot';

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#222222',
    },
};
const Stack = createNativeStackNavigator();

export function RootNavigation() {
    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="main" component={Navigation} />
                <Stack.Screen name="chat-bot" component={Chatbot} />
                <Stack.Screen name="voice-bot" component={VoiceBot} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
