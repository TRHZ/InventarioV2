import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocalDB from '../persistance/localdb';

type ProductAddProps = {};

const ProductAdd: React.FC<ProductAddProps> = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [minStock, setMinStock] = useState('');
    const [maxStock, setMaxStock] = useState('');
    const [currentStock, setCurrentStock] = useState('');
    const navigation = useNavigation();

    const addProduct = async () => {
        try {
            const db = await LocalDB.connect();
            await db.transaction(async (tx) => {
                await tx.executeSql(
                    'INSERT INTO productos (nombre, precio, minStock, maxStock, currentStock) VALUES (?, ?, ?, ?, ?)',
                    [nombre, parseFloat(precio), parseInt(minStock), parseInt(maxStock), parseInt(currentStock)]
                );
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre del producto"
                placeholderTextColor="gray" // Hacer el texto del placeholder gris
            />
            <Text style={styles.label}>Precio:</Text>
            <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="Precio"
                keyboardType="numeric"
                placeholderTextColor="gray" // Hacer el texto del placeholder gris
            />
            <Text style={styles.label}>Stock mínimo:</Text>
            <TextInput
                style={styles.input}
                value={minStock}
                onChangeText={setMinStock}
                placeholder="Stock mínimo"
                keyboardType="numeric"
                placeholderTextColor="gray" // Hacer el texto del placeholder gris
            />
            <Text style={styles.label}>Stock máximo:</Text>
            <TextInput
                style={styles.input}
                value={maxStock}
                onChangeText={setMaxStock}
                placeholder="Stock máximo"
                keyboardType="numeric"
                placeholderTextColor="gray" // Hacer el texto del placeholder gris
            />
            <Text style={styles.label}>Stock actual:</Text>
            <TextInput
                style={styles.input}
                value={currentStock}
                onChangeText={setCurrentStock}
                placeholder="Stock actual"
                keyboardType="numeric"
                placeholderTextColor="gray" // Hacer el texto del placeholder gris
            />
            <Button title="Agregar Producto" onPress={addProduct} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        color: 'black', // Hacer el texto negro
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: 'black', // Hacer el texto negro
    },
});

export default ProductAdd;
