import React, { memo, useEffect, useState, useMemo } from "react";
import { getToday, getFormattedPreviousDate, formatDateDisplay, formatTime, customFormatDate, phoneCall, sendTextMessage } from '../../../service/_helpers'
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { PaperProvider, List, Avatar, Searchbar, FAB, Text, Modal, Portal, Button } from "react-native-paper";
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { useDispatch, useSelector } from "react-redux";
import { CallGetApi } from "../../store/reducers/CallReducer";
import Loading from '../childComponents/Loading'
import Icon from 'react-native-vector-icons/MaterialIcons';


const CalList = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const leadData = useSelector((state) => state.lead);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedListItem, setSelectedListItem] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);


    // data get according to page numbers
    const getApi = async (pageNum) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await dispatch(CallGetApi(pageNum));
            const newData = response?.payload?.calling?.data || [];

            if (newData?.length > 0) {
                setLists((prevLists) => [...prevLists, ...newData]);
                // setPage((prevPage) => prevPage + 1);
                setPage(pageNum + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getApi(page);
    }, []);

    // after lead create page reload
    useEffect(() => {
        if (route.params?.LeadCreateData) {
            getApi(1);
        }
        return () => {
            setLists([]);
            setLoading(true);
            setPage(1);
        };
    }, [route.params?.LeadCreateData]);

    //  page number increase according to scroll
    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isCloseToBottom && !isFetching) {
            getApi(page);
        }
    };

    // clear search
    const clearSearchQuery = () => {
        setSearchQuery('');
    };

    // Function to filter the lists based on the search query
    const filterLists = useMemo(() => {
        return lists.filter((list) =>
            list?.related[0]?.lead_Name?.toLowerCase().includes(searchQuery.toLowerCase())
            ||
            list?.mobile?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [page, searchQuery])

    // for modal

    const showModal = () => {
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const phoneNumber = useMemo(() => {
        return `tel:+91${selectedListItem?.mobile}`
    }, [selectedListItem])

    return (
        <PaperProvider>
            <AppHeader path="Dashboard" title='call list...' />
            <Searchbar
                placeholder="Search ..."
                style={{ backgroundColor: "#ebc89538", borderRadius: 0, fontWeight: 'bold' }}
                onChangeText={(query) => setSearchQuery(query)}
                value={searchQuery}
                onIconPress={clearSearchQuery}
                placeholderTextColor="black"
            />
            <ScrollView onScroll={handleScroll} scrollEventThrottle={400}>
                {loading ? (
                    <Loading size='small' />
                ) : (
                    filterLists?.map((list, index) => {
                        const today = getToday();
                        const formattedPreviousDate = getFormattedPreviousDate();

                        const call_disposition = list.call_disposition;
                        const date = list.created_at?.split(' ')[0];
                        const time = formatTime(list.created_at);
                        const formatted_date = customFormatDate(list.created_at);

                        return (
                            <View key={index} style={stylesGrid.View}>
                                <List.Item
                                    style={stylesGrid.List}
                                    title={list.related[0]?.fullName}
                                    description={<Text style={{ color: 'black' }}>{call_disposition}</Text>}
                                    titleStyle={{ color: '#000' }}
                                    onPress={() => { setSelectedListItem(list); showModal(); }}
                                    left={props => (
                                        <Avatar.Text
                                            backgroundColor='#265E5A'
                                            {...props}
                                            size={40}
                                            label={list.related[0]?.fullName?.toUpperCase()?.charAt(0)}
                                            labelStyle={{ fontSize: 18 }}
                                            color='#fff'
                                        />
                                    )}
                                    right={() => <Text>{formatDateDisplay(today, date, formattedPreviousDate, time, formatted_date)}</Text>}
                                />
                            </View>
                        );
                    })
                )}
            </ScrollView>
            <BottomNavigation />
            {/* Modal for displaying options */}
            <Portal>
                <Modal
                    visible={isModalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={stylesGrid.modalContainer}
                >
                    <View style={stylesGrid.iconsContainer}>
                        <TouchableOpacity
                            style={stylesGrid.iconWrapper}
                            onPress={() => { phoneCall(phoneNumber); hideModal(); }}
                        >
                            <Icon name="phone" size={25} style={stylesGrid.actionIcon} />
                            <Text style={stylesGrid.actionText}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={stylesGrid.iconWrapper}
                            onPress={() => { sendTextMessage(phoneNumber); hideModal(); }}
                        >
                            <Icon name="message" size={25} style={stylesGrid.actionIcon} />
                            <Text style={stylesGrid.actionText}>Message</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={stylesGrid.iconWrapper}
                            onPress={() => { navigation.navigate('CallDetails', { callData: selectedListItem }); hideModal(); }}
                        >
                            <Icon name="book" size={25} style={stylesGrid.actionIcon} />
                            <Text style={stylesGrid.actionText}>Log</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={stylesGrid.iconWrapper}
                            onPress={() => setModalVisible(false)}
                        >
                            <Icon name="close" size={30} style={stylesGrid.actionIcon} />
                            <Text style={stylesGrid.actionText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Portal>

        </PaperProvider >
    );
};


export default memo(CalList);

const stylesGrid = StyleSheet.create({

    List: {
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: "#fff",
    },
    View: {
        borderBottomWidth: 0.1,
        borderBottomColor: "#ccc",
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        width: 50,
        height: 50,
        borderRadius: 25, // Make it half of the width and height for a round shape
        backgroundColor: "#3498db",
        position: "absolute",
        zIndex: 9,
        bottom: 56,
        right: 9,
        elevation: 5, // Adjust the elevation as needed
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        margin: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FEFEFF',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        width: '80%',
    },
    iconWrapper: {
        alignItems: 'center',
        margin: 10
    },
    actionIcon: {
        color: '#4D82C0',
    },
    actionText: {
        color: 'black',
        fontSize: 12,
    },
});
