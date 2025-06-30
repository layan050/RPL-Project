import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [packageWeight, setPackageWeight] = useState('');
  const [length, setLength] = useState('');
  const [width_dim, setWidthDim] = useState('');
  const [height, setHeight] = useState('');
  const [origin, setOrigin] = useState('Jakarta');
  const [destination, setDestination] = useState('Bandung');
  const [packageType, setPackageType] = useState('Documents');
  const [insurance, setInsurance] = useState(false);
  const [costEstimate, setCostEstimate] = useState(null);
  const [currentAnimal, setCurrentAnimal] = useState('');

  const cityList = [
    'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'
  ];

  const packageTypeList = [
    { label: 'Documents 📄', value: 'Documents'},
    { label: 'Clothing 👕', value: 'Clothing' },
    { label: 'Electronics 📱', value: 'Electronics' },
    { label: 'Food Items 🍎', value: 'Food' },
    { label: 'Medicine 💊', value: 'Medicine' },
    { label: 'Fragile Items 🏺', value: 'Fragile'},
    { label: 'Books 📚', value: 'Books' },
    { label: 'Pets 🐕', value: 'Pets' },
    { label: 'Wild animals 🦁', value: 'Wild animals', },
    { label: 'Fish 🐟', value: 'Fish'},
    { label: 'Other 🤔', value: 'Other' },
  ];

  const calculateCost = () => {
    if (!packageWeight || parseFloat(packageWeight) <= 0) {
      Alert.alert('Error', 'Please enter a valid package weight');
      return;
    }

    if (!length || !width_dim || !height || 
        parseFloat(length) <= 0 || parseFloat(width_dim) <= 0 || parseFloat(height) <= 0) {
      Alert.alert('Error', 'Please enter valid package dimensions');
      return;
    }

    const weight = parseFloat(packageWeight);
    const dimensions = parseFloat(length) * parseFloat(width_dim) * parseFloat(height);
    const volumetricWeight = dimensions / 6000;
    const shippingWeight = Math.max(weight, volumetricWeight);

    // Calculate base cost
    let baseCost = 0;
    const distance = calculateDistance(origin, destination);
    
    if (distance <= 100) {
      baseCost = 10000;
    } else if (distance <= 500) {
      baseCost = 15000;
    } else {
      baseCost = 25000;
    }

    const costPerKg = shippingWeight * 3000;

    // Additional cost based on package type
    let additionalCost = 0;
    switch (packageType) {
      case 'Electronics':
        additionalCost = 10000;
        break;
      case 'Fragile':
        additionalCost = 15000;
        break;
      case 'Medicine':
        additionalCost = 8000;
        break;
      case 'Food':
        additionalCost = 5000;
        break;
      case 'Pets':
        additionalCost = 7000;
        break;
      case 'Wild animals':
        additionalCost = 10000;
        break;
      case 'Fish':
        additionalCost = 8000;
        break;
      case 'Documents':
        additionalCost = 5000;
        break;
      case 'Other':
        additionalCost = 10000;
      default:
        additionalCost = 0;
    }

    const subtotal = baseCost + costPerKg + additionalCost;
    const taxAmount = subtotal * 0.11;
    const insuranceCost = insurance ? subtotal * 0.02 : 0;
    const totalCost = subtotal + taxAmount + insuranceCost;

    // Update animal based on package type
    const selectedPackage = packageTypeList.find(pkg => pkg.value === packageType);
    if (selectedPackage) {
      setCurrentAnimal(selectedPackage.animal);
    }

    setCostEstimate({
      baseCost,
      costPerKg: Math.round(costPerKg),
      additionalCost,
      subtotal: Math.round(subtotal),
      tax: Math.round(taxAmount),
      insuranceCost: Math.round(insuranceCost),
      total: Math.round(totalCost),
      shippingWeight: shippingWeight.toFixed(2)
    });
  };

  const calculateDistance = (origin, destination) => {
    const distanceMatrix = {
      'Jakarta-Bandung': 150,
      'Jakarta-Surabaya': 800,
      'Jakarta-Medan': 1400,
      'Bandung-Surabaya': 700,
      'Bandung-Medan': 1300,
      'Surabaya-Medan': 1200,
    };

    const key1 = `${origin}-${destination}`;
    const key2 = `${destination}-${origin}`;
    
    return distanceMatrix[key1] || distanceMatrix[key2] || 300;
  };

  const resetForm = () => {
    setPackageWeight('');
    setLength('');
    setWidthDim('');
    setHeight('');
    setOrigin('Jakarta');
    setDestination('Bandung');
    setPackageType('Documents');
    setInsurance(false);
    setCostEstimate(null);
    setCurrentAnimal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Simple Header */}
        <View style={styles.header}>
          <Text style={styles.animalMascot}>{currentAnimal}</Text>
          <Text style={styles.title}>Animal Package Calculator</Text>
          <Text style={styles.subtitle}>Calculate shipping costs</Text>
        </View>

        <View style={styles.form}>
          {/* Package Weight */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Package Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={packageWeight}
              onChangeText={setPackageWeight}
              placeholder="Enter weight in kg"
              keyboardType="numeric"
            />
          </View>

          {/* Package Dimensions */}
          <Text style={styles.sectionTitle}>Package Dimensions (cm)</Text>
          <View style={styles.dimensionsContainer}>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Length</Text>
              <TextInput
                style={styles.input}
                value={length}
                onChangeText={setLength}
                placeholder="cm"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Width</Text>
              <TextInput
                style={styles.input}
                value={width_dim}
                onChangeText={setWidthDim}
                placeholder="cm"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="cm"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Origin */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={origin}
                onValueChange={setOrigin}
                style={styles.picker}
              >
                {cityList.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={destination}
                onValueChange={setDestination}
                style={styles.picker}
              >
                {cityList.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Package Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Package Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={packageType}
                onValueChange={(value) => {
                  setPackageType(value);
                  const selectedPkg = packageTypeList.find(pkg => pkg.value === value);
                  if (selectedPkg) setCurrentAnimal(selectedPkg.animal);
                }}
                style={styles.picker}
              >
                {packageTypeList.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Insurance */}
          <View style={styles.inputGroup}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setInsurance(!insurance)}
            >
              <View style={[styles.checkbox, insurance && styles.checkboxChecked]}>
                {insurance && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Add Insurance (Optional)</Text>
            </TouchableOpacity>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity style={styles.calculateButton} onPress={calculateCost}>
            <Text style={styles.buttonText}>Calculate Cost</Text>
          </TouchableOpacity>

          {/* Results */}
          {costEstimate && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Cost Estimate</Text>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Shipping Weight:</Text>
                <Text style={styles.resultValue}>{costEstimate.shippingWeight} kg</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Base Cost:</Text>
                <Text style={styles.resultValue}>Rp {costEstimate.baseCost.toLocaleString('id-ID')}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Weight Cost:</Text>
                <Text style={styles.resultValue}>Rp {costEstimate.costPerKg.toLocaleString('id-ID')}</Text>
              </View>

              {costEstimate.additionalCost > 0 && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Additional Cost:</Text>
                  <Text style={styles.resultValue}>Rp {costEstimate.additionalCost.toLocaleString('id-ID')}</Text>
                </View>
              )}

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Subtotal:</Text>
                <Text style={styles.resultValue}>Rp {costEstimate.subtotal.toLocaleString('id-ID')}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Tax (11%):</Text>
                <Text style={styles.resultValue}>Rp {costEstimate.tax.toLocaleString('id-ID')}</Text>
              </View>

              {costEstimate.insuranceCost > 0 && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Insurance:</Text>
                  <Text style={styles.resultValue}>Rp {costEstimate.insuranceCost.toLocaleString('id-ID')}</Text>
                </View>
              )}

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Cost:</Text>
                <Text style={styles.totalAmount}>Rp {costEstimate.total.toLocaleString('id-ID')}</Text>
              </View>

              <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                <Text style={styles.resetButtonText}>Calculate Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  animalMascot: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});