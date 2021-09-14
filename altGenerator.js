const Leets = {
    'a': ['a', '4'],
    'b': ['b', '8', '6'],
    'c': ['c'],
    'd': ['d'],
    'e': ['e', '3'],
    'f': ['f', '7'],
    'g': ['g', '6'],
    'h': ['h', '4'],
    'i': ['i', '1', '9'],
    'j': ['j', '7', '9'],
    'k': ['k'],
    'l': ['l', '1'],
    'm': ['m'],
    'n': ['n'],
    'o': ['o', '0'],
    'p': ['p'],
    'q': ['q', '9'],
    'r': ['r'],
    's': ['s', '5'],
    't': ['t', '7'],
    'u': ['u'],
    'v': ['v'],
    'w': ['w'],
    'x': ['x'],
    'y': ['y'],
    'z': ['z', '5'],
    '0': ['0', 'o'],
    '1': ['1', 'i', 'l', '7'],
    '2': ['2', 'z'],
    '3': ['3', 'e'],
    '4': ['4', 'h', 'a'],
    '5': ['5', 's'],
    '6': ['6', 'b', 'g'],
    '7': ['7', 't', 'j', 'l'],
    '8': ['8', 'b'],
    '9': ['9', 'g']
};

exports.GenerateAlts = (user) => {
    let altNames;

    splitUser = user.split('');

    var splitLeet = [];
    splitUser.forEach(letter => {
        splitLeet.push(Leets[letter]);
    });

    console.log(splitLeet);
    
    let currentLeet = splitLeet.shift();
    altNames = RecursiveLeeter(currentLeet, splitLeet);

    console.log(`${altNames.length - 1} alts found for ${user}.`);

    return altNames;
}

function RecursiveLeeter(altNames, leetArray) {
    if (leetArray.length == 0) return altNames;

    let newAlts = [];
    let currentLeet = leetArray.shift();

    currentLeet.forEach(letter => {
        altNames.forEach(leet => {
            newAlts.push(leet + letter);
        })
    })

    return RecursiveLeeter(newAlts, leetArray);
}