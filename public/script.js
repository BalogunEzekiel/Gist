const socket = io();

const startBtn = document.getElementById("start");
const spoken = document.getElementById("spoken");
const translated = document.getElementById("translated");
const langSelect = document.getElementById("language");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
}

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

startBtn.addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    spoken.textContent = text;

    const targetLang = langSelect.value;
    socket.emit("voice-text", { text, targetLang });
};

socket.on("translated-text", ({ translated }) => {
    translated.textContent = translated;

    // Speak the translation
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(translated);
    utter.lang = langSelect.value;
    synth.speak(utter);
});
