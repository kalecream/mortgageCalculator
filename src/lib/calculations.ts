export const calculateMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    loanTerm: number
  ) => {
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    return (
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
  };
