var remoteHost = process.env.DBHOST
var mongoPath = process.env.MONGOPATH
var mongoPort = process.env.DBPORT
var useAtlas = process.env.ENABLEATLAS
var user, password, database = "onetimepad"
var userLogin = `${user}:${password}@`

var mongoString = `mongodb://${remoteHost}:${mongoPort}/${database}`
var mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }

if (!useAtlas || useAtlas === 'false') {
    mongoPath = mongoString
    if (process.env.SSL === 'true') {
        mongoOptions.ssl = true
        mongoOptions.sslValidate = true
        mongoOptions.sslCA = process.env.CERTCA
        mongoOptions.sslKey = process.env.CERTKEY
        mongoOptions.sslCert = process.env.CERTKEY
    }
}

module.exports = {
    PATH: mongoPath,
    mongoOptions
    };