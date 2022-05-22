const ApiError = require('../errors/api-error');
const tokenService = require('../service/token-service');

module.exports = function(request, response, next){
    try{
        const authHeader = request.headers.authorization;
        if (!authHeader){
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = authHeader.split(' ')[1];
        if (!accessToken){
            return next(ApiError.UnauthorizedError());
        }   

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData){
            return next(ApiError.UnauthorizedError());
        }

        request.user = userData;
        next();
    }
    catch(e){
        return next(ApiError.UnauthorizedError());
    }
}