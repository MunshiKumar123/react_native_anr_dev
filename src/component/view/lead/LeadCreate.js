import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { globalStatusDropdownOptions } from '../../../service/_status'
import { displayToast } from '../../../service/_helpers'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LeadFormData, LeadCreateApi, UserListGetApi } from '../../store/reducers/LeadReducer';
import { CustomDropdown, DropdownList } from '../childComponents/Dropdown'
import StyledButton from '../childComponents/StyledButton'


function LeadCreate({ navigation, route }) {
    const dispatch = useDispatch()
    const leadData = useSelector((state) => state.lead);
    const status = useSelector((state) => state.status);
    const [leadStatus, setLeadStatus] = useState([])
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(false);
    const [credentialsError, setCredentialsError] = useState('')
    const [alertMessage, SetAlertMessage] = useState(null)
    const [errorStore, setErrorStore] = useState([])
    const [formErrors, setFormErrors] = useState({
        Owner: false,
    });

    const CrLed = () => {
        const data = {
            lead_Name: leadData.lead_Name || "",
            fullName: leadData.fullName || "",
            email: leadData.email || "",
            phone: leadData.phone || "",
            lead_status: leadData.lead_status || "New",
            lead_Source: "Vert-age",
            owner_id: getUser?.id
        };
        const errors = {};
        if (!data.owner_id) {
            errors.owner_id = true;
        }
        setFormErrors(errors);
        if (Object.values(errors).every((error) => !error)) {
            dispatch(LeadCreateApi(data))
                .then((resp) => {
                    if (resp?.payload) {
                        if (resp?.payload?.message) {
                            navigation.navigate('Lead', { LeadCreateData: true });
                            SetAlertMessage(resp?.payload?.message)
                            setLoading(false);
                            dispatch(LeadFormData({ prop: 'lead_Name', value: '' }))
                            dispatch(LeadFormData({ prop: 'fullName', value: '' }))
                            dispatch(LeadFormData({ prop: 'email', value: '' }))
                            dispatch(LeadFormData({ prop: 'phone', value: '' }))
                            dispatch(LeadFormData({ prop: 'Owner', value: '' }))
                            dispatch(LeadFormData({ prop: 'lead_status', value: '' }))

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

    useEffect(() => {
        if (route.params?.userLists) {
            const { userLists } = route.params;
            setUserList(userLists)
        }
    }, [route.params?.userLists]);

    //  user list in the drop down
    const data = useMemo(() => {
        return userList?.map((item) => {
            let obj = {}
            obj.label = item?.uname + " | " + item?.role?.role_name
            obj.value = item?.id;
            return obj
        })
    }, [userList])

    const [value, setValue] = useState(null);
    // id get form DropDownList
    const getID = useCallback((id) => {
        setValue(id)
    }, [])

    const getUser = useMemo(() => {
        return leadData?.userLists?.userlist?.find(ele => ele?.id === value)
    }, [value])

    // drop down for status
    useEffect(() => {
        if (status?.status?.data?.lead_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.lead_status);
            setLeadStatus(dropdownOptions);
        }
    }, [status]);
    const getStatusData = useCallback((value) => {
        dispatch(LeadFormData({ prop: 'lead_status', value: value }))
    }, [])

    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])
    return (
        <PaperProvider>
            <AppHeader path="Lead" title='Lead Creation' />
            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>
                    <View style={{ marginBottom: 10 }}>
                        <DropdownList
                            data={data}
                            getID={getID}
                            placeholderValue='Owner Name' />
                    </View>
                    {formErrors.Owner && <Text style={stylesGrid.errorText}>Please select user list.</Text>}
                    <View style={{ marginBottom: 7 }}>
                        <CustomDropdown
                            data={leadStatus}
                            getData={getStatusData}
                            placeholderValue='Lead Status' />
                    </View>
                    <Text style={stylesGrid.textlabel}>Lead Name</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={leadData.lead_Name}
                        onChangeText={(val) => dispatch(LeadFormData({ prop: 'lead_Name', value: val }))}
                    />
                    {errorStore['lead_Name'] && <Text style={stylesGrid.errorText}>{errorStore['lead_Name']}</Text>}

                    <Text style={stylesGrid.textlabel}>Full Name</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={leadData.fullName}
                        onChangeText={(val) => dispatch(LeadFormData({ prop: 'fullName', value: val }))}
                    />
                    {errorStore['fullName'] && <Text style={stylesGrid.errorText}>{errorStore['fullName']}</Text>}

                    <Text tyle={stylesGrid.textlabel}>Email Id</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={leadData.email}
                        onChangeText={(val) => dispatch(LeadFormData({ prop: 'email', value: val }))}
                    />
                    {errorStore['email'] && <Text style={stylesGrid.errorText}>{errorStore['email']}</Text>}

                    <Text style={stylesGrid.textlabel}>Phone</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        keyboardType="number-pad"
                        value={leadData.phone}
                        onChangeText={(val) => dispatch(LeadFormData({ prop: 'phone', value: val }))}
                    />
                    {errorStore['phone'] && <Text style={stylesGrid.errorText}>{errorStore['phone']}</Text>}
                    {credentialsError ?
                        <Text style={{ color: 'red' }}> {credentialsError} </Text>
                        : null
                    }
                    {loading && <Loading size='small' />}
                    <StyledButton
                        title="Save"
                        onPress={CrLed}
                    />
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}

export default memo(LeadCreate)


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
        borderRadius: 4,
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
