const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://noddy.fandom.com/wiki/"
const SUFFIX = "";

const POKEMON = [
    "Noddy",
    "Bumpy dog",
    "Clockwork Mouse",
    "Martha Monkey",
    "Miss Fluffy Cat",
    "Mr. Jumbo",
    "Mr. Wobblyman",
    "Mr. Plod",
    "Big Ears",
    "Sly",
    "Gobbo",
    "Dinah Doll",
    "Sally Skittle",
    "Sam Skittle",
    "Tessie Bear",
    "Master Tubby Bear",
    "Miss Pink Cat"
];

async function run() {
    
    
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    //let pokemonList = [];
    for( let pokemon of POKEMON ) {
        if( !pokemon ) continue;
        let filename = pokemon.toLowerCase() + ".png";
        if( fs.existsSync("docs/images/noddy/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(".pi-image, .thumbimage");
        await new Promise( (resolve) => setTimeout(resolve, 200) );
        let file = await page.evaluate( () => {
            return document.querySelector(".pi-image img, .thumbimage").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "docs/images/noddy/"+filename);
        //pokemonList.push(pokemon);
        await new Promise( (resolve) => setTimeout(resolve, 1000) );
    }

    fs.writeFileSync("docs/noddy.json", JSON.stringify(POKEMON, null, 2));

    browser.close();
}

async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    fs.writeFile(filename, response.data, (err) => {
        if (err) throw err;
        console.log('Image downloaded successfully!');
    });
}

run();