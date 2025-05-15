function snail(snailMatrix) {
    const finalList=[];
    let top = 0;
    let bottom = snailMatrix.length - 1;
    let left = 0;
    let right = snailMatrix[0].length - 1;

    while (top <= bottom && left <= right) {
        for (let i = left ; i <= right ; i++ ) {
            finalList.push(snailMatrix[top][i]);
        }
        top++;

        for (let i = top ; i <= bottom ; i++) {
            finalList.push(snailMatrix[i][right]);
        }
        right--;

        for (let i = right ; i >= left ; i--) {
            finalList.push(snailMatrix[bottom][i]);
        }
        bottom--;

        for (let i = bottom ; i >= top ; i--) {
            finalList.push(snailMatrix[i][left]);
        }
        left++;
    }

    return finalList
}
const snailMatrix2 = [[1, 2, 3, 4], 
            [5, 6, 7, 8], 
            [9, 10, 11, 12], 
            [13, 14, 15, 16]];

const snailMatrix = [[1, 2, 3],
             [4, 5, 6],
             [7, 8, 9],
             [10, 11, 12]];

const snailMatrix1 = [[1, 2, 3, 4],
             [5, 6, 7, 8],
             [9, 10, 11, 12]];

console.log(snail(snailMatrix));