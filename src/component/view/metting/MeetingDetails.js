import React, { useState, useEffect, memo } from 'react';
import { PaperProvider, Text, Card } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';

function MeetingDetails({ route, navigation }) {
    const [userMeeting, setUserMeeting] = useState(null);
    const [updateMeeting, setUpdateMeeting] = useState(null);

    useEffect(() => {
        if (route?.params?.meetingsData) {
            setUserMeeting(route?.params?.meetingsData);
        }
    }, [route.params?.meetingsData]);

    useEffect(() => {
        if (route?.params?.mettingUpdate) {
            setUpdateMeeting(route?.params?.mettingUpdate);
        }
    }, [route.params?.mettingUpdate]);

    return (
        <PaperProvider>
            <AppHeader path="MettingList" title="Meeting Details" />
            <FlatList
                style={stylesGrid.scrollContainer}
                data={[1]}
                keyExtractor={() => 'MettingList'}
                renderItem={() => (
                    <Card style={stylesGrid.cardContainer}>
                        {renderMeetingDetail('Contact Name', userMeeting?.contactName)}
                        {renderMeetingDetail('Contact Number', userMeeting?.contactNumber)}
                        {renderMeetingDetail('Lead Name', userMeeting?.related[0]?.lead_Name)}
                        {renderMeetingDetail('Status', updateMeeting?.status ? updateMeeting?.status : userMeeting?.status)}
                        {renderMeetingDetail('Email', userMeeting?.related[0]?.email)}
                        {renderMeetingDetail('Meeting Date', userMeeting?.to)}

                        <View style={stylesGrid.taskUpdate}>
                            <TouchableOpacity style={stylesGrid.updateButton} onPress={() => { navigation.navigate('MettingUpdate', { meetingData: userMeeting, meetingTransfer: true, header: 'Meeting Transfer' }) }}>
                                <Text style={stylesGrid.updateButtonText}>Meeting Transfer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesGrid.updateButton} onPress={() => { navigation.navigate('MettingUpdate', { meetingData: userMeeting, header: 'Meeting Update Status' }) }}>
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

function renderMeetingDetail(label, value) {
    return (
        <View style={stylesGrid.detailContainer}>
            <Text style={stylesGrid.followupHead}>{label}</Text>
            <Text style={stylesGrid.followupFirstText}>{value}</Text>
        </View>
    );
}

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
        marginBottom: 5,
    },
    followupHead: {
        fontSize: 16,
        color: '#17A2B7',
    },
    followupFirstText: {
        paddingVertical: 5,
        fontSize: 14,
        color: 'black',
        fontWeight: '600',
    },
    taskUpdate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    },
    updateButton: {
        backgroundColor: '#17A2B7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 2,
        margin: 5,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default memo(MeetingDetails);
