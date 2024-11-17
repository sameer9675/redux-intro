import { createSlice } from "@reduxjs/toolkit";

/*
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit": //nothing but writing way which redux team suggest
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
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
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

//Action creator

export function deposit(amount, currency) {
  if (currency === "USD")
    return {
      type: "account/deposit",
      payload: amount,
    };

   ***
  //middleware thunk  -> perform that async action present in the below fxn before dispatching
  return async function (dispatch, getState) {
    // API call
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.app/latest?base=${currency}&symbols=${"USD"}`
    );
    const data = await res.json();
    const convertedAmount = (amount * data.rates.USD).toFixed(2);

    //return action
    dispatch({
      type: "account/deposit",
      payload: convertedAmount,
    });
  };
}

export function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}
**/

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

/**
 * once the dispatch is called it will come like this
 * account/deposit  -> action creator  (same as case we write in switch statement in reducer)
 * nameOfSlice/reducer
 */

const accountSlice = createSlice({
  name: "account", //name of the slice
  initialState: initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload; //direct mutating is possible
      state.isLoading = false
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      /** In prepare fxn we can take the argument and prepare the payload action for our reducer */
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state, action) {
      state.loanPurpose = "";
      state.balance -= state.loan;
      state.loan = 0;
    },
    convertingCurrency(state, action) {
        state.isLoading = true
    }
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions; // action creator  -> present in reducer object above

/** As thunk are automatically provided by modern tool kit */
export function deposit(amount, currency) {
    if (currency === "USD")
      return {
        type: "account/deposit",
        payload: amount,
      };
  
    //middleware thunk  -> perform that async action present in the below fxn before dispatching
    return async function (dispatch, getState) {
      // API call
      dispatch({ type: "account/convertingCurrency" });
      const res = await fetch(
        `https://api.frankfurter.app/latest?base=${currency}&symbols=${"USD"}`
      );
      const data = await res.json();
      const convertedAmount = (amount * data.rates.USD).toFixed(2);
  
      //return action
      dispatch({
        type: "account/deposit",
        payload: convertedAmount,
      });
    };
  }



export default accountSlice.reducer;

/**  IMP
 *
 *  For middleware we have -> create async thunk fxn (redux toolkit way of doing middleware)
 *
 * alernative and easy soln
 * Action creator fxn
 *
 */
