import React, { useRef, useCallback } from 'react';
import {
  Image,
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
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import logo from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInText,
} from '../profile/style';

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: object) => {
      try {
        formRef.current?.setErrors({});
        //lê-se: o schema recebe um objeto com o seguinte formato
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });
        await schema.validate(data, {
          abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
        });
        await api.post('/users', data);
        Alert.alert(
          'Cadastrado com sucesso',
          'Você já pode fazer login na aplicação',
        );
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
        } else {
          Alert.alert(
            'Erro no cadastro',
            'Ocorreu um erro ao realizar cadastro. Tente novamente.',
          );
        }
      }
    },
    [navigation],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      enabled>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}>
        <Container>
          <Image source={logo} />

          {/* Essa View serve pq o Text não funciona a animação do KeyboardAvoidingView */}
          <View>
            <Title>Crie sua conta</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignUp}>
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
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <Input
              secureTextEntry
              textContentType="newPassword"
              name="password"
              icon="lock"
              placeholder="Senha"
              returnKeyType="send"
              ref={passwordInputRef}
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}>
              Cadastrar
            </Button>
          </Form>
        </Container>

        <BackToSignInButton>
          <Icon name="arrow-left" size={20} color="#fff" />

          <BackToSignInText
            onPress={() => {
              navigation.goBack();
            }}>
            Voltar para logon
          </BackToSignInText>
        </BackToSignInButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
