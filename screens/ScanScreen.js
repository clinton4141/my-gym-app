import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState('off');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleScan = (result) => {
    if (scanned) return;
    setScanned(true);

    const code = result.data;

    // ✅ Send barcode to AddCustomFoodScreen
    navigation.navigate('AddCustomFoodScreen', { barcode: code });
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission is required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        flash={flash}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code128',
            'code39',
            'code93',
          ],
        }}
      />

      <View style={styles.overlay}>
        <Text style={styles.scanText}>Align barcode inside the frame</Text>

        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
        >
          <Text style={styles.flashText}>{flash === 'off' ? 'Flash On' : 'Flash Off'}</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#fff', marginBottom: 20 },
  button: { backgroundColor: '#ff7f00', padding: 12, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: 'bold' },

  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },

  scanText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },

  flashButton: {
    backgroundColor: '#ff7f00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },

  flashText: {
    color: '#000',
    fontWeight: 'bold',
  },

  rescanButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  rescanText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
