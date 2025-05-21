const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const BASE = "https://www.mariowiki.com/"
const SUFFIX = "";

const POKEMON = [
    "Mario",
    "Toad",
    "Donkey Kong",
    "Peach",
    "Yoshi",
    "Bowser",
    "Luigi",
    "Wario",
    "Waluigi",
    "Rosalina",
    "Daisy",
    "Toadette",
    "Goomba",
    "Cow",
    "Snowman",
    "Penguin",
    "Dolphin",
    "Boo",
    "King Boo",
    "Pauline",
    "Luma",
    "Ninji",
    "Chargin Chuck",
    "Poison Piranha Plant",
    "Piranha Plant",
    "Fire Piranha Plant",
    "Petey Piranha",
    "Nintendog",
    "Poochy",
    "Baby Yoshi",
    "Iggy",
    "Lemmy",
    "Larry",
    "Roy",
    "Morton",
    "Ludwig",
    "Wendy",
    "Bowser Jr.",
    "Kamek",
    "Conkdor",
    "Coin Coffer",
    "Para-Biddybud",
    "Buzzy Beetle",
    "Spiny",
    "Koopa Troopa",
    "Paratroopa",
    "Spike",
    "Foreman Spike",
    "Pianta",
    "Nabbit",
    "Cappy",
    "Tiara",
    "Noki",
    "Cookatiel",
    "Pokio",
    "Sherm",
    "Moe-Eye",
    "Jaxi",
    "Mollusque-Lanceur",
    "Mechawiggler",
    "Birdo",
    "Chain Chomp",
    "Bom-omb",
    "Bullet Bill",
    "Banzai Bill",
    "Plessie",
    "Cranky Kong",
    "Diddy Kong",
    "Dixie Kong",
    "Funky Kong",
    "Boom Boom",
    //"Chef Bro",
    "Fire Bro",
    "Hammer Bro",
    "Dry Bones",
    "Dry Bowser",
    "Fish Bone",
    "Red Bones",
    "Bone Piranha Plant",
    "Pom Pom"
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
        if( fs.existsSync("docs/images/mario/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector("#character,#species");
        await page.waitForTimeout(200);
        let file = await page.evaluate( () => {
            return document.querySelector("#character img,#species img").getAttribute("src");
        } );
        console.log(file);
        await downloadImage(file, "docs/images/mario/"+filename);
        //pokemonList.push(pokemon);
        await page.waitForTimeout(1000);
    }

    fs.writeFileSync("docs/mario.json", JSON.stringify(POKEMON, null, 2));

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