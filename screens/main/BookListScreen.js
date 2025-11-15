import { Picker } from '@react-native-picker/picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Card from '../../components/Card';
import { getBooks, getCurrentUser, getUserBooks, saveUserBooks } from '../../utils/storage';
import { darkAcademia } from '../../utils/theme';

const Tab = createMaterialTopTabNavigator();

const ExploreTab = ({ navigation, books, userBooks, currentUser, onFavoriteToggle }) => {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let filtered = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'All') filtered = filtered.filter(book => book.category === selectedCategory);
    setFilteredBooks(filtered);
  }, [books, search, selectedCategory]);

  const categories = ['All', ...new Set(books.map(b => b.category))];

  return (
    <View style={styles.tabContainer}>
      <TextInput
        placeholder="Search books..."
        placeholderTextColor={darkAcademia.muted}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      
    
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={selectedCategory} 
          onValueChange={setSelectedCategory} 
          style={[styles.picker, { backgroundColor: darkAcademia.background }]}
          dropdownIconColor={darkAcademia.text}
          mode="dialog"
          itemStyle={{ backgroundColor: darkAcademia.background, color: darkAcademia.text }}
        >
          {categories.map(cat => (
            <Picker.Item 
              key={cat} 
              label={cat} 
              value={cat} 
              color={darkAcademia.text}
              style={{ backgroundColor: darkAcademia.background }}
            />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ backgroundColor: darkAcademia.background }}
        ListEmptyComponent={
          <Text style={{ color: darkAcademia.text, textAlign: 'center', marginTop: 50, fontFamily: darkAcademia.font }}>
            No books found. Add your first book!
          </Text>
        }
        renderItem={({ item }) => (
          <Card
            book={item}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
            onFavoriteToggle={() => onFavoriteToggle(item.id)}
            isFavorite={userBooks[item.id]?.isFavorite}
          />
        )}
      />
    </View>
  );
};

const MyLibraryTab = ({ navigation, books, userBooks, currentUser, onFavoriteToggle }) => {
  const ownedBooks = books.filter(book => userBooks[book.id]?.isOwned);
  const [search, setSearch] = useState('');
  const filtered = ownedBooks.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.tabContainer}>
      <TextInput
        placeholder="Search my library..."
        placeholderTextColor={darkAcademia.muted}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ backgroundColor: darkAcademia.background }}
        ListEmptyComponent={
          <Text style={{ color: darkAcademia.text, textAlign: 'center', marginTop: 50, fontFamily: darkAcademia.font }}>
            No books in your library. Add books from the Explore tab!
          </Text>
        }
        renderItem={({ item }) => (
          <Card
            book={item}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
            onFavoriteToggle={() => onFavoriteToggle(item.id)}
            isFavorite={userBooks[item.id]?.isFavorite}
          />
        )}
      />
    </View>
  );
};

const BookListScreen = ({ navigation, route }) => {
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const loadData = async () => {
    const allBooks = await getBooks();
    setBooks(allBooks);
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const data = await getUserBooks(user.id);
      setUserBooks(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [route?.params?.refresh])
  );

  const onFavoriteToggle = async (bookId) => {
    const updated = { ...userBooks, [bookId]: { ...userBooks[bookId], isFavorite: !userBooks[bookId]?.isFavorite } };
    setUserBooks(updated);
    await saveUserBooks(currentUser.id, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkAcademia.background, paddingTop: 40 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: darkAcademia.border,
            paddingTop: 10,
            paddingBottom: 10,
            height: 60,
          },
          tabBarActiveTintColor: darkAcademia.accent,
          tabBarInactiveTintColor: darkAcademia.muted,
          tabBarLabelStyle: { 
            fontFamily: darkAcademia.font,
            fontSize: 14,
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: darkAcademia.accent,
            height: 3,
          },
        }}
      >
        <Tab.Screen name="Explore">
          {() => <ExploreTab navigation={navigation} books={books} userBooks={userBooks} currentUser={currentUser} onFavoriteToggle={onFavoriteToggle} />}
        </Tab.Screen>
        <Tab.Screen name="My Library">
          {() => <MyLibraryTab navigation={navigation} books={books} userBooks={userBooks} currentUser={currentUser} onFavoriteToggle={onFavoriteToggle} />}
        </Tab.Screen>
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditBook', { mode: 'add' })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: darkAcademia.background,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: darkAcademia.border,
    margin: 5,
    borderRadius: 5,
    color: darkAcademia.text,
    backgroundColor: darkAcademia.border,
  },
  picker: {
    marginHorizontal: 5,
    backgroundColor: darkAcademia.border,
    color: darkAcademia.text,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#cdad0cff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#0d0b0bff',
    fontSize: 36,
    lineHeight: 36,
    fontWeight: 'bold',
  },
});

export default BookListScreen;