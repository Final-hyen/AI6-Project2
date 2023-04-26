import { Column } from 'typeorm';

export class BirthDate {
  @Column({ name: 'birth_year' })
  readonly year: number;

  @Column({ name: 'birth_month' })
  readonly month: number;

  @Column({ name: 'birth_day' })
  readonly day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  equals(target: BirthDate): boolean {
    return (
      this.year === target.year &&
      this.month === target.month &&
      this.day === this.day
    );
  }
}
