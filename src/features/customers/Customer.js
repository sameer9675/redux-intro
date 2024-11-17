import React from "react";
import { useSelector } from "react-redux";

function Customer() {
  const customer = useSelector((store) => store.customer.fullName); // .customer is the key which is used during combinig reducers

  return <h2>👋 Welcome, {customer}</h2>;
}

export default Customer;
