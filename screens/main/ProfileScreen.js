import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { getBooks, getCurrentUser, getUserBooks, getUsers, saveUsers, setCurrentUser } from '../../utils/storage';
import { darkAcademia } from '../../utils/theme';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ owned: 0, favorites: 0, total: 0 });

  const loadUserData = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const userBooks = await getUserBooks(currentUser.id);
      const books = await getBooks();
      const owned = Object.values(userBooks).filter(b => b.isOwned).length;
      const favorites = Object.values(userBooks).filter(b => b.isFavorite).length;
      setStats({ owned, favorites, total: books.length });
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const updatedUser = { ...user, avatar: result.assets[0].uri };
      await saveAvatar(updatedUser);
    }
  };

  const saveAvatar = async (updatedUser) => {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      await saveUsers(users);
      await setCurrentUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleSave = async (values) => {
    const updatedUser = { ...user, ...values };
    await saveAvatar(updatedUser);
    setEditing(false);
  };

  if (!user) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Books Owned: {stats.owned}</Text>
        <Text style={styles.stat}>Favorites: {stats.favorites}</Text>
        <Text style={styles.stat}>Total Books: {stats.total}</Text>
      </View>

      {!editing ? (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Edit Profile" onPress={() => setEditing(true)} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Pick Avatar" onPress={pickAvatar} />
          </View>
        </View>
      ) : (
        <Formik
          initialValues={{ name: user.name, email: user.email }}
          validationSchema={ProfileSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
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
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <Button title="Save Changes" onPress={handleSubmit} />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button title="Cancel" onPress={() => setEditing(false)} />
                </View>
              </View>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkAcademia.background,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: darkAcademia.accent,
  },
  name: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    color: darkAcademia.accent,
    fontFamily: darkAcademia.font,
  },
  email: {
    textAlign: 'center',
    marginBottom: 20,
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stat: {
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 10,
    width: '60%',
  },
  loadingText: {
    color: darkAcademia.text,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProfileScreen;