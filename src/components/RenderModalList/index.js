import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableHighlight, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';

export default function RenderModalList(props) {
    const [modalVisible, setModalVisible] = useState(false);

    function renderItems({ item }) {
        return (
            <TouchableHighlight
                onPress={() => {
                    props.onChangingSelectedItem(item);
                    setModalVisible(false);
                }}
                underlayColor={colors.primary.opacity}
                style={{
                    marginBottom: 4,
                    borderRadius: 8
                }}>
                <Text style={styles.label}>
                    {item}
                </Text>
            </TouchableHighlight>
        );
    }

    function FontSizePicker() {
        return (
            <Modal
                transparent={true}
                visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={[
                        styles.shadow,
                        {
                            width: 100,
                            height: 300,
                            backgroundColor: '#FFF',
                            padding: 8,
                            borderRadius: 8
                        }
                    ]}>
                        <FlatList
                            contentContainerStyle={{

                            }}
                            renderItem={renderItems}
                            keyExtractor={item => item}
                            data={props.itemsToChoose} />

                        <TouchableHighlight
                            onPress={() => setModalVisible(false)}
                            style={styles.cancelButton}
                            underlayColor='transparent'>
                            <Text style={[styles.label, { color: '#FFF' }]}>
                                Cancelar
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <TouchableHighlight
            onPress={() => setModalVisible(true)}
            underlayColor='transparent'>
            <View style={styles.container}>
                <FontSizePicker />
                <Text style={styles.label}>
                    {props.selectedItem}
                </Text>
                <Ionicons name='caret-down-outline' size={14} color={colors.primary.regular} />
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        width: 68,
        padding: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    label: {
        color: colors.primary.regular,
        fontFamily: 'PTSans-Bold',
        fontSize: 18,
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    cancelButton: {
        backgroundColor: colors.error,
        padding: 4,
        borderRadius: 8
    }
});