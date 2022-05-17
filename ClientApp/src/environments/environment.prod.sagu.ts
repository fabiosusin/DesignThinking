import { Environment } from 'src/app/core/models/enum/environment.enum';

export const environment = {
  production: true,
  name: Environment.prod,
  apiBaseUrl: 'https://xapi-sagu.xplay.digital:443/v1/',
  apiUrl: 'https://xapi-sagu.xplay.digital:443/v1/Intra/'
};