import Axios from 'axios';
import { takeEvery, call, put } from 'redux-saga/effects';

function* getAsyncData() {
	const data = yield call(Axios.get, "https://jsonplaceholder.typicode.com/users");
	const arrData = data.data;
	const arrUserName = [];
	for(let obj of arrData) {
		for(let key in obj) {
			if(key === "name") {
				arrUserName.push(obj[key]);
			}
		}
	}
	yield put({ type: "request_success", data: arrUserName });
}
function* watchSaga() {
	yield takeEvery("request_data", getAsyncData);
}

export default watchSaga;
