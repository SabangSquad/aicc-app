import { ScrollView, View } from 'react-native';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView>
      <View className="px-4">{children}</View>
    </ScrollView>
  );
}
