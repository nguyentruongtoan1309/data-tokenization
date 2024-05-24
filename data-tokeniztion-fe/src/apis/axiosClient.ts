import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
	// eslint-disable-next-line no-undef
	baseURL: process.env.API_ENDPOINT,
	withCredentials: true, // Include cookies
	headers: {
		'Content-Type': 'application/json',
	},
	// paramsSerializer: (params) => queryString.stringify(params),
	timeout: 20000,
});

// Add a request interceptor
axiosClient.interceptors.request.use((config: any) => {
	const customHeaders = {} as Record<string, string>;
	const accessToken = Cookies.get('token');
	let token = null;
	if (typeof window !== 'undefined') {
		token = accessToken ? accessToken : null;
	}

	if (token) {
		customHeaders.Authorization = `Bearer ${token}`;
	}

	return {
		...config,
		headers: {
			...customHeaders, // auto attach token
			...config.headers, // but you can override for some requests
		},
	};
});

// Add a response interceptor
axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	},
);

export default axiosClient;
