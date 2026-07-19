export interface RandomUserResponse {
  readonly results: RandomUser[];
  readonly info: RandomUserResponseInfo;
}

export interface RandomUser {
  readonly gender: 'female' | 'male';
  readonly name: {
    readonly title: string;
    readonly first: string;
    readonly last: string;
  };
  readonly location: {
    readonly street: {
      readonly number: number;
      readonly name: string;
    };
    readonly city: string;
    readonly state: string;
    readonly country: string;
    readonly postcode: string | number;
  };
  readonly email: string;
  readonly login: {
    readonly uuid: string;
    readonly username: string;
  };
  readonly dob: {
    readonly date: string;
    readonly age: number;
  };
  readonly phone: string;
  readonly cell: string;
  readonly picture: {
    readonly large: string;
    readonly medium: string;
    readonly thumbnail: string;
  };
  readonly nat: string;
}

export interface RandomUserResponseInfo {
  readonly seed: string;
  readonly results: number;
  readonly page: number;
  readonly version: string;
}
