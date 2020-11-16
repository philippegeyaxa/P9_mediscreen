import React, {useState} from 'react';
import axios from "axios";
import patientsApiUrl from './api';

const patientFields = [
    {field : "id", label : "Patient id", readonly : true},
    {field : "family", label : "Family name"},
    {field : "given", label : "Given name"},
    {field : "dob", label : "Date of birth"},
    {field : "sex", label : "Sex"},
    {field : "address", label : "Address"},
    {field : "phone", label : "Phone"}
];

function Patient() {

    const [input, setInput] = useState(true);
    const [error, setError] = useState('');
    const [patient, setPatient] = React.useState({ id : window.location.pathname.split("/").pop(), family : '', given : '', dob : '', sex : '', address : '', phone : ''});

    function displayError() {
        if (! error) return null;
        return (
            <footer>
                {error}
            </footer>
        );
    }

    React.useEffect(() => {
        if (patient.id !== '' && patient.id !== 'new') {
            axios.get(patientsApiUrl + "/" + patient.id)
                .then(response => {
                    setPatient(response.data);
                    setError('');
                })
                .catch( error => {
                    setInput(false);
                    if (error.response) {
                        setError(error.response.status + " " + error.response.data);
                    } else {
                        setError(error.message + " : check that the server is up and running !");
                    }
                });
        }
    }, [patient.id]);

    function onClick(event) {
        event.preventDefault();
        const body = {...patient};
        if (patient.id === 'new') {
            body.id=0;
            axios.post(patientsApiUrl, body)
                .then(response => {
                    body.id=response.data.id;
                    setInput(false);
                    setError("Patient created successfully with id=" + body.id);
                })
                .catch(error => {
                    if (error.response) {
                        setError(error.response.status + " " + error.response.data);
                    } else {
                        setError(error.message + " : check that the server is up and running !");
                    }
                });
        } else
        {
            axios.put(patientsApiUrl + "/" + patient.id, body)
                .then(response => {
                    setPatient(response.data);
                    setError('');
                })
                .catch(error => {
                    if (error.response) {
                        setError(error.response.status + " " + error.response.data);
                    } else {
                        setError(error.message + " : check that the server is up and running !");
                    }

                });
        }
    }

    function onChange (field) {
        field.persist();
        const newPatient = {...patient};
        newPatient[field.target.name] = field.target.value;
        setPatient(newPatient);
    }

    function displayField(field, label, readonly) {
        if (!input) return null;
        const disabled = !!readonly;
        return (<div>
            <label>{label}
                <input value={patient[field]} name={field} onChange={onChange} disabled={disabled} />
            </label>
        </div>);
    }

    function displaySaveButton() {
        if (!input) return null;
        return(
            <button onClick={onClick}>Save</button>
        );
    }

    return (
        <div>
            <h1>Patient edit</h1>
            <form>
                {patientFields.map(fieldSpec => displayField(fieldSpec.field, fieldSpec.label, fieldSpec.readonly))}
                {displaySaveButton()}
                {displayError()}
            </form>
        </div>
    );
}

export default Patient;