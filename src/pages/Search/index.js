import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Text,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import Bible from '../../handlers/handleBible';
import { storeData } from '../../handlers/handlerASChoice';

export default function Search({ navigation }) {
    const [query, setQuery] = useState('');
    const [oldQuery, setOldQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function getResults() {
        let bible = new Bible();
        bible.getVerse(query.toLowerCase()).then((item) => {
            setQuery('');
            setSearchResult(item);
            setIsLoading(false);
        });
    }

    function checkIfQueryEmpty() {
        if (query.length > 2) {
            setOldQuery(query);
            setIsLoading(true);
            getResults();
        } else {
            Alert.alert('Insira um termo de busca', 'Digite uma palavra ou frase que deseja pesquisar na bíblia.')
        }
    }

    async function addSearchToStorageAndNavigate(item) {
        //Add book and chapter to async storage and navigate to home
        let choice = { choosedBook: item.book, chapter: item.chapter, indexItem: item.verse.id };
        await storeData(choice);
        navigation.navigate('Home');
    }

    // function getHighlightedText(text) {
    //     const value = oldQuery;
    //     const parts = text.split(new RegExp(`(${value})`, 'gi'));
    //     return (
    //         <Text style={styles.itemText}>
    //             {
    //                 parts.map(part => part.toLowerCase() === value.toLowerCase()
    //                     ? <Text style={{ color: '#FFF', backgroundColor: colors.secondary.regular }}>
    //                         {part}
    //                     </Text>
    //                     : part)
    //             }
    //         </Text>
    //     );
    // }

    function renderSearchResults({ item }) {
        const id = item.book + item.chapter + item.verse.id;
        const value = oldQuery;
        const parts = item.verse.text.split(new RegExp(`(${value})`, 'gi'));
        return (
            <TouchableHighlight
                onPress={() => addSearchToStorageAndNavigate(item)}
                underlayColor={colors.secondary.opacity}
                style={{ margin: 12, borderRadius: 8 }}>
                <View style={[styles.listItem, styles.shadow]}>
                    <Text style={styles.itemTitle}>
                        {item.book}, capítulo {item.chapter + 1}, versículo {item.verse.id + 1}
                    </Text>
                    <Text style={styles.itemText}>
                        {
                            parts.map(part => part.toLowerCase() === value.toLowerCase()
                                ? <Text
                                    key={id+Math.random()}
                                    style={{
                                        color: '#FFF',
                                        backgroundColor: colors.secondary.regular
                                    }}>
                                    {part}
                                </Text>
                                : part)
                        }
                    </Text>
                    {/* <Text style={styles.itemText}>{item.verse.text}</Text> */}
                </View>
            </TouchableHighlight>
        );
    }

    function RenderNoItemsFounded() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <MaterialIcons name='sentiment-dissatisfied' color={colors.icon} size={60} />
                <Text style={{
                    color: colors.icon,
                    fontFamily: 'PTSans-Bold',
                    fontSize: 18,
                    marginTop: 8
                }}>Nenhum item encontrado na busca</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>

                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder='Faça uma busca pelo termo desejado'
                        placeholderTextColor={colors.icon}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        value={query}
                        onSubmitEditing={() => checkIfQueryEmpty()}
                        onChangeText={(text) => setQuery(text)} />

                    <TouchableHighlight
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 28 / 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        underlayColor={colors.secondary.opacity}
                        onPress={() => checkIfQueryEmpty()}>
                        <Ionicons name='search' color={colors.primary.dark} size={22} />
                    </TouchableHighlight>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {
                    isLoading == true
                        ? <ActivityIndicator size="large" color={colors.secondary.regular} />
                        :
                        searchResult.length == 0
                            ? <RenderNoItemsFounded />
                            :
                            <View>
                                <Text style={styles.listTitle}>
                                    {searchResult.length} {searchResult.length == 1 ? 'resultado encontrado' : 'resultados encontrados'}
                                </Text>
                                <FlatList
                                    data={searchResult}
                                    keyExtractor={item => item.book + item.chapter + item.verse.id}
                                    renderItem={renderSearchResults}
                                />
                            </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        height: 56,
    },
    searchBarContainer: {
        marginHorizontal: 8,
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.icon,
        alignItems: 'center'
    },
    searchBar: {
        flex: 1,
        fontFamily: 'PTSans-Regular',
        fontSize: 16,
        color: colors.primary.regular
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    listTitle: {
        color: colors.primary.regular,
        alignSelf: 'flex-end',
        marginVertical: 4,
        marginRight: 16,
        fontFamily: 'PTSans-Bold',
        fontSize: 14
    },
    listItem: {
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 8
    },
    itemTitle: {
        color: '#000',
        fontFamily: 'PTSans-Bold'
    },
    itemText: {
        color: '#000',
        fontFamily: 'PTSans-Regular'
    },
});