import axios from 'axios';

const endpointdev = "http://localhost:3000/api/v1";
const endpoint = "https://dlqe499rya.execute-api.us-east-1.amazonaws.com/fizzdev";

export const endPoint = () => {
  if(process.env.NODE_ENV == 'production'){
    return endpoint;
  }else {
    return endpoint;
  }
}

export default getState => axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  baseURL: `${endPoint()}`,

  transformResponse: [function (data) {
    try {
      return JSON.parse(data);
    } catch(Exception) {
      return data;
    }
  }],
});

export const apiWithToken = getState => axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${getState().getIn(['auth', 'tokens', 'idToken'])}`,
  },

  baseURL: `${endPoint()}`,

  transformResponse: [function (data) {
    try {
      return JSON.parse(data);
    } catch(Exception) {
      return data;
    }
  }],
});

export const client =  axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  baseURL: `${endPoint()}`,
  transformResponse: [function (data) {
    try {
      return JSON.parse(data);
    } catch(Exception) {
      return data;
    }
  }],
})
