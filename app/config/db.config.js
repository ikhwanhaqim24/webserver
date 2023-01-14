var remoteHost = process.env.DBHOST
var mongoPath = process.env.MONGOPATH
var mongoPort = process.env.REMOTEPORT
var useAtlas = process.env.ENABLEATLAS
var user, password, database = "onetimepad"
var userLogin = `${user}:${password}@`

var mongoString = `mongodb://${remoteHost}:${mongoPort}/${database}`

if (!useAtlas || useAtlas === 'false') mongoPath = mongoString

module.exports = {
    PATH: mongoPath
    };