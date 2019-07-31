const initalAsyncData = {
	name: []
}
function asyncData(state = initalAsyncData, action) {
	switch(action.type) {
		case "request_success":
			return Object.assign({}, state, { name: action.data });
		default:
			return state;
	}
}
export default asyncData;