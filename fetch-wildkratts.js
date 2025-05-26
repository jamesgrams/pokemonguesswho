const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://wildkratts.fandom.com/wiki/"
const SUFFIX = "";

const POKEMON = [
    "Martin",
    "Chris",
    "Aviva",
    "Koki",
    "Jimmy",
    "Zach",
    "Donita",
    "Dabio",
    "Gourmand",
    "Buster",
    "Paisley",
    "Zachbot",
    "Mannequin",
    "Rex",
    "Ellie",
    "Katie",
    "Nua",
    "Aidan",
    "Gavin",
    "Warren",
    "Jenny",
    "Ronan",
    "Javier",
    "Nolan",
    "Sani",
    "Evan",
    "Eden",
    "Ava",
    "Manuel",
    "Audrey",
    "Leo",
    "Scarlett",
    "Rose",
    "Karl",
    "Nina",
    "Leoni",
    "Leah",
    "Patricia",
    "Juma",
    "Yi",
    "Duyi",
    "Reporter",
    "Mala",
    "Kenny",
    "Steven",
    "Melissa"   
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
        if( fs.existsSync("docs/images/wildkratts/"+filename) ) continue;
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
        await downloadImage(file, "docs/images/wildkratts/"+filename);
        //pokemonList.push(pokemon);
        await new Promise( (resolve) => setTimeout(resolve, 1000) );
    }

    fs.writeFileSync("docs/wildkratts.json", JSON.stringify(POKEMON, null, 2));

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