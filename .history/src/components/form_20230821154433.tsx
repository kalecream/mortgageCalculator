import { useEffect, useState } from "react";

interface Person {
  salary: number;
  birthYear: number;
  nht: boolean;
  nhtInterest?: number;
  nhtYears?: number;
  nhtMonthly?: number;
}

interface FormDetails {
    dualSalary: boolean;
    persons: Person[];
}

const Form = () => {
    const [formData, setFormData] = useState<FormDetails>({
        dualSalary: false,
        persons: [
            {
                salary: 150000,
                birthYear: 1985,
                nht: false,
                nhtInterest: 0,
                nhtYears: 0,
                nhtMonthly: 0,
            },
            {
                salary: 200000,
                birthYear: 19,
                nht: false,
                nhtInterest: 0,
                nhtYears: 0,
                nhtMonthly: 0,
            },
        ],
    });

    useEffect(() => {

    }, []);

  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <fieldset>
          <legend>Salary Information</legend>
          <div className="checkbox">
            <input type="number" name="dual-salary" id="dual-salary"  min={1} max={1000} defaultValue={1} maxLength={4} onChange={onChange} value={formData.persons[0].salary} />
            <label htmlFor="dual-salary">How many persons are contributing to the purchase of the house?</label>
          </div>

          <div className="persons" style={{ display: "flex" }}>
            <div className="person">
              <input type="number" name="Salary1" id="salary1" />
              <label htmlFor="salary">Your Income</label>
              <input type="number" name="birthYear1" id="birthYear1" />
              <label htmlFor="birthYear">Your Birth Year</label>
            </div>
          </div>

          <p id="total-income"></p>

          <div className="info">
            <p>Max 33% of Salary to Loans</p>
          </div>
        </fieldset>
        <fieldset>
          <legend>House Purchase Cost</legend>
          <input type="Housing Cost" name="cost" id="cost" />
          <label htmlFor="Housing Cost">Housing Cost</label>
          <input type="number" name="deposit" id="deposit" />
          <label htmlFor="deposit">Deposit</label>

          <p id="borrow-amount"></p>
        </fieldset>

        <fieldset>
          <legend>NHT Loan Information</legend>
          <input type="checkbox" name="nht-loan" id="nht-loan" />
          <label htmlFor="nht-loan">Using NHT?</label>
          <input type="checkbox" name="nht-loan" id="nht-loan" />
          <label htmlFor="nht-loan">For Both?</label>
          <div>
            <span>Contributor 1</span>
            <span>NHT Interest</span>
            <span>Years</span>
            <div>
              Monthly NHT payments <span></span>
            </div>
          </div>
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
