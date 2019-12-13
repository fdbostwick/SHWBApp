/**
 * Login Page
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Alert,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import styles from './index.style'
import UserAPI from '../../api/user.api'
import ALogo from './logo'

export class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.ready = false;
    }
    componentDidMount() {
        //this.setState({ ready: true });
        
        this.setState({ username: '' });
        this.setState({ password: '' });
        UserAPI.getAccessToken()
            .then((accessToken) => {
                if (accessToken) {
                    this.props.screenProps.onLoginPress();
                }
                else {
                    this.setState({ ready: true });
                }

            })
            .catch((error) => this.setState({ ready: true }));
        
    }
    loginAsync() {
        UserAPI.loginAsync(this.state.username, this.state.password)
            .then((result) => {
                console.log(global.AppAccessToken);
                if (result.success) this.props.screenProps.onLoginPress();
                else Alert.alert('Failed To Login', result.message);
            })
            .catch((error) => Alert.alert('Failed To Login', error.message));
    }
    registerAsync() {
        UserAPI.registerAsync(this.state.username, this.state.password, this.state.name, this.state.email)
            .then((result) => {
                if (result.success) this.props.onLoginPress();
                else Alert.alert('Failed to register', result.message);
            })
            .catch((error) => Alert.alert('Failed to register', error.message));
    }

    render() {
        if (!this.state.ready) return null;
        return (
                <View style={styles.mainContainer}>
                    <View style={{ width: '35%', height: '35%', alignContent: 'center', flexDirection: 'column', alignSelf: 'center' }}>
                        <ALogo />
                    </View>
                    <TextInput style={styles.textBox}
                        placeholder="User Name"
                        onChangeText={(text) => this.setState({ username: text })}
                        onSubmitEditing={() => { this.passwordTextInput.focus(); }} 
                        ref={(input) => { this.usernameTextInput = input; }}>{this.state.username}</TextInput>
                    <TextInput style={styles.textBox}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({ password: text })}
                        ref={(input) => { this.passwordTextInput = input; }} >{this.state.password}</TextInput>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.loginButton]}
                        onPress={() => this.loginAsync()}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>
                    
                    <Text onPress={() => this.props.navigation.navigate('Register')} hf  style={styles.linkText}>New to SHWB? Register here</Text>
                </View>
        );
    }

};
export default LoginScreen;