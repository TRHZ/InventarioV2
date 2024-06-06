import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';
import LocalDB from '../persistance/localdb.ts';

interface ExitsProps {
    route: {
        params?: {
            productId?: number;
        };
    };
}

const Exits: React.FC<ExitsProps> = ({ route }) => {
    const { productId } = route.params ?? { productId: undefined };

    const [cantidad, setCantidad] = useState('');

    const subtractProductQuantity = async () => {
        if (productId !== undefined && cantidad !== '') {
            try {
                const quantity = parseInt(cantidad);
                if (isNaN(quantity) || quantity <= 0) {
                    console.error('La cantidad debe ser un número positivo.');
                    return;
                }
                const db = await LocalDB.connect();
                db.transaction(async tx => {
                    tx.executeSql(
                        'UPDATE productos SET currentStock = currentStock - ? WHERE id = ?',
                        [quantity, productId],
                        () => {
                            console.log('Cantidad restada correctamente del producto.');

                            // Insertar registro en la tabla 'egresos'
                            tx.executeSql(
                                'INSERT INTO egresos (productoId, cantidad) VALUES (?, ?)',
                                [productId, quantity],
                                () => console.log('Registro de egreso insertado correctamente'),
                                error => console.error('Error al insertar registro de egreso:', error)
                            );
                        },
                        error => console.error({ error }),
                    );
                });
            } catch (error) {
                console.error("Error restando cantidad del producto:", error);
            }
        } else {
            console.error('El ID del producto o la cantidad no están definidos.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Cantidad a restar:</Text>
            <TextInput
                style={styles.input}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                placeholder="Ingrese la cantidad"
                placeholderTextColor="gray"
            />
            <Button title="Restar Cantidad" onPress={subtractProductQuantity} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff', // Fondo blanco
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        color: 'black',  // Texto negro
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: 'black',  // Texto negro
    },
});

export default Exits;
