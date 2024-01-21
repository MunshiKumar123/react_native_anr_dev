import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import AppHeader from '../../navigation/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutApi } from '../../store/reducers/LogoutReducer';
import StyledButton from '../childComponents/StyledButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { displayToast } from '../../../service/_helpers'


function Profile({ navigation }) {
    const dispatch = useDispatch();
    const login = useSelector((state) => state.login);
    const [alertMessage, SetAlertMessage] = useState(null)

    const handleLogout = async () => {
        try {
            const resp = await dispatch(LogoutApi());
            if (resp?.payload) {
                navigation.navigate('Login');
                SetAlertMessage(resp?.payload?.message)
            }
        } catch (error) {
            console.log(error);
        }
    };
    // for alert message
    useEffect(() => {
        if (alertMessage) {
            displayToast('success', alertMessage)
        }
    }, [alertMessage])

    return (
        <PaperProvider>
            <AppHeader path="Dashboard" title='Account' />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <Image source={require('../../../assets/Icon/lead.jpg')} style={styles.profileImage} />
                    <Text style={styles.userName}>{login?.users?.uname}</Text>
                    <Text style={styles.email}>{login?.email}</Text>
                    <Text style={styles.company}>{login?.users?.utype}</Text>
                </View>

                {/* Account Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Preferences</Text>
                </View>

                {/* Settings Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>Settings</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Lead Form Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>Lead Form</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Integrations Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>Integrations</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Invite Team Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>Invite Team</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Customer Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Support</Text>
                </View>

                {/* User Guide Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>User Guide</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Chat With Us Section */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>Chat With Us</Text>
                    </View>
                    <View style={styles.cardIconContainer}>
                        <Icon name="keyboard-arrow-right" size={24} style={styles.icon} />
                    </View>
                </View>

                {/* Logout Button Section */}
                <View style={styles.section}>
                    <StyledButton onPress={handleLogout} title='Logout Account' />
                </View>
            </ScrollView>
        </PaperProvider>
    );
}

export default Profile;

const styles = StyleSheet.create({
    scrollContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'black',
    },
    email: {
        fontSize: 14,
        color: 'black',
        marginBottom: 2,
    },
    company: {
        fontSize: 16,
        color: 'black',
    },
    section: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    cardContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 12,  // Combined paddingLeft, paddingTop, paddingBottom for simplicity
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 5,
        elevation: 0,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardText: {
        fontSize: 14,
        color: 'black',
    },
    cardIconContainer: {
        alignItems: 'flex-end',
    },
    icon: {
        color: 'black',
    },
});
