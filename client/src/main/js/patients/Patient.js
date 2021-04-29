import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {patientsApiUrl} from '../api/URLs';
import Switch from "react-switch";
import moment from 'moment'
import ModalError from "../modal/error";
import ModalSuccess from "../modal/success";

const patientFields = [
    {field : "id", label : "Patient id", readonly : true},
    {field : "family", label : "Family name"},
    {field : "given", label : "Given name"},
    {field : "dob", label : "Date of birth"},
    {field : "sex", label : "Sex"},
    {field : "address", label : "Address"},
    {field : "phone", label : "Phone"}
];

export const NUMBER_OF_PATIENT_FIELDS = 7;

function Patient({report}) {

    const error = useRef('');
    const success = useRef('');
    const [modal, setModal] = useState(false);
    const [input, setInput] = useState(true);
    const [patient, setPatient] = useState({ id : window.location.pathname.split("/").pop(), family : '', given : '', dob : '', sex : '', address : '', phone : ''});
    const [modify, setModify] = useState(window.location.href.includes('new'));

    useEffect(() => {
        if (patient.id === 'new') return;
        if (isNaN(parseInt(patient.id))) {
            error.current = 'It looks like you entered an invalid URL. Patient id must have a numeric value. Please check your request or ask your IT support !';
            setInput(false);
        } else {
            axios.get(patientsApiUrl + "/" + patient.id)
                .then(response => {
                    setPatient(response.data);
                })
                .catch( error => {
                    setInput(false);
                    if (error.response) {
                        error.current = error.response.status + " " + error.response.data;
                    } else {
                        error.current = error.message + " ! Please ask your IT support : it seems that the server or the database is unavailable !";
                    }
                });
        }
    }, [patient.id]);

    function onClickSave(event) {
        event.preventDefault();
        error.current = '';
        success.current = '';
        const body = {...patient};
        const givenDate = moment(patient.dob, "YYYY-MM-DD", true).toDate();
        const givenTime = givenDate.getTime();

        if (isNaN(givenTime) || givenTime < -5000000000000) {
            error.current = "Please enter a valid date of birth with format YYYY-MM-DD ("+ patient.dob + " is invalid).";
            setModal(true);
        } else if (patient.id === 'new') {
            body.id=0;
            axios.post(patientsApiUrl, body)
                .then(response => {
                    body.id=response.data.id;
                    setInput(false);
                    success.current = "Patient created successfully with id=" + body.id;
                })
                .catch(exception => {
                    if (exception.response) {
                        error.current = exception.response.status + " " + exception.response.data;
                    } else {
                        error.current = exception.message + " ! Please ask your IT support : it seems that the server or the database is unavailable !";
                    }
                    setModal(true);
                });
        } else
        {
            axios.put(patientsApiUrl + "/" + patient.id, body)
                .then(response => {
                    success.current = 'Patient has been saved successfully !';
                    setPatient(response.data);
                })
                .catch(exception => {
                    if (exception.response) {
                        error.current = exception.response.status + " " + exception.response.data;
                    } else {
                        error.current = exception.message + " ! Please ask your IT support : it seems that the server or the database is unavailable !";
                    }
                    setModal(true);
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
        if (field === 'id' && patient.id === 'new') return null;
        return (<div key={field}>
            <label>{label}
                <input value={patient[field]} name={field} onChange={onChange} disabled={disabled||modify===false} />
            </label>
        </div>);
    }

    function onChangeModify() {
        setModify(!modify);
    }

    function displayModifySwitch() {
        if (!input || window.location.href.includes('new') || !report===false) {
            return null;
        }
        return(
            <div key={"div-read-only"} className="div-read-only">
                <label>View</label>
                <div className="switch-read-only">
                    <Switch checked={modify} onChange={onChangeModify} checkedIcon={false} uncheckedIcon={false} />
                </div>
                <label>Edit</label>
            </div>
        );
    }

    function displaySaveButton() {
        if (!input || !modify) return null;
        return(
            <button className="button-save" onClick={onClickSave}>Save</button>
        );
    }

    function displayTitle() {
        const view = modify ? 'edit' : 'view';
        const title = patient.id === 'new' ? 'creation' : view;
        return(
            <h1>Patient {title}</h1>
        );
    }

    function closeErrorModal() {
        error.current = '';
        setModal(false);
    }

    function closeSuccessModal() {
        setModify(false);
        success.current = '';
        setModal(false);
    }

    return (
        <div>
            {displayTitle()}
            <form>
                {patientFields.map(fieldSpec => displayField(fieldSpec.field, fieldSpec.label, fieldSpec.readonly))}
                {displayModifySwitch()}
                {displaySaveButton()}
                <ModalError message={error.current} closureAction={closeErrorModal}/>
                <ModalSuccess message={success.current} closureAction={closeSuccessModal}/>
            </form>
        </div>
    );
}

export default Patient;