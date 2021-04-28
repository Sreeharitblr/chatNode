const db = require('../db')
const msgdb = db.msgdb;

exports.createMsg = async (req, res) => {
    console.log(req.body)
    let user = await msgdb.create({
        id: req.body.id,
        msg: req.body.msg        
    })
    res.send(user)
}

exports.getMag = async (req, res) => {
    console.log("req");

    let msg = await msgdb.findAll()
    res.send(msg)
}
// exports.getMag = async (req, res) => {
//     console.log(req.query);

//     let msg = await msgdb.findOne({ where: req.query.id })
//     res.send(msg)
// }

exports.updateUser = async (req, res) => {
    console.log(req.query)
    let user = await msgdb.update({ address: req.query.address }, {
        where: {
            _id: req.query._id,
        }
    })
    res.send(user)
}

exports.deleteUser = async (req, res) => {
    console.log(req.query)
    let user = await msgdb.destroy({
        where: {
            id: req.query.id,
        }
    })
    if (user)
        res.send({ message: "User deleted" })
    else
        res.send({ message: "No user found" })
}
