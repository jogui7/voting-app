import React, { useCallback, useRef } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	View,
	ScrollView,
	TextInput,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

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

interface SignInFormData {
	username: string;
	password: string;
}

const SignIn: React.FC = () => {
	const navigation = useNavigation();
	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const { signIn, user } = useAuth();

	const handleSignIn = useCallback(
		async (data: SignInFormData) => {
			try {
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					username: Yup.string().required('Username is required'),
					password: Yup.string().required('Password is required'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await signIn({
					username: data.username,
					password: data.password,
				});
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				Alert.alert(
					'Erro na autenticação',
					'Ocorreu um erro ao fazer login, cheque as credenciais.',
				);
			}
		},
		[signIn],
	);

	return (
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
							<Title>Sign in to your account</Title>
						</View>
						<Form
							ref={formRef}
							onSubmit={handleSignIn}
							style={{ width: '100%' }}
						>
							<Input
								name="username"
								icon="user"
								placeholder="Username"
								autoCorrect={false}
								autoCapitalize="none"
								returnKeyType="next"
								onSubmitEditing={() => {
									passwordInputRef.current?.focus();
								}}
							/>
							<Input
								ref={passwordInputRef}
								name="password"
								icon="lock"
								placeholder="Password"
								secureTextEntry
								returnKeyType="send"
								onSubmitEditing={() => {
									formRef.current?.submitForm();
								}}
							/>

							<Button
								onPress={() => {
									formRef.current?.submitForm();
								}}
							>
								Sign in
							</Button>
						</Form>

						<ForgotPassword onPress={() => {}}>
							<ForgotPasswordText>
								Forgot my password
							</ForgotPasswordText>
						</ForgotPassword>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
				<Icon name="log-in" size={20} color="#ff9000" />
				<CreateAccountButtonText>
					Create an account
				</CreateAccountButtonText>
			</CreateAccountButton>
		</>
	);
};
export default SignIn;
