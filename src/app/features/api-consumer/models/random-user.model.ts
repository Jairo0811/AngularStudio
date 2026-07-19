export interface RandomUserResponse {
  readonly results: readonly RandomUser[];
  readonly info: RandomUserResponseInfo;
}

export interface RandomUserResponseInfo {
  readonly seed: string;
  readonly results: number;
  readonly page: number;
  readonly version: string;
}

export interface RandomUser {
  readonly gender: string;
  readonly email: string;
  readonly phone: string;
  readonly cell: string;
  readonly nat: string;
  readonly name: RandomUserName;
  readonly location: RandomUserLocation;
  readonly login: RandomUserLogin;
  readonly dob: RandomUserDate;
  readonly registered: RandomUserDate;
  readonly picture: RandomUserPicture;
}

export interface RandomUserName {
  readonly title: string;
  readonly first: string;
  readonly last: string;
}

export interface RandomUserLocation {
  readonly street: RandomUserStreet;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly postcode: string | number;
  readonly coordinates: RandomUserCoordinates;
  readonly timezone: RandomUserTimezone;
}

export interface RandomUserStreet {
  readonly number: number;
  readonly name: string;
}

export interface RandomUserCoordinates {
  readonly latitude: string;
  readonly longitude: string;
}

export interface RandomUserTimezone {
  readonly offset: string;
  readonly description: string;
}

export interface RandomUserLogin {
  readonly uuid: string;
  readonly username: string;
}

export interface RandomUserDate {
  readonly date: string;
  readonly age: number;
}

export interface RandomUserPicture {
  readonly large: string;
  readonly medium: string;
  readonly thumbnail: string;
}