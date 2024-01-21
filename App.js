
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/component/store/store';
import Home from './src/component/Home';


export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Home />
      </Provider>
    </SafeAreaProvider>
  );
}

