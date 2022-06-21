import { Environment } from 'src/app/core/models/enum/environment.enum';

// Servidor de debug local (apiUrl deve ser o IP local do seu computador)
export const environment = {
  production: false,
  name: Environment.dev,
  apiBaseUrl: 'http://localhost:44363/v1/',
  apiUrl: 'http://localhost:44363/v1/Intra/'
};
