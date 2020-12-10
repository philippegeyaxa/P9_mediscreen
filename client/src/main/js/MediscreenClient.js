import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import Patients from "./patients/Patients";
import Patient from "./patients/Patient";
import "../css/MediscreenClient.css";
import Notes from "./notes/Notes";

const Home = () => (
    <div>
        <h1>Mediscreen home page</h1>
    </div>
);

const MediscreenMenu = () => {

    return (
        <nav className="mediscreen-menu">
            <NavLink className="mediscreen-link" to="/" exact>
                Home
            </NavLink>
            <NavLink className="mediscreen-link" to="/patients">
                Patients
            </NavLink>
            <NavLink className="mediscreen-link" to="/notes">
                Notes
            </NavLink>
        </nav>
    );
};

function MediscreenClient() {
    return (
        <BrowserRouter>
            <MediscreenMenu />
            <div>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/patients">
                        <Patients />
                    </Route>
                    <Route exact path="/patients/new">
                        <Patient />
                    </Route>
                    <Route path="/patients">
                        <Patient />
                    </Route>
                    <Route path="/notes">
                        <Notes />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default MediscreenClient;