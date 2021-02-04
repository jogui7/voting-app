import React, {
	createContext,
	useCallback,
	useState,
	useContext,
	useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
	id: string;
	username: string;
}

interface AuthState {
	token: string;
	user: User;
}

interface SignInCredentials {
	username: string;
	password: string;
}

interface AuthContextData {
	user: User;
	signIn(credentials: SignInCredentials): Promise<void>;
	signOut(): void;
	updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
	const [data, setData] = useState<AuthState>({} as AuthState);

	useEffect(() => {
		async function loadStoragedData(): Promise<void> {
			const [token, user] = await AsyncStorage.multiGet([
				'@VotingApp:token',
				'@VotingApp:user',
			]);
			if (token[1] && user[1]) {
				setData({ token: token[1], user: JSON.parse(user[1]) });
			}
		}
	}, []);

	const signIn = useCallback(async ({ username, password }) => {
		const response = await api.post('sessions', {
			username,
			password,
		});

		const { token, user } = response.data;

		await AsyncStorage.multiSet([
			['@VotingApp:token', token],
			['@VotingApp:user', JSON.stringify(user)],
		]);
		api.defaults.headers.authorization = `Bearer ${token}`;

		setData({ token, user });
	}, []);

	const signOut = useCallback(async () => {
		await AsyncStorage.multiRemove(['@VotingApp:token', '@VotingApp:user']);

		setData({} as AuthState);
	}, []);

	const updateUser = useCallback(
		(user: User) => {
			AsyncStorage.setItem('@VotingApp:user', JSON.stringify(user));

			setData({
				token: data.token,
				user,
			});
		},
		[setData, data.token],
	);

	return (
		<AuthContext.Provider
			value={{ user: data.user, signIn, signOut, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	return context;
}

export { AuthProvider, useAuth };
