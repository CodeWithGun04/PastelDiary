const setupScreen = document.getElementById("setupScreen");
const diaryApp = document.getElementById("diaryApp");

const userNameInput = document.getElementById("userName");
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

const entryCount = document.getElementById("entryCount");
const happyCount = document.getElementById("happyCount");
const totalCharacters = document.getElementById("totalCharacters");

const streak = document.getElementById("streak");

const entriesList = document.getElementById("entriesList");
const searchInput = document.getElementById("searchInput");

const moodGraph = document.getElementById("moodGraph");

const reflectionText = document.getElementById("reflectionText");
const reflectButton = document.getElementById("reflectButton");

const weatherTemperature = document.getElementById("weatherTemperature");
const weatherText = document.getElementById("weatherText");


/* STORAGE */

const USER_NAME_KEY = "pastelDiaryUserName";
const DIARY_NAME_KEY = "pastelDiaryName";
const ENTRIES_KEY = "pastelDiaryEntries";


let entries = [];
let selectedMood = "";


/* BASIC SETUP */

function loadEntries() {

    try {

        const savedEntries = localStorage.getItem(ENTRIES_KEY);

        if (savedEntries) {
            entries = JSON.parse(savedEntries);
        } else {
            entries = [];
        }

    } catch (error) {

        console.error("Could not load entries:", error);

        entries = [];
    }
}


function saveEntriesToStorage() {

    localStorage.setItem(
        ENTRIES_KEY,
        JSON.stringify(entries)
    );
}


/* SHOW DIARY */

function showDiary() {

    const name =
        localStorage.getItem(USER_NAME_KEY) || "";

    const diaryName =
        localStorage.getItem(DIARY_NAME_KEY) || "pastel diary";


    setupScreen.style.display = "none";
    diaryApp.style.display = "block";

    if (name) {

        welcomeText.textContent =
            `${diaryName}, ${name} ♡`;

    } else {

        welcomeText.textContent =
            diaryName;

    }

    setToday();

    loadEntries();

    updateEverything();

    getWeather();

}


/* SHOW SETUP */

function showSetup() {

    setupScreen.style.display = "flex";
    diaryApp.style.display = "none";

}


/* START BUTTON */

startButton.addEventListener("click", function () {

    const name =
        userNameInput.value.trim();

    const diaryName =
        diaryNameInput.value.trim();


    localStorage.setItem(
        USER_NAME_KEY,
        name
    );


    localStorage.setItem(
        DIARY_NAME_KEY,
        diaryName || "pastel diary"
    );


    showDiary();

});


/* SKIP BUTTON */

skipButton.addEventListener("click", function () {

    localStorage.setItem(
        USER_NAME_KEY,
        ""
    );


    localStorage.setItem(
        DIARY_NAME_KEY,
        "pastel diary"
    );


    showDiary();

});


/* RESET */

resetButton.addEventListener("click", function () {

    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(DIARY_NAME_KEY);

    showSetup();

});


/* DATE */

function setToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");


    entryDate.value =
        `${year}-${month}-${day}`;

}


/* MOODS */

const moodButtons =
    document.querySelectorAll(".mood");


moodButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        moodButtons.forEach(function (item) {

            item.classList.remove("selected");

        });


        button.classList.add("selected");


        selectedMood =
            button.dataset.mood;


        currentMood.textContent =
            selectedMood;


        moodMessage.textContent =
            getMoodMessage(selectedMood);

    });

});


function getMoodMessage(mood) {

    const messages = {

        happy:
            "you seem to be having a lovely day ♡",

        calm:
            "there's something peaceful about today",

        excited:
            "someone's got a little sparkle today ✨",

        sad:
            "it's okay to have softer days ♡",

        angry:
            "give yourself some space to breathe",

        tired:
            "maybe today is asking you to slow down",

        anxious:
            "take a breath — you don't have to solve everything right now",

        loved:
            "your heart feels a little extra full today ♡"

    };


    return (
        messages[mood] ||
        "how are you feeling today?"
    );

}


/* CHARACTER COUNT */

entryContent.addEventListener("input", function () {

    const count =
        entryContent.value.length;


    characterCount.textContent =
        `${count} characters`;

});


/* SAVE ENTRY */

saveButton.addEventListener("click", function () {

    const title =
        entryTitle.value.trim();

    const content =
        entryContent.value.trim();

    const date =
        entryDate.value;


    if (!content) {

        alert(
            "Write something in your diary first ♡"
        );

        return;

    }


    const newEntry = {

        id:
            Date.now(),

        title:
            title || "little thoughts",

        content:
            content,

        mood:
            selectedMood || "not selected",

        date:
            date,

        createdAt:
            new Date().toISOString()

    };


    entries.unshift(newEntry);


    saveEntriesToStorage();


    entryTitle.value = "";
    entryContent.value = "";

    selectedMood = "";


    moodButtons.forEach(function (button) {

        button.classList.remove("selected");

    });


    currentMood.textContent =
        "not selected";


    moodMessage.textContent =
        "how are you feeling today?";


    characterCount.textContent =
        "0 characters";


    updateEverything();


    reflectionText.textContent =
        "Your entry is saved ♡ Take a little moment to breathe and be proud of yourself for writing it down.";

});


/* UPDATE EVERYTHING */

function updateEverything() {

    updateStats();

    updateEntries();

    updateGraph();

    updateStreak();

}


/* STATS */

function updateStats() {

    entryCount.textContent =
        entries.length;


    const happyEntries =
        entries.filter(function (entry) {

            return entry.mood === "happy";

        });


    happyCount.textContent =
        happyEntries.length;


    const total =
        entries.reduce(function (sum, entry) {

            return sum + entry.content.length;

        }, 0);


    totalCharacters.textContent =
        total;

}


/* STREAK */

function updateStreak() {

    if (entries.length === 0) {

        streak.textContent = "0";

        return;

    }


    const uniqueDates =
        [...new Set(
            entries
                .map(function (entry) {
                    return entry.date;
                })
                .filter(Boolean)
        )];


    uniqueDates.sort(function (a, b) {

        return new Date(b) - new Date(a);

    });


    let currentStreak = 1;


    for (
        let i = 0;
        i < uniqueDates.length - 1;
        i++
    ) {

        const current =
            new Date(uniqueDates[i]);

        const next =
            new Date(uniqueDates[i + 1]);


        const difference =
            Math.round(
                (current - next) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 1) {

            currentStreak++;

        } else {

            break;

        }

    }


    streak.textContent =
        currentStreak;

}


/* ENTRIES */

function updateEntries() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredEntries =
        entries.filter(function (entry) {

            return (
                entry.title
                    .toLowerCase()
                    .includes(search) ||

                entry.content
                    .toLowerCase()
                    .includes(search) ||

                entry.mood
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (filteredEntries.length === 0) {

        entriesList.innerHTML = `
            <div class="empty-state">
                <span>🌸</span>
                <p>
                    ${
                        search
                            ? "no little memories matched your search."
                            : "Your diary is waiting for its first little story."
                    }
                </p>
            </div>
        `;

        return;

    }


    entriesList.innerHTML =
        filteredEntries
            .map(function (entry) {

                return `
                    <article class="entry">

                        <div class="entry-top">

                            <div>

                                <div class="entry-title">
                                    ${escapeHTML(entry.title)}
                                </div>

                                <div class="entry-date">
                                    ${formatDate(entry.date)}
                                </div>

                            </div>

                            <button
                                class="delete-entry"
                                type="button"
                                data-id="${entry.id}"
                            >
                                delete
                            </button>

                        </div>


                        <div class="entry-mood">
                            ${getMoodEmoji(entry.mood)}
                            ${escapeHTML(entry.mood)}
                        </div>


                        <div class="entry-content">
                            ${escapeHTML(entry.content)}
                        </div>

                    </article>
                `;

            })
            .join("");


    const deleteButtons =
        document.querySelectorAll(".delete-entry");


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const id =
                    Number(button.dataset.id);


                entries =
                    entries.filter(
                        function (entry) {

                            return entry.id !== id;

                        }
                    );


                saveEntriesToStorage();

                updateEverything();

            }
        );

    });

}


/* SEARCH */

searchInput.addEventListener(
    "input",
    function () {

        updateEntries();

    }
);


/* MOOD GRAPH */

function updateGraph() {

    const latest =
        entries.slice(0, 7).reverse();


    if (latest.length === 0) {

        moodGraph.innerHTML = `
            <div class="empty-state">
                <span>🌷</span>
                <p>
                    your mood garden will grow here
                </p>
            </div>
        `;

        return;

    }


    const moodValues = {

        happy: 100,
        loved: 90,
        excited: 85,
        calm: 65,
        tired: 45,
        anxious: 40,
        sad: 30,
        angry: 25,
        "not selected": 20

    };


    moodGraph.innerHTML =
        latest
            .map(function (entry) {

                const value =
                    moodValues[entry.mood] || 30;


                return `
                    <div class="graph-item">

                        <div
                            class="graph-bar"
                            style="height: ${value}%"
                            title="${escapeHTML(entry.mood)}"
                        ></div>

                        <div class="graph-label">
                            ${getMoodEmoji(entry.mood)}
                        </div>

                    </div>
                `;

            })
            .join("");

}


/* REFLECTION */

reflectButton.addEventListener(
    "click",
    function () {

        const content =
            entryContent.value.trim();


        if (!content) {

            reflectionText.textContent =
                "Write a little something first, and I'll look for a tiny pattern in your words ♡";

            return;

        }


        const lower =
            content.toLowerCase();


        if (
            lower.includes("happy") ||
            lower.includes("good") ||
            lower.includes("excited") ||
            lower.includes("amazing")
        ) {

            reflectionText.textContent =
                "There seems to be some positive energy in your words. Hold onto the little things that made today feel good ♡";

            return;

        }


        if (
            lower.includes("sad") ||
            lower.includes("cry") ||
            lower.includes("upset")
        ) {

            reflectionText.textContent =
                "This sounds like a softer day. You don't have to make every feeling disappear — sometimes writing it down is already enough.";

            return;

        }


        if (
            lower.includes("stress") ||
            lower.includes("anxious") ||
            lower.includes("worried")
        ) {

            reflectionText.textContent =
                "Your words sound a little overwhelmed. Try taking one small thing at a time and giving yourself some breathing room ♡";

            return;

        }


        reflectionText.textContent =
            "You took a moment to put your thoughts into words today. That small act of checking in with yourself matters ♡";

    }
);


/* WEATHER */

async function getWeather() {

    weatherText.textContent =
        "getting your weather...";


    if (!navigator.geolocation) {

        weatherTemperature.textContent =
            "--°";

        weatherText.textContent =
            "weather unavailable";

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Weather request failed"
                    );

                }


                const data =
                    await response.json();


                const temperature =
                    Math.round(
                        data.current.temperature_2m
                    );


                const code =
                    data.current.weather_code;


                weatherTemperature.textContent =
                    `${temperature}°`;


                weatherText.textContent =
                    getWeatherDescription(code);

            } catch (error) {

                console.error(error);

                weatherTemperature.textContent =
                    "--°";

                weatherText.textContent =
                    "weather unavailable";

            }

        },

        function () {

            weatherTemperature.textContent =
                "--°";

            weatherText.textContent =
                "location permission needed";

        }

    );

}


function getWeatherDescription(code) {

    if (code === 0) {
        return "clear skies ☀️";
    }

    if (code <= 3) {
        return "a little cloudy ☁️";
    }

    if (code <= 48) {
        return "misty outside 🌫️";
    }

    if (code <= 67) {
        return "rainy today 🌧️";
    }

    if (code <= 77) {
        return "snowy outside ❄️";
    }

    if (code <= 82) {
        return "showers today 🌦️";
    }

    if (code <= 99) {
        return "stormy skies ⛈️";
    }

    return "weather today";

}


/* HELPERS */

function getMoodEmoji(mood) {

    const emojis = {

        happy: "😊",
        calm: "😌",
        excited: "🤭",
        sad: "🥺",
        angry: "😤",
        tired: "😴",
        anxious: "🫠",
        loved: "💗"

    };


    return emojis[mood] || "🌸";

}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* INITIAL LOAD */

loadEntries();


const savedUser =
    localStorage.getItem(USER_NAME_KEY);

const savedDiary =
    localStorage.getItem(DIARY_NAME_KEY);


if (savedDiary) {

    showDiary();

} else {

    showSetup();

}
