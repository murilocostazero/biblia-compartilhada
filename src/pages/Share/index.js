import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ImageBackground,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Settings, StatusBar } from '../../components/';
import colors from '../../styles/colors';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import NetInfo from "@react-native-community/netinfo";
import { getFetchImages, getFetchSingleImage } from '../../handlers/handleFetchImages';
import Clipboard from '@react-native-clipboard/clipboard';

export default function SharePage({ route, navigation }) {
    const viewRef = useRef();
    const refToInstagram = useRef();

    //Verse Title
    const [verseTitlePosition, setVerseTitlePosition] = useState('left');
    const [verseTitleColor, setVerseTitleColor] = useState('#FFF');
    const [versePosition, setVersePosition] = useState('center');
    const [verseTitleLocation, setVerseTitleLocation] = useState('bottom');
    const [verseTitle, setVerseTitle] = useState('');
    const [verseTitleFont, setVerseTitleFont] = useState('PTSans-Bold')
    const [verseTextColor, setVerseTextColor] = useState('light')

    //Verse
    const verseColor = hexToRgbA(colors.primary.light);
    const [verseBackgroundColor, setVerseBackgroundColor] = useState(verseColor);
    const [verseOpacity, setVerseOpacity] = useState(1);
    const [versesToShow, setVersesToShow] = useState('');
    const [verseFont, setVerseFont] = useState('PTSans-Regular');
    const [verseMargin, setVerseMargin] = useState(30);
    const [verseFontSize, setVerseFontSize] = useState(16);
    const [verseShadow, setVerseShadow] = useState(false);

    //Background
    const [backgroundWithImage, setBackgroundWithImage] = useState(null);
    const [backgroundWithColor, setBackgroundWithColor] = useState(colors.primary.dark);
    const [imagesBackground, setImagesBackground] = useState(null);
    const [loadingImages, setLoadingImages] = useState(false);
    const [loadingSingleImage, setLoadingSingleImage] = useState(false);

    //StatusBar
    const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
    const [statusBarType, setStatusBarType] = useState('');
    const [statusBarMessage, setStatusBarMessage] = useState('');

    //Checking
    const [isConnected, setIsConnected] = useState(false);
    const [copiedText, setCopiedText] = useState('');

    useEffect(() => {
        getVersesToShare();
        checkInternetConnection();
    }, []);

    async function getImages(query) {
        setLoadingImages(true);
        // const imagesFetched = await getFetchImages(query);
        // setImagesBackground(imagesFetched.photos);        
        await getFetchImages(query)
        .then((imagesFetched) => setImagesBackground(imagesFetched.photos))
        .catch((errorMessage) => handleStatusBarVisibility('error', 'Erro ao buscar imagens'));

        setLoadingImages(false);
    }

    async function onDownloadingImage(imageUrl) {
        setLoadingSingleImage(true);
        // const imageTo64 = await getFetchSingleImage(imageUrl);
        // setBackgroundWithImage(imageTo64);
        await getFetchSingleImage(imageUrl)
        .then((image64) => setBackgroundWithImage(image64))
        .catch((errorMessage) => handleStatusBarVisibility('error', 'Erro ao baixar imagem'));

        setLoadingSingleImage(false);
    }

    function checkInternetConnection() {
        NetInfo.fetch().then(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            setIsConnected(state.isConnected);

            if (!state.isConnected) {
                handleStatusBarVisibility('error', 'Você não está conectado a internet')
            } else {
                getImages('nature');
            }
        });
    }

    async function getVersesToShare() {
        const selectedVerses = route.params.selectedVerses;

        if (selectedVerses.length > 1) {
            const firstItem = selectedVerses[0].id + 1;
            const lastItem = selectedVerses[selectedVerses.length - 1].id + 1;
            setVersesToShow(`${firstItem}-${lastItem}`);

        } else {
            setVersesToShow(`${selectedVerses[0].id + 1}`);
        }

        const verseTitle = `${route.params.choice.choosedBook} ${route.params.choice.chapter + 1}`;
        setVerseTitle(verseTitle);
    }

    function copyToClipboard() {
        let verseToShare = `${route.params.choice.choosedBook}, capítulo ${route.params.choice.chapter + 1}\n\n`;

        route.params.selectedVerses.map((item) => {
            verseToShare = `${verseToShare}Versículo ${item.id + 1}. ${item.verse}\n`
        });

        const appLink = '\n\nCompartilhe seus versículos também: https://play.google.com/store/apps/details?id=com.sharedbible';

        verseToShare = verseToShare + appLink;

        Clipboard.setString(verseToShare);
        setCopiedText(verseToShare);
        handleStatusBarVisibility('success', 'Versículo copiado')
    }

    function RenderVerses() {
        return (
            <ScrollView
                ref={refToInstagram}
                style={{
                    backgroundColor: verseBackgroundColor,
                    padding: 12,
                    borderRadius: 8,
                    flexGrow: 0,
                    // opacity: verseOpacity
                }}
                contentContainerStyle={{
                    paddingVertical: 6
                }}
                showsVerticalScrollIndicator={false}>
                {
                    verseTitleLocation == 'bottom'
                        ?
                        <View>
                            {route.params.selectedVerses.map((item) =>
                                <View key={item.id}>
                                    <Text style={[
                                        verseShadow == true ? styles.shadowToText : null,
                                        styles.verseItem, {
                                            fontSize: verseFontSize,
                                            fontFamily: verseFont,
                                            color: verseTextColor == 'light' ? '#FFF' : '#000'
                                        }
                                    ]}>{item.id + 1}. {item.verse}</Text>
                                </View>)}
                            <Text
                                style={[
                                    styles.verseTitle, {
                                        textAlign: verseTitlePosition,
                                        color: verseTitleColor,
                                        fontFamily: verseTitleFont
                                    }]}>
                                {verseTitle}
                            </Text>
                        </View>
                        :
                        <View>
                            <Text
                                style={[
                                    styles.verseTitle, {
                                        textAlign: verseTitlePosition,
                                        color: verseTitleColor,
                                        fontFamily: verseTitleFont
                                    }]}>
                                {verseTitle}
                            </Text>
                            {route.params.selectedVerses.map((item) =>
                                <View key={item.id}>
                                    <Text style={[
                                        verseShadow == true ? styles.shadowToText : null,
                                        styles.verseItem, {
                                            fontSize: verseFontSize,
                                            fontFamily: verseFont,
                                            color: verseTextColor == 'light' ? '#FFF' : '#000'
                                        }
                                    ]}>{item.id + 1}. {item.verse}</Text>
                                </View>)}
                        </View>
                }
            </ScrollView>
        );
    }

    function onChangeDashboardBackgroundColor(color) {
        setBackgroundWithImage(null);
        setBackgroundWithColor(color);
    }

    async function onRegularShare() {
        try {
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1
            });

            await Share.open({
                url: uri
            });
        } catch (err) {
            handleStatusBarVisibility('warning', 'A imagem não foi compartilhada');
        }
    }

    function handleStatusBarVisibility(type, message) {
        setIsStatusBarVisible(true);
        setStatusBarType(type);
        setStatusBarMessage(message);
        setTimeout(() => {
            setIsStatusBarVisible(false);
        }, 2000);
    }

    function hexToRgbA(hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
        } else {
            return 'rgba(200,200,200,1)';
        }
    }

    function handleVerseColor(color) {
        if (color != 'transparent') {
            const actualColor = hexToRgbA(color);
            setVerseBackgroundColor(actualColor);
        } else {
            setVerseBackgroundColor('rgba(255,255,255,0)');
        }

        setVerseOpacity(1);
    }

    function handleVerseOpacity(opacity) {
        const actualOpacity = verseBackgroundColor.replace(`,${verseOpacity})`, `,${opacity})`);
        setVerseBackgroundColor(actualOpacity);
        setVerseOpacity(parseFloat(opacity));
    }

    function onCheckingConnection() {
        checkInternetConnection();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableHighlight underlayColor='transparent' onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight
                        underlayColor='transparent'
                        onPress={() => copyToClipboard()}
                        style={{}}>
                        <Ionicons name='clipboard-outline' size={32} color={colors.icon} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ marginLeft: 16 }}
                        underlayColor='transparent'
                        onPress={() => onRegularShare()}>
                        <Ionicons name='share-social-outline' color={colors.icon} size={32} />
                    </TouchableHighlight>
                </View>
            </View>
            {
                loadingSingleImage ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size='large' color={colors.secondary.regular} />
                    </View>
                    :
                    backgroundWithImage == null
                        ?
                        <View style={[
                            styles.dashboard, {
                                justifyContent: versePosition,
                                backgroundColor: backgroundWithColor,
                                padding: verseMargin
                            }
                        ]}
                            ref={viewRef}>
                            <RenderVerses />
                        </View>
                        :
                        <ImageBackground
                            collapsable={false}
                            style={[styles.dashboard, {
                                justifyContent: versePosition,
                                backgroundColor: 'transparent',
                                padding: verseMargin
                            }]}
                            ref={viewRef}
                            imageStyle={{ borderRadius: 16 }}
                            source={{ uri: `data:image/jpeg;base64,${backgroundWithImage}` }}
                            resizeMode='cover'>
                            <RenderVerses />
                        </ImageBackground>
            }

            {
                isStatusBarVisible
                    ? <StatusBar type={statusBarType} message={statusBarMessage} bottom={112} />
                    : <View />
            }

            <Settings
                onChangeTitlePosition={(position) => setVerseTitlePosition(position)}
                onChangeTitleColor={(color) => setVerseTitleColor(color)}
                onChangeVersePosition={(position) => setVersePosition(position)}
                onChangeVerseBackgroundColor={(color) => handleVerseColor(color)}
                onChangeVerseOpacity={(opacity) => handleVerseOpacity(opacity)}
                onChangeBackgroundImage={(image) => setBackgroundWithImage(image)}
                onChangeDashboardBackgroundColor={(color) => onChangeDashboardBackgroundColor(color)}
                onChangingVerseTitleLocation={(location) => setVerseTitleLocation(location)}
                onChangeVerseMargin={(margin) => setVerseMargin(margin)}
                onChangeVerseShadow={() => setVerseShadow(!verseShadow)}
                onChangeVerseFontSize={(size) => setVerseFontSize(size)}
                onChangeVerseTitle={(item) => setVerseTitle(item)}
                onDownloadingImage={(imageUrl) => onDownloadingImage(imageUrl)}
                getImages={(query) => getImages(query)}
                imagesBackground={imagesBackground}
                loadingImages={loadingImages}
                opacity={verseOpacity}
                selectingTitleFont={(item) => setVerseTitleFont(item)}
                selectingVerseFont={(item) => setVerseFont(item)}
                verseShadow={verseShadow}
                verseFontSize={verseFontSize}
                margin={verseMargin}
                isConnected={isConnected}
                onCheckingConnection={() => onCheckingConnection()}
                onSelectingVerseTextColor={(verseTextColor) => setVerseTextColor(verseTextColor)}
                verseTitle={{ book: route.params.choice.choosedBook, chapter: route.params.choice.chapter + 1 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: colors.background
    },
    dashboard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 8,
        borderRadius: 16,
        marginBottom: 82,
        paddingVertical: 62
    },
    verseTitle: {
        fontSize: 18,
        marginBottom: 4
    },
    verseItem: {
        textAlign: 'justify',
        marginBottom: 8
    },
    colorPalette: {
        margin: 8,
        height: 78,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        backgroundColor: colors.secondary.dark
    },
    paletteColorItem: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderWidth: 2,
        borderColor: '#FFF',
        marginRight: 4
    },
    shadowToText: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    }
});