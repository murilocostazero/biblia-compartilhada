import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import colors from '../../styles/colors';

const fonts = [
    'Anton-Regular',
    'BebasNeue-Regular',
    'DancingScript-VariableFont_wght',
    'Fruktur-Regular',
    'Lobster-Regular',
    'PTSans-Bold',
    'PTSans-Regular',
    'Roboto-Bold',
    'Roboto-Italic',
    'Roboto-Regular',
    'RobotoMono-VariableFont_wght',
    'Satisfy-Regular'
];

export default function FontPicker(props) {
    function renderFonts({ item }) {
        return (
            <TouchableHighlight
                underlayColor={colors.secondary.opacity}
                onPress={() => props.onSelectingFont(item)}
                style={styles.listItem}>
                <Text style={[
                    styles.listItemText,
                    {
                        fontFamily: item
                    }
                ]}>{item}</Text>
            </TouchableHighlight>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.labelTitle}>
                Fontes
            </Text>
            <FlatList
                horizontal={true}
                renderItem={renderFonts}
                keyExtractor={item => item}
                data={fonts} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8
    },
    labelTitle: {
        fontFamily: 'PTSans-Bold',
        color: '#FFF',
        fontSize: 16,
        marginBottom: 8
    },
    listItem: {
        backgroundColor: colors.primary.light,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        padding: 8
    },
    listItemText: {
        fontSize: 16,
        color: '#FFF'
    }
});