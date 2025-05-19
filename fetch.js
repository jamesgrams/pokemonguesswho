const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://bulbapedia.bulbagarden.net/wiki/"
const SUFFIX = "_(Pokémon)";

const POKEMON = [
    "Gimmighoul",
    "Bayleef",
    "Dragonite",
    "Sableye",
    "Drifloon",
    "Onix",
    "Piplup",
    "Donphan",
    "Kricketot",
    "Slurpuff",
    "Pikachu",
    "Clefairy",
    "Slowpoke",
    "Pichu",
    "Sylveon",
    "Bidoof",
    "Mamoswine",
    "Gourgeist",
    "Popplio",
    "Greedent",
    //"Frost Rotom",
    "Chimchar",
    "Munchlax",
    "Mew",
    "Starly",
    "Gengar",
    //"Alolan Exeggutor"
    "Beedrill",
    "Phanpy",
    "Vaporeon",
    "Exeggutor",
    "Beartic",
    "Greninja",
    "Eevee",
    "Stufful",
    "Incineroar",
    "Chansey",
    "Mewtwo",
    "Altaria",
    "Geodude",
    "Phantump",
    "Chikorita",
    "Meowth",
    "Charizard",
    "Machop",
    "Skwovet",
    "Bulbasaur",
    "Shinx",
    "Turtwig",
    "Tepig",
    "Garbodor",
    "Vanilluxe",
    "Lucario",
    "Sentret",
    "Rattata",
    "Budew",
    "Zubat",
    "Steelix",
    "Wailord",
    "Meganium"
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
        if( fs.existsSync("public/images/"+filename) ) continue;
        let url = BASE + pokemon + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(".mw-file-description");
        await page.waitForTimeout(200);
        let file = await page.evaluate( () => {
            return document.querySelector(".mw-file-description img").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "public/images/"+filename);
        //pokemonList.push(pokemon);
        await page.waitForTimeout(1000);
    }

    fs.writeFileSync("public/list.json", JSON.stringify(POKEMON, null, 2));

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