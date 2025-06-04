const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const SONIC_BASE = "https://sonic.fandom.com/wiki/";
const MARIO_BASE = "https://www.mariowiki.com/";
const FROZEN_BASE = "https://disney.fandom.com/wiki/";
const BANJO_BASE = "https://banjokazooie.fandom.com/wiki/";
const SUFFIX = "";

const BANJO_CHARACTERS = [
    "Banjo",
    "Kazooie",
    "Grunty",
    "Klungo",
    "Mumbo Jumbo",
    "Clanker",
    "Nipper",
    "Tooty"
];
const FROZEN_CHARACTERS = [
    "Elsa",
    "Anna",
    "Kristoff",
    "Olaf",
    "Sven",
    "Hans",
    "Grand Pabbie",
    "Agnarr",
    "Iduna",
    "Marshmallow",
    "Erik and Francis",
    "Erik and Francis",
    "Duke of Weselton",
];
const MARIO_CHARACTERS = [
    "Mario",
    "Toad",
    "Donkey Kong",
    "Peach",
    "Yoshi",
    "Bowser",
    "Luigi",
    "Waluigi",
    "Wario",
    "Rosalina",
    "Daisy",
    "Pauline",
    "Boo",
    "King Boo",
    "Banzai Bill",
    "Bullet Bill",
    "Diddy Kong",
    "Dixie Kong",
    "Tiny Kong",
    "King K Rool",
    "Kremling",
    "Ninji",
    "Chargin Chuck",
    "Topper",
    "Spewart",
    "Rango",
    "Hariet",
    "Madame Broode",
    "Chain Chomp",
    "Cappy",
    "Tiara",
    //"Chef Bro",
    "Fire Bro",
    "Hammer Bro",
    "Koopa",
    "Paratroopa",
    "Goomba",
    "Dry Bones",
    "Dry Bowser",
    "Boom Boom",
    "Pom Pom",
    "Spike",
    "Foreman Spike",
    "Pianta",
    "Noki",
    "Toadsworth",
    "Nintendog",
    "Poochy",
    "Baby Yoshi",
    "Bowser Jr",
    "Birdo",
    "Luma",
    "Larry",
    "Lemmy",
    "Morton",
    "Wendy",
    "Roy",
    "Ludwig",
    "Iggy",
    "King Bob-omb",
    "Bob-omb",
    "Super Star",
    "Biddybud",
    "Para-biddybud",
    "Dolphin",
    "Cow",
    "Penguin",
    "Snowman",
    "Plessie",
    "Petey Piranha",
    "Fire Piranha Plant",
    "Bone Piranha Plant",
    "Poison Piranha Plant",
    "Piranha Plant",
    "Lakitu",
    "Nabbit",
    "Conkdor",
    "Coin Coffer",
    "Red Bones"
]

const SONIC_CHARACTERS = [
    "Knuckles",
    "Mighty",
    "Marine",
    "Vector",
    "Charmy",
    "Cheese",
    "Silver",
    "Shadow",
    "Eggman",
    "Zazz",
    "Sticks",
    "Tikal",
    "Froggy",
    "Espio",
    "Cream",
    "Rouge",
    "Blaze",
    "Metal Sonic",
    "Tails",
    "Sonic",
    "Wave",
    "Bark",
    "Bean",
    "Fang",
    "Jet",
    "Ray",
    "Big",
    "Amy"
]
const POKEMON = [...BANJO_CHARACTERS,...MARIO_CHARACTERS,...SONIC_CHARACTERS,...FROZEN_CHARACTERS];

async function run() {
    
    
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    //let pokemonList = [];
    for( let pokemon of POKEMON ) {
        if( !pokemon ) continue;
        let selector = ".pi-image";
        let imageSelector = ".pi-image img";
        let BASE;
        if( BANJO_CHARACTERS.includes(pokemon) ) {
            BASE = BANJO_BASE;
        }
        if( MARIO_CHARACTERS.includes(pokemon) ) {
            BASE = MARIO_BASE;
            selector = "#character,#species,.infobox";
            imageSelector = "#character img,#species img,.infobox img";
        }
        if( FROZEN_CHARACTERS.includes(pokemon) ) {
            BASE = FROZEN_BASE;
        }
        if( SONIC_CHARACTERS.includes(pokemon)) {
            BASE = SONIC_BASE;
        }

        let filename = pokemon.toLowerCase() + ".png";
        if( fs.existsSync("docs/images/may/"+filename) ) continue;
        let url = BASE + pokemon.replace(/\s/g, "_") + SUFFIX;
        console.log(url);
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 300000
        });
        await page.waitForSelector(selector);
        await new Promise( (resolve) => setTimeout(resolve, 200) );
        let file = await page.evaluate( (imageSelector) => {
            return document.querySelector(imageSelector).getAttribute("src");
        }, imageSelector );
        console.log(file);
        await downloadImage(file, "docs/images/may/"+filename);
        //pokemonList.push(pokemon);
        await new Promise( (resolve) => setTimeout(resolve, 1000) );
    }

    fs.writeFileSync("docs/may.json", JSON.stringify(POKEMON, null, 2));

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