
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

                if (category === "memories") {
                    const memoryLayout = document.createElement("div");
                    memoryLayout.classList.add("memory-layout");

                    const memoryList = document.createElement("ul");
                    memoryList.classList.add("memory-list");

                    const memoryDetails = document.createElement("div");
                    memoryDetails.classList.add("memory-details");

                    const placeholder = document.createElement("p");
                    placeholder.textContent = "Select a memory to view its details.";
                    memoryDetails.appendChild(placeholder);

                    data.memories.forEach(memory => {
                        const entry = document.createElement("li");
                        const button = document.createElement("button");
                        button.type = "button";
                        button.classList.add("memory-entry");
                        button.textContent = memory.name;

                        button.addEventListener("click", () => {
                            memoryList.querySelectorAll(".memory-entry").forEach(item => {
                                item.classList.remove("active");
                            });
                            button.classList.add("active");

                            memoryDetails.innerHTML = "";

                            const title = document.createElement("h2");
                            title.textContent = memory.name;
                            memoryDetails.appendChild(title);

                            if (!memory.details || memory.details.length === 0) {
                                const noDetails = document.createElement("p");
                                noDetails.textContent = "No description details are available.";
                                memoryDetails.appendChild(noDetails);
                            } else {
                                memory.details.forEach(detail => {
                                    const detailBlock = document.createElement("div");
                                    detailBlock.classList.add("memory-detail");

                                    const chapter = document.createElement("span");
                                    chapter.classList.add("memory-detail-chapter");
                                    //chapter.textContent = `Chapter ${detail.chapter}`;

                                    const text = document.createElement("p");
                                    text.textContent = detail.text;

                                    detailBlock.appendChild(chapter);
                                    detailBlock.appendChild(text);

                                    if (detail.owner) {
                                        const owner = document.createElement("p");
                                        owner.classList.add("memory-owner");
                                        owner.textContent = `Owner: ${detail.owner}`;
                                        detailBlock.appendChild(owner);
                                    }

                                    memoryDetails.appendChild(detailBlock);
                                });
                            }
                        });

                        entry.appendChild(button);
                        memoryList.appendChild(entry);
                    });

                    memoryLayout.appendChild(memoryList);
                    memoryLayout.appendChild(memoryDetails);
                    rankLists.appendChild(memoryLayout);
                    return;
                }

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
