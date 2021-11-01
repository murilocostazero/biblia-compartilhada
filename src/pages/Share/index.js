import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableHighlight, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Settings from '../../components/Settings';
import colors from '../../styles/colors';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { getPromiseImageStorySize } from '../../handlers/handleFetchImages';

export default function SharePage({ route, navigation }) {
    const viewRef = useRef();

    //Verse Title
    const [verseTitlePosition, setVerseTitlePosition] = useState('left');
    const [verseTitleColor, setVerseTitleColor] = useState('#FFF');
    const [versePosition, setVersePosition] = useState('center');
    const [verseTitleLocation, setVerseTitleLocation] = useState('bottom');
    const [verseTitle, setVerseTitle] = useState('');

    //Verse
    const [verseBackgroundColor, setVerseBackgroundColor] = useState(colors.primary.light);
    const [verseOpacity, setVerseOpacity] = useState(1);
    const [versesToShow, setVersesToShow] = useState('');

    //Background
    const [backgroundWithImage, setBackgroundWithImage] = useState(null);
    const [backgroundWithColor, setBackgroundWithColor] = useState(colors.primary.dark);
    const [imagesBackground, setImagesBackground] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);


    useEffect(() => {
        getVersesToShare();
        getThreeImages();
    }, [imagesBackground]);


    async function getVersesToShare() {
        const selectedVerses = route.params.selectedVerses;

        if (selectedVerses.length > 1) {
            const firstItem = selectedVerses[0].id + 1;
            const lastItem = selectedVerses[selectedVerses.length - 1].id + 1;
            setVersesToShow(`${firstItem}-${lastItem}`);

        } else {
            setVersesToShow(`${selectedVerses[0].id + 1}`);
        }

        const verseTitle = `${route.params.choice.choosedBook} ${route.params.choice.chapter+1}`;
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
        await getPromiseImageStorySize().then((image) => images.push({ image: image }));
        setImagesBackground(images);
    }

    function RenderVerses() {
        console.log('Fui chamado')
        return (
            <TouchableHighlight
                style={{
                    backgroundColor: verseBackgroundColor,
                    opacity: verseOpacity,
                    padding: 12,
                    borderRadius: 8
                }}
                underlayColor='transparent'>
                {
                    verseTitleLocation == 'bottom'
                        ?
                        <View>
                            {route.params.selectedVerses.map((item) =>
                                <View key={item.id}>
                                    <Text style={styles.verseItem}>{item.id+1}. {item.verse}</Text>
                                </View>)}
                            <Text
                                style={[
                                    styles.verseTitle, {
                                        textAlign: verseTitlePosition,
                                        color: verseTitleColor
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
                                        color: verseTitleColor
                                    }]}>
                                {verseTitle}
                            </Text>
                            {route.params.selectedVerses.map((item) =>
                                <View key={item.id}>
                                    <Text style={styles.verseItem}>{item.verse}</Text>
                                </View>)}
                        </View>
                }
            </TouchableHighlight>
        );
    }

    function onChangeTitlePosition(position) {
        setVerseTitlePosition(position);
    }

    function onChangeTitleColor(color) {
        setVerseTitleColor(color);
    }

    function onChangeVersePosition(position) {
        setVersePosition(position);
    }

    function onChangeVerseBackgroundColor(color) {
        setVerseBackgroundColor(color);
    }

    function onChangeVerseOpacity(opacity) {
        setVerseOpacity(opacity);
    }

    function onChangeBackgroundImage(image) {
        setBackgroundWithImage(image);
    }

    function onChangeDashboardBackgroundColor(color) {
        setBackgroundWithImage(null);
        setBackgroundWithColor(color);
    }

    function onChangingVerseTitleLocation(location) {
        setVerseTitleLocation(location);
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
                quality: 0.8
            });

            await Share.open({
                url: uri
            });
        } catch (err) {
            console.error(err)
        }
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
                            backgroundColor: backgroundWithColor
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
                            backgroundColor: 'transparent'
                        }]}
                        ref={viewRef}
                        imageStyle={{ borderRadius: 16 }}
                        source={{ uri: `data:image/jpeg;base64,${backgroundWithImage}` }}
                        resizeMode='cover'>
                        <RenderVerses />
                    </ImageBackground>
            }

            <Settings
                onChangeTitlePosition={(position) => onChangeTitlePosition(position)}
                onChangeTitleColor={(color) => onChangeTitleColor(color)}
                onChangeVersePosition={(position) => onChangeVersePosition(position)}
                onChangeVerseBackgroundColor={(color) => onChangeVerseBackgroundColor(color)}
                onChangeVerseOpacity={(opacity) => onChangeVerseOpacity(opacity)}
                opacity={verseOpacity}
                onChangeBackgroundImage={(image) => onChangeBackgroundImage(image)}
                onChangeDashboardBackgroundColor={(color) => onChangeDashboardBackgroundColor(color)}
                imagesBackground={imagesBackground}
                imagesLoaded={imagesLoaded}
                onGettingMoreImages={() => onGettingMoreImages()}
                onChangingVerseTitleLocation={(location) => onChangingVerseTitleLocation(location)}
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
        padding: 32,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 16,
        borderRadius: 16
    },
    verseTitle: {
        fontWeight: '700',
        fontSize: 18,
        fontFamily: 'PTSans-Bold',
        marginBottom: 4
    },
    verseItem: {
        fontFamily: 'PTSans-Regular',
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