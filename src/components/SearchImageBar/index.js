import React, { useState } from 'react';
import { View, TouchableHighlight, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../styles/colors';

export default function SearchImageBar(props) {
    const [query, setQuery] = useState('');

    return (
        <View
            style={{
                backgroundColor: colors.primary.light,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                height: 38
            }}>
            <TextInput
                value={query}
                onChangeText={(text) => setQuery(text)}
                onSubmitEditing={() => props.getImages(query)}
                style={{
                    width: 112,
                    padding: 2
                }} />

            <TouchableHighlight
                underlayColor='transparent'
                onPress={() => props.getImages(query) } >
                <MaterialIcons name='search' color={colors.icon} size={22} />
            </TouchableHighlight>
        </View>
    );
}
