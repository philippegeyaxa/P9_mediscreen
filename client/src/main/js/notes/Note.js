import React, {useRef, useState} from "react";
import axios from "axios";
import {notesApiUrl} from "../api/URLs";
import Switch from "react-switch";
import ReactQuill from "react-quill";
import {useHistory} from "react-router";
import Modal from "../modal/modal";
import {ACTION_DISPLAY_MODAL_ERROR, ACTION_DISPLAY_MODAL_SUCCESS} from "../reducers/reducerConstants";
import {useDispatch} from "react-redux";

const NOTE_NOT_FOUND = 'note-not-found';

export function postNote(body, patId, dispatch=()=>{}) {
    body.noteId = '';
    axios.post(notesApiUrl + '/patients/' + patId, body)
        .then(response => {
            body.noteId = response.data.noteId;
            dispatch({
                type: ACTION_DISPLAY_MODAL_SUCCESS,
                payload: "Note created successfully with id=" + body.noteId
            });
        })
        .catch(exception => {
            if (exception.response) {
                dispatch({type: ACTION_DISPLAY_MODAL_ERROR, payload: exception.response.data});
            } else {
                dispatch({
                    type: ACTION_DISPLAY_MODAL_ERROR,
                    payload: "Please ask your IT support : it seems that the server or the database is unavailable ! "
                        + exception.message
                });
            }
        });
}

function NoteSaveButton({modify, onClick}) {
    if (!modify) return null;
    return (
        <button className="button-save" onClick={onClick}>Save</button>
    );
}

function NoteTitleWithModeSelector({note, modify, onChangeSwitch}) {
    const view = modify ? 'edit' : 'view';
    const title = note.current.noteId === 'new' ? 'creation' : view;
    let switchHidden = false;
    if (window.location.href.includes('new')) {
        switchHidden = true;
    }
    return (
        <h1 className="title-note">Note {title}
            <div hidden={switchHidden}>
                &nbsp;
                <Switch checked={modify} onChange={onChangeSwitch}
                        checkedIcon={false} uncheckedIcon={false}
                        height={15} width={30} handleDiameter={13}/>
            </div>
        </h1>
    );
}

function Note() {
    const currentUrl = window.location.pathname.split("/");
    const note = useRef({noteId: currentUrl.pop(), patId: currentUrl.pop(), e: ''});
    const [, setNoteReady] = useState(false);
    const [modify, setModify] = useState(window.location.href.includes('new'));
    const history = useHistory();
    const dispatch = useDispatch();

    function setNote(data) {
        note.current = data;
        setNoteReady(true);
    }

    React.useEffect(() => {
        if (note.current.noteId !== 'new') {
            axios.get(notesApiUrl + "/" + note.current.noteId)
                .then(response => {
                    setNote(response.data);
                })
                .catch(exception => {
                    note.current.noteId = NOTE_NOT_FOUND;
                    dispatch({
                        type: ACTION_DISPLAY_MODAL_ERROR,
                        payload: "Please ask your IT support : it seems that the server or the database is unavailable ! "
                            + exception.message
                    });
                });
        }
    }, []);

    function putNote(body, setNote) {
        axios.put(notesApiUrl + "/" + body.noteId, body)
            .then(response => {
                setNote(response.data);
                dispatch({
                    type: ACTION_DISPLAY_MODAL_SUCCESS,
                    payload: 'Note has been saved successfully !'
                });
            })
            .catch(exception => {
                if (exception.response) {
                    dispatch({
                        type: ACTION_DISPLAY_MODAL_ERROR,
                        payload: exception.response.data
                    });
                } else {
                    dispatch({
                        type: ACTION_DISPLAY_MODAL_ERROR,
                        payload: "Please ask your IT support : it seems that the server or the database is unavailable ! "
                            + exception.message
                    });
                }
            });
    }

    function checkNoteContent(currentNote) {
        let element = document.createElement("div");
        element.innerHTML = currentNote.e;
        if (element.textContent.length === 0) {
            currentNote.e = '';
        }
    }

    function onClickSave(event) {
        event.preventDefault();
        checkNoteContent(note.current);
        const body = {...note.current};
        if (body.noteId === 'new') {
            postNote(body, body.patId, dispatch);
        } else {
            putNote(body, setNote, dispatch);
        }
    }

    function onChangeNote(content) {
        const newNote = {...note.current};
        newNote['e'] = content;
        setNote(newNote);
    }

    function onChangeSwitch() {
        setModify(!modify);
    }

    function closeErrorModal() {
        if (!window.location.href.includes('new') && note.current.noteId === NOTE_NOT_FOUND) {
            history.push('/notes');
        }
    }

    function closeSuccessModal() {
        setModify(false);
        if (window.location.href.includes('new')) {
            history.push(window.location.href.split('/').slice(0, -1).join('/'));
        }
    }

    return (
        <div>
            <NoteTitleWithModeSelector note={note} modify={modify} onChangeSwitch={onChangeSwitch}/>
            <link rel="stylesheet" href={"//cdn.quilljs.com/1.2.6/quill.snow.css"}/>
            <NoteSaveButton modify={modify} onClick={onClickSave}/>
            <ReactQuill className="quill-note-content" key={note.current.noteId} value={note.current.e}
                        readOnly={modify === false} onChange={onChangeNote}
                        modules={{toolbar: modify}}/>
            <Modal errorClosureAction={closeErrorModal} successClosureAction={closeSuccessModal}/>
        </div>
    );
}

export default Note;