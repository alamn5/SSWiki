
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
            document.getElementById("chapter").addEventListener("change", () => {
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

