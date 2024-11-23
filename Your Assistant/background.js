chrome.contextMenus.create({
    title: "SelectSmart",
    contexts: ["selection"],
    id: "parent",
});
chrome.contextMenus.create({
    title: "Search with GeminiAI",
    contexts: ["selection"],
    parentId: "parent",
    id: "child1",
});
// chrome.contextMenus.create({
//     title: "Generate Image from selected text",
//     contexts: ["selection"],
//     parentId: "parent",
//     id: "child2",
// });

chrome.contextMenus.onClicked.addListener((info, tab) => {
    // if (info.menuItemId === "child1") {
    //     args = "GAI001"; // gemini ai
    // }
    if (info.menuItemId === "child1") {
        args = "GImg001"; //generate image from text

        userInput = tab.selectionText;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "sendToChatbot", data: info.selectionText });
        });
    }
});