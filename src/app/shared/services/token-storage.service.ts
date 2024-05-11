import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ATTENDENCE_KEY = 'attendence-user';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      // Handle the case where localStorage is not available
      // console.error("localStorage is not supported in this environment");
      return null;
    }
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public saveAttendence(user: any): void {
    window.localStorage.removeItem(ATTENDENCE_KEY);
    window.localStorage.setItem(ATTENDENCE_KEY, JSON.stringify(user));
  }

  public getAttendence(): any {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem(ATTENDENCE_KEY);
      if (userJson !== null) {
        return JSON.parse(userJson);
      } else {
        // Handle the case where the user data is not found in localStorage
        // For example, you might return a default value or throw an error.
        // Here, I'll return null for simplicity, but you can adjust this based on your application logic.
        return null;
      }
    } else {
      // Handle the case where localStorage is not available
      // console.error("localStorage is not supported in this environment");
      return null;
    }

  }

  public getUser(): any {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson !== null) {
        return JSON.parse(userJson);
      } else {
        // Handle the case where the user data is not found in localStorage
        // For example, you might return a default value or throw an error.
        // Here, I'll return null for simplicity, but you can adjust this based on your application logic.
        return null;
      }
    } else {
      // Handle the case where localStorage is not available
      // console.error("localStorage is not supported in this environment");
      return null;
    }

  }
}
