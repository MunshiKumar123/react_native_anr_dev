import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import Loading from '../../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../../navigation/AppHeader';
import BottomNavigation from '../../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createMettingApi } from '../../../store/reducers/MettingReducer';
import { Calendar } from 'react-native-calendars';
import DataIcon from 'react-native-vector-icons/MaterialIcons';
import { DropdownList, CustomDropdown } from '../../childComponents/Dropdown'
import StyledButton from '../../childComponents/StyledButton';
import { globalStatusDropdownOptions } from '../../../../service/_status';
import { displayToast, custumOwnerList } from '../../../../service/_helpers'



function ActivityCreateMeeting({ navigation, route }) {
    const dispatch = useDispatch()
    const status = useSelector((state) => state.status);
    const ownerData = useSelector((state) => state.lead);
    const [ownerListDropDown, SetOwnerListDropDown] = useState([])
    const [alertMessage, SetAlertMessage] = useState(null)
    const [meetingStatus, setMeetingStatus] = useState([])
    const [meetingStatusRelated, setMeetingStatusRelated] = useState([])
    const [loading, setLoading] = useState(false);
    const [credentialsError, setCredentialsError] = useState('')
    const [errorStore, setErrorStore] = useState([])
    const [formData, setFormData] = useState({
        title: "",
        to: "",
        from: null,
        related: "",
        contactName: "",
        contactNumber: "",
        status: "",
        p_id: "",
        owner_id: ""
    })
    const [formErrors, setFormErrors] = useState({
        owner_id: false,
    });

    const [meetingUserLists, setMeetingUserLists] = useState([])
    //  data get from leadDetails
    useEffect(() => {
        if (route.params?.data) {
            const { data } = route.params;
            setFormData({
                to: "",
                title: data?.lead_Name,
                contactName: data?.fullName,
                contactNumber: data?.phone,
                p_id: data?.uuid,
                owner_id: data?.Owner[0]?.id
            })
        }

    }, [route.params?.data]);

    // data get from meeting list
    useEffect(() => {
        const { meetingsList } = route.params;
        setMeetingUserLists(meetingsList)
    }, [route.params?.meetingsList]);

    const createMeeting = () => {
        const data = {
            title: formData.title || route.params?.data?.lead_Name || getUser?.related[0]?.lead_Name,
            to: formData.to,
            from: formData.from,
            related: formData?.related,
            status: formData?.status || "new",
            contactName: formData.contactName || route.params?.data?.fullName || getUser?.fullName,
            contactNumber: formData.contactNumber || route.params?.data?.phone || getUser?.phone,
            p_id: formData?.p_id,
            owner_id: formData?.owner_id
        };

        const errors = {};
        if (!data.owner_id) {
            errors.owner_id = true;
        }
        setFormErrors(errors);
        if (Object.values(errors).every((error) => !error)) {
            dispatch(createMettingApi(data))
                .then((resp) => {
                    if (resp?.payload) {

                        if (resp?.payload?.message) {
                            if (getUser) {
                                navigation.navigate('MettingList', { meetingRender: true })
                            } else {
                                navigation.navigate('LeadDetails', { meetingCreate: data })
                            }
                            SetAlertMessage(resp?.payload?.message)
                        }
                        if (resp?.payload?.data?.errors) {
                            setErrorStore(resp?.payload?.data?.errors)
                            setLoading(false);
                        }
                    } else {
                        setCredentialsError('Invalid credentials. Please try again.');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        setLoading(true);
    };
    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])

    //for Calendar
    const [openCalendar, setOpenCalendar] = useState(false);

    const calClose = () => {
        setOpenCalendar(false)
    }

    //  metting user list in the drop down
    const data = useMemo(() => {
        return meetingUserLists?.map((item) => {
            let emailID = '';
            item?.related?.forEach(element => {
                emailID = element?.email
            });
            let obj = {}
            obj.label = item?.contactName + " | " + item?.contactNumber + " | " + emailID
            obj.value = item?.uuid;
            return obj
        })
    }, [meetingUserLists])
    const [value, setValue] = useState(null);

    // id get form DropDownList
    const getID = useCallback((id) => {
        setValue(id)
    }, [])
    const getUser = useMemo(() => {
        return meetingUserLists?.find(ele => ele?.uuid === value)
    }, [value])

    useEffect(() => {
        if (getUser) {
            setFormData({
                to: "",
                title: getUser?.related[0]?.lead_Name,
                from: null,
                contactName: getUser?.contactName,
                contactNumber: getUser?.contactNumber,
                p_id: getUser?.p_id,
                owner_id: getUser?.owner_id[0]?.id
            })
        }
    }, [getUser])


    // status and related to
    useEffect(() => {
        if (status?.status?.data?.meeting_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.meeting_status);
            setMeetingStatus(dropdownOptions);
        }
        if (status?.status?.data?.related_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.related_status);
            setMeetingStatusRelated(dropdownOptions);
        }

    }, [status]);

    const getData = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, status: value }))
    }, [])

    const getRelated = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, related: value }))
    }, [])

    // get owner list
    useEffect(() => {
        if (ownerData?.userLists?.userlist) {
            const ownerCustomData = custumOwnerList(ownerData?.userLists?.userlist || [])
            SetOwnerListDropDown(ownerCustomData)
        }
    }, [ownerData])
    // id get form DropDownList
    const getOwnerId = useCallback((id) => {
        setFormData((prevState) => ({ ...prevState, owner_id: id }))
    }, [])
    return (
        <PaperProvider>
            <AppHeader path={meetingUserLists?.length > 0 ? "Dashboard" : "LeadDetails"} title='Meeting Creation' />
            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>
                    <View style={{ marginBottom: 6 }}>
                        {meetingUserLists?.length > 0 &&
                            <DropdownList
                                data={data}
                                getID={getID}
                                placeholderValue='Meetings subject' />
                        }
                    </View>
                    {formErrors.owner_id && <Text style={stylesGrid.errorText}>Please select meetings list.</Text>}
                    <View style={{ marginBottom: 6 }}>
                        <CustomDropdown
                            data={ownerListDropDown}
                            getData={getOwnerId}
                            placeholderValue='Owner name' />
                    </View>
                    <Text style={stylesGrid.textlabel}>Meeting Subject</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.title}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, title: val }))} />
                    {errorStore['title'] && <Text style={stylesGrid.errorText}>{errorStore['title']}</Text>}
                    <Text style={stylesGrid.textlabel}>Meeting Date</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.to}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, to: val }))} />
                    <DataIcon name="date-range" size={35} color="#007AFF" style={{ textAlign: 'right', marginTop: -48 }} onPress={() => setOpenCalendar(!openCalendar)} />
                    {errorStore['to'] && <Text style={stylesGrid.errorText}>{errorStore['to']}</Text>}
                    {openCalendar &&
                        <View>
                            <Calendar
                                onDayPress={(day) => {
                                    setFormData((prevState) => ({ ...prevState, to: day.dateString })); calClose()
                                }}
                            />
                        </View>
                    }
                    <View style={{ marginTop: 17 }}>
                        <CustomDropdown
                            data={meetingStatus}
                            getData={getData}
                            placeholderValue='status' />
                    </View>
                    <View style={{ marginTop: 17 }}>
                        <CustomDropdown
                            data={meetingStatusRelated}
                            getData={getRelated}
                            placeholderValue='Related To' />
                        {errorStore['related'] && <Text style={stylesGrid.errorText}>{errorStore['related']}</Text>}
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={stylesGrid.textlabel}>Contact Name</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.contactName}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, contactName: val }))}
                        />
                        <Text style={stylesGrid.textlabel}>Contact Number</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            keyboardType="number-pad"
                            value={formData.contactNumber}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, contactNumber: val }))}

                        />
                    </View>
                    {credentialsError ?
                        <Text style={{ color: 'red' }}> {credentialsError} </Text>
                        : null
                    }
                    {loading && <Loading size='small' />}
                    <StyledButton
                        title="Save"
                        onPress={createMeeting}
                    />
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider >
    )
}

export default memo(ActivityCreateMeeting)

const stylesGrid = StyleSheet.create({
    scrollContainer: {
        padding: 10,
        backgroundColor: '#ededed'
    },
    inputView: {
        width: "100%",
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 10,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)', // Set box shadow color
        shadowOffset: { width: 0, height: 2 }, // Set box shadow offset
        shadowOpacity: 1, // Set box shadow opacity
        shadowRadius: 4, // Set box shadow radius
        elevation: 2, // For Android shadow
    },

    TextInput: {
        flex: 1,
        padding: 7,
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        color: "#000",
        marginBottom: 10,
        width: "100%",
        borderRadius: 4, // Add border radius for rounded corners
    },
    textlabel: {
        textAlign: "left",
        marginLeft: 2,
        color: "#000"
    },

    errorText: {
        color: "#a90606",
        marginLeft: 5

    },

});