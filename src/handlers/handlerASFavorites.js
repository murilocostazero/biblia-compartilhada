import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFavoriteData() {
    try {
        const jsonValue = await AsyncStorage.getItem('favorites');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Erro ao recuperar item.', e);
    }
}

export async function storeFavoriteData(value) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('favorites', jsonValue);
    } catch (e) {
        console.error('Erro ao salvar item.', e);
    }
}