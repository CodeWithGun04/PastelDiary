```javascript
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

const streakElement = document.getElementById("streak");

const weatherTemperature = document.getElementById("weatherTemperature");
const weatherText = document.getElementById("weatherText");

const reflectionText = document.getElementById("reflectionText");
const reflectButton = document.getElementById("reflectButton");

const entryCount = document.getElementById("entryCount");
const happyCount = document.getElementById("happyCount");
const totalCharacters = document.getElementById("totalCharacters");

const moodGraph = document.getElementById("moodGraph");

const entriesList = document.getElementById("entriesList");
const searchInput = document.getElementById("searchInput");

const moodButtons = document.querySelectorAll(".mood");

let diaryEntries = [];
let selectedMood = "";
let currentUser = "";
let currentDiaryName = "";


/* -----------------------------
   LOCAL STORAGE
----------------------------- */

function saveToStorage() {
    localStorage.setItem("pastelDiaryEntries", JSON.stringify(diaryEntries));
    localStorage.setItem("pastelDiaryUser", currentUser);
    localStorage.setItem("pastelDiaryName", currentDiaryName);
}


function loadFromStorage() {

    const savedEntries = localStorage.getItem("pastelDiaryEntries");
    const savedUser = localStorage.getItem("pastelDiaryUser");
    const savedDiaryName = localStorage.getItem("pastelDiaryName");

    if (savedEntries) {
        try {
            diaryEntries = JSON.parse(savedEntries);
        } catch {
            diaryEntries = [];
        }
    }

    if (savedUser) {
        currentUser = savedUser;
    }

    if (savedDiaryName) {
        currentDiaryName = savedDiaryName;
    }
}


/* -----------------------------
   START DIARY
----------------------------- */

function openDiary() {

    setupScreen.classList.add("hidden");
    diaryApp.classList.remove("hidden");

    if (currentUser) {
        welcomeText.textContent =
            currentDiaryName
                ? `${currentDiaryName} ♡`
                : `welcome, ${currentUser} ♡`;
    } else {
        welcomeText.textContent = "pastel diary ♡";
    }

    setTodayDate();

    updateAll();

    getWeather();
}


startButton.addEventListener("click", function () {

    const name = userNameInput.value.trim();
    const diaryName = diaryNameInput.value.trim();

    currentUser = name || "friend";
    currentDiaryName = diaryName || "pastel diary";

    saveToStorage();

    openDiary();
});


skipButton.addEventListener("click", function () {

    currentUser = "";
    currentDiaryName = "pastel diary";

    saveToStorage();

    openDiary();
});


/* -----------------------------
   LOAD PREVIOUS SESSION
----------------------------- */

loadFromStorage();

if (currentUser || diaryEntries.length > 0) {

    setupScreen.classList.remove("hidden");
}


/* -----------------------------
   DATE
----------------------------- */

function getToday() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function setTodayDate() {

    entryDate.value = getToday();
}


/* -----------------------------
   MOODS
----------------------------- */

const moodData = {

    happy: {
        emoji: "😊",
        message: "you seem to have a little sunshine in you today ♡"
    },

    calm: {
        emoji: "😌",
        message: "a peaceful little moment is still worth remembering ♡"
    },

    excited: {
        emoji: "🤭",
        message: "something has your heart doing little jumps ✨"
    },

    sad: {
        emoji: "🥺",
        message: "it's okay to have softer days too. be gentle with yourself ♡"
    },

    angry: {
        emoji: "😤",
        message: "whatever happened, your feelings deserve some space."
    },

    tired: {
        emoji: "😴",
        message: "maybe today is asking you to slow down a little 🌙"
    },

    anxious: {
        emoji: "🫠",
        message: "take things one tiny moment at a time. you don't have to solve everything today."
    },

    loved: {
        emoji: "💗",
        message: "hold onto that warm feeling. you deserve moments like this ♡"
    }
};


moodButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        moodButtons.forEach(function(item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedMood = button.dataset.mood;

        currentMood.textContent =
            `${moodData[selectedMood].emoji} ${selectedMood}`;

        moodMessage.textContent =
            moodData[selectedMood].message;
    });

});


/* -----------------------------
   CHARACTER COUNT
----------------------------- */

entryContent.addEventListener("input", function() {

    const length = entryContent.value.length;

    characterCount.textContent =
        `${length} characters`;

});


/* -----------------------------
   SAVE ENTRY
----------------------------- */

saveButton.addEventListener("click", function() {

    const date = entryDate.value;
    const title = entryTitle.value.trim();
    const content = entryContent.value.trim();

    if (!date) {
        alert("Please choose a date ♡");
        return;
    }

    if (!selectedMood) {
        alert("Pick a mood first 🌷");
        return;
    }

    if (!content) {
        alert("Write a little something before saving ♡");
        return;
    }


    const existingEntryIndex = diaryEntries.findIndex(
        entry => entry.date === date
    );


    const newEntry = {

        id: Date.now(),

        date: date,

        title: title || "little thoughts",

        content: content,

        mood: selectedMood,

        createdAt: new Date().toISOString()

    };


    if (existingEntryIndex !== -1) {

        diaryEntries[existingEntryIndex] = newEntry;

    } else {

        diaryEntries.push(newEntry);

    }


    diaryEntries.sort(function(a, b) {

        return new Date(b.date) - new Date(a.date);

    });


    saveToStorage();

    updateAll();

    reflectionText.textContent =
        "saved ♡ your thoughts are safely tucked away in your diary.";

    entryTitle.value = "";
    entryContent.value = "";

    characterCount.textContent = "0 characters";

    moodButtons.forEach(function(button) {
        button.classList.remove("selected");
    });

    selectedMood = "";

    currentMood.textContent = "not selected";

    moodMessage.textContent =
        "how are you feeling today?";

});


/* -----------------------------
   UPDATE EVERYTHING
----------------------------- */

function updateAll() {

    updateStats();

    updateStreak();

    updateMoodGraph();

    displayEntries(searchInput.value);

}


/* -----------------------------
   STATS
----------------------------- */

function updateStats() {

    entryCount.textContent = diaryEntries.length;


    const happyDays = diaryEntries.filter(function(entry) {

        return entry.mood === "happy";

    }).length;


    happyCount.textContent = happyDays;


    let words = 0;

    diaryEntries.forEach(function(entry) {

        words += entry.content
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;

    });


    totalCharacters.textContent = words;
}


/* -----------------------------
   STREAK
----------------------------- */

function updateStreak() {

    if (diaryEntries.length === 0) {

        streakElement.textContent = "0";

        return;
    }


    const dates = diaryEntries

        .map(entry => entry.date)

        .sort(function(a, b) {

            return new Date(b) - new Date(a);

        });


    const uniqueDates = [...new Set(dates)];


    let streak = 0;

    let currentDate = new Date();


    const todayString = getToday();


    if (uniqueDates[0] !== todayString) {

        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, "0");
        const day = String(yesterday.getDate()).padStart(2, "0");

        const yesterdayString =
            `${year}-${month}-${day}`;


        if (uniqueDates[0] !== yesterdayString) {

            streakElement.textContent = "0";

            return;
        }

        currentDate = yesterday;

    }


    for (let i = 0; i < uniqueDates.length; i++) {

        const expectedDate =
            currentDate.toISOString().split("T")[0];


        if (uniqueDates.includes(expectedDate)) {

            streak++;

            currentDate.setDate(
                currentDate.getDate() - 1
            );

        } else {

            break;
        }

    }


    streakElement.textContent = streak;
}


/* -----------------------------
   MOOD GRAPH
----------------------------- */

function updateMoodGraph() {

    moodGraph.innerHTML = "";


    if (diaryEntries.length === 0) {

        moodGraph.innerHTML =
            `<p class="empty-state">your mood garden will grow here 🌷</p>`;

        return;
    }


    const recentEntries =
        [...diaryEntries]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);


    recentEntries.forEach(function(entry) {

        const wrapper = document.createElement("div");

        wrapper.className = "mood-point";


        const emoji =
            moodData[entry.mood]?.emoji || "🌷";


        const date =
            new Date(entry.date).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric"
                }
            );


        wrapper.innerHTML = `

            <div class="mood-flower">
                ${emoji}
            </div>

            <span>${date}</span>

        `;


        moodGraph.appendChild(wrapper);

    });

}


/* -----------------------------
   SEARCH + ENTRIES
----------------------------- */

searchInput.addEventListener("input", function() {

    displayEntries(searchInput.value);

});


function displayEntries(searchTerm = "") {

    entriesList.innerHTML = "";


    let filteredEntries = [...diaryEntries];


    if (searchTerm.trim() !== "") {

        const term =
            searchTerm.toLowerCase().trim();


        filteredEntries =
            filteredEntries.filter(function(entry) {

                return (

                    entry.title
                        .toLowerCase()
                        .includes(term)

                    ||

                    entry.content
                        .toLowerCase()
                        .includes(term)

                    ||

                    entry.mood
                        .toLowerCase()
                        .includes(term)

                );

            });

    }


    if (filteredEntries.length === 0) {

        entriesList.innerHTML = `

            <div class="empty-state">

                <span>🌸</span>

                <p>
                    ${
                        searchTerm
                            ? "no little memory matched your search."
                            : "Your diary is waiting for its first little story."
                    }
                </p>

            </div>

        `;

        return;
    }


    filteredEntries.forEach(function(entry) {

        const article =
            document.createElement("article");

        article.className = "entry-item";


        const emoji =
            moodData[entry.mood]?.emoji || "🌷";


        const formattedDate =
            new Date(entry.date).toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );


        article.innerHTML = `

            <div class="entry-top">

                <div>

                    <p class="small-label">
                        ${formattedDate}
                    </p>

                    <h3>
                        ${escapeHTML(entry.title)}
                    </h3>

                </div>

                <span class="entry-mood">
                    ${emoji}
                </span>

            </div>


            <p class="entry-content">
                ${escapeHTML(entry.content)}
            </p>


            <div class="entry-bottom">

                <span>
                    ${emoji} ${entry.mood}
                </span>

                <button
                    class="delete-entry"
                    data-id="${entry.id}"
                >
                    delete
                </button>

            </div>

        `;


        entriesList.appendChild(article);

    });


    document.querySelectorAll(".delete-entry")
        .forEach(function(button) {

            button.addEventListener("click", function() {

                const id =
                    Number(button.dataset.id);


                diaryEntries =
                    diaryEntries.filter(
                        entry => entry.id !== id
                    );


                saveToStorage();

                updateAll();

            });

        });

}


/* -----------------------------
   HTML SAFETY
----------------------------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* -----------------------------
   REFLECTION
----------------------------- */

reflectButton.addEventListener("click", function() {

    if (diaryEntries.length === 0) {

        reflectionText.textContent =
            "Write your first entry and I'll look for little patterns in your thoughts ♡";

        return;
    }


    const latest =
        diaryEntries[0];


    const content =
        latest.content.toLowerCase();


    let response = "";


    if (
        content.includes("happy") ||
        content.includes("excited") ||
        content.includes("good") ||
        content.includes("love")
    ) {

        response =
            "there's a little warmth in your words today. hold onto whatever made this moment feel good ♡";

    }

    else if (
        content.includes("sad") ||
        content.includes("cry") ||
        content.includes("upset") ||
        content.includes("lonely")
    ) {

        response =
            "your words feel a little heavy today. you don't have to make everything better immediately. giving yourself space is enough for now ♡";

    }

    else if (
        content.includes("stress") ||
        content.includes("anxious") ||
        content.includes("worried") ||
        content.includes("pressure")
    ) {

        response =
            "it sounds like your mind has been carrying quite a lot. try focusing on just the next small thing instead of everything at once 🌷";

    }

    else if (
        content.includes("tired") ||
        content.includes("sleep") ||
        content.includes("exhausted")
    ) {

        response =
            "your words sound like they could use a little softness. rest is productive too, even when it doesn't feel that way 🌙";

    }

    else {

        response =
            "you've given yourself a space to put your thoughts into words today. sometimes noticing what's on your mind is already a small step forward ♡";

    }


    reflectionText.textContent = response;

});


/* -----------------------------
   REAL-TIME WEATHER API
   OPEN-METEO
----------------------------- */

async function getWeather() {

    weatherTemperature.textContent = "--°";

    weatherText.textContent =
        "checking today's weather...";


    if (!navigator.geolocation) {

        weatherText.textContent =
            "weather location unavailable";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const url =
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;


                const response =
                    await fetch(url);


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


                const weatherCode =
                    data.current.weather_code;


                weatherTemperature.textContent =
                    `${temperature}°C`;


                weatherText.textContent =
                    getWeatherDescription(
                        weatherCode
                    );

            }

            catch (error) {

                console.error(
                    "Weather error:",
                    error
                );


                weatherTemperature.textContent =
                    "--°";


                weatherText.textContent =
                    "couldn't load weather";

            }

        },

        function() {

            weatherTemperature.textContent =
                "--°";


            weatherText.textContent =
                "allow location for live weather";

        }

    );

}


/* -----------------------------
   WEATHER DESCRIPTION
----------------------------- */

function getWeatherDescription(code) {

    if (code === 0) {
        return "clear sky ☀️";
    }

    if (code === 1 || code === 2) {
        return "partly cloudy 🌤️";
    }

    if (code === 3) {
        return "cloudy ☁️";
    }

    if ([45, 48].includes(code)) {
        return "foggy 🌫️";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "light drizzle 🌦️";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "rainy 🌧️";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "snowy ❄️";
    }

    if ([80, 81, 82].includes(code)) {
        return "rain showers 🌦️";
    }

    if ([85, 86].includes(code)) {
        return "snow showers 🌨️";
    }

    if ([95, 96, 99].includes(code)) {
        return "thunderstorm ⛈️";
    }

    return "today's weather";
}


/* -----------------------------
   RESET
----------------------------- */

resetButton.addEventListener("click", function() {

    const confirmed =
        confirm(
            "Are you sure you want to start over? Your diary entries will be deleted."
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem("pastelDiaryEntries");
    localStorage.removeItem("pastelDiaryUser");
    localStorage.removeItem("pastelDiaryName");


    diaryEntries = [];

    currentUser = "";

    currentDiaryName = "";

    selectedMood = "";


    diaryApp.classList.add("hidden");

    setupScreen.classList.remove("hidden");


    userNameInput.value = "";

    diaryNameInput.value = "";

    entryTitle.value = "";

    entryContent.value = "";

    searchInput.value = "";

    characterCount.textContent =
        "0 characters";

});


/* -----------------------------
   INITIAL DATE
----------------------------- */

setTodayDate();
```
