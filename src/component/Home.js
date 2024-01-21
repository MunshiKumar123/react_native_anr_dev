import 'react-native-gesture-handler'; // Import this at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import StackNavigation from './navigation/StackNavigation';
import Toast from 'react-native-toast-message';



const Home = () => {
    return (
        <NavigationContainer>
            <PaperProvider>
                <StackNavigation />
                <Toast />
            </PaperProvider>
        </NavigationContainer>
    );
};

export default Home;
