import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './style';
import { useAuth } from '../../hooks/auth';
import Icon from 'react-native-vector-icons/Feather';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const { user, updateUser } = useAuth();

  const handleChange = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        //lê-se: o schema recebe um objeto com o seguinte formato
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
        });
        const {
          name,
          email,
          oldPassword,
          password,
          passwordConfirmation,
        } = data;

        const formaData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                passwordConfirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formaData);

        await updateUser(response.data.user);

        Alert.alert('Alteração realizada com sucesso');
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
        } else {
          Alert.alert('Erro ao atualizar perfil');
        }
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
      try {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode || response.errorMessage) {
          Alert.alert('Erro ao atualizar seu avatar');
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          uri: response.uri,
          name: `${user.id}.jpg`,
        });

        api
          .patch('users/avatar', data)
          .then((apiResponse) => updateUser(apiResponse.data.user));
      } catch {
        Alert.alert('Erro ao atualizar avatar');
      }
    });
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      enabled>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            {user.avatarURL ? (
              <UserAvatar source={{ uri: user.avatarURL }} />
            ) : (
              <Icon
                name="user"
                size={120}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              />
            )}
          </UserAvatarButton>

          {/* Essa View serve pq o Text não funciona a animação do KeyboardAvoidingView */}
          <View>
            <Title>Crie sua conta</Title>
          </View>

          <Form ref={formRef} onSubmit={handleChange} initialData={{ ...user }}>
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />

            <Input
              keyboardType="email-address"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              ref={emailInputRef}
              onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
            />

            <Input
              secureTextEntry
              textContentType="password"
              name="oldPassword"
              icon="lock"
              placeholder="Senha atual"
              returnKeyType="next"
              ref={oldPasswordInputRef}
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <Input
              secureTextEntry
              textContentType="newPassword"
              name="password"
              icon="lock"
              placeholder="Nova senha"
              returnKeyType="next"
              ref={passwordInputRef}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <Input
              secureTextEntry
              textContentType="newPassword"
              name="confirmPassword"
              icon="lock"
              placeholder="Confirmação de senha"
              returnKeyType="send"
              ref={confirmPasswordInputRef}
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}>
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
