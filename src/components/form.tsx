import { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { FormDetails } from "../types/purchaser"; // eslint-disable-line no-unused-vars
import { currencyFormatter } from "../lib/currencyFormat";
import { HousingCostRates, NHTInterestRates } from "../lib/constants";
import { Footer } from "./footer";

// TODO: Add tabs, amortization schedule, and more

const Form = () => {
    const [formData, setFormData] = useState<FormDetails>({
        contributors: 1,
        house: {
            cost: 25000000,
            totalDeposit: 5000000,
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
                name: "John Doe",
                salary: 120000,
                birthYear: 0,
                downPayment: 0,
                amountToBorrow: 0,
                maxMortgage: 0,
                monthlyPayment: 0,
                nht: {
                    loan: false,
                    interest: 0.04,
                    loanTerm: 30,
                    loanAmount: 0,
                    loanMonthly: 0,
                    amountToBorrowAfterNHT: 0,
                    totalRepayment: 0,
                    totalInterest: 0,
                },
                bank: {
                    loan: false,
                    interest: 0.09,
                    loanTerm: 30,
                    loanAmount: 0,
                    loanMonthly: 0,
                },
            },
        ],
    });

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    const parseCurrency = (value: string): number => {
        return parseFloat(value.replace(/[^0-9.]/g, ""));
    };

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

    const onChangeHouse = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        const rawValue = parseCurrency(e.target.value);
        setFormData((formData) => ({
            ...formData,
            house: { ...formData.house, [field]: rawValue },
        }));
    };

    const addPerson = () => {
        const newPerson = {
            name: `Contributor ${formData.persons.length + 1}`,
            salary: 0,
            birthYear: 0,
            downPayment: 0,
            amountToBorrow: 0,
            maxMortgage: 0,
            monthlyPayment: 0,
            nht: {
                loan: false,
                interest: 0.04,
                loanTerm: 30,
                loanAmount: 0,
                loanMonthly: 0,
                amountToBorrowAfterNHT: 0,
                totalRepayment: 0,
                totalInterest: 0,
            },
            bank: {
                loan: false,
                interest: 0.09,
                loanTerm: 30,
                loanAmount: 0,
                loanMonthly: 0,
            },
        };

        setFormData((prevData) => ({
            ...prevData,
            contributors: prevData.contributors + 1,
            persons: [...prevData.persons, newPerson],
        }));
    };

    useEffect(() => {
        setFormData({
            ...formData,
            contributors: formData.persons.length,
            house: {
                ...formData.house,
                cost: formData.house.cost,
                totalDeposit:
                    formData.persons.length > 1
                        ? formData.persons.reduce(
                              (acc, person) => acc + person.downPayment,
                              0
                          )
                        : formData.house.totalDeposit,
                transferTax: formData.house.cost * HousingCostRates.transferTax,
                stampduty: formData.house.cost * HousingCostRates.stampDuty,
                legalFees: formData.house.cost * HousingCostRates.legalFees,
                salesAgreement:
                    formData.house.cost * HousingCostRates.salesAgreement,
                registrationFee:
                    formData.house.cost * HousingCostRates.registrationFee,
            },
            persons: formData.persons.map((person) => {
                return {
                    ...person,
                    downPayment:
                        person.downPayment > formData.house.cost
                            ? formData.house.cost
                            : person.downPayment,
                    maxMortgage: person.salary * 0.33,
                    amountToBorrow: formData.house.cost - person.downPayment,
                    monthlyPayment:
                        person.nht.loan && person.bank.loan
                            ? person.nht.loanMonthly + person.bank.loanMonthly
                            : person.nht.loan
                            ? person.nht.loanMonthly
                            : person.bank.loan
                            ? person.bank.loanMonthly
                            : 0,
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
                            ((person.amountToBorrow <
                            NHTInterestRates.nhtMaxLoan
                                ? person.amountToBorrow
                                : NHTInterestRates.nhtMaxLoan) *
                                (person.nht.interest / 12) *
                                (1 + person.nht.interest / 12) **
                                    (person.nht.loanTerm * 12)) /
                            ((1 + person.nht.interest / 12) **
                                (person.nht.loanTerm * 12) -
                                1),
                        amountToBorrowAfterNHT:
                            formData.house.cost - NHTInterestRates.nhtMaxLoan,
                    },
                    bank: {
                        ...person.bank,
                        loanAmount:
                            person.nht.amountToBorrowAfterNHT <
                            NHTInterestRates.nhtMaxLoan
                                ? 0
                                : formData.house.cost -
                                  NHTInterestRates.nhtMaxLoan,
                        interest: 0.0916,
                        loanTerm: new Date().getFullYear() - person.birthYear,
                        loanMonthly:
                            person.nht.amountToBorrowAfterNHT >
                            NHTInterestRates.nhtMaxLoan
                                ? (person.bank.loanAmount *
                                      (person.bank.interest / 12) *
                                      (1 + person.bank.interest / 12) **
                                          (person.bank.loanTerm * 12)) /
                                  ((1 + person.bank.interest / 12) **
                                      (person.bank.loanTerm * 12) -
                                      1)
                                : formData.house.cost -
                                  NHTInterestRates.nhtMaxLoan,
                    },
                };
            }),
        });
    }, [formData]);

    return (
        <>
            <Footer />
            <form>
                <fieldset>
                    <fieldset className="form">
                        <div className="form-item">
                            <input
                                type="Housing Cost"
                                name="cost"
                                id="housing-cost"
                                value={formatCurrency(formData.house.cost)}
                                onChange={(e) => onChangeHouse(e, "cost")}
                                className="user-input"
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
                                value={formatCurrency(
                                    formData.house.totalDeposit
                                )}
                                className="user-input"
                                onChange={(e) =>
                                    onChangeHouse(e, "totalDeposit")
                                }
                            />
                            <label htmlFor="deposit">Deposit</label>
                        </div>
                    </fieldset>
                    {formData.house.cost > 0 && (
                        <div className="form closing-costs">
                          
                                <p>
                                    <b>Closing Costs</b> {" "}
                                    <span>
                                        {currencyFormatter(
                                            formData.house.transferTax +
                                                formData.house.stampduty +
                                                formData.house.legalFees +
                                                formData.house.salesAgreement +
                                                formData.house.registrationFee
                                        )}
                                    </span>
                                </p>

                            <div>
                                <td>Transfer Tax</td>
                                <td>
                                    {currencyFormatter(
                                        formData.house.transferTax
                                    )}
                                </td>
                            </div>
                            <div>
                                <td>Stamp Duty</td>
                                <td>
                                    {currencyFormatter(
                                        formData.house.stampduty
                                    )}
                                </td>
                            </div>
                            <div>
                                <td>Legal Fees</td>
                                <td>
                                    {currencyFormatter(
                                        formData.house.legalFees
                                    )}
                                </td>
                            </div>
                            <div>
                                <td>Sales Agreement</td>
                                <td>
                                    {currencyFormatter(
                                        formData.house.salesAgreement
                                    )}
                                </td>
                            </div>
                            <div>
                                <td>Registration Fee</td>
                                <td>
                                    {currencyFormatter(
                                        formData.house.registrationFee
                                    )}
                                </td>
                            </div>
                        </div>
                    )}
                    {formData.house && <p>Total Deposit<br/>{formatCurrency(formData.house.totalDeposit+ formData.house.transferTax +
                                                formData.house.stampduty +
                                                formData.house.legalFees +
                                                formData.house.salesAgreement +
                                                formData.house.registrationFee)}</p>}
                    <div className="message">
                        {formData.house?.totalDeposit &&
                            formData.house?.totalDeposit <
                                0.15 * formData.house?.cost && (
                                <p>
                                    <strong>Minimum Deposit Needed</strong>
                                    <br />
                                    {currencyFormatter(
                                        formData.house?.cost * 0.15
                                    )}
                                </p>
                            )}
                    </div>
                </fieldset>

                <fieldset className="persons">
                    <div className="category">
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
                                                        ...formData.persons[0]
                                                            .nht,
                                                        loan: e.target.checked,
                                                    },
                                                },
                                            ],
                                        })
                                    }
                                    checked={formData.persons[0]?.nht.loan}
                                />
                                <label htmlFor="nht-loan">NHT</label>
                            </div>
                            <div className="checkbox-item">
                                <input
                                    className="checkbox"
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
                                                        ...formData.persons[0]
                                                            .bank,
                                                        loan: e.target.checked,
                                                    },
                                                },
                                            ],
                                        })
                                    }
                                    checked={formData.persons[0].bank.loan}
                                />
                                <label htmlFor="bank">Bank Loan</label>
                            </div>
                        </div>
                        <div id="add-person">
                            <button type="button" onClick={addPerson}>
                                Add Contributor
                            </button>
                        </div>
                    </div>
                    <div className="form">
                        <fieldset className="form">
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

                            {formData.persons[0].nht.loan ||
                            formData.persons[0].bank.loan ? (
                                <div className="form-item">
                                    <input
                                        type="number"
                                        name="birthYear"
                                        id="person-birthYear-1"
                                        step={1}
                                        value={formData.persons[0].birthYear}
                                        onChange={onChangePerson}
                                    />
                                    <label htmlFor="birthYear">
                                        Birth Year
                                    </label>
                                </div>
                            ) : null}

                            <div className="form-item">
                                <input
                                    type="string"
                                    name="AmountToBorrow"
                                    value={currencyFormatter(
                                        formData.persons[0].amountToBorrow
                                    )}
                                />
                                <label htmlFor="AmountToBorrow">
                                    Amount Needed
                                </label>
                            </div>

                            {formData.persons[0].nht.loan &&
                                formData.persons[0].bank.loan && (
                                    <div className="form">
                                        <div className="form-item">
                                            <input
                                                type="string"
                                                name="age1"
                                                id="age1"
                                                value={currencyFormatter(
                                                    formData.persons[0].nht
                                                        .loanMonthly +
                                                        formData.persons[0].bank
                                                            .loanMonthly
                                                )}
                                            />
                                            <label>Total Monthly Cost</label>
                                        </div>
                                    </div>
                                )}
                        </fieldset>
                        <div className="message">
                            {formData.persons[0].nht.loanMonthly +
                                formData.persons[0].bank.loanMonthly >
                                formData.persons[0].salary * 0.33 &&
                                (formData.persons[0].nht.loan ||
                                    formData.persons[0].bank.loan) && (
                                    <p>
                                        Loan payments exceed 33% of monthly
                                        income. <br />
                                        Salary should be {">="}{" "}
                                        {currencyFormatter(
                                            (formData.persons[0].nht
                                                .loanMonthly +
                                                formData.persons[0].bank
                                                    .loanMonthly) *
                                                3
                                        )}{" "}
                                        or House cost should be{" "}
                                        {currencyFormatter(
                                            formData.persons[0].maxMortgage /
                                                (formData.persons[0].nht.loan &&
                                                formData.persons[0].bank.loan
                                                    ? formData.persons[0].nht
                                                          .loanAmount +
                                                      formData.persons[0].bank
                                                          .loanAmount
                                                    : formData.persons[0].nht
                                                          .loanAmount ||
                                                      formData.persons[0].bank
                                                          .loanAmount) +
                                                formData.persons[0].downPayment
                                        )}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className="nht form">
                        {formData.persons[0].nht.loan == true && (
                            <div className="form">
                                <fieldset>
                                    <legend>
                                        NHT Loan:{" "}
                                        {currencyFormatter(
                                            formData.persons[0].nht.loanMonthly
                                        )}
                                    </legend>

                                    <div className="loan-terms">
                                        <input
                                            type="number"
                                            name="loanAmount"
                                            id="nht-loan-amount"
                                            value={
                                                formData.persons[0].nht
                                                    .loanAmount
                                            }
                                            onChange={onChangePersonNHT}
                                        />
                                        <span>@</span>
                                        <input
                                            type="string"
                                            name="interest"
                                            id="nht-interest"
                                            onChange={onChangePersonNHT}
                                            value={
                                                (
                                                    formData.persons[0].nht
                                                        .interest * 100
                                                ).toFixed(2) + " %"
                                            }
                                        />
                                        <span> for </span>
                                        <input
                                            type="string"
                                            name="loanTerm"
                                            id="nht-term"
                                            onChange={onChangePersonNHT}
                                            value={
                                                formData.persons[0].nht
                                                    .loanTerm + " Years"
                                            }
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        )}
                    </div>

                    {formData.persons[0].bank.loan == true && (
                        <fieldset>
                            <legend>
                                Bank:{" "}
                                {currencyFormatter(
                                    formData.persons[0].bank.loanMonthly
                                )}
                            </legend>

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
                                        (
                                            formData.persons[0].bank.interest *
                                            100
                                        ).toFixed(2) + " %"
                                    }
                                />
                                <span> for </span>
                                <input
                                    type="string"
                                    name="bank-term"
                                    id="bank-term"
                                    value={
                                        formData.persons[0].bank.loanTerm +
                                        " Years"
                                    }
                                />
                            </div>
                        </fieldset>
                    )}
                </fieldset>
            </form>
        </>
    );
};

export default Form;
