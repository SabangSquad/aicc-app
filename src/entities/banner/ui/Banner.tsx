import { Text, View } from 'react-native';

export function Banner() {
    const page = 8;
    const current = 1;

    return (
        <View className="relative h-72 overflow-hidden rounded-2xl bg-[#3E5641]">
            <View className="flex-1 justify-center p-8">
                {/* 상단 라인 */}
                <View className="mb-6 h-0.5 w-12 bg-amber-500" />
                <Text className="mb-3 text-sm font-semibold tracking-widest text-amber-500">EXCLUSIVE COLLECTION</Text>
                <Text className="mb-4 text-4xl leading-tight font-bold text-white">럭셔리{'\n'}라이프스타일</Text>
                <Text className="mb-8 max-w-[70%] text-base text-gray-400">프리미엄 브랜드의 특별한 컬렉션을 만나보세요</Text>
            </View>

            {/* 장식 박스 */}
            <View className="absolute right-8 bottom-8 h-24 w-24 border-2 border-amber-500/30" />
            <View className="absolute right-12 bottom-12 h-24 w-24 border-2 border-amber-500/20" />

            {/* 페이지 인디케이터 */}
            <View className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1.5">
                <Text className="text-xs font-medium text-white">
                    {current} / {page}
                </Text>
            </View>
        </View>
    );
}
