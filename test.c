#include <stdio.h>

int calculateSum( int rows, int cols, int array[rows][cols]);
void printMatrix( int rows, int cols, int array[rows][cols]);

int main(){
    int m, n,i,j;
    printf("Enter the number of rows (m):= ");scanf("%d",&m);
    printf("Enter the number of columns (n):= ");scanf("%d",&n);
    int array[m][n];
    printf("Enter the elements of the %dx%d array:\n",m,n);
    for ( i = 0; i < m; i++){
        for ( j = 0; j < n; j++){
            printf("Element [%d][%d]: ",i+1,j+1);
            scanf("%d", &array[i][j]);
        }
    }

    printf("\nMatrix:\n");
    printMatrix(m,n,array);
    int sum = calculateSum(m,n,array);
    printf("\nSum of all elements: %d", sum);
    return 0;
}

int calculateSum( int rows, int cols, int array[rows][cols]){
    int sum = 0,i,j;
    for ( i = 0; i < rows; i++){
        for ( j = 0; j < cols; j++){
            sum += array[i][j];
        }
    }
    return sum;
}

void printMatrix( int rows, int cols, int array[rows][cols]){
    int i,j;
    for ( i = 0; i < rows; i++){
        for ( j = 0; j < cols; j++){
            printf("%d\t",array[i][j]);
        }
        printf("\n");
    }
}