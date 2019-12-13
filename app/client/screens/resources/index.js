/**
 * Sample Page
 *
 * @format
 * @flow
 */

import Icon from 'react-native-vector-icons/FontAwesome';
import React, { Component } from 'react';
import {WebView} from 'react-native-webview';
import {
    StyleSheet,
    Alert,
    View,
    Text,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export class ResourceScreen extends Component {
    constructor(props) {
        super(props);
        this._ismounted = false;
        this.state = {
            key: 0,
            web_view: 'weViewRed',
            url: 'https://sa.ua.edu/programs/student-health-and-wellbeing/the-alabama-model/',
        };
    }

    goBack = () =>{
        this.refs[this.state.web_view].goBack();
    };

    goForward = () =>{
        this.refs[this.state.web_view].goForward();
    }

    goHome = () =>{
        this._ismounted && this.setState({
            url: 'https://sa.ua.edu/programs/student-health-and-wellbeing/the-alabama-model/' + '?t=' + Date.now()
        })
    }

    componentDidMount(){
        this._ismounted = true;
        const didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this._ismounted && this.setState({
                    url: 'https://sa.ua.edu/programs/student-health-and-wellbeing/the-alabama-model/' + '?t=' + Date.now()
                })
            }
        );
    }

    componentWillUnmount(){
        didBlurSubscription.remove();
        this._ismounted = false;
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.navBar}>
                    <TouchableHighlight onPress={()=>{this.goBack()}}>
                        <Icon name="long-arrow-left" size={25} color='black'/>  
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{this.goHome()}}>
                        <Icon name="home" size={25} color='black'/>  
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{this.goForward()}}>
                        <Icon name="long-arrow-right" size={25} color='black'/>  
                    </TouchableHighlight>
                </View>
                <View style={styles.web}>
                    <WebView
                        source={{uri: this.state.url}}
                        ref={this.state.web_view}
                        onShouldStartLoadWithRequest={this.handleRequest.bind(this)}   
                    />
                </View>    
            </View>
        );
    }

    handleRequest = request =>{
        /*if(request.url.endsWith('.ua.edu/')){
            return true;
        }*/
        if(request.url.indexOf('.ua.edu/') !== -1){
            return true;
        }
    }
};

const styles = StyleSheet.create({
    navBar:{
        flex:1,
        alignItems:'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'transparent',
    },
    main:{
        flex: 1,
        flexDirection: 'column',
    },
    web: {
        flex:9,
    }
});
export default ResourceScreen;