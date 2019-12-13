/**
 * Sample Page
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import styles from './index.style'
import QualtricsAPI from '../../api/qualtrics.api';
import AsyncStorage from '@react-native-community/async-storage';


export class SampleScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this._ismounted = false;
        if (navigation.getParam('category', 'nil') == 'nil') {
            navigation.setParams({category: 'spir'});
            console.log(navigation.getParam('category', 'stillNil'));
        }
        this.state = {
            category: navigation.getParam('category', 'spir'),
            questions: null,
            loading: true,
            number: 0,
        };
        this.catMap = {
            soc: 'socNum',
            phys: 'physNum',
            car: 'carNum',
            fin: 'finNum',
            acad: 'acadNum',
            spir: 'spirNum',
            psyc: 'psycNum'
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.navigation.getParam('category', '') !== prevState.category) {
            return { category: nextProps.navigation.getParam('category', 'spir'), questions: null }
        }
        return null;
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.category !== this.state.category) {
            this.componentDidMount()
        }
    }
    incQNum() {
        const setNum = async () => {
            try {
                await AsyncStorage.setItem(
                    this.catMap[this.state.category.toLowerCase()],
                    ((this.state.number + 1) % this.state.questions.length).toString()
                );
            } catch (error) {
                //console.log(error);
            }
        }
        setNum();
        this._ismounted && this.setState({ number: (this.state.number + 1) % this.state.questions.length })
        if (this.state.number == this.state.questions.length - 1) {
            this.props.navigation.goBack();
        }
    }
    componentDidMount() {
        console.log("componentDidMount() called with category: " + this.state.category)
        this._ismounted = true;
        try {
            QualtricsAPI.getQuestionsFromBlockAsync(this.state.category)
                .then((quest) => {
                    this._ismounted && this.setState({ questions: quest.questions, loading: false })
                    //console.log(quest)
                });
        } catch (error) {
            Alert.alert("Error loading questions");
        }
        getQNum = async () => {
            try {
                const value = await AsyncStorage.getItem(this.catMap[this.state.category.toLowerCase()]);
                if (value === null) {
                    this._ismounted && this.setState({ number: 0 });
                } else {
                    //console.log(value);
                    this._ismounted && this.setState({ number: parseInt(value, 10) })
                }
            } catch (error) {
                //console.log(error);
            }
        }
        getQNum();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        console.log("Academic rendered")
        console.log(this.props.navigation.getParam('category', 'nil'))
        if (this.state.questions) {
            // console.log(this.state.questions)
            let choices = [];
            let qNum = this.state.number;
            let qID = 0;
            try {
                qID = this.state.questions[qNum].questionId;
            } catch (error) {
                console.log("~~~~~academic index.js line 111 error~~~~~~~~")
                console.log(error)
            }
            try {
                for (let [key, value] of Object.entries(this.state.questions[qNum].choices)) {
                    choices.push({ key: key, value: value['Display'] })
                }
            } catch (error) {
                console.log("~~~~~academic index.js line 117 error~~~~~~~~")
                console.log(error)
            }
            // const len = choices.length;
            // let winH = Dimensions.get('screen').height;
            // winH -= (len + 1) * 10;
            // const h = (70 / len).toString() + '%';
            // console.log(choices)
            return (
                <View style={styles.mainContainer}>
                    {/* <Text>Size: {this.state.questions.length}</Text> */}
                    <Text style={styles.loginButtonText}>{this.state.questions[qNum].questionText}</Text>
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        {choices.map((choice) => (
                            <TouchableHighlight style={{ height: '8.75%', margin: '1%' }}
                                key={choice.key}
                                onPress={() => {
                                    console.log(qID);
                                    console.log({ [qID]: parseInt(choice.key, 10) });
                                    QualtricsAPI.createResponseAsync({ [qID]: parseInt(choice.key, 10) });
                                    this.incQNum();
                                    // this.props.navigation.goBack(null);
                                }}
                                underlayColor="white"
                            >
                                <View style={[styles.button, { height: '100%', justifyContent: "center" }]}>
                                    <Text style={styles.buttonText}>{choice.value}</Text>
                                </View>
                            </TouchableHighlight>
                        ))}
                        <TouchableHighlight style={{ height: '8.75%', margin: '1%' }}
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}
                        >
                            <View style={[styles.button, { height: '100%', justifyContent: "center" }, { backgroundColor: 'grey' }]}>
                                <Text style={styles.buttonText}>Exit survey</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{
                        height: 4,
                        width: '100%',
                        backgroundColor: 'white',
                        // borderColor: '#000',
                        // borderWidth: 2,
                        // borderRadius: 5
                    }} >
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: "#9E1B32", 
                            width: (100 * (this.state.number + 1) / this.state.questions.length).toString() + '%'
                        }} />
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>Loading</Text>
                </View>
            )
        }
    }
};
export default SampleScreen;