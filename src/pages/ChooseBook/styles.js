import styled from 'styled-components/native';
import colors from '../../styles/colors';

export const Container = styled.View`
    flex: 1;
    background-color: ${colors.background};
`;

export const Header = styled.View`
    flex-direction: row;
    padding: 8px;
    align-items: center;
    height: 56px;
`;

export const SearchBar = styled.TextInput.attrs(props => ({
    placeholder: 'Faça uma busca pelo nome do livro',
    placeholderTextColor: colors.icon,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoFocus: true,
    value: props.query,
    onChangeText: props.onChangeText
}))
    `
    flex: 1;
    font-family: PTSans-Regular;
    font-size: 16px;
    color: ${colors.primary.regular}
`;

export const ListText = styled.Text`
    margin-vertical: 4px;
    fontSize: 18px;
    font-family: PTSans-Bold;
    color: ${colors.primary.regular};
`;

export const ListItem = styled.TouchableHighlight.attrs(props => ({
    underlayColor: 'transparent',
    onPress: props.onPress
}))`
    background-color: transparent;
    padding-vertical: 8px;
    padding-horizontal: 4px;
    margin-bottom: 2px;
`;

export const List = styled.FlatList.attrs(props => ({
    contentContainerStyle: {
        backgroundColor: 'transparent',
        borderRadius: 16,
        padding: 4
    },
    data: props.data,
    renderItem: props.renderItem,
    keyExtractor: props.keyExtractor
}))`

`;