import { ChevronRight } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { frequentlyAskedQuestions } from '../model/frequentlyAskedQuestions';

export function FrequentlyAskedQuestions() {
    return (
        <View className="mb-6">
            <Text className="mb-2 text-lg font-semibold text-white">자주 묻는 질문</Text>
            {frequentlyAskedQuestions.map((item) => (
                <TouchableOpacity key={item.id} className="mb-2 flex-row items-center justify-between rounded-xl bg-neutral-800 p-4">
                    <Text className="text-white">{item.question}</Text>
                    <ChevronRight color="gray" size={18} />
                </TouchableOpacity>
            ))}
        </View>
    );
}
