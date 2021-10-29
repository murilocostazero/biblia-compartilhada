import React, {useState, useEffect} from 'react';
import { StyleSheet, View, FlatList, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';
import Bible from '../../files/handleBible';
import { Container, Header, SearchBar, ListItem, ListText, List } from './styles';

export default function ChooseBook({ navigation }) {
    const [query, setQuery] = useState('');
    const [chaptersList, setChaptersList] = useState([]);

    useEffect(() => {
        getChaptersList();
    }, []);

    function getChaptersList(){
        let bible = new Bible();
        let chapters = bible.getChaptersList();
        setChaptersList(chapters);
    }

    const filteredChapters = query
        ? chaptersList.filter(
            chapterName => chapterName
                .toLowerCase()
                .includes(query))
        : chaptersList;

    function renderBooks({ item }) {
        return (
            <ListItem
                onPress={() =>
                    navigation.navigate('ChooseVerse', {
                        choosedBook: item
                    })}>
                        <View style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <ListText>{item}</ListText>
                            <Ionicons name="chevron-forward-outline" color={colors.primary.light} size={22} />
                        </View>                
            </ListItem>
        );
    }

    return (
        <Container>
            <Header>
                <TouchableHighlight underlayColor='transparent' onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>

                <View style={styles.searchBarContainer}>
                    <SearchBar query={query} onChangeText={(text)=> setQuery(text)} />
                    <Ionicons name='search' color={colors.primary.dark} size={22} />
                </View>
            </Header>
            <View style={styles.container}>
                <View style={{ paddingLeft: 8 }}>
                    <List
                        data={filteredChapters}
                        renderItem={renderBooks}
                        keyExtractor={item => item}
                    />
                </View>
            </View>
        </Container>
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
    }
});