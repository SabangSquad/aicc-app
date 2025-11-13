import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Layout } from '@/shared/ui/Layout';
import { Header } from '@/widgets/header';

export function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: '프리미엄 가을 니트',
            price: 89000,
            quantity: 1,
            image: '🧥',
            option: '블랙 / M',
        },
        {
            id: 2,
            name: '데님 와이드 팬츠',
            price: 65000,
            quantity: 2,
            image: '👖',
            option: '라이트블루 / L',
        },
        {
            id: 3,
            name: '레더 크로스백',
            price: 120000,
            quantity: 1,
            image: '👜',
            option: '브라운',
        },
    ]);

    const updateQuantity = (id: number, change: number) => {
        setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)));
    };

    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = totalAmount >= 50000 ? 0 : 3000;
    const discount = 10000;
    const finalAmount = totalAmount + shippingFee - discount;

    return (
        <View className="flex-1 bg-[#222222] px-4">
            {/* 헤더 */}
            <Header text="장바구니" />

            {cartItems.length === 0 ? (
                // 빈 장바구니
                <View className="flex-1 items-center justify-center px-6">
                    <ShoppingBag color="#6B7280" size={64} />
                    <Text className="mt-4 mb-2 text-lg font-semibold text-gray-400">장바구니가 비어있습니다</Text>
                    <Text className="mb-6 text-center text-sm text-gray-500">마음에 드는 상품을 담아보세요</Text>
                    <TouchableOpacity className="rounded-full bg-blue-600 px-8 py-3">
                        <Text className="text-base font-bold text-white">쇼핑 시작하기</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* 상품 리스트 - flex-1로 나머지 공간 차지 */}
                    <ScrollView className="flex-1 px-6 py-4">
                        {/* 전체 선택 */}
                        <View className="mb-4 flex-row items-center justify-between">
                            <TouchableOpacity className="flex-row items-center">
                                <View className="mr-2 h-5 w-5 items-center justify-center rounded border-2 border-gray-500 bg-blue-600">
                                    <Text className="text-xs font-bold text-white">✓</Text>
                                </View>
                                <Text className="font-medium text-white">전체 선택 ({cartItems.length})</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text className="text-sm text-gray-400">선택 삭제</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 장바구니 아이템들 */}
                        {cartItems.map((item) => (
                            <View key={item.id} className="mb-3 rounded-2xl bg-neutral-800 p-4">
                                <View className="flex-row">
                                    {/* 체크박스 */}
                                    <TouchableOpacity className="mr-3 pt-1">
                                        <View className="h-5 w-5 items-center justify-center rounded border-2 border-gray-500 bg-blue-600">
                                            <Text className="text-xs font-bold text-white">✓</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* 상품 이미지 */}
                                    <View className="mr-3 h-24 w-24 items-center justify-center rounded-xl bg-neutral-700">
                                        <Text className="text-5xl">{item.image}</Text>
                                    </View>

                                    {/* 상품 정보 */}
                                    <View className="flex-1">
                                        <View className="mb-1 flex-row justify-between">
                                            <Text className="flex-1 text-base font-semibold text-white">{item.name}</Text>
                                            <TouchableOpacity onPress={() => removeItem(item.id)}>
                                                <Trash2 color="#EF4444" size={18} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text className="mb-2 text-xs text-gray-400">{item.option}</Text>

                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-lg font-bold text-white">{item.price.toLocaleString()}원</Text>

                                            {/* 수량 조절 */}
                                            <View className="flex-row items-center rounded-lg bg-neutral-700">
                                                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="p-2">
                                                    <Minus color="white" size={16} />
                                                </TouchableOpacity>
                                                <Text className="px-3 font-semibold text-white">{item.quantity}</Text>
                                                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="p-2">
                                                    <Plus color="white" size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {/* 쿠폰 적용 */}
                        <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-2xl bg-neutral-800 p-4">
                            <View className="flex-row items-center">
                                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                                    <Tag color="#3B82F6" size={20} />
                                </View>
                                <View>
                                    <Text className="mb-0.5 font-semibold text-white">쿠폰 적용</Text>
                                    <Text className="text-xs text-gray-400">사용 가능한 쿠폰 3장</Text>
                                </View>
                            </View>
                            <ChevronRight color="#6B7280" size={20} />
                        </TouchableOpacity>

                        {/* 가격 정보 */}
                        <View className="mb-4 rounded-2xl bg-neutral-800 p-5">
                            <Text className="mb-4 text-lg font-bold text-white">결제 예정 금액</Text>

                            <View className="space-y-3">
                                <View className="mb-2 flex-row justify-between">
                                    <Text className="text-gray-400">상품 금액</Text>
                                    <Text className="font-medium text-white">{totalAmount.toLocaleString()}원</Text>
                                </View>

                                <View className="mb-2 flex-row justify-between">
                                    <Text className="text-gray-400">배송비</Text>
                                    <Text className="font-medium text-white">
                                        {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                                    </Text>
                                </View>

                                <View className="mb-3 flex-row justify-between">
                                    <Text className="text-gray-400">할인 금액</Text>
                                    <Text className="font-medium text-red-500">-{discount.toLocaleString()}원</Text>
                                </View>

                                <View className="my-3 h-px bg-neutral-700" />

                                <View className="flex-row justify-between">
                                    <Text className="text-lg font-bold text-white">총 결제 금액</Text>
                                    <Text className="text-xl font-bold text-blue-500">{finalAmount.toLocaleString()}원</Text>
                                </View>
                            </View>

                            {shippingFee > 0 && (
                                <View className="mt-4 rounded-lg bg-blue-600/10 p-3">
                                    <Text className="text-center text-xs text-blue-400">
                                        💡 {(50000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* 하단 주문 버튼 - 고정 */}
                    <View className="">
                        <View className="mb-3 flex-row items-center justify-between">
                            <Text className="text-sm text-gray-400">총 {cartItems.length}개</Text>
                            <View className="flex-row items-baseline">
                                <Text className="mr-1 text-xl font-bold text-white">{finalAmount.toLocaleString()}</Text>
                                <Text className="text-base text-white">원</Text>
                            </View>
                        </View>

                        <TouchableOpacity className="items-center rounded-2xl bg-blue-600 py-4">
                            <Text className="text-lg font-bold text-white">주문하기</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
