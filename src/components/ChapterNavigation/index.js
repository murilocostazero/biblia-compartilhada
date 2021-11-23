import React, { useRef } from 'react';
import { View, Text, TouchableHighlight, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import generalStyles from '../../styles/general';

export default function ChapterNavigation(props) {
    const FadeInView = (props) => {
        const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
        React.useEffect(() => {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                }
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

    return (
        <FadeInView>
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
        </FadeInView>
    );
}