


const ChatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbotcloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "your_api_key";

const createChatLi = (message,className) =>{
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) =>{
    const API_URL="https://openrouter.ai/api/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1-distill-qwen-32b",
            "messages":[{role: "user", content: userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = ChatInput.value.trim();
    if(!userMessage) return;
    ChatInput.value = "";

    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() =>{
        const incomingChatLi = createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

sendChatBtn.addEventListener("click", handleChat);

chatbotcloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
