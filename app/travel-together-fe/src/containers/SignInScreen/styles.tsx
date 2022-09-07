import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'white',
      height: '100%'
    },
    title: {
      fontSize: 36,
      marginBottom: 30,
      marginTop: 16,
      color: 'white'
    },
    error: {
      fontSize: 11,
      color: 'red',
      marginTop: 5,
      marginBottom: 0,
      marginLeft: 36,
      marginRight: 36,
      textAlign: 'left',
      width: 345
    },
    input: {
      fontSize: 15,
      borderWidth: 1,
      padding: 13,
      width: 345,
      borderRadius: 3,
      backgroundColor: 'white',
      borderColor: '#D6D6D6',
      marginTop: 15
    },
    image: {
      width: 250,
      height: 250,
    },
    button: {
      fontSize: 18,
      color: 'white',
      width: 345,
      height: 50,
      marginTop: 0,
      borderRadius: 3,
      backgroundColor: '#0094FF',
      padding: 10,
      textAlign: 'center',
    },
    forgotPass: {
      textAlign: 'right',
      width: 345,
      color: '#0094FF',
      marginBottom: 15,
      marginTop: 15
    },
    text: {
      textAlign: 'center',
      width: 345,
      marginBottom: 15,
      marginTop: 15
    }, 
    layoutCreateAccount: {
      width: 345,
      marginTop: 15,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center'
    }
  });