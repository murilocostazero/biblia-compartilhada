import React, { useRef, useState } from 'react';
import colors from '../../styles/colors';
import generalStyles from '../../styles/general';
import {
    TouchableHighlight,
    View,
    Text,
    StyleSheet,
    Animated,
    Modal
} from 'react-native';
import LottieView from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Header(props) {
    const [modalVisible, setModalVisible] = useState(false);

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
                        :
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
                        <TouchableHighlight
                            onPress={() => props.chooseBook()}
                            style={styles.headerButton}
                            underlayColor={colors.primary.opacity}>
                            <MaterialIcons
                                name='menu-book'
                                color={colors.background}
                                size={28} />
                        </TouchableHighlight>
                }
            </View>
        );
    }

    function RenderMenu() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}>
                <View style={styles.menuContainer}>
                    <View style={styles.menu}>
                        <View style={styles.bibleContainerIcon}>
                            <LottieView
                                style={{ width: 100, height: 100 }}
                                source={require('../../assets/lottie/book.json')} autoPlay loop />
                            <Text style={styles.primaryLabel}>
                                Nova versão internacional
                            </Text>
                        </View>

                        <View style={{ paddingVertical: 16 }}>
                            <TouchableHighlight
                                onPress={() => {
                                    props.onTappingFavorites();
                                    setModalVisible(false);
                                }}
                                underlayColor={colors.secondary.opacity}
                                style={{ marginBottom: 16 }}>
                                <View style={generalStyles.rowView}>
                                    <MaterialIcons name='favorite' color={colors.icon} size={32} />
                                    <Text style={[styles.primaryLabel, { marginLeft: 8 }]}>
                                        Versículos favoritos
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={() => {
                                    props.goToDailyVerse();
                                    setModalVisible(false);
                                }}
                                underlayColor={colors.secondary.opacity}
                                style={{ marginBottom: 16 }}>
                                <View style={generalStyles.rowView}>
                                    <MaterialIcons name='today' color={colors.icon} size={32} />
                                    <Text style={[styles.primaryLabel, { marginLeft: 8 }]}>
                                        Versículo do dia
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={() => {
                                    props.goToSearchPage();
                                    setModalVisible(false);
                                }}
                                underlayColor={colors.secondary.opacity}
                                style={{ marginBottom: 16 }}>
                                <View style={generalStyles.rowView}>
                                    <MaterialIcons name='search' color={colors.icon} size={32} />
                                    <Text style={[styles.primaryLabel, { marginLeft: 8 }]}>
                                        Pesquisar na bíblia
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <TouchableHighlight
                        underlayColor='transparent'
                        onPress={() => setModalVisible(false)}
                        style={styles.outside}>
                        <View />
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={()=> setModalVisible(false)}
                        style={[styles.closeModalButton, generalStyles.shadow]}
                        underlayColor={colors.secondary.opacity}>
                        <MaterialIcons name='close' color='#FFF' size={32} />
                    </TouchableHighlight>
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>

            <RenderMenu />

            <View
                style={{
                    flex: 1,
                    alignItems: 'flex-start'
                }}>
                <TouchableHighlight
                    onPress={() => setModalVisible(true)}
                    underlayColor={colors.secondary.opacity}
                    style={styles.menuButton}>
                    <MaterialIcons name='menu' color={colors.icon} size={32} />
                </TouchableHighlight>
            </View>

            <Text style={styles.headerLabel}>Bíblia - NVI</Text>

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
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary.regular,
    },
    headerLabel: {
        color: '#FFF',
        fontSize: 25,
        fontFamily: 'Lobster-Regular',
        flex: 1,
        textAlign: 'center'
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
    },
    menuButton: {
        padding: 4,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        flexDirection: 'row'
    },
    closeModalButton: {
        position: 'absolute',
        bottom: 16,
        left: '50%',
        backgroundColor: colors.icon,
        width: 48,
        height: 48,
        borderRadius: 48/2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menu: {
        backgroundColor: colors.primary.dark,
        height: '100%',
        width: '70%'
    },
    outside: {
        height: '100%',
        width: '30%'
    },
    bibleContainerIcon: {
        backgroundColor: colors.primary.regular,
        alignItems: 'center',
        padding: 8
    },
    primaryLabel: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'PTSans-Bold'
    }
});