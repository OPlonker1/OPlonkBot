const AltGenerator = require('./altGenerator');
const Database = require('./dataManager');

module.exports.Init = Init;
module.exports.AddToWatchlist = AddToWatchlist;
module.exports.RmWatchlist = RmWatchlist;
module.exports.IsBanned = IsBanned;
module.exports.GetBannedUser = GetBannedUser;

var Alts = null;

function Init() {
    Alts = Database.Read();
}

function AddToWatchlist(user, reason, AddAlts = true) {
    let alt;
    if (AddAlts) {
        alt = { BanReason: reason, AccountAlts: AltGenerator(user) };
    } else {
        alt = { BanReason: reason, AccountAlts: user };
    }
    Alts.push(alt);

    Database.Write(Alts);

    return alt.AccountAlts.length - 1;
}

function RmWatchlist(user) {
    let [isBan, index] = IsBanned(user);
    
    if (!isBan) return;
    Alts.splice(index);

    Database.Write(Alts);
}

function IsBanned(username) {
    let banned = false;
    let arrayIndex = -1;

    if (Alts.length === 0) return [banned, arrayIndex];
    
    Alts.forEach(user => {
        user.AccountAlts.forEach(alt => {
            if (username.includes(alt)) {
                banned = true;
                arrayIndex = Alts.indexOf(user);
            }
        })
    });

    return [banned, arrayIndex];
}

function GetBannedUser(username) {
    let [isBanned, banIndex] = IsBanned(username);
    if (!isBanned) return null;

    return Alts[banIndex];
}