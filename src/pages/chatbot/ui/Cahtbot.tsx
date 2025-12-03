import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, Keyboard } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    time: string;
}

export function Chatbot() {
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'm1', sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', time: '09:00' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const quickReplies = ['주문 상태 확인', '배송 문의', '반품/환불 요청', '교환 신청', '환불 처리 기간'];

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

    useEffect(() => {
        if (keyboardHeight > 0) {
            setTimeout(() => {
                flatRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [keyboardHeight]);

    useEffect(() => {
        const timer = setTimeout(() => {
            flatRef.current?.scrollToEnd({ animated: true });
        }, 100);

        return () => clearTimeout(timer);
    }, [messages, isTyping]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: `u_${Date.now()}`,
            sender: 'user',
            text: text.trim(),
            time: getNow(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;

            if (!apiUrl) {
                console.warn('EXPO_PUBLIC_API_URL이 설정되지 않았습니다.');
                throw new Error('API URL Missing');
            }

            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const botReplyText = data.answer || '답변을 받아오지 못했습니다.';

            const botMsg: Message = {
                id: `b_${Date.now()}`,
                sender: 'bot',
                text: botReplyText,
                time: getNow(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat API Error:', error);
            const errorMsg: Message = {
                id: `e_${Date.now()}`,
                sender: 'bot',
                text: '죄송합니다. 서버 연결에 문제가 생겼습니다. 잠시 후 다시 시도해주세요.',
                time: getNow(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const scrollToBottom = () => {
        flatRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View className="flex-1 bg-zinc-900">
            {/* Header */}
            <View className="flex-row items-center border-b border-zinc-700 bg-zinc-900 px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
                <View className="ml-2">
                    <Text className="text-lg font-semibold text-white">챗봇 상담</Text>
                    <Text className="text-sm text-gray-400">무엇이든 물어보세요</Text>
                </View>
            </View>

            <FlatList
                ref={flatRef}
                data={messages}
                keyExtractor={(item) => item.id}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 16,
                }}
                renderItem={({ item }) => (
                    <View className={`mb-2 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <View
                            className={`max-w-[80%] px-4 py-2 ${
                                item.sender === 'user'
                                    ? 'rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-xl bg-blue-600'
                                    : 'rounded-tl-sm rounded-tr-xl rounded-br-xl rounded-bl-xl bg-zinc-700'
                            }`}>
                            <Text className="text-base text-white">{item.text}</Text>
                            <Text className="mt-1 text-right text-xs text-gray-400">{item.time}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Typing Indicator */}
            {isTyping && (
                <View className="bg-zinc-900 px-4 pb-2">
                    <View className="w-48 rounded-xl bg-zinc-700 px-3 py-2">
                        <Text className="text-sm text-gray-300">답변을 생성하고 있습니다...</Text>
                    </View>
                </View>
            )}

            {/* Quick Replies + Input Area */}
            <View className="bg-zinc-900 px-4 py-2" style={{ marginBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 0 }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={quickReplies}
                    keyExtractor={(i) => i}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => sendMessage(item)} className="mr-2 rounded-full bg-zinc-800 px-4 py-2">
                            <Text className="text-sm text-gray-200">{item}</Text>
                        </TouchableOpacity>
                    )}
                    className="mb-2"
                />

                {/* Input Bar */}
                <View className="my-2 flex-row items-center">
                    <View className="flex-1 flex-row items-center rounded-2xl bg-zinc-800 px-4 py-2">
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="메시지를 입력하세요"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 py-2 text-base text-white"
                            multiline
                        />
                        <TouchableOpacity onPress={() => sendMessage(input)} disabled={isTyping || !input.trim()}>
                            <Send color={input.trim() ? '#3B82F6' : '#6B7280'} size={22} />
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
