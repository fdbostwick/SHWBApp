/**
 * Sample Page
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Alert,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';

import UserAPI from '../../api/user.api'
import styles from './index.style'

export class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this._ismounted = false;
        this.state = {
            academic: -1,
            career: -1,
            financial: -1,
            psychological: -1,
            physical: -1,
            social: -1,
            spiritual: -1,
            username: 'User Name Here',
            yourScore: -1,
            UAScore: '4',
            colorDiagonal: "#8fd2c7",
            colorVertical: "#b5d334",            
        };
    }
    // blackName mapping table (Case insensitive)
    // Social "Soc"
    // Physical "Phys"
    // Career "Car"
    // Financial "Fin"
    // Academic "Acad"
    // Spiritual "Spir"
    // Psychological "Psyc"
    onFocusFunction = () => {
        UserAPI.getUserInfoAsync()
            .then((user) => {
                if(this._ismounted){
                    const acad = user.scores.acad.averageScore;
                    const car = user.scores.car.averageScore;
                    const fin = user.scores.fin.averageScore;
                    const psy = user.scores.psyc.averageScore;
                    const phy = user.scores.phys.averageScore;
                    const soc = user.scores.soc.averageScore;
                    const spir = user.scores.spir.averageScore;
                    const scor = acad + car + fin + psy + phy + soc + spir;
                    this.setState({username: user.name});
                    this.setState({academic: (acad * 4).toFixed(1)});
                    this.setState({career: (car * 4).toFixed(1)});
                    this.setState({financial: (fin * 4).toFixed(1)});
                    this.setState({psychological: (psy * 4).toFixed(1)});
                    this.setState({physical: (phy * 4).toFixed(1)});
                    this.setState({social: (soc * 4).toFixed(1)});
                    this.setState({spiritual: (spir * 4).toFixed(1)});
                    this.setState({yourScore: ((scor * 4) / 7 ).toFixed(1)});
                }
            })
        .catch((error) =>  this.setState({username: 'John Doe'}));
    }

    async componentDidMount(){
        this._ismounted = true;
        this.focusListener = this.props.navigation.addListener('didFocus', () => { 
            this.onFocusFunction()
        })
    }

    componentWillUnmount(){
        this.focusListener.remove();
        this._ismounted = false;
    }

    render() {   
        // console.log(this)
        // console.log(this.props.navigation.dangerouslyGetParent())
    if(this.state.academic < 0){
            return(
                <View>
                    <Text>Loading data</Text>
                </View>
            )
    }else{
        return (
            <ScrollView
                contentContainerStyle={{flexGrow:1}}>
            <View style={styles.mainContainer}>
                <Text style={styles.name}>{this.state.username}</Text>
                <View style={styles.scores}>
                    <View style={[styles.scoreCont,{backgroundColor: this.state.colorVertical}]}>
                        <Text style={styles.buttonText}>Your Score: {this.state.yourScore}</Text>
                    </View>
                    <View style={[styles.scoreCont,{backgroundColor: this.state.colorDiagonal}]}>    
                        <Text style={styles.buttonText}>UA Average: {this.state.UAScore}</Text>
                    </View>    
                </View>
                <View style={styles.lineStyle} />
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorDiagonal}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Acad'})}>
                    <Text style={styles.buttonText}>{this.state.academic} Academic</Text>    
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorVertical}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Car'})}>
                    <Text style={styles.buttonText}>{this.state.career} Career</Text>    
                </TouchableOpacity> 
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorDiagonal}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Fin'})}>
                    <Text style={styles.buttonText}>{this.state.financial} Financial</Text>    
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorVertical}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Psyc'})}>
                    <Text style={styles.buttonText}>{this.state.psychological} Psychological</Text>    
                </TouchableOpacity> 
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorDiagonal}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Phys'})}>
                    <Text style={styles.buttonText}>{this.state.physical} Physical</Text>    
                </TouchableOpacity> 
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorVertical}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Soc'})}>
                    <Text style={styles.buttonText}>{this.state.social} Social</Text>    
                </TouchableOpacity> 
                <TouchableOpacity
                    style={[styles.buttonCont,{backgroundColor: this.state.colorDiagonal}]}
                    onPress={() => this.props.navigation.navigate('Academic',{category: 'Spir'})}>
                    <Text style={styles.buttonText}>{this.state.spiritual} Spiritual</Text>    
                </TouchableOpacity>
            </View>    
            </ScrollView>
        );
        }
    }
};
export default ProfileScreen;