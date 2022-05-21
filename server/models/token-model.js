const {Schema, model} = require('mongoose');

const TokenSсhema = new Schema({    
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
})

module.exports = model('Token', TokenSсhema);