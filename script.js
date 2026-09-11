const moods = {
    happy: {
        emoji: "😊",
        label: "Happy",
        message: "you seem to be having a lovely day ♡"
    },

    calm: {
        emoji: "😌",
        label: "Calm",
        message: "there's something peaceful about today"
    },

    excited: {
        emoji: "🤭",
        label: "Excited",
        message: "something seems to be making you smile ✨"
    },

    sad: {
        emoji: "🥺",
        label: "Sad",
        message: "it's okay to have softer days ♡"
    },

    angry: {
        emoji: "😤",
        label: "Angry",
        message: "you've got some feelings to let out"
    },

    tired: {
        emoji: "😴",
        label: "Tired",
        message: "maybe today deserves a little rest"
    },

    anxious: {
        emoji: "🫠",
        label: "Anxious",
        message: "take things one little step at a time"
    },

    loved: {
        emoji: "💗",
        label: "Loved",
        message: "your heart feels a little full today"
    }
};


let currentUser = "";
let diaryName = "";
let selectedMood = "";


// ELEMENTS

const setupScreen = document.getElementById("setupScreen");
const diaryApp = document.getElementById("diaryApp");

const userName = document.getElementById("userName");
const diaryNameInput = document.getElementById("diaryName");

const startButton = document.getElementById("startButton");
const skipButton = document.getElementById("skipButton");
const resetButton = document.getElementById("resetButton");

const welcomeText = document.getElementById("welcomeText");

const entryDate = document.getElementById("entryDate");
const entryTitle = document.getElementById("entryTitle");
const entryContent = document.getElementById("entryContent");

const saveButton = document.getElementById("saveButton");
const characterCount = document.getElementById("characterCount");

const currentMood = document.getElementById("currentMood");
const moodMessage = document.getElementById("moodMessage");

const reflectionText = document.getElementById("reflectionText");
const reflectButton = document.getElementById("reflectButton");

const entriesList = document.getElementById("entriesList");
const searchInput = document.getElementById("searchInput");


// DATE

function today() {
    return new Date().toISOString().split("T")[0];
}

entryDate.value = today();


// STORAGE

function storageKey() {
    return `pastelDiary_${currentUser}`;
}

function getEntries() {
    return JSON.parse(localStorage.getItem(storageKey())) || [];
}

function saveEntries(entries) {
    localStorage.setItem(storageKey(), JSON.stringify(entries));
}


// SETUP

startButton.addEventListener("click", () => {

    const name = userName.value.trim();
    const diary = diaryNameInput.value.trim();

    currentUser = name || "friend";
    diaryName = diary || "pastel diary";

    localStorage.setItem(
        "pastelDiaryUser",
        JSON.stringify({
            name: currentUser,
            diary: diaryName
        })
    );

    openDiary();
});


skipButton.addEventListener("click", () => {

    currentUser = "friend";
    diaryName = "pastel diary";

    openDiary();
});


function openDiary() {

    setupScreen.classList.add("hidden");
    diaryApp.classList.remove("hidden");

    welcomeText.textContent = diaryName;

    loadDashboard();
}


// LOAD PREVIOUS USER

function loadSavedUser() {

    const saved = JSON.parse(
        localStorage.getItem("pastelDiaryUser")
    );

    if (!saved) return;

    currentUser = saved.name;
    diaryName = saved.diary;

    openDiary();
}


// MOODS

document.querySelectorAll(".mood").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".mood")
            .forEach(m => m.classList.remove("selected"));

        button.classList.add("selected");

        selectedMood = button.dataset.mood;

        currentMood.textContent =
            moods[selectedMood].emoji +
            " " +
            moods[selectedMood].label;

        moodMessage.textContent =
            moods[selectedMood].message;
    });

});


// CHARACTER COUNT

entryContent.addEventListener("input", () => {

    const count = entryContent.value.length;

    characterCount.textContent =
        `${count} characters`;

});


// SAVE ENTRY

saveButton.addEventListener("click", () => {

    const content = entryContent.value.trim();

    if (!content) {
        alert("write something first ♡");
        return;
    }

    const entries = getEntries();

    const entry = {

        id: Date.now(),

        date: entryDate.value,

        title:
            entryTitle.value.trim() ||
            "untitled thoughts",

        content,

        mood:
            selectedMood ||
            "calm"

    };

    entries.unshift(entry);

    saveEntries(entries);

    entryTitle.value = "";
    entryContent.value = "";

    characterCount.textContent = "0 characters";

    document
        .querySelectorAll(".mood")
        .forEach(m => m.classList.remove("selected"));

    selectedMood = "";

    currentMood.textContent = "not selected";
    moodMessage.textContent =
        "how are you feeling today?";

    loadDashboard();

    alert("your thoughts have been saved ♡");

});


// DASHBOARD

function loadDashboard() {

    const entries = getEntries();

    updateStats(entries);
    updateStreak(entries);
    renderEntries(entries);
    renderGraph(entries);
    updateHappyCount(entries);

}


// STATS

function updateStats(entries) {

    document.getElementById("entryCount")
        .textContent = entries.length;

    const totalCharacters =
        entries.reduce(
            (total, entry) =>
                total + entry.content.length,
            0
        );

    document.getElementById("totalCharacters")
        .textContent = totalCharacters;

}


// HAPPY COUNT

function updateHappyCount(entries) {

    const happy =
        entries.filter(
            entry => entry.mood === "happy"
        ).length;

    document.getElementById("happyCount")
        .textContent = happy;
}


// STREAK

function updateStreak(entries) {

    if (!entries.length) {

        document.getElementById("streak")
            .textContent = 0;

        return;
    }

    const dates = [
        ...new Set(
            entries.map(entry => entry.date)
        )
    ].sort().reverse();

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {

        const current =
            new Date(dates[i]);

        const previous =
            new Date(dates[i + 1]);

        const difference =
            (current - previous) /
            (1000 * 60 * 60 * 24);

        if (difference === 1) {
            streak++;
        } else {
            break;
        }

    }

    document.getElementById("streak")
        .textContent = streak;
}


// GRAPH

function renderGraph(entries) {

    const graph =
        document.getElementById("moodGraph");

    graph.innerHTML = "";

    const latest =
        entries.slice(0, 7).reverse();

    if (!latest.length) {

        graph.innerHTML =
            `<p class="empty-state">
                your mood garden will grow here 🌷
            </p>`;

        return;
    }

    latest.forEach(entry => {

        const wrapper =
            document.createElement("div");

        wrapper.className = "graph-item";

        const height =
            Math.max(
                15,
                Math.min(
                    100,
                    entry.content.length / 2
                )
            );

        wrapper.innerHTML = `

            <div
                class="graph-bar"
                style="height:${height}%"
                title="${moods[entry.mood]?.label || entry.mood}"
            ></div>

            <span class="graph-label">
                ${entry.date.slice(5)}
            </span>

        `;

        graph.appendChild(wrapper);

    });

}


// ENTRIES

function renderEntries(entries) {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const filtered =
        entries.filter(entry =>

            entry.title
                .toLowerCase()
                .includes(search)

            ||

            entry.content
                .toLowerCase()
                .includes(search)

        );


    if (!filtered.length) {

        entriesList.innerHTML = `

            <div class="empty-state">

                <span>🌸</span>

                <p>
                    no little memories found.
                </p>

            </div>

        `;

        return;
    }


    entriesList.innerHTML = filtered.map(entry => {

        const mood =
            moods[entry.mood] ||
            {
                emoji: "🌸",
                label: entry.mood
            };

        return `

            <article class="entry">

                <div class="entry-top">

                    <div>

                        <div class="entry-title">
                            ${escapeHtml(entry.title)}
                        </div>

                        <div class="entry-date">
                            ${formatDate(entry.date)}
                        </div>

                    </div>

                    <button
                        class="delete-entry"
                        onclick="deleteEntry(${entry.id})"
                    >
                        delete
                    </button>

                </div>

                <div class="entry-mood">
                    ${mood.emoji} ${mood.label}
                </div>

                <p class="entry-content">
                    ${escapeHtml(entry.content)}
                </p>

            </article>

        `;

    }).join("");

}


// SEARCH

searchInput.addEventListener("input", () => {

    renderEntries(getEntries());

});


// DELETE

function deleteEntry(id) {

    const entries = getEntries();

    const updated =
        entries.filter(
            entry => entry.id !== id
        );

    saveEntries(updated);

    loadDashboard();

}


// REFLECTION

reflectButton.addEventListener("click", () => {

    const entries = getEntries();

    if (!entries.length) {

        reflectionText.textContent =
            "Write your first diary entry and I'll have something to reflect on ♡";

        return;
    }

    const latest = entries[0];

    const mood =
        moods[latest.mood]?.label ||
        latest.mood;

    reflectionText.innerHTML = `

        Your latest entry feels
        <strong>${mood.toLowerCase()}</strong>.

        You wrote about
        <strong>${latest.content.split(" ").length}</strong>
        words today.

        <br><br>

        This space will eventually connect
        to an AI API to give you a much deeper
        reflection on your writing ✨

    `;

});


// HELPERS

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// RESET

resetButton.addEventListener("click", () => {

    const confirmed =
        confirm(
            "Start over? Your saved diary entries will stay on this device."
        );

    if (!confirmed) return;

    localStorage.removeItem("pastelDiaryUser");

    location.reload();

});


// INITIALIZE

loadSavedUser();
