import React, { memo, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


export function DropdownList({ data, placeholderValue, getID }) {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        getID(value)
    }, [value])
    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#3498db' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                renderButtonText={(item) => item.label}
                renderItem={(item, index, isSelected) => (
                    <Text key={index} style={{ color: 'black', fontSize: 14, paddingLeft: 10, margin: 10 }}>{item.label}</Text>
                )}
                valueField="value"
                placeholder={!isFocus ? placeholderValue : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                }}
            />
        </View>
    )
}

export function CustomDropdown({ data, placeholderValue, getData }) {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        getData(value)
    }, [value])
    return (
        <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: '#3498db' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            renderButtonText={(item) => item.label}
            renderItem={(item, index, isSelected) => (
                <Text key={index} style={{ color: 'black', fontSize: 14, paddingLeft: 10, margin: 10 }}>{item.label}</Text>
            )}
            valueField="value"
            placeholder={!isFocus ? placeholderValue : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(item.value);
                setIsFocus(false);
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
        marginTop: 8,
    },
    dropdown: {
        height: 50,
        borderColor: '#3498db',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 7,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        color: "black",

    },
    selectedTextStyle: {
        fontSize: 12,
        color: 'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        backgroundColor: 'lightblue'
    },
});