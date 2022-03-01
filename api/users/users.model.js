const db = require('../../db-config')

function find() {
    return db('users')
}

function findById(id) {
    return db('users')
    .where('id', id)
    .first()
}

function findByUsername(usernam) {
    return db('users')
    .where('username', username)
}

function validatePassword(password) {
    return db('users')
    .where('password', password)
}

async function create(user) {
    const id = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    find,
    findById,
    findByUsername,
    validatePassword,
    create,
}