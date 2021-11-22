import React, { useEffect, useRef, useState } from 'react';
import { TouchableHighlight, View } from 'react-native';
import NativeAdView, {
    IconView,
    HeadlineView,
    TaglineView,
    AdBadge,
} from 'react-native-admob-native-ads';
import colors from '../../styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AdsComponent() {
    const [showComponent, setShowComponent] = useState(true);
    const nativeAdViewRef = useRef();

    useEffect(() => {
        nativeAdViewRef.current?.loadAd();
    }, []);

    return (
        <View style={{
            backgroundColor: '#FFF',
            borderRadius: 8
        }}>
            <TouchableHighlight
                underlayColor='transparent'
                onPress={() => setShowComponent(!showComponent)}
                style={{
                    backgroundColor: 'transparent',
                    width: 22,
                    height: 22,
                    borderRadius: 22/2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    marginRight: 4
                }}>
                <MaterialIcons name={showComponent ? 'expand-more' : 'expand-less'} size={20} color={colors.icon} />
            </TouchableHighlight>
            <View style={{
                backgroundColor: '#FFF',
                width: '100%',
                height: showComponent ? 95 : 5
            }}>
                <NativeAdView
                    ref={nativeAdViewRef}
                    onAdFailedToLoad={(error) => console.log(error)}
                    onAdLoaded={() => console.log('Ad loaded')}
                    onAdImpression={() => console.log('Impression')}
                    style={{
                        width: '95%',
                        alignSelf: 'center',
                        padding: 8,
                        height: '100%',
                        flexDirection: 'row'
                    }}
                    adUnitID='ca-app-pub-4815716497320828/5035006192'>
                    {/* adUnitID='ca-app-pub-3940256099942544/2247696110'> */}

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
                        height: '100%',
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: 12
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