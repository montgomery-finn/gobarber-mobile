import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
  ProviderAvatar,
  ProviderInfo,
  ProvidersListTitle,
} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface Provider {
  id: string;
  name: string;
  avatarURL: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user, signOut } = useAuth();

  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('providers').then((response) => {
      console.log('os providers => ', response.data);
      setProviders(response.data);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    //signOut();
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem Vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <TouchableOpacity onPress={signOut}>
          <Icon name="power" size={20} color="#fff" />
        </TouchableOpacity>

        <ProfileButton onPress={navigateToProfile}>
          {user.avatarURL ? (
            <UserAvatar source={{ uri: user.avatarURL }} />
          ) : (
            <Icon name="user" size={56} />
          )}
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        ListHeaderComponent={() => (
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        )}
        renderItem={(item) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(item.item.id)}>
            {item.item.avatarURL ? (
              <ProviderAvatar source={{ uri: item.item.avatarURL }} />
            ) : (
              <Icon name="user" size={56} />
            )}

            <ProviderInfo>
              <ProviderName>{item.item.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
