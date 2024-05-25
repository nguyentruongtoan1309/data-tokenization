import { signIn, confirmSignIn } from 'aws-amplify/auth';

export async function handleSignIn(username: string, password: string) {
	try {
		const { nextStep } = await signIn({
			username,
			options: {
				authFlowType: 'CUSTOM_WITHOUT_SRP',
			},
		});
		
	} catch (err) {
		console.log(err);
	}
}
