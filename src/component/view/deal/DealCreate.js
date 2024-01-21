import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Icon, PaperProvider, Text } from 'react-native-paper'
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DataIcon from 'react-native-vector-icons/MaterialIcons';
import StyledButton from '../childComponents/StyledButton'
import { CustomDropdown } from '../childComponents/Dropdown'
import { createDealApi } from '../../store/reducers/DealReducer';
import Loading from '../childComponents/Loading'
import { displayToast } from '../../../service/_helpers'


function DealCreate({ navigation, route }) {
    const dispatch = useDispatch()
    const [alertMessage, SetAlertMessage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [credentialsError, setCredentialsError] = useState('')
    const [openCalendarClosing, setOpenCalendarClosing] = useState(false);
    const [probabilityValue, setProbabilityValue] = useState(10)
    const [errorStore, setErrorStore] = useState([])
    const [formData, setFormData] = useState({
        accountName: "",
        dealName: "",
        type: "",
        amount: "",
        closingDate: "",
        stage: "",
        probability: "",
        expectedRevenue: "",
        campaignSource: "",
        description: "",
        reason_for_loss: "",
        Owner: "",
        remark: '',
        p_id: ""
    })

    //  data get from leadDetails
    useEffect(() => {
        if (route.params?.data) {
            const { data } = route.params;
            setFormData({
                Owner: data?.Owner[0]?.uname,
                Owner: '',
                p_id: data?.id
            })
        }

    }, [route.params?.data]);

    const createDeal = () => {
        const data = {
            accountName: formData.accountName,
            dealName: formData.dealName,
            type: formData.type || 'New Business',
            amount: formData.amount,
            closingDate: formData.closingDate,
            stage: formData.stage || 'Qualification',
            probability: probabilityValue,
            expectedRevenue: percent,
            campaignSource: formData.campaignSource,
            description: formData.description,
            reason_for_loss: formData.reason_for_loss,
            remark: formData.remark,
            Owner: formData.Owner,
            p_id: formData.p_id
        };

        dispatch(createDealApi(data))
            .then((resp) => {
                if (resp?.payload) {
                    if (resp?.payload?.message) {
                        navigation.navigate('LeadDetails', { dealCreate: data })
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
        setLoading(true);
    };

    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])


    // for calendra close 
    const calClose = () => {
        setOpenCalendarClosing(false)
    }

    const typeDropDown = [
        { label: 'New Business', value: 'New Business' },
        { label: 'Existing Business', value: 'Existing Business' }
    ]
    const stageDropDown = [
        { label: 'Qualification', value: 'Qualification', id: 10 },
        { label: 'Needs Analysis', value: 'Needs Analysis', id: 20 },
        { label: 'Value Proposition', value: 'Value Proposition', id: 40 },
        { label: 'Identify Decision Makers', value: 'Identify Decision Makers', id: 60 },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote', id: 75 },
        { label: 'Negotiation/Review', value: 'Negotiation/Review', id: 90 },
        { label: 'Closed Won', value: 'Closed Won', id: 100 },
        { label: 'Closed Lost', value: 'Closed Lost', id: 0 },
        { label: 'Closed-Lost to Competition', value: 'Closed-Lost to Competition', id: 0 },
    ];

    const getTypeDropDown = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, type: value }))
    }, [])
    const getStageDropDown = useCallback((value) => {
        setFormData((prevState) => ({ ...prevState, stage: value }))
    }, [])

    useEffect(() => {
        const rcd = stageDropDown?.find(ele => ele.label === formData?.stage)
        if (rcd) {
            setProbabilityValue(rcd?.id)
        }
    }, [formData])

    const percent = useMemo(() => {
        return +formData?.amount * probabilityValue / 100
    }, [formData, probabilityValue])

    return (
        <PaperProvider>
            <AppHeader path="LeadDetails" title='Deal Creation' />
            

            <ScrollView style={stylesGrid.scrollContainer}>

                <View style={stylesGrid.inputView}>

                    <Text style={stylesGrid.textlabel}>Account Name</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.accountName}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, accountName: val }))} />
                    {errorStore['accountName'] && <Text style={stylesGrid.errorText}>{errorStore['accountName']}</Text>}

                    <Text style={stylesGrid.textlabel}>Deal Name</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.dealName}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, dealName: val }))}
                    />
                    {errorStore['dealName'] && <Text style={stylesGrid.errorText}>{errorStore['dealName']}</Text>}

                    <View style={{ marginBottom: 6 }}>
                        <Text style={stylesGrid.textlabel}>type</Text>
                        <CustomDropdown
                            data={typeDropDown}
                            getData={getTypeDropDown}
                            placeholderValue='type' />
                    </View>
                    <Text style={stylesGrid.textlabel}>Amount</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        keyboardType="number-pad"
                        value={formData.amount}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, amount: val }))}
                    />
                    {errorStore['amount'] && <Text style={stylesGrid.errorText}>{errorStore['amount']}</Text>}
                    <Text style={stylesGrid.textlabel}>Closing Date</Text>
                    <TextInput
                        style={stylesGrid.TextInput}
                        value={formData.closingDate}
                        onChangeText={(val) => setFormData((prevState) => ({ ...prevState, closingDate: val }))}

                    />
                    <DataIcon
                        name="date-range"
                        size={35}
                        color="#007AFF"
                        style={{ textAlign: 'right', marginTop: -48 }}
                        onPress={() => setOpenCalendarClosing(!openCalendarClosing)}
                    />
                    {openCalendarClosing &&
                        <View>
                            <Calendar
                                onDayPress={(day) => {
                                    setFormData((prevState) => ({ ...prevState, closingDate: day.dateString })); calClose()
                                }}
                            />
                        </View>
                    }
                    {errorStore['closingDate'] && <Text style={stylesGrid.errorText}>{errorStore['closingDate']}</Text>}
                    <View style={{ marginTop: 10 }}>
                        <View style={{ marginBottom: 6 }}>
                            <Text style={stylesGrid.textlabel}>Stage</Text>
                            <CustomDropdown
                                data={stageDropDown}
                                getData={getStageDropDown}
                                placeholderValue='stage' />
                        </View>
                        <Text style={stylesGrid.textlabel}>Probability</Text>
                        <Text style={stylesGrid.TextInput}>{probabilityValue}</Text>
                        <Text style={stylesGrid.textlabel}>Expected Revenue</Text>
                        <Text style={stylesGrid.TextInput}>{percent ? percent.toFixed(2) : 0}</Text>
                        <Text style={stylesGrid.textlabel}>Campaign Source</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            value={formData.campaignSource}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, campaignSource: val }))}
                        />
                        {errorStore['campaignSource'] && <Text style={stylesGrid.errorText}>{errorStore['campaignSource']}</Text>}
                        <Text style={stylesGrid.textlabel}>Description</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                            value={formData.description}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, description: val }))}
                        />
                        {errorStore['description'] && <Text style={stylesGrid.errorText}>{errorStore['description']}</Text>}
                        <Text style={stylesGrid.textlabel}>Reason for Loss</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                            value={formData.reason_for_loss}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, reason_for_loss: val }))}
                        />
                        {errorStore['reason_for_loss'] && <Text style={stylesGrid.errorText}>{errorStore['reason_for_loss']}</Text>}
                        <Text style={stylesGrid.textlabel}>Remark</Text>
                        <TextInput
                            style={stylesGrid.TextInput}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                            value={formData.remark}
                            onChangeText={(val) => setFormData((prevState) => ({ ...prevState, remark: val }))}
                        />
                        {errorStore['remark'] && <Text style={stylesGrid.errorText}>{errorStore['remark']}</Text>}
                    </View>

                    {credentialsError ?
                        <Text style={{ color: 'red' }}> {credentialsError} </Text>
                        : null
                    }
                    {loading && <Loading size='small' />}
                    <StyledButton
                        title='save'
                        onPress={createDeal}
                    />
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    )
}
export default memo(DealCreate)

const stylesGrid = StyleSheet.create({
    scrollContainer: {
        padding: 10,
        backgroundColor: '#ededed',

    },
    inputView: {
        width: "100%",
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingTop: 10, // Set top padding
        paddingBottom: 20, // Set bottom padding
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20
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