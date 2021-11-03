import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ImageBackground
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Settings, StatusBar } from '../../components/';
import colors from '../../styles/colors';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import NetInfo from "@react-native-community/netinfo";
import { getPromiseImageStorySize } from '../../handlers/handleFetchImages';

export default function SharePage({ route, navigation }) {
    const viewRef = useRef();

    //Verse Title
    const [verseTitlePosition, setVerseTitlePosition] = useState('left');
    const [verseTitleColor, setVerseTitleColor] = useState('#FFF');
    const [versePosition, setVersePosition] = useState('center');
    const [verseTitleLocation, setVerseTitleLocation] = useState('bottom');
    const [verseTitle, setVerseTitle] = useState('');
    const [verseTitleFont, setVerseTitleFont] = useState('PTSans-Bold')

    //Verse
    const [verseBackgroundColor, setVerseBackgroundColor] = useState(colors.primary.light);
    const [verseOpacity, setVerseOpacity] = useState(0.8);
    const [versesToShow, setVersesToShow] = useState('');
    const [verseFont, setVerseFont] = useState('PTSans-Regular');
    const [verseMargin, setVerseMargin] = useState(38);

    //Background
    const [backgroundWithImage, setBackgroundWithImage] = useState(null);
    const [backgroundWithColor, setBackgroundWithColor] = useState(colors.primary.dark);
    const [imagesBackground, setImagesBackground] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    //StatusBar
    const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
    const [statusBarType, setStatusBarType] = useState('');
    const [statusBarMessage, setStatusBarMessage] = useState('');

    //Checking
    const[isConnected, setIsConnected] = useState(false);

    // const [isInstagramInstalled, setIsInstagramInstalled] = useState(false);

    useEffect(() => {
        getVersesToShare();
        getThreeImages();

        checkInternetConnection();
        // checkIfInstagramIsInstalled();
    }, [imagesBackground]);

    function checkInternetConnection() {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setIsConnected(state.isConnected);

            if(!state.isConnected) handleStatusBarVisibility('error', 'Você não está conectado a internet')
        });
    }

    // async function checkIfInstagramIsInstalled() {
    //     const { isInstalled } = await Share.isPackageInstalled('com.instagram.android');
    //     setIsInstagramInstalled(isInstalled);
    // }

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

    async function getThreeImages() {
        while (imagesBackground.length < 3) {
            await getImages();
        }

        if (imagesBackground.length == 3) {
            setImagesLoaded(true);
        }
    }

    async function getImages() {
        const images = imagesBackground;
        await getPromiseImageStorySize()
            .then((image) => images.push({ image: image }))
            .catch((error) => {
                console.log('Error: ', error);
            });
        setImagesBackground(images);
    }

    function RenderVerses() {
        return (
            <TouchableHighlight
                style={{
                    backgroundColor: verseBackgroundColor,
                    padding: 12,
                    borderRadius: 8,
                    opacity: verseOpacity
                }}
                underlayColor='transparent'>
                {
                    verseTitleLocation == 'bottom'
                        ?
                        <View>
                            {route.params.selectedVerses.map((item) =>
                                <View key={item.id}>
                                    <Text style={[styles.verseItem, { fontFamily: verseFont }]}>{item.id + 1}. {item.verse}</Text>
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
                                    <Text style={[styles.verseItem, { fontFamily: verseFont }]}>{item.verse}</Text>
                                </View>)}
                        </View>
                }
            </TouchableHighlight>
        );
    }

    function onChangeDashboardBackgroundColor(color) {
        setBackgroundWithImage(null);
        setBackgroundWithColor(color);
    }

    async function onGettingMoreImages() {
        setImagesBackground([]);
        setImagesLoaded(false);
        // getThreeImages();
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

    function hexToRgbA(hex, opacity) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
        } else {
            return 'rgba(200,200,200,1)'
        }
    }


    function handleVerseOpacity(opacity) {
        // console.log('Color')
        // console.log(verseBackgroundColor)
        // console.log('Opacity')
        // console.log(opacity)

        // let colorToRgb = hexToRgbA(verseBackgroundColor, opacity);
        // setVerseBackgroundColor(colorToRgb);
        setVerseOpacity(opacity);
    }

    function onCheckingConnection(){
        setImagesBackground([]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableHighlight underlayColor='transparent' onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' color={colors.icon} size={32} />
                </TouchableHighlight>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight
                        style={{ marginLeft: 16 }}
                        underlayColor='transparent'
                        onPress={() => onRegularShare()}>
                        <Ionicons name='share-social-outline' color={colors.icon} size={32} />
                    </TouchableHighlight>
                </View>
            </View>
            {
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
                    ? <StatusBar type={statusBarType} message={statusBarMessage} />
                    : <View />
            }

            <Settings
                onChangeTitlePosition={(position) => setVerseTitlePosition(position)}
                onChangeTitleColor={(color) => setVerseTitleColor(color)}
                onChangeVersePosition={(position) => setVersePosition(position)}
                onChangeVerseBackgroundColor={(color) => setVerseBackgroundColor(color)}
                onChangeVerseOpacity={(opacity) => handleVerseOpacity(opacity)}
                opacity={verseOpacity}
                onChangeBackgroundImage={(image) => setBackgroundWithImage(image)}
                onChangeDashboardBackgroundColor={(color) => onChangeDashboardBackgroundColor(color)}
                imagesBackground={imagesBackground}
                imagesLoaded={imagesLoaded}
                onGettingMoreImages={() => onGettingMoreImages()}
                onChangingVerseTitleLocation={(location) => setVerseTitleLocation(location)}
                selectingTitleFont={(item) => setVerseTitleFont(item)}
                selectingVerseFont={(item) => setVerseFont(item)}
                onChangeVerseMargin={(margin) => setVerseMargin(margin)}
                margin={verseMargin}
                isConnected={isConnected}
                onCheckingConnection={() => onCheckingConnection()}
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
        margin: 8,
        borderRadius: 16
    },
    verseTitle: {
        fontSize: 18,
        marginBottom: 4
    },
    verseItem: {
        fontSize: 16,
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
    }
});