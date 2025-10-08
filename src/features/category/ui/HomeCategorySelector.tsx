import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { categories } from '../model/categories';

export function HomeCategorySelector() {
    const [selected, setSelected] = useState<string>('상의');
    const [selectedSub, setSelectedSub] = useState<string>('전체');

    const currentSubCategories = categories.find((c) => c.name === selected)?.sub || [];

    return (
        <View className="my-4">
            {/* 1차 카테고리 */}
            <View className="flex-row items-center justify-center gap-6">
                {categories.map((category) => {
                    const isSelected = selected === category.name;
                    return (
                        <TouchableOpacity
                            key={category.name}
                            onPress={() => {
                                setSelected(category.name);
                                setSelectedSub('전체');
                            }}>
                            <Text
                                className={`text-base font-semibold ${
                                    isSelected ? 'border-b-2 border-white text-white' : 'text-zinc-500'
                                }`}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 2차 카테고리 */}
            <View className="mt-4 px-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center justify-center gap-2">
                        {currentSubCategories.map((sub) => {
                            return (
                                <TouchableOpacity key={sub} onPress={() => setSelectedSub(sub)}>
                                    <Text
                                        className={`rounded-lg px-3 py-2 text-sm ${selectedSub === sub ? 'bg-white' : 'bg-zinc-700 text-zinc-500'}`}>
                                        {sub}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
