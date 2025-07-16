const userRepository = require('../repositories/user.repository.js');

async function register(email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if ( existingUser ){
        return{
            success: false,
            message: 'Email had used!',
        };
    }

    const newUser = await userRepository.createUser(email, password);
    const { password: _, ...userInfo } = newUser;

    return {
        success: true,
        message: 'Register success!',
        data: userInfo,
    };
}

async function login(email, password) {
    const user = await userRepository.findByEmailAndPassword(email,password);
    if (!user){
        return {
            success: false,
            message: 'Incorrect login information!',
        };
    }

    const { password: _, ...userInfo } = user;
    return {
        success: true,
        message: 'Login success!',
        data: userInfo,
    };
}

async function resetPassword(reset, newPassword) {
    const updatedUser = await userRepository.resetPassword(email, newPassword);
    if (!updatedUser){
        return {
            success: false,
            message: 'Email was not existed!',
        };
    }

    return{
        success: true,
        message: 'Password had updated success!',
    };
}

module.exports = {
    register,
    login,
    resetPassword,
};