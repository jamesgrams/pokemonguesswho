const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://americanfootball.fandom.com/wiki/"
const SUFFIX = "";

const POKEMON = [
    "Arizona Cardinals",
    "Atlanta Falcons",
    "Baltimore Ravens",
    "Buffalo Bills",
    "Carolina Panthers",
    "Cincinnati Bengals",
    "Chicago Bears",
    "Cleveland Browns",
    "Dallas Cowboys",
    "Denver Broncos",
    "Detroit Lions",
    "Green Bay Packers",
    "Houston Texans",
    "Indianapolis Colts",
    "Jacksonville Jaguars",
    "Kansas City Chiefs",
    "Miami Dolphins",
    "Minnesota Vikings",
    "New England Patriots",
    "New Orleans Saints",
    "New York Giants",
    "New York Jets",
    "Las Vegas Raiders",
    "Philadelphia Eagles",
    "Pittsburgh Steelers",
    "Los Angeles Chargers",
    "Seattle Seahawks",
    "San Francisco 49ers",
    "Los Angeles Rams",
    "Tampa Bay Buccaneers",
    "Tennessee Titans",
    "Washington Commanders"
]

async function run() {
    
    
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({width:2000,height:2000});
    //let pokemonList = [];
    for( let pokemon of POKEMON ) {
        if( !pokemon ) continue;
        let filename = pokemon.toLowerCase() + ".png";
        if( fs.existsSync("docs/images/nfl/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(".infobox img[data-image-name*=logo], .infobox img[alt*=logo]");
        await new Promise( (resolve) => setTimeout(resolve, 800) );
        let file = await page.evaluate( () => {
            return document.querySelector(".infobox img[data-image-name*=logo], .infobox img[alt*=logo]").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "docs/images/nfl/"+filename);
        //pokemonList.push(pokemon);
        await new Promise( (resolve) => setTimeout(resolve, 1000) );
    }

    fs.writeFileSync("docs/nfl.json", JSON.stringify(POKEMON, null, 2));

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