const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://disney.fandom.com/wiki/"
const SUFFIX = "";

const POKEMON = [
    "Mickey",
    "Minnie",
    "Donald",
    "Daisy",
    "Pluto",
    "Goofy",
    "Pete",
    "Max",
    "Mortimer",
    "Chip",
    "Dale",
    "Clarabelle",
    "Scrooge McDuck",
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
        if( fs.existsSync("docs/images/mickey/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(".pi-image");
        await new Promise( (resolve) => setTimeout(resolve, 200) );
        let file = await page.evaluate( () => {
            return document.querySelector(".pi-image img").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "docs/images/mickey/"+filename);
        //pokemonList.push(pokemon);
        await new Promise( (resolve) => setTimeout(resolve, 1000) );
    }

    fs.writeFileSync("docs/mickey.json", JSON.stringify(POKEMON, null, 2));

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