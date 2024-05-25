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

export async function getDataByRole() {
	try {
		const restOperation = get({
			apiName: 'rawDataApi',
			path: '/data',
		});
		const response = await restOperation.response;
		console.log('GET getDataByRole succeeded: ', await response?.body.json());
	} catch (e) {
		console.log('GET getDataByRole failed: ', e);
	}
}

export async function getPresignedUrl() {
	try {
		const restOperation = get({
			apiName: 'rawDataApi',
			path: '/raw-data/generate-presigned-url',
		});
		const response = await restOperation.response;
		console.log('GET generate-presigned-url succeeded: ', await response?.body.json());
	} catch (e) {
		console.log('GET generate-presigned-url failed: ', e);
	}
}
