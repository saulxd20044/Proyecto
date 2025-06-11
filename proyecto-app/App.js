import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import FormScreen from './screens/FormScreen';
import DocumentScreen from './screens/DocumentScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleNavigation = (screen) => {
    console.log(`Navegando a: ${screen}`);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onNext={() => handleNavigation('form')} />;
      case 'form':
        return <FormScreen onNext={() => handleNavigation('document')} onBack={() => handleNavigation('login')} />;
      case 'document':
        return <DocumentScreen onBack={() => handleNavigation('form')} />;
      default:
        return <LoginScreen onNext={() => handleNavigation('form')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Botones de navegación directa para desarrollo */}
      <View style={styles.devButtons}>
        <TouchableOpacity style={styles.devButton} onPress={() => handleNavigation('login')}>
          <Text style={styles.devButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.devButton} onPress={() => handleNavigation('form')}>
          <Text style={styles.devButtonText}>Form</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.devButton} onPress={() => handleNavigation('document')}>
          <Text style={styles.devButtonText}>Document</Text>
        </TouchableOpacity>
      </View>
      
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  devButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  devButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});