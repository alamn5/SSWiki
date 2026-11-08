import { chapter } from "./chapter.js";
import "./sidebar.js";

////////////////////////////////////////////////////////////////////////////////////////
//characters

const characterText = document.getElementById("character-text");
const characterButtons = document.querySelectorAll("#character-select-bar button[data-letter]");
if(characterButtons.length > 0){

    fetch("jsondata/characters.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load characters.json");
            }
            return response.json();
        })
        .then(data => {
            const characters = data.characters;
            let selectedLetter = "all";

            function displayCharacters(letter = "all") {
                const currentChapter = Number(
                    localStorage.getItem("selectedChapter") || "1"
                );

                //if the selected chapter is greater then the characters introduced date, then put it in this list
                const availableCharacters = characters.filter(character =>Number(character.chapter_introduced) <= currentChapter);

                //sorting the characters alphabetically
                availableCharacters.sort((a,b) => a.character_name.localeCompare(b.character_name));

                //filter by the selected letter
                let filteredCharacters = [];
                if (letter === "all"){ //if we selected all then the filtered characters is just every available character
                    filteredCharacters = availableCharacters;
                }
                else{ //otherwise we filter accoding to that letter
                    filteredCharacters = availableCharacters.filter(character =>
                        character.character_name
                            .toUpperCase()
                            .startsWith(letter)
                    );
                }

                characterText.innerHTML = "";

                if (filteredCharacters.length === 0) {
                    characterText.textContent = "No characters with " + selectedLetter + " found.";
                    letter = "all"
                    filteredCharacters = availableCharacters;
                    //return;
                }

                //this part is to put the alphabetical heading above each character section / divide them alphabetically
                let currentLetter = "";
                filteredCharacters.forEach(character => {
                    const firstLetter = character.character_name[0].toUpperCase(); //grabbing first letter of the character

                    if(firstLetter !== currentLetter){//then we add a heading
                        currentLetter = firstLetter;

                        const heading = document.createElement("h2");
                        heading.textContent = currentLetter + ":";
                        
                        heading.classList.add("letter-heading");
                        characterText.appendChild(heading);
                    }

                //here we acc create an h2 per character
                    const entry = document.createElement("div"); //create new div
                    entry.classList.add("character-entry"); //for css styling 
                    entry.type = "button";

                    const name = document.createElement("h2");
                    name.textContent = character.character_name;

                    entry.appendChild(name);
                    
                    entry.addEventListener("click", () =>{
                        console.log("Clicked:", character.character_name); //checking if it works in console
                        localStorage.setItem("selectedCharacter", character.character_name); //for the detail page we are saving which character name was picked
                        window.location.href = "character_details.html" //open the character detail page when u click a character name (has to be under localstorage)
                    });
                    
                    characterText.appendChild(entry);
                });
            }

            // Alphabet filter buttons
            characterButtons.forEach(button => {
                button.addEventListener("click", () => {
                    selectedLetter = button.dataset.letter;
                    displayCharacters(selectedLetter);
                });
            });

            //refresh the character list when a chapter is selected
            document.getElementById("chapter").addEventListener("submit", () => {
                setTimeout(() => {
                    displayCharacters(selectedLetter);
                }, 0);
            });

            //display characters on initial page load
            displayCharacters();
        })
        .catch(error => {
            console.error("Error loading characters:", error);

            if (characterText) {
                characterText.textContent = "Could not load characters.";
            }
        });
}

/////////////////////////////////////////////////////////////////////
//ok so we've generated each character, we need to make it so they actually do something when clicked
//recall we're using --> localStorage.getItem("selectedCharacter");
const selectedCharacter = localStorage.getItem("selectedCharacter");
const characterInfo = document.getElementById("character-history");

console.log("Selected character:", selectedCharacter);
console.log("Character info element:", characterInfo);

let loadedCharacter = null;
if(characterInfo) {
    if (!selectedCharacter) { characterInfo.textContent = "No character was selected.";} 
    else {
        fetch("jsondata/character_details.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not load character_details.json");
                }
                return response.json();
            })
            .then(data => {
                console.log("Character details JSON:", data);

                const character = data.character_details.find(
                    c => c.cid === selectedCharacter
                );
                loadedCharacter = character;

                if (loadedCharacter) { //display overview right away when character is selected
                    displayOverview(loadedCharacter);
                }

                console.log("Matched character:", character);

                if (!character) {
                    characterInfo.textContent =
                        "Character not found: " + selectedCharacter;
                    return;
                }

                //get the character image elemnt
                const characterImage = document.getElementById("character-image");

                characterImage.src = character.image;
                characterImage.alt = character.cid + "image";

                //displayCharacterDetails(character);
            })
            .catch(error => {
                console.error("Error loading character details:", error);
                characterInfo.textContent =
                    "There was an error loading character details.";
            });
    }
}


function displayCharacterDetails(character){
    characterInfo.innerHTML="";

    character.details.filter(detail => detail.chapter <=  Number(chapter.value)).forEach(detail => {
        const chapterDiv = document.createElement("div");
        chapterDiv.classList.add("chapter-detail");

        const chapterTitle = document.createElement("h2");
        chapterTitle.textContent =
            "Chapter " + detail.chapter;

        const chapterInfo = document.createElement("p");
        chapterInfo.textContent = detail.text;

        chapterDiv.appendChild(chapterTitle);
        chapterDiv.appendChild(chapterInfo);

        characterInfo.appendChild(chapterDiv);
    });
}

document.addEventListener("chapterChanged", () => { //referencing chapter.js when we dispatched the event, lets us reload on the character page if the chapter is changed
    if (loadedCharacter) {
        displayCharacterDetails(loadedCharacter);
    }
});

const overviewButton = document.querySelectorAll("#character-menu-text")[0];//this grabs overview button 
const historyButton = document.querySelectorAll("#character-menu-text")[1]; //this grabs chapter history button 
const memoriesButton = document.querySelectorAll("#character-menu-text")[2]; //this grabs memories button 
const abilitiesButton = document.querySelectorAll("#character-menu-text")[3]; //this grabs abilties button
const galleryButton = document.querySelectorAll("#character-menu-text")[4]; //this grabs gallery button

if (historyButton) {
    historyButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayCharacterDetails(loadedCharacter); //actually displaying character history when its clicked
        }
    });
}

/////////////////////////////// 4 func wip
function displayOverview(character) {
    characterInfo.textContent = "Overview information coming soon...";
}

function displayMemories(character) {
    characterInfo.textContent = "Memories information coming soon...";
}

function displayAbilities(character) {
    characterInfo.textContent = "Abilities information coming soon...";
}

function displayGallery(character) {
    characterInfo.textContent = "Gallery information coming soon...";
}

/////////////////////// 3 func if theyre clicked
if (overviewButton) {
    overviewButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayOverview(loadedCharacter);
        }
    });
}

if (historyButton) {
    historyButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayCharacterDetails(loadedCharacter);
        }
    });
}

if (memoriesButton) {
    memoriesButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayMemories(loadedCharacter);
        }
    });
}

if (abilitiesButton) {
    abilitiesButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayAbilities(loadedCharacter);
        }
    });
}

if (galleryButton) {
    galleryButton.addEventListener("click", () => {
        if (loadedCharacter) {
            displayGallery(loadedCharacter);
        }
    });
}

const menuItems = document.querySelectorAll("#character-menu-text");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

// start with Overview selected
menuItems[0]?.classList.add("active");
///end of character details info/////////////////////////////////////