function handleSumRequest(request, response, searchParams) { 
    const num1 = parseFloat(searchParams.get('num1'));
    const num2 = parseFloat(searchParams.get('num2'));

    if (isNaN(num1) || isNaN(num2)) {
        response.writeHead(400);
        response.end(JSON.stringify({
            error: "Invalid input data. 'num1' and 'num2' must be valid numbers."
        }));
    } else {
        const sum = num1 + num2;
        response.writeHead(200);
        response.end(JSON.stringify({
            num1: num1,
            num2: num2,
            sum: sum
        }));
    }
}

export default handleSumRequest;