import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppIcons } from './assets/icon';
import { Home } from '@/pages/home';
import { Cart } from '@/pages/cart';
import { My } from '@/pages/my';
import { Customer } from '@/pages/customer';

function getTabBarIcon(routeName: string) {
    const Icon = AppIcons[routeName.toLowerCase()];
    return ({ color, size }: { color: string; size: number }) => <Icon color={color} size={size} />;
}

export function Navigation() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            initialRouteName="home"
            screenOptions={({ route }) => ({
                tabBarIcon: getTabBarIcon(route.name),
                tabBarShowLabel: true,
                headerShown: false,
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#999999',
                tabBarStyle: {
                    paddingTop: 6,
                    paddingBottom: 10,
                    height: 75,
                    backgroundColor: '#222222',
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'semibold',
                    fontFamily: 'System',
                },
            })}>
            <Tab.Screen name="home" options={{ tabBarLabel: '홈' }} component={Home} />
            <Tab.Screen name="customer" options={{ tabBarLabel: '고객센터' }} component={Customer} />
            <Tab.Screen name="cart" options={{ tabBarLabel: '장바구니' }} component={Cart} />
            <Tab.Screen name="my" options={{ tabBarLabel: '마이' }} component={My} />
        </Tab.Navigator>
    );
}
