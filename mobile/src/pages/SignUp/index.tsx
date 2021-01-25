import React, { useRef, useCallback } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	View,
	ScrollView,
	TextInput,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
	Container,
	Title,
	Logo,
	BackToSignIn,
	BackToSignInText,
} from './styles';

interface SignUpFormData {
	username: string;
	password: string;
	confirmPassword: string;
}

interface passwordInputData extends TextInput {
	value: string;
}

const SignUp: React.FC = () => {
	const navigation = useNavigation();
	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<passwordInputData>(null);
	const confirmPasswordInputRef = useRef<TextInput>(null);

	const handleSignUp = useCallback(async (data: SignUpFormData) => {
		try {
			formRef.current?.setErrors({});

			const schema = Yup.object().shape({
				username: Yup.string().required('Username is required'),
				password: Yup.string().min(6, 'Password min lenght is 6'),
				confirmPassword: Yup.string().oneOf(
					[Yup.ref('password')],
					'Passwords do not match',
				),
			});

			await schema.validate(data, {
				abortEarly: false,
			});

			// await api.post('/users', data);

			// history.push('/');

			Alert.alert('Success', 'Your account has been created!');
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				const errors = getValidationErrors(err);

				formRef.current?.setErrors(errors);

				return;
			}

			Alert.alert(
				'Error',
				'Occurred an error while trying to create your account, please try again',
			);
		}
	}, []);

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
							<Title>Create your account</Title>
						</View>
						<Form
							ref={formRef}
							onSubmit={handleSignUp}
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
								autoCorrect={false}
								autoCapitalize="none"
								returnKeyType="next"
								onSubmitEditing={() => {
									confirmPasswordInputRef.current?.focus();
								}}
							/>
							<Input
								ref={confirmPasswordInputRef}
								name="confirmPassword"
								icon="lock"
								placeholder="Confirm Password"
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
								Sign up
							</Button>
						</Form>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<BackToSignIn onPress={() => navigation.navigate('SignIn')}>
				<Icon name="arrow-left" size={20} color="#fff" />
				<BackToSignInText>Go back to sign in</BackToSignInText>
			</BackToSignIn>
		</>
	);
};

export default SignUp;
