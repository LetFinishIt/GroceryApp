import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/';

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
