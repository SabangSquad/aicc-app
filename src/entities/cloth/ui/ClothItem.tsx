import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ClothItem({ item }: { item: any }) {
    const imageUrl = 'https://picsum.photos/200/300'; // 예시 이미지 URL

    return (
        <View className="m-0.5 h-60 flex-1 overflow-hidden rounded-lg shadow-md">
            <ImageBackground source={{ uri: imageUrl }} className="h-full w-full justify-between" resizeMode="cover">
                <View className="flex flex-row gap-1 p-1">
                    <Text className="rounded-lg bg-amber-500 px-1 py-0.5 text-xs font-semibold text-white">{item.category}</Text>
                    <Text className="rounded-lg bg-red-500 px-1 py-0.5 text-xs font-semibold text-white">{item.subCategory}</Text>
                </View>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,1)']} style={{ height: '40%', padding: 8, justifyContent: 'flex-end' }}>
                    <View className="p-1">
                        <Text className="text-xs text-zinc-300">{item.brand}</Text>
                        <Text className="text-sm font-semibold text-white" numberOfLines={2} ellipsizeMode="tail">
                            {item.name}
                        </Text>

                        <View className="mt-1 flex-row items-center">
                            {item.discountRate > 0 && <Text className="mr-1 text-xs font-bold text-red-400">{item.discountRate}%</Text>}
                            <Text className="text-sm font-semibold text-white">{item.discountPrice.toLocaleString()}원</Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}
