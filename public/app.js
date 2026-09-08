const form = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");

const language = document.getElementById("language");
const style = document.getElementById("style");
const level = document.getElementById("level");
const clearButton = document.getElementById("clear");

let history = [];


// ===============================
// ADD MESSAGE
// ===============================

function addMessage(sender, text) {

    const div = document.createElement("div");

    div.className = sender;

    const title = sender === "user"
        ? "👤 You"
        : "🤖 NetAssist AI";

    if (sender === "assistant") {

        div.innerHTML = `
            <strong>${title}</strong>

            <div class="markdown-content">
                ${marked.parse(text)}
            </div>
        `;

    } else {

        div.innerHTML = `
            <strong>${title}</strong>
            <p>${text}</p>
        `;
    }

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}


// ===============================
// SHOW LOADING
// ===============================

function showLoading() {

    // Jangan membuat loading lebih dari satu
    if (document.getElementById("loading")) {
        return;
    }

    const div = document.createElement("div");

    div.className = "assistant";
    div.id = "loading";

    div.innerHTML = `
        <strong>🤖 NetAssist AI</strong>

        <div class="loading">
            Memproses jawaban

            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}


// ===============================
// HIDE LOADING
// ===============================

function hideLoading() {

    const loading =
        document.getElementById("loading");

    if (loading) {
        loading.remove();
    }
}


// ===============================
// SEND MESSAGE
// ===============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const message =
        messageInput.value.trim();

    if (!message) return;


    // Tampilkan pertanyaan user
    addMessage(
        "user",
        message
    );


    // Kosongkan input
    messageInput.value = "";


    // Tampilkan loading
    showLoading();


    try {

        const response = await fetch(
            "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    message: message,

                    history: history,

                    language:
                        language.value,

                    style:
                        style.value,

                    level:
                        level.value

                })
            }
        );


        const data =
            await response.json();


        // Hapus loading
        hideLoading();


        if (data.reply) {

            addMessage(
                "assistant",
                data.reply
            );


            // Simpan history
            history.push({
                role: "user",
                content: message
            });


            history.push({
                role: "assistant",
                content: data.reply
            });

        } else {

            addMessage(
                "assistant",
                "❌ AI tidak memberikan jawaban."
            );
        }


    } catch (error) {

        console.error(error);


        // Hapus loading
        hideLoading();


        addMessage(
            "assistant",
            "❌ Tidak dapat terhubung ke server."
        );
    }

});


// ===============================
// CLEAR CHAT
// ===============================

clearButton.addEventListener(
    "click",
    () => {

        history = [];

        chat.innerHTML = "";

    }
);