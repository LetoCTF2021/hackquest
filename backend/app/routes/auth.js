module.exports = function (app, db) {
  app.post('/loginGame', async (req, res) => {
    try {
      db.collection('teams').findOne({
        name: req.body.username,
        password: req.body.password
      }, (err, result) => {
        if (result) {
          res.send({
            token: result._id
          })
        } else {
          res.send({error: 'Неверный логин или пароль'})
        }
       })
    } catch (err) {
      console.log(err)
      res.send('Что-то идет не так')
  
    }
  })
}