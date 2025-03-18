export interface MonthlyData {
  month: number
  count: number
  completed_at: string
}

export interface SemesterData {
  count: number
  months: MonthlyData[]
}

export interface YearlyReturnService {
  year: number
  firstSem: SemesterData
  secondSem: SemesterData
}

export interface ReturnService {
  yearlyReturnServices: YearlyReturnService[]
  id: number
  firstname: string
  lastname: string
  mobilenumber: string
  age: number
  yearLevel: string
  scholarType: string
  school: {
    name: string
  }
  barangay: {
    name: string
  }
}

export interface ScholarResponse {
  scholar: ReturnService
}