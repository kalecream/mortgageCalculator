import React, { Dispatch, SetStateAction } from "react";
import { FormDetails } from "../types/purchaser";





const AddPerson = (
    formData: FormDetails,
    setFormData: Dispatch<SetStateAction<FormDetails>>
  ) => {
    let contributors = formData.contributors;
    contributors++;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

    setFormData({
      ...formData,
      contributors: contributors,
      persons: [
        ...formData.persons,
        {
          salary: 0,
          birthYear: 0,
            downPayment: 0,
          amountToBorrow: 0,
            nht: {
                loan: false,
                interest: 0,
                loanTerm: 0,
                loanMonthly: 0,
                amountToBorrowAfterNHT: 0,
          },
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

  export default AddPerson;
