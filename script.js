import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAikl4RKUs6L31vAnoNTEj7Q0nSlgydQz4",
    authDomain: authDomain: "pasteldiary-h8m3pxx66-codewithgun04s-projects.vercel.app",,
    projectId: "pasteldiary-61e12",
    storageBucket: "pasteldiary-61e12.firebasestorage.app",
    messagingSenderId: "615784663317",
    appId: "1:615784663317:web:9576c7dd28c0f93343c11c"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


let firebaseUser = null;

let diaryEntries = [];

let currentUser = "";

let currentDiaryName = "";

let lastResponse = "";

let selectedMood = "🌸 soft";


/* =========================
   STORAGE
========================= */


function getStorageKey() {

    if (firebaseUser) {

        return `diary_google_${firebaseUser.uid}`;

    }

    return `diary_${currentUser || "friend"}`;
}


function saveAll() {

    const data = {

        user: currentUser,

        diaryName: currentDiaryName,

        entries: diaryEntries,

        lastResponse: lastResponse,

        selectedMood: selectedMood

    };


    localStorage.setItem(

        getStorageKey(),

        JSON.stringify(data)

    );
}


function loadUser() {

    const saved = localStorage.getItem(

        getStorageKey()

    );


    if (!saved) {

        diaryEntries = [];

        lastResponse = "";

        selectedMood = "🌸 soft";

        return;

    }


    try {

        const data = JSON.parse(saved);


        diaryEntries = data.entries || [];

        lastResponse = data.lastResponse || "";

        selectedMood = data.selectedMood || "🌸 soft";


        if (data.diaryName) {

            currentDiaryName = data.diaryName;

        }

    }

    catch (error) {

        console.error(

            "Could not load diary:",

            error

        );

        diaryEntries = [];

        lastResponse = "";

        selectedMood = "🌸 soft";

    }
}


/* =========================
   DATE
========================= */


function setTodaysDate() {

    const dateInput =

        document.getElementById("entryDate");


    if (!dateInput) return;


    const today = new Date();


    dateInput.value =

        today.toISOString().split("T")[0];
}


/* =========================
   MOODS
========================= */


function getMoodValue(mood) {

    const scores = {

        "🌸 soft": 3,

        "💔 heavy": 2,

        "😔 sad": 2,

        "🫂 lonely": 2,

        "🌀 anxious": 2,

        "🌙 tired": 2,

        "😤 angry": 1,

        "💖 hopeful": 4

    };


    return scores[mood] || 3;
}


function moodClick(element) {

    document

        .querySelectorAll(".mood")

        .forEach(mood => {

            mood.classList.remove("selected");

        });


    element.classList.add("selected");


    selectedMood =

        element.dataset.mood ||

        element.innerText.trim();


    saveAll();

    updateResponse();
}


function bindMoods() {

    document

        .querySelectorAll(".mood")

        .forEach(mood => {

            mood.addEventListener(

                "click",

                () => moodClick(mood)

            );

        });
}


/* =========================
   SMART REFLECTION
========================= */


function getSmartResponse(text, mood) {

    const content =

        (text || "").toLowerCase();


    if (!content.trim()) {

        return "write a little something and i'll reflect on it with you ♡";

    }


    if (

        content.includes("happy") ||

        content.includes("good") ||

        content.includes("amazing") ||

        content.includes("excited") ||

        mood === "💖 hopeful"

    ) {

        return "you sound really happy today ♡ hold onto this little moment and remember what made it special.";

    }


    if (

        content.includes("sad") ||

        content.includes("cry") ||

        content.includes("lonely") ||

        content.includes("upset") ||

        mood === "😔 sad" ||

        mood === "🫂 lonely"

    ) {

        return "it sounds like today felt a little heavy. you don't have to have everything figured out right now. be gentle with yourself ♡";

    }


    if (

        content.includes("stress") ||

        content.includes("exam") ||

        content.includes("deadline") ||

        content.includes("assignment") ||

        content.includes("anxious") ||

        mood === "🌀 anxious"

    ) {

        return "you've got a lot on your mind right now. take things one tiny step at a time — you don't have to solve everything at once 🌷";

    }


    if (

        content.includes("tired") ||

        content.includes("sleep") ||

        content.includes("exhausted") ||

        mood === "🌙 tired"

    ) {

        return "your mind might be asking for a little rest. it's okay to slow down and recharge ♡";

    }


    if (

        content.includes("love") ||

        content.includes("friend") ||

        content.includes("family") ||

        content.includes("mom") ||

        content.includes("dad")

    ) {

        return "the people around us can make ordinary moments feel special. i'm glad you captured this one ♡";

    }


    if (

        content.includes("college") ||

        content.includes("class") ||

        content.includes("project") ||

        content.includes("work")

    ) {

        return "another day of learning, doing and figuring things out. even small progress counts 🌱";

    }


    return "thank you for putting your thoughts into words. sometimes writing things down makes them feel a little lighter ♡";
}


function updateResponse() {

    const responseBox =

        document.getElementById("responseBox");


    if (!responseBox) return;


    const text =

        document.getElementById("entryText")?.value || "";


    lastResponse =

        getSmartResponse(

            text,

            selectedMood

        );


    responseBox.innerText =

        lastResponse;
}


/* =========================
   STATS
========================= */


function updateStats() {

    const statEntries =

        document.getElementById("statEntries");


    const statStreak =

        document.getElementById("statStreak");


    const statWeek =

        document.getElementById("statWeek");


    const statMood =

        document.getElementById("statMood");


    const statWords =

        document.getElementById("statWords");


    const statAverage =

        document.getElementById("statAverage");


    if (statEntries) {

        statEntries.innerText =

            diaryEntries.length;

    }


    if (statAverage) {

        if (diaryEntries.length === 0) {

            statAverage.innerText = "—";

        }

        else {

            const total =

                diaryEntries.reduce(

                    (sum, entry) =>

                        sum +

                        getMoodValue(entry.mood),

                    0

                );


            statAverage.innerText =

                (total / diaryEntries.length)

                    .toFixed(1);

        }
    }


    if (statWords) {

        const words =

            diaryEntries.reduce(

                (total, entry) => {

                    return total +

                        (entry.text || "")

                            .trim()

                            .split(/\s+/)

                            .filter(Boolean)

                            .length;

                },

                0

            );


        statWords.innerText = words;

    }


    if (statMood) {

        if (diaryEntries.length === 0) {

            statMood.innerText = "—";

        }

        else {

            const moodCounts = {};


            diaryEntries.forEach(entry => {

                moodCounts[entry.mood] =

                    (moodCounts[entry.mood] || 0) + 1;

            });


            const mainMood =

                Object.entries(moodCounts)

                    .sort((a, b) => b[1] - a[1])[0][0];


            statMood.innerText =

                mainMood.split(" ")[0];

        }
    }


    if (statWeek) {

        const now = new Date();


        const sevenDaysAgo =

            new Date(now);

        sevenDaysAgo.setDate(

            now.getDate() - 7

        );


        const count =

            diaryEntries.filter(entry => {

                const date =

                    new Date(entry.date);


                return date >= sevenDaysAgo;

            }).length;


        statWeek.innerText = count;

    }


    if (statStreak) {

        if (diaryEntries.length === 0) {

            statStreak.innerText = "0";

        }

        else {

            const dates = [

                ...new Set(

                    diaryEntries

                        .map(entry => entry.date)

                )

            ].sort().reverse();


            let streak = 1;


            for (

                let i = 0;

                i < dates.length - 1;

                i++

            ) {

                const current =

                    new Date(dates[i]);


                const previous =

                    new Date(dates[i + 1]);


                const difference =

                    Math.round(

                        (

                            current -

                            previous

                        ) /

                        (1000 * 60 * 60 * 24)

                    );


                if (difference === 1) {

                    streak++;

                }

                else {

                    break;

                }
            }


            statStreak.innerText = streak;

        }
    }


    updateMoodSummary();
}


function updateMoodSummary() {

    const summary =

        document.getElementById("moodSummary");


    if (!summary) return;


    if (diaryEntries.length === 0) {

        summary.innerText =

            "🌷 your mood story will appear here";

        return;

    }


    const counts = {};


    diaryEntries.forEach(entry => {

        counts[entry.mood] =

            (counts[entry.mood] || 0) + 1;

    });


    const mainMood =

        Object.entries(counts)

            .sort((a, b) => b[1] - a[1])[0][0];


    summary.innerText =

        `🌷 you've been feeling mostly ${mainMood} lately — keep noticing what your days are trying to tell you ♡`;
}


/* =========================
   MOOD GRAPH
========================= */


function renderMoodGraph() {

    const container =

        document.getElementById(

            "moodGraphContainer"

        );


    if (!container) return;


    if (diaryEntries.length === 0) {

        container.innerHTML = `

            <div class="no-graph">

                📝 write entries to see your mood graph

            </div>

        `;

        return;

    }


    const recentEntries =

        diaryEntries.slice(-7);


    const maxHeight = 120;


    container.innerHTML = `

        <div class="bars">

            ${recentEntries.map(entry => {

                const value =

                    getMoodValue(entry.mood);


                const height =

                    Math.max(

                        15,

                        (value / 5) * maxHeight

                    );


                const date =

                    new Date(

                        entry.date + "T00:00:00"

                    );


                const label =

                    date.toLocaleDateString(

                        "en-US",

                        { weekday: "short" }

                    );


                return `

                    <div class="bar-item">

                        <div

                            class="bar"

                            style="

                                height:${height}px;

                                background:#e5c8ee;

                            "

                        ></div>

                        <div class="bar-emoji">

                            ${escapeHtml(

                                entry.mood?.split(" ")[0] || "🌸"

                            )}

                        </div>

                        <div class="bar-label">

                            ${label}

                        </div>

                    </div>

                `;

            }).join("")}

        </div>

    `;
}


/* =========================
   ENTRIES
========================= */


function escapeHtml(text) {

    const div =

        document.createElement("div");


    div.innerText = text ?? "";


    return div.innerHTML;
}


function renderEntries() {

    const feed =

        document.getElementById(

            "entriesFeed"

        );


    if (!feed) return;


    if (diaryEntries.length === 0) {

        feed.innerHTML =

            "— nothing yet. —";

        return;

    }


    const sorted =

        [...diaryEntries].reverse();


    feed.innerHTML =

        sorted.map(entry => `

            <div

                class="entry-item"

                data-entry-id="${entry.id}"

            >

                <button

                    class="delete-btn"

                    onclick="deleteEntry(${entry.id})"

                >

                    ×

                </button>


                <div

                    style="

                        color:#b47d9e;

                        margin-bottom:5px;

                    "

                >

                    ${escapeHtml(entry.mood || "🌸 soft")}

                </div>


                <strong

                    style="

                        color:#7a5a8a;

                        display:block;

                        margin-bottom:5px;

                    "

                >

                    ${escapeHtml(

                        entry.title ||

                        "untitled moment"

                    )}

                </strong>


                <div

                    style="

                        font-size:0.7rem;

                        color:#c2abc9;

                        margin-bottom:8px;

                    "

                >

                    ${escapeHtml(entry.date || "")}

                </div>


                <div class="entry-content-preview">

                    ${escapeHtml(entry.text || "")}

                </div>

            </div>

        `).join("");
}


window.deleteEntry = function(id) {

    const confirmed =

        confirm(

            "delete this little page? ♡"

        );


    if (!confirmed) return;


    diaryEntries =

        diaryEntries.filter(

            entry => entry.id !== id

        );


    saveAll();

    renderEntries();

    updateStats();

    renderMoodGraph();

};


/* =========================
   START DIARY
========================= */


function initDiary(user, diaryNick) {

    currentUser =

        user || "friend";


    currentDiaryName =

        diaryNick || "my little diary";


    loadUser();


    const setupView =

        document.getElementById(

            "setupView"

        );


    const diaryView =

        document.getElementById(

            "diaryView"

        );


    if (setupView) {

        setupView.style.display = "none";

    }


    if (diaryView) {

        diaryView.style.display = "block";

    }


    const mainTitle =

        document.getElementById(

            "mainTitle"

        );


    const mainSub =

        document.getElementById(

            "mainSub"

        );


    if (mainTitle) {

        mainTitle.innerText =

            `🕯️ ${currentDiaryName}`;

    }


    if (mainSub) {

        mainSub.innerText =

            `a little space for ${currentUser}`;

    }


    setTodaysDate();


    bindMoods();


    document

        .querySelectorAll(".mood")

        .forEach(mood => {

            mood.classList.remove("selected");

            if (

                mood.dataset.mood ===

                selectedMood

            ) {

                mood.classList.add("selected");

            }

        });


    renderEntries();

    updateStats();

    renderMoodGraph();


    const responseBox =

        document.getElementById(

            "responseBox"

        );


    if (responseBox) {

        responseBox.innerText =

            lastResponse ||

            "✨ write something — I'll read it carefully.";

    }


    saveAll();

}


/* =========================
   GOOGLE AUTH - SAFARI FRIENDLY
========================= */


async function signInWithGoogle() {

    const button =

        document.getElementById(

            "googleSignInBtn"

        );


    if (button) {

        button.disabled = true;

        button.innerText =

            "✨ opening Google...";

    }


    try {

        console.log(

            "Starting Google redirect..."

        );


        await signInWithRedirect(

            auth,

            googleProvider

        );

    }

    catch (error) {

        console.error(

            "GOOGLE AUTH ERROR:",

            error

        );


        if (button) {

            button.disabled = false;

            button.innerText =

                "✨ Continue with Google";

        }


        let message =

            "something went wrong while signing you in ♡";


        if (

            error.code ===

            "auth/unauthorized-domain"

        ) {

            message =

                "this website is not authorized in Firebase yet.";

        }


        alert(message);

    }
}


/* =========================
   HANDLE GOOGLE REDIRECT
========================= */


async function handleGoogleRedirect() {

    try {

        const result =

            await getRedirectResult(auth);


        if (!result || !result.user) {

            return;

        }


        firebaseUser = result.user;


        console.log(

            "Google redirect successful:",

            firebaseUser

        );


        const googleName =

            firebaseUser.displayName ||

            "friend";


        const nameInput =

            document.getElementById(

                "userName"

            );


        if (nameInput) {

            nameInput.value = googleName;

        }


        const diaryInput =

            document.getElementById(

                "diaryNick"

            );


        if (diaryInput) {

            diaryInput.value = "";

            diaryInput.placeholder =

                "name your diary...";

        }


        const button =

            document.getElementById(

                "googleSignInBtn"

            );


        if (button) {

            button.disabled = false;

            button.innerText =

                "✓ Google connected";

        }


        alert(

            `welcome, ${googleName} ♡ now give your diary a cute name!`

        );

    }

    catch (error) {

        console.error(

            "GOOGLE REDIRECT ERROR:",

            error

        );


        const button =

            document.getElementById(

                "googleSignInBtn"

            );


        if (button) {

            button.disabled = false;

            button.innerText =

                "✨ Continue with Google";

        }


        let message =

            "something went wrong while signing you in ♡";


        if (

            error.code ===

            "auth/unauthorized-domain"

        ) {

            message =

                "this website is not authorized in Firebase yet.";

        }


        if (

            error.code ===

            "auth/operation-not-allowed"

        ) {

            message =

                "Google sign-in is not enabled in Firebase.";

        }


        alert(message);

    }
}


/* =========================
   GOOGLE BUTTON
========================= */


const googleButton =

    document.getElementById(

        "googleSignInBtn"

    );


if (googleButton) {

    googleButton.addEventListener(

        "click",

        signInWithGoogle

    );

}


/* =========================
   FIREBASE AUTH STATE
========================= */


onAuthStateChanged(

    auth,

    user => {

        if (user) {

            firebaseUser = user;

            console.log(

                "Signed in:",

                user.displayName,

                user.email,

                user.uid

            );

        }

    }

);


/* =========================
   MANUAL START
========================= */


const startButton =

    document.getElementById(

        "startDiaryBtn"

    );


if (startButton) {

    startButton.addEventListener(

        "click",

        () => {

            const name =

                document.getElementById(

                    "userName"

                )?.value.trim() || "";


            const diaryName =

                document.getElementById(

                    "diaryNick"

                )?.value.trim() || "";


            if (!name) {

                alert(

                    "enter your name first ♡"

                );

                return;

            }


            if (!diaryName) {

                alert(

                    "give your diary a little name ♡"

                );

                return;

            }


            initDiary(

                name,

                diaryName

            );

        }

    );
}


/* =========================
   GUEST
========================= */


const guestButton =

    document.getElementById(

        "guestStartBtn"

    );


if (guestButton) {

    guestButton.addEventListener(

        "click",

        () => {

            firebaseUser = null;


            initDiary(

                "friend",

                "my little diary"

            );

        }

    );
}


/* =========================
   SAVE ENTRY
========================= */


const saveButton =

    document.getElementById(

        "saveEntryBtn"

    );


if (saveButton) {

    saveButton.addEventListener(

        "click",

        () => {

            const date =

                document.getElementById(

                    "entryDate"

                )?.value || "";


            const title =

                document.getElementById(

                    "entryTitle"

                )?.value.trim() || "";


            const text =

                document.getElementById(

                    "entryText"

                )?.value.trim() || "";


            if (!text) {

                alert(

                    "write something before saving your entry ♡"

                );

                return;

            }


            const response =

                getSmartResponse(

                    text,

                    selectedMood

                );


            const entry = {

                id: Date.now(),

                date:

                    date ||

                    new Date()

                        .toISOString()

                        .split("T")[0],

                title:

                    title ||

                    "untitled moment",

                text: text,

                mood: selectedMood,

                response: response

            };


            diaryEntries.push(entry);


            lastResponse = response;


            saveAll();

            renderEntries();

            updateStats();

            renderMoodGraph();


            const responseBox =

                document.getElementById(

                    "responseBox"

                );


            if (responseBox) {

                responseBox.innerText =

                    response;

            }


            document.getElementById(

                "entryTitle"

            ).value = "";


            document.getElementById(

                "entryText"

            ).value = "";


            setTodaysDate();


            alert(

                "your little entry has been saved ♡"

            );

        }

    );
}


/* =========================
   REFLECT
========================= */


const reflectButton =

    document.getElementById(

        "refreshResponseBtn"

    );


if (reflectButton) {

    reflectButton.addEventListener(

        "click",

        updateResponse

    );
}


/* =========================
   RESET
========================= */


const resetButton =

    document.getElementById(

        "resetAllBtn"

    );


if (resetButton) {

    resetButton.addEventListener(

        "click",

        () => {

            const confirmed =

                confirm(

                    "are you sure you want to start over? ♡"

                );


            if (!confirmed) return;


            localStorage.removeItem(

                getStorageKey()

            );


            diaryEntries = [];

            lastResponse = "";

            selectedMood = "🌸 soft";


            renderEntries();

            updateStats();

            renderMoodGraph();


            const responseBox =

                document.getElementById(

                    "responseBox"

                );


            if (responseBox) {

                responseBox.innerText =

                    "✨ write something — I'll read it carefully.";

            }


            setTodaysDate();

        }

    );
}


/* =========================
   WEATHER
========================= */


async function getWeather(city) {

    const result =

        document.getElementById(

            "weatherResult"

        );


    if (!result) return;


    if (!city.trim()) {

        result.innerText =

            "enter a city first ♡";

        return;

    }


    result.innerText =

        "checking the weather... ☁️";


    try {

        const geoResponse =

            await fetch(

                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`

            );


        const geoData =

            await geoResponse.json();


        if (

            !geoData.results ||

            geoData.results.length === 0

        ) {

            result.innerText =

                "i couldn't find that city ♡";

            return;

        }


        const location =

            geoData.results[0];


        const weatherResponse =

            await fetch(

                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`

            );


        const weatherData =

            await weatherResponse.json();


        const current =

            weatherData.current;


        const description =

            getWeatherDescription(

                current.weather_code

            );


        result.innerHTML = `

            <div>

                <strong

                    style="

                        font-size:1.8rem;

                        color:#b47d9e;

                    "

                >

                    ${Math.round(

                        current.temperature_2m

                    )}°C

                </strong>


                <div>

                    ${description}

                </div>


                <div

                    style="

                        font-size:0.7rem;

                        margin-top:5px;

                    "

                >

                    📍 ${escapeHtml(

                        location.name

                    )}

                </div>


                <div

                    style="

                        font-size:0.7rem;

                        margin-top:5px;

                    "

                >

                    feels like

                    ${Math.round(

                        current.apparent_temperature

                    )}°C

                    · humidity

                    ${current.relative_humidity_2m}%

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(

            "Weather error:",

            error

        );


        result.innerText =

            "couldn't get the weather right now ♡";

    }

}


function getWeatherDescription(code) {

    const descriptions = {

        0: "clear sky ☀️",

        1: "mostly clear 🌤️",

        2: "partly cloudy ⛅",

        3: "overcast ☁️",

        45: "foggy 🌫️",

        48: "foggy 🌫️",

        51: "light drizzle 🌦️",

        53: "drizzle 🌦️",

        55: "heavy drizzle 🌧️",

        61: "light rain 🌦️",

        63: "rain 🌧️",

        65: "heavy rain 🌧️",

        71: "light snow ❄️",

        73: "snow ❄️",

        75: "heavy snow ❄️",

        80: "rain showers 🌦️",

        81: "rain showers 🌧️",

        82: "heavy rain showers 🌧️",

        95: "thunderstorm ⛈️",

        96: "thunderstorm with hail ⛈️",

        99: "heavy thunderstorm ⛈️"

    };


    return (

        descriptions[code] ||

        "weather right now 🌤️"

    );
}


const weatherButton =

    document.getElementById(

        "weatherBtn"

    );


if (weatherButton) {

    weatherButton.addEventListener(

        "click",

        () => {

            const city =

                document.getElementById(

                    "weatherCity"

                )?.value || "";


            getWeather(city);

        }

    );
}


const weatherInput =

    document.getElementById(

        "weatherCity"

    );


if (weatherInput) {

    weatherInput.addEventListener(

        "keydown",

        event => {

            if (event.key === "Enter") {

                getWeather(

                    weatherInput.value

                );

            }

        }

    );
}


/* =========================
   INITIAL SETUP
========================= */


document.addEventListener(

    "DOMContentLoaded",

    () => {

        setTodaysDate();

        bindMoods();

        handleGoogleRedirect();

    }

);
