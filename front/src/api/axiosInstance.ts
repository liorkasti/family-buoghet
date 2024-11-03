import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5004', // Change the port if necessary
});

export default axiosInstance;