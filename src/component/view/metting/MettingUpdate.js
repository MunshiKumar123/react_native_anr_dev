import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Alert, StyleSheet, View } from 'react-native';
import { updateMeetingApi } from '../../store/reducers/MettingReducer';
import { useDispatch, useSelector } from 'react-redux';
import { CustomDropdown } from '../childComponents/Dropdown'
import StyledButton from '../childComponents/StyledButton';
import { UserListGetApi } from '../../store/reducers/LeadReducer';
import { globalStatusDropdownOptions } from '../../../service/_status';
import { custumOwnerList, displayToast } from '../../../service/_helpers';


function MettingUpdate({ navigation, route }) {
    const dispatch = useDispatch()
    const ownerData = useSelector((state) => state.lead);
    const status = useSelector((state) => state.status);
    const [ownerListDropDown, SetOwnerListDropDown] = useState([])
    const [alertMessage, SetAlertMessage] = useState(null)
    const [meetingStatus, setMeetingStatus] = useState([])
    const [errortext, setErrortext] = useState('')
    const [loading, setLoading] = useState(false);
    const [ownerNameData, setOwnerNameData] = useState(null)
    const [notChange, setNotChange] = useState(null)
    const [formData, setFormData] = useState({
        status: "",
    })
    const [formErrors, setFormErrors] = useState({
        owner_id: false,
    });
    const [transferData, setTransferData] = useState({
        owner_id: "",
    })

    const updateMeeting = () => {
        const data = {
            p_id: route?.params?.meetingData?.p_id,
            title: route?.params?.meetingData?.title,
            to: route?.params?.meetingData?.to,
            related: route?.params?.meetingData?.related[0]?.lead_Name,
            status: formData.status || route?.params?.meetingData?.status,
        };
        const uuid = route?.params?.meetingData?.uuid
        dispatch(updateMeetingApi({ data, uuid }))
            .then((resp) => {
                if (resp?.payload) {
                    if (resp?.payload?.message) {
                        navigation.navigate('MeetingDetails', { mettingUpdate: data })
                        SetAlertMessage(resp?.payload?.message)
                    }
                    if (resp?.payload?.data?.message) {
                        setLoading(false);
                        setNotChange(resp?.payload?.data?.message)
                    }
                } else {
                    setErrortext('Invalid credentials. Please try again.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        setLoading(true);
    };

    // transfer meeting
    const transferMeeting = () => {
        const data = {
            p_id: route?.params?.meetingData?.p_id,
            title: route?.params?.meetingData?.title,
            to: route?.params?.meetingData?.to,
            related: route?.params?.meetingData?.related[0]?.lead_Name,
            status: route?.params?.meetingData?.status,
            Owner: ownerNameData?.id,
            owner_id: ownerNameData?.id,
            role_id: ownerNameData?.role?.id,
        };
        const uuid = route?.params?.meetingData?.uuid

        const errors = {};
        if (!data.owner_id) {
            errors.owner_id = true;
        }
        setFormErrors(errors);

        if (Object.values(errors).every((error) => !error)) {
            dispatch(updateMeetingApi({ data, uuid }))
                .then((resp) => {
                    if (resp?.payload) {
                        if (resp?.payload?.message) {
                            navigation.navigate('MeetingDetails', { mettingUpdate: data })
                            SetAlertMessage(`Meeting  has been transferred to ${ownerNameData?.uname}.`)
                        }
                    } else {
                        setErrortext('Invalid credentials. Please try again.');
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

    // owner name
    useEffect(() => {
        dispatch(UserListGetApi())
    }, [])

    useEffect(() => {
        if (ownerData?.userLists?.userlist) {
            const ownerCustomData = custumOwnerList(ownerData?.userLists?.userlist || [])
            SetOwnerListDropDown(ownerCustomData)
        }
    }, [ownerData])
    const getOwnerId = useCallback((id) => {
        setTransferData((prevState) => ({ ...prevState, owner_id: id }))
    }, [])
    // get owner details
    useEffect(() => {
        const getUserData = ownerData?.userLists?.userlist?.find(ele => ele.id === transferData?.owner_id)
        setOwnerNameData(getUserData)
    }, [transferData])

    // status label
    useEffect(() => {
        if (status?.status?.data?.meeting_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.meeting_status);
            setMeetingStatus(dropdownOptions);
        }
    }, [status]);

    const getData = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, status: value }))
    }, [])

    return (
        <PaperProvider>
            <AppHeader path={"MeetingDetails"} title={route?.params?.header || 'Update Meeting Information'} />
            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>
                    {!route?.params?.meetingTransfer &&
                        <View style={{ marginTop: 17 }}>
                            <CustomDropdown
                                data={meetingStatus}
                                getData={getData}
                                placeholderValue={route?.params?.meetingData?.status || 'status'} />
                        </View>
                    }

                    {route?.params?.meetingTransfer &&
                        <CustomDropdown
                            data={ownerListDropDown}
                            getData={getOwnerId}
                            placeholderValue='Owner name' />}

                    {formErrors.owner_id && <Text style={stylesGrid.errorText}>Please select owner name.</Text>}

                    {errortext ?
                        <Text style={{ color: 'red' }}> {errortext} </Text>
                        : null
                    }
                    {/* if no changes then throw error */}
                    {notChange && <Text style={stylesGrid.errorText}>{notChange}</Text>}

                    {loading && <Loading size='small' />}
                    {!route?.params?.meetingTransfer &&
                        <StyledButton
                            title="Update"
                            onPress={updateMeeting}
                        />
                    }
                    {route?.params?.meetingTransfer &&
                        <StyledButton
                            title="Meeting Transfer"
                            onPress={transferMeeting}
                        />
                    }
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}

export default memo(MettingUpdate)


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