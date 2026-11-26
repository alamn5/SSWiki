/////////////////////////////////////////////////////
//for chapter select -- this is the part in index.html where it says js will inject options
const chapter = document.getElementById('chapter-select')
for (let i = 1; i < 231; i++) { //yo update this number when u add more chapter
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

        // Automatically update the chapter title when chapter is changed, on a different screen thats not index.html this helps changes
        chapter.addEventListener("change", () => {
            const selectedId = chapter.value;

            localStorage.setItem("selectedChapter", selectedId);
            displayChapter(selectedId);

            document.dispatchEvent(new Event("chapterChanged"));
        });

        //allow chapter selection on every page
        document.getElementById("chapter").addEventListener("submit", function(event) {
            event.preventDefault();

            const selectedId = chapter.value;

            localStorage.setItem("selectedChapter", selectedId);

            displayChapter(selectedId);

            document.dispatchEvent(new Event("chapterChanged")); //for updating on character detail page, we refernce this event

            //if(loadedCharacter){ //to update character when reloaded chapter
                //displayCharacterDetails(loadedCharacter);
            //}
        });
        // prev / next chapter buttons
        function changeChapter(step) {
            const newId = Number(chapter.value) + step;

            if (newId < 1 || newId > 500) return; // stay within the dropdown range # update this when u update chapters

            chapter.value = newId;                            // update the dropdown
            localStorage.setItem("selectedChapter", newId);   // remember it
            displayChapter(newId);                            // show it
            document.dispatchEvent(new Event("chapterChanged"));
        }

        const prevBtn = document.getElementById("prev-chapter");
        const nextBtn = document.getElementById("next-chapter");

        // these only exist on the home page, so check first
        if (prevBtn) prevBtn.addEventListener("click", () => changeChapter(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => changeChapter(1));


    })
    .catch(error => {
        console.error("Error loading chapters:", error);
    });

    export { chapter }; //need this in character details