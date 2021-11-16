import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLastDay() {
    try {
        const jsonValue = await AsyncStorage.getItem('lastDay');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Erro ao recuperar item.', e);
    }
}

export async function storeLastDay(value) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('lastDay', jsonValue);
    } catch (e) {
        console.error('Erro ao salvar item.', e);
    }
}