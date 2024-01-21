import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { PaperProvider, Text, IconButton, Button } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DataIcon from 'react-native-vector-icons/MaterialIcons';
import { CustomDropdown } from '../childComponents/Dropdown';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import Loading from '../childComponents/Loading'
import { LocationGetApi, LocationGetUserApi } from '../../store/reducers/StoreLocation';

function Map({ route, navigation }) {
    const dispatch = useDispatch();
    const location = useSelector((state) => state.location);
    const ownerData = useSelector((state) => state.lead);
    const [loading, setLoading] = useState(false);

    const login = useSelector((state) => state.login);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openCalendarTo, setOpenCalendarTo] = useState(false);
    const [openCalendarFrom, setOpenCalendarFrom] = useState(false);
    const [ownerList, setOwnerList] = useState([])
    const [formData, setFormData] = useState({
        to: '',
        from: '',
        user: ''
    })




    // for map show
    useEffect(() => {
        if (location?.location?.data) {
            setLatitude(location.location.data.latitude);
            setLongitude(location.location.data.longitude);
        }
    }, [location]);

    const user = useMemo(() => {
        return login?.users?.uname
    }, [login])


    const url = useMemo(() => {
        return `https://vertlinker.com/Map/?latitude=${latitude}&longitude=${longitude}&user=${user}`
    }, [latitude, longitude])

    // location getApi
    useEffect(() => {
        dispatch(LocationGetApi())
    }, [])

    //  modal lead
    const openModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // for calendra
    const calCloseTo = () => {
        setOpenCalendarTo(false)
    }
    const calCloseFrom = () => {
        setOpenCalendarFrom(false)
    }

    // owner name get
    useEffect(() => {
        if (ownerData?.userLists?.userlist) {
            setOwnerList(ownerData?.userLists?.userlist)
        }
    }, [ownerData])

    const ownerName = useMemo(() => {
        return ownerList?.map((item) => {
            let obj = {}
            obj.label = item?.uname
            obj.value = item?.id;
            return obj
        }) || [];
    }, [ownerList]);
    // id get form DropDownList
    const getOwnerName = useCallback((id) => {
        setFormData((prevState) => ({ ...prevState, user: id }))
    }, [])
    useEffect(() => {
        console.log('location desss', location?.userLocation?.data?.message)
    }, [location])


    // get location user wise
    const getLocation = () => {
        const data = {
            user_id: formData?.user
        }
        dispatch(LocationGetUserApi(data)).then((resp) => {
            if (resp?.payload?.data && !resp?.payload?.data?.message) {
                setIsModalVisible(false)
                setLoading(false);
            }
            if (resp?.payload?.data?.message) {
                setLoading(false);
            }
        })
        setLoading(true);

    }
    return (
        <PaperProvider>
            <AppHeader path="Dashboard" title="Map View" />
            <View style={stylesGrid.iconButtonContainer}>
                {/* header icon */}
                <IconButton
                    icon={() => <Icon style={{ color: 'white' }} name="more-vert" size={24} />}
                    onPress={openModal}
                />
            </View>
            <ScrollView style={stylesGrid.scrollContainer}>

                {!latitude && !longitude ? (
                    <Loading size="larze" />
                ) : (
                    <WebView
                        source={{ uri: url }}
                        style={stylesGrid.mapWebView}
                    />
                )}
            </ScrollView>

            {/* modal for Activity */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={openModal}
            >
                <View style={stylesGrid.modalContainer}>
                    <View style={stylesGrid.modalContent}>
                        <TouchableOpacity onPress={openModal}>
                            <View style={{ backgroundColor: '#ccc', padding: 10 }}>
                                <Text style={stylesGrid.editText}>Map View</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={stylesGrid.editContainer}>
                            <CustomDropdown
                                data={ownerName}
                                getData={getOwnerName}
                                placeholderValue="User Name"
                            />
                            {location?.userLocation?.data?.message && <Text style={stylesGrid.errorText}>{location?.userLocation?.data?.message}</Text>}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 40, paddingRight: 40 }}>
                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ color: 'black' }}>to  {formData?.to}</Text>
                                    <DataIcon name="date-range" size={35} color="#007AFF" style={{ textAlign: 'left' }} onPress={() => setOpenCalendarTo(!openCalendarTo)} />
                                    {openCalendarTo &&
                                        <View>
                                            <Calendar
                                                onDayPress={(day) => {
                                                    setFormData((prevState) => ({ ...prevState, to: day.dateString }));
                                                    calCloseTo();
                                                }}
                                            />
                                        </View>
                                    }
                                </View>

                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ color: 'black' }}>from {formData?.from}</Text>
                                    <DataIcon name="date-range" size={35} color="#007AFF" style={{ textAlign: 'right' }} onPress={() => setOpenCalendarFrom(!openCalendarFrom)} />
                                    {openCalendarFrom &&
                                        <View>
                                            <Calendar
                                                onDayPress={(day) => {
                                                    setFormData((prevState) => ({ ...prevState, from: day.dateString }));
                                                    calCloseFrom();
                                                }}
                                            />
                                        </View>
                                    }
                                </View>

                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    {loading && <Loading size="small" />}
                                    <TouchableOpacity style={stylesGrid.btnLocation} onPress={getLocation}>
                                        <Text style={{ color: 'white', fontSize: 14 }}> Get Location</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        <Button
                            icon={() => <Icon name="cancel" color="black" size={24} />}
                            onPress={openModal}
                            style={stylesGrid.cancelButton}
                        />
                    </View>
                </View>
            </Modal>
        </PaperProvider>
    );
}

export default memo(Map);

const stylesGrid = StyleSheet.create({

    scrollContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 16,
    },
    iconButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 0,
        zIndex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 5,
    },
    editText: {
        fontSize: 16,
        color: '#006094',
    },
    cancelButton: {
        color: 'black'
    },
    editContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        borderStyle: 'solid',

    },
    editIcon: {
        marginRight: 10,
        color: '#006094'
    },
    mapWebView: {
        flex: 1,
        aspectRatio: 0.69,
        width: '100%',
    },
    btnLocation: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 2
    },
    errorText: {
        color: "#a90606",
        marginLeft: 5
    },
});
