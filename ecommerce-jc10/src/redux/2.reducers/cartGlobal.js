const INITIAL_STATE = {qty : 0}

export default (state = INITIAL_STATE,action) => {
    switch(action.type) {
        case 'QTY' :
            return{...state, qty:action.payload.qty}
            default :
            return state
    }
}