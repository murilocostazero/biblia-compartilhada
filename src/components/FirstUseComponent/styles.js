import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcomeMessage: {
        marginHorizontal: 16,
        color: colors.primary.regular,
        fontFamily: 'PTSans-Regular',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center'
    }
});

export default styles;