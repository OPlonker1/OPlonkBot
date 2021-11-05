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

const types = {
    constant: 'constant',
    regular: 'regular',
    variant: 'variant'
};

const varLeets = {
    'a': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    '0': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
};

module.exports = CreateAlts;

function CreateAlts(username) {
    let alts;
    if (username.includes('[') || username.includes('(') || username.includes('{'))
        alts = varAltGenerator(username);
    else
        alts = GenerateAlts(username);
    
    return alts;
}

function GenerateAlts(user) {
    let altNames;

    splitUser = user.split('');

    var splitLeet = [];
    splitUser.forEach(letter => {
        splitLeet.push(Leets[letter]);
    });
    
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

function varAltGenerator(username) {
    let result = [];
    let altObjects = AltObjectifier(username);
    
    let altParts = [];
    for (let i = 0; i < altObjects.length; i++) {
        let temp;
        object = altObjects[i];
        
        if (object['type'] === types.constant)
            temp = object['word'];
        else if (object['type'] === types.regular)
            temp = altGenerator.GenerateAlts(object['word']);
        else if (object['type'] === types.variant)
            temp = varLeeter(object['word']);

        altParts.push(temp);
    }

    let starts = altParts.shift();
    result = RecursiveLeeter(starts, altParts);

    return result;
}

function AltObjectifier(username) {
    let step1 = username.split('');
    let index = [];

    for (let i = 0; i < step1.length; i++) {
        if (step1[i] === '{' || step1[i] === '}' || step1[i] === '(' || step1[i] === ')' || step1[i] === '[' || step1[i] === ']')
            index.push(i);
    }

    let step2 = [];
    for (let i = 0; i < index.length; i += 2) {
        step2.push(username.slice(index[i], index[i + 1]));
    }

    let step3 = [];
    step2.forEach(word => {
        if (word[0] === '{')
            step3.push({ 'type': types.constant, 'word': [word.slice(1, word.length)] });
        else if (word[0] === '[')
            step3.push({ 'type': types.variant, 'word': word.slice(1, word.length) });
        else if (word[0] === '(')
            step3.push({ 'type': types.regular, 'word': word.slice(1, word.length) });
    });

    return step3;
}

function varLeeter(word) {
    let letters = word.split('');
    let leets = [];

    letters.forEach(letter => {
        if (isNaN(letter)) {
            leets.push(varLeets['a']);
        } else {
            leets.push(varLeets['0']);
        }
    })

    let current = leets.shift();
    return RecursiveLeeter(current, leets);
}