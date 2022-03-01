const server = require('./api/server')
require('dotenv').config()

const PORT = process.env.PORT || 9000

server.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
})