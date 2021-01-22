import React from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
	Container,
	Title,
	Logo,
	ForgotPassword,
	ForgotPasswordText,
	CreateAccountButton,
	CreateAccountButtonText,
} from './styles';

const SignIn: React.FC = () => (
	<>
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			enabled
		>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ flex: 1 }}
			>
				<Container>
					<Logo source={logoImg} />
					<View>
						<Title>Faça seu logon</Title>
					</View>

					<Input name="user" icon="user" placeholder="Usuário" />
					<Input name="password" icon="lock" placeholder="Senha" />

					<Button
						onPress={() => {
							console.log('deu');
						}}
					>
						Entrar
					</Button>

					<ForgotPassword onPress={() => {}}>
						<ForgotPasswordText>
							Esqueci minha senha
						</ForgotPasswordText>
					</ForgotPassword>
				</Container>
			</ScrollView>
		</KeyboardAvoidingView>
		<CreateAccountButton onPress={() => {}}>
			<Icon name="log-in" size={20} color="#ff9000" />
			<CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
		</CreateAccountButton>
	</>
);

export default SignIn;
