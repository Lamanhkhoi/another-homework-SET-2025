function checkRestaurant() {
    console.log("1. Checking restaurant availability...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/1')
        .then (response => {
            if (!response.ok) throw new Error('Network response was not ok for restaurant');
            return { 
                status: 'available',
                messages: 'Restaurant is open. '   
            }
        });
}

function processPayment() {
    console.log("2. Processing payment...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/2')
        .then (response => {
            if (!response.ok) throw new Error('Network response was not ok for payment');
            return {
                status: 'success',
                messages: 'Payment successful.'
            }
        });
}

function assignDriver() {
    console.log("3. Assigning a driver...");
    return fetch('https://685e86a17b57aebd2af9c460.mockapi.io/orderSteps/3')
        .then (response => {
            if (!response.ok) throw new Error('Network response was not oke for driver');
            return {
                status: 'assigned',
                driverName: 'khoi',
                eta: '15 minutes'
            }
        })
        
}