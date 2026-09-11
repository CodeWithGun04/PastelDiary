import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAikl4RKUs6L31vAnoNTEj7Q0nSlgydQz4",
    authDomain: "pasteldiary-61e12.firebaseapp.com",
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


function setTodaysDate() {
    const dateInput = document.getElementById("entryDate");

    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        dateInput.value = formattedDate;
    }
}


function getMoodValue(mood) {
    const moodScores = {
        "🌸 soft": 3,
        "😊 happy": 5,
        "✨ excited": 5,
        "😌 calm": 4,
        "🥰 loved": 5,
        "🌱 peaceful": 4,
        "😐 okay": 3,
        "😔 sad": 2,
        "😣 stressed": 2,
        "😭 overwhelmed": 1,
        "😡 angry": 1,
        "😴 tired": 2
    };

    return moodScores[mood] || 3;
}


function getSmartResponse(text, mood) {
    const content = (text || "").toLowerCase();

    if (!content.trim()) {
        return "write a little something and i'll reflect on it with you ♡";
    }

    if (
        content.includes("happy") ||
        content.includes("good") ||
        content.includes("amazing") ||
        content.includes("excited") ||
        mood.includes("happy") ||
        mood.includes("excited")
    ) {
        return "you sound really happy today ♡ hold onto this little moment and remember what made it special.";
    }

    if (
        content.includes("sad") ||
        content.includes("cry") ||
        content.includes("lonely") ||
        content.includes("upset") ||
        mood.includes("sad")
    ) {
        return "it sounds like today felt a little heavy. you don't have to have everything figured out right now. be gentle with yourself ♡";
    }

    if (
        content.includes("stress") ||
        content.includes("exam") ||
        content.includes("deadline") ||
        content.includes("assignment") ||
        mood.includes("stressed") ||
        mood.includes("overwhelmed")
    ) {
        return "you've got a lot on your mind right now. take things one tiny step at a time — you don't have to solve everything at once 🌷";
    }

    if (
        content.includes("tired") ||
        content.includes("sleep") ||
        content.includes("exhausted") ||
        mood.includes("tired")
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
    const responseElement = document.getElementById("smartResponse");

    if (!responseElement) return;

    const text = document.getElementById("entryText")?.value || "";

    lastResponse = getSmartResponse(text, selectedMood);

    responseElement.innerText = lastResponse;
}


function renderMoodGraph() {
    const graph = document.getElementById("moodGraph");

    if (!graph) return;

    if (diaryEntries.length === 0) {
        graph.innerHTML = `
            <div class="empty-graph">
                <span>🌸</span>
                <p>your mood graph will appear here</p>
            </div>
        `;
        return;
    }

    const recentEntries = diaryEntries.slice(-7);

    const maxHeight = 140;

    graph.innerHTML = recentEntries.map((entry) => {
        const value = getMoodValue(entry.mood);
        const height = Math.max(25, (value / 5) * maxHeight);

        const date = new Date(entry.date + "T00:00:00");
        const label = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        return `
            <div class="graph-item">
                <div class="graph-bar" style="height:${height}px"></div>
                <span>${entry.mood?.split(" ")[0] || "🌸"}</span>
                <small>${label}</small>
            </div>
        `;
    }).join("");
}


function updateStats() {
    const totalEntries = document.getElementById("totalEntries");
    const averageMood = document.getElementById("averageMood");
    const currentStreak = document.getElementById("currentStreak");

    if (totalEntries) {
        totalEntries.innerText = diaryEntries.length;
    }

    if (averageMood) {
        if (diaryEntries.length === 0) {
            averageMood.innerText = "—";
        } else {
            const total = diaryEntries.reduce(
                (sum, entry) => sum + getMoodValue(entry.mood),
                0
            );

            const average = total / diaryEntries.length;

            averageMood.innerText = average.toFixed(1);
        }
    }

    if (currentStreak) {
        if (diaryEntries.length === 0) {
            currentStreak.innerText = "0";
        } else {
            const dates = diaryEntries
                .map(entry => entry.date)
                .sort()
                .reverse();

            let streak = 1;

            for (let i = 0; i < dates.length - 1; i++) {
                const current = new Date(dates[i]);
                const previous = new Date(dates[i + 1]);

                const difference =
                    (current - previous) / (1000 * 60 * 60 * 24);

                if (difference <= 1) {
                    streak++;
                } else {
                    break;
                }
            }

            currentStreak.innerText = streak;
        }
    }
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text ?? "";
    return div.innerHTML;
}


function renderEntries() {
    const entriesContainer = document.getElementById("entriesContainer");

    if (!entriesContainer) return;

    if (diaryEntries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <p>your diary is waiting for its first little story ♡</p>
            </div>
        `;
        return;
    }

    const sortedEntries = [...diaryEntries].reverse();

    entriesContainer.innerHTML = sortedEntries.map((entry) => `
        <div class="diary-entry">
            <div class="entry-top">
                <div>
                    <span class="entry-mood">${escapeHtml(entry.mood || "🌸 soft")}</span>
                    <h3>${escapeHtml(entry.title || "untitled moment")}</h3>
                </div>

                <span class="entry-date">
                    ${escapeHtml(entry.date || "")}
                </span>
            </div>

            <p class="entry-content">
                ${escapeHtml(entry.text || "")}
            </p>

            ${
                entry.response
                    ? `
                        <div class="entry-reflection">
                            <strong>✨ little reflection</strong>
                            <p>${escapeHtml(entry.response)}</p>
                        </div>
                    `
                    : ""
            }
        </div>
    `).join("");
}


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
    const saved = localStorage.getItem(getStorageKey());

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
    } catch (error) {
        console.error("Could not load diary data:", error);

        diaryEntries = [];
        lastResponse = "";
        selectedMood = "🌸 soft";
    }
}


function moodClick(moodElement) {
    document.querySelectorAll(".mood").forEach(mood => {
        mood.classList.remove("selected");
    });

    moodElement.classList.add("selected");

    selectedMood = moodElement.innerText.trim();

    updateResponse();
}


function bindMoods() {
    const moods = document.querySelectorAll(".mood");

    moods.forEach(mood => {
        mood.addEventListener("click", () => {
            moodClick(mood);
        });
    });
}


function initDiary(user, diaryNick) {
    currentUser = user || "friend";
    currentDiaryName = diaryNick || "my little diary";

    loadUser();

    const setupView = document.getElementById("setupView");
    const diaryView = document.getElementById("diaryView");

    if (setupView) {
        setupView.style.display = "none";
    }

    if (diaryView) {
        diaryView.style.display = "block";
    }

    const welcomeName = document.getElementById("welcomeName");
    const displayedDiaryName = document.getElementById("displayedDiaryName");

    if (welcomeName) {
        welcomeName.innerText = currentUser;
    }

    if (displayedDiaryName) {
        displayedDiaryName.innerText = currentDiaryName;
    }

    setTodaysDate();
    bindMoods();

    const selectedMoodElement = [...document.querySelectorAll(".mood")]
        .find(mood => mood.innerText.trim() === selectedMood);

    if (selectedMoodElement) {
        selectedMoodElement.classList.add("selected");
    }

    renderEntries();
    updateStats();
    renderMoodGraph();

    const responseElement = document.getElementById("smartResponse");

    if (responseElement) {
        responseElement.innerText =
            lastResponse ||
            "write something in your diary and i'll reflect on it with you ♡";
    }
}


async function signInWithGoogle() {
    const button = document.getElementById("googleSignInBtn");

    if (button) {
        button.disabled = true;
        button.innerText = "✨ signing you in...";
    }

    try {
        console.log("Starting Google sign-in...");

        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        const user = result.user;

        firebaseUser = user;

        console.log("Google sign-in successful:", user.email);

        currentUser = user.displayName || "friend";

        const userNameInput = document.getElementById("userName");

        if (userNameInput) {
            userNameInput.value = currentUser;
        }

        const diaryNickInput = document.getElementById("diaryNick");

        if (diaryNickInput) {
            diaryNickInput.value = "my little diary";
        }

        initDiary(
            currentUser,
            "my little diary"
        );

    } catch (error) {
        console.error("GOOGLE AUTH ERROR");
        console.error("code:", error.code);
        console.error("message:", error.message);

        let message = "something went wrong while signing you in ♡";

        if (error.code === "auth/popup-closed-by-user") {
            message = "the Google sign-in window was closed.";
        }

        if (error.code === "auth/popup-blocked") {
            message = "your browser blocked the Google sign-in popup.";
        }

        if (error.code === "auth/unauthorized-domain") {
            message = "this website is not authorized in Firebase yet.";
        }

        alert(message);

    } finally {
        if (button) {
            button.disabled = false;
            button.innerText = "✨ Continue with Google";
        }
    }
}


const googleButton = document.getElementById("googleSignInBtn");

if (googleButton) {
    googleButton.addEventListener(
        "click",
        signInWithGoogle
    );
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        firebaseUser = user;

        console.log(
            "Firebase user:",
            user.displayName,
            user.email,
            user.uid
        );
    } else {
        firebaseUser = null;

        console.log("No Firebase user signed in.");
    }
});


const startDiaryButton = document.getElementById("startDiaryBtn");

if (startDiaryButton) {
    startDiaryButton.addEventListener("click", () => {
        const name =
            document.getElementById("userName")?.value || "";

        const diaryNick =
            document.getElementById("diaryNick")?.value || "";

        if (!name.trim()) {
            alert("enter your name ♡");
            return;
        }

        firebaseUser = null;

        initDiary(
            name.trim(),
            diaryNick.trim() || "my little diary"
        );
    });
}


const guestButton = document.getElementById("guestStartBtn");

if (guestButton) {
    guestButton.addEventListener("click", () => {
        firebaseUser = null;

        initDiary(
            "friend",
            "my little diary"
        );
    });
}


const saveEntryButton = document.getElementById("saveEntryBtn");

if (saveEntryButton) {
    saveEntryButton.addEventListener("click", () => {
        const date =
            document.getElementById("entryDate")?.value || "";

        const title =
            document.getElementById("entryTitle")?.value || "";

        const text =
            document.getElementById("entryText")?.value || "";

        if (!text.trim()) {
            alert("write something before saving your entry ♡");
            return;
        }

        const response = getSmartResponse(
            text,
            selectedMood
        );

        const entry = {
            id: Date.now(),
            date: date || new Date().toISOString().split("T")[0],
            title: title.trim() || "untitled moment",
            text: text.trim(),
            mood: selectedMood,
            response: response
        };

        diaryEntries.push(entry);

        lastResponse = response;

        saveAll();
        renderEntries();
        updateStats();
        renderMoodGraph();

        const responseElement =
            document.getElementById("smartResponse");

        if (responseElement) {
            responseElement.innerText = response;
        }

        const titleInput =
            document.getElementById("entryTitle");

        const textInput =
            document.getElementById("entryText");

        if (titleInput) {
            titleInput.value = "";
        }

        if (textInput) {
            textInput.value = "";
        }

        setTodaysDate();

        alert("your little entry has been saved ♡");
    });
}


const reflectButton =
    document.getElementById("refreshResponseBtn");

if (reflectButton) {
    reflectButton.addEventListener("click", () => {
        updateResponse();
    });
}


const resetButton =
    document.getElementById("resetAllBtn");

if (resetButton) {
    resetButton.addEventListener("click", () => {
        const confirmed = confirm(
            "are you sure you want to reset this diary?"
        );

        if (!confirmed) return;

        diaryEntries = [];
        lastResponse = "";
        selectedMood = "🌸 soft";

        localStorage.removeItem(
            getStorageKey()
        );

        renderEntries();
        updateStats();
        renderMoodGraph();

        const responseElement =
            document.getElementById("smartResponse");

        if (responseElement) {
            responseElement.innerText =
                "your diary is fresh again ♡";
        }

        setTodaysDate();
    });
}


async function getWeather(city) {
    const weatherResult =
        document.getElementById("weatherResult");

    if (!weatherResult) return;

    if (!city.trim()) {
        weatherResult.innerText =
            "enter a city first ♡";
        return;
    }

    weatherResult.innerText =
        "checking the weather... ☁️";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Could not find city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherResult.innerText =
                "i couldn't find that city ♡";
            return;
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Could not fetch weather");
        }

        const weatherData =
            await weatherResponse.json();

        const current =
            weatherData.current;

        const description =
            getWeatherDescription(
                current.weather_code
            );

        weatherResult.innerHTML = `
            <div class="weather-card">
                <div class="weather-location">
                    📍 ${escapeHtml(location.name)}
                </div>

                <div class="weather-main">
                    <strong>${Math.round(current.temperature_2m)}°C</strong>
                    <span>${description}</span>
                </div>

                <div class="weather-details">
                    Feels like ${Math.round(current.apparent_temperature)}°C
                    · Humidity ${current.relative_humidity_2m}%
                    · Wind ${Math.round(current.wind_speed_10m)} km/h
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Weather error:", error);

        weatherResult.innerText =
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

    return descriptions[code] || "weather right now 🌤️";
}


const weatherButton =
    document.getElementById("weatherBtn");

if (weatherButton) {
    weatherButton.addEventListener("click", () => {
        const city =
            document.getElementById("weatherCity")?.value || "";

        getWeather(city);
    });
}


const weatherCityInput =
    document.getElementById("weatherCity");

if (weatherCityInput) {
    weatherCityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const city =
                weatherCityInput.value || "";

            getWeather(city);
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setTodaysDate();
    bindMoods();
});
