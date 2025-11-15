import { CommonActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../../components/Button';
import { clearCurrentUser, saveBooks, saveUsers } from '../../utils/storage';
import { darkAcademia } from '../../utils/theme';

const SettingsScreen = ({ navigation }) => {
  const [showRatings, setShowRatings] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const resetLibrary = async () => {
    Alert.alert('Confirm', 'Remove all books from your library?', [
      { text: 'Cancel' },
      { text: 'Reset', onPress: async () => {
        Alert.alert('Reset', 'Library reset (implement full logic in userBooks)');
      }},
    ]);
  };

  const clearAllData = async () => {
    Alert.alert('Confirm', 'This will wipe all data. Proceed?', [
      { text: 'Cancel' },
      { text: 'Clear', onPress: async () => {
        await saveBooks([]);
        await saveUsers([]);
        await clearCurrentUser();
        await SecureStore.deleteItemAsync('sessionToken');
        
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
          })
        );
      }},
    ]);
  };

  const logout = async () => {
    await clearCurrentUser();
    await SecureStore.deleteItemAsync('sessionToken');
    
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Removed: <Text style={styles.title}>Settings</Text> */}

      <Text style={styles.sectionTitle}>Display Preferences</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Show Ratings</Text>
        <Switch value={showRatings} onValueChange={setShowRatings} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Compact View</Text>
        <Switch value={compactView} onValueChange={setCompactView} />
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Push Notifications</Text>
        <Switch value={pushNotifications} onValueChange={setPushNotifications} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Email Updates</Text>
        <Switch value={emailUpdates} onValueChange={setEmailUpdates} />
      </View>

      <Text style={styles.sectionTitle}>Data Management</Text>
      <View style={{ marginBottom: 10 }}>
        <Button title="Reset Library" onPress={resetLibrary} />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button title="Clear All Data" onPress={clearAllData} />
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={{ marginBottom: 10 }}>
        <Button title="Logout" onPress={logout} />
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.text}>App Version: 1.0.0</Text>
      <Text style={styles.text}>Data Storage: Local (AsyncStorage)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: darkAcademia.background,
  },
  // Removed: title style (no longer needed)
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: darkAcademia.accent,
    fontFamily: darkAcademia.font,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  text: {
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
  },
});

export default SettingsScreen;