import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general';
import colors from '../../styles/colors';
import { getRandomVerse } from '../../handlers/handleDailyVerses';
import Bible from '../../handlers/handleBible';

export default function DailyVerse({ navigation }) {
    const [verseToShow, setVerseToShow] = useState(null);

    useEffect(() => {
        randomVerse();
    }, []);

    function randomVerse() {
        const bible = new Bible();
        const verse = getRandomVerse();

        const selectedVerse = bible.getSingleVerse(verse);
        setVerseToShow({ verse: selectedVerse, book: verse.choosedBook, chapter: verse.chapter });
    }

    return (
        <View style={styles.container}>
            <View style={[generalStyles.rowView, styles.headerContainer]}>
                <TouchableHighlight
                    onPress={() => navigation.goBack()}
                    underlayColor='transparent'>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>

                <Text style={styles.headerTitle}>
                    Versículo do dia
                </Text>
            </View>

            <View style={styles.body}>
                <View style={[styles.verse, {
                    width: '100%'
                }]}>

                    <View
                        style={[generalStyles.rowView, {
                            padding: 0,
                            justifyContent: 'flex-end',
                            marginBottom: 8
                        }]}>
                        <Text
                            style={styles.primaryLabel}>
                            {
                                verseToShow != null
                                    ? `${verseToShow.book}, capítulo ${verseToShow.chapter + 1}`
                                    : 'Carregando...'
                            }
                        </Text>
                    </View>

                    <Text
                        style={styles.primaryLabel}>
                        {
                            verseToShow != null
                                ? `"${verseToShow.verse}"`
                                : 'Carregando...'
                        }
                    </Text>

                    <View style={[generalStyles.rowView, {
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }]}>

                        <TouchableHighlight
                            style={styles.actionButton}
                            underlayColor='transparent'>
                            <MaterialIcons 
                                name='favorite-outline' 
                                color={colors.icon} 
                                size={32} />
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={styles.actionButton}
                            underlayColor='transparent'>
                            <Ionicons 
                                name='share-social-outline' 
                                color={colors.icon} 
                                size={32} />
                        </TouchableHighlight>

                    </View>

                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    headerContainer: {
        backgroundColor: colors.background,
        borderBottomColor: colors.primary.opacity,
        borderBottomWidth: 0.4
    },
    headerTitle: {
        fontFamily: 'Lobster-Regular',
        color: colors.primary.regular,
        fontSize: 25,
        marginLeft: 20,
    },
    body: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    primaryLabel: {
        fontFamily: 'PTSans-Bold',
        fontSize: 18,
        color: '#FFF',
        textAlign: 'justify'
    },
    verse: {
        backgroundColor: colors.primary.light,
        padding: 8,
        borderRadius: 8
    },
    actionButton: {
        margin: 4,
        padding: 4,
        borderRadius: 8,
        width: 40,
        height: 40,
        borderRadius: 40/2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});