import {patientsApiUrl} from "../api/URLs";

import {
    ACTION_SET_FILTER_DOB,
    ACTION_SET_FILTER_FAMILY,
    ACTION_SET_FILTER_ID,
    ACTION_SET_PAGE_NUMBER,
    ACTION_SET_ROWS_PER_PAGE,
    ACTION_SET_SORTING_FIELD,
    ACTION_SET_SORTING_DIRECTION
} from "./reducerConstants";

const pagingState = {
    pageNumber: 0,
    rowsPerPage: 10
};

const filterState = {
    id: '',
    family: '',
    dob: ''
}

const sortingState = {
    field : 'id',
    direction: 'asc'
}

const pagingFilterSortingState = {
    paging: pagingState,
    filter: filterState,
    sorting: sortingState
}

const patientState = {
    ...pagingFilterSortingState,
    getPatientsUrl: getPatientsUrl(pagingFilterSortingState),
    patients: []
};

function getPatientsUrl(state) {
    let url = patientsApiUrl
        + "?page=" + state.paging.pageNumber
        + "&size=" + state.paging.rowsPerPage
        + "&sort=" + state.sorting.field + "," + state.sorting.direction
    ;
    if (!!state.filter.id) {
        url = url + "&id=" + state.filter.id;
    }
    if (!!state.filter.family) {
        url = url + "&family=" + state.filter.family;
    }
    if (!!state.filter.dob) {
        url = url + "&dob=" + state.filter.dob;
    }
    console.log("getPatientsUrl " + url);
    return url;
}

const patientReducer = (state = patientState, action) => {
    console.log("patientReducer with action " + action.type + " and payload " + action.payload);
    let updatedState;
    switch (action.type) {
        case ACTION_SET_PAGE_NUMBER :
            updatedState = {
                ...state,
                paging: {
                    ...state.paging,
                    pageNumber: action.payload
                }
            };
            break;

        case ACTION_SET_ROWS_PER_PAGE :
            updatedState = {
                ...state,
                paging: {
                    ...state.paging,
                    rowsPerPage: action.payload
                }
            };
            break;

        case ACTION_SET_FILTER_ID :
            updatedState = {
                ...state,
                filter: {
                    ...state.filter,
                    id: action.payload
                }
            };
            break;

        case ACTION_SET_FILTER_FAMILY :
            updatedState = {
                ...state,
                filter: {
                    ...state.filter,
                    family: action.payload
                }
            };
            break;

        case ACTION_SET_FILTER_DOB :
            updatedState = {
                ...state,
                filter: {
                    ...state.filter,
                    dob: action.payload
                }
            };
            break;

        case ACTION_SET_SORTING_FIELD :
            updatedState = {
                ...state,
                sorting: {
                    ...state.sorting,
                    field: action.payload
                }
            };
            break;

        case ACTION_SET_SORTING_DIRECTION :
            updatedState = {
                ...state,
                sorting: {
                    ...state.sorting,
                    direction: action.payload
                }
            };
            break;

        default :
            updatedState = state;
    }
    return {
        ...updatedState,
        getPatientsUrl: getPatientsUrl(updatedState)
    }
};

export default patientReducer;