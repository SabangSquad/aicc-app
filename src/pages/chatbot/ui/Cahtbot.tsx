// src/pages/customer/ui/Chatbot.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, Keyboard } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationType } from '@/shared/types/navigationType';

export function Chatbot() {
    const navigation = useNavigation<NavigationType>();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{ id: 'm1', sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', time: '09:00' }]);
    const [isTyping, setIsTyping] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const quickReplies = ['주문 상태 확인', '배송 문의', '반품/환불 요청', '교환 신청', '환불 처리 기간'];

    // 키보드 이벤트 리스너
    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // 키보드가 나타날 때 스크롤
    useEffect(() => {
        if (keyboardHeight > 0) {
            setTimeout(() => {
                flatRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [keyboardHeight]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: text.trim(), time: getNow() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');

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

    // 메시지 추가 시 자동 스크롤
    useEffect(() => {
        flatRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

    return (
        <View className="flex-1">
            {/* Header - 키보드 영향 안받음 */}
            <View className="flex-row items-center border-b border-zinc-700 px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
                <View className="ml-2">
                    <Text className="text-lg font-semibold text-white">챗봇 상담</Text>
                    <Text className="text-sm text-gray-400">빠른 답변을 원하시면 아래 튜토리얼을 이용하세요</Text>
                </View>
            </View>

            {/* Message List */}
            <FlatList
                ref={flatRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 16,
                }}
                onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                    <View className={`mb-2 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <View
                            className={`max-w-[80%] px-4 py-2 ${
                                item.sender === 'user'
                                    ? 'rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-xl bg-blue-600'
                                    : 'rounded-tl-sm rounded-tr-xl rounded-br-xl rounded-bl-xl bg-zinc-700'
                            }`}>
                            <Text className="text-white">{item.text}</Text>
                            <Text className="mt-1 text-right text-xs text-gray-400">{item.time}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Typing Indicator */}
            {isTyping && (
                <View className="px-4 pb-2">
                    <View className="w-48 rounded-xl bg-zinc-700 px-3 py-2">
                        <Text className="text-sm text-gray-300">상담원이 입력하고 있습니다...</Text>
                    </View>
                </View>
            )}

            {/* Quick Replies + Input - 키보드 높이만큼 하단 마진 */}
            <View className="px-4 py-2" style={{ marginBottom: keyboardHeight }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={quickReplies}
                    keyExtractor={(i) => i}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => sendMessage(item)} className="mr-2 rounded-full bg-zinc-700 px-4 py-2">
                            <Text className="text-sm text-gray-200">{item}</Text>
                        </TouchableOpacity>
                    )}
                    className="mb-2"
                />

                {/* Input Bar */}
                <View className="my-4 flex-row items-center">
                    <View className="mr-2 flex-1 flex-row items-center rounded-2xl bg-zinc-700 px-4 py-2">
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="문의 내용을 입력하세요"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-white"
                            multiline
                        />
                        <TouchableOpacity onPress={() => sendMessage(input)}>
                            <Send color="white" size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
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
    const t = userText.toLowerCase();
    if (t.includes('배송')) return '배송 조회를 위해 주문 번호를 알려주세요.';
    if (t.includes('주문')) return '주문 상태는 마이페이지 > 주문내역에서 확인하실 수 있습니다.';
    if (t.includes('반품') || t.includes('환불')) return '반품/환불 접수는 반품 신청 페이지에서 진행됩니다. 도와드릴까요?';
    return '문의하신 내용을 확인했어요. 자세히 알려주시면 도움드리겠습니다.';
}
