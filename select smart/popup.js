chrome.runtime.onMessage.addListener(gotMessage);

document.addEventListener("mouseup", () => {
  // Get the selected text
  var selectedText = window.getSelection().toString().trim();
  // If there is selected text, show an alert
  if (selectedText) {
    //alert("You selected: " + selectedText);
    const selection = window.getSelection();
    var currentUrl = window.location.href;
    if(currentUrl.includes("https://mail.google.com/") || currentUrl.includes("https://outlook.office.com/")) {
      selectedText = "please correct my email address - "+selectedText;
    }

    if (selection.rangeCount > 0) {  // Ensure there is a selection
      const range = selection.getRangeAt(0); // Get the first range in the selection
      // Get the bounding rectangle of the selected text
      const rect = range.getBoundingClientRect();
      // Get the top and left positions of the selection
      const topPosition = rect.top + window.scrollY;  // account for scrolling
      const leftPosition = rect.left + window.scrollX;
      createElementOnTextOver(selectedText, range, rect, selection)
      console.log("Selected text position - Top:", topPosition, "Left:", leftPosition);
    }
  } else {
    createElementOnTextOver(selectedText, null, null, null);
  }
});

window.onload = function () {
  const url = new URL(window.location.href);
  const inputPrompt = document.body.querySelector('#chatInput');
  const searchQuery = url.searchParams.get("q");

  if (searchQuery) {
    searchWithGeminiIconOnLeftSidebar(searchQuery);
  } else {
    console.log("No search term found.");
  }
}


document.addEventListener("click", () => {
  const selectedText = window.getSelection().toString().trim();
  createElementOnTextOver(selectedText, null, null, null);
});

function gotMessage(messages, sender, sendResponse) {

  var currentUrl = window.location.href;
  var selectedText = messages.data;
  if (currentUrl.includes("https://mail.google.com/") || currentUrl.includes("https://outlook.office.com/")) {
      selectedText = "please correct my email address or write an email- " + messages.data;
  }

  const popup = document.createElement("textarea");
  popup.id = "response_container"
  popup.style.display = "none";

  const popup2 = document.createElement("div");
  popup2.readOnly = true;
  popup2.id = "markdownOutput";
  popup2.style.position = "fixed";
  popup2.style.top = "50%";
  popup2.style.left = "80%";
  popup2.style.transform = "translate(-50%, -50%)";
  popup2.style.width = "500px";
  popup2.style.height = "500px";
  popup2.style.padding = "20px";
  popup2.style.backgroundColor = "#3a3d42";
  popup2.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popup2.style.borderRadius = "8px";
  popup2.style.zIndex = "1000";
  popup2.style.color = "#e0e0e0";
  popup2.style.overflowY = "auto";
  popup2.style.overflowX = "hidden";
  popup2.style.fontFamily = "Arial, sans-serif";


  //Create title element
  var imgURL = chrome.runtime.getURL("./Images/magic-wand.png");
  const title = document.createElement("img");
  title.src = imgURL;
  title.style.width = "30px";
  title.style.height = "30px";
  title.style.top = "0";
  title.style.left = "0";
  //title.style.padding = "10px 15px";
  popup2.appendChild(title);

  // Create message element
  // const message = document.createElement("p");
  // message.textContent = messages.data;
  // message.style.margin = "0";
  // message.style.marginBottom = "20px";
  // message.style.color = "#333";
  // popup.appendChild(message);

  // const putHorizontalLine = document.createElement("hr");
  // putHorizontalLine.style.margin = "0";
  // putHorizontalLine.style.marginBottom = "20px";
  // putHorizontalLine.style.color = "black";
  // popup.appendChild(putHorizontalLine);

  // const responsefromGemini = document.createElement("textarea");
  // responsefromGemini.textContent = "wait for few seconds...";
  // responsefromGemini.style.margin = "0";
  // responsefromGemini.style.marginBottom = "20px";
  // responsefromGemini.style.width = "480px";
  // responsefromGemini.style.height = "300px";
  // responsefromGemini.id = "response";
  // popup.appendChild(responsefromGemini);

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.id = "close";
  //closeButton.style.position = "absolute";
  closeButton.style.top = "0";
  closeButton.style.right = "0";
  closeButton.style.padding = "10px 15px";
  //closeButton.style.backgroundColor = "#0078D4";
  closeButton.style.color = "black";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.cursor = "pointer";
  closeButton.style.backgroundColor = "white";

  const overlay = document.createElement("div");
  overlay.id = "overlay_element";
  overlay.style.position = "fixed";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "1002";

  overlay.appendChild(closeButton);
  // Append overlay and popup to the body
  removeElements();

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  document.body.appendChild(popup2);
  geminiAI(selectedText);
  // Close the popup when button is clicked
  closeButton.addEventListener("click", () => {
   removeElements();
  });

}

function removeElements(element) {
  if(document.getElementById("response_container")) {
    const element = document.getElementById("response_container");
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
  if(document.getElementById("markdownOutput")) {
    const element = document.getElementById("markdownOutput");
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
  if(document.getElementById("overlay_element")) {
    const element = document.getElementById("overlay_element");
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function createElementOnTextOver(text, range, rect, selection) {
  if (text.length > 0 && selection) {
    var imgURL = chrome.runtime.getURL("./Images/magic-wand.png");

    range = selection.getRangeAt(0);
    rect = range.getBoundingClientRect();
    const topPosition = (rect.top - 35) + window.scrollY;
    const leftPosition = rect.left + window.scrollX;

    // const container = document.createElement("div");
    // container.id = "popup_container";
    // container.style.position = "absolute";
    // container.style.top = `${topPosition-5}px`;
    // container.style.left = `${leftPosition}px`;
    // container.style.width = "120px";
    // container.style.height = "37px";
    // container.style.cursor = "pointer";
    // container.style.backgroundColor="white";
    // container.style.borderColor="white";
    // container.style.borderRadius="1px 20px 20px 30px"

    const textHoverElement = document.createElement("img");
    textHoverElement.src = imgURL;
    textHoverElement.id = "popup_element";
    textHoverElement.style.position = "absolute";
    textHoverElement.style.top = `${topPosition - 5}px`;
    textHoverElement.style.left = `${leftPosition}px`;
    textHoverElement.style.width = "50px";
    textHoverElement.style.height = "50px";
    textHoverElement.style.padding = "10px";
    textHoverElement.style.cursor = "pointer";
    //textHoverElement.style.backgroundColor = "white";
    //textHoverElement.style.border = "1px solid";
    //textHoverElement.style.borderRightColor = "blue";

    // const textHoverElementUploadImage = document.createElement("img");
    // textHoverElementUploadImage.src = uploadImage;
    // textHoverElementUploadImage.id = "popup_element_upload_image";
    // textHoverElementUploadImage.style.position = "absolute";
    // textHoverElementUploadImage.style.left = "40px";
    // textHoverElementUploadImage.style.width = "36px";
    // textHoverElementUploadImage.style.height = "36px";
    // textHoverElementUploadImage.style.padding = "10px";
    // textHoverElementUploadImage.style.cursor = "pointer";
    // textHoverElementUploadImage.style.color = "white";
    // textHoverElementUploadImage.style.backgroundColor = "white";
    // textHoverElementUploadImage.style.border = "1px solid";
    // textHoverElementUploadImage.style.borderRightColor = "blue";

    //container.appendChild(textHoverElementUploadImage);
    //container.appendChild(textHoverElement);
    document.body.appendChild(textHoverElement);

    textHoverElement.addEventListener("click", () => {
      if (document.getElementById("response_container") && document.getElementById("overlay_element")) {
        const element1 = document.getElementById("response_container");
        const element2 = document.getElementById("overlay_element");
        if ((element1 && element1.parentNode) && (element2 && element2.parentNode)) {
          element1.parentNode.removeChild(element1);
          element2.parentNode.removeChild(element2);
        }
      }
      gotMessage({ type: "sendToChatbot", data: text });
      geminiAI(text);
    });
  }

  if (text.length === 0) {
    const element = document.getElementById("popup_element");
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

/***********************************     Left Sidebar     *************************************/

function searchWithGeminiIconOnLeftSidebar(text) {
  var imgURL = chrome.runtime.getURL("./Images/magic-wand.png");
  const textHoverElementsideBar = document.createElement("img");
  textHoverElementsideBar.src = imgURL;
  textHoverElementsideBar.id = "popup_sidebar1";
  textHoverElementsideBar.style.position = "fixed";
  textHoverElementsideBar.style.top = "45%";
  textHoverElementsideBar.style.left = "1px";
  textHoverElementsideBar.style.width = "50px";
  textHoverElementsideBar.style.height = "50px";
  textHoverElementsideBar.style.padding = "10px";
  textHoverElementsideBar.style.cursor = "pointer";
  textHoverElementsideBar.style.color = "white";

  var imgURL = chrome.runtime.getURL("./Images/insight.png");
  const textHoverElementsideBar2 = document.createElement("img");
  textHoverElementsideBar2.src = imgURL;
  textHoverElementsideBar2.id = "popup_sidebar2";
  textHoverElementsideBar2.style.position = "fixed";
  textHoverElementsideBar2.style.top = "53%";
  textHoverElementsideBar2.style.left = "1px";
  textHoverElementsideBar2.style.width = "50px";
  textHoverElementsideBar2.style.height = "50px";
  textHoverElementsideBar2.style.padding = "10px";
  textHoverElementsideBar2.style.cursor = "pointer";
  textHoverElementsideBar2.style.color = "white";

  document.body.appendChild(textHoverElementsideBar);
  document.body.appendChild(textHoverElementsideBar2);

  textHoverElementsideBar.addEventListener("click", () => {
    gotMessage({ type: "sendToChatbot", data: text });
    //geminiAI(text);
  });
  textHoverElementsideBar2.addEventListener("click", () => {
    gotMessage({ type: "sendToChatbot", data: "Please suggest some site on this topic - " + text });
    //geminiAI(text);
  });

  textHoverElementsideBar.addEventListener("load", () => {
    const circleElement = document.getElementById('popup_sidebar1');
    circleElement.title = 'Generate Search Result with AI';
    const circleElement2 = document.getElementById('popup_sidebar2');
    circleElement2.title = 'We can generate sites for your search using AI';

    var arr = ["popup_sidebar1", "popup_sidebar2"];

    for (let i = 0; i < arr.length; i++) {
      const element = document.getElementById(arr[i]);
      const pageBgColor = window.getComputedStyle(document.body).backgroundColor;
      element.style.color = getContrastingTextColor(pageBgColor);
    }
  });

  function getContrastingTextColor(backgroundColor) {
    backgroundColor = backgroundColor.replace("#", "");

    const r = parseInt(backgroundColor.substring(0, 2), 16);
    const g = parseInt(backgroundColor.substring(2, 4), 16);
    const b = parseInt(backgroundColor.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#FFFFFF";
  }
}
/***********************************     ChatBot      *************************************/

document.addEventListener("DOMContentLoaded", () => {
  const chatBody = document.getElementById("chat-body");
  var chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("send-button");

  if (document.getElementById("screenshot-image")) {
    chatInput = document.getElementById("screenshot-image").src;
  }

  // Send message to chatbot
  const sendMessage = () => {
    var chatInput = document.getElementById("chatInput");
    var userInput = chatInput.value.trim();

    if (document.getElementById("screenshot-image")) {
      chatInput = document.getElementById("screenshot-image").src;
      userInput = chatInput.trim();
    }



    if (userInput) {
      addMessage(userInput, "user-message");
      generateBotResponse(userInput.toLowerCase());
      chatInput.value = "";
    }
  };

  // Add message to chat body
  const addMessage = (text, className) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // Generate bot response
  const generateBotResponse = (input) => {
    //const botReply = botReplies[input] || botReplies["default"];
    var botReply = geminiAI(input);
    //alert(resp.catch)

    botReply.then((response) => {
      setTimeout(() => {
        addMessage(response, "bot-message");
        if (document.getElementById("screenshot-image")) {
          document.body.removeChild(document.getElementById("screenshot-image"));
        }
      }, 500);
    }
    )
  };

  // Send message on button click
  sendButton.addEventListener("click", sendMessage);

  // Send message on 'Enter' key press
  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  document.getElementById('chatInput').addEventListener('paste', function (e) {
    const items = e.clipboardData.items;
    let imagePasted = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if the clipboard item is an image
      if (item.type.startsWith('image/')) {
        imagePasted = true;
        const blob = item.getAsFile();
        const reader = new FileReader();

        reader.onload = function (event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.id = 'screenshot-image';
          img.style.maxWidth = '50px'; // Adjust the image size
          img.style.height = '50px';
          document.getElementById('screenshot-preview').innerHTML = ''; // Clear previous image
          document.getElementById('screenshot-preview').appendChild(img);
        };
        reader.readAsDataURL(blob);
      }
    }

    // If text is pasted, insert it into the input
    if (!imagePasted) {
      const textInput = document.getElementById('chatInput');
      textInput.value = e.clipboardData.getData('text');
    }
  });



});






