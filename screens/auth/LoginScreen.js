import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { Alert, StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';
import { Button, TextInput } from '../../components';
import ScreenContainer from '../../components/ScreenContainer';
import { getUsers, setCurrentUser } from '../../utils/storage';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const handleLogin = async (values) => {
    const users = await getUsers();
    const user = users.find(u => u.email === values.email && u.password === values.password);
    if (!user) {
      Alert.alert('Error', 'Invalid credentials');
      return;
    }

    await setCurrentUser(user);
    await SecureStore.setItemAsync('sessionToken', 'mockToken');
    setIsAuthenticated(true); // This triggers navigation to MainTabs
  };

  return (
    <ScreenContainer centered>
      <Text style={styles.title}>BookNEST</Text>
      <Text style={styles.subtitle}>Login to your library</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email}
            />
            <TextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              error={touched.password && errors.password}
            />
            <Button title="Login" onPress={handleSubmit} style={{ marginTop: 20 }} />
            <Button
              title="Don't have an account? Sign Up"
              onPress={() => navigation.navigate('Signup')}
              style={{ marginTop: 15 }}
            />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#f5f0e1',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#e8e6e3',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;