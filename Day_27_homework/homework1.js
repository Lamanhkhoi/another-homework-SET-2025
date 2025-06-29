console.log("Order placed");
function updateOrderStatus(){
    setTimeout(() => {
        console.log("Your order will be ready in 3 minutes");
    }, 3000);
}
updateOrderStatus()
console.log("Waiting for update...");