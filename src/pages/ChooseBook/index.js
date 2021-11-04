import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableHighlight, TextInput, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';
import Bible from '../../handlers/handleBible';

export default function ChooseBook({ navigation }) {
    const [query, setQuery] = useState('');
    const [chaptersList, setChaptersList] = useState([]);

    useEffect(() => {
        getChaptersList();
    }, []);

    function getChaptersList() {
        let bible = new Bible();
        let chapters = bible.getChaptersList();
        setChaptersList(chapters);
    }

    const filteredChapters = query
        ? chaptersList.filter(
            chapterName => chapterName
                .toLowerCase()
                .includes(query.toLowerCase()))
        : chaptersList;

    function renderBooks({ item }) {
        return (
            <TouchableHighlight 
                underlayColor='transparent'
                style={styles.listItem}
                onPress={() =>
                    navigation.navigate('ChooseVerse', {
                        choosedBook: item
                    })}>
                <View style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Text style={styles.listText}>{item}</Text>
                    <Ionicons name="chevron-forward-outline" color={colors.primary.light} size={22} />
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={styles.header}>
                <TouchableHighlight underlayColor='transparent' onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>

                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder='Faça uma busca pelo nome do livro'
                        placeholderTextColor={colors.icon}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        value={query}
                        onChangeText={(text) => setQuery(text)} />
                    <Ionicons name='search' color={colors.primary.dark} size={22} />
                </View>
            </View>
            <View style={styles.container}>
                <View style={{ paddingLeft: 8 }}>
                    <FlatList
                        contentContainerStyle={{
                            backgroundColor: 'transparent',
                            borderRadius: 16,
                            padding: 4
                        }}
                        data={filteredChapters}
                        renderItem={renderBooks}
                        keyExtractor={item => item}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flex: 1
    },
    searchBarContainer: {
        marginHorizontal: 8,
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.icon,
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        height: 56,
    },
    searchBar: {
        flex: 1,
        fontFamily: 'PTSans-Regular',
        fontSize: 16,
        color: colors.primary.regular
    },
    listText: {
        marginVertical: 4,
        fontSize: 18,
        fontFamily: 'PTSans-Bold',
        color: colors.primary.regular
    },
    listItem: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginBottom: 2,
    }
});