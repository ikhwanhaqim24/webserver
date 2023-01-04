var remoteHost = process.env.DBHOST
var mongoPath = process.env.MONGOPATH
var mongoPort = process.env.REMOTEPORT
var useAtlas = process.env.ENABLEATLAS
var user, password, database = "onetimepad"

var mongoString = `mongodb://${user}:${password}@${remoteHost}:${mongoPort}/${database}`

if (!useAtlas) mongoPath = mongoString

module.exports = {
    PATH: mongoPath
    };