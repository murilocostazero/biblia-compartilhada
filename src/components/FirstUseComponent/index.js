import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import LottieView from 'lottie-react-native';

export default function FirstUseComponent() {
    return (
        <View style={styles.container}>
            <LottieView 
                style={{width: 200, height: 200}}
                source={require('../../assets/lottie/book.json')} autoPlay loop />
            <Text style={styles.welcomeMessage}>
                Olá! Esse parece ser o seu primeiro acesso no app.
                Vamos começar?
            </Text>
        </View>
    );
}