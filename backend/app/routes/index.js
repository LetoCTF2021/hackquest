// routes/index.js
const teams = require('./teams')
const auth = require('./auth')
const game = require('./game')
module.exports = function(app, db) {
  teams(app, db)
  auth(app, db)
  game(app, db)
  // Тут, позже, будут и другие обработчики маршрутов 
};