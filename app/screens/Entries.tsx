import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';
import LocalDB from '../persistance/localdb.ts';

interface EntriesProps {
    route: {
        params?: {
            productId?: number;
        };
    };
}

const Entries: React.FC<EntriesProps> = ({ route }) => {
    const { productId } = route.params ?? { productId: undefined };

    const [cantidad, setCantidad] = useState('');

    const addProductQuantity = async () => {
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
                        'UPDATE productos SET currentStock = currentStock + ? WHERE id = ?',
                        [quantity, productId],
                        () => {
                            console.log('Cantidad agregada correctamente al producto.');

                            // Insertar registro en la tabla 'ingresos'
                            tx.executeSql(
                                'INSERT INTO ingresos (productoId, cantidad) VALUES (?, ?)',
                                [productId, quantity],
                                () => console.log('Registro de ingreso insertado correctamente'),
                                error => console.error('Error al insertar registro de ingreso:', error)
                            );
                        },
                        error => console.error({ error }),
                    );
                });
            } catch (error) {
                console.error("Error agregando cantidad al producto:", error);
            }
        } else {
            console.error('El ID del producto o la cantidad no están definidos.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Cantidad a agregar:</Text>
            <TextInput
                style={styles.input}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                placeholder="Ingrese la cantidad"
                placeholderTextColor="gray"
            />
            <Button title="Agregar Cantidad" onPress={addProductQuantity} />
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

export default Entries;
