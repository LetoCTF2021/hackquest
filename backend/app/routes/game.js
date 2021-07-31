const { ObjectId } = require('mongodb');

module.exports = function (app, db) {
    app.get('/questions', (req, res) => {
        try {
            let id = req.token;
            if (id) {
                 // взятие таска коммандой 
                db.collection('teams').findOne({
                    _id: ObjectId(id)
                }, (err, team) => {
                    db.collection('questions').find({}).toArray((err, quest) => {
                        const freeTask = quest.filter(el => {
                            const ids = team.solved.map(e => e.questId)
                            console.log(ids)
                            return !ids.toString().split(',').includes(el._id.toString())
                        })
                        if (freeTask.length > 0) {
                            let actualTask = freeTask[0]
                            freeTask.forEach(el => {
                                if (el.teams.length < actualTask.teams.length) {
                                    actualTask = el
                                }
                            })
                            // обозначаем, что таск взят
                            db.collection('questions').updateOne({ _id: actualTask._id }, {
                                $push: {
                                    teams: {
                                        $each: [team._id]
                                    }
                                }
                            })

                            db.collection('teams').updateOne({ _id: team._id }, {
                                $push: {
                                    solved: {
                                        $each: [{
                                            questId: actualTask._id,
                                            startTime: new Date(), // время взятия таска
                                            comePoint: 0, // время когда пришли на точку
                                            daration: 0, // сколько проходили игру
                                            taskTime: 0,
                                            score: null,
                                        }]
                                    }
                                }
                            })
                            
                            res.send({
                                descr: actualTask.descr,
                                name: actualTask.name,
                                score: 10,
                                coords: actualTask.coords,
                                startTime: new Date(), // время взятия таска
                                comePoint: 0,
                                daration: 0
                            })
                        } else {
                            res.send({
                                status: 'done'
                            }) 
                        }
                    })
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
    app.post('/flag', (req, res) => {
        let id = req.body.questId;
        let flag = req.body.flag
        if (flag && id) {
            db.collection('questions').findOne({
                _id: ObjectId(id),
                flag: flag
            }, (err, task) => {
                console.log(task)
                if (task) {
                    res.send({ status: 'ok' })
                    db.collection('questions').updateOne({ _id: ObjectId(id) }, {
                        $set: {
                            taskTime: new Date()
                        }
                    })
                } else {
                    res.send({ status: 'neok' })
                }
                return
            })
        } else {
            res.send({ status: 'ne ok' })
            return
        }
    })
    app.get('/actualQuest', (req, res) => {
        try {
            let id = req.token;
            if (id) {
                 // взятие таска коммандой 
                db.collection('teams').findOne({
                    _id: ObjectId(id)
                }, (err, team) => {
                    const lastTask = team.solved[team.solved.length - 1]
                    console.log(lastTask)
                    if (lastTask) {
                        db.collection('questions').findOne({ _id: lastTask.questId }, (err, quest) => {
                            res.send({
                                questId: quest._id,
                                descr: quest.descr,
                                name: quest.name,
                                score: lastTask.score,
                                coords: quest.coords,
                                startTime: new Date(), // время взятия таска
                                comePoint: lastTask.comePoint,
                                daration: lastTask.daration
                            })
                        })
                    } else {
                        res.send('пусто')
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
    app.put('/questions', (req, res) => {
        try {
            let id = req.token;
            let questId = req.body.questId
            delete req.body.questId
            if (id && questId) {
                for (key in req.body) {
                    let keyName = "solved.$." + key
                    db.collection('teams').updateOne({ _id: ObjectId(id), "solved.questId": ObjectId(questId) }, {
                        $set: {
                            [keyName] : req.body[key]
                        }
                    })
                }
                res.send('ok')
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