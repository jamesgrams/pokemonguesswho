function display() {
    let body = document.querySelector("body");
    let saved = window.localStorage.saved;
    if( saved ) {
        try {
            saved = JSON.parse(window.localStorage.saved);
        }
        catch(err) {
            saved = {};
        }
    }
    else saved = {};
    fetch("./list.json")

        .then(response => response.json())
        .then(json => {
            let pokemonDiv = document.createElement("div");
            pokemonDiv.classList.add("card-holder");
            json.push("Alolan Exeggutor");
            json.push("Frost Rotom");
            json = json.sort();
            for( let pokemon of json ) {
                let card = document.createElement("div");
                card.classList.add("card");
                let img = document.createElement("img");
                img.setAttribute("src", "./images/" + pokemon.toLowerCase() + ".png");
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
                        img.setAttribute("src","./images/pokeball.jpg");
                        saved[pokemon] = true;
                    }
                    window.localStorage.saved = JSON.stringify(saved);
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

display();