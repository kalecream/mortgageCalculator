import { Dispatch, SetStateAction, useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { FormDetails } from "../types/purchaser"; // eslint-disable-line no-unused-vars
import { currencyFormatter } from "../lib/currencyFormat";
import { NHTInterestRates } from "../lib/constants";
import house from "../assets/house.png";

// TODO: Add tabs, amortization schedule, and more

const Form = () => {
  const nhtMax = 7500000;
  const [formData, setFormData] = useState<FormDetails>({
    contributors: 1,
    housingCost: 25000000,
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
        amountToBorrow: 20000000,
        nht: {
          loan: "true",
          interest: 0.04,
          loanTerm: 30,
          loanMonthly: 0,
          amountToBorrowAfterNHT: 0,
        },
        bank: {
          loan: "true",
          interest: 0.04,
          loanTerm: 30,
          loanMonthly: 0,
        },
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

  useEffect(() => {
    const nhtYears = 30;
    const nhtInterest = 0.04;

    const totalLoanMonths = nhtYears * 12;
    const interestPerMonth = nhtInterest / 12;
    const nhtMonthly =
      ( ( formData.persons[0].amountToBorrow < NHTInterestRates.nhtMaxLoan ? formData.persons[0].amountToBorrow : NHTInterestRates.nhtMaxLoan ) * interestPerMonth * (1 + interestPerMonth) ** totalLoanMonths) /
      ((1 + interestPerMonth) ** totalLoanMonths - 1);
    const bankMonthly = (formData.persons[0].amountToBorrow - nhtMax) * 0.04 / 12; 
    

    setFormData({
      ...formData,
      housingCost: formData.house.cost,
      contributors: formData.persons.length,
      persons: formData.persons.map((person) => {
        return {
          ...person,
          amountToBorrow: formData.housingCost - person.downPayment,
          nht: {
            ...person.nht,
            loan: (formData.housingCost - person.downPayment) < NHTInterestRates.nhtMaxLoan ? currencyFormatter((formData.housingCost - person.downPayment)) : currencyFormatter(NHTInterestRates.nhtMaxLoan),
            interest: nhtInterest,
            loanTerm: nhtYears,
            loanMonthly: nhtMonthly,
            amountToBorrowAfterNHT: formData.housingCost - nhtMax,
          },
          bank: {
            ...person.bank,
            loanMonthly: person.nht.amountToBorrowAfterNHT < 0 ? 0 : formData.housingCost - nhtMax,
          },
        };
      }),
    });
  }, [formData]);

  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <div id="add-person">
          <button>+ Add Person</button>
        </div>

        <fieldset>
          <img src={house} width={250} />
          <div className="div">
            <input
              type="Housing Cost"
              name="cost"
              id="cost"
              value={formData.house?.cost}
              step={100000}
              onChange={onChangeHouse}
            />
            <label htmlFor="Housing Cost">Housing Cost</label>
          </div>

          <div className="">
            <input
              type="number"
              name="deposit"
              id="deposit"
              min={0}
              max={formData.house?.cost}
              step={100000}
              onChange={onChangeHouse}
              pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
              value={formData.persons[0].downPayment}
            />
            <label htmlFor="deposit">Deposit</label>
            <small>
              Minimum Deposit {currencyFormatter(formData.house.cost * 0.1)}
            </small>
          </div>
        </fieldset>

        <fieldset>
          <label>Contributor </label>
          <fieldset>
            <legend>Salary Information</legend>

            <div className="">
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
            </div>

            <div className="person">
              <input
                type="number"
                name="birthYear1"
                id="birthYear1"
                value={formData.persons[0].birthYear}
                onChange={onChange}
              />
              <label htmlFor="birthYear">Birth Year</label>
            </div>
            <div className="">
              <input type="string" name="age1" id="age1" value={currencyFormatter(formData.persons[0].nht.loanMonthly + formData.persons[0].bank.loanMonthly)} />
              <label>Total Monthly Cost</label>
              { formData.persons[0].nht.loanMonthly + formData.persons[0].bank.loanMonthly > formData.persons[0].salary * 0.35 ? <p>Unaffordable: Monthly cost is more than 35% of salary</p> : null

              }
            </div>
          </fieldset>
          <fieldset>
            <legend>House Purchase Cost</legend>

            <div className="">
              <input
                type="string"
                name="AmountToBorrow"
                id="transferTax"
                value={currencyFormatter(formData.persons[0].amountToBorrow)}
              />
              <label htmlFor="AmountToBorrow">Amount To Borrow</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>NHT Loan Information</legend>
            <div className="">
              <input
                type="checkbox"
                name="nht-loan"
                id="nht-loan"
                value={formData.persons[0]?.nht.loan}
              />

              <label htmlFor="nht-loan">Using NHT?</label>
            </div>
              <section>
                <input
                  type="string"
                  name="nht-max"
                  id="nht-max"
                  value={currencyFormatter(NHTInterestRates.nhtMaxLoan)}
                />
            <span >@</span>
                <input
                  type="string"
                  name="nht-interest"
                  id="nht-interest"
                  value={(formData.persons[0].nht.interest * 100).toFixed(2) + " %"}
                />
                <span> for </span>
                <input
                  type="string"
                  name="nht-term"
                  id="nht-term"
                  value={formData.persons[0].nht.loanTerm + " Years"}
                />
              </section>
              <div>
                <input
                  type="string"
                  name="nht-monthly"
                  id="nht-monthly"
                  value={currencyFormatter(formData.persons[0].nht.loanMonthly)}
                />
                <label>Monthly NHT payment</label>
              </div>
          </fieldset>
          <label>Bank Information</label>
          <div className="">
            <input type="checkbox" name="bank" id="bank" value={formData.persons[0].bank.loan} />
            <label htmlFor="bank">Using Bank Loan?</label>
          </div>
          <section>
          <input type="string" name="bank-loan" id="bank-loan" value={currencyFormatter(formData.persons[0].bank.loan)} />
    <span> @ </span>
          <input type="string" name="bank-interest" id="bank-interest" value={(formData.persons[0].bank.interest * 100).toFixed(2) + " %"} />
        <span> for </span>
            <input type="string" name="bank-term" id="bank-term" value={formData.persons[0].bank.loanTerm + " Years"} />
          </section>
          
          <div className="">

            <input type="string" value={currencyFormatter(formData.persons[0].bank.loanMonthly)} />
            <label htmlFor="bank-monthly">Monthly Bank Payment</label>
          </div>
        </fieldset>
      </form>
      <p>Based on the mortgage spreadsheet found at </p>
    </>
  );
};

export default Form;
