import React, { useState, memo, useEffect } from "react";
import { Button, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text } from "react-native-paper";

const DatetimePicker = ({ timeGet }) => {
    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [formattedDateTime, setFormattedDateTime] = useState(null);



    const hideDateTimePicker = () => {
        setDateTimePickerVisibility(false);
    };

    const handleDateTimeConfirm = (date) => {
        const formatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setFormattedDateTime(formatted);
        hideDateTimePicker();
    };

    useEffect(() => {
        if (formattedDateTime) {
            timeGet(formattedDateTime)
        }
    }, [formattedDateTime])

    return (
        <View>
            <DateTimePickerModal
                isVisible={true}
                mode="datetime"
                onConfirm={handleDateTimeConfirm}
                onCancel={hideDateTimePicker}
            />
        </View>
    );
};

export default memo(DatetimePicker)
