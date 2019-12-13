import React, { Component } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/home/index'
import ProfileScreen from '../screens/profile/index'
import JournalScreen from '../screens/journal/index'
import AcademicScreen from '../screens/academic/index'
import SurveyScreen from '../screens/survey/index'
import { createStackNavigator } from 'react-navigation-stack';
import {
    createAppContainer,
} from 'react-navigation';
import ResourceScreen from '../screens/resources/index';

const AcademicStack = createAppContainer(createStackNavigator({
    Academic: { screen: AcademicScreen },
},
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        initialRouteName: 'Academic'
}));
// const someting = createAppContainer(ProfileNavigator);
// class ProfileContainerState extends React.Component {
//     static router = ProfileContainer.router;
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         let {navigation} = this.props;
//         return (
//             <ProfileContainer 
//             screenProps={{...this.props.screenProps}} 
//             navigation={navigation}
//             />
//         )
//     }
// }
const AppNavigator = createBottomTabNavigator(
    {
        ProfileContainer: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 13, color: tintColor, textAlign: 'center' }}>
                        {'Profile'}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="user" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
        Survey: {
            screen: AcademicScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 13, color: tintColor, textAlign: 'center' }}>
                        {'Survey'}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="file-text" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 13, color: tintColor, textAlign: 'center' }}>
                        {'Home'}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="home" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
        Resources: {
            screen: ResourceScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 13, color: tintColor, textAlign: 'center' }}>
                        {'Resources'}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="university" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
        Journal: {
            screen: JournalScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 13, color: tintColor, textAlign: 'center' }}>
                        {'Journal'}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="pencil" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
    },
    {
        tabBarOptions: {
            activeTintColor: '#9E1B32',
            inactiveTintColor: 'gray',
            style: {
                height: 50
            },
        },
        backBehavior: "initialRoute",
        initialRouteName: 'Home'
    }
);
export default createAppContainer(AppNavigator);
// class TabContainerState extends React.Component {
//     static router = TabContainer.router;
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         let {navigation} = this.props;
//         return (
//             <TabContainer 
//             screenProps={{...this.props.screenProps}} 
//             navigation={navigation}
//             />
//         )
//     }
// }
// export default TabContainerState