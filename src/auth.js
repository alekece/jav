const fs = require('fs') 

module.exports.retrieveToken = function retrieveToken(){
    const buffer = fs.readFileSync('.jira-token')
    return buffer.toString().trim()
}
