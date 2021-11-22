import { StyleSheet } from 'react-native';
import colors from './colors';

const generalStyles = StyleSheet.create({
    defaultButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary.light,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    defaultSquareButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderRadius: 8,
        backgroundColor: colors.primary.light,
        marginHorizontal: 4
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
});

export default generalStyles;