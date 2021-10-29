import styled from 'styled-components/native';
import colors from '../../styles/colors';

export const HeaderTitle = styled.Text`
    font-size: 22px;
    font-family: PTSans-Bold;
    color: ${colors.primary.regular};
    margin-left: 16px
`;

export const ListText = styled.Text`
    font-size: 18px;
    font-family: PTSans-Regular;
    color: #FFF;
`;


export const Container = styled.View`
    flex: 1;
    background-color: ${colors.background};
`;