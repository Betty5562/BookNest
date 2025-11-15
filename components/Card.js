import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Card = ({ book, onPress, onFavoriteToggle, isFavorite }) => {

  const getImageSource = () => {
    if (!book.imageUri) {
      return { uri: 'https://via.placeholder.com/100x150?text=No+Image' };
    }
    
  
    if (book.imageUri.startsWith('http') || book.imageUri.startsWith('file://')) {
      return { uri: book.imageUri };
    }
    
   
    return { uri: 'https://via.placeholder.com/100x150?text=No+Image' };
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={getImageSource()}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.rating}>Rating: {book.rating}/5</Text>
      </View>
      <TouchableOpacity onPress={onFavoriteToggle}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    margin: 6,
    backgroundColor: '#3A2F2F',
    borderRadius: 8,
  },
  image: { width: 50, height: 75, marginRight: 12, borderRadius: 4 },
  info: { flex: 1 },
  title: { fontWeight: 'bold', color: '#EDEAE0', fontSize: 16 },
  author: { color: '#D3C7B8' },
  rating: { color: '#D3C7B8', marginTop: 4 },
});

export default Card;