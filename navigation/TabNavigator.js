import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from './HomeStack';
import EquipmentStack from './EquipmentStack';
import HistoryStack from './HistoryStack';
import NutritionStack from './NutritionStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff7f00',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Equipment') iconName = 'barbell';
          if (route.name === 'History') iconName = 'time';
          if (route.name === 'Nutrition') iconName = 'restaurant';
          if (route.name === 'Settings') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Equipment" component={EquipmentStack} />
      <Tab.Screen name="History" component={HistoryStack} />
      <Tab.Screen name="Nutrition" component={NutritionStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
