import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import {
  ApiCountryResponse,
  Country,
} from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly http = inject(HttpClient);

  /**
   * API Countries actualmente redirige su dominio documentado
   * hacia countries.dev.
   *
   * Usamos el endpoint final para evitar redirecciones innecesarias
   * durante la petición realizada desde el navegador.
   */
  private readonly endpoint = 'https://countries.dev/countries';

  getCountries(): Observable<Country[]> {
    return this.http.get<ApiCountryResponse[]>(this.endpoint).pipe(
      map((response) =>
        response
          .map((country) => this.mapCountry(country))
          .filter((country) => this.isValidCountry(country))
          .sort((firstCountry, secondCountry) =>
            firstCountry.name.common.localeCompare(
              secondCountry.name.common,
              'es',
              {
                sensitivity: 'base',
              },
            ),
          ),
      ),
      catchError((error: unknown) => {
        console.error(
          'Error al consultar API Countries:',
          error,
        );

        return throwError(
          () =>
            new Error(
              'No fue posible obtener la información de los países.',
            ),
        );
      }),
    );
  }

  private mapCountry(apiCountry: ApiCountryResponse): Country {
    const countryName =
      apiCountry.translations?.es?.trim() ||
      apiCountry.name?.trim() ||
      'País desconocido';

    const officialName =
      apiCountry.nativeName?.trim() ||
      apiCountry.name?.trim() ||
      countryName;

    const alpha2Code =
      apiCountry.alpha2Code?.trim().toUpperCase() ?? '';

    const alpha3Code =
      apiCountry.alpha3Code?.trim().toUpperCase() ?? '';

    return {
      name: {
        common: countryName,
        official: officialName,
      },

      cca2: alpha2Code,
      cca3: alpha3Code,

      capital: apiCountry.capital
        ? [apiCountry.capital]
        : [],

      region: apiCountry.region?.trim() || 'Sin región',
      subregion:
        apiCountry.subregion?.trim() || 'Sin subregión',

      population: apiCountry.population ?? 0,

      flags: {
        png:
          apiCountry.flags?.png ||
          this.buildFallbackFlagUrl(alpha2Code, 'png'),

        svg:
          apiCountry.flags?.svg ||
          this.buildFallbackFlagUrl(alpha2Code, 'svg'),

        alt: `Bandera de ${countryName}`,
      },
    };
  }

  private isValidCountry(country: Country): boolean {
    return (
      country.name.common !== 'País desconocido' &&
      country.cca2.length === 2 &&
      country.cca3.length === 3
    );
  }

  private buildFallbackFlagUrl(
    alpha2Code: string,
    format: 'png' | 'svg',
  ): string {
    if (!alpha2Code) {
      return '';
    }

    const normalizedCode = alpha2Code.toLowerCase();

    return format === 'svg'
      ? `https://flagcdn.com/${normalizedCode}.svg`
      : `https://flagcdn.com/w320/${normalizedCode}.png`;
  }
}