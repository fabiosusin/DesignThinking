import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { LocalStorageKeys } from '../../models/enum/local-storage-keys';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor() { }

  private static nameToHash = (key: LocalStorageKeys) =>
    Md5.hashStr(key.toString()) as string;

    public static getFromStorage = (key: LocalStorageKeys) =>
    atob(window.localStorage.getItem(LocalStorageService.nameToHash(key)) || '');

    public static getFromSession = (key: LocalStorageKeys) =>
    atob(window.sessionStorage.getItem(LocalStorageService.nameToHash(key)) || '');

  public static setToStorage = (key: LocalStorageKeys, value: string) =>
    window.localStorage.setItem(LocalStorageService.nameToHash(key), btoa(value));

  public static setToSession = (key: LocalStorageKeys, value: string) =>
    window.sessionStorage.setItem(LocalStorageService.nameToHash(key), btoa(value));

  public static removeFromStorage = (key: LocalStorageKeys) =>
    window.localStorage.removeItem(LocalStorageService.nameToHash(key));

  public static clearSession = () =>{
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}