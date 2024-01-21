import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormData, loginUser, getUser } from "../component/store/reducers/loginReducer"
import { useDispatch, useSelector } from 'react-redux';
import { displayToast } from '../service/_helpers'

const LoginScreen = () => {

  const dispatch = useDispatch()
  const navigation = useNavigation();
  const login = useSelector((state) => state.login);
  const [alertMessage, SetAlertMessage] = useState(null)
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const [errortext, setErrortext] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  //  login and form validiate

  const handleLogin = async () => {
    setIsLoading(true);

    let data = {
      email: login.email,
      password: login.password,
    }
    const errors = {};

    if (!data.email) {
      errors.email = true;
    }

    if (!data.password) {
      errors.password = true;
    }
    setFormErrors(errors);

    if (Object.values(errors).every((error) => !error)) {
      try {
        const resp = await dispatch(loginUser(data));
        if (resp?.payload?.token) {
          SetAlertMessage(resp?.payload?.message)
          const token = resp.payload.token;
          await AsyncStorage.setItem('token', token);
          setIsLoading(false);
          navigation.navigate('Dashboard');
          dispatch(getUser(resp?.payload.user));
        } else {
          setErrortext('Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // for alert message
  useEffect(() => {
    if (alertMessage) {
      displayToast('success', alertMessage)
    }
  }, [alertMessage])
  return (
    <ImageBackground style={{ height: "100%", width: "100%", backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <View style={styles.ImagesView}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/Icon/lmsLogo.png')}
          />
        </View>

        {formErrors.email && <Text style={{ color: "red" }}>Email is required!</Text>}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email."
            value={login.email}
            placeholderTextColor="#003f5c"
            onChangeText={(val) => dispatch(FormData({ prop: 'email', value: val }))}

          />
        </View>
        {formErrors.password && <Text style={{ color: "red" }}>Password is required!</Text>}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password."
            placeholderTextColor="#003f5c"
            value={login.password}
            secureTextEntry={true}
            onChangeText={(val) => dispatch(FormData({ prop: 'password', value: val }))}
          />
        </View>
        {/* <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity> */}
        {errortext ?
          <Text style={styles.error}> {errortext} </Text>
          : null
        }
        {isLoading && <ActivityIndicator size="large" color="#3498db" />}

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}  >
          <Text style={{ color: "white" }}>LOGIN</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 8,
  },
  inputView: {
    borderRadius: 2,
    width: "100%",
    height: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  ImagesView: {
    borderRadius: 10,
    width: 200,
    height: 150,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: '#4d9ad5'
  },
  TextInput: {
    height: 40,
    flex: 1,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "#000"
  },
  forgot_button: {
    height: 40,
    marginBottom: 20,
    color: "black"
  },
  loginBtn: {
    width: "100%",
    borderRadius: 8,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#3498db",
  },
  tinyLogo: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
  },
  error: {
    color: "#a90606"
  }
});


export default LoginScreen;
