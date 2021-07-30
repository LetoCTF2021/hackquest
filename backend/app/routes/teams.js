const { ObjectId } = require('mongodb');
const generatePassword = require('password-generator');

module.exports = function (app, db) {
    app.post('/teams', (req, res) => {
        try {
            let users = req.body
            db.collection('teams').deleteMany({})
            users = users.map(el => {
                return Object.assign({
                    score: 0,
                    password: generatePassword(),
                    solved: []
                }, el)
            })
            db.collection('teams').insertMany(users, (err, result) => {
                if (err) {
                    res.send({ 'error': 'Чет не так' })
                } else {
                    res.status(400).send("ok")
                }
            })
        } catch (err) {
            console.log(err)
            res.send({ 'error': 'Чет не так' })
        }
    })

    app.get('/teams', (req, res) => {
        try {
            let id = req.token;
            console.log(id)
            if (id) {
                db.collection('teams').findOne({
                    _id: ObjectId(id)
                }, (err, result) => {
                    if (!err) {
                        if (result) {
                            res.send({
                                name: result.name,
                                members: result.members,
                                solved: result.solved,
                                score: result.score
                             })
                        } else {
                            res.send({error: 'Нет такой комманды'})
                        }
                    } else {
                        console.log(err)
                        res.send({error: 'Чет не так'})
                    }
                })
                
            } else {
                res.send({
                    error: 'Нет токена'
                })
            }
        } catch (err) {
            console.log(err)
            res.send({ 'error': 'Чет не так' })
        }
    })
};