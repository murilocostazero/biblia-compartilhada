import ReactNativeBlobUtil from 'react-native-blob-util';
import API_KEY from '../assets/api-key';

export async function getFetchImages(query) {
  query = query != undefined ? query : 'nature';

  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.fetch('GET', `https://api.pexels.com/v1/search?query=${query}`, {
      Authorization: API_KEY
    })
      .then((res) => {
        return resolve(res.json());
      })
      .catch((errorMessage, statusCode) => {
        return reject(errorMessage);
      })
  });
}

export async function getFetchSingleImage(imageUrl) {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.fetch('GET', imageUrl)
      .then((res) => {
        return resolve(res.base64());
      })
      .catch((errorMessage, statusCode) => {
        return reject(errorMessage);
      })
  });
}