import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { getBooks, saveBooks } from '../../utils/storage';
import { darkAcademia } from '../../utils/theme';

const BookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  author: Yup.string().required('Author is required'),
  category: Yup.string().required('Category is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required'),
  description: Yup.string().required('Description is required'),
});

const AddEditBookScreen = ({ route, navigation }) => {
  const { book, mode } = route.params || {};
  const [imageUri, setImageUri] = useState(book?.imageUri || '');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images, 
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

 const handleSave = async (values) => {
  const books = await getBooks();

  const formatted = {
    ...values,
    rating: Number(values.rating), 
    category: values.category.trim() || 'Uncategorized', 
    imageUri,
  };

  if (mode === 'edit' && book) {
    const index = books.findIndex(b => b.id === book.id);
    if (index !== -1) {
      books[index] = { ...book, ...formatted };
    }
  } else {
    books.push({ id: Date.now().toString(), ...formatted });
  }

  await saveBooks(books);

  navigation.navigate('BookList', { refresh: true });
};


  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      style={{ backgroundColor: darkAcademia.background }}
    >
      <Text style={styles.title}>{mode === 'edit' ? 'Edit Book' : 'Add New Book'}</Text>
      
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}
      
      <Formik
        initialValues={{
          title: book?.title || '',
          author: book?.author || '',
          category: book?.category || '',
          rating: book?.rating || 1,
          description: book?.description || '',
        }}
        validationSchema={BookSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              error={touched.title && errors.title}
            />
            <TextInput
              placeholder="Author"
              value={values.author}
              onChangeText={handleChange('author')}
              onBlur={handleBlur('author')}
              error={touched.author && errors.author}
            />
            <TextInput
              placeholder="Category"
              value={values.category}
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              error={touched.category && errors.category}
            />
            <TextInput
              placeholder="Rating (1-5)"
              value={values.rating.toString()}
              onChangeText={(text) => handleChange('rating')(Number(text))} 
              onBlur={handleBlur('rating')}
              keyboardType="numeric"
              error={touched.rating && errors.rating}
            />
            <TextInput
              placeholder="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              multiline
              numberOfLines={4}
              error={touched.description && errors.description}
              style={{ marginBottom: 10 }}
            />

            <View style={{ marginBottom: 10 }}>
              <Button title="Pick Image" onPress={pickImage} />
            </View>

            <View style={{ marginBottom: 10 }}>
              <Button title="Save" onPress={handleSubmit} />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Button title="Cancel" onPress={() => navigation.goBack()} />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: darkAcademia.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: darkAcademia.accent,
    fontFamily: darkAcademia.font,
  },
  image: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default AddEditBookScreen;
