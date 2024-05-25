import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function currentAuthenticatedUser() {
	try {
		const { username, userId, signInDetails } = await getCurrentUser();
		console.log(`The username: ${username}`);
		console.log(`The userId: ${userId}`);
		console.log(`The signInDetails: ${signInDetails}`);
	} catch (err) {
		console.log(err);
	}
}

export async function currentSession() {
	try {
		const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};

		console.log({
			accessToken: accessToken?.toString(),
			idToken: idToken?.toString(),
		});
		return { accessToken, idToken };
	} catch (err) {
		console.log(err);
	}
}
