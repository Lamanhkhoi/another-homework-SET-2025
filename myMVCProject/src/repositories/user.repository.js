const datasource = require('../datasources/file.datasource');

async function findByEmail(email) {
    const data = await datasource.read();
    return data.users.find((user) => user.email === email);
}

async function findByEmailAndPassword(email, password) {
    const data = await datasource.read();
    return data.users.find(
        (user) => user.email === email && user.password === password
    );
}

async function createUser(email, password) {
    const data = await datasource.read();
    const newUser = {
        id: Date.now(),
        email,
        password,
        managerment: 'false',
        todos: [],
    };
    data.user.push(newUser);
    await datasource.write(data)
    return newUser;
}

async function resetPassword(email, password) {
    const data = await datasource.read();
    const userIndex = data.users.findIndex((user) => user.email === email);

    if (userIndex !== -1){
        data.users[userIndex].password = newPassword;
        await datasource.write(data);
        return data.users[Index];
    }
    return null;
}

module.exports = {
    findByEmail,
    findByEmailAndPassword,
    createUser,
    resetPassword,
}