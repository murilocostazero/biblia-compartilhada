import React, { useEffect, useRef, useState } from 'react';
import { TouchableHighlight, View } from 'react-native';
import NativeAdView, {
    IconView,
    HeadlineView,
    TaglineView,
    AdBadge,
    ImageView,
    CallToActionView
} from 'react-native-admob-native-ads';
import colors from '../../styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general';

export default function AdsComponent() {
    const [showComponent, setShowComponent] = useState(true);
    const nativeAdViewRef = useRef();

    useEffect(() => {
        nativeAdViewRef.current?.loadAd();
    }, []);

    return (
        <View
            style={{
                backgroundColor: '#FFF',
                borderRadius: 8,
            }}>
            <TouchableHighlight
                underlayColor='transparent'
                onPress={() => setShowComponent(!showComponent)}
                style={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    height: 22,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    paddingRight: 8
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
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    // adUnitID='ca-app-pub-4815716497320828/5035006192'>
                    adUnitID='ca-app-pub-3940256099942544/2247696110'>

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
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 12,
                    }}>
                        <IconView
                            style={{
                                width: 50,
                                height: 50
                            }} />
                        <View style={{
                            marginLeft: 2,
                            width: '60%'
                        }}>
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
                        <ImageView
                            style={{
                                width: 80,
                                height: 80,
                            }}
                        />
                        {/* <CallToActionView
                            style={[{
                                backgroundColor: colors.secondary.regular,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                elevation: 10,
                            }, generalStyles.shadow]}
                            textStyle={{
                                color: colors.primary.regular,
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}
                        /> */}
                    </View>
                </NativeAdView>
            </View>
        </View>
    );
}