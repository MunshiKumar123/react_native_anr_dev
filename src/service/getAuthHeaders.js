import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}
