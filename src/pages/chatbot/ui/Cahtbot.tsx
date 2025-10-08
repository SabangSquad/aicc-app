import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Send, Bot, User, Smile } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// 채팅 인터페이스 컴포넌트 (React Native, Tailwind 클래스 사용 가정)
export function Chatbot() {
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<any>>([
        { id: 'm1', sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', time: '09:00' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const flatRef = useRef<FlatList>(null);

    // 자동 스크롤
    useEffect(() => {
        if (flatRef.current) {
            setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 50);
        }
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: text.trim(), time: getNow() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // simulate bot typing and reply
        setIsTyping(true);
        setTimeout(
            () => {
                const botReply = generateBotReply(text);
                setMessages((prev) => [...prev, { id: `b_${Date.now()}`, sender: 'bot', text: botReply, time: getNow() }]);
                setIsTyping(false);
            },
            1000 + Math.random() * 1000
        );
    };

    const quickReplies = ['주문 상태 확인', '배송 문의', '반품/환불 요청', '교환 신청', '환불 처리 기간'];

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            {/* Header */}
            <View className="flex-row items-center border-b border-neutral-800 px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
                <View className="ml-2">
                    <Text className="text-lg font-semibold text-white">챗봇 상담</Text>
                    <Text className="text-sm text-gray-400">빠른 답변을 원하시면 아래 튜토리얼을 이용하세요</Text>
                </View>
            </View>

            {/* Message list */}
            <FlatList
                ref={flatRef}
                data={[...messages]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View className={`mb-3 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <View
                            className={`${item.sender === 'user' ? 'rounded-tl-xl rounded-tr-sm rounded-bl-xl bg-blue-600 px-4 py-2' : 'rounded-tl-sm rounded-tr-xl rounded-br-xl bg-neutral-800 px-4 py-2'}`}>
                            <Text className="text-white">{item.text}</Text>
                            <Text className="mt-1 text-right text-xs text-gray-400">{item.time}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Typing indicator */}
            {isTyping && (
                <View className="px-4 pb-2">
                    <View className="w-24 rounded-xl bg-neutral-800 px-3 py-2">
                        <Text className="text-gray-300">상담원이 입력하고 있습니다...</Text>
                    </View>
                </View>
            )}

            {/* Quick replies */}
            <View className="border-t border-neutral-800 px-4 py-2">
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={quickReplies}
                    keyExtractor={(i) => i}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => sendMessage(item)} className="mr-2 rounded-full bg-neutral-800 px-4 py-2">
                            <Text className="text-sm text-gray-200">{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Input bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View className="absolute right-0 bottom-4 left-0 px-4">
                    <View className="flex-row items-center">
                        <View className="mr-2 flex-1 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-3">
                            <TouchableOpacity className="mr-2">
                                <Smile color="white" size={18} />
                            </TouchableOpacity>
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="문의 내용을 입력하세요"
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-white"
                                multiline
                            />
                        </View>

                        <TouchableOpacity onPress={() => sendMessage(input)} className="rounded-full bg-blue-600 p-3">
                            <Send color="white" size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// --- helpers ---
function getNow() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

function generateBotReply(userText: string) {
    // 간단한 룰 기반 응답 예시 — 실제로는 API 호출
    const t = userText.toLowerCase();
    if (t.includes('배송')) return '배송 조회를 위해 주문 번호를 알려주세요.';
    if (t.includes('주문')) return '주문 상태는 마이페이지 > 주문내역에서 확인하실 수 있습니다.';
    if (t.includes('반품') || t.includes('환불')) return '반품/환불 접수는 반품 신청 페이지에서 진행됩니다. 도와드릴까요?';
    return '문의하신 내용을 확인했어요. 자세히 알려주시면 도움드리겠습니다.';
}
