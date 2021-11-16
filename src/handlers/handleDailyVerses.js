import dailyVerses from '../files/dailyVerses.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export function getRandomVerse(){
    const currentDailyVerses = dailyVerses;
    const randomNumber = getRandomIntInclusive(0, currentDailyVerses.length-1);
    return currentDailyVerses[randomNumber];
}

export async function getDailyVerseData() {
    try {
        const jsonValue = await AsyncStorage.getItem('dailyVerse');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Erro ao recuperar item.', e);
    }
}

export async function storeDailyVerseData(value) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('dailyVerse', jsonValue);
    } catch (e) {
        console.error('Erro ao salvar item.', e);
    }
}