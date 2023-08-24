

interface NHTDetails {
  loan: string;
  interest: number;
  loanTerm: number;
  loanMonthly: number;
  loanYearly?: number;
  amountToBorrowAfterNHT: number;
  totalRepayment?: number;
  totalInterest?: number;
}

interface BankDetails {
  loan: string;
  interest: number;
  loanTerm: number;
  loanMonthly: number;
  loanYearly?: number;
  totalRepayment?: number;
  totalInterest?: number;
}

interface HousingCosts {
  cost: number;
  transferTax: number;
  stampduty: number;
  legalFees: number;
  legalFeesRate: number;
  salesAgreement: number;
  registrationFee: number;
  realEstateAgent: number;
}

interface FormDetails {
  contributors: number;
  housingCost: number;
  persons: ContributorDetails[];
  house: HousingCosts;
}

interface ContributorDetails {
  name?: string;
  salary: number;
  birthYear: number;
  downPayment: number;
  amountToBorrow: number;
  nht: NHTDetails;
  bank: BankDetails;
}

export type { FormDetails, ContributorDetails, NHTDetails, HousingCosts  }
