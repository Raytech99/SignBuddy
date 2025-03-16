import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use the environment variable

export const detectSign = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/detect`, data);
        return response.data;
    } catch (error) {
        console.error('Error detecting sign:', error);
        throw error;
    }
}; 