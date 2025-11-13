import { GLOrb } from '@/features/gl/OrbGL';
import { Audio } from 'expo-av';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface VoiceBotPageProps {
    navigation: any;
}
export function VoiceBot({ navigation }: VoiceBotPageProps) {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [listening, setListening] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Audio.requestPermissionsAsync();
            setPermissionGranted(status === 'granted');
        })();
    }, []);

    const startListening = async () => {
        if (!permissionGranted) return console.warn('No mic permission');
        try {
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const rec = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(rec.recording);
            setListening(true);
        } catch (e) {
            console.warn('record start failed', e);
        }
    };

    const stopListening = async () => {
        if (!recording) return;
        try {
            await recording.stopAndUnloadAsync();
            setRecording(null);
            setListening(false);
        } catch (e) {
            console.warn('record stop failed', e);
        }
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center border-b border-zinc-700 px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
                <View className="ml-2">
                    <Text className="text-lg font-semibold text-white">보이스봇 상담</Text>
                    <Text className="text-sm text-gray-400">보이스봇이 당신의 말을 듣고 있습니다</Text>
                </View>
            </View>
            <View className="flex flex-1 items-center justify-center">
                <GLOrb listening={listening} onToggleListening={() => (listening ? stopListening() : startListening())} hue={300} />

                <View className="mt-6">
                    <Text style={{ color: '#cbd5e1' }}>{listening ? 'Listening...' : 'Tap to speak'}</Text>
                </View>
            </View>
        </View>
    );
}
