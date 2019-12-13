import { StyleSheet } from 'react-native';
export default StyleSheet.create({
	mainContainer: {
		backgroundColor: 'rgb(244,244,244)',
		height: '100%',
		flexDirection: 'column',
		padding: 20,
		alignContent: "center",
		alignItems: "center",
		flex: 1,
		justifyContent: 'center'
	},
	logo: {
		alignSelf: 'center',
		height: 100,
		width: 100,
		// marginTop: '20%',
		marginBottom: '10%',
	},
	textBox: {
		height: 40,
		width: '60%',
		alignSelf: 'center',
		borderColor: 'gray',
		borderWidth: 1,
		marginTop: 10,
		borderRadius: 3,
		paddingLeft: 10,
		backgroundColor: 'white',
		fontSize: 16,
	},
	buttonContainer: {
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: '60%',
		height: 40,
		borderRadius: 3,
		marginTop: 30,
	},
	loginButton: {
		backgroundColor: 'rgb(163, 0, 0)',
	},
	demoButton: {
		backgroundColor: 'rgb(255, 255, 255)',
		opacity: 0.3,
	},
	loginButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
	},
	linkText: {
		marginTop: '6%',
		color: '#990000',
		fontSize: 14,
		textDecorationLine: 'underline',
		
	},
});
