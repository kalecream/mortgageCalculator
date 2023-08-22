const Form = () => {
    return (
        <>
            <h1>Mortgage Calculator</h1>
            <form>
                <fieldset>
                    <legend>Salary Information</legend>
                    <input type="checkbox" name="dual-salary" id="dual-salary" />
                    <label htmlFor="dual-salary">Dual Salary</label>
                    <input type="number" name="Salary1" id="salary1" />
                    <label htmlFor="salary">Salary 1</label>
                    <input type="number" name="Salary2" id="salary2" />
                    <label htmlFor="salary">Salary 2</label>
                    
                    <div>
                        <p>Max 33% of Salary to Loans</p>
                        <p id="total-income"></p>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>NHT Loan Information</legend>
                    <input type="check"
                </fieldset>
            </form>
            <p>Based on the mortgage spreadsheet found at </p>
        </>
    );
};

export default Form;
