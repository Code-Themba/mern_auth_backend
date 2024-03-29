const mongoose = require('mongoose');

module.exports = (async function () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connection To ${conn.connection.name}.db Successful.`.green);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();