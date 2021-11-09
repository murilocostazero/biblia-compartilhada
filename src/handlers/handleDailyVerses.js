import dailyVerses from '../files/dailyVerses.json';

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