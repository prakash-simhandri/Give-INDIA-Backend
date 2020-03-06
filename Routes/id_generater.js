const now = new Date();
const date = require('date-and-time');

function ID() {
    let unique_Id = "",
        alphabet = "qwertyuiopasdfghjklzxcvbnm1098657324ABCDEFGHIJKLMNOPQRSTUVWXY";
    for (var i = 0; i < 15; i++) {
        unique_Id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));

    }
    return unique_Id

}
function Data() {
    return (date.format(now, 'YYYY/MM/DD'))
}
module.exports = { ID, Data }