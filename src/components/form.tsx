import { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { FormDetails } from "../types/purchaser"; // eslint-disable-line no-unused-vars
import { currencyFormatter } from "../lib/currencyFormat";
import { NHTInterestRates } from "../lib/constants";
import house from "../assets/house.png";
import person from "../assets/person.png";
// import persons from "../assets/persons.png";

// TODO: Add tabs, amortization schedule, and more

const Form = () => {

  const [formData, setFormData] = useState<FormDetails>({
    contributors: 1,
    house: {
      cost: 27000000,
      totalDeposit: 0,
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
        downPayment: 4050000,
        amountToBorrow: 20000000,
        nht: {
          loan: false,
          interest: 0.04,
          loanTerm: 30,
          loanAmount: 0,
          loanMonthly: 0,
          amountToBorrowAfterNHT: 0,
        },
        bank: {
          loan: false,
          interest: 0.04,
          loanTerm: 30,
          loanAmount: 0,
          loanMonthly: 0,
        },
      },
    ],
  });

  const onChangePerson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      persons: [
        {
          ...formData.persons[0],
          [name]: value,
        },
      ],
    });
  };

  const onChangePersonNHT = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      persons: [
        {
          ...formData.persons[0],
          nht: {
            ...formData.persons[0].nht,
            [name]: value,
          },
        },
      ],
    });
  };

  const onChangeHouse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, house: { ...formData.house, [name]: value } });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      contributors: formData.persons.length,
      house: {
        ...formData.house,
        cost: formData.house.cost,
        totalDeposit: formData.persons.reduce(
          (acc, person) => acc + person.downPayment,
          0
        ),
      },
      persons: formData.persons.map((person) => {
        return {
          ...person,
          amountToBorrow: formData.house.cost - person.downPayment,
          nht: {
            ...person.nht,
            loanAmount:
              formData.house.cost - person.downPayment <
              NHTInterestRates.nhtMaxLoan
                ? formData.house.cost - person.downPayment
                : NHTInterestRates.nhtMaxLoan,
            interest: 0.04,
            loanTerm: new Date().getFullYear() - person.birthYear,
            loanMonthly:
              ((person.amountToBorrow < NHTInterestRates.nhtMaxLoan
                ? person.amountToBorrow
                : NHTInterestRates.nhtMaxLoan) *
                (person.nht.interest / 12) *
                (1 + person.nht.interest / 12) ** (person.nht.loanTerm * 12)) /
              ((1 + person.nht.interest / 12) ** (person.nht.loanTerm * 12) -
                1),
            amountToBorrowAfterNHT:
              formData.house.cost - NHTInterestRates.nhtMaxLoan,
          },
          bank: {
            ...person.bank,
            loanAmount:
              person.nht.amountToBorrowAfterNHT < NHTInterestRates.nhtMaxLoan
                ? 0
                : formData.house.cost - NHTInterestRates.nhtMaxLoan,
            interest: 0.0916,
            loanTerm: new Date().getFullYear() - person.birthYear,
            loanMonthly:
              person.nht.amountToBorrowAfterNHT > NHTInterestRates.nhtMaxLoan
                ? (person.bank.loanAmount *
                    (person.bank.interest / 12) *
                    (1 + person.bank.interest / 12) **
                      (person.bank.loanTerm * 12)) /
                  ((1 + person.bank.interest / 12) **
                    (person.bank.loanTerm * 12) -
                    1)
                : formData.house.cost - NHTInterestRates.nhtMaxLoan,
          },
        };
      }),
    });
  }, [formData]);

  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <fieldset>
          <div className="category">
            <img src={house} width={250} />
            <button>Purchasing Cost</button>
          </div>
          <div className="form-item">
            <input
              type="Housing Cost"
              name="cost"
              id="housing-cost"
              value={formData.house?.cost}
              onChange={onChangeHouse}
            />
            <label htmlFor="Housing Cost">Housing Cost</label>
          </div>

          <div className="form-item">
            <input
              type="string"
              name="deposit"
              id="housing-deposit"
              min={0}
              max={formData.house?.cost}
              value={currencyFormatter(formData.house.totalDeposit)}
            />
            <label htmlFor="deposit">Total Deposit</label>

            <div className="info-panel">
              {formData.house?.totalDeposit &&
                formData.house?.totalDeposit < 0.15 * formData.house?.cost && (
                  <p>
                    <strong>Minimum Deposit Needed</strong>
                    <br />
                    {currencyFormatter(formData.house?.cost * 0.15)}
                  </p>
                )}
            </div>
          </div>
        </fieldset>

        <fieldset className="persons">
          <div className="category">
            <img src={person} width={150} />
            <div className="options">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="nht.loan"
                  id="nht-loan"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      persons: [
                        {
                          ...formData.persons[0],
                          nht: {
                            ...formData.persons[0].nht,
                            loan: e.target.checked,
                          },
                        },
                      ],
                    })
                  }
                  checked={formData.persons[0]?.nht.loan}
                />
                <label htmlFor="nht-loan">Using NHT</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="bank.loan"
                  id="bank"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      persons: [
                        {
                          ...formData.persons[0],
                          bank: {
                            ...formData.persons[0].bank,
                            loan: e.target.checked,
                          },
                        },
                      ],
                    })
                  }
                  checked={formData.persons[0].bank.loan}
                />
                <label htmlFor="bank">Using Bank Loan</label>
              </div>
            </div>
            <div id="add-person">
              <button>+ Add Person</button>
            </div>
          </div>

          <fieldset>
            <div className="form-item">
              <input
                type="text"
                name="salary"
                id="person-salary-1"
                value={formData.persons[0].salary}
                min={1}
                max={99999999999}
                onChange={onChangePerson}
              />
              <label htmlFor="salary">Monthly Income</label>
            </div>

            <div className="form-item">
              <input
                type="number"
                name="birthYear"
                id="person-birthYear-1"
                step={1}
                value={formData.persons[0].birthYear}
                onChange={onChangePerson}
              />
              <label htmlFor="birthYear">Birth Year</label>
            </div>

            <div className="form-item">
              <input
                type="string"
                name="AmountToBorrow"
                value={currencyFormatter(formData.persons[0].amountToBorrow)}
              />
              <label htmlFor="AmountToBorrow">Amount Needed</label>
            </div>
          </fieldset>

          {formData.persons[0].nht.loan && formData.persons[0].bank.loan && (
            <div className="form-item">
              <input
                type="string"
                name="age1"
                id="age1"
                value={currencyFormatter(
                  formData.persons[0].nht.loanMonthly +
                    formData.persons[0].bank.loanMonthly
                )}
              />
              <label>Total Monthly Cost</label>
            </div>
          )}

          {formData.persons[0].nht.loan == true && (
            <fieldset>
              <legend>NHT Loan Information</legend>

              <div className="loan-terms">
                <input
                  type="number"
                  name="loanAmount"
                  id="nht-loan-amount"
                  value={formData.persons[0].nht.loanAmount}
                  onChange={onChangePersonNHT}
                />
                <span>@</span>
                <input
                  type="string"
                  name="interest"
                  id="nht-interest"
                  onChange={onChangePersonNHT}
                  value={
                    (formData.persons[0].nht.interest * 100).toFixed(2) + " %"
                  }
                />
                <span> for </span>
                <input
                  type="string"
                  name="loanTerm"
                  id="nht-term"
                  onChange={onChangePersonNHT}
                  value={formData.persons[0].nht.loanTerm + " Years"}
                />
              </div>
              <div className="form-item">
                <input
                  type="string"
                  name="loanMonthly"
                  id="nht-monthly"
                  value={currencyFormatter(formData.persons[0].nht.loanMonthly)}
                />
                <label>Monthly NHT payment</label>
              </div>
            </fieldset>
          )}

          {formData.persons[0].bank.loan == true && (
            <fieldset>
              <label>Bank Information</label>

              <div className="loan-item">
                <select>
                  <option>NCB</option>
                  <option>Scotia</option>
                  <option>First Global</option>
                </select>
              </div>

              <div className="loan-terms">
                <input
                  type="string"
                  name="bank-loan"
                  id="bank-loan"
                  value={formData.persons[0].bank.loanAmount}
                />
                <span> @ </span>
                <input
                  type="string"
                  name="bank-interest"
                  id="bank-interest"
                  value={
                    (formData.persons[0].bank.interest * 100).toFixed(2) + " %"
                  }
                />
                <span> for </span>
                <input
                  type="string"
                  name="bank-term"
                  id="bank-term"
                  value={formData.persons[0].bank.loanTerm + " Years"}
                />
              </div>

              <div className="form-item">
                <input
                  type="string"
                  value={currencyFormatter(
                    formData.persons[0].bank.loanMonthly
                  )}
                />
                <label htmlFor="bank-monthly">Monthly Bank Payment</label>
              </div>
            </fieldset>
          )}
        </fieldset>
      </form>
      <div className="">
        <button>Email mortgage breakdown</button>
        <p>Based on the mortgage spreadsheet found at </p>
      </div>
    </>
  );
};

export default Form;
