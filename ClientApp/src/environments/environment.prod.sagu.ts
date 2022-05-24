import { Environment } from 'src/app/core/models/enum/environment.enum';

export const environment = {
  production: true,
  name: Environment.prod,
  apiBaseUrl: 'https://xapi-sagu.intra.digital:443/v1/',
  apiUrl: 'https://xapi-sagu.intra.digital:443/v1/Intra/'
};