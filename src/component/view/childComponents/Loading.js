import React, { memo } from 'react'
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

function Loading({ size }) {
    return (
        <ActivityIndicator size={size || 'small'} color="#3498db" style={stylesGrid.loadingIndicator} />
    )
}

export default memo(Loading)

const stylesGrid = StyleSheet.create({
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
});