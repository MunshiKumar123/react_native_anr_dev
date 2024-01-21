import * as React from 'react';
import { View, Text, Alert, Modal, Image, ImageBackground, StyleSheet } from "react-native";
import { Appbar, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
const AppHeader = (props) => {
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object
  const _goBack = () => navigation.navigate(props?.path);
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');
  const login = useSelector((state) => state.login);
  return (
    <>
      {props.pagename === "Dashboard" ? (
        <LinearGradient colors={['#07addb', '#07afb5']} style={{ height: 120, backgroundColor: "#07a6bd", borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} >
          <View>
            <Appbar.Header style={{ backgroundColor: "#ffffff00" }}>
              <Appbar.Content color='#fff' title="Dashboard" />
              {/* <Appbar.Action icon="magnify" color="#FFF" onPress={_handleSearch} /> */}
              {/* <Badge style={{ position: 'absolute', top: 15, right: 9 }}>3</Badge> */}
              {/* <Appbar.Action icon="bell" color="#FFF" onPress={_handleSearch} /> */}
            </Appbar.Header>
          </View>
          <View style={stylesGrid.welcome}>
            <Text style={stylesGrid.welcome_h1}>Welcome  {login?.users?.uname} </Text>
          </View>
        </LinearGradient>

      ) : (

        <Appbar.Header style={{ backgroundColor: "#07a6bd" }} >
          <Appbar.BackAction color='#fff' onPress={() => _goBack()} />
          <Text style={stylesGrid.titleText}>{props.title}</Text>
          <Appbar.Content title={props.pagename} color='#fff' />
        </Appbar.Header>
      )}
    </>
  );
};





export default AppHeader;

const stylesGrid = StyleSheet.create({
  cssheader: {
    backgroundColor: "#FFF",
    borderbottom: '1px solid #ccc',
    color: "#fff",
    height: 60,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  welcome: {
    paddingLeft: 15
  },
  welcome_h1: {
    fontSize: 18,
    color: "#fff"
  },
  titleText: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    color: "white"
  }
});
