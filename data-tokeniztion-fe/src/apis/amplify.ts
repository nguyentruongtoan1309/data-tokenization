import { get } from 'aws-amplify/api';

export async function getRawData() {
	try {
		const restOperation = get({
			apiName: 'rawDataApi',
			path: '/raw-data',
		});
		const response = await restOperation.response;
		console.log('GET call succeeded: ', response);
	} catch (e) {
		console.log('GET call failed: ', e);
	}
}
