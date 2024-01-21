import React, { useState, useEffect, memo } from 'react';
import { PaperProvider, Text, Button, Card } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';

function DealDetails({ route, navigation }) {
    const [userDeal, setUserDeal] = useState(null);

    useEffect(() => {
        if (route?.params?.dealData) {
            setUserDeal(route?.params?.dealData);
        }
    }, [route.params?.dealData]);



    return (
        <PaperProvider>
            <AppHeader path="DealList" title="Deal Details" />
            <FlatList
                style={stylesGrid.scrollContainer}
                data={[1]}
                keyExtractor={() => 'DealList'}
                renderItem={() => (
                    <Card style={stylesGrid.cardContainer}>
                        {renderTaskDetail('Deal Name', userDeal?.dealName)}
                        {renderTaskDetail('Account Name', userDeal?.accountName)}
                        {renderTaskDetail('Type', userDeal?.type)}
                        {renderTaskDetail('Closing Date', userDeal?.closingDate)}
                        {renderTaskDetail('Reason for loss', userDeal?.reason_for_loss)}
                        {renderTaskDetail('Stage', userDeal?.stage)}
                        {renderTaskDetail('Amount', userDeal?.amount)}
                        {renderTaskDetail('Probability', userDeal?.probability)}
                        {renderTaskDetail('Expected Revenue', userDeal?.expectedRevenue)}
                        {renderTaskDetail('Remark', userDeal?.remark)}
                    </Card>
                )}
            />
            <BottomNavigation />
        </PaperProvider>
    );
}

function renderTaskDetail(label, value) {
    return (
        <View style={stylesGrid.detailContainer}>
            <Text style={stylesGrid.taskHead}>{label}</Text>
            <Text style={stylesGrid.taskText}>{value}</Text>
        </View>
    );
}

export default memo(DealDetails);

const stylesGrid = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 2,
    },
    headerContainer: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#17A2B7',
        marginBottom: 1,
        borderRadius: 8,
    },
    taskNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    cardContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'white',
    },
    detailContainer: {
        marginBottom: 10,
    },
    taskHead: {
        fontSize: 16,
        color: '#17A2B7',
    },
    taskText: {
        fontSize: 14,
        color: 'black',
    },
    taskUpdate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: '#17A2B7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 2,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
