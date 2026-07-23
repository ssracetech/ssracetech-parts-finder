const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {

    const div = document.createElement("div");

    div.className = sender;

    div.innerHTML = text;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

}

function botReply(question) {

    const q = question.toLowerCase();

    if (q.includes("-6")) {

        return "🔧 Great! Are you looking for a <strong>-6AN Hose End</strong>, <strong>-6AN Adapter</strong>, or <strong>-6AN PTFE Fitting</strong>?";

    }

    if (q.includes("ls1")) {

        return "🏁 We stock a range of LS1 performance parts including starter motors, intake manifolds, sensors and more.";

    }

    if (q.includes("transmission")) {

        return "🚗 We have transmission coolers, cooler kits, fittings and accessories. Which transmission are you working with?";

    }

    if (q.includes("speedflow")) {

        return "💥 We stock hundreds of genuine Speedflow fittings. Tell me the AN size and angle you need.";

    }

    return "🤖 I'm still learning. Try asking about <strong>LS1</strong>, <strong>Speedflow</strong>, <strong>-6AN</strong> or <strong>Transmission</strong>.";
}

function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    input.value = "";

    setTimeout(() => {

        addMessage(botReply(text), "bot");

    }, 400);

}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});