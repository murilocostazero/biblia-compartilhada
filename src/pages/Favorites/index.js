import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, FlatList, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import { getFavoriteData, storeFavoriteData } from '../../handlers/handlerASFavorites';
import { storeData } from '../../handlers/handlerASChoice';

export default function Favorites({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [favoriteVerse, setFavoriteVerse] = useState(null);

    useEffect(() => {
        getDataFromAS();
    }, [favoriteVerse]);

    async function getDataFromAS() {
        let data = await getFavoriteData();
        if (data != null) {
            setFavorites(data);
        } else {
            setFavorites([]);
        }
    }

    async function addFavoriteToStorageAndNavigate(item) {
        //Add book and chapter to async storage and navigate to home
        let choice = { choosedBook: item.book, chapter: item.chapter, indexItem: item.verse.id };
        await storeData(choice);
        navigation.navigate('Home');
    }

    async function findVerse(verse) {
        let favorites = await getFavorites();
        let favorite = favorites.findIndex((item) => item.id == verse.id);
        return favorite;
    }

    function onSharingFavorite(item){
        const selectedVerses = [
            {
                "id": item.verse.id, 
                "isSelected": true, 
                "verse": item.verse.text
            }
        ];
        let choice = { choosedBook: item.book, chapter: item.chapter };
        navigation.navigate('Share', { selectedVerses: selectedVerses, choice: choice })
    }

    async function onRemovingFromFavorites(item) {
        const allFavorites = favorites;
        const favoriteVerseId = await findVerse(item);
        if(favoriteVerseId != -1){
            allFavorites.splice(favoriteVerseId, 1);
        }       
        setFavorites(allFavorites);
        saveFavorites(allFavorites, item);
    }

    async function getFavorites(){
        const favorites = await getFavoriteData();
        return favorites != null ? favorites : [];
    }

    async function saveFavorites(allFavorites, item){
        await storeFavoriteData(allFavorites);
        setFavoriteVerse(item);
    }

    function RenderNoFavorites() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <MaterialIcons name='sentiment-dissatisfied' color={colors.icon} size={60} />
                <Text style={{
                    color: colors.icon,
                    fontFamily: 'PTSans-Bold',
                    fontSize: 18,
                    marginTop: 8
                }}>Você ainda não tem favoritos</Text>
            </View>
        );
    }

    function renderFavoriteItems({ item }) {
        return (
            <TouchableHighlight
                underlayColor={colors.secondary.opacity}
                onPress={()=> addFavoriteToStorageAndNavigate(item)}
                style={{ margin: 8, borderRadius: 8 }}>
                <View style={[styles.listItem, styles.shadow]}>
                    <View style={{ 
                        flex: 1, 
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}>
                        <Text style={styles.itemTitle} numberOfLines={1}>{item.book}</Text>
                        <Text style={styles.itemText}>{item.chapter + 1}-{item.verse.id + 1}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text
                            numberOfLines={2}
                            style={styles.itemText}>{item.verse.text}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableHighlight
                            style={styles.listItemButton}
                            underlayColor={colors.secondary.opacity}
                            onPress={() => onRemovingFromFavorites(item)}>
                            <Ionicons name='trash-outline' color={colors.icon} size={28} />
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={colors.secondary.opacity}
                            onPress={()=> onSharingFavorite(item)} 
                            style={styles.listItemButton}>
                            <Ionicons name='share-social-outline' color={colors.icon} size={28} />
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    function RenderFavorites() {
        return (
            <FlatList
                data={favorites}
                keyExtractor={item => item.id}
                renderItem={renderFavoriteItems}
            />
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>
                <Text style={styles.containerTitle}>Favoritos</Text>
            </View>

            <View style={styles.bodyContainer}>
                {
                    favorites.length < 1
                        ? <RenderNoFavorites />
                        : <RenderFavorites />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    containerTitle: {
        fontFamily: 'Lobster-Regular',
        color: colors.primary.regular,
        fontSize: 25,
        marginLeft: 20,
    },
    bodyContainer: {
        flex: 1,
        padding: 8
    },
    headerContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 0.4,
        borderBottomColor: colors.primary.opacity
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
    listItem: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 8
    },
    itemTitle:{
        color: '#000',
        fontFamily: 'PTSans-Bold'
    },
    itemText: {
        color: '#000',
        fontFamily: 'PTSans-Regular'
    },
    listItemButton: {
        marginHorizontal: 4,
        width: 34,
        height: 34,
        borderRadius: 34/2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});