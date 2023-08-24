import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { FormDetails } from "../types/purchaser"
import { NHTInterestRates, HousingCostRates  } from './constants';

const handleDataChange = (formData: FormDetails, setFormData: Dispatch<SetStateAction<FormDetails>>) => {

    

    formData.persons.forEach((person, index) => {
        let { salary, birthYear, downPayment, amountToBorrow } = person;
        let nht = { ...person.nht };
        let bank = { ...person.bank };

        amountToBorrow  = (formData.house.cost / formData.contributors) - downPayment;

        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData };
            newFormData.persons[index].amountToBorrow = amountToBorrow;
            return newFormData;
        }
        );
    });

};

export default handleDataChange;
