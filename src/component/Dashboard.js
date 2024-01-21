import React, { useEffect, useMemo, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { StyleSheet, FlatList, TouchableOpacity, View, Image, PermissionsAndroid, ImageBackground } from 'react-native';
import { Provider as PaperProvider, Card, Text } from 'react-native-paper';
import AppHeader from './navigation/AppHeader';
import BottomNavigation from './navigation/BottomNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { LocationApi, LocationGetApi } from './store/reducers/StoreLocation';
import { LeadStatusGetApi } from './store/reducers/LeadStatusCountReducer';
import { StatusGetApi, UserListGetApi } from './store/reducers/LeadReducer';
import { ScrollView } from 'react-native-gesture-handler';


const menuItems = [
    { title: 'Lead', icon: require('../assets/Icon/lead.jpg'), route: 'Lead' },
    { title: 'Task', icon: require('../assets/Icon/task.png'), route: 'TaskList' },
    { title: 'Meetings', icon: require('../assets/Icon/meeting.png'), route: 'MettingList' },
    { title: 'Deal', icon: require('../assets/Icon/deal.jpeg'), route: 'DealList' },
    { title: 'Map', icon: require('../assets/Icon/map.png'), route: 'Map' },
    { title: 'Call', icon: require('../assets/Icon/calling.jpeg'), route: 'CalList' },
];
export default function Dashboard({ navigation }) {
    const dispatch = useDispatch()
    const leadStatus = useSelector((state) => state.leadStatus);
    const [dealStatus, setDealStatus] = useState([])
    const [leadCount, setLeadCount] = useState(null)
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [pageReload, setPageReload] = useState(0);

    const handleMenuItemPress = (route) => {
        navigation.navigate(route);
    };

    useEffect(() => {
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app requires access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Fetch location continuously
                    const fetchLocation = async () => {
                        Geolocation.getCurrentPosition(
                            (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                setLatitude(lat);
                                setLongitude(lon);
                                // Call fetchLocation again immediately for continuous updates
                                fetchLocation();
                            },
                            (error) => {
                                console.error('Error getting location:', error);
                                // Retry fetching location on error
                                fetchLocation();
                            },
                            // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                        );
                    };

                    fetchLocation(); // Initial location fetch
                } else {
                    console.log('Location permission denied.');
                }
            } catch (err) {
                console.warn(err);
            }
        }
        requestLocationPermission();
    }, [pageReload]);

    useEffect(() => {
        if (latitude && longitude) {
            let data = {
                latitude: latitude,
                longitude: longitude
            }
            dispatch(LocationApi(data))
                .then((resp) => {
                    console.log('resp', resp);
                })
                .catch((error) => {
                    console.error('Error', error);
                });
        }
    }, [latitude, longitude, pageReload])

    // lead status get data
    useEffect(() => {
        dispatch(LeadStatusGetApi())
    }, [pageReload])

    useEffect(() => {
        if (leadStatus?.status?.LeadData) {
            setLeadCount(leadStatus?.status?.LeadData)
        }
        if (leadStatus?.status?.Dealdata) {
            setDealStatus(leadStatus?.status?.Dealdata)
        }
    }, [leadStatus])

    // lead status convert to array the use
    const leadHistory = useMemo(() => {
        const leadArray = [];
        for (const key in leadCount) {
            leadArray.push({ new: { new: key, count: leadCount[key] } });
        }
        return leadArray;
    }, [leadCount]);

    // refresh data
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setPageReload(prevCount => prevCount + 1);
        });
        return unsubscribe;
    }, [navigation]);

    // status get api
    useEffect(() => {
        dispatch(StatusGetApi())
    }, [pageReload])
    // Owner list get api
    useEffect(() => {
        dispatch(UserListGetApi())
    }, [pageReload])
    return (
        <PaperProvider>
            <AppHeader pagename="Dashboard" />
            <ScrollView style={styles.container}>
                {/* Menu Section */}
                <View style={styles.section}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.menuCard}>
                            <View style={styles.textMenu}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Menu</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {menuItems?.map((item) => (
                            <View key={item.title} style={styles.card}>
                                <TouchableOpacity onPress={() => handleMenuItemPress(item.route)}>
                                    <View style={styles.iconContainer}>
                                        <Image source={item.icon} style={styles.image} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Lead Data Section */}
                <View style={styles.section}>

                    {leadHistory?.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.statusCard}>
                                <View style={styles.textStatus}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Lead Status</Text>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {leadHistory?.map((item) => (
                            <View key={item?.new?.new} style={styles.cardLead}>
                                <View style={styles.textContainerLead}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{item?.new?.count}</Text>
                                </View>
                                <Text style={{ color: 'black', fontSize: 12 }}>{item?.new?.new}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Deal Data Section */}
                <View style={styles.section}>
                    {dealStatus.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.statusCard}>
                                <View style={styles.textStatus}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Deal Status</Text>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dealStatus?.map((item) => (
                            <View key={item.stage} style={styles.cardDeal}>
                                <View style={styles.textContainerDeal}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>&#x20B9; {item.sum_of_amounts}</Text>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{item.count}</Text>
                                </View>
                                <Text style={{ color: 'black', fontSize: 12 }}>{item.stage}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
            <BottomNavigation />
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

        marginTop: 0,
    },
    section: {
        paddingBottom: 10,
        backgroundColor: '#efefef',
        marginBottom: 10
    },
    card: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        shadowColor: '#CCC8AA',
        shadowOffset: '1',
        marginBottom: 2
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: 35,
        height: 35,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        color: 'black'
    },
    menuCard: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 0,
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        marginBottom: 7,
        backgroundColor: '#07afb5',

    },
    textMenu: {
        alignItems: 'left',
        justifyContent: 'left',
    },

    cardLead: {
        width: 100,
        height: 'auto',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        marginRight: 10,
        elevation: 3, // Add elevation for box shadow
    },
    textContainerLead: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13A9A8',
        padding: 5,
        borderRadius: 30
    },
    cardDeal: {
        width: 120,
        height: 'auto',
        marginLeft: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginBottom: 5,
        marginRight: 10,
        padding: 5,
        elevation: 3

    },
    textContainerDeal: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13A9A8',
        padding: 5,
        borderRadius: 3,
        width: '90%'
    },
    statusCard: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 0,
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        backgroundColor: '#07afb5',
        marginBottom: 7

    },
    textStatus: {
        alignItems: 'left',
        justifyContent: 'left',
    },
});
