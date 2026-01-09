const db = require('../config/db.js')

async function findUserByPhone(phone) {
  const [rows] = await db.execute('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone])
  return rows[0]
}

module.exports = {
  findUserByPhone
}