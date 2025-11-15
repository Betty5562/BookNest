import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup">
  {props => <SignupScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
</Stack.Screen>

    </Stack.Navigator>
  );
}
