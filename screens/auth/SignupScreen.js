import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { Alert, StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';
import { Button, TextInput } from '../../components';
import ScreenContainer from '../../components/ScreenContainer';
import { getUsers, saveUsers, setCurrentUser } from '../../utils/storage';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const SignupScreen = ({ navigation, setIsAuthenticated }) => {
  const handleSignup = async (values) => {
    const users = await getUsers();
    const existingUser = users.find(u => u.email === values.email);
    if (existingUser) {
      Alert.alert('Error', 'User already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      password: values.password,
      avatar: '',
    };

    users.push(newUser);
    await saveUsers(users);
    await setCurrentUser(newUser);
    await SecureStore.setItemAsync('sessionToken', 'mockToken');
    
    // Navigate to main app
    setIsAuthenticated(true);
  };

  return (
    <ScreenContainer centered>
      <Text style={styles.title}>BookNEST</Text>
      <Text style={styles.subtitle}>Sign Up for your personal library</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && errors.name}
            />
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
            <TextInput
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry
              error={touched.confirmPassword && errors.confirmPassword}
            />
            <Button title="Sign Up" onPress={handleSubmit} style={{ marginTop: 20 }} />
          </>
        )}
      </Formik>

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 15 }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#d6ac2eff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#d2902dff',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignupScreen;