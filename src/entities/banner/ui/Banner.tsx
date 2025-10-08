import { Text, View } from 'react-native';

export function Banner() {
    const page = 8;
    const current = 1;
    return (
        <View className="relative h-72 overflow-hidden rounded-lg bg-zinc-400">
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-semibold">배너배너</Text>
            </View>

            <Text className="absolute top-2 right-3 rounded-full bg-black/50 px-2 py-1 text-sm text-white">
                {current} / {page}
            </Text>
        </View>
    );
}
