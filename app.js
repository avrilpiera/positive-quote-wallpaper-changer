// modules
import { setWallpaper, getWallpaper } from 'wallpaper';
import download from 'image-downloader';
import gm from 'gm'
import promptSync from 'prompt-sync';
const prompt = promptSync();
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { createCanvas, loadImage, registerFont } from 'canvas'
registerFont('fonts/Lucida Sans Unicode.ttf', { family: 'Lucida Sans Unicode' })

// menu for each part of the program
var menu = [ // menu array where all the options are stored
    [
        'Add a quote', // option 1
        'Change wallpaper' // option 2
    ],
    [
        'Red',
        'Orange',
        'Yellow',
        'Green',
        'Blue',
        'Pink',
        'Purple'
    ],
    [
        '#ff2b1c',
        '#ffb866',
        '#fffa66',
        '#91ff66',
        '#91e9ff',
        '#ff91ed',
        '#af91ff'
    ],
    [
        'Choose quote',
        'Use random quote'
    ]
]


function startText() {
    console.clear();
    console.log()
    console.log()
    console.log('POSITIVE WALLPAPER QUOTES <3')
    console.log('                         - avril')
    console.log('Right click to paste')
    console.log('CTRL + C to quit')
    console.log('---------------------------------')
    console.log()
}


// get quotes
function getQuotes() {
    try {
        var data = fs.readFileSync('quotes.json', 'utf8'); // read quotes from file
    }
    catch (err) {
        return err
    }
    return data
}

function addQuote() {
    startText()
    var quote = prompt('Type your quote: ')
    console.log('Your quote is: ' + quote)
    console.log('If you want to change this quote, change it on the quotes.json file')
    var data = getQuotes();
    var quotes = eval(data);
    quotes.push(quote)

    if (quote != null) {
        fs.writeFile('quotes.json', JSON.stringify(quotes), function (err) {
            if (err) { return err }
        })
    }

    console.log('Quote added, start the program again to change the wallpaper')
}

// get random quote
function loadQuote() {
    var data = getQuotes() // get quotes from file
    var quotes = eval(data) // convert text to js code
    var randomNumber = Math.floor(Math.random() * quotes.length); // get a random number between 0 and the length of the array
    var quote = quotes[randomNumber]; // select a quote from the random index
    return quote
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// create the image
function createImage(color, colorChoice) {
    startText()
    var choice = loadMenu(3)
    if (choice == 1) {
        var text = prompt('Type quote: ')
    }
    else {
        var text = loadQuote()
    }

    var textArray = text.split(' ')
    var quoteText = ''
    textArray.forEach(item => {
        quoteText = quoteText + item
    });

    var colorName = menu[1][colorChoice - 1]
    var filename = quoteText + colorName;
    var path = __dirname + '/wallpapers/' + filename + '.png'

    var canvas = createCanvas(1280, 720)
    var ctx = canvas.getContext('2d')

    ctx.font = '40px Lucida Sans Unicode'
    ctx.fillText(text, 640, 360)

    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    var out = fs.createWriteStream(path)
    var stream = canvas.createPNGStream()
    stream.pipe(out)

    changeWallpaper(path)
}


async function changeWallpaper(path) {
    await sleep(2000)
    await setWallpaper(path);
}

function changeBackground() {
    startText()
    console.log('Color Choice')
    console.log()
    var colorChoice = loadMenu(1)
    var color = menu[2][colorChoice - 1];
    createImage(color, colorChoice);
}

// load menu function
function loadMenu(index) { // load menu
    for (let i = 0; i < menu[index].length; i++) { // for each option in the menu
        const option = menu[index][i];
        console.log('[' + (i + 1).toString() + '] - ' + option) // console log with the format [i] - option
    }
    console.log()
    var choice = prompt(' >> ')
    return choice
}



// MAIN PROGRAM

function mainProgram() {
    startText()
    var choice = loadMenu(0)
    if (choice == 1) { // if add quote is selected
        addQuote()
    }
    else if (choice == 2) {
        changeBackground()
    }
    else {
        process.exit(1)
    }
}

mainProgram()