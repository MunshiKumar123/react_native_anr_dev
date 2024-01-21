import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import Loading from '../childComponents/Loading'
import { PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DataIcon from 'react-native-vector-icons/MaterialIcons';
import { createTaskApi } from '../../store/reducers/TaskReducer';
import { DropdownList, CustomDropdown } from '../childComponents/Dropdown'
import StyledButton from '../childComponents/StyledButton';
import { globalStatusDropdownOptions } from '../../../service/_status';
import { custumOwnerList, displayToast } from '../../../service/_helpers';


function TaskCreate({ navigation, route }) {
    const dispatch = useDispatch()
    const ownerData = useSelector((state) => state.lead);
    const status = useSelector((state) => state.status);
    const [ownerListDropDown, SetOwnerListDropDown] = useState([])
    const [alertMessage, SetAlertMessage] = useState(null)
    const [taskStatus, setTaskStatus] = useState([])
    const [taskStatusRelated, setTaskStatusRelated] = useState([])
    const [errorStore, setErrorStore] = useState([])
    const [credentialsError, setCredentialsError] = useState('')
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Subject: "",
        DueDate: "",
        Status: "new",
        Priority: "",
        Reminder: "",
        related: "",
        Repeat: "",
        Description: "",
        owner_id: "",
        p_id: ""
    })
    const [formErrors, setFormErrors] = useState({
        owner_id: false,
        p_id: false

    });
    const [taskUserLists, setTaskUserLists] = useState([])

    // data get from lead details
    useEffect(() => {
        if (route.params?.data) {
            const { data } = route.params;
            setFormData({
                Subject: "",
                DueDate: "",
                Status: "New",
                Priority: "",
                Reminder: "",
                related: "",
                Repeat: "",
                Description: "",
                p_id: data?.uuid,
            })
        }

    }, [route.params?.data]);

    // data get from task lists
    useEffect(() => {
        if (route.params?.taskLists) {
            const { taskLists } = route.params;
            setTaskUserLists(taskLists)
        }
    }, [route.params?.taskLists]);

    const createTask = () => {
        const data = {
            Subject: formData.Subject,
            DueDate: formData.DueDate || getUser?.DueDate,
            Status: formData.Status || getUser?.Status,
            Priority: formData.Priority || getUser?.Priority,
            Reminder: formData.Reminder || getUser?.Reminder,
            related: formData.related,
            Repeat: formData.Repeat || getUser?.Repeat,
            Description: formData.Description || getUser?.Description,
            owner_id: formData.owner_id,
            p_id: formData.p_id
        };

        const errors = {};

        if (!data.p_id) {
            errors.p_id = true;
        }
        if (!data.owner_id) {
            errors.owner_id = true;
        }
        setFormErrors(errors);

        if (Object.values(errors).every((error) => !error)) {
            dispatch(createTaskApi(data))
                .then((resp) => {
                    if (resp?.payload) {

                        if (resp?.payload?.message) {
                            if (getUser) {
                                navigation.navigate('TaskList', { taskReload: true })
                            } else {
                                navigation.navigate('LeadDetails', { taskCreate: data })
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
        return taskUserLists?.map((item) => {
            let emailID = '';
            item?.related?.forEach(element => {
                emailID = element?.email
            });
            let obj = {}
            obj.label = item?.Owner + " | " + item?.Status + " | " + emailID
            obj.value = item?.uuid;
            return obj
        })
    }, [taskUserLists])
    const [value, setValue] = useState(null);
    // id get form DropDownList
    const getID = useCallback((id) => {
        setValue(id)
    }, [])
    const getUser = useMemo(() => {
        return taskUserLists?.find(ele => ele?.uuid === value)
    }, [value])

    useEffect(() => {
        if (getUser) {
            setFormData({
                DueDate: getUser?.DueDate,
                Status: getUser?.Status,
                Priority: getUser?.Priority,
                Reminder: getUser?.Reminder,
                Repeat: getUser?.Repeat,
                Description: getUser?.Description,
                p_id: getUser?.p_id
            })
        }
    }, [getUser])

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
    }, [])

    return (
        <PaperProvider>
            <AppHeader path={taskUserLists?.length > 0 ? "TaskList" : "LeadDetails"} title='Task Creation' />

            <ScrollView style={stylesGrid.scrollContainer}>
                <View style={stylesGrid.inputView}>
                    <View style={{ marginBottom: 6 }}>
                        {taskUserLists?.length > 0 &&
                            <DropdownList
                                data={data}
                                getID={getID}
                                placeholderValue='Task subject' />
                        }
                    </View>
                    {formErrors.p_id && <Text style={stylesGrid.errorText}>Please select task list.</Text>}
                    <CustomDropdown
                        data={ownerListDropDown}
                        getData={getOwnerId}
                        placeholderValue='Owner name' />
                    {formErrors.owner_id && <Text style={stylesGrid.errorText}>Please select the owner's name.</Text>}
                    <Text style={stylesGrid.textlabel}>Subject</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.Subject}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, Subject: val }))} />
                    {errorStore['Subject'] && <Text style={stylesGrid.errorText}>{errorStore['Subject']}</Text>}
                    <Text style={stylesGrid.textlabel}>Due Date</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.DueDate}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, DueDate: val }))}

                    />
                    <DataIcon
                        name="date-range"
                        size={35}
                        color="#007AFF"
                        style={{ textAlign: 'right', marginTop: -48 }}
                        onPress={() => setOpenCalendar(!openCalendar)} />
                    {errorStore['DueDate'] && <Text style={stylesGrid.errorText}>{errorStore['DueDate']}</Text>}
                    {openCalendar &&
                        <View>
                            <Calendar
                                onDayPress={(day) => {
                                    setFormData((prevState) => ({ ...prevState, DueDate: day.dateString })); calClose()
                                }}
                            />
                        </View>
                    }
                    <View style={{ marginTop: 17 }}>
                        <CustomDropdown
                            data={taskStatus}
                            getData={getData}
                            placeholderValue='New' />
                        {formErrors.Status && <Text style={stylesGrid.errorText}>Status is required</Text>}
                    </View>
                    <View style={{ marginTop: 17 }}>
                        <CustomDropdown
                            data={taskStatusRelated}
                            getData={getRelated}
                            placeholderValue='Related To' />
                        {errorStore['related'] && <Text style={stylesGrid.errorText}>{errorStore['related']}</Text>}
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={stylesGrid.textlabel}>Priority</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.Priority}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, Priority: val }))}
                        />
                        {errorStore['Priority'] && <Text style={stylesGrid.errorText}>{errorStore['Priority']}</Text>}
                        <Text style={stylesGrid.textlabel}>Reminder</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.Reminder}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, Reminder: val }))}
                        />
                        {errorStore['Reminder'] && <Text style={stylesGrid.errorText}>{errorStore['Reminder']}</Text>}
                        <Text style={stylesGrid.textlabel}>Repeat</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.Repeat}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, Repeat: val }))}
                        />
                        {errorStore['Repeat'] && <Text style={stylesGrid.errorText}>{errorStore['Repeat']}</Text>}
                        <Text style={stylesGrid.textlabel}>Description</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.Description}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, Description: val }))}
                        />
                        {errorStore['Description'] && <Text style={stylesGrid.errorText}>{errorStore['Description']}</Text>}
                    </View>
                    {credentialsError ?
                        <Text style={{ color: 'red' }}> {credentialsError} </Text>
                        : null
                    }
                    {loading && <Loading size='small' />}
                    {formErrors.p_id && <Text style={stylesGrid.errorText}>please select task list</Text>}
                    <StyledButton
                        title="Save"
                        onPress={createTask}
                    />
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}

export default memo(TaskCreate)

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