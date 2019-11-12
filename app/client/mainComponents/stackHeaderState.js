import React, { createContext } from 'react';
import {
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack';
import Svg, { Path } from 'react-native-svg';
import StateDNV from './DrawerNavigator'
import {
    createSwitchNavigator,
    createAppContainer,
} from 'react-navigation';

const StackNav = createStackNavigator({
    Main: {
        screen: StateDNV,
        navigationOptions: (props) => ({
            headerBackground: (
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    height: '90%',
                    width: "94%",
                    marginTop: "0.5%",
                    marginBottom: "0%",
                }}>
                    <View style={{
                        width: undefined,
                        height: "80%",
                        flex: 5 / 8,
                        resizeMode: 'contain',
                    }}>
                        <Svg width='100%' height='100%' viewBox="0 0 577.11 148.55">
                            <Path d="M470.28,394.39c-12,0-24.3,1.37-36.31,1.37,3,4.64,3,11.74,3,17.88v34.94c0,10.51,0,24.57-4.5,34.27,9.28,0,18.42.54,27.71.54,18.56,0,34.94-6.28,34.94-27.85,0-14.74-10.92-19.79-23.61-22.66v-.27c9.69-4.09,19.11-9.82,19.11-21.7s-9.69-16.52-20.34-16.52Zm-177.72,1.37c3,4.64,3,11.74,3,17.88v38.22c0,6.42-.54,25.66-4.64,31h37.81c2.73,0,5.6-.14,8.33-.41l2.59-12.83c-6.82,6.68-13.79,7.78-21.43,7.78H307.85V413.64c0-6.14,0-13.24,3-17.88Zm296.53,0c3.27,2.05,3.41,4,3.41,7.64v34.13c0,14.74-.55,36.31-5.6,43.54l-1.23,1.77h16.25c-3-4.5-3-13.37-3-24l.14-44.36c0-2,0-4.5,1.23-4.5s2.19,3.27,3.69,7.23l25.93,67L660.48,412c.41-1.09.82-2,1.77-2s1,1.63,1,3v45.31c0,7.65,0,17.75-2.46,24.58h20.06c-3-5.46-3.55-11.74-4.23-17.89-1.77-16.38-1.09-33.44-1.09-49.82,0-6.82-.41-14.19,2.73-19.38H664.3c-3.41,0-4.37,2.87-5.6,5.73l-23.61,56.94c-.82,1.91-1.23,3.27-2.46,3.27s-1.5-2.32-2.18-4.37l-20.2-59.51c-.54-1.78-2.59-2.05-4.23-2.05H589.09Zm-354,0-.14,3.68c0,11.2-28.11,69.76-35.89,79.58l-3,3.82h17.06a33.49,33.49,0,0,1-.41-5.18c0-7.78,6.14-21.16,12-33h30.72l14.88,38.22h14.74l-2.73-5c-13.65-25.25-22.39-54.87-31.13-82H235.14Zm143.62,0-.14,3.68c0,11.2-28.12,69.76-35.9,79.58l-3,3.82h17.06a33.49,33.49,0,0,1-.41-5.18c0-7.78,6.15-21.16,12-33H399.1L414,482.85h14.74L426,477.8c-13.65-25.26-22.39-54.88-31.12-82Zm154,0-.14,3.68c0,11.2-28.11,69.76-35.89,79.58l-3,3.82h17.06a33.49,33.49,0,0,1-.41-5.18c0-7.78,6.15-21.16,12-33H553.1L568,482.85h14.74L580,477.8c-13.65-25.26-22.39-54.88-31.12-82Zm190.5,0-.14,3.68c0,11.2-28.12,69.76-35.9,79.58l-3,3.82h17.06a33.49,33.49,0,0,1-.41-5.18c0-7.78,6.15-21.16,12-33H743.6l14.88,38.22h14.74l-2.73-5.05c-13.64-25.25-22.37-54.87-31.11-82H723.26Zm-265.54,4.09c11.19,0,19.52,1.78,19.52,14.06,0,14.47-12.29,18.29-24.3,18.29h-3.68V400.4c3-.27,5.86-.55,8.46-.55Zm-216.43,6.83c1.23,0,2.05,2.32,2.32,3.28l9.56,29.21H227.09L239,410c.27-.69,1.09-3.28,2.32-3.28Zm143.62,0c1.23,0,2,2.32,2.32,3.28l9.55,29.2H370.71L382.59,410c.27-.69,1.09-3.28,2.32-3.28Zm154,0c1.23,0,2.05,2.32,2.32,3.28l9.56,29.2H524.72L536.59,410c.27-.69,1.09-3.28,2.32-3.28Zm190.5,0c1.22,0,2,2.32,2.32,3.27l9.55,29.21H715.21L727.09,410c.27-.68,1.09-3.27,2.32-3.27ZM449.27,437.12h2.32c15.7,0,29.35,2.05,29.35,20.75,0,14.6-8.6,20.06-22.53,20.06-9.14,0-9.14-3.41-9.14-19.24V437.12Z"
                                transform="translate(-196.11 -335.66)" fill="#989898" />
                            <Path d="M562.44,335.66c-4.86,0-8.92,3.17-8.92,7.36,0,4.41,2.9,6.33,5.49,8.33s7.22,4.42,7.22,8.34c0,3.48-2.36,5.13-5.44,5.13s-4.95-1.43-6.78-2.72l-1.91,2.58a13,13,0,0,0,8.78,3.26c5,0,9.67-3.21,9.67-8.16,0-4-2.49-6.87-6.77-10-4-2.89-5.93-4.54-5.93-6.77,0-2.41,1.74-4.24,4.86-4.24A10,10,0,0,1,568.1,341l2-2.23a10.09,10.09,0,0,0-7.71-3.12Zm148.85,0a15.29,15.29,0,0,0-15.61,15.6c0,9.32,6,16.68,15.61,16.68s15.6-7.36,15.6-16.68a15.29,15.29,0,0,0-15.6-15.6Zm-259.09.09-4.42.8,11.55,30.85h2.9l12.44-31.11-3.88-.54c-3.17,8.52-6.38,17.07-9.5,26.66h-.09c-3-9.59-6-18.14-9-26.66Zm190.22,0-4.68.9,9.4,17.25v13.5h4.33V353.9L662,336.29l-3.83-.54-8.2,14.8-7.54-14.8Zm-428.85.45v3.12h10V367.4h4.33V339.32h10V336.2Zm37.76,0v31.2h4.32V351.89H270.9V367.4h4.32V336.2H270.9v12.57H255.65V336.2Zm40.83,0v31.2h17.3v-3.12h-13V352.51h10.84v-3.12H296.48V339.32h11.06V336.2Zm53.4,0v19.08c0,8,3.53,12.66,12.31,12.66,7.53,0,11.86-5,11.86-12V336.2h-4.06v19.66c0,4.45-2,9.09-7.8,9.09-5.57,0-8-3.39-8-9.85V336.2Zm40.66,0v31.2h3.57V342.57h.09c1.87,2.72,13.5,16.72,20.28,24.83h3.39V336.2H410v24.87h-.09c-2.09-3.12-13.59-16.76-20.46-24.87Zm44.27,0v31.2h4.32V336.2Zm57.15,0v31.2h17.29v-3.12H492V352.51h10.83v-3.12H492V339.32H503V336.2Zm31.61,0v31.2h4.32V354.47h4.59l7.22,13.47,4.37-1.34L532,353.31c3-1.91,5.22-4.5,5.22-9.09,0-5.39-4-8-9.05-8Zm66.86,0v31.2h4.33V336.2Zm17.75,0v3.12h10V367.4h4.33V339.32h10V336.2Zm138.37,0v31.2h4.32V354.3h10.83v-3.13H746.55V339.32h11.06V336.2Zm-30.94,2.58c7.71,0,10.83,6.64,10.83,12.48,0,6.11-2.76,13.56-10.83,13.56s-10.83-7.45-10.83-13.56C700.46,345.42,703.58,338.78,711.29,338.78Zm-187.72.54h3.7c2.9,0,5.3,1.47,5.3,5.3,0,2.63-1,6.73-6.55,6.73h-2.45v-12Z"
                                transform="translate(-196.11 -335.66)" fill="#989898" />
                        </Svg>
                    </View>
                </View>
            ),
            headerStyle: { borderBottomColor: 'black', height: 60 },
            headerRight: (
                <TouchableOpacity
                    style={{ resizeMode: 'contain', width: 50, height: 50, alignSelf: 'center', justifyContent: 'center' }}
                    onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
                >
                    <Icon name="bars" size={45} color="#989898" style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
            ),
            headerRightContainerStyle: {
                marginRight: "2%",
                alignSelf: 'center',
                alignItems: 'center',
                alignContent: 'center',
            }
        })
    }
},
    {
        headerMode: "screen",
    }
);


<<<<<<< Updated upstream
const StateHeaderContainer = createAppContainer(StackNav);
class StateHeader extends React.Component {
    static router = StateHeaderContainer.router;
    constructor(props) {
        super(props);
    }
    render() {
        let {navigation} = this.props;
        console.log("In stackHeaderState")
        console.log(this.router)
        console.log(this.props)
        return (
            <StateHeaderContainer 
            screenProps={{...this.props.screenProps}} 
            navigation={navigation}
            />
        )
    }
}
export default StateHeader;
=======
export default createAppContainer(StackNav);
// class StateHeader extends React.Component {
//     static router = StateHeaderContainer.router;
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         let {navigation} = this.props;
//         return (
//             <StateHeaderContainer 
//             screenProps={{...this.props.screenProps}} 
//             navigation={navigation}
//             />
//         )
//     }
// }
// export default StateHeader;
>>>>>>> Stashed changes
