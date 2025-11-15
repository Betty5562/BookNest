import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookListScreen from '../screens/main/BookListScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'BookList') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#bfa760',
      tabBarInactiveTintColor: '#bfa760',
    })}
  >
    <Tab.Screen 
      name="BookList" 
      component={BookListScreen} 
      options={{ title: 'Home', headerShown: false }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ 
        headerStyle: { backgroundColor: '#25221f' },  
        headerTintColor: '#f5f0e1',  
        headerTitleStyle: { fontFamily: 'serif' },  
      }} 
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ 
        headerStyle: { backgroundColor: '#25221f' },
        headerTintColor: '#f5f0e1', 
        headerTitleStyle: { fontFamily: 'serif' }, 
      }} 
    />
  </Tab.Navigator>
);

export default MainTabs;