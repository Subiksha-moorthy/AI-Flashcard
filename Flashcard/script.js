const flashcardsDiv = document.getElementById("flashcards");
const inputText = document.getElementById("inputText");
let flashcards = [];
document.getElementById("fileInput").addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            inputText.value = e.target.result;
        };
        reader.readAsText(file);
    }
});
function generateFlashcards() {
    const text = inputText.value;
    flashcards = [];
    const sentences = text.split(/[.?!]/).filter(s => s.trim().length > 10);
    sentences.forEach(sentence => {
        const words = sentence.trim().split(" ");
        const question = words.slice(0, 5).join(" ") + "...?";
        const answer = sentence.trim();
        flashcards.push({ question, answer });
    });
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    renderFlashcards(flashcards);
}
function renderFlashcards(data) {
    flashcardsDiv.innerHTML = "";
    data.forEach(cardData => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="inner">
                <div class="front">${cardData.question}</div>
                <div class="back">${cardData.answer}</div>
            </div>
        `;
        card.addEventListener("click", () => {
            card.classList.toggle("flip");
        });
        card.addEventListener("dblclick", () => {
            const speech = new SpeechSynthesisUtterance(cardData.answer);
            speech.lang = "en-US";
            speechSynthesis.speak(speech);
        });
        flashcardsDiv.appendChild(card);
    });
}
window.onload = () => {
    const saved = localStorage.getItem("flashcards");
    if (saved) {
        flashcards = JSON.parse(saved);
        renderFlashcards(flashcards);
    }
};
function speakText() {
    const text = inputText.value;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speechSynthesis.speak(speech);
}
function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.onresult = function(event) {
        inputText.value += " " + event.results[0][0].transcript;
    };
    recognition.start();
}
function downloadFlashcards() {
    const data = JSON.stringify(flashcards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flashcards.json";
    a.click();
}