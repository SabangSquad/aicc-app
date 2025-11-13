import { Text, View, TouchableOpacity } from 'react-native';
import {
    Package,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    Bell,
    CreditCard,
    MapPin,
    FileText,
    HelpCircle,
    Shield,
} from 'lucide-react-native';
import { Header } from '@/widgets/header/ui/Header';
import { Layout } from '@/shared/ui/Layout';

export function My() {
    const orderStats = [
        { id: 1, label: '배송준비', count: 2, color: '#3B82F6' },
        { id: 2, label: '배송중', count: 1, color: '#A855F7' },
        { id: 3, label: '배송완료', count: 5, color: '#22C55E' },
        { id: 4, label: '취소/반품', count: 0, color: '#EF4444' },
    ];

    const menuSections = [
        {
            title: '쇼핑 정보',
            items: [
                { icon: <Package color="white" size={22} />, title: '주문 내역', subtitle: '구매한 상품 확인' },
                { icon: <Heart color="white" size={22} />, title: '찜한 상품', subtitle: '관심 상품 모아보기' },
                { icon: <FileText color="white" size={22} />, title: '상품 리뷰', subtitle: '작성한 리뷰 관리' },
            ],
        },
        {
            title: '혜택 관리',
            items: [
                { icon: <CreditCard color="white" size={22} />, title: '쿠폰', subtitle: '보유 쿠폰 확인' },
                { icon: <Bell color="white" size={22} />, title: '알림 설정', subtitle: '푸시 알림 관리' },
            ],
        },
        {
            title: '계정 설정',
            items: [
                { icon: <MapPin color="white" size={22} />, title: '배송지 관리', subtitle: '배송 주소 추가/수정' },
                { icon: <Shield color="white" size={22} />, title: '개인정보 보호', subtitle: '보안 및 개인정보' },
                { icon: <HelpCircle color="white" size={22} />, title: '고객 센터', subtitle: '문의 및 도움말' },
                { icon: <Settings color="white" size={22} />, title: '설정', subtitle: '앱 설정 및 관리' },
            ],
        },
    ];

    return (
        <Layout>
            <Header text="마이" />
            <View className="rounded-2xl bg-neutral-800 px-6 pt-12 pb-6">
                <View className="mb-6 flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center">
                        <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                            <Text className="text-xl font-bold text-white">홍</Text>
                        </View>
                        <View>
                            <Text className="mb-1 text-xl font-bold text-white">홍길동</Text>
                            <Text className="text-sm text-gray-400">user@example.com</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="rounded-full bg-white/10 p-2">
                        <ChevronRight color="white" size={20} />
                    </TouchableOpacity>
                </View>

                {/* 포인트 카드 */}
                <View className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="mb-1 text-xs font-semibold text-white/80">보유 포인트</Text>
                            <Text className="text-2xl font-bold text-white">12,500 P</Text>
                        </View>
                        <TouchableOpacity className="rounded-full bg-white px-5 py-2">
                            <Text className="text-sm font-bold text-blue-600">충전하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 주문 현황 */}
            <View className="py-6">
                <Text className="mb-3 text-xl font-semibold text-white">주문 현황</Text>

                <View className="rounded-2xl bg-neutral-800 p-5">
                    <View className="flex-row justify-around">
                        {orderStats.map((stat) => (
                            <TouchableOpacity key={stat.id} className="items-center">
                                <Text className="mb-1 text-2xl font-bold text-white">{stat.count}</Text>
                                <Text className="text-xs text-gray-400">{stat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* 메뉴 섹션들 */}
            {menuSections.map((section, index) => (
                <View key={index} className="pb-6">
                    <Text className="mb-3 text-xl font-semibold text-white">{section.title}</Text>

                    <View className="overflow-hidden rounded-2xl bg-neutral-800">
                        {section.items.map((item, itemIndex) => (
                            <View key={itemIndex}>
                                <TouchableOpacity className="flex-row items-center px-5 py-4">
                                    <View className="mr-4 h-10 w-10 items-center justify-center">{item.icon}</View>

                                    <View className="flex-1">
                                        <Text className="mb-0.5 text-base font-medium text-white">{item.title}</Text>
                                        <Text className="text-xs text-gray-400">{item.subtitle}</Text>
                                    </View>

                                    <ChevronRight color="#6B7280" size={20} />
                                </TouchableOpacity>

                                {itemIndex < section.items.length - 1 && <View className="mx-5 h-px bg-neutral-700" />}
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            {/* 로그아웃 */}
            <View className="pb-6">
                <TouchableOpacity className="flex-row items-center justify-center rounded-2xl bg-neutral-800 p-4">
                    <LogOut color="#EF4444" size={20} />
                    <Text className="ml-2 text-base font-semibold text-red-500">로그아웃</Text>
                </TouchableOpacity>
            </View>

            {/* 앱 버전 정보 */}
            <View className="items-center pb-8">
                <Text className="mb-1 text-xs text-gray-500">버전 1.0.0</Text>
                <Text className="text-xs text-gray-600">© 2025 Shopping Mall. All rights reserved.</Text>
            </View>
        </Layout>
    );
}
