import axios from "axios";
import progress from "nprogress";

let request = axios.create({
	baseURL: "http://127.0.0.1:8888/api/private/v1/",
	timeout: 3000,
});

request.interceptors.request.use(
	config => {
		progress.start();
		config.headers.Authorization = window.sessionStorage.getItem("token");
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

request.interceptors.response.use(
	config => {
		progress.done();
		return config.data;
	},
	error => {
		console.log(error);
	}
);

export default request;
