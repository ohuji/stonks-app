import {useEffect} from 'react';
import {fetchData} from '../utils/Http';
import {
  apiKey,
  apiUrl,
  baseApiUrl,
  symbolSearchFunc,
  timeSeriesDailyFunc,
} from '../utils/Variables';

const useStockApi = () => {
  const getCompanies = async (symbol) => {
    const res = await fetchData(
      baseApiUrl + symbolSearchFunc + symbol + '&apikey=' + apiKey
    );

    return res;
  };

  const getCompany = async (symbol = 'IBM') => {
    const res = await fetchData(
      baseApiUrl + timeSeriesDailyFunc + symbol + '&apikey=' + apiKey
    );

    return res;
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return {getCompanies, getCompany};
};

const useMedia = () => {
  const postMedia = async (token, data) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: data,
    };
    try {
      return await fetchData(apiUrl + 'media', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      return await fetchData(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const getMediaFile = async (id) => {
    try {
      return await fetchData(apiUrl + 'media/' + id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postMedia, deleteMedia, getMediaFile};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await fetchData(apiUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const checkUsername = async (username) => {
    try {
      const result = await fetchData(apiUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      console.log('checkUsername() failed', error);
    }
  };
  const getUserByToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      return await fetchData(apiUrl + 'users/user', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await fetchData(apiUrl + 'users', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const getAllUsers = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      return await fetchData(apiUrl + 'users', options);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return {
    checkUsername,
    getUserByToken,
    postUser,
    getAllUsers,
  };
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    return await fetchData(apiUrl + 'tags/' + tag);
  };

  const postTag = async (token, tag) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    };
    try {
      return await fetchData(apiUrl + 'tags', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteTag = async (token, tagId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      return await fetchData(apiUrl + 'tags/' + tagId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, postTag, deleteTag};
};

export {useStockApi, useMedia, useLogin, useUser, useTag};
