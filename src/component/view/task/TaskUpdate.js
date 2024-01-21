import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TaskUpdateApi } from '../../store/reducers/TaskReducer';
import { CustomDropdown } from '../childComponents/Dropdown'
import StyledButton from '../childComponents/StyledButton';
import { globalStatusDropdownOptions } from '../../../service/_status';
import { custumOwnerList, displayToast } from '../../../service/_helpers';


function TaskUpdate({ navigation, route }) {
    const dispatch = useDispatch()
    const ownerData = useSelector((state) => state.lead);
    const status = useSelector((state) => state.status);
    const [ownerListDropDown, SetOwnerListDropDown] = useState([])
    const [alertMessage, SetAlertMessage] = useState(null)
    const [taskStatus, setTaskStatus] = useState([])
    const [taskStatusRelated, setTaskStatusRelated] = useState([])

    const [errortext, setErrortext] = useState('')
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Status: "",
        Subject: "",
        related: "",
        owner_id: ""
    })
    const [transferData, setTransferData] = useState({
        owner_id: "",
    })
    const [ownerNameData, setOwnerNameData] = useState(null)

    const [formErrors, setFormErrors] = useState({
        owner_id: false,
    });

    const updateTask = () => {
        const data = {
            Status: formData.Status || route?.params?.taskData?.Status,
            Subject: route?.params?.taskData?.Subject,
            related: formData.related || route?.params?.taskData?.related[0]?.lead_Name,
            owner_id: formData.owner_id || route?.params?.taskData?.owner_id[0]?.id
        };
        const uuid = route?.params?.taskData?.uuid
        dispatch(TaskUpdateApi({ data, uuid }))
            .then((resp) => {
                if (resp?.payload) {
                    if (resp?.payload?.message) {
                        navigation.navigate('TaskDetails', { taskUpdate: data })
                        SetAlertMessage(resp?.payload?.message)
                    }
                } else {
                    setErrortext('Invalid credentials. Please try agai22n.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log('apiresopone sdffsdfsd ', error);
            });
        setLoading(true);
    };

    // lead tranfer
    const taskTransfer = () => {
        const data = {
            Owner: ownerNameData?.id,
            owner_id: ownerNameData?.id,
            role_id: ownerNameData?.role?.id,
            Subject: route?.params?.taskData?.Subject,
            related: route?.params?.taskData?.related[0]?.lead_Name,
        };
        const uuid = route?.params?.taskData?.uuid
        const errors = {};
        if (!data.owner_id) {
            errors.owner_id = true;
        }
        setFormErrors(errors);
        if (Object.values(errors).every((error) => !error)) {
            dispatch(TaskUpdateApi({ data, uuid }))
                .then((resp) => {
                    if (resp?.payload) {
                        if (resp?.payload?.message) {
                            navigation.navigate('TaskDetails')
                            SetAlertMessage(`Task has been transferred to ${ownerNameData?.uname}.`)
                        }
                    } else {
                        setErrortext('Invalid credentials. Please try agai22n.');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log('apiresopone sdffsdfsd ', error);
                });
        }
        setLoading(true);
    }
    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])

    //  status dropw down and related  
    useEffect(() => {
        if (status?.status?.data?.task_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.task_status);
            setTaskStatus(dropdownOptions);
        }
        if (status?.status?.data?.related_status) {
            const dropdownOptions = globalStatusDropdownOptions(status?.status?.data?.related_status);
            setTaskStatusRelated(dropdownOptions);
        }
    }, [status]);

    const getData = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, Status: value }))
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
        setTransferData((prevState) => ({ ...prevState, owner_id: id }))
    }, [])

    // transfer task
    useEffect(() => {
        const getUserData = ownerData?.userLists?.userlist?.find(ele => ele.id === transferData?.owner_id)
        setOwnerNameData(getUserData)
    }, [transferData])

    return (
        <PaperProvider>
            <AppHeader path={"TaskDetails"} title={route?.params?.header || 'Update Task Information'} />
            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>

                    {route?.params?.taskTransfer &&
                        <CustomDropdown
                            data={ownerListDropDown}
                            getData={getOwnerId}
                            placeholderValue='Owner name' />
                    }

                    {formErrors.owner_id && <Text style={stylesGrid.errorText}>Please select owner name.</Text>}

                    {!route?.params?.taskTransfer &&
                        <>
                            <View style={{ marginTop: 17 }}>
                                <CustomDropdown
                                    data={taskStatusRelated}
                                    getData={getRelated}
                                    placeholderValue='Related To' />
                            </View>
                            <View style={{ marginTop: 17 }}>
                                <CustomDropdown
                                    data={taskStatus}
                                    getData={getData}
                                    placeholderValue={route?.params?.taskData?.Status || 'status'} />
                            </View>
                        </>
                    }

                    {errortext ?
                        <Text style={{ color: 'red' }}> {errortext} </Text>
                        : null
                    }
                    {loading && <Loading size='small' />}

                    {
                        !route?.params?.taskTransfer && <StyledButton
                            title="Update"
                            onPress={updateTask}
                        />
                    }

                    {
                        route?.params?.taskTransfer && <StyledButton
                            title="Task Transfer"
                            onPress={taskTransfer}
                        />
                    }

                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}

export default memo(TaskUpdate)


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