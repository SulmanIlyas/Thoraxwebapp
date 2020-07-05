const Account = require('./account');

module.exports = function (app) {
    app.use('/api/account', Account);
}