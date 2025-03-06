interface NHTDetails {
    loan: boolean;
    interest: number;
    loanAmount: number;
    loanTerm: number;
    loanMonthly: number;
    loanYearly?: number;
    amountToBorrowAfterNHT: number;
    totalRepayment: number;
    totalInterest: number;
}

interface HousingCosts {
    cost: number;
    totalDeposit: number;
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
    house: HousingCosts;
    persons: ContributorDetails[];
}

interface ContributorDetails {
    name?: string;
    salary: number;
    birthYear: number;
    downPayment: number;
    amountToBorrow: number;
    maxMortgage: number;
    monthlyPayment: number;
    nht: NHTDetails;
    bank: BankDetails;
}

interface BankDetails {
    loan: boolean;
    interest: number;
    loanAmount: number;
    loanTerm: number;
    loanMonthly: number;
    loanYearly?: number;
    totalRepayment?: number;
    totalInterest?: number;
}

export type { FormDetails, ContributorDetails, NHTDetails, HousingCosts };
