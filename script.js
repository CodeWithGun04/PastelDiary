let diaryEntries = [];
let currentUser = "";
let currentDiaryName = "";
let lastResponse = "";
let selectedMood = "";

const moodScores = {
    "🌸 soft": 3,
    "💔 heavy": 2,
    "😔 sad": 2,
    "🫂 lonely": 2,
    "🌀 anxious": 2,
    "🌙 tired": 2,
    "😤 angry": 1,
    "💖 hopeful": 4
};

function getStorageKey() {
    return `diary_${currentUser || "friend"}`;
}

function saveData() {
    localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
            user: currentUser,
            diaryName: currentDiaryName,
            entries: diaryEntries
        })
    );
}

function loadData() {
    const saved = localStorage.getItem(getStorageKey());

    if (!saved) {
        diaryEntries = [];
        return;
    }

    try {
        const data = JSON.parse(saved);

        diaryEntries = Array.isArray(data.entries)
            ? data.entries
            : [];
    } catch {
        diaryEntries = [];
    }
}

function setTodaysDate() {
    const dateInput = document.getElementById("entryDate");

    if (!dateInput) return;

    const today = new Date();

    dateInput.value =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function bindMoods() {
    document.querySelectorAll(".mood").forEach(mood => {
        mood.addEventListener("click", () => {
            document.querySelectorAll(".mood").forEach(item => {
                item.classList.remove("selected");
            });

            mood.classList.add("selected");
            selectedMood = mood.dataset.mood || mood.textContent.trim();
        });
    });
}

function initDiary(name, diaryName) {
    currentUser = name.trim() || "friend";
    currentDiaryName = diaryName.trim() || "my diary";

    loadData();

    document.getElementById("setupView").style.display = "none";
    document.getElementById("diaryView").style.display = "block";

    document.getElementById("mainTitle").textContent =
        `🕯️ ${currentDiaryName}`;

    document.getElementById("mainSub").textContent =
        `a pastel place to write, ${currentUser} ♡`;

    setTodaysDate();
    updateDashboard();
    renderEntries();
    renderMoodGraph();
    updateMoodSummary();
    updateReflection();
}

function calculateAverageMood() {
    if (!diaryEntries.length) return 0;

    const total = diaryEntries.reduce((sum, entry) => {
        return sum + (moodScores[entry.mood] || 0);
    }, 0);

    return total / diaryEntries.length;
}

function getMainMood() {
    if (!diaryEntries.length) return "—";

    const counts = {};

    diaryEntries.forEach(entry => {
        if (entry.mood) {
            counts[entry.mood] =
                (counts[entry.mood] || 0) + 1;
        }
    });

    const moods = Object.keys(counts);

    if (!moods.length) return "—";

    return moods.sort(
        (a, b) => counts[b] - counts[a]
    )[0];
}

function calculateWords() {
    return diaryEntries.reduce((total, entry) => {
        const words = (entry.text || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        return total + words.length;
    }, 0);
}

function getLastSevenDaysCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    return diaryEntries.filter(entry => {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);

        return date >= sevenDaysAgo && date <= today;
    }).length;
}

function calculateStreak() {
    if (!diaryEntries.length) return 0;

    const dates = [
        ...new Set(
            diaryEntries
                .map(entry => entry.date)
                .filter(Boolean)
        )
    ].sort().reverse();

    if (!dates.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let expectedDate = new Date(today);

    for (const dateString of dates) {
        const entryDate = new Date(dateString);
        entryDate.setHours(0, 0, 0, 0);

        const difference =
            Math.round(
                (expectedDate - entryDate) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 0) {
            streak++;

            expectedDate.setDate(
                expectedDate.getDate() - 1
            );
        } else if (streak === 0 && difference === 1) {
            streak++;

            expectedDate = new Date(entryDate);
            expectedDate.setDate(
                expectedDate.getDate() - 1
            );
        } else {
            break;
        }
    }

    return streak;
}

function updateDashboard() {
    const statEntries = document.getElementById("statEntries");
    const statStreak = document.getElementById("statStreak");
    const statWeek = document.getElementById("statWeek");
    const statMood = document.getElementById("statMood");
    const statWords = document.getElementById("statWords");
    const statAverage = document.getElementById("statAverage");

    statEntries.textContent = diaryEntries.length;
    statStreak.textContent = calculateStreak();
    statWeek.textContent = getLastSevenDaysCount();
    statMood.textContent = getMainMood();
    statWords.textContent = calculateWords();

    const average = calculateAverageMood();

    statAverage.textContent =
        average ? average.toFixed(1) : "—";
}

function renderMoodGraph() {
    const container =
        document.getElementById("moodGraphContainer");

    if (!container) return;

    container.innerHTML = "";

    if (!diaryEntries.length) {
        container.innerHTML = `
            <div class="no-graph">
                📝 write entries to see your mood graph
            </div>
        `;
        return;
    }

    const bars = document.createElement("div");
    bars.className = "bars";

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);

        date.setDate(today.getDate() - i);

        const dateString =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        const entriesForDay =
            diaryEntries.filter(
                entry => entry.date === dateString
            );

        let average = 0;

        if (entriesForDay.length) {
            average =
                entriesForDay.reduce(
                    (sum, entry) =>
                        sum + (moodScores[entry.mood] || 0),
                    0
                ) / entriesForDay.length;
        }

        const item = document.createElement("div");
        item.className = "bar-item";

        const bar = document.createElement("div");
        bar.className = "bar";

        const label = document.createElement("div");
        label.className = "bar-label";

        label.textContent =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });

        const emoji = document.createElement("div");
        emoji.className = "bar-emoji";

        const dayMood =
            entriesForDay.length
                ? entriesForDay[0].mood
                : "";

        emoji.textContent =
            dayMood
                ? dayMood.split(" ")[0]
                : "";

        bar.style.height =
            average
                ? `${Math.max(18, average * 30)}px`
                : "8px";

        item.appendChild(bar);
        item.appendChild(emoji);
        item.appendChild(label);

        bars.appendChild(item);
    }

    container.appendChild(bars);
}

function updateMoodSummary() {
    const summary =
        document.getElementById("moodSummary");

    if (!summary) return;

    if (!diaryEntries.length) {
        summary.textContent =
            "🌷 your mood story will appear here";
        return;
    }

    const mood = getMainMood();

    const moodMessages = {
        "🌸 soft": "you've been carrying a gentle, softer energy lately 🌸",
        "💔 heavy": "things have felt a little heavy lately. be gentle with yourself 💔",
        "😔 sad": "there's been some sadness in your recent pages. it's okay to let yourself feel it 😔",
        "🫂 lonely": "your recent pages mention loneliness. remember that your feelings deserve space too 🫂",
        "🌀 anxious": "your mind seems to have been a little busy lately. take things one small step at a time 🌀",
        "🌙 tired": "your recent entries feel a little tired. rest is allowed 🌙",
        "😤 angry": "there's been some frustration in your recent pages. give yourself room to breathe 😤",
        "💖 hopeful": "there's a hopeful little thread running through your recent pages. hold onto it 💖"
    };

    summary.textContent =
        moodMessages[mood] ||
        "🌷 your mood story is slowly taking shape";
}

function createReflection(entry) {
    const text = (entry.text || "").toLowerCase();
    const mood = entry.mood || "";

    if (
        text.includes("thank") ||
        text.includes("grateful") ||
        text.includes("happy")
    ) {
        return "there's something warm in the way you wrote this. hold onto the little things that made today feel good ♡";
    }

    if (
        text.includes("stress") ||
        text.includes("stressed") ||
        text.includes("overwhelmed") ||
        text.includes("anxious")
    ) {
        return "it sounds like your mind has been carrying a lot. you don't have to solve everything tonight. one small thing at a time ♡";
    }

    if (
        text.includes("sad") ||
        text.includes("cry") ||
        text.includes("hurt") ||
        mood.includes("sad") ||
        mood.includes("heavy")
    ) {
        return "this sounds like a heavy moment. be gentle with yourself — feeling something deeply doesn't mean you're doing anything wrong ♡";
    }

    if (
        text.includes("lonely") ||
        text.includes("alone") ||
        mood.includes("lonely")
    ) {
        return "loneliness can make everything feel a little louder. putting your feelings into words is already a small way of staying connected to yourself ♡";
    }

    if (
        text.includes("angry") ||
        text.includes("annoyed") ||
        mood.includes("angry")
    ) {
        return "there's clearly some strong emotion here. give yourself permission to feel it before trying to make sense of it ♡";
    }

    if (mood.includes("hopeful")) {
        return "there's a little hope hiding in this entry. protect that feeling, even if it's tiny — tiny things count too ♡";
    }

    if (mood.includes("tired")) {
        return "you sound like you could use some softness today. rest isn't something you have to earn ♡";
    }

    return "thank you for putting this moment into words. sometimes writing things down is enough to make them feel a little lighter ♡";
}

function updateReflection(entry = null) {
    const responseBox =
        document.getElementById("responseBox");

    if (!responseBox) return;

    if (!entry) {
        if (!diaryEntries.length) {
            responseBox.textContent =
                "✨ write something — I'll read it carefully.";
            return;
        }

        entry = diaryEntries[0];
    }

    lastResponse = createReflection(entry);
    responseBox.textContent = lastResponse;
}

function renderEntries() {
    const container =
        document.getElementById("entriesFeed");

    if (!container) return;

    container.innerHTML = "";

    if (!diaryEntries.length) {
        container.innerHTML = `
            <div class="no-graph">
                🌷 nothing yet. write your first page ♡
            </div>
        `;
        return;
    }

    [...diaryEntries].forEach(entry => {
        const item = document.createElement("div");
        item.className = "entry-item";

        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";

        deleteButton.addEventListener("click", () => {
            diaryEntries =
                diaryEntries.filter(
                    savedEntry => savedEntry.id !== entry.id
                );

            saveData();
            updateDashboard();
            renderEntries();
            renderMoodGraph();
            updateMoodSummary();
            updateReflection();
        });

        const title =
            document.createElement("strong");

        title.textContent =
            entry.title || "untitled";

        const date =
            document.createElement("div");

        date.style.fontSize = "0.7rem";
        date.style.color = "#b8a9c2";
        date.style.margin = "5px 0";

        date.textContent =
            formatDate(entry.date);

        const mood =
            document.createElement("div");

        mood.style.fontSize = "0.8rem";
        mood.style.marginBottom = "6px";

        mood.textContent =
            entry.mood || "";

        const content =
            document.createElement("div");

        content.className =
            "entry-content-preview";

        content.textContent =
            entry.text || "";

        item.appendChild(deleteButton);
        item.appendChild(title);
        item.appendChild(date);
        item.appendChild(mood);
        item.appendChild(content);

        container.appendChild(item);
    });
}

function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function saveEntry() {
    const date =
        document.getElementById("entryDate");

    const title =
        document.getElementById("entryTitle");

    const text =
        document.getElementById("entryText");

    if (!text.value.trim()) {
        alert("write something first ♡");
        return;
    }

    if (!selectedMood) {
        alert("choose a mood first ♡");
        return;
    }

    const entry = {
        id: Date.now(),
        date: date.value,
        title: title.value.trim() || "untitled",
        text: text.value.trim(),
        mood: selectedMood
    };

    diaryEntries.unshift(entry);

    saveData();

    title.value = "";
    text.value = "";

    document.querySelectorAll(".mood").forEach(mood => {
        mood.classList.remove("selected");
    });

    selectedMood = "";

    updateDashboard();
    renderEntries();
    renderMoodGraph();
    updateMoodSummary();
    updateReflection(entry);

    alert("your entry has been saved ♡");
}

function refreshReflection() {
    if (!diaryEntries.length) {
        updateReflection();
        return;
    }

    const randomEntry =
        diaryEntries[
            Math.floor(
                Math.random() * diaryEntries.length
            )
        ];

    updateReflection(randomEntry);
}

async function getWeather() {
    const cityInput =
        document.getElementById("weatherCity");

    const result =
        document.getElementById("weatherResult");

    const city =
        cityInput.value.trim();

    if (!city) {
        result.textContent =
            "enter a city first ♡";
        return;
    }

    result.textContent =
        "checking the sky... ☁️";

    try {
        const geoResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );

        if (!geoResponse.ok) {
            throw new Error("geocoding failed");
        }

        const geoData =
            await geoResponse.json();

        if (
            !geoData.results ||
            !geoData.results.length
        ) {
            result.textContent =
                "i couldn't find that city ♡";
            return;
        }

        const location =
            geoData.results[0];

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            );

        if (!weatherResponse.ok) {
            throw new Error("weather request failed");
        }

        const weatherData =
            await weatherResponse.json();

        const current =
            weatherData.current;

        result.innerHTML = `
            <strong>${escapeHTML(location.name)}</strong><br>
            ${getWeatherEmoji(current.weather_code)}
            ${getWeatherDescription(current.weather_code)}
            · ${Math.round(current.temperature_2m)}°C<br>
            humidity ${current.relative_humidity_2m}% · wind ${Math.round(current.wind_speed_10m)} km/h
        `;
    } catch (error) {
        console.error("Weather error:", error);

        result.textContent =
            "couldn't check the weather right now ♡";
    }
}

function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "🌤️";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    if (code <= 86) return "🌨️";

    return "⛈️";
}

function getWeatherDescription(code) {
    if (code === 0) return "clear sky";
    if (code <= 3) return "partly cloudy";
    if (code <= 48) return "foggy";
    if (code <= 67) return "rainy";
    if (code <= 77) return "snowy";
    if (code <= 82) return "showery";
    if (code <= 86) return "snow showers";

    return "thunderstorm";
}

function resetDiary() {
    const confirmed =
        confirm(
            "are you sure you want to reset this diary? this will remove all your saved entries ♡"
        );

    if (!confirmed) return;

    localStorage.removeItem(
        getStorageKey()
    );

    diaryEntries = [];
    selectedMood = "";
    currentUser = "";
    currentDiaryName = "";

    document.getElementById("diaryView").style.display =
        "none";

    document.getElementById("setupView").style.display =
        "block";

    document.getElementById("userName").value = "";
    document.getElementById("diaryNick").value = "";

    updateDashboard();
    renderEntries();
    renderMoodGraph();
    updateMoodSummary();
    updateReflection();
}

document.addEventListener("DOMContentLoaded", () => {
    setTodaysDate();
    bindMoods();

    document
        .getElementById("startDiaryBtn")
        ?.addEventListener("click", () => {
            const name =
                document.getElementById("userName").value.trim();

            const diaryName =
                document.getElementById("diaryNick").value.trim();

            if (!name) {
                alert("enter your name first ♡");
                return;
            }

            if (!diaryName) {
                alert("give your diary a name ♡");
                return;
            }

            initDiary(name, diaryName);
        });

    document
        .getElementById("guestStartBtn")
        ?.addEventListener("click", () => {
            initDiary(
                "friend",
                "my little diary"
            );
        });

    document
        .getElementById("saveEntryBtn")
        ?.addEventListener("click", saveEntry);

    document
        .getElementById("refreshResponseBtn")
        ?.addEventListener("click", refreshReflection);

    document
        .getElementById("weatherBtn")
        ?.addEventListener("click", getWeather);

    document
        .getElementById("resetAllBtn")
        ?.addEventListener("click", resetDiary);

    updateDashboard();
    renderEntries();
    renderMoodGraph();
    updateMoodSummary();
    updateReflection();
});
