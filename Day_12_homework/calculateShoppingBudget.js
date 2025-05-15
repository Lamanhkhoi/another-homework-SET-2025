function calculateShoppingBudget(listNeedToBuy) {
    let sum = 0;
    for ( let i = 0 ; i < listNeedToBuy.length ; i++){
        let unit = listNeedToBuy[i][0];
        let price = listNeedToBuy[i][1];
        sum = unit * price + sum;
        debugger;
    }
    return sum;
}
listNeedToBuy = [[2,20], [1,30], [4,10]];
console.log(calculateShoppingBudget(listNeedToBuy));
