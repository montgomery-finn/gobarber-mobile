import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
    height: 60px;
    background: #ff9000;
    border-radius: 10px;

    /* não precisa utilizar display: flex pq no
    react-native todos os componentes por 
    padrão possuem display: flex */
    justify-content: center;
    align-items: center;
    margin-top: 8px;
`;

export const ButtonText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #312e38;
    /* margin: 64px 0 24px; */
`;