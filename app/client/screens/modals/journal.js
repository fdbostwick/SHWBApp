import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    StyleSheet,
    Modal,
    TouchableOpacity,
    View,
    Text,
    Alert,
    Dimensions,
    TextInput,
} from 'react-native';

class JournalEntry extends Component {
    constructor(props){
        super(props);
        this._ismounted = false;
        this.state = {
            modalVisible: false,
            journalText: '',
            JID: '',
        };
    }

    componentDidMount(){
        this._ismounted = true;
        this._ismounted && this.setState({JID: this.props.JID});
    }

    componentWillUnmount(){
        this._ismounted = false;
    }

    setVisibility(curState) {
        this._ismounted && this.setState({ modalVisible: curState });
    }

    getDate(){
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var day = new Date().getDate();
        var months = ["January","February","March","April","May","June","July","August","Septmeber","October","November","December"];
        return months[month] + ' ' + day + ', ' + year;
    }

    sendJournal() {
        try{
            if(this.state.journalText === ""){
                Alert.alert("Please enter text to save a journal entry");
            }else{
                const curJournal = {
                    date: this.getDate(),
                    text: this.state.journalText,
                }
                if(this._ismounted){
                    AsyncStorage.getItem(this.state.JID)
                        .then((oldJournal) => {
                            //Alert.alert(oldJournal);
                            const check = oldJournal ? JSON.parse(oldJournal) : [];
                            check.unshift(curJournal);
                            AsyncStorage.setItem(this.state.JID,JSON.stringify(check));     
                        });
                    this.setState({journalText: ""});        
                    this.setVisibility(!this.state.modalVisible);
                }
            }                
        }catch(error){
            Alert.alert('Failed to save Journal');
        }       
    }

    render() {
        var { height, width } = Dimensions.get("screen");
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setVisibility(!this.state.modalVisible);
                    }}>
                    <View style={styles.textContainer}>
                        <TextInput
                            maxLength={196}
                            multiline
                            style={styles.textBox}
                            numberOfLines={5}
                            onChangeText={(text) => this._ismounted && this.setState({journalText: text})}>
                        </TextInput>
                        
                            <TouchableOpacity style={styles.showMod} onPress={() => {this.sendJournal();}}>
                                <Text style={{fontSize: 16,color: 'white'}}>Enter Journal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.showMod} onPress={() => {this.setVisibility(false);}}>
                                <Text style={{fontSize: 16,color: 'white'}}>Exit</Text>
                            </TouchableOpacity>
                            
                    </View>
                </Modal>
                <View style={styles.button}> 
                    <TouchableOpacity style={styles.showMod} onPress={() => {this.setVisibility(true)}}>
                        <Text style={{fontSize: 16,color: 'white' }}>New Journal Entry</Text>
                    </TouchableOpacity>
                </View>    
            </View>
        );
    }
}
const styles = StyleSheet.create({
    textBox: {
        alignSelf: 'center',
        width: '85%',
        borderWidth: 1,
        borderColor: 'black'
    },
    textContainer: {
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignSelf: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '60%',
        width: '75%',
    },
    showMod: {
        padding: '2%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: "#8fd2c7",
    },
    modalView: {
    },
    buttons: {
        flexDirection: 'column',
        alignContent: 'space-around',
    },
    button: {
        paddingTop: '3.5%',
        paddingBottom: '3.5%'
    }
});
export default JournalEntry;