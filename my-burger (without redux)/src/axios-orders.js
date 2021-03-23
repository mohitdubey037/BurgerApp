import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-359fd-default-rtdb.firebaseio.com/'
})

export default instance;