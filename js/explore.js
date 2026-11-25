
const ranksButton = document.getElementById("ranks-button");
const memoriesButton = document.getElementById("memories-button");
const creaturesButton = document.getElementById("nightmare-creatures-button");

const rankLists = document.getElementById("rank-lists");


function loadCategory(category) {

    fetch("jsondata/glossary.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load glossary.json");
            }

            return response.json();

        })

        .then(data => {

            //clear previous information
            rankLists.innerHTML = "";

            let currentClassification = "";
            let currentList = null;

            //get the selected category
            data[category].forEach(item => {

                // Check if classification changes
                if (item.classification !== currentClassification) {

                    const section = document.createElement("div");
                    section.classList.add("rank-section");

                    const heading = document.createElement("h2");
                    heading.textContent = item.classification;

                    currentList = document.createElement("ul");

                    section.appendChild(heading);
                    section.appendChild(currentList);

                    rankLists.appendChild(section);

                    currentClassification = item.classification;
                }

                //create an entry
                const entry = document.createElement("li");
                entry.textContent = item.name;

                currentList.appendChild(entry);

            });

        })

        .catch(error => {
            console.error("Error loading category:", error);
        });

}


// Button event listeners, rn we have 3 but will add more
ranksButton.addEventListener("click", () => {
    loadCategory("ranks");
});

memoriesButton.addEventListener("click", () => {
    loadCategory("memories");
});

creaturesButton.addEventListener("click", () => {
    loadCategory("nightmare_creatures");
});
