import axios from 'axios';

// base URL used for accessing backend
const BASE_URL = 'http://192.168.2.12:3000/api/';

// create an Axios call that can be used for fetching and sending data
export const Api = () => {

    axios.interceptors.request.use((request) => {
            console.log("Axios Request : ", request);
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    return axios.create({
        baseURL: BASE_URL,
        headers: {
            accept: 'application/json',
        },
    });
};

export default Api;
