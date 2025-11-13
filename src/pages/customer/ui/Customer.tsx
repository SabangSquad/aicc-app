import { View, Text, TouchableOpacity } from 'react-native';
import { MessageSquare, Bot, PhoneCall, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/ui/Layout';
import { Header } from '@/widgets/header/ui/Header';
import { NavigationType } from '@/shared/types/navigationType';

export function Customer() {
    const navigation = useNavigation<NavigationType>();

    const faqList = [
        { id: 1, question: '주문 내역은 어디서 확인하나요?' },
        { id: 2, question: '배송은 얼마나 걸리나요?' },
        { id: 3, question: '반품/교환은 어떻게 하나요?' },
    ];

    return (
        <Layout>
            <Header text="고객센터" />
            <View className="mb-6 rounded-2xl bg-neutral-800 p-5">
                <Text className="mb-2 text-xl font-bold text-white">무엇을 도와드릴까요?</Text>
                <Text className="text-sm text-gray-400">자주 묻는 질문을 확인하거나, 챗봇/보이스봇으로 빠르게 문의하세요.</Text>
            </View>

            {/* 주요 기능 버튼 */}

            {/* 자주 묻는 질문 */}
            <View className="mb-6">
                <Text className="mb-2 text-xl font-semibold text-white">자주 묻는 질문</Text>
                {faqList.map((item) => (
                    <TouchableOpacity key={item.id} className="mb-2 flex-row items-center justify-between rounded-xl bg-neutral-800 p-4">
                        <Text className="text-white">{item.question}</Text>
                        <ChevronRight color="gray" size={18} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* 1:1 문의 */}
            <View>
                <Text className="mb-2 text-xl font-semibold text-white">1:1 문의</Text>
                <View className="mb-6 flex-row justify-between">
                    <TouchableOpacity
                        className="mx-1 flex-1 items-center rounded-2xl bg-neutral-800 p-4"
                        onPress={() => navigation.navigate('chat-bot')}>
                        <Bot color="white" size={28} />
                        <Text className="mt-2 font-semibold text-white">챗봇 상담</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mx-1 flex-1 items-center rounded-2xl bg-neutral-800 p-4"
                        onPress={() => navigation.navigate('voice-bot')}>
                        <PhoneCall color="white" size={28} />
                        <Text className="mt-2 font-semibold text-white">보이스봇 상담</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-xl bg-neutral-800 p-4">
                    <View className="flex-row items-center">
                        <MessageSquare color="white" size={22} />
                        <Text className="ml-2 font-medium text-white">나의 문의내역</Text>
                    </View>
                    <ChevronRight color="gray" size={18} />
                </TouchableOpacity>
            </View>
            <View>
                <Text className="mb-2 text-xl font-semibold text-white">운영시간</Text>
                <View className="mb-6 rounded-2xl bg-neutral-800 p-4">
                    <Text className="mb-1 font-semibold text-white">상담원</Text>
                    <Text className="mb-2 text-sm text-gray-400">평일 09:00 - 18:00 (주말/공휴일 휴무)</Text>
                    <Text className="mb-1 font-semibold text-white">챗봇/보이스봇</Text>
                    <Text className="mb-2 text-sm text-gray-400">연중무휴 24시간 상담가능</Text>
                    <Text className="mb-1 font-semibold text-white">고객센터 전화</Text>
                    <Text className="text-sm text-gray-400">📞 1588-0000</Text>
                </View>
            </View>
        </Layout>
    );
}
