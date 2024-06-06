import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, Button, View, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    screen: {
        height: '100%',
        backgroundColor: '#323844',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C0C0C020',
        width: '100%',
        padding: 16,
    },
    textInput: {
        borderBottomWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: '80%',
        margin: 8,
        color: 'black', // Hacer el texto negro
    },
    text: {
        color: '#FFFFFF',
        fontSize: 30,
    }
});

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
};

type LoginProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function Login({ navigation }: LoginProps): React.JSX.Element {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');

    const btnIngresarOnPress = function () {
        if (usuario && contraseña) {
            navigation.navigate('Home');
            return;
        }
        Alert.alert('Fallido', 'Datos incorrectos')
    };
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.text}>Iniciar sesión</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Usuario"
                    placeholderTextColor='#828894'
                    onChangeText={u => setUsuario(u)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Contraseña"
                    placeholderTextColor='#828894'
                    secureTextEntry={true}
                    onChangeText={p => setContraseña(p)}
                />
                <Button title='Ingresar' onPress={btnIngresarOnPress} />
            </View>
        </SafeAreaView>
    );
}

export default Login;
