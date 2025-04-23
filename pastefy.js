// this only needs to be used once so that every js file can use it
function uploadToPastefy(title, content, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://pastefy.app/api/v2/paste");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
         let real = JSON.parse(xhr.responseText);
         let url = real.paste.raw_url;
         console.log(url);
         if (callback) {
           callback(url); // Invoke the callback with the URL
         }
      }
    };
  
    let data = JSON.stringify({
      type: "PASTE",
      title: title,
      content: content,
      visibility: "UNLISTED",
      encrypted: "false",
      expire_at: "2030-02-01 16:03:09.0"
    });
  
    xhr.send(data);
}
window.uploadToPastefy = uploadToPastefy;


document.getElementById("pasteButton").addEventListener("click", () => {
    const outputText = document.getElementById("output");
    const originalValue = outputText.value; // Store the original value
    if (originalValue == "") {
        alert("Nothing to upload!");
        return;
    }
    outputText.value = "Uploading to Pastefy..."; // Change the value to 'uploading to pastefy'
  
    uploadToPastefy("MIDI Output", originalValue, (url) => {
        outputText.value = `loadstring(game:HttpGet("${url}", true))()`;
    });
});


document.getElementById("txtButton").addEventListener("click", function () {
  const outputText = document.getElementById("output").value;
  const blob = new Blob([outputText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "output.txt";
  link.click();
});
