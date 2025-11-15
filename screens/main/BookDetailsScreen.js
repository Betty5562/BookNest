import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { getBooks, getCurrentUser, getUserBooks, saveBooks, saveUserBooks } from '../../utils/storage';
import { darkAcademia } from '../../utils/theme';

const BookDetailsScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [userBooks, setUserBooks] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState([]); // Array of notes
  const [newNote, setNewNote] = useState(''); // Current note being written
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const data = await getUserBooks(user.id);
        setUserBooks(data);
        const existingNotes = data[book.id]?.notes || [];
        // Handle old format (string) and convert to array
        if (typeof existingNotes === 'string') {
          setNotes(existingNotes ? [{ text: existingNotes, date: new Date().toISOString() }] : []);
        } else {
          setNotes(existingNotes);
        }
      }
    };
    loadData();
  }, []);

  const toggleOwnership = async () => {
    const updated = { ...userBooks, [book.id]: { ...userBooks[book.id], isOwned: !userBooks[book.id]?.isOwned } };
    setUserBooks(updated);
    await saveUserBooks(currentUser.id, updated);
  };

  const toggleFavorite = async () => {
    const updated = { ...userBooks, [book.id]: { ...userBooks[book.id], isFavorite: !userBooks[book.id]?.isFavorite } };
    setUserBooks(updated);
    await saveUserBooks(currentUser.id, updated);
  };

  const updateStatus = async (status) => {
    const updated = { ...userBooks, [book.id]: { ...userBooks[book.id], readingStatus: status } };
    setUserBooks(updated);
    await saveUserBooks(currentUser.id, updated);
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      Alert.alert('Error', 'Please write a note first');
      return;
    }

    const noteEntry = {
      text: newNote.trim(),
      date: new Date().toISOString(),
    };

    const updatedNotes = [...notes, noteEntry];
    const updated = { ...userBooks, [book.id]: { ...userBooks[book.id], notes: updatedNotes } };
    setUserBooks(updated);
    await saveUserBooks(currentUser.id, updated);
    setNotes(updatedNotes);
    setNewNote('');
    setIsAddingNote(false);
    Alert.alert('Success', 'Note added!');
  };

  const deleteNote = async (index) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updatedNotes = notes.filter((_, i) => i !== index);
          const updated = { ...userBooks, [book.id]: { ...userBooks[book.id], notes: updatedNotes } };
          setUserBooks(updated);
          await saveUserBooks(currentUser.id, updated);
          setNotes(updatedNotes);
        },
      },
    ]);
  };

  const deleteBook = async () => {
    Alert.alert('Delete Book', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const books = await getBooks();
          const filtered = books.filter(b => b.id !== book.id);
          await saveBooks(filtered);

          const updatedUserBooks = { ...userBooks };
          delete updatedUserBooks[book.id];
          await saveUserBooks(currentUser.id, updatedUserBooks);

          navigation.goBack();
        },
      },
    ]);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: darkAcademia.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        style={{ backgroundColor: darkAcademia.background }}
      >
        <Image
          source={{ uri: book.imageUri || 'https://via.placeholder.com/200' }}
          style={styles.image}
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.text}>Author: {book.author}</Text>
        <Text style={styles.text}>Category: {book.category}</Text>
        <Text style={styles.text}>Rating: {book.rating}/5</Text>
        <Text style={styles.text}>Description: {book.description}</Text>

        <View style={{ marginTop: 15, marginBottom: 10 }}>
          <Button title={userBooks[book.id]?.isOwned ? 'Remove from Library' : 'Add to Library'} onPress={toggleOwnership} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button title={userBooks[book.id]?.isFavorite ? 'Unfavorite' : 'Favorite'} onPress={toggleFavorite} />
        </View>

        <Text style={styles.label}>Reading Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker 
            selectedValue={userBooks[book.id]?.readingStatus || null} 
            onValueChange={updateStatus} 
            style={[styles.picker, { backgroundColor: darkAcademia.background }]}
            dropdownIconColor={darkAcademia.text}
            mode="dialog"

         itemStyle={{ backgroundColor: darkAcademia.background, color: darkAcademia.text }}  // Add itemStyle for consistency
     >
       <Picker.Item label="Not Set" value={null} color={darkAcademia.text} style={{ backgroundColor: darkAcademia.background }} />
       <Picker.Item label="Want to Read" value="wantToRead" color={darkAcademia.text} style={{ backgroundColor: darkAcademia.background }} />
       <Picker.Item label="Currently Reading" value="reading" color={darkAcademia.text} style={{ backgroundColor: darkAcademia.background }} />
       <Picker.Item label="Read" value="read" color={darkAcademia.text} style={{ backgroundColor: darkAcademia.background }} />
     </Picker>
        </View>

        <Text style={styles.label}>Personal Notes:</Text>
        
        {/* Display existing notes */}
        {notes.length > 0 && (
          <View style={styles.notesContainer}>
            {notes.map((note, index) => (
              <View key={index} style={styles.noteCard}>
                <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
                <Text style={styles.noteText}>{note.text}</Text>
                <TouchableOpacity onPress={() => deleteNote(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add new note section */}
        {!isAddingNote ? (
          <View style={{ marginBottom: 10 }}>
            <Button title="+ Add New Note" onPress={() => setIsAddingNote(true)} />
          </View>
        ) : (
          <View style={styles.addNoteContainer}>
            <TextInput
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Write your note here..."
              multiline
              numberOfLines={4}
              style={{ marginBottom: 10 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Button title="Save Note" onPress={addNote} />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Button title="Cancel" onPress={() => { setNewNote(''); setIsAddingNote(false); }} />
              </View>
            </View>
          </View>
        )}

        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Button title="Edit Book" onPress={() => navigation.navigate('AddEditBook', { book, mode: 'edit' })} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button title="Delete Book" onPress={deleteBook} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: darkAcademia.background,
    flexGrow: 1,
  },
  image: {
    width: 200,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: darkAcademia.accent,
    fontFamily: darkAcademia.font,
  },
  text: {
    marginBottom: 5,
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    color: darkAcademia.text,
    fontFamily: darkAcademia.font,
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: darkAcademia.border,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    color: darkAcademia.text,
  },
  notesContainer: {
    marginBottom: 15,
  },
  noteCard: {
    backgroundColor: darkAcademia.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: darkAcademia.accent,
  },
  noteDate: {
    color: darkAcademia.muted,
    fontSize: 12,
    marginBottom: 5,
    fontFamily: darkAcademia.font,
  },
  noteText: {
    color: darkAcademia.text,
    fontSize: 14,
    fontFamily: darkAcademia.font,
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#8B4513',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: darkAcademia.text,
    fontSize: 12,
    fontFamily: darkAcademia.font,
  },
  addNoteContainer: {
    backgroundColor: darkAcademia.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default BookDetailsScreen;