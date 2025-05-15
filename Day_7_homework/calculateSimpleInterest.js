let principal = 5000000;
let rate = 0.012; // 1.2%
let time = 12; // 12 month
let amount = principal*(1 + rate * time);
console.log("Simple Interest:" + amount.toFixed(2));