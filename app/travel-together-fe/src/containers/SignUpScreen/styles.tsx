import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
    marginTop: 15,
    shadowColor: 'white'
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
    marginTop: 15,
    borderRadius: 3,
    backgroundColor: '#0094FF',
    padding: 10,
    textAlign: 'center',
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
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: 'white',
    marginLeft: -25,
  },
  containerPhoneNumberInput: {
    height: 15
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonModal: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: '#0094FF',
    padding: 10,
    textAlign: 'center',
  },
});