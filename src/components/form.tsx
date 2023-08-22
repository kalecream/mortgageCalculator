import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Person {
  name?: string;
  salary: number;
  birthYear: number;
  downPayment?: number;
  nht: string;
  nhtInterest?: number;
  nhtLoanTerm?: number;
  nhtLoanMonthly?: number;
  borrowAmount: number;
  borrowAmountAfterNHT: number;
  bankLoan?: number;
  bankInterest?: number;
  bankYears?: number;
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
  nhtMax: number;
  persons: Person[];
  house: HousingCosts;
}

const defaultOptions = {
  significantDigits: 2,
  thousandsSeparator: ",",
  decimalSeparator: ".",
  symbol: "$",
};

const currencyFormatter = (
  value: number | string,
  options: {
    significantDigits: number;
    thousandsSeparator: string;
    decimalSeparator: string;
    symbol: string;
  }
) => {
  if (typeof value !== "number") value = 0.0;
  options = { ...defaultOptions, ...options };
  value = value.toFixed(options.significantDigits);

  const [currency, decimal] = value.split(".");
  return `${options.symbol} ${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator
  )}${options.decimalSeparator}${decimal}`;
};

const Form = () => {
  const [formData, setFormData] = useState<FormDetails>({
    contributors: 1,
    housingCost: 25000000,
    nhtMax: 7500000,
    house: {
      cost: 25000000,
      transferTax: 0.05,
      stampduty: 0.04,
      legalFees: 0.03,
      legalFeesRate: 0.03,
      salesAgreement: 0.01,
      registrationFee: 0.01,
      realEstateAgent: 0.03,
    },
    persons: [
      {
        salary: 150000,
        birthYear: 1985,
        downPayment: 500000,
        borrowAmount: 20000000,
        borrowAmountAfterNHT: 0,
        nht: "true",
        nhtInterest: 0,
        nhtLoanTerm: 0,
        nhtLoanMonthly: 0,
      },
    ],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onChangeHouse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, house: { ...formData.house, [name]: value } });
  };

  const AddPerson = (
    formData: FormDetails,
    setFormData: Dispatch<SetStateAction<FormDetails>>
  ) => {
    let contributors = formData.contributors;
    contributors++;

    setFormData({
      ...formData,
      contributors: contributors,
      persons: [
        ...formData.persons,
        {
          salary: 0,
          birthYear: 0,
          downPayment: 0,
          nht: "false",
          nhtInterest: 0,
          nhtLoanTerm: 0,
          nhtLoanMonthly: 0,
          borrowAmount: 0,
          borrowAmountAfterNHT: 0,
          bankLoan: 0,
          bankInterest: 0,
          bankYears: 0,
        },
      ],
    });

    return (
      <div className="person">
        <input
          type="text"
          name={`salary${contributors}`}
          id="salary1"
          value={formData.persons[formData.contributors].salary}
          min={1}
          max={99999999999}
          onChange={onChange}
        />
        <label htmlFor="salary">Your Monthly Income</label>
        <input
          type="number"
          name="birthYear1"
          id="birthYear1"
          value={formData.persons[0].birthYear}
          onChange={onChange}
        />
        <label htmlFor="birthYear">Your Birth Year</label>
      </div>
    );
  };

  const CalculateNHT = (
    formData: FormDetails,
    setFormData: Dispatch<SetStateAction<FormDetails>>
  ) => {
    const nhtMax = formData.nhtMax;
    const housingCost = formData.housingCost;
    const contributors = formData.contributors;
    const persons = formData.persons;
    const borrowAmountAfterNHT = housingCost - nhtMax;

    const nhtYears = 30;
    const nhtInterest = 0.04;

    const totalLoanMonths = nhtYears * 12;
    const interestPerMonth = nhtInterest / 12;
    const nhtMonthly =
      (nhtMax * interestPerMonth * (1 + interestPerMonth) ** totalLoanMonths) /
      ((1 + interestPerMonth) ** totalLoanMonths - 1);

    setFormData({
      ...formData,
      nhtMax: nhtMax,
      housingCost: housingCost,
      contributors: contributors,
      persons: [
        {
          ...persons[0],
          borrowAmountAfterNHT: borrowAmountAfterNHT,
          nhtInterest: nhtInterest,
          nhtLoanTerm: nhtYears,
          nhtLoanMonthly: nhtMonthly,
        },
      ],
    });
  };

  useEffect(() => {
    CalculateNHT(formData, setFormData);
  }, [formData.housingCost, formData.nhtMax, formData.contributors, formData]);

  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <div id="add-person">
          <button>+ Add Person</button>
        </div>

        <fieldset>
          <label>Contributor </label>
          <fieldset>
            <legend>Salary Information</legend>
            <div className="persons" style={{ display: "flex" }}>
              <div className="person">
                <input
                  type="text"
                  name="Salary1"
                  id="salary1"
                  value={formData.persons[0].salary}
                  min={1}
                  max={99999999999}
                  onChange={onChange}
                />
                <label htmlFor="salary">Monthly Income</label>
                <input
                  type="number"
                  name="birthYear1"
                  id="birthYear1"
                  value={formData.persons[0].birthYear}
                  onChange={onChange}
                />
                <label htmlFor="birthYear">Birth Year</label>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>House Purchase Cost</legend>
            <input
              type="Housing Cost"
              name="cost"
              id="cost"
              value={formData.house?.cost}
              step={100000}
              onChange={onChangeHouse}
              pattern="^[0-9]{1,2}([,][0-9]{1,2})?$"
            />
            <label htmlFor="Housing Cost">Housing Cost</label>
            <input
              type="number"
              name="deposit"
              id="deposit"
              value={formData.persons[0].downPayment}
            />
            <label htmlFor="deposit">Deposit</label>

            <p id="borrow-amount">
              {currencyFormatter(
                formData.persons[0].borrowAmount,
                defaultOptions
              )}
            </p>
          </fieldset>

          <fieldset>
            <legend>NHT Loan Information</legend>
            <select
              name="nht-loan"
              id="nht-loan"
              value={formData.persons[0].nht}
            >
              <option value="true" selected>
                Yes
              </option>
              <option value="false">No</option>
            </select>

            <label htmlFor="nht-loan">Using NHT?</label>
            <div>
              <p>
                Amount after NHT Loan:{" "}
                {currencyFormatter(
                  formData.persons[0]?.borrowAmountAfterNHT,
                  defaultOptions
                )}
              </p>
              <p>NHT Interest {formData.persons[0]?.nhtInterest}</p>
              <span>Years {formData.persons[0]?.nhtLoanTerm}</span>
              <div>
                Monthly NHT payment
                <span>
                  {formData.persons[0]?.nhtLoanMonthly}
                </span>
              </div>
            </div>
          </fieldset>
        </fieldset>
      </form>
      <div>
        <p>Total monthly Load Payments</p>
        <p>Cost of Deposit + House Purchase Fees</p>
      </div>
      <p>Based on the mortgage spreadsheet found at </p>
    </>
  );
};

export default Form;
