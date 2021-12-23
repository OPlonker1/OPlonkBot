import AltGenerator from './altGenerator';
import Database from './data/DataManager';

var Alts = null;

const BanExempt = ['oplonker1'];

export function Init() {
    Alts = Database.Read();
}

export function AddToWatchlist(user, reason) {
    let alt;

    alt = { BanReason: reason, AccountAlts: AltGenerator(user) };

    Alts.push(alt);

    Database.Write(Alts);

    return alt.AccountAlts.length - 1;
}

export function RmWatchlist(user) {
    let [isBan, index] = IsBanned(user);

    if (!isBan) return;
    Alts.splice(index);

    Database.Write(Alts);
}

export function IsBanned(username): [boolean, number] {
    let banned = false;
    let arrayIndex = -1;

    if (BanExempt.includes(username))
        return [banned, arrayIndex];

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

export function GetBannedUser(username) {
    let [isBanned, banIndex] = IsBanned(username);
    if (!isBanned) return null;

    return Alts[banIndex];
}

export default {
    Init,
    AddToWatchlist,
    RmWatchlist,
    IsBanned,
    GetBannedUser
}