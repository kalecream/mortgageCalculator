const Form = () => {
  return (
    <>
      <h1>Mortgage Calculator</h1>
      <form>
        <fieldset>
          <legend>Salary Information</legend>
          <div className="checkbox">
            <input type="checkbox" name="dual-salary" id="dual-salary" />
            <label htmlFor="dual-salary">Dual Salary</label>
          </div>
          <div className="person1">
            <input type="number" name="Salary1" id="salary1" />
            <label htmlFor="salary">Person 1</label>
          </div>
          <div className="person2">
            <input type="number" name="Salary2" id="salary2" />
            <label htmlFor="salary">Person 2</label>
                  </div>
                  
                  <p id="total-income"></p>

          <div className="info">
            <p>Max 33% of Salary to Loans</p>
            
          </div>
        </fieldset>
        <fieldset>
          <legend>Housing Cost</legend>
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
      <p>Based on the mortgage spreadsheet found at </p>
    </>
  );
};

export default Form;
