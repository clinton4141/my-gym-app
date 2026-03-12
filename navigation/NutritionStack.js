import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NutritionTodayScreen from '../screens/nutrition/NutritionTodayScreen';
import AddMealScreen from '../screens/nutrition/AddMealScreen';
import WaterScreen from '../screens/nutrition/WaterScreen';
import BarcodeScannerScreen from '../screens/nutrition/BarcodeScannerScreen';
import AddCustomFoodScreen from '../screens/nutrition/AddCustomFoodScreen';
import FoodDetailsScreen from '../screens/nutrition/FoodDetailScreen'; // FIXED NAME

const Stack = createNativeStackNavigator();

export default function NutritionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NutritionToday" component={NutritionTodayScreen} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} />
      <Stack.Screen name="Water" component={WaterScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="AddCustomFood" component={AddCustomFoodScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
    </Stack.Navigator>
  );
}
