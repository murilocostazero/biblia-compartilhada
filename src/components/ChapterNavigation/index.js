import React from 'react';
import {  View, Text, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';
import generalStyles from '../../styles/general';

export default function ChapterNavigation(props) {
    return (
        <View style={{
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8,
            paddingHorizontal: 16
        }}>
            {
                props.choice.choosedBook == "Gênesis" && props.choice.chapter == 0
                    ?
                    <View />
                    :
                    <TouchableHighlight
                        onPress={() => props.handleChapterNavigation(0)}
                        underlayColor='transparent'>
                        <View style={generalStyles.defaultButton}>
                            <Ionicons name='caret-back-outline' color='#FFF' size={28} />
                            <Text style={{ fontFamily: 'PTSans-Bold', color: '#FFF', fontSize: 16 }}>
                                Anterior
                            </Text>
                        </View>
                    </TouchableHighlight>
            }

            {
                props.choice.choosedBook == "Apocalipse" && props.choice.chapter == 21
                    ?
                    <View />
                    :
                    <TouchableHighlight
                        onPress={() => props.handleChapterNavigation(1)}
                        underlayColor='transparent'>
                        <View style={generalStyles.defaultButton}>
                            <Text style={{ fontFamily: 'PTSans-Bold', color: '#FFF', fontSize: 16 }}>
                                Próximo
                            </Text>
                            <Ionicons name='caret-forward-outline' color='#FFF' size={28} />
                        </View>
                    </TouchableHighlight>
            }
        </View>
    );
}