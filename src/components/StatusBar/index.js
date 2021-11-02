import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import colors from '../../styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 450,
                useNativeDriver: false
            },
        ).start();
    }, [fadeAnim])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}

export default function StatusBar(props) {
    return (
        <FadeInView>
            <View style={[
                styles.container,
                styles.shadow,
                {
                    backgroundColor:
                        props.type == 'error' ? colors.error : props.type == 'success'
                            ? colors.success : colors.warning
                }]}>
                <Text style={styles.messageLabel}>
                    {props.message}
                </Text>
                <MaterialIcons
                    name={
                        props.type == 'error' ? 'error' : props.type == 'success'
                            ? 'check' : 'warning'
                    }
                    color='#FFF'
                    size={28} />
            </View>
        </FadeInView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        position: 'absolute',
        height: 48,
        left: 16,
        right: 16,
        bottom: 112,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    shadow: {
        shadowColor: '#FFF',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7
    },
    messageLabel: {
        color: '#FFF',
        fontFamily: 'PTSans-Bold',
        fontSize: 16,
        marginRight: 8
    }
});