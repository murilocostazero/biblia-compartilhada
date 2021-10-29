import ReactNativeBlobUtil from 'react-native-blob-util';

export async function getImages() {
  const min = Math.ceil(1);
  const max = Math.floor(100);
  const page = Math.floor(Math.random() * (max - min + 1)) + min;
  try {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=5`);
    const images = await response.json();
    return images;
  } catch (error) {
    console.error(error);
  }
}

export async function getSingleImage(url) {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil
      .fetch('GET', url)
      .then((res) => {
        let status = res.info().status;

        if (status == 200) {
          let base64Str = res.base64()
          // let text = res.text()
          // let json = res.json()

          // console.log('Base 64', base64Str)
          return resolve({
            base64: base64Str,
            imageUrl: res.info().redirects[1]
          });
        } else {
          return reject(null);
        }
      })
      .catch((errorMessage, statusCode) => {
        console.log('Error to Fetch single image. ');
        console.log(errorMessage)
      });
  });
}

export async function getPromiseImageStorySize() {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil
      .fetch('GET', 'https://picsum.photos/1080/1920')
      .then((res) => {
        let status = res.info().status;

        if (status == 200) {
          let base64Str = res.base64()
          // let text = res.text()
          // let json = res.json()

          // console.log('Base 64', base64Str)
          return resolve(base64Str);
        } else {
          return reject(null);
        }
      })
      .catch((errorMessage, statusCode) => {
        console.log('Error to Fetch single image instagram size. ');
        console.log(errorMessage)
      });
  });
}