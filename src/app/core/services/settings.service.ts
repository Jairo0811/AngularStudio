import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'dark' | 'light' | 'system';

interface AppSettings {
  readonly theme: ThemePreference;
  readonly animations: boolean;
  readonly compactMode: boolean;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'angular-studio:settings';
  private readonly state = signal<AppSettings>(this.load());

  readonly settings = this.state.asReadonly();
  readonly theme = computed(() => this.state().theme);

  constructor() {
    this.apply(this.state());
  }

  update(patch: Partial<AppSettings>): void {
    const next = { ...this.state(), ...patch };
    this.state.set(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
    this.apply(next);
  }

  reset(): void {
    const defaults = this.defaults();
    this.state.set(defaults);
    localStorage.setItem(this.storageKey, JSON.stringify(defaults));
    this.apply(defaults);
  }

  clearApplicationData(): void {
    const preservedSettings = localStorage.getItem(this.storageKey);
    Object.keys(localStorage)
      .filter((key) => key.startsWith('angular-studio:'))
      .forEach((key) => localStorage.removeItem(key));

    if (preservedSettings) {
      localStorage.setItem(this.storageKey, preservedSettings);
    }
  }

  private load(): AppSettings {
    try {
      return { ...this.defaults(), ...JSON.parse(localStorage.getItem(this.storageKey) ?? '{}') };
    } catch {
      return this.defaults();
    }
  }

  private defaults(): AppSettings {
    return { theme: 'dark', animations: true, compactMode: false };
  }

  private apply(settings: AppSettings): void {
    const root = this.document.documentElement;
    const resolvedTheme = settings.theme === 'system'
      ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : settings.theme;

    root.dataset['theme'] = resolvedTheme;
    root.classList.toggle('reduce-motion', !settings.animations);
    root.classList.toggle('compact-mode', settings.compactMode);
  }
}
