import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from './src/context/StudyContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StudyProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </StudyProvider>
    </SafeAreaProvider>
  );
}
