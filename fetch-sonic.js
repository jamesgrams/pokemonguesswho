const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://sonic.fandom.com/wiki/"
const SUFFIX = "";

const POKEMON = [
    "Sonic",
    "Big",
    "Knuckles",
    "Amy",
    "Cream",
    "Jet",
    "Vector",
    "Eggman",
    "Shadow",
    "Silver",
    "Bean",
    "Tails",
    "Blaze",
    "Charmy",
    "Zazz",
    "Metal Sonic",
    "Rouge",
    "Rosy",
    "Espio",
    "Snively Robotnik",
    "Mother Wisp",
    "Fang",
    "Bearanger",
    "Bartleby MontClair",
    "Bark",
    "Bike Chain Bandit",
    "Babylon Guardian",
    "Badniks",
    "Babylon Rouges",
    "Chiller"
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
        if( fs.existsSync("docs/images/sonic/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(".pi-image");
        await page.waitForTimeout(200);
        let file = await page.evaluate( () => {
            return document.querySelector(".pi-image img").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "docs/images/sonic/"+filename);
        //pokemonList.push(pokemon);
        await page.waitForTimeout(1000);
    }

    fs.writeFileSync("docs/sonic.json", JSON.stringify(POKEMON, null, 2));

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