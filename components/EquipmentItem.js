import { View, Text, Image, StyleSheet } from 'react-native';

export default function EquipmentItem({ item }) {
  return (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center'
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  notes: {
    color: '#aaa',
    marginTop: 4
  }
});
