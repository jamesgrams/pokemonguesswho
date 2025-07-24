function display( mode ) {
    let body = document.querySelector("body");
    let key = "pokemonSaved";
    let list = "pokemon.json";
    if( mode === "mario" ) {
        key = "marioSaved";
        list = "mario.json";
    } 
    if( mode === "sonic" ) {
        key = "sonicSaved";
        list = "sonic.json";
    }
    if( mode === "mickey" ) {
        key = "mickeySaved";
        list = "mickey.json";
    }
    if( mode === "wildkratts" ) {
        key = "wildkrattsSaved";
        list = "wildkratts.json";
    }
    if( mode === "may" ) {
        key = "maySaved";
        list = "may.json";
    }
    if( mode === "noddy" ) {
        key = "noddySaved";
        list = "noddy.json";
    }
    let saved = window.localStorage[key];
    if( saved ) {
        try {
            saved = JSON.parse(window.localStorage[key]);
        }
        catch(err) {
            saved = {};
        }
    }
    else saved = {};
    fetch(list)

        .then(response => response.json())
        .then(json => {
            let pokemonDiv = document.createElement("div");
            pokemonDiv.classList.add("card-holder");
            if( mode === "pokemon" ) {
                json.push("Alolan Exeggutor");
                json.push("Frost Rotom");
            }
            else if( mode === "mario" ) {
                json.push("Chef Bro");
            }
            json = json.sort();
            for( let pokemon of json ) {
                let card = document.createElement("div");
                card.classList.add("card");
                let img = document.createElement("img");
                img.setAttribute("src", "./images/" + mode + "/" + pokemon.toLowerCase() + ".png");
                let text = document.createElement("div");
                text.innerText = pokemon;

                card.appendChild(img);
                card.appendChild(text);

                card.onclick = function() {
                    if( img.getAttribute("data-src") ) {
                        img.setAttribute("src", img.getAttribute("data-src"));
                        img.removeAttribute("data-src");
                        delete saved[pokemon];
                    }
                    else {
                        img.setAttribute("data-src", img.getAttribute("src"));
                        img.setAttribute("src","./images/" + mode + "/default.jpg");
                        saved[pokemon] = true;
                    }
                    window.localStorage[key] = JSON.stringify(saved);
                }
                if( saved[pokemon] ) card.click();
                pokemonDiv.appendChild(card);
            }
            body.appendChild(pokemonDiv);

            document.querySelector("button").onclick = function() {
                if( window.confirm("Are you sure you want to reset the board?") ) { 
                    document.querySelectorAll(".card").forEach( function(el) {
                        if( el.querySelector("img").hasAttribute("data-src") ) el.click();
                    })
                }
            }
        });
}
