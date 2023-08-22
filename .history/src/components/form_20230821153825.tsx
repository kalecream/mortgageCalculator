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
                salary: 0,
                birthYear: 0,
                nht: false,
                nhtInterest: 0,
                nhtYears: 0,
                nhtMonthly: 0,
            },
            {
                salary: 0,
                birthYear: 0,
                nht: false,
                nhtInterest: 0,
                nhtYears: 0,
                nhtMonthly: 0,
            },
        ],
    });

    useEffect(() => {
        const totalIncome = formData.persons.reduce((acc, person) => {
            return acc + person.salary;
        }, 0);

        const totalNHTMonthly = formData.persons.reduce((acc, person) => {

  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <fieldset>
          <legend>Salary Information</legend>
          <div className="checkbox">
            <input type="number" name="dual-salary" id="dual-salary"  />
            <label htmlFor="dual-salary">How many persons are purchasing the house?</label>
          </div>

          <div className="persons" style={{ display: "flex" }}>
            <div className="person">
              <input type="number" name="Salary1" id="salary1" />
              <label htmlFor="salary">Your Income</label>
              <input type="number" name="birthYear1" id="birthYear1" />
              <label htmlFor="birthYear">Your Birth Year</label>
            </div>
            <div className="person second-person">
              <input type="number" name="Salary2" id="salary2" />
              <label htmlFor="salary">Partner's Income</label>
              <input type="number" name="birthYear1" id="birthYear1" />
              <label htmlFor="birthYear">Partner's Birth Year</label>
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
