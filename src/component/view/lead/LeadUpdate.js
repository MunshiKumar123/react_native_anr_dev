import React, { memo, useEffect, useCallback, useState, useMemo } from 'react'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LeadUpdateApi } from '../../store/reducers/LeadReducer';
import { CustomDropdown } from '../childComponents/Dropdown'
import StyledButton from '../childComponents/StyledButton'
import { globalStatusDropdownOptions } from '../../../service/_status';
import { custumOwnerList, displayToast } from '../../../service/_helpers'



function LeadUpdate({ route, navigation }) {
    const ownerData = useSelector((state) => state.lead);
    const status = useSelector((state) => state.status);
    const [ownerListDropDown, SetOwnerListDropDown] = useState([])
    const dispatch = useDispatch()
    const [leadStatus, setLeadStatus] = useState([])
    const [loading, setLoading] = useState(false);
    const [alertMessage, SetAlertMessage] = useState(null)
    const [credentialsError, setCredentialsError] = useState('')
    const [errorStore, setErrorStore] = useState([])
    const [ownerNameData, setOwnerNameData] = useState(null)
    const [notChange, setNotChange] = useState(null)
    const [leadData, setLeadData] = useState({
        lead_Name: '',
        fullName: '',
        email: '',
        phone: '',
        lead_status: '',
        note: '',
        uuid: '',
    })
    const [formErrors, setFormErrors] = useState({
        owner_id: false,
    });

    // data get from lead details
    useEffect(() => {
        const { data } = route.params;
        setLeadData({
            lead_Name: data?.lead_Name,
            fullName: data?.fullName,
            email: data?.email,
            phone: data?.phone,
            lead_status: data?.lead_status,
            note: data?.note || `Lead Name: ${data?.lead_Name}\nLead Source: ${data?.lead_Source}\nFull Name: ${data?.fullName}\nPhone Number: ${data?.phone?.length === 10 ? `+91 ${data?.phone}` : data?.phone
                }\nEmail: ${data?.email}`,
            uuid: data?.uuid
        })
    }, [route.params]);
    const updateLead = () => {
        const data = {
            lead_Name: leadData.lead_Name || route.params?.data?.lead_Name,
            fullName: leadData.fullName || route.params?.data?.fullName,
            email: leadData.email || route.params?.data?.email,
            phone: leadData.phone || route.params?.data?.phone,
            lead_status: leadData.lead_status || route.params?.data?.lead_status,
            note: leadData.note,
            owner_id: route.params?.data?.Owner[0]?.id
        };
        const uuid = leadData.uuid;

        // data trandfer to lead details
        const updateLead = {
            lead_Name: leadData.lead_Name || route.params?.data?.lead_Name,
            fullName: leadData.fullName || route.params?.data?.fullName,
            email: leadData.email || route.params?.data?.email,
            phone: leadData.phone || route.params?.data?.phone,
            lead_status: leadData.lead_status || route.params?.data?.lead_status,
            note: leadData.note,
            uuid: leadData.uuid,
            Owner: route.params?.data?.Owner
        };

        dispatch(LeadUpdateApi({ data, uuid }))
            .then((resp) => {
                if (resp?.payload) {
                    if (resp?.payload?.message) {
                        navigation.navigate('LeadDetails', { updateLead: updateLead })
                        SetAlertMessage(resp?.payload?.message)
                    }
                    if (resp?.payload?.data?.errors) {
                        setErrorStore(resp?.payload?.data?.errors)
                        setLoading(false);
                    }
                    if (resp?.payload?.data?.message) {
                        setLoading(false);
                        setNotChange(resp?.payload?.data?.message)
                    }


                } else {
                    setCredentialsError('Invalid credentials. Please try again.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        setLoading(true);
    };

    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])

    // lead tranfer

    const leadTransfer = () => {

        const data = {
            lead_Name: route.params?.data?.lead_Name,
            fullName: route.params?.data?.fullName,
            email: route.params?.data?.email,
            phone: route.params?.data?.phone,
            lead_status: route.params?.data?.lead_status,
            Owner: ownerNameData?.id,
            owner_id: ownerNameData?.id,
            role_id: ownerNameData?.role?.id,
        };
        const uuid = leadData.uuid;

        const errors = {};

        if (!data.owner_id) {
            errors.owner_id = true;
        }

        setFormErrors(errors);
        if (Object.values(errors).every((error) => !error)) {

            dispatch(LeadUpdateApi({ data, uuid }))
                .then((resp) => {
                    if (resp?.payload) {
                        if (resp?.payload?.message) {
                            navigation.navigate('LeadDetails')
                            SetAlertMessage(`Lead has been transferred to ${ownerNameData?.uname}.`)
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
    }

    // get owner list
    useEffect(() => {
        if (ownerData?.userLists?.userlist) {
            const ownerCustomData = custumOwnerList(ownerData?.userLists?.userlist || [])
            SetOwnerListDropDown(ownerCustomData)
        }
    }, [ownerData])

    const getOwnerId = useCallback((id) => {
        const getUserData = ownerData?.userLists?.userlist?.find(ele => ele.id === id)
        setOwnerNameData(getUserData)
    }, [ownerNameData])

    // drop down for status
    useEffect(() => {
        if (status?.status?.data?.lead_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.lead_status);
            setLeadStatus(dropdownOptions);
        }
    }, [status]);
    const getData = useCallback((value) => {
        setLeadData((prevState) => ({ ...prevState, lead_status: value }))
    }, [])

    return (
        <PaperProvider>
            <AppHeader path="LeadDetails" title={route?.params?.header || 'Update Lead Information'} />
            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>
                    {/* note update */}
                    {route?.params?.notesUpdate && (
                        <>
                            <Text style={stylesGrid.textlabel}>Note</Text>
                            <TextInput
                                style={stylesGrid.TextInput}
                                value={leadData.note}
                                multiline={true}
                                numberOfLines={7}
                                textAlignVertical="top"
                                onChangeText={(val) => setLeadData((prevState) => ({ ...prevState, note: val }))} />
                        </>)}

                    {route?.params?.updateLeadData && (
                        <>
                            <Text style={stylesGrid.textlabel}>Lead Name</Text>
                            <TextInput
                                style={stylesGrid.TextInput}
                                value={leadData.lead_Name}
                                onChangeText={(val) => setLeadData((prevState) => ({ ...prevState, lead_Name: val }))}
                            />

                            <Text style={stylesGrid.textlabel}>Full Name</Text>
                            <TextInput
                                style={stylesGrid.TextInput}
                                value={leadData.fullName}
                                onChangeText={(val) => setLeadData((prevState) => ({ ...prevState, fullName: val }))}
                            />
                            <Text style={stylesGrid.textlabel}>Email Id</Text>
                            <TextInput
                                style={stylesGrid.TextInput}
                                value={leadData.email}
                                onChangeText={(val) => setLeadData((prevState) => ({ ...prevState, email: val }))}
                            />
                            {errorStore['email'] && <Text style={stylesGrid.errorText}>{errorStore['email']}</Text>}

                            <Text style={stylesGrid.textlabel}>Phone</Text>
                            <TextInput
                                style={stylesGrid.TextInput}
                                keyboardType="number-pad"
                                value={leadData.phone}
                                onChangeText={(val) => setLeadData((prevState) => ({ ...prevState, phone: val }))} />
                            {errorStore['phone'] && <Text style={stylesGrid.errorText}>{errorStore['phone']}</Text>}
                        </>
                    )}

                    {/* status update */}
                    {route?.params?.statusUpdate &&
                        <CustomDropdown
                            data={leadStatus}
                            getData={getData}
                            placeholderValue={route.params?.data?.lead_status || 'Lead Status'} />
                    }
                    {credentialsError ?
                        <Text style={{ color: 'red' }}> {credentialsError} </Text>
                        : null
                    }

                    {/* owner name list */}
                    {route?.params?.leadTransfer &&
                        <CustomDropdown
                            data={ownerListDropDown}
                            getData={getOwnerId}
                            placeholderValue='Owner name' />}
                    {formErrors.owner_id && <Text style={stylesGrid.errorText}>Please select owner name.</Text>}

                    {/* if no changes then throw error */}
                    {notChange && <Text style={stylesGrid.errorText}>{notChange}</Text>}

                    {loading && <Loading size='small' />}

                    {
                        !route?.params?.leadTransfer && <StyledButton
                            title="Update"
                            onPress={updateLead} />
                    }
                    {
                        route?.params?.leadTransfer && <StyledButton
                            title="Lead Transfer"
                            onPress={leadTransfer} />
                    }
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}

export default memo(LeadUpdate)


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
        padding: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        color: "#000",
        marginTop: 1,
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
        color: 'red',
        marginLeft: 5
    }

});