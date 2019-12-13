/**
 * Sample Page
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    FlatList,
    ScrollView,
    View,
    Text,
    Alert,
} from 'react-native';
import UserAPI from '../../api/user.api';
import styles from './index.style'
import JournalEntry from '../modals/journal';
import AsyncStorage from '@react-native-community/async-storage';

export class JournalScreen extends Component {
    constructor(props) {
        super(props);
        this._ismounted = false;
        this._JIDSet = false;
        this.state = {
            Journal: null,
            JournalID: null,
        };
    }

    componentDidMount(){
        this._ismounted = true;
        this._ismounted && this.getJournalID();
        this._JIDSet && this.getJournal();
    }

    componentWillUnmount(){
        this._ismounted = false;
        this._JIDSet = false;
    }

    getJournal(){
        try{
            AsyncStorage.getItem(this.state.JournalID)
                .then((journal) => {
                    this._ismounted && this.setState({Journal: journal});
                });
        }catch(error){
            Alert.alert(error);
        }
    }

    getJournalID(){
        try{
            UserAPI.getUserInfoAsync()
            .then((user) => {
                const name = user.name;
                this._ismounted && this.setState({JournalID: 'Journal' + name});
                this._JIDSet = true;
            });
        }catch(error){
            Alert.alert(error);
        }
    }
    
    render() {
        if(this.state.JournalID === null){
            return(
                <View>
                    <Text>Loading data</Text>
                </View>
            )
        }
        {this.getJournal()}
        if(this.state.Journal === null){
            return (
                <View style={styles.mainContainer}>
                    <JournalEntry JID={this.state.JournalID}/>  
                </View>
            )
        }else{
            return (
                <View style={styles.mainContainer}>
                    <JournalEntry JID={this.state.JournalID}/>
                    <ScrollView
                        contentContainerStyle={{flexGrow: 1}}>
                        {
                            JSON.parse(this.state.Journal).map((item,index) => (
                                <View key={index} style={styles.eachJournal}>
                                    <Text style={styles.dateText}>{item.date}</Text>
                                    <Text style={styles.textText}>{item.text}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>  
                </View>
            )
        }
    }    
};
export default JournalScreen;