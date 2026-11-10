import { chapter } from "./chapter.js";
/////////////////////////////////////////////////////////////////////
//setting up and loading the characters
const selectedCharacter = localStorage.getItem("selectedCharacter");
const characterInfo = document.getElementById("character-history");

console.log("Selected character:", selectedCharacter);
console.log("Character info element:", characterInfo);

let loadedCharacter = null;
let currentTab = "overview";

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

                console.log("Matched character:", character);

                if (!character) {
                    characterInfo.textContent =
                        "Character not found: " + selectedCharacter;
                    return;
                }
                //display overview right away (the first button)
                displayOverview(loadedCharacter);

                //get the character image elemnt
                const characterImage = document.getElementById("character-image");
                //if there is an image
                if(characterImage){ 
                    characterImage.src = `character_images/${character.cid}.png`;
                    characterImage.alt = character.cid + "image";
                }

            })
            .catch(error => {
                console.error("Error loading character details:", error);
                characterInfo.textContent =
                    "There was an error loading character details.";
            });
    }
}

/////////////okay so the specific character has been selected and loaded, now we are setting up the display functions in that page 
///this section has 5 functions, display history, overview, memories, abilities, and gallery
function displayHistory(character){
    characterInfo.innerHTML="";

    //only grab details up to our current chapter selected
    character.details.filter(detail => detail.chapter <=  Number(chapter.value)).forEach(detail => {
       
        //so far this is only in the history tab!
        const chapterDiv = document.createElement("div");
        chapterDiv.classList.add("chapter-detail");

        const chapterTitle = document.createElement("h2"); //this is the chapter (in black + white text)
        chapterTitle.textContent =
            "Chapter " + detail.chapter; 

        const chapterInfo = document.createElement("p"); //this is the little detail under the chapter 
        chapterInfo.textContent = detail.text;

        chapterDiv.appendChild(chapterTitle);
        chapterDiv.appendChild(chapterInfo);
        characterInfo.appendChild(chapterDiv);
    });
}


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

///////////////////////////////////////////////////////////////////
//if the chapter is changed on the detail page, stay on that tab and update it!
document.addEventListener("chapterChanged", () => {
    if (loadedCharacter && currentTab === "history") {
        displayHistory(loadedCharacter);
    }
});


////////////////////////////////////////////////////////////////////
//character menu buttons
const overviewButton = document.querySelectorAll("#character-menu-text")[0];//this grabs overview button 
const historyButton = document.querySelectorAll("#character-menu-text")[1]; //this grabs chapter history button 
const memoriesButton = document.querySelectorAll("#character-menu-text")[2]; //this grabs memories button 
const abilitiesButton = document.querySelectorAll("#character-menu-text")[3]; //this grabs abilties button
const galleryButton = document.querySelectorAll("#character-menu-text")[4]; //this grabs gallery button

const menuItems = document.querySelectorAll("#character-menu-text"); //this grabs all of the above 5 buttons, we use it for css styling below

///////////////////////////////////////////////
//our 5 button event clicks
if (overviewButton) {
    overviewButton.addEventListener("click", () => {
        currentTab = "overview";

        if (loadedCharacter) {
            displayOverview(loadedCharacter);
        }
    });
}

if (historyButton) {
    historyButton.addEventListener("click", () => {
        currentTab = "history";

        if (loadedCharacter) {
            displayHistory(loadedCharacter);
        }
    });
}

if (memoriesButton) {
    memoriesButton.addEventListener("click", () => {
        currentTab = "memories";

        if (loadedCharacter) {
            displayMemories(loadedCharacter);
        }
    });
}

if (abilitiesButton) {
    abilitiesButton.addEventListener("click", () => {
        currentTab = "abilities";

        if (loadedCharacter) {
            displayAbilities(loadedCharacter);
        }
    });
}

if (galleryButton) {
    galleryButton.addEventListener("click", () => {
        currentTab = "gallery";

        if (loadedCharacter) {
            displayGallery(loadedCharacter);
        }
    });
}

//////////////////////////
//for css styling, so that when a button is pressed, we add 'active' so it displays diff color
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});
// start with Overview selected
menuItems[0]?.classList.add("active");
///end of character details info/////////////////////////////////////