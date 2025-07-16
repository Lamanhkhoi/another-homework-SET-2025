const datasource = require('../datasources/file.datasource.js');

async function getAll(userId) {
    const data = await datasource.read();
    const user = data.users.find((u) => u.id === userId);

    if (user) {
        return user.todos;
    } else {
        return []; 
    }
}

async function create(userId, text) {
    const data = await datasource.read();
    const user = data.users.find((u) => u.id === userId);

    if (!user) {
        return null;
    }

    const newTodo = {
        id: Date.now(),
        text: text, 
        completed: false,
    };
    user.todos.push(newTodo);

    await datasource.write(data);
    return newTodo;
}

async function update(userId, todoId, updates) {
    const data = await datasource.read();
    const user = data.users.find((u) => u.id === userId);
    if (!user) {
        return null; 
    }

    const todoToUpdate = user.todos.find((t) => t.id === todoId);
    if (!todoToUpdate) {
        return null; 
    }

    if (updates.text !== undefined) {
        todoToUpdate.text = updates.text;
    }

    if (updates.completed !== undefined) {
        todoToUpdate.completed = updates.completed;
    }

    await datasource.write(data);
    return todoToUpdate;
}

async function remove(userId, todoId) {
    const data = await datasource.read();
    const user = data.users.find((u) => u.id === userId);
    if (!user) {
        return false; 
    }

    const todoIndex = user.todos.findIndex((t) => t.id === todoId);
    
    if (todoIndex !== -1) {
        user.todos.splice(todoIndex, 1);
        await datasource.write(data);
        return true; 
    }

    return false;
}

module.exports = {
    getAll,
    create,
    update,
    remove,
};