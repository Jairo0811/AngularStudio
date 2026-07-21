export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly color: string;
}

export type CalendarEventDraft = Omit<CalendarEvent, 'id'>;
