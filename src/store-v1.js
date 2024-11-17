/** Redux Store */
/** Old way to writing redux -> now modern way is also there */
import { combineReducers, createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

const initialStateCustomer = {
  fullName: "",
  nationalId: "",
  createdAt: "",
};

//The goal of the reducer to calculate the new state based on the current state and on the received action
//Reducer are not allowed to modify the exsisting state and also not allowed to perform any async logic or any other side effect
function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit": //nothing but writing way which redux team suggest
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loanPurpose: "",
        loan: 0,
        balance: state.balance - state.loan,
      };
    default:
      return initialStateAccount;
  }
}

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalId: action.payload.nationalId,
        createdAt: action.payload.createdAt,
      };
    case "customer/updateName":
      return {
        ...state,
        fullName: action.payload.fullName,
      };
    default:
      return initialStateCustomer;
  }
}

// now on get state we will get an object like this
/**
 * {
    "account": {
        "balance": 300,
        "loan": 0,
        "loanPurpose": ""
    },
    "customer": {
        "fullName": "",
        "nationalId": "",
        "createdAt": ""
    }
}
 */
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(rootReducer);

//createStore -> always consider the root reducer so we have to combined all reducer
// const store = createStore(accountReducer);

//same as useReducer
// store.dispatch({
//   type: "account/deposit",
//   payload: 500,
// });

// console.log(store.getState()); // return the redux / current state

// store.dispatch({
//   type: "account/withdraw",
//   payload: 200,
// });

// console.log(store.getState());

// store.dispatch({
//   type: "account/requestLoan",
//   payload: {
//     amount: 1000,
//     purpose: "buy a car",
//   },
// });

// console.log(store.getState());

// store.dispatch({ type: "account/payLoan" });

// console.log(store.getState());

//store.subscribe -> automatically show the update on the screen

//Action creator

function deposit(amount) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}

function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}

function payLoan() {
  return { type: "account/payLoan" };
}

store.dispatch(deposit(500));
store.dispatch(withdraw(200));

function createCustomer(fullName, nationalId) {
  // we can write the createdAt logic in reducer but then it became side effect -> there should not be any side effect
  // inside reducer fxn
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalId, createdAt: new Date().toISOString() },
  };
}

function updateName(fullName) {
  return { type: "customer/updateName", payload: { fullName } };
}

store.dispatch(createCustomer("sameer", "7579"));

console.log(store.getState());
