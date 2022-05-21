const userService = require('../service/user-service');

class UserController{
    async registration(request, response, next){
        try{
            const {email, password} = request.body;
            const userData = await userService.registration(email, password);
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return response.json(userData);
        }
        catch(e){
            console.log(e);
        }
    }

    async login(request, response, next){
        try{

        }
        catch(e){

        }
    }

    async logout(request, response, next){
        try{

        }
        catch(e){

        }
    }

    async activate(request, response, next){
        try{

        }
        catch(e){

        }
    }

    async refresh(request, response, next){
        try{

        }
        catch(e){

        }
    }

    async getUsers(request, response, next){
        try{
            response.json(['123', '456']);
        }
        catch(e){

        }
    }
}

module.exports = new UserController();