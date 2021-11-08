import React, { useState, useRef } from 'react';
import { View, Text, TouchableHighlight, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-share';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker'
import colors from '../../styles/colors';

export default function ModalColorPicker(props) {
    const [currentColor, setCurrentColor] = useState(colors.background);

    return (
        <Modal
            transparent={true}
            visible={props.isModalColorPickerVisible}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                padding: 16,
                backgroundColor: 'rgba(240,240,240,0.85)'
            }}>

                <View style={[styles.shadow, {
                    borderRadius: 16,
                    padding: 16,
                    maxHeight: '80%',
                    backgroundColor: currentColor,
                    justifyContent: 'center'
                }]}>
                    <TriangleColorPicker
                        hideControls={true}
                        onColorSelected={(color) => setCurrentColor(color)}
                        onColorChange={(color) => setCurrentColor(fromHsv(color))}
                        style={{
                            height: '60%'
                        }}
                    />

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 16
                    }}>
                        <TouchableHighlight
                            underlayColor='transparent'
                            onPress={() => props.onModalColorPickerCancel()}
                            style={[{
                                backgroundColor: colors.error,
                                padding: 8,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }, styles.shadow]}>
                            <Text style={{
                                fontFamily: 'PTSans-Bold',
                                color: colors.background,
                                fontSize: 16
                            }}>CANCELAR</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor='transparent'
                            onPress={() => props.onSelectingColor(currentColor)}
                            style={[{
                                backgroundColor: colors.success,
                                padding: 8,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 8
                            }, styles.shadow]}>
                            <Text style={{
                                fontFamily: 'PTSans-Bold',
                                color: colors.background,
                                fontSize: 16
                            }}>APLICAR COR</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
});