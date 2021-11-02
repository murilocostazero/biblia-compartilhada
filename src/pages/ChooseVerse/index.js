import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableHighlight, Text } from 'react-native';
import { storeData } from '../../handlers/handlerASChoice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';
import Bible from '../../handlers/handleBible';

export default function ChooseVerse({ route, navigation }) {
    const { choosedBook } = route.params;
    const [chapters, setChapters] = useState(0);

    useEffect(() => {
        getChaptersVerses(choosedBook);
    }, []);

    function getChaptersVerses(book) {
        let bible = new Bible();
        let verses = bible.getVersesList(book);
        setChapters(verses);
    }

    async function addChoiceToStorageAndNavigate(item) {
        //Add book and chapter to async storage and navigate to home
        let choice = { choosedBook: choosedBook, chapter: item.index };
        await storeData(choice);
        navigation.navigate('Home');
    }

    function renderChapters(item) {
        return (
            <TouchableHighlight
                underlayColor={colors.primary.regular}
                style={styles.chapterButton}
                onPress={() => addChoiceToStorageAndNavigate(item)}>
                <Text style={styles.listText}>{item.index + 1}</Text>
            </TouchableHighlight>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableHighlight underlayColor='transparent' onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>

                <Text style={styles.headerTitle}>Livro: {choosedBook}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.chooseChapterText}>Escolha o capítulo</Text>
                <View style={{ paddingLeft: 8, paddingTop: 16, paddingBottom: 64 }}>
                    <FlatList
                        contentContainerStyle={{ alignItems: 'center' }}
                        data={chapters}
                        renderItem={renderChapters}
                        numColumns={5}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.darkBackground
    },
    header: {
        width: '100%',
        height: 58,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkBackground
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    bookName: {
        marginVertical: 4,
        fontWeight: '600',
        fontSize: 18
    },
    chooseChapterText: {
        fontSize: 18,
        fontFamily: 'PTSans-Regular',
        color: colors.primary.dark,
    },
    chapterButton: {
        margin: 8,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary.dark,
        backgroundColor: colors.primary.light
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'PTSans-Bold',
        color: colors.primary.regular,
        marginLeft: 16
    },
    listText: {
        fontSize: 18,
        fontFamily: 'PTSans-Regular',
        color: '#FFF'
    },
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
});