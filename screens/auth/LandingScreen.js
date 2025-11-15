import { StyleSheet, Text } from 'react-native';
import Button from '../../components/Button';
import ScreenContainer from '../../components/ScreenContainer';

const LandingScreen = ({ navigation }) => (
  <ScreenContainer centered>
  <Text style={styles.title}>BookNEST</Text>
  <Text style={styles.subtitle}>Discover and manage your personal library.</Text>
  <Button title="Enter the Library" onPress={() => navigation.navigate('Login')} />
</ScreenContainer>

);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertical centering
    alignItems: 'center',     // horizontal centering
    padding: 20,
    backgroundColor: '#25221f', // dark academia background
  },
  title: {
    fontSize: 36,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#f5f0e1',           // cream text
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#e8e6e3',
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default LandingScreen;
