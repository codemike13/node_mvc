const User = require('../models/Users')

module.exports = {
    findAllUsers: (params, callback) => {
        User.find(params, (err, users) => {
            if (err) { callback(err, null) }
            else { callback(null, users) }
        })
    }
}