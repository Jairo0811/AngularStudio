export type ApiTabId = 'random-users' | 'pokemon' | 'flags';

export interface ApiTab {
  readonly id: ApiTabId;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}
