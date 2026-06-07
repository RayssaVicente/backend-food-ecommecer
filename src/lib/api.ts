import axios from 'axios';
import 'dotenv/config'; // Carrega o .env automaticamente

if (!process.env.ASAAS_API_URL || !process.env.ASAAS_API_ACESS_TOKEN) {
  throw new Error("Variáveis de ambiente ASAAS não configuradas.");
}

export const api = axios.create({
  baseURL: process.env.ASAAS_API_URL,
  headers: {
    // Certifique-se de usar o nome exato que está no seu .env
    access_token: process.env.ASAAS_API_ACESS_TOKEN,
  },
});