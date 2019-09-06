const INITIAL_STATE = {id : 0, username : '', role : '', cookie : false, loading : false, msg : '',showId : false}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'TESTING':
            return {...INITIAL_STATE, username : 'TEST'}
        case 'LOGIN_SUCCESS':
            return {...INITIAL_STATE, username : action.payload.a, id : action.payload.c, role : action.payload.b, cookie:true}
        case 'IS_LOADING':
            return {...INITIAL_STATE, loading : true}
        case 'USERNAME_UDAH_ADA':
            return {...INITIAL_STATE, msg : action.hasil}
        case 'KEEP_LOGIN':
            return{...INITIAL_STATE, username : action.payload.username, id : action.payload.id, role : action.payload.role, cookie:true}
        case 'RESET_USER':
            return {...INITIAL_STATE}
        case 'TOGGLE_ID':
            return {...state, showId : !state.showId}
        default:
            return state
    }
}