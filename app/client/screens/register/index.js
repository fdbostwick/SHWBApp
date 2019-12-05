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
import QualtricsAPI from '../../api/qualtrics.api'
import ALogo from './logo'
import { StackActions } from 'react-navigation';

export class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.ready = false;
    }
    componentDidMount() {
        //this.setState({ ready: true });
        
        this.setState({ username: '' });
        this.setState({ password: '' });
        // UserAPI.getAccessToken()
        //     .then((accessToken) => {
        //         // QualtricsAPI.getAllQuestionsAsync()
        //         // .then((questions) => console.log(questions));
        //         // if (accessToken) {
        //         //     UserAPI.setAccessToken("");
        //         //     this.props.navigation.navigate('Sample');
        //         // }
        //         // else {
        //         //     this.setState({ ready: true });
        //         // }

        //     })
        //     .catch((error) => console.log(error));
    }
    registerAsync() {
        UserAPI.registerAsync(this.state.username, this.state.password, this.state.name, this.state.email)
            .then((result) => {
                if (result.success) {
                    this.props.screenProps.onLoginPress();
                    //StackActions.reset()
                } 
                else Alert.alert('Failed to register', result.message);
            })
            .catch((error) => Alert.alert('Failed to register', error.message));    
    }

    render() {
        //if (!this.state.ready) return null;
        
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
                    <TextInput style={styles.textBox}
                        placeholder="Name"
                        onChangeText={(text) => this.setState({ name: text })}
                        onSubmitEditing={() => { this.passwordTextInput.focus(); }} 
                        ref={(input) => { this.usernameTextInput = input; }}></TextInput>
                    <TextInput style={styles.textBox}
                        placeholder="Email address"
                        onChangeText={(text) => this.setState({ email: text })}
                        onSubmitEditing={() => { this.passwordTextInput.focus(); }} 
                        ref={(input) => { this.usernameTextInput = input; }}></TextInput>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.loginButton]}
                        onPress={() => this.registerAsync()}>
                        <Text style={styles.loginButtonText}>Register</Text>
                    </TouchableOpacity>
                    
                </View>
        );
    }

};
export default RegisterScreen;