import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, FlatList, ScrollView, Image, ActivityIndicator, BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import palette from '../../styles/palette';
import { useFocusEffect } from '@react-navigation/native';
import { ModalColorPicker, FontPicker } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Settings(props) {
    const [selectedSetting, setSelectedSetting] = useState('');
    const [isModalColorPickerVisible, setIsModalColorPickerVisible] = useState(false);

    //ModalColorPicker
    const [selectedColor, setSelectedColor] = useState(null);

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
                <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
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

    function RenderTitleOptions() {
        return (
            <ScrollView style={{ maxHeight: 220 }}>
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

                    <Text style={styles.labelTitle}>Posição do título</Text>
                    <RenderTitleFormatter />
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
                <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
            </TouchableHighlight>
        );
    }

    function decrementOpacity() {
        if (props.opacity > 0.1) {
            const decrementedOpacity = (parseFloat(props.opacity) - 0.1).toFixed(1);
            // console.log(decrementedOpacity)
            props.onChangeVerseOpacity(decrementedOpacity);
        } else {
            props.onChangeVerseOpacity(props.opacity)
        }
    }

    function incrementOpacity() {
        if (props.opacity < 1) {
            const incrementedOpacity = (parseFloat(props.opacity) + 0.1).toFixed(1);
            // console.log(incrementedOpacity)
            props.onChangeVerseOpacity(incrementedOpacity);
        } else {
            props.onChangeVerseOpacity(props.opacity)
        }
    }

    function decrementMargin() {
        if (props.margin > 8) {
            const decrementedMargin = (parseInt(props.margin)/2);
            // console.log(decrementedMargin)
            props.onChangeVerseMargin(decrementedMargin);
        } else {
            props.onChangeVerseMargin(props.margin);
        }
    }

    function incrementMargin() {
        if (props.margin < 112) {
            const incrementedMargin = (parseInt(props.margin)*2);
            // console.log(incrementedMargin)
            props.onChangeVerseMargin(incrementedMargin);
        } else {
            props.onChangeVerseMargin(props.margin);
        }
    }


    function RenderVerseOptions() {
        return (
            <ScrollView style={{ maxHeight: 220 }}
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

                <Text style={styles.labelTitle}>Cor de fundo</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FlatList
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
                <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
            </TouchableHighlight>
        );
    }

    function RenderBackgroundColorOptions() {
        return (
            <View>
                <Text style={styles.labelTitle}>Cor de fundo</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FlatList
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

    function pickImage() {
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
                {
                    props.imagesBackground.length < 3
                        ? <ActivityIndicator size="large" color={colors.secondary.regular} />
                        : <View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 4,
                                marginBottom: 8
                            }}>
                                <TouchableHighlight
                                    onPress={() => pickImage()}
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
                            </View>
                            <FlatList
                                style={{ flex: 1 }}
                                horizontal={true}
                                data={props.imagesBackground}
                                keyExtractor={(item) => item.image}
                                renderItem={renderImagesToChoose}
                                extraData={props.imagesLoaded}
                            />
                        </View>
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
                        <Ionicons name='text-outline' size={32} color={colors.icon} />
                        <Text style={styles.buttonLabel}>Título</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(2)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons name='document-text-outline' size={32} color={colors.icon} />
                        <Text style={styles.buttonLabel}>Versículo</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(3)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons name='color-palette-outline' size={32} color={colors.icon} />
                        <Text style={styles.buttonLabel}>Cor de fundo</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => onSelectingSetting(4)}>
                    <View style={styles.buttonContainer}>
                        <Ionicons name='images-outline' size={32} color={colors.icon} />
                        <Text style={styles.buttonLabel}>Plano de fundo</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        backgroundColor: colors.background,
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
        padding: 16
    },
    buttonContainer: {
        alignItems: 'center'
    },
    buttonLabel: {
        marginTop: 4,
        fontFamily: 'PTSans-Bold'
    },
    paletteColorItem: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderWidth: 2,
        borderColor: '#FFF',
        marginRight: 4
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
});