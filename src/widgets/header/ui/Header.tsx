import { View, Text } from 'react-native';
import { Menu, Search } from 'lucide-react-native';

export function Header({ text = 'AICC' }: { text?: string }) {
    return (
        <View className="my-4 flex flex-row items-center justify-between">
            <Menu color="white" />
            <Text className="text-xl font-semibold text-white">{text}</Text>
            <Search color="white" />
        </View>
    );
}
