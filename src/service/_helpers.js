import { View, Text, PermissionsAndroid, Linking } from "react-native";
import Toast from 'react-native-toast-message';

export const getToday = () => new Date().toISOString().split('T')[0];

export const getFormattedPreviousDate = () => {
    const currentDateTime = new Date();
    const previousDateTime = new Date(currentDateTime);
    previousDateTime.setDate(currentDateTime.getDate() - 1);
    return previousDateTime.toISOString().split('T')[0];
};

export const formatTime = (timeString) => {
    const date = new Date(timeString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    const formattedTime = `${formattedHours}:${formattedMinutes} ${hours >= 12 ? 'PM' : 'AM'}`;

    return formattedTime;
}

export const customFormatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}


export const formatDateDisplay = (today, date, formattedPreviousDate, time, formatted_date) => {
    if (today === date) {
        return <Text style={{ color: 'black' }}>{time}</Text>;
    } else if (date === formattedPreviousDate) {
        return <Text style={{ color: 'black' }}>Yesterday</Text>;
    } else if (date?.split('-')[0] !== formattedPreviousDate?.split('-')[0]) {
        return <Text style={{ color: 'black' }}>{date}</Text>;
    } else {
        return (
            <View>
                <Text style={{ color: 'black' }}>{`${formatted_date?.split(' ')[0]} ${formatted_date?.split(' ')[1]}`}</Text>
            </View>
        );
    }
};

// dynamic get owner list
export const custumOwnerList = (data) => {
    return data?.map((item) => {
        let obj = {}
        obj.label = item?.uname
        obj.value = item?.id;
        return obj
    })
}
// for phone call
export const requestPhoneCallPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
                title: 'Phone Call Permission',
                message: 'This app needs permission to make phone calls.',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Phone call permission granted');
        } else {
            console.log('Phone call permission denied');
        }
    } catch (error) {
        console.error('Error requesting phone call permission:', error);
        throw error; // rethrow the error to be caught by the caller
    }
};

export const phoneCall = async (phoneNumber) => {
    try {
        await requestPhoneCallPermission();

        // Check if the device supports phone calls
        if (Linking.canOpenURL(phoneNumber)) {
            await Linking.openURL(phoneNumber);
        } else {
            // Device does not support phone calls
            console.error('Phone call not available: Device does not support phone calls.');
        }
    } catch (error) {
        console.error('Error making phone call:', error);
    }
};

// for whatsApp
export const sendWhatsAppMessage = (whatsappNumber, messageBody = 'Hello, I would like to contact you.') => {
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(messageBody)}`;

    Linking.openURL(whatsappUrl).catch(() => {
        console.log('WhatsApp app not found.');
    });
};

// for Email
export const sendEmail = (email, subject) => {
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(emailUrl).catch(() => {
        alert('Email app not found.');
    });
};

// for phone message

export const requestSendMessagePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
                title: 'Send SMS Permission',
                message: 'This app needs permission to send SMS.',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Send SMS permission granted');
        } else {
            console.log('Send SMS permission denied');
        }
    } catch (error) {
        console.error('Error requesting send SMS permission:', error);
    }
};

export const sendTextMessage = async (phoneNumber, messageBody = 'Hello, I would like to contact you.') => {
    await requestSendMessagePermission();
    // Check if the device supports sending SMS
    if (Linking.canOpenURL(`sms:${phoneNumber}`)) {
        Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(messageBody)}`);
    } else {
        // Device does not support sending SMS
        console.error('Sending SMS not available: Device does not support sending SMS.');
    }
};

// for alert mesage
export const displayToast = (type, text1, text2, autoHide = true, visibilityTime = 1000, position = 'top', topOffset = 100) => {
    Toast.show({
        type,
        text1,
        text2,
        autoHide,
        visibilityTime,
        position,
        topOffset,
    });
};