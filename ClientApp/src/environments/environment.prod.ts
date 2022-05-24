import { Environment } from 'src/app/core/models/enum/environment.enum';

export const environment = {
  production: true,
  name: Environment.prod,
  apiBaseUrl: 'https://xapi.intra.digital:443/v1/',
  apiUrl: 'https://xapi.intra.digital:443/v1/Intra/'
};