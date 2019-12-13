import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    mainContainer: {
        backgroundColor: 'rgb(244,244,244)',
        height: '100%',
        flexDirection: 'column',
        padding: 0,
        alignItems: "center",
        flex: 1
    },
    loginButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        height: '13%',
        width: '85%',
        justifyContent: "space-between",
        textAlign: "center",
        textAlignVertical: "center",
        // borderColor: 'black',
        // borderWidth: 2
    },
    button: {
		width: 260,
		alignItems: 'center',
        backgroundColor: '#9E1B32',
        alignSelf: "flex-start"
	},
	buttonText: {
		textAlign: 'center',
		padding: 20,
        color: 'white',
	},
    
  });
  