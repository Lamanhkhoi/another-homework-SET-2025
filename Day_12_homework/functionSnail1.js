function snail(list) {
    let finalList = [];
    while(list.length){
        debugger;
        finalList.push(...list.shift());
        for (let i = 0 ; i < list.length; i++){
            finalList.push(list[i].pop());
        }
        finalList.push(...(list.pop() || []).reverse());
        for (let i = list.length -1 ; i > 0 ; i-- ) {
            finalList.push(list[i].shift());
        }
    
    }
    return finalList

}
list = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]];
console.log(snail(list))