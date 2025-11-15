import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import LandingScreen from './screens/auth/LandingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';

// Main Screens
import MainTabs from './navigation/MainTabs';
import AddEditBookScreen from './screens/main/AddEditBookScreen';
import BookDetailsScreen from './screens/main/BookDetailsScreen';

// Utils
import { getCurrentUser, seedInitialBooks } from './utils/storage';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Temporary: Clear all data on load (remove after testing)
     // await AsyncStorage.clear();
      //console.log('All data cleared');
      
      // Seed initial books
      await seedInitialBooks();
      
      const token = await SecureStore.getItemAsync('sessionToken');
      const user = await getCurrentUser();
      if (token && user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25221f' }}>
        <ActivityIndicator size="large" color="#bfa760" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated Routes
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="BookDetails" 
              component={BookDetailsScreen}
              options={{ 
                headerShown: true, 
                title: 'Book Details', 
                headerStyle: { backgroundColor: '#25221f' }, 
                headerTintColor: '#f5f0e1' 
              }}
            />
            <Stack.Screen 
              name="AddEditBook" 
              component={AddEditBookScreen}
              options={{ 
                headerShown: true, 
                title: 'Add/Edit Book', 
                headerStyle: { backgroundColor: '#25221f' }, 
                headerTintColor: '#f5f0e1' 
              }}
            />
          </>
        ) : (
          // Auth Routes
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {props => <SignupScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
