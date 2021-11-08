import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    FlatList,
    ScrollView,
    Image,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import palette from '../../styles/palette';
import { useFocusEffect } from '@react-navigation/native';
import { ModalColorPicker, FontPicker, RenderChangeFontSize } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Settings(props) {
    const [selectedSetting, setSelectedSetting] = useState('');
    const [isModalColorPickerVisible, setIsModalColorPickerVisible] = useState(false);

    //ModalColorPicker
    const [selectedColor, setSelectedColor] = useState(null);

    const titleVerses = [
        `${props.verseTitle.book} ${props.verseTitle.chapter}`,
        `${props.verseTitle.book}, ${props.verseTitle.chapter}`,
        `${props.verseTitle.book}: ${props.verseTitle.chapter}`,
        `${props.verseTitle.book} - ${props.verseTitle.chapter}`,
        `${props.verseTitle.book}, capítulo ${props.verseTitle.chapter}`,
    ];

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (selectedSetting > 0) {
                    setSelectedSetting(0);
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [selectedSetting])
    );

    function onSelectingSetting(from) {
        if (selectedSetting == from) {
            setSelectedSetting(0);
        } else {
            setSelectedSetting(from);
        }
    }

    function renderPaletteColor({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => {
                    setSelectedSetting(0);
                    props.onChangeTitleColor(item);
                }}>
                {
                    item != 'transparent'
                        ? <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
                        :
                        <View style={[styles.paletteColorItem, { backgroundColor: item }]}>
                            <MaterialIcons name='block' color={colors.error} size={32} />
                        </View>
                }
            </TouchableHighlight>
        );
    }

    function RenderTitleFormatter() {
        return (
            <ScrollView horizontal={true}>
                <TouchableHighlight
                    onPress={() => {
                        setSelectedSetting(0);
                        props.onChangingVerseTitleLocation('top');
                    }}
                    underlayColor={colors.primary.opacity}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        borderRadius: 8,
                        backgroundColor: colors.primary.light
                    }}>
                    <MaterialIcons name='vertical-align-top' color={colors.icon} size={28} />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        setSelectedSetting(0);
                        props.onChangingVerseTitleLocation('bottom');
                    }}
                    underlayColor={colors.primary.opacity}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        borderRadius: 8,
                        backgroundColor: colors.primary.light,
                        marginLeft: 16
                    }}>
                    <MaterialIcons name='vertical-align-bottom' color={colors.icon} size={28} />
                </TouchableHighlight>
            </ScrollView>
        );
    }

    function onSelectingFont(item) {
        props.selectingTitleFont(item);
        setSelectedSetting(0);
    }

    function onSelectingVerseFont(item) {
        props.selectingVerseFont(item);
        setSelectedSetting(0);
    }

    function renderTitles({ item }) {
        return (
            <TouchableHighlight
                onPress={() => {
                    setSelectedSetting(0);
                    props.onChangeVerseTitle(item);
                }}
                style={{
                    backgroundColor: colors.primary.light,
                    padding: 4,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8
                }}
                underlayColor='transparent'>
                <Text style={{ color: '#FFF', fontFamily: 'PTSans-Bold' }}>{item}</Text>
            </TouchableHighlight>
        );
    }

    function RenderTitleOptions() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Text style={styles.labelTitle}>Alinhamento</Text>
                    <View style={styles.textAlignContainer}>
                        <TouchableHighlight underlayColor='transparent' onPress={() => {
                            setSelectedSetting(0);
                            props.onChangeTitlePosition('left');
                        }}>
                            <MaterialIcons name='format-align-left' color={colors.icon} size={28} />
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' onPress={() => {
                            setSelectedSetting(0);
                            props.onChangeTitlePosition('center');
                        }}>
                            <MaterialIcons name='format-align-center' color={colors.icon} size={28} />
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' onPress={() => {
                            setSelectedSetting(0);
                            props.onChangeTitlePosition('right');
                        }}>
                            <MaterialIcons name='format-align-right' color={colors.icon} size={28} />
                        </TouchableHighlight>
                    </View>
                    <Text style={styles.labelTitle}>Cor</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={palette}
                            renderItem={renderPaletteColor}
                        />
                        <TouchableHighlight
                            underlayColor={colors.secondary.opacity}
                            onPress={() => setIsModalColorPickerVisible(true)}
                            style={styles.moreColorsButton}>
                            <Ionicons name='add' color='#FFF' size={32} />
                        </TouchableHighlight>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.labelTitle}>Posição do título</Text>
                            <RenderTitleFormatter />
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginLeft: 16
                        }}>
                            <Text style={styles.labelTitle}>Tipo de título</Text>
                            <FlatList
                                horizontal={true}
                                renderItem={renderTitles}
                                key={item => item}
                                data={titleVerses} />
                        </View>
                    </View>

                    <FontPicker onSelectingFont={(item) => onSelectingFont(item)} />
                </View>
            </ScrollView>
        );
    }

    function renderPaletteBackgroundColor({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => {
                    setSelectedSetting(0);
                    props.onChangeVerseBackgroundColor(item);
                }}>
                {
                    item != 'transparent'
                        ? <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
                        :
                        <View style={[styles.paletteColorItem, { backgroundColor: item }]}>
                            <MaterialIcons name='block' color={colors.error} size={32} />
                        </View>
                }
            </TouchableHighlight>
        );
    }

    function decrementOpacity() {
        let doubleOpacity = parseFloat(props.opacity);
        console.log(doubleOpacity)

        if (doubleOpacity > 0.1) {
            const decrementedOpacity = (doubleOpacity - 0.1).toFixed(1);
            console.log(decrementedOpacity)

            // console.log(decrementedOpacity)
            props.onChangeVerseOpacity(decrementedOpacity);
        } else {
            props.onChangeVerseOpacity(doubleOpacity)
        }
    }

    function incrementOpacity() {
        let doubleOpacity = parseFloat(props.opacity);
        console.log(doubleOpacity)

        if (doubleOpacity < 1) {
            const incrementedOpacity = (doubleOpacity + 0.1).toFixed(1);
            console.log(incrementedOpacity)

            // console.log(incrementedOpacity)
            props.onChangeVerseOpacity(incrementedOpacity);
        } else {
            props.onChangeVerseOpacity(doubleOpacity)
        }
    }

    function decrementMargin() {
        if (props.margin > 8) {
            const decrementedMargin = (parseInt(props.margin) / 2);
            // console.log(decrementedMargin)
            props.onChangeVerseMargin(decrementedMargin);
        } else {
            props.onChangeVerseMargin(props.margin);
        }
    }

    function incrementMargin() {
        if (props.margin < 128) {
            const incrementedMargin = (parseInt(props.margin) * 2);
            // console.log(incrementedMargin)
            props.onChangeVerseMargin(incrementedMargin);
        } else {
            props.onChangeVerseMargin(props.margin);
        }
    }

    function onChangingFontSize(item){
        setSelectedSetting(0);
        props.onChangeVerseFontSize(item);
    }

    function RenderVerseOptions() {
        return (
            <ScrollView style={{ flex: 1 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}>
                <Text style={styles.labelTitle}>Posição</Text>
                <View style={styles.textAlignContainer}>
                    <TouchableHighlight underlayColor='transparent' onPress={() => {
                        setSelectedSetting(0);
                        props.onChangeVersePosition('flex-end');
                    }}>
                        <MaterialIcons name='vertical-align-bottom' color={colors.icon} size={28} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={() => {
                        setSelectedSetting(0);
                        props.onChangeVersePosition('center');
                    }}>
                        <MaterialIcons name='vertical-align-center' color={colors.icon} size={28} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={() => {
                        setSelectedSetting(0);
                        props.onChangeVersePosition('flex-start');
                    }}>
                        <MaterialIcons name='vertical-align-top' color={colors.icon} size={28} />
                    </TouchableHighlight>
                </View>

                <Text style={styles.labelTitle}>Cor do texto</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight
                        style={{
                            backgroundColor: colors.primary.light,
                            padding: 4,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            props.onSelectingVerseTextColor('light');
                            setSelectedSetting(0);
                        }}
                        underlayColor={colors.secondary.light}>
                        <Text style={{
                            fontFamily: 'PTSans-Bold',
                            color: '#FFF',
                            fontSize: 16
                        }}>
                            Texto claro
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{
                            backgroundColor: colors.primary.light,
                            padding: 4,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 8
                        }}
                        onPress={() => {
                            props.onSelectingVerseTextColor('dark');
                            setSelectedSetting(0);
                        }}
                        underlayColor={colors.secondary.light}>
                        <Text style={{
                            fontFamily: 'PTSans-Bold',
                            color: '#000',
                            fontSize: 16
                        }}>
                            Texto escuro
                        </Text>
                    </TouchableHighlight>
                </View>

                <Text style={styles.labelTitle}>Cor de fundo</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={palette}
                        renderItem={renderPaletteBackgroundColor}
                    />
                    <TouchableHighlight
                        underlayColor={colors.secondary.opacity}
                        onPress={() => setIsModalColorPickerVisible(true)}
                        style={styles.moreColorsButton}>
                        <Ionicons name='add' color='#FFF' size={32} />
                    </TouchableHighlight>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.labelTitle}>Opacidade</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => decrementOpacity()}
                                style={[
                                    styles.textFormatButton,
                                    { backgroundColor: '#FFF' }
                                ]}>
                                <MaterialIcons name='remove' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: 'PTSans-Regular',
                                    fontSize: 18
                                }}>
                                    {props.opacity}
                                </Text>
                            </View>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => incrementOpacity()}
                                style={[styles.textFormatButton, { backgroundColor: '#FFF' }]}>
                                <MaterialIcons name='add' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.labelTitle}>Margem</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => decrementMargin()}
                                style={[
                                    styles.textFormatButton,
                                    { backgroundColor: '#FFF' }
                                ]}>
                                <MaterialIcons name='remove' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: 'PTSans-Regular',
                                    fontSize: 18
                                }}>
                                    {props.margin}
                                </Text>
                            </View>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => incrementMargin()}
                                style={[styles.textFormatButton, { backgroundColor: '#FFF' }]}>
                                <MaterialIcons name='add' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.labelTitle}>Tamanho da fonte</Text>
                        <RenderChangeFontSize verseFontSize={props.verseFontSize} onChangingFontSize={(item) => onChangingFontSize(item)} />
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => decrementFontSize()}
                                style={[
                                    styles.textFormatButton,
                                    { backgroundColor: '#FFF' }
                                ]}>
                                <MaterialIcons name='remove' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: 'PTSans-Regular',
                                    fontSize: 18
                                }}>
                                    {props.verseFontSize}
                                </Text>
                            </View>
                            <TouchableHighlight
                                underlayColor={colors.secondary.light}
                                onPress={() => incrementFontSize()}
                                style={[styles.textFormatButton, { backgroundColor: '#FFF' }]}>
                                <MaterialIcons name='add' color={colors.primary.regular} size={18} />
                            </TouchableHighlight>
                        </View> */}
                    </View>
                </View>

                <FontPicker onSelectingFont={(item) => onSelectingVerseFont(item)} />
            </ScrollView>
        );
    }

    function renderColorsDashboardBackground({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => {
                    setSelectedSetting(0);
                    props.onChangeDashboardBackgroundColor(item);
                }}>
                {
                    item != 'transparent'
                        ? <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
                        :
                        <View style={[styles.paletteColorItem, { backgroundColor: item }]}>
                            <MaterialIcons name='block' color={colors.error} size={32} />
                        </View>
                }
            </TouchableHighlight>
        );
    }

    function RenderBackgroundColorOptions() {
        return (
            <View>
                <Text style={styles.labelTitle}>Cor de fundo</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={palette}
                        renderItem={renderColorsDashboardBackground}
                    />
                    <TouchableHighlight
                        underlayColor={colors.secondary.opacity}
                        onPress={() => setIsModalColorPickerVisible(true)}
                        style={styles.moreColorsButton}>
                        <Ionicons name='add' color='#FFF' size={32} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    function onSelectingBackground(image) {
        setSelectedSetting(0);
        props.onChangeBackgroundImage(image);
    }

    function renderImagesToChoose(item) {
        return (
            <TouchableHighlight
                key={item.index}
                onPress={() => onSelectingBackground(item.item.image)}
                underlayColor='transparent'>
                <Image
                    style={{ width: 112, height: 224, marginRight: 8, borderRadius: 8 }}
                    source={{ uri: `data:image/jpeg;base64,${item.item.image}` }} />
            </TouchableHighlight>
        );
    }

    function pickGalleryImage() {
        launchImageLibrary({
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0].base64;
                onSelectingBackground(source);
            }
        });
    }

    function RenderBackgroundOptions() {
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 4,
                    marginBottom: 8
                }}>
                    <TouchableHighlight
                        onPress={() => pickGalleryImage()}
                        underlayColor={colors.secondary.opacity}
                        style={{
                            backgroundColor: colors.primary.light,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontFamily: 'PTSans-Bold',
                                marginRight: 8,
                                color: '#FFF'
                            }}>Imagem da galeria</Text>
                            <Ionicons name='images-outline' color={colors.secondary.regular} size={22} />
                        </View>
                    </TouchableHighlight>

                    {
                        props.imagesBackground.length < 3
                            ?
                            <View />
                            :
                            <TouchableHighlight
                                onPress={() => props.onGettingMoreImages()}
                                underlayColor={colors.secondary.light}
                                style={{
                                    backgroundColor: colors.primary.light,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{
                                        fontFamily: 'PTSans-Bold',
                                        marginRight: 8,
                                        color: '#FFF'
                                    }}>Carregar mais</Text>
                                    <Ionicons name='refresh-outline' color={colors.secondary.regular} size={22} />
                                </View>
                            </TouchableHighlight>
                    }
                </View>
                {
                    !props.isConnected
                        ?
                        <TouchableHighlight
                            style={{
                                padding: 4,
                                borderRadius: 8,
                                backgroundColor: colors.primary.light,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => props.onCheckingConnection()}
                            underlayColor={colors.secondary.opacity}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    color: '#FFF',
                                    fontFamily: 'PTSans-Bold',
                                    marginVertical: 8,
                                    alignSelf: 'center',
                                    fontSize: 16,
                                    marginRight: 8
                                }}>
                                    Conecte-se à internet e atualize
                                </Text>
                                <MaterialIcons name='refresh' size={22} color='#FFF' />
                            </View>
                        </TouchableHighlight>
                        :
                        props.imagesBackground.length < 3
                            ? <ActivityIndicator size="large" color={colors.secondary.regular} />
                            :
                            <FlatList
                                style={{ flex: 1 }}
                                horizontal={true}
                                data={props.imagesBackground}
                                keyExtractor={(item) => item.image}
                                renderItem={renderImagesToChoose}
                                extraData={props.imagesLoaded}
                            />
                }
            </View>
        );
    }

    function RenderOptions() {
        switch (selectedSetting) {
            case 1:
                return <RenderTitleOptions />
                break;
            case 2:
                return <RenderVerseOptions />
                break;
            case 3:
                return <RenderBackgroundColorOptions />
                break;
            case 4:
                return <RenderBackgroundOptions />
                break;
        }
    }

    function onSelectingColor(color) {
        setIsModalColorPickerVisible(false);
        setSelectedSetting(0);
        setSelectedColor(color);

        switch (selectedSetting) {
            case 1:
                props.onChangeTitleColor(color);
                break;
            case 2:
                props.onChangeVerseBackgroundColor(color);
                break;
            case 3:
                props.onChangeDashboardBackgroundColor(color);
                break;
        }
    }

    return (
        <View style={styles.settingsContainer}>
            {
                selectedSetting == 0
                    ?
                    <View />
                    :
                    <View style={styles.options}>
                        <ModalColorPicker
                            onSelectingColor={(color) => onSelectingColor(color)}
                            onModalColorPickerCancel={() => setIsModalColorPickerVisible(false)}
                            isModalColorPickerVisible={isModalColorPickerVisible} />
                        <RenderOptions />
                    </View>
            }
            <View style={styles.settings}>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(1)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons
                            name='text-outline'
                            size={32}
                            color={selectedSetting == 1 ? '#FFF' : colors.icon} />
                        <Text style={styles.buttonLabel}>Título</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(2)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons
                            name='document-text-outline'
                            size={32}
                            color={selectedSetting == 2 ? '#FFF' : colors.icon} />
                        <Text style={styles.buttonLabel}>Versículo</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(3)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons
                            name='color-palette-outline'
                            size={32}
                            color={selectedSetting == 3 ? '#FFF' : colors.icon} />
                        <Text style={styles.buttonLabel}>Cor de fundo</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(4)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons
                            name='images-outline'
                            size={32}
                            color={selectedSetting == 4 ? '#FFF' : colors.icon} />
                        <Text style={styles.buttonLabel}>Plano de fundo</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    options: {
        backgroundColor: colors.primary.regular,
        marginBottom: 8,
        padding: 16,
        borderRadius: 8
    },
    settings: {
        width: '100%',
        backgroundColor: colors.primary.regular,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    buttonContainer: {
        alignItems: 'center'
    },
    buttonLabel: {
        marginTop: 2,
        fontFamily: 'PTSans-Bold',
        color: '#FFF'
    },
    paletteColorItem: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderWidth: 2,
        borderColor: '#FFF',
        marginRight: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 16
    },
    textAlignContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    moreColorsButton: {
        backgroundColor: colors.primary.opacity,
        width: 36,
        height: 36,
        borderRadius: 36 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16
    },
    textFormatButton: {
        width: 22,
        height: 22,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textFormatLabel: {
        fontWeight: 'bold',
        color: '#FFF'
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
});