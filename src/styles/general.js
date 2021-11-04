import { StyleSheet } from "react-native";
import colors from "./colors";

const generalStyles = StyleSheet.create({
    defaultButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary.light,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8
    }
});

export default generalStyles;