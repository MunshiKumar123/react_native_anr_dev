import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { phoneCall, sendWhatsAppMessage, sendEmail, sendTextMessage, displayToast } from '../../../service/_helpers'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text, IconButton, Button, TextInput } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { StyleSheet, View, Modal, TouchableOpacity, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HistoryGetApi } from '../../../component/store/reducers/HistoryReducer'
import { useDispatch, useSelector } from 'react-redux';
import Timeline from 'react-native-timeline-flatlist';
import { FlatList, Linking, PermissionsAndroid } from 'react-native';
import { LeadDeleteApi } from '../../store/reducers/LeadReducer';
import DatetimePicker from '../childComponents/DatetimePicker'
import { FollowupCreateApi, FollowupGetApi, FollowupUpdateApi } from '../../store/reducers/FollowupReducer';
import { CustomDropdown } from '../childComponents/Dropdown';
import StyledButton from '../childComponents/StyledButton';
import { CreateCallApi } from '../../store/reducers/CallReducer';

function LeadDetails({ route, navigation }) {
    const [alertMessage, SetAlertMessage] = useState(null)
    const [showOptions, setShowOptions] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [followUPModal, setFollowUPModal] = useState(false);
    const [callModal, setCallModal] = useState(false);
    const [followUP, setFollowUP] = useState(null)
    const [followupTime, setFollowupTime] = useState(null)
    const [random, setRandom] = useState(null)
    const [loading, setLoading] = useState(true);
    const [callLoading, setCallLoading] = useState(false);

    const [leadList, setLeadList] = useState(null);
    const [leadList1, setLeadList1] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [callFormData, setCallFormData] = useState({
        call_disposition: '',
        remark: ''
    })
    const [callErrors, setCallErrors] = useState({
        call_disposition: false,
        remark: false
    });

    const dispatch = useDispatch()

    // status get
    const status = useSelector((state) => state.status);

    const followUpLists = useSelector((state) => state.followUp);
    //  data get from lead
    useEffect(() => {
        const updatedLeadData = route?.params?.leadData;
        if (updatedLeadData) {
            setLeadList(updatedLeadData);
        }
    }, [route.params?.leadData]);

    //  data get from formUpdate
    useEffect(() => {
        const updatedLeadData = route?.params?.updateLead;
        if (updatedLeadData) {
            setLeadList1(updatedLeadData);
        }
    }, [route.params?.updateLead]);


    // get history
    useEffect(() => {
        const fetchHistory = async () => {
            if (leadList) {
                try {
                    const uuid = leadList?.uuid;
                    const response = await dispatch(HistoryGetApi(uuid));
                    const newData = response?.payload?.data_list || [];
                    if (newData?.length > 0) {
                        setHistoryList(newData);
                    }
                } catch (error) {
                    console.error("Error fetching history:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchHistory();
    }, [leadList, leadList1, route.params?.meetingCreate, route.params?.taskCreate, random, route.params?.dealCreate]);

    // make custom history data for show on ui
    const data = useMemo(() => {
        return historyList?.map((item) => {
            let ob = {};
            ob.datetime = item?.created_at;
            ob.title = item?.status;
            ob.description = item?.feedback;
            return ob
        })
    }, [historyList])

    const renderTime = (rowData) => {
        const [date, time] = rowData.datetime.split(' ');
        return (
            <View style={stylesGrid.timeContainer}>
                <Text style={stylesGrid.time}>{time?.substr(0, 5)}</Text>
                <Text style={stylesGrid.date}>{date}</Text>
            </View>
        );
    };

    // delete lead
    const leadDelete = (leadDeleteID) => {
        if (leadDeleteID) {
            dispatch(LeadDeleteApi(leadDeleteID))
                .then((resp) => {
                    if (resp?.payload) {
                        if (resp?.payload?.message) {
                            navigation.navigate('Dashboard');
                            SetAlertMessage(resp?.payload?.message)
                        }
                        if (resp?.payload?.data) {
                            Alert.alert(resp?.payload?.data?.message);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };


    //  modal lead
    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    //  modal Activity
    const activityOptions = () => {
        setShowActivity(!showActivity);
    };

    // modal for follup
    const followUpMeeting = () => {
        setFollowUPModal(!followUPModal)
    };

    // time get from dateTimePicker
    const timeGet = useCallback((dt) => {
        if (dt) {
            setFollowUP(dt)
        }
    }, [])

    // followups create and update
    useEffect(() => {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + (followUP === 'today' ? 0 : followUP));
        let newDate = currentDate.toDateString();
        // data post
        if (followUpLists?.followUpList?.data_list?.length === 0) {
            if (followUP) {
                const data = {
                    p_id: leadList1 ? leadList1?.id : leadList?.id,
                    uuid: leadList1 ? leadList1?.uuid : leadList?.uuid,
                    remark: typeof followUP === 'number' ? newDate : (followUP === 'today' ? newDate : followUP) || followupTime
                }
                dispatch(FollowupCreateApi(data))
                    .then((resp) => {
                        if (resp) {
                            followUpGetData()
                            setRandom(Math.random())
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }

        // data update
        if (followUpLists?.followUpList?.data_list?.length > 0) {
            if (followUP) {
                const data = {
                    remark: typeof followUP === 'number' ? newDate : (followUP === 'today' ? newDate : followUP) || followupTime
                }
                const uuid = leadList?.uuid;

                dispatch(FollowupUpdateApi({ data, uuid }))
                    .then((resp) => {
                        if (resp) {
                            followUpGetData()
                            setRandom(Math.random())
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        }
    }, [followUP, followupTime])
    // followups dataGet

    const followUpGetData = async () => {
        try {
            const uuid = leadList?.uuid;
            if (uuid) {
                const resp = await dispatch(FollowupGetApi(uuid));
            } else {
                console.log('uuid is undefined. Data fetching may not have completed yet.');
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        followUpGetData();
    }, [leadList]);

    // for phone number
    const phoneNumber = useMemo(() => {
        return leadList?.phone?.length === 10 ? `tel:+91${leadList?.phone}`.replace(/\s/g, '') : `tel:${leadList?.phone}`.replace(/\s/g, '');
    }, [leadList, leadList1])

    // for whatsaap number
    const whatsappNumber = useMemo(() => {
        return leadList?.phone?.length === 10 ? `+91${leadList?.phone}`.replace(/\s/g, '') : `${leadList?.phone}`.replace(/\s/g, '')
    }, [leadList, leadList1])

    // notes share
    const handleTextPress = () => {
        const textToShare =
            leadList1?.note ?
                leadList1?.note :
                leadList?.note ?
                    leadList?.note :
                    `Lead Name: ${leadList?.lead_Name} Full Name: ${leadList?.fullName} Phone Number: ${leadList?.phone} Email: ${leadList?.email}`

        Share.share({
            message: textToShare,
            // You can also include additional options like title, subject, etc.
        })
            .then(result => console.log(result))
            .catch(error => console.error('Error sharing:', error));
    };
    // insert call data
    const callCreateModel = (id) => {
        setCallModal(id)
    }
    const createCall = () => {
        const data = {
            call_disposition: callFormData.call_disposition,
            remark: callFormData.remark,
            mobile: leadList?.phone,
            recording: "path/to/recording.mp3",
            talk_time: 15,
            owner_id: leadList?.Owner[0]?.id,
            p_id: leadList?.uuid
        }

        const errors = {};

        if (!data.remark) {
            errors.remark = true;
        }
        if (!data.call_disposition) {
            errors.call_disposition = true;
        }
        setCallErrors(errors);

        if (Object.values(errors).every((error) => !error)) {
            dispatch(CreateCallApi(data)).then((resp) => {
                if (resp?.payload?.message) {
                    setRandom(Math.random())
                    SetAlertMessage(resp?.payload?.message)
                    setCallModal(false)
                }
                console.log('resp', resp);
            }).catch((error) => {
                console.log('error', error);
            })
        }
        setCallLoading(true)
    }
    const [statusList, setStatusList] = useState([])


    useEffect(() => {
        const callDispositions = status?.status?.data?.call_disposition;
        if (callDispositions && callDispositions[0]) {
            setStatusList(callDispositions[0]);
        }
    }, [status]);

    const statusData = useMemo(() => {
        return statusList?.map((ele) => ({
            label: ele,
            value: ele,
        })) || [];
    }, [statusList]);
    const getData = useCallback((value) => {
        setCallFormData((prevState) => ({ ...prevState, call_disposition: value }))
    }, [])

    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])


    return (
        <PaperProvider>
            <AppHeader path="Lead" title="Lead Details" />
            <View style={stylesGrid.iconButtonContainer}>
                {/* header icon */}
                <IconButton
                    icon={() => <Icon style={{ color: "white" }} name="more-vert" size={24} />}
                    onPress={toggleOptions}
                />
            </View>

            <FlatList
                style={stylesGrid.scrollContainer}
                ListHeaderComponent={
                    <View>
                        <View>
                            <Text style={stylesGrid.leadNameText}>{leadList1 ? leadList1?.lead_Name : leadList?.lead_Name}</Text>
                        </View>
                    </View>
                }
                data={[1]}
                keyExtractor={() => 'lead'}
                renderItem={() => (
                    <View>

                        {followupTime === 'dateSelect' && <DatetimePicker timeGet={timeGet} />}

                        <View style={stylesGrid.actionIconsContainer}>
                            <TouchableOpacity onPress={() => { phoneCall(phoneNumber); callCreateModel(true) }}>
                                <View style={stylesGrid.iconBackground}>
                                    <Icon name="phone" size={22} style={stylesGrid.actionIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => sendTextMessage(phoneNumber)}>
                                <View style={stylesGrid.iconBackground}>
                                    <Icon name="chat" size={22} style={stylesGrid.actionIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => sendEmail(leadList?.email, leadList1 ? leadList1?.lead_Name : leadList?.lead_Name)}>
                                <View style={stylesGrid.iconBackground}>
                                    <Icon name="email" size={22} style={stylesGrid.actionIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => sendWhatsAppMessage(whatsappNumber)}>
                                <View style={stylesGrid.iconBackground}>
                                    <Ionicons name="logo-whatsapp" size={22} style={stylesGrid.actionIcon} />
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity /> */}
                        </View>
                        {/* FOLLOW UP */}
                        <View style={stylesGrid.followupContainer}>
                            <View style={stylesGrid.followupTopBorder} />
                            <View style={stylesGrid.followupContent}>
                                <View style={stylesGrid.followupHeader}>
                                    <TouchableOpacity onPress={followUpMeeting}>
                                        <Text style={stylesGrid.followupHead}>FOLLOW UP</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { navigation.navigate('LeadUpdate', { data: leadList1 ? leadList1 : leadList, statusUpdate: true, header: 'Status Update' }) }}>
                                        <Text style={stylesGrid.followupHeadRight}>Status</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesGrid.followupHeader}>
                                    <TouchableOpacity onPress={followUpMeeting}>
                                        {followUpLists?.loader ? (
                                            <Loading />
                                        ) : (
                                            followUpLists?.followUpList?.data_list?.filter((i, ind, ele) => {
                                                return ind === ele.length - 1;
                                            })?.map((item, index) => (
                                                <View key={index}>
                                                    <Text style={stylesGrid.followupFirstText}>{item?.remark}</Text>
                                                </View>
                                            ))
                                        )}
                                        {followUpLists?.followUpList?.data_list?.length === 0 && <Text style={stylesGrid.followupFirstText}>&#x2003;</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { navigation.navigate('LeadUpdate', { data: leadList1 ? leadList1 : leadList, statusUpdate: true, header: 'Status Update' }) }}>
                                        <Text style={stylesGrid.junkLeadText}>{leadList1 ? leadList1?.lead_status : leadList?.lead_status}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>


                        <View style={stylesGrid.followupContainer}>
                            <View style={stylesGrid.followupTopBorder} />
                            <View style={stylesGrid.followupHeader}>
                                <Text style={stylesGrid.followupHead}>NOTES</Text>
                                <TouchableOpacity style={stylesGrid.noteButton} onPress={handleTextPress}>
                                    <Text style={stylesGrid.noteButtonText}>
                                        <Icon name="share" size={24} style={stylesGrid.editIcon} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('LeadUpdate', { data: leadList1 ? leadList1 : leadList, notesUpdate: true, header: 'Note Update' }) }}>
                                {leadList1?.note ?
                                    <Text style={stylesGrid.noteText}>{leadList1?.note}</Text> :
                                    <>
                                        {leadList?.note ?
                                            <Text style={stylesGrid.noteText}>{leadList?.note}</Text>
                                            :
                                            <>
                                                <Text style={stylesGrid.noteText}>{leadList?.lead_Name}</Text>
                                                <Text style={stylesGrid.noteText}>Lead Source: {leadList?.lead_Source}</Text>
                                                <Text style={stylesGrid.noteText}>Full Name: {leadList?.fullName}</Text>
                                                <Text style={stylesGrid.noteText}>Phone Number: {leadList?.phone?.length === 10 ? `+91 ${leadList?.phone}` : leadList?.phone}</Text>
                                                <Text style={stylesGrid.noteText}>Email: {leadList?.email}</Text>
                                            </>
                                        }
                                    </>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={stylesGrid.followupContainer}>
                            <View style={stylesGrid.followupTopBorder} />
                            <Text style={stylesGrid.followupHead}>TIMELINE</Text>
                            <View style={stylesGrid.timelinePlus}>

                                <TouchableOpacity onPress={activityOptions}>
                                    <Text style={stylesGrid.addActivityText}>Add activity</Text>
                                </TouchableOpacity>
                            </View>
                            {loading ? (
                                <Loading />
                            ) : (
                                <Timeline
                                    data={data}
                                    renderTime={renderTime}
                                    circleSize={20}
                                    circleColor='rgb(45,156,219)'
                                    lineColor='rgb(45,156,219)'
                                    timeContainerStyle={{ minWidth: 52 }}
                                    descriptionStyle={{ color: 'black' }}
                                    options={{ style: { paddingTop: 5 } }}
                                    titleStyle={{ color: 'black' }}

                                />
                            )}
                        </View>
                    </View>
                )}
            />
            {/* modal for lead option */}
            <Modal
                visible={showOptions}
                animationType="slide"
                transparent
                onRequestClose={toggleOptions}
            >
                <View style={stylesGrid.modalContainer}>
                    <View style={stylesGrid.modalContent}>
                        <TouchableOpacity onPress={toggleOptions}>
                            <View style={{ backgroundColor: "#ccc", padding: 10 }}>
                                <Text style={stylesGrid.editText}>Options</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleOptions(); navigation.navigate('LeadUpdate', { data: leadList1 ? leadList1 : leadList, updateLeadData: true, header: 'Update Lead Information' }) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="edit" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Edit client</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleOptions}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="group-add" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Add to groups</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleOptions}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="star" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Mark as New Lead</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleOptions}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="contacts" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Add to phonebook</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleOptions(); leadDelete(leadList?.uuid) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="delete" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Delete client</Text>
                            </View>
                        </TouchableOpacity>
                        <Button icon={() => <Icon name="cancel" color="black" buttonStyle={stylesGrid.cancelButton} size={24} />} onPress={toggleOptions} />
                    </View>
                </View>
            </Modal>

            {/* modal for Activity */}
            <Modal
                visible={showActivity}
                animationType="slide"
                transparent
                onRequestClose={activityOptions}
            >
                <View style={stylesGrid.modalContainer}>
                    <View style={stylesGrid.modalContent}>
                        <TouchableOpacity onPress={activityOptions}>
                            <View style={{ backgroundColor: "#ccc", padding: 10 }}>
                                <Text style={stylesGrid.editText}>Add Activity</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { activityOptions(), phoneCall(phoneNumber); }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="call" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Phone Call</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { sendTextMessage(phoneNumber), activityOptions() }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="message" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Message</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { activityOptions(); navigation.navigate('LeadUpdate', { data: leadList1 ? leadList1 : leadList, leadTransfer: true, header: 'Lead Transfer' }) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="share" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Lead Transfer</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { activityOptions(); navigation.navigate('ActivityCreateMeeting', { data: leadList1 ? leadList1 : leadList }) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="videocam" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Meeting</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { activityOptions(); navigation.navigate('TaskCreate', { data: leadList1 ? leadList1 : leadList }) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="task" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Task</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { activityOptions(); navigation.navigate('DealCreate', { data: leadList }) }}>
                            <View style={stylesGrid.editContainer}>
                                <Icon name="local-offer" size={24} style={stylesGrid.editIcon} />
                                <Text style={stylesGrid.editText}>Deal</Text>
                            </View>
                        </TouchableOpacity>
                        <Button icon={() => <Icon name="cancel" color="black" size={24} buttonStyle={stylesGrid.cancelButton} />} onPress={activityOptions} />
                    </View>
                </View>
            </Modal>

            {/* modal for followup */}

            <Modal
                visible={followUPModal}
                animationType="slide"
                transparent
                onRequestClose={followUpMeeting}
            >
                <View style={stylesGrid.modalContainer}>
                    <View style={stylesGrid.modalContent}>
                        <TouchableOpacity onPress={followUpMeeting}>
                            <View style={{ backgroundColor: "#ccc", padding: 10 }}>
                                <Text style={stylesGrid.editText}>Schedule follow up for</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP('today') }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>Today</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP(1) }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>Tomorrow</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP(3) }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>3 days from now</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP(7) }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>1 week from now</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP(30) }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>1 month from now</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowupTime('dateSelect') }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>Select custom date and time</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { followUpMeeting(), setFollowUP('someday') }}>
                            <View style={stylesGrid.editContainer}>
                                <Text style={stylesGrid.editText}>Someday</Text>
                            </View>
                        </TouchableOpacity>

                        <Button icon={() => <Icon name="cancel" color="black" size={24} buttonStyle={stylesGrid.cancelButton} />} onPress={followUpMeeting} />
                    </View>
                </View>
            </Modal>

            {/* modal for insert call data */}

            <Modal
                visible={callModal}
                animationType="slide"
                transparent
                onRequestClose={callCreateModel}
            >
                <View style={stylesGrid.modalContainer}>
                    <View style={stylesGrid.modalContent}>
                        <View style={{ backgroundColor: "#ccc", padding: 10 }}>
                            <Text style={stylesGrid.editText}>Call</Text>
                        </View>
                        <View style={{ margin: 10 }}>
                            <CustomDropdown
                                data={statusData}
                                getData={getData}
                                placeholderValue='Call Disposition' />
                            {callErrors.call_disposition && <Text style={stylesGrid.errorText}>The call disposition field required.</Text>}
                        </View>

                        <View style={stylesGrid.editContainer}>
                            <TextInput
                                style={stylesGrid.TextInput}
                                value={callFormData.remark}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                                placeholder='Remarks'
                                onChangeText={(val) => setCallFormData((prevState) => ({ ...prevState, remark: val }))}
                            />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            {callErrors.remark && <Text style={stylesGrid.errorText}>The remark field required.</Text>}
                        </View>
                        <View style={stylesGrid.callSave}>
                            {callLoading && <Loading size='small' />}
                            <StyledButton
                                title='Save'
                                onPress={createCall}
                            />
                        </View>

                        <Button icon={() => <Icon name="cancel" color="black" size={24} buttonStyle={stylesGrid.cancelButton} />} onPress={() => callCreateModel(false)} />
                    </View>
                </View>
            </Modal>

            <BottomNavigation />
        </PaperProvider>
    );
}

export default memo(LeadDetails);

const stylesGrid = StyleSheet.create({
    scrollContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTextContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    headerText: {
        color: 'black',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 5,
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        borderStyle: 'solid',

    },
    editIcon: {
        marginRight: 10,
        color: '#006094'
    },
    editText: {
        fontSize: 16,
        color: '#006094',
    },
    iconButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 0,
        zIndex: 1,
    },
    leadNameText: {
        fontSize: 15,
        fontWeight: 500,
        color: "black"
    },
    actionIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    actionIcon: {
        color: '#fff',
    },
    iconBackground: {
        backgroundColor: '#17A2B7',
        borderRadius: 50,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    followupTopBorder: {
        height: 1, // Define the height of the top border
        backgroundColor: '#ccc', // Change the border color
        marginTop: 1, // Adjust the top margin as needed
    },
    followupBottomBorder: {
        height: 2, // Define the height of the bottom border
        backgroundColor: '#ccc', // Change the border color
        marginBottom: 5, // Adjust the bottom margin as needed
    },
    timeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    time: {
        fontSize: 16,
        color: 'black',
    },
    date: {
        fontSize: 12,
        color: 'black',
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        width: 53,
        height: 53,
        backgroundColor: "#17A2B7",
        right: 200,
        position: "absolute",
        zIndex: 9,
        bottom: -55,
    },
    timelinePlus: {
        marginLeft: 80,
        marginTop: -25,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    addActivityText: {
        color: 'white',
        backgroundColor: '#17A2B7',
        marginLeft: 10,
        marginTop: 5,
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 15,
        textAlign: 'center',
        borderRadius: 5
    },
    loginBtn: {
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: 'black'
    },
    followupContainer: {
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },

    followupContent: {
        flexDirection: 'column',
    },

    followupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    followupHead: {
        fontWeight: 'bold',
        fontSize: 12,
        padding: 5,
        color: 'black',
    },

    followupHeadRight: {
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
        color: 'black',
        textAlign: 'right',
    },

    followupFirstText: {
        paddingLeft: 5,
        fontSize: 13,
        color: '#006094',
    },

    junkLeadText: {
        paddingLeft: 5,
        fontSize: 13,
        color: '#006094',
        textAlign: 'right'
    },
    noteText: {
        paddingLeft: 5,
        paddingBottom: 2,
        fontSize: 13,
        color: 'black',
    },
    noteButton: {
        marginTop: 10,
    },
    noteButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    TextInput: {
        padding: 5,
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        color: "#000",
        marginBottom: 10,
        width: "97%",
        borderRadius: 4, // Add border radius for rounded corners
    },
    callSave: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        borderStyle: 'solid',

    },
    errorText: {
        color: "#a90606",
    },
});
