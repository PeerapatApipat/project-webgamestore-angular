import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly API_ENDPOINT: string = 'https://gamestore-node.onrender.com';
// public readonly API_ENDPOINT: string = 'http://192.168.1.9:3000';
}
