import React, {Component} from 'react';
import {createSwitchNavigator, createAppContainer, NavigationEvents} from 'react-navigation';
import {Alert} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/login/index'
import RegisterScreen from './screens/register/index'
import AsyncStorage from '@react-native-community/async-storage';
import StackNav from './mainComponents/stackHeaderState'
import SplashScreen from './screens/splash/index';
global.AppAccessToken = null;

export const AuthStack = createStackNavigator({
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
},
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        initialRouteName: 'Login'
});

export const Auth = createAppContainer(AuthStack);
// const ProfileContainerState = createAppContainer(ProfileNavigator);

class App extends Component {
    constructor(props) {
        super(props);
        this.updateDarkMode = this.updateDarkMode.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.state = {
            darkMode: 'false',
            loggedIn: null,
            mounting: true,
        }
    }
    componentDidMount() {
        getMode = async () => {
            try {
                value = await AsyncStorage.getItem('@DarkMode');
                //Alert.alert("Darkmode is " + value)
                if (value !== null) {
                    this.updateDarkMode(value);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getMode();
        
        getLogin = async () => {
            try {
                value = await AsyncStorage.getItem('@LoggedIn');
                //Alert.alert("Logged in: " + value);
                if (value === null) {
                    this.setState({loggedIn: false});
                } else {
                    this.setState({ loggedIn: value === 'true' ? true : false })
                }
            } catch (error) {
                console.log(error);
            }
        }

        getLogin();
        this.setState({mounting: false});
    }

    updateDarkMode(val) {
        this.setState({ darkMode: val })
        //Alert.alert("New value: " + val)
        setData = async () => {
            try {
                await AsyncStorage.setItem('@DarkMode', val);
                //Alert.alert("setting dark mode");
            } catch (error) {
                //Alert.alert(error);
            }
        };
    }

    logOut() {
        setLogin = async () => {
            try {
                await AsyncStorage.setItem('@LoggedIn', 'false');
            } catch (error) {
                console.log(error);
            }
        };
        
        this.setState({ loggedIn: false });
    }

    logIn() {
        this.setState({ loggedIn: true });
        setLogin = async () => {
            try {
                await AsyncStorage.setItem('@LoggedIn', 'true');
            } catch (error) {
                console.log(error);
            }
        };
    }

    render() {
        if(this.state.mounting){
            return (
                <SplashScreen />
            );
        }else{
            if (this.state.loggedIn === true) {
                return (
                    <StackNav
                        screenProps={{
                            darkMode: this.state.darkMode, 
                            updateDarkMode: this.updateDarkMode.bind(this),
                            ...this.props.screenProps,
                            onLogOutPress: this.logOut.bind(this)
                        }}
                    />
                );
            } else if (this.state.loggedIn === false){
                return (
                    <Auth  
                        screenProps={{onLoginPress: this.logIn.bind(this)}}
                        // onLoginPress={this.logIn.bind(this)}
                    />                   
                );
            } else {
                return (
                    <SplashScreen />
                );
            }
        }
    }
}
export default App;





