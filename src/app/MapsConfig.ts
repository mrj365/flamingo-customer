import { environment } from 'environments/environment';
import { LazyMapsAPILoaderConfigLiteral } from 'angular2-google-maps/core';
import {Injectable} from '@angular/core';

@Injectable()
export class MapsConfig implements LazyMapsAPILoaderConfigLiteral{
  public apiKey: string
  public libraries: string[]
  constructor() {
    this.apiKey = environment.googleApiKey;
    this.libraries = ['places'];
  }
}