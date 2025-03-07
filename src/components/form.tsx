import { useEffect, useState } from "react";
import { FormDetails } from "../types/purchaser";
import { currencyFormatter, parseCurrency } from "../lib/currencyFormat";
import { HousingCostRates, NHTInterestRates } from "../lib/constants";
import { calculateMonthlyPayment } from "../lib/calculations";
import DownloadPDF from "./DownloadPDF";
import Logo from "../assets/ouroburos.svg";

// TODO: Add tabs, amortization schedule

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
                name: "Contributor 1",
                salary: 130000,
                birthYear: 1995,
                downPayment: 5000000,
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
                    interest: 0.0916,
                    loanTerm: 30,
                    loanAmount: 0,
                    loanMonthly: 0,
                },
            },
        ],
    });

    const onChangePerson = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setFormData({
            ...formData,
            persons: formData.persons.map((person, i) =>
                i === index
                    ? {
                          ...person,
                          [field]:
                              field === "name"
                                  ? e.target.value
                                  : parseCurrency(e.target.value),
                      }
                    : person
            ),
        });
    };

    const onChangePersonNHT = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setFormData({
            ...formData,
            persons: formData.persons.map((person, i) =>
                i === index
                    ? {
                          ...person,
                          nht: {
                              ...person.nht,
                              [field]: parseCurrency(e.target.value),
                          },
                      }
                    : person
            ),
        });
    };

    const onNHTLoanChange = (index: number, checked: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            persons: prevData.persons.map((person, i) =>
                i === index
                    ? {
                          ...person,
                          nht: {
                              ...person.nht,
                              loan: checked,
                          },
                      }
                    : person
            ),
        }));
    };

    const onBankLoanChange = (index: number, checked: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            persons: prevData.persons.map((person, i) =>
                i === index
                    ? {
                          ...person,
                          bank: {
                              ...person.bank,
                              loan: checked,
                          },
                      }
                    : person
            ),
        }));
    };

    const onChangeHouse = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setFormData((formData) => ({
            ...formData,
            house: {
                ...formData.house,
                [field]: parseCurrency(e.target.value),
            },
        }));
    };

    const addPerson = () => {
        const newPerson = {
            name: `Contributor ${formData.persons.length + 1}`,
            salary: 100000,
            birthYear: 1995,
            downPayment: 2500000,
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

    const removePerson = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            contributors: prevData.contributors - 1,
            persons: prevData.persons.filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        setFormData({
            ...formData,
            contributors: formData.persons.length,
            house: {
                ...formData.house,
                cost: formData.house.cost,
                totalDeposit: Math.min(
                    formData.persons.length > 1
                        ? formData.persons.reduce(
                              (acc, person) => acc + person.downPayment,
                              0
                          )
                        : formData.house.totalDeposit,
                    formData.house.cost
                ),
                transferTax: formData.house.cost * HousingCostRates.transferTax,
                stampduty: formData.house.cost * HousingCostRates.stampDuty,
                legalFees: formData.house.cost * HousingCostRates.legalFees,
                salesAgreement:
                    formData.house.cost * HousingCostRates.salesAgreement,
                registrationFee:
                    formData.house.cost * HousingCostRates.registrationFee,
            },
            persons: formData.persons.map((person) => ({
                ...person,
                downPayment: Math.min(person.downPayment, formData.house.cost),
                maxMortgage: person.salary * 0.33,
                amountToBorrow:
                    formData.house.cost -
                    formData.house.totalDeposit -
                    person.nht.loanAmount +
                    person.bank.loanAmount,
                monthlyPayment:
                    (person.nht.loan ? person.nht.loanMonthly : 0) +
                    (person.bank.loan ? person.bank.loanMonthly : 0),
                nht: {
                    ...person.nht,
                    loanAmount: Math.min(
                        formData.house.cost - person.downPayment,
                        NHTInterestRates.nhtMaxLoan
                    ),
                    loanTerm: new Date().getFullYear() - person.birthYear,
                    loanMonthly: calculateMonthlyPayment(
                        person.nht.loanAmount,
                        person.nht.interest,
                        person.nht.loanTerm
                    ),
                    amountToBorrowAfterNHT:
                        formData.house.cost - NHTInterestRates.nhtMaxLoan,
                },
                bank: {
                    ...person.bank,
                    loanAmount: Math.max(
                        formData.house.cost -
                            person.downPayment -
                            NHTInterestRates.nhtMaxLoan,
                        0
                    ),
                    interest: 0.0916,
                    loanTerm: new Date().getFullYear() - person.birthYear,
                    loanMonthly: calculateMonthlyPayment(
                        person.bank.loanAmount,
                        person.bank.interest,
                        person.bank.loanTerm
                    ),
                },
            })),
        });
    }, [formData]);

    return (
        <>
            <aside>
                <DownloadPDF />
                <a href="https://www.yunghigue.com/">
                    <img src={Logo} width={55} />
                </a>
                <div className="credit">
                    <h1>Mortgage Calc</h1>
                    <p>
                        Based on a spreadsheet at
                        <br />
                        <a href="https://financialcentsibility.com/calculators/">
                            Financial Centsibility.
                        </a>
                    </p>
                </div>
            </aside>
            <form>
                <fieldset>
                    <div className="form-item">
                        <input
                            type="Housing Cost"
                            name="cost"
                            id="housing-cost"
                            value={currencyFormatter(formData.house.cost)}
                            onChange={(e) => onChangeHouse(e, "cost")}
                            className="impt"
                        />
                        <label htmlFor="Housing Cost">Housing Cost</label>
                    </div>

                    {formData.house.cost > 0 && (
                        <>
                            <p>
                                <span>
                                    {currencyFormatter(
                                        formData.house.transferTax +
                                            formData.house.stampduty +
                                            formData.house.legalFees +
                                            formData.house.salesAgreement +
                                            formData.house.registrationFee
                                    )}
                                </span>
                                <b>Closing Costs</b>{" "}
                            </p>
                            <div className="closing-costs">
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
                        </>
                    )}

                    <div>
                        {formData.house && (
                            <div className="form-item">
                                <h1>
                                    {currencyFormatter(
                                        formData.house.totalDeposit +
                                            formData.house.transferTax +
                                            formData.house.stampduty +
                                            formData.house.legalFees +
                                            formData.house.salesAgreement +
                                            formData.house.registrationFee
                                    )}
                                </h1>
                                <br />
                                <span>Total Deposit</span>
                            </div>
                        )}
                    </div>

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

                {formData.persons.map((person, index) => (
                    <fieldset key={index} className="person">
                        <legend>
                            <div className="name-box">
                                <button
                                    type="button"
                                    onClick={addPerson}
                                    className="remove-button"
                                >
                                    +
                                </button>
                                <input
                                    type="text"
                                    name="name"
                                    value={person.name}
                                    onChange={(e) =>
                                        onChangePerson(index, e, "name")
                                    }
                                />
                                {formData.persons.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePerson(index)}
                                        className="remove-button"
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        </legend>
                        <div className="category">
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="nht.loan"
                                    className="tgl tgl-flip"
                                    id="nht-loan"
                                    onChange={(e) =>
                                        onNHTLoanChange(index, e.target.checked)
                                    }
                                    checked={person.nht.loan}
                                />
                                <label
                                    htmlFor="nht-loan"
                                    className="tgl-btn"
                                    data-tg-off="No NHT Loan"
                                    data-tg-on="NHT Loan"
                                />
                            </div>
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    className="tgl tgl-flip"
                                    name="bank.loan"
                                    id="bank"
                                    onChange={(e) =>
                                        onBankLoanChange(
                                            index,
                                            e.target.checked
                                        )
                                    }
                                    checked={person.bank.loan}
                                />
                                <label
                                    htmlFor="bank"
                                    className="tgl-btn"
                                    data-tg-off="No Bank Loan"
                                    data-tg-on="Bank Loan"
                                />
                            </div>
                        </div>
                        <div className="message">
                            {formData.persons[index].nht.loanMonthly +
                                formData.persons[index].bank.loanMonthly >
                                formData.persons[index].salary * 0.33 &&
                                (formData.persons[index].nht.loan ||
                                    formData.persons[index].bank.loan) && (
                                    <p>
                                        Loan payments exceed 33% of monthly
                                        income. <br />
                                        Salary should be {">="}{" "}
                                        {currencyFormatter(
                                            (formData.persons[index].nht
                                                .loanMonthly +
                                                formData.persons[index].bank
                                                    .loanMonthly) *
                                                3
                                        )}{" "}
                                        or House cost should be{" "}
                                        {currencyFormatter(
                                            formData.persons[index]
                                                .maxMortgage /
                                                (formData.persons[index].nht
                                                    .loan &&
                                                formData.persons[index].bank
                                                    .loan
                                                    ? formData.persons[index]
                                                          .nht.loanAmount +
                                                      formData.persons[index]
                                                          .bank.loanAmount
                                                    : formData.persons[index]
                                                          .nht.loanAmount ||
                                                      formData.persons[index]
                                                          .bank.loanAmount) +
                                                formData.persons[index]
                                                    .downPayment
                                        )}
                                    </p>
                                )}
                        </div>
                        <div className="form-item">
                            <input
                                name="salary"
                                value={currencyFormatter(person.salary)}
                                onChange={(e) =>
                                    onChangePerson(index, e, "salary")
                                }
                            />
                            <label htmlFor="salary">Monthly Income</label>
                        </div>
                        {(person.nht.loan || person.bank.loan) && (
                            <div className="form-item">
                                <input
                                    type="number"
                                    name="birthYear"
                                    value={person.birthYear}
                                    onChange={(e) =>
                                        onChangePerson(index, e, "birthYear")
                                    }
                                />
                                <label htmlFor="birthYear">Birth Year</label>
                            </div>
                        )}

                        <div>
                            {/* <div className="form-item">
                                    <input
                                        className="active-input"
                                        type="text"
                                        name="salary"
                                        id={`person-salary-${index}`}
                                        value={currencyFormatter(
                                            formData.persons[index].salary
                                        )}
                                        min={1}
                                        max={99999999999}
                                        onChange={(e) =>
                                            onChangePerson(index, e, "salary")
                                        }
                                    />
                                    <label htmlFor="salary">
                                        Monthly Income
                                    </label>
                                </div> */}

                            <div className="form-item">
                                <input
                                    type="string"
                                    name="deposit"
                                    id="housing-deposit"
                                    min={0}
                                    max={formData.house?.cost}
                                    value={currencyFormatter(
                                        formData.persons[index].downPayment
                                    )}
                                    className="impt"
                                    onChange={(e) =>
                                        onChangeHouse(e, "downPayment")
                                    }
                                />
                                <label htmlFor="deposit">Deposit</label>
                            </div>

                            {formData.persons[index].nht.loan ||
                                (formData.persons[index].bank.loan && (
                                    <div className="form-item">
                                        <input
                                            type="number"
                                            name="birthYear"
                                            id="person-birthYear-1"
                                            step={1}
                                            value={
                                                formData.persons[index]
                                                    .birthYear
                                            }
                                            onChange={(e) =>
                                                onChangePerson(
                                                    index,
                                                    e,
                                                    "birthYear"
                                                )
                                            }
                                        />
                                        <label htmlFor="birthYear">
                                            Birth Year
                                        </label>
                                    </div>
                                ))}

                            <div className="form-item">
                                <input
                                    type="string"
                                    name="AmountToBorrow"
                                    value={currencyFormatter(
                                        formData.persons[index].amountToBorrow
                                    )}
                                />
                                <label htmlFor="AmountToBorrow">
                                    Amount Needed
                                </label>
                            </div>

                            {formData.persons[index].nht.loan &&
                                formData.persons[index].bank.loan && (
                                    <div className="form">
                                        <div className="form-item">
                                            <input
                                                type="string"
                                                name={`age-${index}`}
                                                id={`age-${index}`}
                                                value={currencyFormatter(
                                                    formData.persons[index].nht
                                                        .loanMonthly +
                                                        formData.persons[index]
                                                            .bank.loanMonthly
                                                )}
                                            />
                                            <label>Total Monthly Cost</label>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {formData.persons[index].nht.loan && (
                            <div className="nht">
                                <legend>
                                    NHT Loan:{" "}
                                    {currencyFormatter(
                                        formData.persons[index].nht.loanMonthly
                                    )}
                                </legend>

                                <div className="loan-terms">
                                    <input
                                        type="number"
                                        name="loanAmount"
                                        id="nht-loan-amount"
                                        value={
                                            formData.persons[index].nht
                                                .loanAmount
                                        }
                                        onChange={(e) =>
                                            onChangePersonNHT(
                                                index,
                                                e,
                                                "loanAmount"
                                            )
                                        }
                                    />
                                    <span>@</span>
                                    <input
                                        type="string"
                                        name="interest"
                                        id="nht-interest"
                                        onChange={(e) =>
                                            onChangePersonNHT(
                                                index,
                                                e,
                                                "interest"
                                            )
                                        }
                                        value={
                                            (
                                                formData.persons[index].nht
                                                    .interest * 100
                                            ).toFixed(2) + " %"
                                        }
                                    />
                                    <span> for </span>
                                    <input
                                        type="string"
                                        name="loanTerm"
                                        id="nht-term"
                                        onChange={(e) =>
                                            onChangePersonNHT(
                                                index,
                                                e,
                                                "loanTerm"
                                            )
                                        }
                                        value={
                                            formData.persons[index].nht
                                                .loanTerm + " Years"
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {formData.persons[index].bank.loan && (
                            <div className="bank">
                                <legend>
                                    Bank:{" "}
                                    {currencyFormatter(
                                        formData.persons[index].bank.loanMonthly
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
                                        value={
                                            formData.persons[index].bank
                                                .loanAmount
                                        }
                                    />
                                    <span> @ </span>
                                    <input
                                        type="string"
                                        name="bank-interest"
                                        id="bank-interest"
                                        value={
                                            (
                                                formData.persons[index].bank
                                                    .interest * 100
                                            ).toFixed(2) + " %"
                                        }
                                    />
                                    <span> for </span>
                                    <input
                                        type="string"
                                        name="bank-term"
                                        id="bank-term"
                                        value={
                                            formData.persons[index].bank
                                                .loanTerm + " Years"
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </fieldset>
                ))}
            </form>
        </>
    );
};

export default Form;
