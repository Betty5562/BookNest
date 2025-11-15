
import AsyncStorage from '@react-native-async-storage/async-storage';

/** ----------------- Global books (shared across users) ----------------- **/

export const getBooks = async () => {
  const books = await AsyncStorage.getItem('books');
  return books ? JSON.parse(books) : [];
};

export const saveBooks = async (books) => {
  await AsyncStorage.setItem('books', JSON.stringify(books));
};

/** ----------------- Users (for signup/login) ----------------- **/

export const getUsers = async () => {
  const users = await AsyncStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = async (users) => {
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

/** ----------------- User-specific book data ----------------- **/

export const getUserBooks = async (userId) => {
  const userBooks = await AsyncStorage.getItem('userBooks');
  const allUserBooks = userBooks ? JSON.parse(userBooks) : {};
  return allUserBooks[userId] || {};
};

export const saveUserBooks = async (userId, userBooksData) => {
  const allUserBooks = await AsyncStorage.getItem('userBooks');
  const parsed = allUserBooks ? JSON.parse(allUserBooks) : {};
  parsed[userId] = userBooksData;
  await AsyncStorage.setItem('userBooks', JSON.stringify(parsed));
};

/** ----------------- Current user session ----------------- **/

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = async (user) => {
  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
};

export const clearCurrentUser = async () => {
  await AsyncStorage.removeItem('currentUser');
};

/** ----------------- Initial books data ----------------- **/
export const initialBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    rating: 4.5,
    description: 'A classic novel about the American Dream.',
    imageUri: 'https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg',
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    rating: 4.8,
    description: 'A dystopian novel about totalitarianism.',
    imageUri: 'https://images-na.ssl-images-amazon.com/images/I/71rpa1-kyvL.jpg',
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    rating: 4.6,
    description: 'A romantic novel about love and social class.',
    imageUri: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
  },
  {
    id: '4',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    category: 'Mystery',
    rating: 4.7,
    description: 'A collection of detective stories featuring Sherlock Holmes.',
    imageUri: 'https://images-na.ssl-images-amazon.com/images/I/81CX3u20OoL.jpg',
  },
];


/** ----------------- Seed initial books (call on first load) ----------------- **/
export const seedInitialBooks = async () => {
  try {
    const existingBooks = await getBooks();
    if (existingBooks.length === 0) {
      await saveBooks(initialBooks);
      console.log('Initial books seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial books:', error);
  }
};