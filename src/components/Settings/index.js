import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, FlatList, ScrollView, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import palette from '../../styles/palette';

export default function Settings(props) {
    const [selectedSetting, setSelectedSetting] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    function onSelectingSetting(from) {
        if (selectedSetting == from) {
            setSelectedSetting('');
            setShowOptions(false);
        } else {
            setShowOptions(true);
            setSelectedSetting(from);
        }
    }

    function renderPaletteColor({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => props.onChangeTitleColor(item)}>
                <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
            </TouchableHighlight>
        );
    }

    function RenderTitleFormatter() {
        return (
            <ScrollView horizontal={true}>
                <TouchableHighlight
                    onPress={() => props.onChangingVerseTitleLocation('top')}
                    underlayColor={colors.primary.opacity}
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name='vertical-align-top' color={colors.icon} size={28} />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => props.onChangingVerseTitleLocation('bottom')}
                    underlayColor={colors.primary.opacity}
                    style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                    <MaterialIcons name='vertical-align-bottom' color={colors.icon} size={28} />
                </TouchableHighlight>
            </ScrollView>
        );
    }

    function RenderTitleOptions() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Text style={styles.labelTitle}>Alinhamento</Text>
                    <View style={styles.textAlignContainer}>
                        <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeTitlePosition('left')}>
                            <MaterialIcons name='format-align-left' color={colors.icon} size={28} />
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeTitlePosition('center')}>
                            <MaterialIcons name='format-align-center' color={colors.icon} size={28} />
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeTitlePosition('right')}>
                            <MaterialIcons name='format-align-right' color={colors.icon} size={28} />
                        </TouchableHighlight>
                    </View>
                    <Text style={styles.labelTitle}>Cor</Text>
                    <FlatList
                        horizontal={true}
                        data={palette}
                        renderItem={renderPaletteColor}
                    />

                    <Text style={styles.labelTitle}>Posição do título</Text>
                    <RenderTitleFormatter />
                </View>
            </ScrollView>
        );
    }

    function renderPaletteBackgroundColor({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => props.onChangeVerseBackgroundColor(item)}>
                <View style={[styles.paletteColorItem, { backgroundColor: item }]} />
            </TouchableHighlight>
        );
    }

    function RenderVerseOptions() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Text style={styles.labelTitle}>Posição</Text>
                <View style={styles.textAlignContainer}>
                    <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeVersePosition('flex-end')}>
                        <MaterialIcons name='vertical-align-bottom' color={colors.icon} size={28} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeVersePosition('center')}>
                        <MaterialIcons name='vertical-align-center' color={colors.icon} size={28} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='transparent' onPress={() => props.onChangeVersePosition('flex-start')}>
                        <MaterialIcons name='vertical-align-top' color={colors.icon} size={28} />
                    </TouchableHighlight>
                </View>

                <Text style={styles.labelTitle}>Cor de fundo</Text>
                <FlatList
                    horizontal={true}
                    data={palette}
                    renderItem={renderPaletteBackgroundColor}
                />

                <Text style={styles.labelTitle}>Opacidade</Text>
                <Slider
                    value={props.opacity}
                    onValueChange={(value) => props.onChangeVerseOpacity(value)}
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    minimumTrackTintColor={colors.secondary.light}
                    maximumTrackTintColor={colors.secondary.regular}
                    thumbTintColor={colors.secondary.regular}
                />
            </ScrollView>
        );
    }

    function renderColorsDashboardBackground({ item }) {
        return (
            <TouchableHighlight
                underlayColor={item}
                onPress={() => {
                    setShowOptions(false);
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
                <FlatList
                    horizontal={true}
                    data={palette}
                    renderItem={renderColorsDashboardBackground}
                />
            </View>
        );
    }

    function onSelectingBackground(image) {
        setShowOptions(false);
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

    function RenderBackgroundOptions() {
        return (
            <View>
                <TouchableHighlight
                    onPress={() => props.onGettingMoreImages()}
                    underlayColor={colors.secondary.light}
                    style={{ alignSelf: 'flex-end', marginVertical: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'PTSans-Bold', marginRight: 4 }}>Carregar mais</Text>
                        <Ionicons name='refresh-outline' color={colors.secondary.regular} size={22} />
                    </View>
                </TouchableHighlight>
                {
                    props.imagesBackground.length < 3
                        ? <Text>Carregando</Text>
                        : <FlatList
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

    return (
        <View style={styles.settingsContainer}>
            {
                showOptions == false
                    ?
                    <View />
                    :
                    <View style={styles.options}>
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
    }
});