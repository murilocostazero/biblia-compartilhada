import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableHighlight,
    StyleSheet,
    BackHandler,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getData, storeData } from '../../handlers/handlerASChoice';
import { getFavoriteData, storeFavoriteData } from '../../handlers/handlerASFavorites';
import PushNotification from 'react-native-push-notification';
import {
    Header,
    FirstUseComponent,
    VersesSettings,
    ChapterNavigation
} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import Bible from '../../handlers/handleBible';
import NativeAdView, {
    IconView,
    HeadlineView,
    TaglineView,
    AdBadge,
} from 'react-native-admob-native-ads';

export default function Home({ navigation }) {
    const [chapterIsReady, setChapterIsReady] = useState(false);
    const [choice, setChoice] = useState(null);
    const [chapterToShow, setChapterToShow] = useState([]);
    const [refreshChapter, setRefreshChapter] = useState(false);
    const [selectedVerses, setSelectedVerses] = useState([]);
    const [isFirstUse, setIsFirstUse] = useState(false);
    const [openVersesSettings, setOpenVersesSettings] = useState(false);
    const [textVerseSize, setTextVerseSize] = useState(18);
    const [textBold, setTextBold] = useState(false);
    const [readMode, setReadMode] = useState(false);
    const [verseIsSelected, setVerseIsSelected] = useState(false);
    const [favoriteData, setFavotireData] = useState([]);
    const [containerSize, setContainerSize] = useState(50);
    const [isScrolling, setIsScrolling] = useState(false);
    const [temporarilySelected, setTemporarilySelected] = useState(-1);
    // const [notification, setNotification] = useState(null);

    const isFocused = useIsFocused();
    const flatlistRef = useRef();
    const nativeAdViewRef = useRef();

    PushNotification.configure({
        onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
            navigation.navigate('DailyVerse');
        },
        requestPermissions: Platform.OS === 'ios'
    });

    useEffect(() => {
        if (isFocused == true && selectedVerses.length == 0) {
            getInitialData();
        }

        initialNotification();
        nativeAdViewRef.current?.loadAd();
    }, [selectedVerses, isFocused]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (selectedVerses.length > 0) {
                    unselectingVerses();
                    return true;
                } else {
                    return false;
                }
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [selectedVerses])
    );

    function initialNotification() {
        PushNotification.createChannel({
            channelId: 'notification-channel',
            channelName: 'Notification Channel'
        });

        PushNotification.cancelAllLocalNotifications();

        PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            channelId: 'notification-channel',
            title: 'Versículo do dia',
            message: "Olha que linda mensagem separamos para você.", // (required)
            date: new Date(Date.now() + 900 * 1000),
            allowWhileIdle: true,
            repeatType: 'time',
            repeatTime: 900 * 1000
        });
    }

    function scrollToIndex(item) {
        let index = item;
        flatlistRef.current.scrollToIndex({ animated: true, index: index });
    }

    async function getInitialData() {
        await getDataFromAS();
        await getDataFromFavoriteAS();
        await setChapterIsReady(true);
    }

    function handleTemporarilySelected(index) {
        setTemporarilySelected(index);
        setTimeout(() => {
            setTemporarilySelected(-1);
        }, 1500);
    }

    async function getDataFromAS() {
        let data = await getData();

        if (data != null) {
            setChoice(data);

            let chapter = getChapter(data.choosedBook, data.chapter);
            setChapterToShow(chapter);
            setIsFirstUse(false);


            const index = data.indexItem == null ? 0 : data.indexItem;
            setTimeout(() => {
                scrollToIndex(index);
                handleTemporarilySelected(index);
            }, 500);
        } else {
            setIsFirstUse(true);
        }
    }

    async function getDataFromFavoriteAS() {
        let data = await getFavoriteData();
        if (data != null) {
            setFavotireData(data);
        } else {
            setFavotireData([]);
        }
    }

    function getChapter(choosedBook, chapterNumber) {
        const bible = new Bible();
        const chapter = bible.getChapter(choosedBook, chapterNumber);
        return chapter;
    }

    function chooseBook() {
        navigation.navigate('ChooseBook');
    }

    function ShareButton() {
        return (
            <TouchableHighlight
                underlayColor={colors.secondary.light}
                style={styles.shareButton}
                onPress={async () => navigation.navigate('Share', { selectedVerses: selectedVerses, choice: choice })}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#FFF' }}>Compartilhar</Text>
            </TouchableHighlight>
        );
    }

    async function handleSelectedVerses(item) {
        const index = selectedVerses.findIndex(x => item.id === x.id);
        index > -1 ? selectedVerses.splice(index, 1) : selectedVerses.push(item);

        const verse = {
            id: `${choice.choosedBook}-${choice.chapter}-${item.id}`
        };
        const isSelected = await findVerse(verse);
        isSelected != -1 ? setVerseIsSelected(true) : setVerseIsSelected(false);
        setSelectedVerses(selectedVerses);
    }

    const handleSelect = ({ item }) => {
        item.isSelected = !item.isSelected;
        const index = chapterToShow.findIndex(x => item.id === x.id)

        chapterToShow[index] = item;

        setChapterToShow(chapterToShow);
        setRefreshChapter(!refreshChapter);

        handleSelectedVerses(item);
    }

    function unselectingVerses() {
        setSelectedVerses([]);
        setRefreshChapter(!refreshChapter);
    }

    function onChangingTextBold() {
        setTextBold(!textBold);
    }

    function onTappingFavorites() {
        navigation.navigate('Favorites');
    }

    function checkEquality(item) {
        const verseToCheck = `${choice.choosedBook}-${choice.chapter}-${item.item.id}`;
        const checkFavorite = favoriteData.find((item) => item.id == verseToCheck);
        return checkFavorite;
    }

    const renderVerse = (item) => {
        const isVerseFavorite = checkEquality(item);
        return (
            <TouchableHighlight
                underlayColor={colors.secondary.light}
                onPress={() => handleSelect(item)}
                style={[
                    // temporarilySelected == item.item.id 
                    // ? styles.selectedItem : 

                    item.item.isSelected == true
                        ? styles.selectedItem
                        : styles.unselectedItem, styles.verseItem
                ]}>
                <View style={{ flexDirection: 'column' }}>
                    {
                        isVerseFavorite != undefined
                            ? <View
                                onLayout={layoutEvent => {
                                    setContainerSize(layoutEvent.nativeEvent.layout.height)
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    opacity: 0.3,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <MaterialIcons
                                    name='favorite'
                                    color={readMode ? colors.background : colors.error}
                                    size={containerSize || 0} />
                            </View>
                            : <View />
                    }
                    <Text
                        style={[
                            styles.textVerse, {
                                fontSize: textVerseSize,
                                fontWeight: textBold ? 'bold' : '100',
                                color: readMode == false ? colors.primary.dark : colors.background
                            }
                        ]}>
                        {item.index + 1}. {item.item.verse}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    function onOpenVersesSettings() {
        setOpenVersesSettings(!openVersesSettings);
    }

    function onChangingTextVerseSize(size) {
        setTextVerseSize(size)
    }

    function onChangingReadMode() {
        setReadMode(!readMode);
    }

    function goToSearchPage() {
        navigation.navigate('Search');
    }

    function goToDailyVerse() {
        navigation.navigate('DailyVerse');
    }

    async function getFavorites() {
        const favorites = await getFavoriteData();
        return favorites == null ? [] : favorites;
    }

    async function setFavorites(data) {
        await storeFavoriteData(data);
    }

    async function onAddingVerseToFavorite() {  //Pegar o verso
        let favorite = {
            id: `${choice.choosedBook}-${choice.chapter}-${selectedVerses[0].id}`,
            book: choice.choosedBook,
            chapter: choice.chapter,
            verse: {
                id: selectedVerses[0].id,
                text: selectedVerses[0].verse
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

    async function findVerse(verse) {
        let favorites = await getFavorites();
        let favorite = favorites.findIndex((item) => item.id == verse.id);
        return favorite;
    }

    async function handleChapterNavigation(option) {
        const bible = new Bible();
        if (option == 0) {
            const response = bible.goToPreviousChapter(choice);
            if (response != null) {
                await storeData(response);
                getInitialData();
            }
        } else {
            const response = bible.goToNextChapter(choice);
            if (response != null) {
                await storeData(response);
                getInitialData();
            }
        }
    }

    function onShowingChapterNavigation() {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    }

    return (
        <View
            style={[
                styles.container, {
                    backgroundColor: readMode == false ? colors.background : colors.primary.dark
                }
            ]}>
            <Header
                chooseBook={chooseBook}
                selectedVerses={selectedVerses}
                unselectingVerses={() => unselectingVerses()}
                onOpenVersesSettings={() => onOpenVersesSettings()}
                openVersesSettings={openVersesSettings}
                isFirstUse={isFirstUse}
                verseIsSelected={verseIsSelected}
                goToSearchPage={() => goToSearchPage()}
                goToDailyVerse={() => goToDailyVerse()}
                onTappingFavorites={() => onTappingFavorites()}
                onAddingVerseToFavorite={() => onAddingVerseToFavorite()} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    chapterIsReady == false
                        ? <ActivityIndicator size="large" color={colors.secondary.regular} />
                        :
                        choice != null ?
                            <View>
                                {
                                    openVersesSettings == true
                                        ? <VersesSettings
                                            textVerseSize={textVerseSize}
                                            onChangingTextVerseSize={(size) => onChangingTextVerseSize(size)}
                                            onChangingReadMode={() => onChangingReadMode()}
                                            readMode={readMode}
                                            textBold={textBold}
                                            onChangingTextBold={() => onChangingTextBold()} />
                                        : <View />
                                }
                                <View style={styles.labelContainer}>
                                    <Text style={[styles.chapterTitle, {
                                        color: readMode ? colors.secondary.light : colors.primary.regular
                                    }]}>
                                        {choice.choosedBook} - {choice.chapter + 1}
                                    </Text>
                                </View>
                                <FlatList
                                    onScrollBeginDrag={() => onShowingChapterNavigation()}
                                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 48 }}
                                    data={chapterToShow}
                                    keyExtractor={item => item.id}
                                    renderItem={renderVerse}
                                    initialScrollIndex={0}
                                    extraData={refreshChapter}
                                    ref={flatlistRef}
                                    onScrollToIndexFailed={info => {
                                        const wait = new Promise(resolve => setTimeout(resolve, 700));
                                        wait.then(() => {
                                            flatlistRef.current?.scrollToIndex({ index: info.index, animated: true });
                                        });
                                    }}
                                />
                                <View style={{
                                    backgroundColor: 'transparent',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 56
                                }}>
                                    {
                                        selectedVerses.length > 0
                                            ? <View />
                                            : isScrolling
                                                ? <View />
                                                :
                                                <ChapterNavigation
                                                    choice={choice}
                                                    handleChapterNavigation={(option) => handleChapterNavigation(option)} />
                                    }
                                </View>
                            </View>
                            :
                            <FirstUseComponent />
                }
            </View>

            {
                selectedVerses.length > 0
                    ?
                    <ShareButton />
                    :
                    choice != null
                        ?
                        <View />
                        :
                        <TouchableHighlight
                            underlayColor={colors.secondary.light}
                            onPress={() => chooseBook()}
                            style={styles.initialButton}>
                            <Text style={styles.initialButtonText}>Vamos nessa!</Text>
                        </TouchableHighlight>
            }

            <View style={{ backgroundColor: '#FFF' }}>
                <NativeAdView
                    ref={nativeAdViewRef}
                    onAdFailedToLoad={(error) => console.log(error)}
                    onAdLoaded={() => console.log('Ad loaded')}
                    onAdImpression={() => console.log('Impression')}
                    style={{
                        width: '95%',
                        alignSelf: 'center',
                        padding: 8,
                        height: 100,
                        flexDirection: 'row'
                    }} adUnitID='ca-app-pub-3940256099942544/2247696110'>

                    <AdBadge
                        style={{
                            width: 15,
                            height: 15,
                            borderWidth: 1,
                            borderRadius: 2,
                            borderColor: 'green',
                        }}
                        textStyle={{
                            fontSize: 9,
                            color: 'green',
                        }} />

                    <View style={{
                        height: 100,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <IconView
                            style={{
                                width: 60,
                                height: 60,
                            }} />
                        <View style={{ marginLeft: 8 }}>
                            <HeadlineView style={{
                                fontWeight: 'bold',
                                fontSize: 13,
                                color: colors.primary.dark
                            }} />
                            <TaglineView
                                numberOfLines={1}
                                style={{
                                    fontSize: 11,
                                    width: '100%',
                                    color: colors.primary.regular
                                }} />
                        </View>
                    </View>
                </NativeAdView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    verseItem: {
        marginHorizontal: 6,
        marginBottom: 6
    },
    selectedItem: {
        backgroundColor: colors.secondary.opacity
    },
    unselectedItem: {
        backgroundColor: 'transparent'
    },
    shareButton: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.regular,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4
    },
    initialButton: {
        backgroundColor: colors.secondary.regular,
        height: 48,
        width: 224,
        borderRadius: 8,
        marginBottom: 16,
        padding: 8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    initialButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: 'PTSans-Bold'
    },
    textVerse: {
        textAlign: 'justify',
        fontFamily: 'PTSans-Regular'
    },
    chapterTitle: {
        fontFamily: 'PTSans-Bold',
        fontSize: 18
    },
    labelContainer: {
        marginVertical: 4,
        padding: 4,
        borderRadius: 8,
        flexDirection: 'row',
        aligntems: 'center',
        justifyContent: 'center'
    }
});