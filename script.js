/* =========================
   FIREBASE
========================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyAikl4RKUs6L31vAnoNTEj7Q0nSlgydQz4",

    authDomain:
        "pasteldiary-61e12.firebaseapp.com",

    projectId:
        "pasteldiary-61e12",

    storageBucket:
        "pasteldiary-61e12.firebasestorage.app",

    messagingSenderId:
        "615784663317",

    appId:
        "1:615784663317:web:9576c7dd28c0f93343c11c"

};


const firebaseApp =
    initializeApp(firebaseConfig);


const auth =
    getAuth(firebaseApp);


const googleProvider =
    new GoogleAuthProvider();


/* =========================
   GLOBAL VARIABLES
========================= */

let diaryEntries = [];

let currentUser = "";

let currentDiaryName = "";

let lastResponse = "";

let selectedMood = "🌸 soft";

let firebaseUser = null;


/* =========================
   DATE
========================= */

function setTodaysDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const todayString =
        `${year}-${month}-${day}`;


    const dateInput =
        document.getElementById(
            "entryDate"
        );


    if (dateInput) {

        dateInput.value =
            todayString;

    }

}


/* =========================
   MOOD VALUES
========================= */

function getMoodValue(moodStr) {

    const map = {

        "🌸 soft": 5,

        "💖 hopeful": 4,

        "💔 heavy": 2,

        "😔 sad": 2,

        "🫂 lonely": 1.5,

        "🌀 anxious": 2.5,

        "🌙 tired": 2,

        "😤 angry": 2.8

    };


    return map[moodStr] || 3;

}


/* =========================
   SMART REFLECTION
========================= */

function getSmartResponse(
    text,
    userName,
    allEntries
) {

    const lower =
        text.toLowerCase();


    const name =
        userName || "you";


    let emotion = null;


    if (

        lower.includes("hopeless") ||

        lower.includes("worthless") ||

        lower.includes("numb") ||

        lower.includes("nothing matters") ||

        lower.includes("give up") ||

        lower.includes("no point") ||

        lower.includes("want to die") ||

        lower.includes("end it")

    ) {

        emotion =
            "hopeless";

    }


    else if (

        lower.includes("lonely") ||

        lower.includes("alone") ||

        lower.includes("akela") ||

        lower.includes("nobody") ||

        lower.includes("no one") ||

        lower.includes("by myself") ||

        lower.includes("isolated") ||

        lower.includes("abandoned") ||

        lower.includes("left out") ||

        lower.includes("unseen") ||

        lower.includes("invisible")

    ) {

        emotion =
            "lonely";

    }


    else if (

        lower.includes("sad") ||

        lower.includes("depressed") ||

        lower.includes("heartbroken") ||

        lower.includes("grief") ||

        lower.includes("hurt") ||

        lower.includes("pain") ||

        lower.includes("crying") ||

        lower.includes("tears") ||

        lower.includes("empty") ||

        lower.includes("miserable") ||

        lower.includes("unhappy") ||

        lower.includes("down") ||

        lower.includes("low")

    ) {

        emotion =
            "sad";

    }


    else if (

        lower.includes("anxious") ||

        lower.includes("anxiety") ||

        lower.includes("nervous") ||

        lower.includes("worry") ||

        lower.includes("worried") ||

        lower.includes("stressed") ||

        lower.includes("panic") ||

        lower.includes("overthinking") ||

        lower.includes("scared") ||

        lower.includes("fear") ||

        lower.includes("dread") ||

        lower.includes("restless") ||

        lower.includes("uneasy")

    ) {

        emotion =
            "anxious";

    }


    else if (

        lower.includes("angry") ||

        lower.includes("mad") ||

        lower.includes("frustrated") ||

        lower.includes("rage") ||

        lower.includes("annoyed") ||

        lower.includes("fed up") ||

        lower.includes("sick of") ||

        lower.includes("pissed") ||

        lower.includes("resentful") ||

        lower.includes("bitter")

    ) {

        emotion =
            "angry";

    }


    else if (

        lower.includes("tired") ||

        lower.includes("exhausted") ||

        lower.includes("drained") ||

        lower.includes("burnout") ||

        lower.includes("no energy") ||

        lower.includes("sleepy") ||

        lower.includes("fatigued") ||

        lower.includes("worn out") ||

        lower.includes("burnt out")

    ) {

        emotion =
            "tired";

    }


    else if (

        lower.includes("happy") ||

        lower.includes("joy") ||

        lower.includes("grateful") ||

        lower.includes("blessed") ||

        lower.includes("good day") ||

        lower.includes("peaceful") ||

        lower.includes("calm") ||

        lower.includes("content") ||

        lower.includes("wonderful") ||

        lower.includes("amazing")

    ) {

        emotion =
            "hopeful";

    }


    let responsePool = [];


    if (emotion === "hopeless") {

        responsePool = [

            `🖤 ${name}, this sounds really heavy. Thank you for writing it down. Please reach out to someone today - a friend, a family member, or a crisis service. You don't have to carry this alone. You matter.`,

            `🖤 ${name}, I'm really glad you wrote this. Hopelessness can make the future feel fixed, but feelings can change. Please reach out to someone you trust and let them know how you're feeling.`,

            `🖤 ${name}, thank you for being honest about feeling this way. That takes courage. Please talk to someone you trust today. You deserve support.`

        ];

    }


    else if (emotion === "lonely") {

        responsePool = [

            `🫂 ${name}, I hear the loneliness in your words. It's like standing in a room full of people and still feeling invisible. You wrote it down though - that's you fighting back. I see you.`,

            `🫂 ${name}, feeling unseen is one of the heaviest feelings. Thank you for trusting this space with it. You're not as alone as it feels right now.`,

            `🫂 ${name}, loneliness can convince us that nobody sees us or cares. But you showed up here. That's proof that some part of you still believes in being heard.`

        ];

    }


    else if (emotion === "sad") {

        responsePool = [

            `🌧️ ${name}, sadness is heavy. You don't have to pretend to be okay here. Just naming it - which you did - is already a step. One breath at a time.`,

            `🌧️ ${name}, I notice the weight in your words. Sadness isn't weakness - it's proof that you care deeply about something. What's on your heart right now?`,

            `🌧️ ${name}, some days are just heavy. There's no need to fix everything at once. But you writing it down means you're not running from it.`

        ];

    }


    else if (emotion === "anxious") {

        responsePool = [

            `🌀 ${name}, anxiety is exhausting. Your mind is running scenarios that haven't happened yet. Try this: name one thing you can see, one you can hear, and one you can feel. You're here right now.`,

            `🌀 ${name}, overthinking is often your brain trying to protect you. That's not weakness. Take one slow breath. Just one. You've got this.`,

            `🌀 ${name}, worry has a loud voice. But you writing it down? That's you taking some power back. What's one small thing that feels certain right now?`

        ];

    }


    else if (emotion === "angry") {

        responsePool = [

            `😤 ${name}, anger is honest. It shows up when something feels unfair. Don't swallow it - but don't let it drive either. What specifically happened?`,

            `😤 ${name}, I hear the frustration. Anger sometimes tells us that something matters deeply to us. What would feel fair to you?`,

            `😤 ${name}, you're angry, and that's information. Now the question is: what action would actually help you?`

        ];

    }


    else if (emotion === "tired") {

        responsePool = [

            `🌙 ${name}, you sound exhausted - not "need coffee" tired, but soul tired. Rest isn't weakness. You've been carrying a lot. Put it down for a bit.`,

            `🌙 ${name}, burnout is real. Pushing through without rest doesn't make you stronger. What's one small thing you can remove from your plate today?`,

            `🌙 ${name}, being tired all the time isn't a personality flaw. It's a signal that something is draining you. You deserve rest.`

        ];

    }


    else if (emotion === "hopeful") {

        responsePool = [

            `☀️ ${name}, this feels different. Joy, gratitude, and peace - these moments matter more than we think. What happened today that contributed to this feeling?`,

            `☀️ ${name}, I'm glad you're sharing a softer moment. These aren't silly - they're anchors. Come back to this feeling when things get hard.`,

            `☀️ ${name}, you wrote about something good. That's not nothing. Feelings change, and good moments deserve to be noticed too.`

        ];

    }


    else {

        responsePool = [

            `📝 ${name}, I read your words. You showed up here - that's not nothing. Writing things down helps. Keep going.`,

            `📝 ${name}, thanks for writing. Not every entry has to be a big emotional release. Sometimes just documenting the day is enough.`,

            `📝 ${name}, I see you. You took a moment to check in with yourself. That's worth something.`

        ];

    }


    let randomIndex =
        Math.floor(
            Math.random() *
            responsePool.length
        );


    let response =
        responsePool[randomIndex];


    if (

        allEntries.length >= 7 &&

        emotion !== "hopeless"

    ) {

        response +=
            `\n\n✍️ You've written ${allEntries.length} entries. That's you showing up for yourself, again and again.`;

    }


    if (

        response === lastResponse &&

        responsePool.length > 1

    ) {

        randomIndex =
            (randomIndex + 1) %
            responsePool.length;


        response =
            responsePool[randomIndex];

    }


    lastResponse =
        response;


    return response;

}


/* =========================
   REFLECTION
========================= */

function updateResponse() {

    const responseBox =
        document.getElementById(
            "responseBox"
        );


    if (!responseBox)
        return;


    if (diaryEntries.length === 0) {

        responseBox.innerHTML =
            `✨ write something, ${currentUser || "you"} — I'll read it carefully.`;

        return;

    }


    const latestEntry =
        diaryEntries[0];


    const fullText =
        `${latestEntry.title || ""} ${latestEntry.content || ""}`;


    const response =
        getSmartResponse(
            fullText,
            currentUser || "you",
            diaryEntries
        );


    responseBox.innerHTML =
        escapeHtml(response)
            .replace(/\n/g, "<br>");

}


/* =========================
   MOOD GRAPH
========================= */

function renderMoodGraph() {

    const container =
        document.getElementById(
            "moodGraphContainer"
        );


    if (!container)
        return;


    if (!diaryEntries.length) {

        container.innerHTML =
            `<div class="no-graph">
                📝 write entries to see your mood graph
            </div>`;

        return;

    }


    const last7 =
        [...diaryEntries]
            .slice(0, 7)
            .reverse();


    let html =
        `<div class="bars">`;


    for (
        let i = 0;
        i < last7.length;
        i++
    ) {

        const entry =
            last7[i];


        const moodValue =
            getMoodValue(
                entry.mood
            );


        const heightPercent =
            (
                (moodValue - 1) /
                4
            ) * 120;


        const barHeight =
            Math.max(
                20,
                Math.min(
                    140,
                    heightPercent
                )
            );


        const moodEmoji =
            (entry.mood || "🌸")
                .split(" ")[0];


        const shortDate =
            entry.date.slice(5);


        let barColor =
            moodValue >= 4

                ? "linear-gradient(180deg, #e8c4e0, #c8a8dc)"

                : moodValue >= 2.5

                    ? "linear-gradient(180deg, #d4c0e8, #b89bc4)"

                    : "linear-gradient(180deg, #c4b0d4, #a088b0)";


        html += `

            <div class="bar-item">

                <div class="bar-emoji">
                    ${moodEmoji}
                </div>

                <div
                    class="bar"
                    style="
                        height:${barHeight}px;
                        background:${barColor};
                    "
                ></div>

                <div class="bar-label">
                    ${shortDate}
                </div>

            </div>

        `;

    }


    html += `

        </div>

        <div
            style="
                font-size:0.6rem;
                text-align:center;
                margin-top:12px;
                color:#b89bc4;
            "
        >
            ↑ higher = lighter · lower = heavier
        </div>

    `;


    container.innerHTML =
        html;

}


/* =========================
   MOOD ANALYTICS
========================= */

function updateStats() {

    const statEntries =
        document.getElementById(
            "statEntries"
        );


    if (!statEntries)
        return;


    const statStreak =
        document.getElementById(
            "statStreak"
        );


    const statWeek =
        document.getElementById(
            "statWeek"
        );


    const statMood =
        document.getElementById(
            "statMood"
        );


    const statWords =
        document.getElementById(
            "statWords"
        );


    const statAverage =
        document.getElementById(
            "statAverage"
        );


    const moodSummary =
        document.getElementById(
            "moodSummary"
        );


    statEntries.innerText =
        diaryEntries.length;


    if (diaryEntries.length === 0) {

        statStreak.innerText = "0";

        statWeek.innerText = "0";

        statMood.innerText = "—";

        statWords.innerText = "0";

        statAverage.innerText = "—";

        moodSummary.innerText =
            "🌷 your mood story will appear here";

        return;

    }


    /* STREAK */

    const uniqueDates = [

        ...new Set(
            diaryEntries.map(
                entry => entry.date
            )
        )

    ]
        .sort()
        .reverse();


    let streak = 1;


    for (
        let i = 0;
        i < uniqueDates.length - 1;
        i++
    ) {

        const diff =

            (
                new Date(
                    uniqueDates[i]
                ) -

                new Date(
                    uniqueDates[i + 1]
                )

            ) /

            (1000 * 3600 * 24);


        if (diff === 1) {

            streak++;

        }

        else {

            break;

        }

    }


    statStreak.innerText =
        streak;


    /* LAST 7 DAYS */

    const today =
        new Date();


    today.setHours(
        23,
        59,
        59,
        999
    );


    const sevenDaysAgo =
        new Date(today);


    sevenDaysAgo.setDate(
        today.getDate() - 6
    );


    sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
    );


    const weekEntries =
        diaryEntries.filter(
            entry => {

                const entryDate =
                    new Date(
                        entry.date +
                        "T00:00:00"
                    );


                return (

                    entryDate >=
                    sevenDaysAgo &&

                    entryDate <=
                    today

                );

            }
        );


    statWeek.innerText =
        weekEntries.length;


    /* MOST COMMON MOOD */

    const moodCounts = {};


    diaryEntries.forEach(
        entry => {

            const mood =
                entry.mood ||
                "🌸 soft";


            moodCounts[mood] =
                (moodCounts[mood] || 0) +
                1;

        }
    );


    let mostCommonMood =
        "";


    let highestCount =
        0;


    Object.keys(
        moodCounts
    ).forEach(
        mood => {

            if (
                moodCounts[mood] >
                highestCount
            ) {

                highestCount =
                    moodCounts[mood];


                mostCommonMood =
                    mood;

            }

        }
    );


    statMood.innerText =
        mostCommonMood
            ? mostCommonMood.split(" ")[0]
            : "—";


    /* WORD COUNT */

    const totalWords =
        diaryEntries.reduce(
            (total, entry) => {

                const words =
                    (entry.content || "")
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean);


                return (
                    total +
                    words.length
                );

            },
            0
        );


    statWords.innerText =
        totalWords;


    /* AVERAGE MOOD */

    const totalMoodValue =
        diaryEntries.reduce(
            (total, entry) => {

                return (
                    total +
                    getMoodValue(
                        entry.mood
                    )
                );

            },
            0
        );


    const averageMood =
        totalMoodValue /
        diaryEntries.length;


    statAverage.innerText =
        averageMood.toFixed(1);


    /* SUMMARY */

    const moodName =
        mostCommonMood
            ? mostCommonMood
                .split(" ")
                .slice(1)
                .join(" ")
            : "soft";


    let summary = "";


    if (averageMood >= 4) {

        summary =
            `☀️ your diary has been carrying a lot of lighter moments lately. "${moodName}" seems to be showing up often.`;

    }

    else if (averageMood >= 3) {

        summary =
            `🌷 your mood has been moving through different shades lately. "${moodName}" is your most common feeling.`;

    }

    else {

        summary =
            `🌙 your diary has been holding some heavier moments lately. be gentle with yourself, ${currentUser || "you"}.`;

    }


    moodSummary.innerText =
        summary;

}


/* =========================
   RENDER ENTRIES
========================= */

function renderEntries() {

    const container =
        document.getElementById(
            "entriesFeed"
        );


    if (!container)
        return;


    if (diaryEntries.length === 0) {

        container.innerHTML =
            "— nothing yet. —";

        return;

    }


    let html = "";


    for (
        let i = 0;
        i < diaryEntries.length;
        i++
    ) {

        const entry =
            diaryEntries[i];


        const preview =
            entry.content.length > 120

                ? entry.content.slice(
                    0,
                    120
                ) + "…"

                : entry.content;


        html += `

            <div class="entry-item">

                <button
                    class="delete-btn"
                    data-id="${entry.id}"
                >
                    ✖
                </button>

                <div
                    style="
                        font-size:0.7rem;
                        color:#bcaa9c;
                    "
                >
                    ${escapeHtml(entry.date)}
                    ·
                    ${escapeHtml(entry.mood || "🌸")}
                </div>

                <div
                    style="
                        font-weight:500;
                        margin:6px 0;
                    "
                >
                    ${escapeHtml(
                        entry.title ||
                        "untitled"
                    )}
                </div>

                <div class="entry-content-preview">
                    ${escapeHtml(preview)}
                </div>

            </div>

        `;

    }


    container.innerHTML =
        html;


    document
        .querySelectorAll(".delete-btn")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            parseInt(
                                button.getAttribute(
                                    "data-id"
                                )
                            );


                        diaryEntries =
                            diaryEntries.filter(
                                entry =>
                                    entry.id !== id
                            );


                        saveAll();

                    }
                );

            }
        );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(str) {

    if (!str)
        return "";


    return String(str).replace(
        /[&<>"]/g,
        character => {

            if (character === "&")
                return "&amp;";

            if (character === "<")
                return "&lt;";

            if (character === ">")
                return "&gt;";

            if (character === '"')
                return "&quot;";

            return character;

        }
    );

}


/* =========================
   SAVE EVERYTHING
========================= */

function saveAll() {

    localStorage.setItem(
        `diary_${currentUser}`,
        JSON.stringify(
            diaryEntries
        )
    );


    updateStats();

    renderEntries();

    renderMoodGraph();

    updateResponse();

}


/* =========================
   LOAD USER
========================= */

function loadUser() {

    const saved =
        localStorage.getItem(
            `diary_${currentUser}`
        );


    try {

        diaryEntries =
            saved
                ? JSON.parse(saved)
                : [];

    }

    catch (error) {

        diaryEntries = [];

    }


    updateStats();

    renderEntries();

    renderMoodGraph();

    updateResponse();

}


/* =========================
   MOODS
========================= */

function bindMoods() {

    document
        .querySelectorAll(".mood")
        .forEach(
            mood => {

                mood.removeEventListener(
                    "click",
                    moodClick
                );


                mood.addEventListener(
                    "click",
                    moodClick
                );

            }
        );

}


function moodClick() {

    document
        .querySelectorAll(".mood")
        .forEach(
            mood =>
                mood.classList.remove(
                    "selected"
                )
        );


    this.classList.add(
        "selected"
    );


    selectedMood =
        this.getAttribute(
            "data-mood"
        );

}


/* =========================
   INITIALIZE DIARY
========================= */

function initDiary(
    user,
    diaryNick
) {

    currentUser =
        user.trim() ||
        "friend";


    const nick =
        diaryNick.trim();


    if (nick) {

        currentDiaryName =
            nick;


        document.getElementById(
            "mainTitle"
        ).innerHTML =
            `🕯️ ${escapeHtml(nick)}`;


        document.getElementById(
            "mainSub"
        ).innerHTML =
            `a soft place for ${escapeHtml(currentUser)}`;

    }

    else {

        currentDiaryName =
            `${currentUser}'s corner`;


        document.getElementById(
            "mainTitle"
        ).innerHTML =
            `🕯️ ${escapeHtml(currentUser)}'s corner`;


        document.getElementById(
            "mainSub"
        ).innerHTML =
            "a soft place to write";

    }


    loadUser();


    document.getElementById(
        "setupView"
    ).style.display =
        "none";


    document.getElementById(
        "diaryView"
    ).style.display =
        "block";


    setTodaysDate();


    bindMoods();


    document
        .querySelectorAll(".mood")
        .forEach(
            mood =>
                mood.classList.remove(
                    "selected"
                )
        );


    document
        .querySelector(".mood")
        ?.classList.add(
            "selected"
        );


    selectedMood =
        "🌸 soft";

}


/* =========================
   GOOGLE AUTH
========================= */

async function signInWithGoogle() {

    const button =
        document.getElementById(
            "googleSignInBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerText =
            "✨ signing you in...";

    }


    try {

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        firebaseUser =
            user;


        currentUser =
            user.displayName ||
            "friend";


        document.getElementById(
            "userName"
        ).value =
            currentUser;


        document.getElementById(
            "diaryNick"
        ).value =
            "my little diary";


        initDiary(
            currentUser,
            "my little diary"
        );


        console.log(
            "Google sign-in successful:",
            user.email
        );

    }


    catch (error) {

        console.error(
            "Google sign-in error:",
            error
        );


        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            alert(
                "Google sign-in was cancelled."
            );

        }

        else if (
            error.code ===
            "auth/popup-blocked"
        ) {

            alert(
                "Your browser blocked the Google sign-in popup. Please allow popups for PastelDiary and try again."
            );

        }

        else {

            alert(
                "Google sign-in could not be completed. Please try again."
            );

        }

    }


    finally {

        if (button) {

            button.disabled =
                false;

            button.innerText =
                "✨ Continue with Google";

        }

    }

}


/* =========================
   GOOGLE AUTH BUTTON
========================= */

document
    .getElementById(
        "googleSignInBtn"
    )
    ?.addEventListener(
        "click",
        signInWithGoogle
    );


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
    auth,
    user => {

        firebaseUser =
            user || null;


        if (user) {

            console.log(
                "Firebase user:",
                user.displayName,
                user.email
            );

        }

    }
);


/* =========================
   START BUTTON
========================= */

document
    .getElementById(
        "startDiaryBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            const name =
                document.getElementById(
                    "userName"
                ).value;


            if (!name.trim()) {

                alert(
                    "enter your name"
                );

                return;

            }


            initDiary(
                name,
                document.getElementById(
                    "diaryNick"
                ).value
            );

        }
    );


/* =========================
   GUEST BUTTON
========================= */

document
    .getElementById(
        "guestStartBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            initDiary(
                "friend",
                ""
            );

        }
    );


/* =========================
   SAVE ENTRY
========================= */

document
    .getElementById(
        "saveEntryBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            const date =
                document.getElementById(
                    "entryDate"
                ).value;


            if (!date) {

                alert(
                    "please select a date"
                );

                return;

            }


            const title =
                document.getElementById(
                    "entryTitle"
                ).value.trim() ||
                "untitled";


            const content =
                document.getElementById(
                    "entryText"
                ).value.trim();


            if (!content) {

                alert(
                    "write something"
                );

                return;

            }


            diaryEntries.unshift({

                id: Date.now(),

                date: date,

                mood: selectedMood,

                title: title,

                content: content

            });


            saveAll();


            document.getElementById(
                "entryTitle"
            ).value = "";


            document.getElementById(
                "entryText"
            ).value = "";


            setTodaysDate();

        }
    );


/* =========================
   REFLECT BUTTON
========================= */

document
    .getElementById(
        "refreshResponseBtn"
    )
    ?.addEventListener(
        "click",
        updateResponse
    );


/* =========================
   RESET
========================= */

document
    .getElementById(
        "resetAllBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            const shouldReset =
                confirm(
                    "start over? your current diary screen will reset."
                );


            if (!shouldReset)
                return;


            document.getElementById(
                "diaryView"
            ).style.display =
                "none";


            document.getElementById(
                "setupView"
            ).style.display =
                "block";


            currentUser = "";

            currentDiaryName = "";

            diaryEntries = [];

            lastResponse = "";

            selectedMood =
                "🌸 soft";

        }
    );


/* =========================
   WEATHER
   OPEN-METEO
========================= */

async function getWeather() {

    const cityInput =
        document.getElementById(
            "weatherCity"
        );


    const result =
        document.getElementById(
            "weatherResult"
        );


    if (!cityInput || !result)
        return;


    const city =
        cityInput.value.trim();


    if (!city) {

        result.innerHTML =
            "🌷 please enter a city first.";

        return;

    }


    result.innerHTML =
        "☁️ checking the weather...";


    try {

        const geoResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!geoResponse.ok) {

            throw new Error(
                "location search failed"
            );

        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            result.innerHTML =
                "🌷 I could not find that city. Try another spelling.";

            return;

        }


        const location =
            geoData.results[0];


        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "weather request failed"
            );

        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        const temperature =
            Math.round(
                current.temperature_2m
            );


        const feelsLike =
            Math.round(
                current.apparent_temperature
            );


        const windSpeed =
            Math.round(
                current.wind_speed_10m
            );


        const weatherInfo =
            getWeatherDescription(
                current.weather_code
            );


        result.innerHTML = `

            <div style="font-size:1.8rem;">
                ${weatherInfo.emoji}
            </div>

            <div
                style="
                    font-size:1.1rem;
                    color:#8f759b;
                    margin-top:4px;
                "
            >
                ${escapeHtml(location.name)}
                ${location.country
                    ? ", " +
                      escapeHtml(
                          location.country
                      )
                    : ""}
            </div>

            <div
                style="
                    font-size:1.6rem;
                    color:#b47d9e;
                    margin:6px 0;
                "
            >
                ${temperature}°C
            </div>

            <div>
                ${weatherInfo.text}
            </div>

            <div
                style="
                    font-size:0.72rem;
                    color:#b8a9c2;
                    margin-top:5px;
                "
            >
                feels like ${feelsLike}°C
                · wind ${windSpeed} km/h
            </div>

        `;

    }


    catch (error) {

        console.error(
            "Weather error:",
            error
        );


        result.innerHTML =
            "🌧️ weather could not be loaded right now. please try again.";

    }

}


/* =========================
   WEATHER DESCRIPTION
========================= */

function getWeatherDescription(
    code
) {

    const weatherMap = {

        0: {
            emoji: "☀️",
            text: "clear sky"
        },

        1: {
            emoji: "🌤️",
            text: "mainly clear"
        },

        2: {
            emoji: "⛅",
            text: "partly cloudy"
        },

        3: {
            emoji: "☁️",
            text: "overcast"
        },

        45: {
            emoji: "🌫️",
            text: "foggy"
        },

        48: {
            emoji: "🌫️",
            text: "foggy"
        },

        51: {
            emoji: "🌦️",
            text: "light drizzle"
        },

        53: {
            emoji: "🌦️",
            text: "drizzle"
        },

        55: {
            emoji: "🌧️",
            text: "heavy drizzle"
        },

        61: {
            emoji: "🌦️",
            text: "light rain"
        },

        63: {
            emoji: "🌧️",
            text: "rain"
        },

        65: {
            emoji: "🌧️",
            text: "heavy rain"
        },

        71: {
            emoji: "🌨️",
            text: "light snow"
        },

        73: {
            emoji: "🌨️",
            text: "snow"
        },

        75: {
            emoji: "❄️",
            text: "heavy snow"
        },

        80: {
            emoji: "🌦️",
            text: "rain showers"
        },

        81: {
            emoji: "🌧️",
            text: "rain showers"
        },

        82: {
            emoji: "⛈️",
            text: "heavy rain showers"
        },

        95: {
            emoji: "⛈️",
            text: "thunderstorm"
        },

        96: {
            emoji: "⛈️",
            text: "thunderstorm with hail"
        },

        99: {
            emoji: "⛈️",
            text: "strong thunderstorm"
        }

    };


    return (
        weatherMap[code] || {

            emoji: "🌤️",

            text:
                "weather conditions available"

        }
    );

}


/* =========================
   WEATHER BUTTON
========================= */

document
    .getElementById(
        "weatherBtn"
    )
    ?.addEventListener(
        "click",
        getWeather
    );


/* =========================
   WEATHER ENTER KEY
========================= */

document
    .getElementById(
        "weatherCity"
    )
    ?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                getWeather();

            }

        }
    );


/* =========================
   INITIAL SCREEN
========================= */

document.getElementById(
    "setupView"
).style.display =
    "block";


document.getElementById(
    "diaryView"
).style.display =
    "none";
