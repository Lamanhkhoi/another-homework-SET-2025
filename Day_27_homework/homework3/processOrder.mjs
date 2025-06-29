function checkRestaurant() {
    console.log("1. Checking restaurant availability...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/1')
        .then (response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for restaurant');   
            }
            return response.json();
        });    
}

function processPayment() {
    console.log("2. Processing payment...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/2')
        .then (response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for payment');
            }
            return response.json();
        });
}

function assignDriver() {
    console.log("3. Assigning a driver...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/3')
        .then (response => {
            if (!response.ok) {
                throw new Error('Network response was not oke for driver');
            }
            return response.json();
        });
        
}

async function handleOrder() {
    console.log("--- Starting New Order ---");
        try {
            const restaurantData = await checkRestaurant();
            console.log(`=> ${restaurantData.status}`);
            if (restaurantData.status !== 'available') {
                throw new Error('Restaurant is closed.');
            }

            const paymentData = await processPayment();
            console.log(`=> ${paymentData.status}`);
            if (paymentData.status !== 'success'){
                throw new Error('Payment failed.');
            }

            const driverData = await assignDriver();
            console.log(`=> Driver ${driverData.status} is on the way!`);
            console.log("--- Order Completed Successfully! ---");
        } catch (error) {
            console.error("--- (Async/Await) Order Failed ---");
            console.error(`Error: ${error.message}`);
        } finally {
            console.log("--- (Async/Await) End of Order Process --- \n");
        }
}

handleOrder();