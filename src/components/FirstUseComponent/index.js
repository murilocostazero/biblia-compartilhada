import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';

export default function FirstUseComponent() {
    return (
        <View style={styles.container}>
            <FastImage
                style={{ width: 200, height: 200 }}
                source={require('../../images/book.gif')}
                resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.welcomeMessage}>
                Olá! Esse parece ser o seu primeiro acesso no app.
                Vamos começar?
            </Text>
        </View>
    );
}