import axios from "axios";
import history from "./history";
// import { push } from "react-router-redux";
import { put } from "redux-saga/effects";
import { client_id, domain_url } from "../utils/authConfig"

export function showInitials(name) {
	let nameChange = ""
	let wordCount = name.split(' ')
	if (wordCount.length > 1) {
		nameChange = wordCount[0].charAt(0) + wordCount[1].charAt(0)
		name = nameChange.toUpperCase()
	}
	else {
		nameChange = wordCount[0].charAt(0) + wordCount[0].charAt(1)
		name = nameChange.toUpperCase()
	}
	return name
}


export function* errorHandler(error, errorType) {
	if (error.response) {
		if (error.response.status === 401) {
			// clearLocalStorage();
		} else if (error.response.status === 400) {
			yield put({
				type: errorType,
				error: error.response.data.message ? error.response.data.message : error.response.data.error
			})
		} else if (error.response.status === 403) {
			yield put(push({ pathname: '/error403', state: { error: error.response.data.message ? error.response.data.message : error.response.data.error } }));
		} else if (error.response.status === 404) {
			yield put(push("/error404"));
		} else {
			yield put({ type: errorType, error: error.response.data.message });
		}
	} else {
		yield put({ type: errorType, error: error.message ? error.message : error });
	}
}


export function logoutHandler() {
	const config = getHeaders();
	axios
		.post(`${window.API_URL}api/v1/logout`, {}, config)
		.then(function (response) {
			clearLocalStorage();
		})
		.catch(function (error) {
			if (error.response.status == 401) {
				clearLocalStorage();
			} else if (error.response.status == 403) {
				history.push({ pathname: '/error403', state: { error: error.response.data.message ? error.response.data.message : error.response.data.error } })
			}
		});
}

export function clearLocalStorage() {
	let url = `${domain_url}/logout?client_id=${client_id}`
	let internalUser = sessionStorage.getItem('internalUser')
	sessionStorage.clear();
	localStorage.clear();
	if (internalUser == "true") {
		history.push("/login");
	}
	else {
		window.location.href = url
	}
}

export function reduceToUnitBases(value) {
	if (value == 0) {
		return '0';
	} else if (value > 999) {
		let updatedValue = value / 1000;
		return (updatedValue.toFixed(1) + ' kW');
	}
	else {
		return value + ' W'
	}
}