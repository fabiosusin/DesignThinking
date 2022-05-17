import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MimeTypeEnum } from '../../models/enum/mime-type.enum';
import { SessionService } from '../session/session.service';

@Injectable({ providedIn: 'root' })
export class BaseApiRequestsService {
  static hasInternetConnection = false;

  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) { }

  static generateUrlQuery = (obj: any) =>
    !obj || !Object.keys(obj) ? '' : '?' + Object.keys(obj).filter(x => obj[x]).map(x => `${x}=${encodeURIComponent(obj[x] instanceof Date ? obj[x].toJSON() : obj[x])}`).join('&')

  private getDefaultOptions(): any {
    return {
      'Content-Type': MimeTypeEnum.json,
      'Accept': MimeTypeEnum.json,
      'Access-Control-Allow-Origin': '*',
      'serializer': 'json',
      'responseType': 'json'
    };
  }

  protected defaultResolve = (result: any) => {
    BaseApiRequestsService.hasInternetConnection = true;
    return result;
  }

  protected defaultRejection = async (result: HttpErrorResponse) => {
    console.debug('rejection => ', result);
    switch (result.status) {
      case 401: // Unauthorized
        BaseApiRequestsService.hasInternetConnection = true;
        break;
      case -6:  // The Internet connection appears to be offline
      case -4:  // Timed out
      case -3:  // Unknown Host
      case -2:  // TLS connection failed
      case -1:  // Failed to connect
      case 0:   // Unknown Error - Happens when navigator blocks the request
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        BaseApiRequestsService.hasInternetConnection = false;
        break;
      default:
        BaseApiRequestsService.hasInternetConnection = true;
        break;
    }
    return result;
  }

  protected request<T>(method: string, url: string, args: RequestOptions, attempts: number = 0): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      this.http.request(method, url, args).toPromise()
        .then((result: any) => resolve(this.defaultResolve(result)))
        .catch(async (result: HttpErrorResponse) => {
          if ([401, 403].includes(result.status) && this.session.getLoggedUserEmail() && attempts == 0) {
            console.error('Erro de token')
            await this.updateToken(this.session.getLoggedUserEmail() ?? '');
            args.headers = {...args.headers, ...(await this.getAuthOptions())};
            resolve(this.request(method, url, { ...args, ...await this.getAuthOptions() }, ++attempts));
          }
          else
            reject(await this.defaultRejection(result))
        });
    });
  }

  protected postAllowAnonymous<T = any>(path: string, data: any = {}, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('post', environment.apiUrl + path, { body: data, headers: requestHeaders });
  }

  protected getAuth<T = any>(path: string, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('get', environment.apiBaseUrl + path, { headers: requestHeaders });
  }

  protected postAuth<T = any>(path: string, data: any = {}, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('post', environment.apiBaseUrl + path, { body: data, headers: requestHeaders });
  }

  protected async getWithBaseUrl<T = any>(path: string, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('get', environment.apiBaseUrl + path, { headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  protected async get<T = any>(path: string, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('get', environment.apiUrl + path, { headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  protected async post<T = any>(path: string, data: any = {}, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('post', environment.apiUrl + path, { body: data, headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  protected async put<T = any>(path: string, data: any = {}, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('put', environment.apiUrl + path, { body: data, headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  protected async patch<T = any>(path: string, data: any = {}, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('patch', environment.apiUrl + path, { body: data, headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  protected async delete<T = any>(path: string, requestHeaders?: HttpHeaders): Promise<T> {
    return this.request<T>('delete', environment.apiUrl + path, { headers: { ...(await this.getAuthOptions()), ...requestHeaders } });
  }

  static baseExceptionMessage = (): string => !BaseApiRequestsService.hasInternetConnection ?
    'Verifique sua conexão de internet e tente novamente.' :
    'Ocorreu um erro, tente novamente, caso o erro persista contate nossa equipe de suporte.';

  getAuthOptions = async () => {
    const options = await this.getDefaultOptions();
    const token = await this.getToken();
    if (token)
      options['Authorization'] = 'Bearer ' + token;

    return options;
  }

  private getToken = async () => {
    const session = this.session.getSession();
    const userEmail = session?.user?.email;
    if (!userEmail)
      return null;

    const tokenInfo = session?.token;
    if (tokenInfo?.tokenExpiration && new Date(tokenInfo.tokenExpiration) > new Date())
      return tokenInfo.token;

    await this.updateToken(userEmail);
    return session?.token;
  }

  private updateToken = async (email: string) => {
    const renewToken = await this.getAuth('Auth/intra-renew-token' + BaseApiRequestsService.generateUrlQuery({ email }));;
    if (renewToken)
      this.session.setTokenInfo({ tokenExpiration: renewToken.accessTokenExpiration, token: renewToken.accessToken });
  }

}

export type RequestOptions = {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  }
};