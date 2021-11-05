import React, { useRef } from 'react';
import colors from '../../styles/colors';
import { TouchableHighlight, View, Text, StyleSheet, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Header(props) {
    const FadeInView = (props) => {
        const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
        React.useEffect(() => {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 500,
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

    function RenderHeaderButtons() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                    props.selectedVerses.length > 0
                        ? <View />
                        : <>
                            <TouchableHighlight
                                onPress={() => props.onTappingFavorites()}
                                style={styles.headerButton}
                                underlayColor={colors.primary.opacity}>
                                <MaterialIcons
                                    name='favorite'
                                    color={colors.icon}
                                    size={28} />
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => props.onOpenVersesSettings()}
                                style={styles.headerButton}
                                underlayColor={colors.primary.opacity}>
                                <MaterialIcons
                                    style={{ marginTop: 2 }}
                                    name={props.openVersesSettings == true ? 'close' : 'text-format'}
                                    color={colors.icon}
                                    size={32} />
                            </TouchableHighlight>
                        </>
                }
                {
                    props.selectedVerses.length == 1
                        ?
                        <FadeInView>
                            <TouchableHighlight
                                onPress={() => props.onAddingVerseToFavorite()}
                                style={styles.headerButton}
                                underlayColor={colors.primary.opacity}>
                                <MaterialIcons
                                    name={props.verseIsSelected ? 'favorite' : 'favorite-outline'}
                                    color={props.verseIsSelected ? colors.error : colors.icon}
                                    size={28} />
                            </TouchableHighlight>
                        </FadeInView>
                        : <View />
                }
                {
                    props.selectedVerses.length > 0
                        ?
                        <TouchableHighlight
                            onPress={() => props.unselectingVerses()}
                            style={styles.headerButton}
                            underlayColor={colors.primary.opacity}>
                            <MaterialIcons
                                name='close'
                                color={colors.icon}
                                size={28} />
                        </TouchableHighlight>
                        :
                        <>
                            <TouchableHighlight
                                onPress={() => props.goToSearchPage()}
                                style={styles.headerButton}
                                underlayColor={colors.primary.opacity}>
                                <MaterialIcons
                                    name='search'
                                    color={colors.icon}
                                    size={28} />
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => props.chooseBook()}
                                style={styles.headerButton}
                                underlayColor={colors.primary.opacity}>
                                <MaterialIcons
                                    name='menu-book'
                                    color={colors.background}
                                    size={28} />
                            </TouchableHighlight>
                        </>
                }
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerLabel}>Bíblia</Text>
            <View style={styles.buttonsContainer}>
                {
                    props.isFirstUse
                        ?
                        <View />
                        :
                        <RenderHeaderButtons />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors.primary.regular,
    },
    headerLabel: {
        color: '#FFF',
        fontSize: 25,
        fontFamily: 'Lobster-Regular',
        flex: 1
    },
    headerButton: {
        width: 32,
        height: 32,
        borderRadius: 32 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
    }
});