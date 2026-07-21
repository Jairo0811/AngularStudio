import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';

interface CalendarDay {
  readonly date: Date;
  readonly isoDate: string;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly calendarService = inject(CalendarService);

  protected readonly weekDays = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
  ];

  protected readonly visibleMonth = signal(this.startOfMonth(new Date()));
  protected readonly selectedDate = signal(this.toIsoDate(new Date()));

  protected readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', Validators.maxLength(240)],
    color: ['#dd0031', Validators.required],
  });

  protected readonly days = computed<readonly CalendarDay[]>(() =>
    this.buildCalendar(this.visibleMonth()),
  );

  protected readonly selectedEvents = computed(() =>
    this.calendarService.events()
      .filter((event) => event.date === this.selectedDate())
      .sort((a, b) => a.title.localeCompare(b.title)),
  );

  protected previousMonth(): void {
    const current = this.visibleMonth();
    this.visibleMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    const current = this.visibleMonth();
    this.visibleMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  protected goToToday(): void {
    const today = new Date();
    this.visibleMonth.set(this.startOfMonth(today));
    this.selectedDate.set(this.toIsoDate(today));
  }

  protected selectDay(day: CalendarDay): void {
    this.selectedDate.set(day.isoDate);

    if (!day.isCurrentMonth) {
      this.visibleMonth.set(this.startOfMonth(day.date));
    }
  }

  protected addEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const value = this.eventForm.getRawValue();

    this.calendarService.add({
      ...value,
      title: value.title.trim(),
      description: value.description.trim(),
      date: this.selectedDate(),
    });

    this.eventForm.reset({
      title: '',
      description: '',
      color: '#dd0031',
    });
  }

  protected removeEvent(id: string): void {
    this.calendarService.remove(id);
  }

  protected eventsFor(date: string) {
    return this.calendarService.events().filter((event) => event.date === date);
  }

  private buildCalendar(month: Date): readonly CalendarDay[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, monthIndex, 1 - mondayOffset);
    const today = this.toIsoDate(new Date());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const isoDate = this.toIsoDate(date);

      return {
        date,
        isoDate,
        isCurrentMonth: date.getMonth() === monthIndex,
        isToday: isoDate === today,
      };
    });
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
