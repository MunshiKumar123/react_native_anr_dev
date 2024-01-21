import React, { memo, useEffect, useState, useMemo } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { PaperProvider, List, Avatar, Searchbar, FAB, Text } from "react-native-paper";
import AppHeader from '../../navigation/AppHeader';
import BottomNavigation from '../../navigation/BottomNavigation';
import { LeadGetApi, UserListGetApi } from '../../store/reducers/LeadReducer';
import { useDispatch, useSelector } from "react-redux";
import Loading from '../childComponents/Loading'

const Lead = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const leadData = useSelector((state) => state.lead);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    // data get according to page numbers
    const getApi = async (pageNum) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await dispatch(LeadGetApi(pageNum));
            const newData = response?.payload?.data_list?.data || [];

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
            list?.lead_Name?.toLowerCase().includes(searchQuery.toLowerCase())
            ||
            list?.lead_status?.toLowerCase().includes(searchQuery.toLowerCase())
            ||
            list?.created_at?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [page, searchQuery])


    // users list
    useEffect(() => {
        dispatch(UserListGetApi())
    }, [])

    return (
        <PaperProvider>
            <AppHeader path="Dashboard" title='Lead' />
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
                        const lead_Source = list.lead_Source;
                        const date = list.created_at.split(' ')[0];
                        const status = list.lead_status;
                        return (
                            <View key={index} style={stylesGrid.View}>
                                <List.Item
                                    style={stylesGrid.List}
                                    title={list.lead_Name}
                                    description={
                                        <Text>
                                            <Text style={{ color: 'black' }}>{lead_Source} | </Text>
                                            <Text style={{ color: 'black' }}>{date} | </Text>
                                            <Text style={{ color: 'green' }}>{status}</Text>
                                        </Text>
                                    }
                                    titleStyle={{ color: '#000' }}
                                    onPress={() => navigation.navigate('LeadDetails', { leadData: list })}
                                    left={props => <Avatar.Text
                                        backgroundColor='#265E5A'
                                        {...props} size={40}
                                        label={list?.lead_Name?.toUpperCase()?.charAt(0)}
                                        labelStyle={{ fontSize: 18 }}
                                        color='#fff' />}
                                />
                            </View>
                        );
                    })
                )}
            </ScrollView>
            <FAB
                icon="plus"
                color="white"
                style={stylesGrid.fab} onPress={() => navigation.navigate('LeadCreate', { userLists: leadData?.userLists?.userlist })} />
            <BottomNavigation />
        </PaperProvider>
    );
};

export default memo(Lead);

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
});

