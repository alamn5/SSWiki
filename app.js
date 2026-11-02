const sidebar = document.getElementById('sidebar')
const toggleButton = document.getElementById('toggle-btn')

function toggleSideBar(button){
   sidebar.classList.toggle('close') //on off with toggle <-- close is 'made' with the css 
   //toggleButton.classList.toggle('rotate')
   sidebar.getElementsByClassName('show')
}

function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('show') //sibling is for adjacent elements, so next element in the toggle menu on the same level
    //button.classList.toggle('rotate')

    if(sidebar.classList.contains('close')){
        sidebar.classList.toggle('close')
        //toggleButton.classList.toggle('rotate')
    }
}

/////////////////////////////////////////////////////
//for chapter select -- this is the part in index.html where it says js will inject options
const chapter = document.getElementById('chapter-select')
for (let i = 1; i < 100; i++) {
  //create a new <option> element
  const option = document.createElement('option');
  //iterating over i value and assigning that to option
  option.value = i; //we use this value for our data parsing
  option.textContent = i; //this is the text thats printed to the user for chapter selection
  //append it to the dropdown
  chapter.appendChild(option);
}
/////////////////////////////////////////////////////

//

///////////// for grabbing chapter-title from chapters.json
chapter.value = localStorage.getItem("selectedChapter") || "1";
//loads the previously selected chapter, or Chapter 1 by default

fetch("jsondata/chapters.json")
    .then(response => response.json())
    .then(data => {
        const chapters = data.chapters;

        const titleElement = document.getElementById("chapter-title");
        const summaryElement = document.getElementById("chapter-summary");

        // Load saved chapter content if this page has the content elements
        function displayChapter(chapterId) {
            const chapterData = chapters.find(
                ch => ch.chapter_id === Number(chapterId)
            );

            if (!chapterData) return;

            if (titleElement) {
                titleElement.textContent = chapterData.chapter_title;
            }

            if (summaryElement) {
                summaryElement.innerHTML = chapterData.chapter_summary;
            }
        }

        //display the saved chapter when the page loads
        displayChapter(chapter.value);

        //allow chapter selection on every page
        document.getElementById("chapter").addEventListener("submit", function(event) {
            event.preventDefault();

            const selectedId = chapter.value;

            localStorage.setItem("selectedChapter", selectedId);

            displayChapter(selectedId);

            if(loadedCharacter){ //to update character when reloaded chapter
                displayCharacterDetails(loadedCharacter);
            }
        });
    })
    .catch(error => {
        console.error("Error loading chapters:", error);
    });
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
                    characterText.textContent = "No characters found.";
                    return;
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
const characterInfo = document.getElementById("character-info");

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

                displayCharacterDetails(character);
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
///end of character details info/////////////////////////////////////