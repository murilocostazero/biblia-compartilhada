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
import { getLastDay, storeLastDay } from '../../handlers/handleLastDay';
import { getFavoriteData, storeFavoriteData } from '../../handlers/handlerASFavorites';
import { getDailyVerseData, storeDailyVerseData } from '../../handlers/handleDailyVerses';

export default function DailyVerse({ navigation }) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const [verseToShow, setVerseToShow] = useState(null);
    const [verseIsSelected, setVerseIsSelected] = useState(false);
    const [today, setToday] = useState('');

    useEffect(() => {
        checkDay();
    }, []);

    async function checkIfVerseIsSelected(item) {
        //Primeiro preciso ver qual versiculo está sendo mostrado
        let favorite = {
            id: `${item.book}-${item.chapter}-${item.id}`,
            book: item.book,
            chapter: item.chapter,
            verse: {
                id: item.id,
                text: item.verse
            }
        }
        //Verificar se o verso existe na lista de favoritos
        let favoriteVerse = await findVerse(favorite);
        //Setar como verseIsSelected
        if (favoriteVerse != -1) {
            setVerseIsSelected(true);
        } else {
            setVerseIsSelected(false);
        }
    }

    async function checkDay() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        //Pegar o dia de hoje
        let todayDate = `${day} de ${months[month]} de ${year}`;
        setToday(todayDate);

        //Pegar a ultima data salva
        const lastDay = await getLastDay();

        //Versículo anterior
        const verse = await getDailyVerseData();

        // console.log('Hoje: ', todayDate)
        // console.log('Ontem: ', lastDay)
        // console.log('Versículo salvo: ', verse)

        if (lastDay === todayDate && verse != null) {
            await setVerseToShow(verse);
            checkIfVerseIsSelected(verse);
        } else {
            const verseRandom = randomVerse();
            await setVerseToShow(verseRandom);
            await storeDailyVerseData(verseRandom);
            await storeLastDay(todayDate);
            checkIfVerseIsSelected(verseRandom);
        }
    }

    function randomVerse() {
        const bible = new Bible();
        const verse = getRandomVerse();
        const selectedVerse = bible.getSingleVerse(verse);
        const verseObject = { id: verse.verse, verse: selectedVerse, book: verse.choosedBook, chapter: verse.chapter };

        return verseObject;
    }

    async function findVerse(verse) {
        let favorites = await getFavorites();
        let favorite = favorites.findIndex((item) => item.id == verse.id);
        return favorite;
    }

    async function getFavorites() {
        const favorites = await getFavoriteData();
        return favorites == null ? [] : favorites;
    }

    async function setFavorites(data) {
        await storeFavoriteData(data);
    }

    async function addVerseToFavorites() {
        const selectedVerse = verseToShow;

        let favorite = {
            id: `${selectedVerse.book}-${selectedVerse.chapter}-${selectedVerse.id}`,
            book: selectedVerse.book,
            chapter: selectedVerse.chapter,
            verse: {
                id: selectedVerse.id,
                text: selectedVerse.verse
            }
        }
        //Pegar lista de favoritos
        let favorites = await getFavorites();
        //Verificar se o verso existe na lista de favoritos
        let favoriteVerse = await findVerse(favorite);

        //Se o verso já estiver em favoritos, excluir
        if (favoriteVerse != -1) {
            setVerseIsSelected(false);
            favorites.splice(favoriteVerse, 1);
        } /* Se não, adicionar */ else {
            setVerseIsSelected(true);
            favorites.push(favorite);
        }
        setFavorites(favorites);
    }

    function onShare() {
        navigation.navigate('Share', {
            selectedVerses: [verseToShow],
            choice: {
                choosedBook: verseToShow.book,
                chapter: verseToShow.chapter
            }
        })
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
                <Text style={[styles.primaryLabel, {
                    color: colors.primary.dark,
                    marginBottom: 16,
                    fontSize: 18
                }]}>
                    {today}
                </Text>
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
                                ? `${verseToShow.verse}`
                                : 'Carregando...'
                        }
                    </Text>

                    <View style={[generalStyles.rowView, {
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }]}>

                        <TouchableHighlight
                            onPress={() => addVerseToFavorites()}
                            style={styles.actionButton}
                            underlayColor='transparent'>
                            <MaterialIcons
                                name={verseIsSelected ? 'favorite' : 'favorite-outline'}
                                color={verseIsSelected ? colors.error : colors.icon}
                                size={32} />
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => onShare()}
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
        borderRadius: 40 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});