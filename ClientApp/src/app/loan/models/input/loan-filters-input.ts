export class LoanFilters {
  userId?: string;
  employeeName?: string;
  employeeId?: string;
  equipmentIds?: string[];
  startDate?: Date;
  endDate?: Date;
  dateFilterType?: LoanDateFilterEnum;
  returnedFilterType?: LoanDateFilterEnum;
}

export enum LoanDateFilterEnum {
  Unknown,
  LoanDate,
  DevolutionDate
}

export enum LoanReturnedFilterEnum {
  Unknown,
  Returned,
  NotReturned
}