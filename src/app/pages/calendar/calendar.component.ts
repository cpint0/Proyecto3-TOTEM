import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  readonly API_URL = 'https://date.nager.at/api/v3/PublicHolidays';
  readonly DEFAULT_COUNTRY_CODE = 'CL';

  monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  currentYear!: number;
  currentMonth!: number;
  daysInMonth = 0;
  firstDayOfWeek = 0;
  daysArray: number[] = [];

  loading = false;
  error = '';
  yearlyHolidays: Map<string, Map<string, any[]>> = new Map();

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.renderApp();
  }

  async renderApp(): Promise<void> {
    this.error = '';
    const yearKey = String(this.currentYear);

    if (!this.yearlyHolidays.has(yearKey)) {
      await this.fetchHolidays(this.currentYear);
    }

    const holidaysMap = this.yearlyHolidays.get(yearKey) || new Map();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfWeek = firstDay.getDay();
    this.daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
    this.daysArray = Array.from({ length: this.daysInMonth }, (_, i) => i + 1);

    // Guardar mapa en memoria
    this.yearlyHolidays.set(yearKey, holidaysMap);
  }

  async fetchHolidays(year: number): Promise<void> {
    this.loading = true;
    try {
      const response = await fetch(
        `${this.API_URL}/${year}/${this.DEFAULT_COUNTRY_CODE}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const map = new Map<string, any[]>();
      data.forEach((holiday: any) => {
        if (!map.has(holiday.date)) map.set(holiday.date, []);
        map.get(holiday.date)!.push(holiday);
      });

      this.yearlyHolidays.set(String(year), map);
    } catch (err: any) {
      this.error = `No se pudieron cargar los feriados (${err.message}).`;
      this.yearlyHolidays.set(String(year), new Map());
    } finally {
      this.loading = false;
    }
  }

  changeMonth(delta: number): void {
    this.currentMonth += delta;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderApp();
  }

  /** Helpers de UI **/
  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === this.currentYear &&
      today.getMonth() === this.currentMonth &&
      today.getDate() === day
    );
  }

  isHoliday(day: number): boolean {
    const key = this.formatDate(day);
    const holidays = this.yearlyHolidays
      .get(String(this.currentYear))
      ?.get(key);
    return holidays ? holidays.length > 0 : false;
  }

  getHolidayNames(day: number): string[] {
    const key = this.formatDate(day);
    const holidays = this.yearlyHolidays
      .get(String(this.currentYear))
      ?.get(key);
    return holidays ? holidays.map((h) => h.localName) : [];
  }

  private formatDate(day: number): string {
    const month = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${this.currentYear}-${month}-${dayStr}`;
  }
}
