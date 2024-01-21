import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();

  const goBack = () => navigation.navigate('Dashboard');
  const handleSearch = () => console.log('Searching');


  return (
    <View>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="home-outline" color="#FFF" style={styles.action} onPress={goBack} />
        <Appbar.Action icon="chat-outline" color="#FFF" style={styles.action} onPress={handleSearch} />
        <Appbar.Action icon="account" color="#FFF" style={styles.action} onPress={() => navigation.navigate('Profile')} />
      </Appbar.Header>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: '#07606d',
    justifyContent: 'space-around', // Adjusted to evenly space the icons
  },
  action: {
    flex: 1, // Distribute the available space evenly among actions
  },
});

export default BottomNavigation;
