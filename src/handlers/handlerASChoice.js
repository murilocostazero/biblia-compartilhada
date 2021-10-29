import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getData() {
    try {
        const jsonValue = await AsyncStorage.getItem('choice');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Erro ao recuperar item.', e);
    }
}

export async function storeData(value) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('choice', jsonValue);
    } catch (e) {
        console.error('Erro ao salvar item.', e);
    }
}