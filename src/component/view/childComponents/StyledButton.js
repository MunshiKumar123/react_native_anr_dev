import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function StyledButton({ onPress, title }) {


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default memo(StyledButton);

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#3498db',
        width: '100%',
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});
