import { Injectable, signal } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventDraft,
} from '../models/calendar-event.model';

const STORAGE_KEY = 'angular-studio.calendar.events';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  readonly events = signal<readonly CalendarEvent[]>(this.load());

  add(draft: CalendarEventDraft): void {
    const event: CalendarEvent = {
      ...draft,
      id: crypto.randomUUID(),
    };

    this.events.update((events) => [...events, event]);
    this.persist();
  }

  remove(id: string): void {
    this.events.update((events) => events.filter((event) => event.id !== id));
    this.persist();
  }

  private load(): readonly CalendarEvent[] {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events()));
  }
}
