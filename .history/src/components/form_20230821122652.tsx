const Form = () => {
    return (
        <>
            <h1>Mortgage Calculator</h1>
            <form>
                <fieldset>
                    <legend>Salary Information</legend>
                    <input type="number" name="Salary 1" id="salary" />
                    <label htmlFor="salary">Salary 1</label>
                    <input type="number" name="Salary 2" id="salary" />
                    <label htmlFor="salary">Salary 2</label>
                    <input type="checkbox" name="dual-salary" id="dual-salary" />
                </fieldset>
            </form>
            <p>Based on the mortgage spreadsheet found at </p>
        </>
    );
};

export default Form;
