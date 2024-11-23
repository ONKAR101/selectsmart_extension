var apiKey = "AIzaSyBakQATervFkxwe8e4YIz8E2KCU1yzvDb4"
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

function geminiAI(text) {
    if (document.getElementById("response_container") && document.getElementById("overlay_element")) {
        let getElementHeight = document.getElementById("markdownOutput");
               
        const getElementCloseButton = document.getElementById("overlay_element");
        const left = getElementHeight.offsetLeft;
        const width = getElementHeight.offsetWidth;
        const top = getElementHeight.offsetTop;
        //const responseElement = document.getElementById('response_container')
        // responseElement.value = "hello world";
        //getElementHeight.value = data.candidates[0].content.parts[0].text;
        getElementCloseButton.style.left = `${left + (width / 2)}px`;
        getElementCloseButton.style.top = `${top / 2.5}px`;
    }

    const data = {
        contents: [{
            parts: [{
                text: text
            }]
        }]
    };

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //document.getElementById('response').value = data.candidates[0].content.parts[0].text;
            // getElementHeight.value = "hello world";
            if (document.getElementById("markdownOutput") && document.getElementById("overlay_element")) {
                const htmlOutput = markdownToHTML(data.candidates[0].content.parts[0].text);
                document.getElementById("markdownOutput").innerHTML = htmlOutput;
                //document.getElementById("response_container").innerHTML = (data.candidates[0].content.parts[0].text);
                
            }  
            return (markdownToHTML(data.candidates[0].content.parts[0].text));
        })
        .catch((error) => {
            if (document.getElementById("markdownOutput") && document.getElementById("overlay_element")) {
                document.getElementById("markdownOutput").value = "Failed to generate response";
            }            
            console.log('Error:', error);
            var error = error.toString();
            return error;
        });

}

function markdownToHTML(markdown) {
    // Convert headings
    markdown = markdown.replace(/###### (.*?)$/gm, '<h6>$1</h6>');
    markdown = markdown.replace(/##### (.*?)$/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/#### (.*?)$/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/### (.*?)$/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/## (.*?)$/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/# (.*?)$/gm, '<h1>$1</h1>');

    // Convert bold and italic
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert unordered lists
    markdown = markdown.replace(/^\s*\*\s+(.*)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    // Convert ordered lists
    markdown = markdown.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');

    // Convert links
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Convert line breaks
    markdown = markdown.replace(/\n/g, '<br>');
    var imgURL = chrome.runtime.getURL("./Images/magic-wand.png");
    markdown = "<img src='"+imgURL+ "' height='50px' width='50px'></img><br>"+markdown;

    return markdown;
}