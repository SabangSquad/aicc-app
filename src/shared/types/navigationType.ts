import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
    home: undefined;
    customer: undefined;
    cart: undefined;
    my: undefined;
};

export type RootStackParamList = {
    'chat-bot': undefined;
    'voice-bot': undefined;
};

// Tab과 Stack을 모두 사용하는 복합 네비게이션 타입
export type RootNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList>,
    BottomTabNavigationProp<TabParamList>
>;

// 또는 간단하게
export type NavigationType = NativeStackNavigationProp<RootStackParamList>;
