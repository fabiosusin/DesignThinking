import { Environment } from 'src/app/core/models/enum/environment.enum';

export const environment = {
  production: true,
  name: Environment.prod,
  apiBaseUrl: 'https://xapi.xplay.digital:443/v1/',
  apiUrl: 'https://xapi.xplay.digital:443/v1/Intra/'
};