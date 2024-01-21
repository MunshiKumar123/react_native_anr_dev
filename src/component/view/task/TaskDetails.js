import React, { useState, useEffect, memo } from 'react';
import { PaperProvider, Text, Button, Card } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';

function TaskDetails({ route, navigation }) {
    const [userTask, setUserTask] = useState(null);
    const [updateTask, setUpdateTask] = useState(null);

    useEffect(() => {
        if (route?.params?.taskData) {
            setUserTask(route?.params?.taskData);
        }
    }, [route.params?.taskData]);

    useEffect(() => {
        if (route?.params?.taskUpdate) {
            setUpdateTask(route?.params?.taskUpdate);
        }
    }, [route.params?.taskUpdate]);

    return (
        <PaperProvider>
            <AppHeader path="TaskList" title="Task Details" />
            <FlatList
                style={stylesGrid.scrollContainer}
                data={[1]}
                keyExtractor={() => 'TaskList'}
                renderItem={() => (
                    <Card style={stylesGrid.cardContainer}>
                        {renderTaskDetail('Subject', userTask?.Subject)}
                        {renderTaskDetail('Owner', userTask?.Owner)}
                        {renderTaskDetail('Status', updateTask?.Status ? updateTask?.Status : userTask?.Status)}
                        {renderTaskDetail('Subject', userTask?.Subject)}
                        {renderTaskDetail('Due Date', userTask?.DueDate)}
                        {renderTaskDetail('Priority', userTask?.Priority)}
                        {renderTaskDetail('Lead Name', userTask?.related[0]?.lead_Name)}
                        {renderTaskDetail('Phone', userTask?.related[0]?.phone)}
                        {renderTaskDetail('Email', userTask?.related[0]?.email)}
                        {renderTaskDetail('Description', userTask?.Description)}

                        <View style={stylesGrid.taskUpdate}>
                            <TouchableOpacity style={stylesGrid.updateButton} onPress={() => { navigation.navigate('TaskUpdate', { taskData: userTask, taskTransfer: true, header: 'Task Transfer' }) }}>
                                <Text style={stylesGrid.updateButtonText}>Task Transfer</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={stylesGrid.updateButton} onPress={() => { navigation.navigate('TaskUpdate', { taskData: userTask, header: 'Task Update Status' }) }}>
                                <Text style={stylesGrid.updateButtonText}>Update Status</Text>
                            </TouchableOpacity>
                        </View>
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

export default memo(TaskDetails);

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
        marginBottom: 20, // Add marginBottom to create space between the Card content and the buttons
    },
    updateButton: {
        backgroundColor: '#17A2B7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 2,
        margin: 5, // Add margin to create space between the buttons
    },
    updateButtonText: {
        color: 'white',
        fontSize: 14,
    },
});
