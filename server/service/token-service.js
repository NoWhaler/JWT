const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService{
    generateTokens(payLoad){
        const accessToken = jwt.sign(payLoad, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {expiresIn: '15d'})
        return{
            accessToken,
            refreshToken
        }
    }
    async saveToken(userID, refreshToken){
        const tokenData = await tokenModel.findOne({user: userID})
        if (tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userID, refreshToken})
        return token;
    }
    
}

module.exports = new TokenService();