import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, FooterComponent],
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
  monthlyHolidays: any[] = [];
  availableYears: number[] = [];

  // Propiedades para el popover de feriados
  popoverOpen = false;
  popoverContent: string[] = [];
  popoverPosition = { top: '0px', left: '0px' };

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.populateYears();
    this.renderApp();
  }

  private populateYears(): void {
    const startYear = this.currentYear - 10;
    for (let i = 0; i <= 20; i++) {
      this.availableYears.push(startYear + i);
    }
  }

  async renderApp(): Promise<void> {
    // Si no hay mes o año, no renderizar el calendario.
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

    // Poblar la lista de feriados del mes
    this.monthlyHolidays = [];
    const monthKey = `${this.currentYear}-${String(
      this.currentMonth + 1
    ).padStart(2, '0')}`;
    holidaysMap.forEach((holidays, date) => {
      if (date.startsWith(monthKey)) {
        this.monthlyHolidays.push(...holidays);
      }
    });
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

  onDateChange(): void {
    this.renderApp();
  }

  goToToday(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.renderApp();
  }
  /** Helpers de UI **/
  isToday(day: number): boolean {
    const today = new Date();
    if (this.currentMonth === null || this.currentYear === null) {
      return false;
    }
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

  showHolidayPopover(day: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que el clic se propague al fondo
    if (this.isHoliday(day)) {
      const holidayNames = this.getHolidayNames(day);
      if (holidayNames.length > 0) {
        this.popoverContent = holidayNames;
        const rect = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        this.popoverPosition = {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
        };
        this.popoverOpen = true;
      }
    }
  }

  closePopover(): void {
    if (this.popoverOpen) {
      this.popoverOpen = false;
    }
  }
}
