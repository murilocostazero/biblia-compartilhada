import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';

export default function VersesSettings(props) {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                <TouchableHighlight
                    onPress={() => {
                        props.textVerseSize > 7
                            ? props.onChangingTextVerseSize(props.textVerseSize - 1)
                            : props.onChangingTextVerseSize(props.textVerseSize)
                    }}
                    style={[
                        styles.textFormatButton,
                        { backgroundColor: props.readMode ? colors.secondary.regular : colors.primary.regular }
                    ]}>
                    <MaterialIcons name='remove' color='#FFF' size={18} />
                </TouchableHighlight>
                <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                    <Text style={styles.textFormatLabel}>
                        Tamanho
                    </Text>
                    <Text style={{color: '#FFF'}}>
                        {props.textVerseSize}
                    </Text>
                </View>
                <TouchableHighlight
                    onPress={() => {
                        props.textVerseSize < 30
                            ? props.onChangingTextVerseSize(props.textVerseSize + 1)
                            : props.onChangingTextVerseSize(props.textVerseSize)
                    }}
                    style={[styles.textFormatButton, { backgroundColor: props.readMode ? colors.secondary.regular : colors.primary.regular }]}>
                    <MaterialIcons name='add' color='#FFF' size={18} />
                </TouchableHighlight>
            </View>

            <View style={{ height: '80%', width: 2, backgroundColor: colors.icon }} />

            <TouchableHighlight
                    onPress={() => props.onChangingTextBold()}
                    underlayColor={colors.secondary.opacity}
                    style={[
                        styles.boldButton,
                        { 
                            backgroundColor: props.readMode 
                            ? colors.secondary.regular 
                            : props.textBold 
                            ? colors.primary.regular 
                            : colors.icon  
                        }
                    ]}>
                    <MaterialIcons name='format-bold' color={ props.textBold ? '#FFF' : colors.primary.regular } size={32} />
                </TouchableHighlight>

            <View style={{ height: '80%', width: 2, backgroundColor: colors.icon }} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.textFormatLabel, { marginRight: 8 }]}>Modo leitura</Text>
                <Switch
                    trackColor={{ false: colors.icon, true: colors.secondary.light }}
                    thumbColor={props.readMode ? colors.secondary.regular : colors.primary.light}
                    onValueChange={() => props.onChangingReadMode()}
                    value={props.readMode}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary.opacity,
        margin: 4,
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textFormatButton: {
        width: 22,
        height: 22,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textFormatLabel: {
        fontWeight: 'bold',
        color: '#FFF'
    },
    boldButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
});