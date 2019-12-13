//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component, useContext } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { DrawerActions } from 'react-navigation-drawer';
import UserAvatar from 'react-native-user-avatar'
import AsyncStorage from '@react-native-community/async-storage';
import UserAPI from '../api/user.api'
import { StackActions, NavigationActions } from 'react-navigation'

export default class CustomSidebarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { photo: null, username: 'Bjarne Stroustrup' };
        init = () => {
            try {
                UserAPI.getUserInfoAsync()
                    .then((user) => {
                        if (user) {
                            this.setState({ username: user.name })
                        } else {
                            this.setState({ username: 'John Doe' });
                        }
                    });
            } catch (error) {
                this.setState({ username: 'John Doe' })
            }
        }
        init();
        getPic = async () => {
            try {
                const value = await AsyncStorage.getItem('@ProfilePicture');
                if (value !== null) {
                    this.props.screenProps.postMessage(value);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getPic();
        this.items = [
            {
                navOptionThumb: 'home',
                navOptionName: 'Home',
                screenToNavigate: 'Home',
                key: 1
            },
            {
                navOptionThumb: 'gears',
                navOptionName: 'Settings',
                screenToNavigate: 'Settings',
                key: 4
            },
            {
                navOptionThumb: 'quote-right',
                navOptionName: 'About',
                screenToNavigate: 'About',
                key: 5
            },
            {
                navOptionThumb: 'sign-out',
                navOptionName: 'Log Out',
                screenToNavigate: 'Login',
                key: 6
            },
        ];
    }
    render() {
        // console.log(this)
        return (
            <View style={styles.sideMenuContainer}>
                <UserAvatar name={this.state.username ? this.state.username : 'Fred Flinstone'} size={100} color="#a00003" radius={.33}
                    src={this.props.screenProps.status.uri}
                />
                <Text style={{ fontSize: 20, textAlign: "center", marginHorizontal: 5 }}>{this.state.username ? this.state.username : 'Fred Flinstone'}</Text>
                {/*Divider between Top Image and Sidebar Option*/}
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#808080',
                        marginTop: 15,
                    }}
                />
                {/*Setting up Navigation Options from option array using loop*/}
                <ScrollView
                    contentContainerStyle={{ width: Dimensions.get('window').width / 2.2 }}
                >
                    {this.items.map((item, key) => (
                        <TouchableHighlight
                            onPress={() => {
                                global.currentScreenIndex = key;
                                if (item.navOptionName == "Home") {
                                    // console.log(this.props)
                                    this.props.navigation.navigate("TabNav");
                                    this.props.navigation.navigate("Home");
                                }
                                else if (item.navOptionName == 'Log Out') {
                                    UserAPI.setAccessToken("");
                                    this.props.screenProps.onLogOutPress()
                                }
                                else {
                                    this.props.navigation.navigate(item.screenToNavigate);
                                }
                                this.props.navigation.dispatch(DrawerActions.closeDrawer());
                            }}
                            key={item.key}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    backgroundColor: global.currentScreenIndex === key ? '#ffffff' : '#ffffff',
                                }
                                }
                                key={item.key}>
                                <View style={{ marginRight: "5%", marginLeft: 10, width: "15%", }}>
                                    <Icon name={item.navOptionThumb} size={25} color="#808080" style={{ textAlign: 'center' }} />
                                </View>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: global.currentScreenIndex === key ? 'black' : 'black',
                                    }}
                                >
                                    {item.navOptionName}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    ))}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
});