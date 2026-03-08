import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EquipmentScreen() {
  const [equipment, setEquipment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    const stored = await AsyncStorage.getItem("equipment");
    const parsed = stored ? JSON.parse(stored) : [];
    setEquipment(parsed);
  };

  const saveEquipment = async () => {
    if (!name.trim()) return;

    const newItem = {
      name,
      bodyPart,
      type,
      description,
      video,
      image
    };

    const updated = [...equipment, newItem];

    await AsyncStorage.setItem("equipment", JSON.stringify(updated));
    setEquipment(updated);

    // Reset form
    setName('');
    setBodyPart('');
    setType('');
    setDescription('');
    setVideo('');
    setImage('');

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Equipment</Text>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Equipment</Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: 20 }}>
        {equipment.length === 0 && (
          <Text style={styles.empty}>No equipment added yet.</Text>
        )}

        {equipment.map((item, index) => (
          <View key={index} style={styles.card}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.field}>Body Part: <Text style={styles.value}>{item.bodyPart}</Text></Text>
            <Text style={styles.field}>Type: <Text style={styles.value}>{item.type}</Text></Text>
            <Text style={styles.field}>Description:</Text>
            <Text style={styles.description}>{item.description}</Text>

            {item.video ? (
              <TouchableOpacity onPress={() => Linking.openURL(item.video)}>
                <Text style={styles.video}>Watch Video</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Equipment</Text>

            <ScrollView>
              <TextInput
                placeholder="Name"
                placeholderTextColor="#888"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Body Part"
                placeholderTextColor="#888"
                style={styles.input}
                value={bodyPart}
                onChangeText={setBodyPart}
              />

              <TextInput
                placeholder="Type (e.g., Dumbbells, Machine)"
                placeholderTextColor="#888"
                style={styles.input}
                value={type}
                onChangeText={setType}
              />

              <TextInput
                placeholder="Description"
                placeholderTextColor="#888"
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TextInput
                placeholder="Video URL"
                placeholderTextColor="#888"
                style={styles.input}
                value={video}
                onChangeText={setVideo}
              />

              <TextInput
                placeholder="Image URL (optional)"
                placeholderTextColor="#888"
                style={styles.input}
                value={image}
                onChangeText={setImage}
              />

              <TouchableOpacity style={styles.saveButton} onPress={saveEquipment}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  addButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40
  },
  card: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10
  },
  name: {
    color: '#ff6600',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6
  },
  field: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4
  },
  value: {
    color: 'white'
  },
  description: {
    color: '#ddd',
    marginTop: 4,
    marginBottom: 10
  },
  video: {
    color: '#ff6600',
    marginTop: 10,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20
  },
  modalBox: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    maxHeight: '90%'
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  saveButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold'
  },
  cancelButton: {
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  cancelText: {
    color: '#aaa'
  }
});



