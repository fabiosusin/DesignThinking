import { Environment } from 'src/app/core/models/enum/environment.enum';

// Servidor de debug local (apiUrl deve ser o IP local do seu computador)
export const environment = {
  production: false,
  name: Environment.dev,
  apiBaseUrl: 'http://10.0.0.32:80/v1/',
  apiUrl: 'http://10.0.0.32:80/v1/Intra/'
};
