const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../errors/api-error');
const userModel = require('../models/user-model');

class UserService{
    async registration(email, password){
        const candidate = await UserModel.findOne({email});
        if (candidate){
            throw ApiError.NotValidRequest(`User with email address ${email} already exists `)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{...tokens, user: userDto}
    }    

    async login(email, password){
        const user = await UserModel.findOne({email})
        if (!user){
            throw ApiError.NotValidRequest('User with such email was not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            throw ApiError.NotValidRequest('Wrong password');
        }        
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{...tokens, user: userDto}
    }    

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if (!user){
            throw ApiError.NotValidRequest('Invalid validation link');
        }
        user.isActivated = true;
        await user.save();
    }    

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();            
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const findTokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !findTokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{...tokens, user: userDto}
    }

    async getUsers(){
        const users = await UserModel.find();
        return users;
    }
    
}

module.exports = new UserService();