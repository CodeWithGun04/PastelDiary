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


/* =========================
   LOCAL STORAGE
========================= */

function saveToStorage() {
    localStorage.setItem(
        "pastelDiaryEntries",
        JSON.stringify(diaryEntries)
    );

    localStorage.setItem(
        "pastelDiaryUser",
        currentUser
    );

    localStorage.setItem(
        "pastelDiaryName",
        currentDiaryName
    );
}


function loadFromStorage() {

    const savedEntries =
        localStorage.getItem("pastelDiaryEntries");

    const savedUser =
        localStorage.getItem("pastelDiaryUser");

    const savedDiaryName =
        localStorage.getItem("pastelDiaryName");


    if (savedEntries) {

        try {
            diaryEntries = JSON.parse(savedEntries);
        } catch (error) {
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


/* =========================
   OPEN DIARY
========================= */

function openDiary() {

    setupScreen.style.display = "none";

    diaryApp.style.display = "block";

    setupScreen.classList.add("hidden");

    diaryApp.classList.remove("hidden");


    if (currentDiaryName) {

        welcomeText.textContent =
            `${currentDiaryName} ♡`;

    } else if (currentUser) {

        welcomeText.textContent =
            `welcome, ${currentUser} ♡`;

    } else {

        welcomeText.textContent =
            "pastel diary ♡";

    }


    setTodayDate();

    updateAll();

    getWeather();

}


/* =========================
   START BUTTON
========================= */

startButton.addEventListener("click", function () {

    currentUser =
        userNameInput.value.trim();

    currentDiaryName =
        diaryNameInput.value.trim();


    if (!currentUser) {
        currentUser = "friend";
    }


    if (!currentDiaryName) {
        currentDiaryName = "pastel diary";
    }


    saveToStorage();

    openDiary();

});


/* =========================
   GUEST BUTTON
========================= */

skipButton.addEventListener("click", function () {

    currentUser = "";

    currentDiaryName =
        "pastel diary";


    saveToStorage();

    openDiary();

});


/* =========================
   LOAD SAVED DATA
========================= */

loadFromStorage();


/* =========================
   DATE
========================= */

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(today.getDate())
        .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function setTodayDate() {

    entryDate.value =
        getToday();

}


/* =========================
   MOOD DATA
========================= */

const moodData = {

    happy: {
        emoji: "😊",
        message:
            "you seem to have a little sunshine in you today ♡"
    },

    calm: {
        emoji: "😌",
        message:
            "a peaceful little moment is still worth remembering ♡"
    },

    excited: {
        emoji: "🤭",
        message:
            "something has your heart doing little jumps ✨"
    },

    sad: {
        emoji: "🥺",
        message:
            "it's okay to have softer days too. be gentle with yourself ♡"
    },

    angry: {
        emoji: "😤",
        message:
            "whatever happened, your feelings deserve some space."
    },

    tired: {
        emoji: "😴",
        message:
            "maybe today is asking you to slow down a little 🌙"
    },

    anxious: {
        emoji: "🫠",
        message:
            "take things one tiny moment at a time. you don't have to solve everything today."
    },

    loved: {
        emoji: "💗",
        message:
            "hold onto that warm feeling. you deserve moments like this ♡"
    }

};


/* =========================
   MOOD SELECTION
========================= */

moodButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        moodButtons.forEach(function (item) {

            item.classList.remove("selected");

        });


        button.classList.add("selected");


        selectedMood =
            button.dataset.mood;


        const mood =
            moodData[selectedMood];


        currentMood.textContent =
            `${mood.emoji} ${selectedMood}`;


        moodMessage.textContent =
            mood.message;

    });

});


/* =========================
   CHARACTER COUNT
========================= */

entryContent.addEventListener(
    "input",
    function () {

        const length =
            entryContent.value.length;


        characterCount.textContent =
            `${length} characters`;

    }
);


/* =========================
   SAVE ENTRY
========================= */

saveButton.addEventListener(
    "click",
    function () {

        const date =
            entryDate.value;

        const title =
            entryTitle.value.trim();

        const content =
            entryContent.value.trim();


        if (!date) {

            alert(
                "Please choose a date ♡"
            );

            return;

        }


        if (!selectedMood) {

            alert(
                "Pick a mood first 🌷"
            );

            return;

        }


        if (!content) {

            alert(
                "Write a little something before saving ♡"
            );

            return;

        }


        const existingIndex =
            diaryEntries.findIndex(
                function (entry) {

                    return entry.date === date;

                }
            );


        const newEntry = {

            id: Date.now(),

            date: date,

            title:
                title || "little thoughts",

            content: content,

            mood: selectedMood,

            createdAt:
                new Date().toISOString()

        };


        if (existingIndex !== -1) {

            diaryEntries[existingIndex] =
                newEntry;

        } else {

            diaryEntries.push(
                newEntry
            );

        }


        diaryEntries.sort(
            function (a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


        saveToStorage();

        updateAll();


        reflectionText.textContent =
            "saved ♡ your thoughts are safely tucked away in your diary.";


        entryTitle.value = "";

        entryContent.value = "";

        characterCount.textContent =
            "0 characters";


        moodButtons.forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );


        selectedMood = "";

        currentMood.textContent =
            "not selected";

        moodMessage.textContent =
            "how are you feeling today?";

    }
);


/* =========================
   UPDATE EVERYTHING
========================= */

function updateAll() {

    updateStats();

    updateStreak();

    updateMoodGraph();

    displayEntries(
        searchInput.value
    );

}


/* =========================
   STATS
========================= */

function updateStats() {

    entryCount.textContent =
        diaryEntries.length;


    const happyDays =
        diaryEntries.filter(
            function (entry) {

                return entry.mood === "happy";

            }
        ).length;


    happyCount.textContent =
        happyDays;


    let words = 0;


    diaryEntries.forEach(
        function (entry) {

            const entryWords =
                entry.content
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);


            words +=
                entryWords.length;

        }
    );


    totalCharacters.textContent =
        words;

}


/* =========================
   STREAK
========================= */

function updateStreak() {

    if (diaryEntries.length === 0) {

        streakElement.textContent =
            "0";

        return;

    }


    const uniqueDates =
        [
            ...new Set(
                diaryEntries
                    .map(
                        function (entry) {
                            return entry.date;
                        }
                    )
            )
        ].sort(
            function (a, b) {

                return (
                    new Date(b) -
                    new Date(a)
                );

            }
        );


    const today =
        getToday();


    const yesterdayDate =
        new Date();


    yesterdayDate.setDate(
        yesterdayDate.getDate() - 1
    );


    const yesterday =
        yesterdayDate
            .toISOString()
            .split("T")[0];


    if (
        uniqueDates[0] !== today &&
        uniqueDates[0] !== yesterday
    ) {

        streakElement.textContent =
            "0";

        return;

    }


    let streak = 0;

    let checkDate =
        new Date(
            uniqueDates[0]
        );


    for (
        let i = 0;
        i < uniqueDates.length;
        i++
    ) {

        const expected =
            checkDate
                .toISOString()
                .split("T")[0];


        if (
            uniqueDates.includes(
                expected
            )
        ) {

            streak++;

            checkDate.setDate(
                checkDate.getDate() - 1
            );

        } else {

            break;

        }

    }


    streakElement.textContent =
        streak;

}


/* =========================
   MOOD GRAPH
========================= */

function updateMoodGraph() {

    moodGraph.innerHTML = "";


    if (diaryEntries.length === 0) {

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


    const recentEntries =
        [...diaryEntries]
            .sort(
                function (a, b) {

                    return (
                        new Date(a.date) -
                        new Date(b.date)
                    );

                }
            )
            .slice(-7);


    recentEntries.forEach(
        function (entry) {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "mood-point";


            const mood =
                moodData[entry.mood];


            const emoji =
                mood
                    ? mood.emoji
                    : "🌷";


            const formattedDate =
                new Date(
                    entry.date
                ).toLocaleDateString(
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

                <span>
                    ${formattedDate}
                </span>

            `;


            moodGraph.appendChild(
                wrapper
            );

        }
    );

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    function () {

        displayEntries(
            searchInput.value
        );

    }
);


/* =========================
   DISPLAY ENTRIES
========================= */

function displayEntries(
    searchTerm = ""
) {

    entriesList.innerHTML = "";


    let filteredEntries =
        [...diaryEntries];


    const term =
        searchTerm
            .toLowerCase()
            .trim();


    if (term) {

        filteredEntries =
            filteredEntries.filter(
                function (entry) {

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

                }
            );

    }


    if (
        filteredEntries.length === 0
    ) {

        entriesList.innerHTML = `

            <div class="empty-state">

                <span>🌸</span>

                <p>

                    ${
                        term
                            ? "no little memory matched your search."
                            : "Your diary is waiting for its first little story."
                    }

                </p>

            </div>

        `;

        return;

    }


    filteredEntries.forEach(
        function (entry) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "entry-item";


            const mood =
                moodData[entry.mood];


            const emoji =
                mood
                    ? mood.emoji
                    : "🌷";


            const formattedDate =
                new Date(
                    entry.date
                ).toLocaleDateString(
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
                            ${escapeHTML(
                                entry.title
                            )}
                        </h3>

                    </div>

                    <span class="entry-mood">
                        ${emoji}
                    </span>

                </div>


                <p class="entry-content">
                    ${escapeHTML(
                        entry.content
                    )}
                </p>


                <div class="entry-bottom">

                    <span>
                        ${emoji}
                        ${escapeHTML(
                            entry.mood
                        )}
                    </span>

                    <button
                        class="delete-entry"
                        data-id="${entry.id}"
                    >
                        delete
                    </button>

                </div>

            `;


            entriesList.appendChild(
                article
            );

        }
    );


    document
        .querySelectorAll(
            ".delete-entry"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        diaryEntries =
                            diaryEntries.filter(
                                function (entry) {

                                    return (
                                        entry.id !== id
                                    );

                                }
                            );


                        saveToStorage();

                        updateAll();

                    }
                );

            }
        );

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================
   REFLECTION
========================= */

reflectButton.addEventListener(
    "click",
    function () {

        if (
            diaryEntries.length === 0
        ) {

            reflectionText.textContent =
                "write your first entry and I'll look for little patterns in your thoughts ♡";

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
                "your words sound like they could use a little softness. rest is productive too 🌙";

        }

        else {

            response =
                "you've given yourself a space to put your thoughts into words today. sometimes noticing what's on your mind is already a small step forward ♡";

        }


        reflectionText.textContent =
            response;

    }
);


/* =========================
   REAL-TIME WEATHER
   OPEN-METEO API
========================= */

async function getWeather() {

    weatherTemperature.textContent =
        "--°";


    weatherText.textContent =
        "checking today's weather...";


    if (
        !navigator.geolocation
    ) {

        weatherText.textContent =
            "weather location unavailable";

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

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
                        data.current
                            .temperature_2m
                    );


                const weatherCode =
                    data.current
                        .weather_code;


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


        function () {

            weatherTemperature.textContent =
                "--°";


            weatherText.textContent =
                "allow location for live weather";

        }

    );

}


/* =========================
   WEATHER DESCRIPTION
========================= */

function getWeatherDescription(code) {

    if (code === 0) {
        return "clear sky ☀️";
    }


    if (
        code === 1 ||
        code === 2
    ) {
        return "partly cloudy 🌤️";
    }


    if (code === 3) {
        return "cloudy ☁️";
    }


    if (
        code === 45 ||
        code === 48
    ) {
        return "foggy 🌫️";
    }


    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 56 ||
        code === 57
    ) {
        return "light drizzle 🌦️";
    }


    if (
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 66 ||
        code === 67
    ) {
        return "rainy 🌧️";
    }


    if (
        code === 71 ||
        code === 73 ||
        code === 75 ||
        code === 77
    ) {
        return "snowy ❄️";
    }


    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "rain showers 🌦️";
    }


    if (
        code === 85 ||
        code === 86
    ) {
        return "snow showers 🌨️";
    }


    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return "thunderstorm ⛈️";
    }


    return "today's weather";

}


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "Are you sure you want to start over? Your diary entries will be deleted."
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            "pastelDiaryEntries"
        );

        localStorage.removeItem(
            "pastelDiaryUser"
        );

        localStorage.removeItem(
            "pastelDiaryName"
        );


        diaryEntries = [];

        currentUser = "";

        currentDiaryName = "";

        selectedMood = "";


        diaryApp.style.display =
            "none";


        setupScreen.style.display =
            "flex";


        diaryApp.classList.add(
            "hidden"
        );

        setupScreen.classList.remove(
            "hidden"
        );


        userNameInput.value = "";

        diaryNameInput.value = "";

        entryTitle.value = "";

        entryContent.value = "";

        searchInput.value = "";


        characterCount.textContent =
            "0 characters";


        currentMood.textContent =
            "not selected";


        moodMessage.textContent =
            "how are you feeling today?";


        moodButtons.forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

    }
);


/* =========================
   INITIAL SETUP
========================= */

setTodayDate();


/* Make sure the correct
   screen is visible when
   the page first loads.
*/

diaryApp.style.display = "none";

setupScreen.style.display = "flex";
```
