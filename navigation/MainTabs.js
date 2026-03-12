function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#ff7f00',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="EquipmentTab" component={EquipmentScreen} />
      <Tab.Screen name="HistoryTab" component={WorkoutHistoryScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
