let countdownMinutes = 5;
console.log("Start tracking your order...");
console.log("Status: Driver is picking up the order at the restaurant.");

const deliveryInterval = setInterval(() => {
    countdownMinutes--;
    if ( countdownMinutes <= 0 ){
        console.log("Order delivered!");
        clearInterval(deliveryInterval);
    } else {
        if ( countdownMinutes >= 4 ){
            console.log("Status: Driver is on his way to you.");
        } else if ( countdownMinutes >= 2 ){
            console.log("Status: The driver is coming soon, please prepare to receive the goods.");
        } else {
            console.log("Status: Driver has arrived!");
        }
        console.log(`-> Estimated time remaining: ${countdownMinutes} minutes.`);
    }
    
}, 3000);