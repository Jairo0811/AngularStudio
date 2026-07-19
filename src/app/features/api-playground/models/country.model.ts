/**
 * Modelo utilizado internamente por Angular Studio.
 *
 * La interfaz visual trabaja únicamente con este modelo,
 * independientemente de la estructura original de la API.
 */
export interface Country {
  readonly name: {
    readonly common: string;
    readonly official: string;
  };

  readonly cca2: string;
  readonly cca3: string;

  readonly capital: readonly string[];

  readonly region: string;
  readonly subregion: string;

  readonly population: number;

  readonly flags: {
    readonly png: string;
    readonly svg: string;
    readonly alt: string;
  };
}

/**
 * Respuesta original entregada por API Countries.
 *
 * Este DTO no debe utilizarse directamente en los componentes.
 * El servicio se encarga de transformarlo al modelo Country.
 */
export interface ApiCountryResponse {
  readonly name?: string;
  readonly nativeName?: string;

  readonly alpha2Code?: string;
  readonly alpha3Code?: string;

  readonly capital?: string;

  readonly region?: string;
  readonly subregion?: string;

  readonly population?: number;

  readonly flags?: {
    readonly png?: string;
    readonly svg?: string;
  };

  readonly translations?: {
    readonly es?: string;
    readonly [languageCode: string]: string | undefined;
  };
}