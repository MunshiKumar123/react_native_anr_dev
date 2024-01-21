import React, { useState, useEffect, memo } from 'react';
import { PaperProvider, Text, Card } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { StyleSheet, View, Button } from 'react-native';
import { FlatList } from 'react-native';


function CallDetails({ route, navigation }) {
    const [callLog, setCallLog] = useState(null);
    useEffect(() => {
        if (route?.params?.callData) {
            setCallLog(route?.params?.callData);
        }
    }, [route.params?.callData]);

    return (
        <PaperProvider>
            <AppHeader path="CalList" title="Call Details" />
            <FlatList
                style={stylesGrid.scrollContainer}
                data={[1]}
                keyExtractor={() => 'TaskList'}
                renderItem={() => (
                        <Card style={stylesGrid.cardContainer}>
                            {renderTaskDetail('Full Name', callLog?.related[0]?.fullName)}
                            {renderTaskDetail('Phone', callLog?.related[0]?.phone)}
                            {renderTaskDetail('Email', callLog?.related[0]?.email)}
                            {renderTaskDetail('Call Disposition', callLog?.call_disposition)}
                            {renderTaskDetail('Talk Time', callLog?.talk_time)}
                            {renderTaskDetail('Remark', callLog?.remark)}
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

export default memo(CallDetails);

const stylesGrid = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 2,
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
});
