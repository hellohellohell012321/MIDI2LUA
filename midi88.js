
document.getElementById("convertButton").addEventListener("click", async () => {
    console.log("Button click detected in Script 2"); 
    const fileInput = document.getElementById("midiFile");
    if (!fileInput.files.length) {
        alert("Please upload a MIDI file.");
        return;
    }
    const checkbox = document.getElementById("midi88Checkbox")
    if (!checkbox.checked) {
        console.log("Checkbox is not checked. Stopping execution.");
        return;
      }

    const bpmInput = document.getElementById("bpmInput").value;
    const noteMap = {
        "A0": "Ctrl+1", "A#0": "Ctrl+2", "Bb0": "Ctrl+2", "B0": "Ctrl+3",
        "C1": "Ctrl+4", "C#1": "Ctrl+5", "Db1": "Ctrl+5", "D1": "Ctrl+6", "D#1": "Ctrl+7", "Eb1": "Ctrl+7", "E1": "Ctrl+8", "F1": "Ctrl+9", "F#1": "Ctrl+0", "Gb1": "Ctrl+0", "G1": "Ctrl+q", "G#1": "Ctrl+w", "Ab1": "Ctrl+w", "A1": "Ctrl+e", "A#1": "Ctrl+r", "Bb1": "Ctrl+r", "B1": "Ctrl+t",
        "C2": "1", "C#2": "!", "Db2": "!", "D2": "2", "D#2": "@", "Eb2": "@", "E2": "3", "F2": "4", "F#2": "$", "Gb2": "$", "G2": "5", "G#2": "%", "Ab2": "%", "A2": "6", "A#2": "^", "Bb2": "^", "B2": "7",
        "C3": "8", "C#3": "*", "Db3": "*", "D3": "9", "D#3": "(", "Eb3": "(", "E3": "0", "F3": "q", "F#3": "Q", "Gb3": "Q", "G3": "w", "G#3": "W", "Ab3": "W", "A3": "e", "A#3": "E", "Bb3": "E", "B3": "r",
        "C4": "t", "C#4": "T", "Db4": "T", "D4": "y", "D#4": "Y", "Eb4": "Y", "E4": "u", "F4": "i", "F#4": "I", "Gb4": "I", "G4": "o", "G#4": "O", "Ab4": "O", "A4": "p", "A#4": "P", "Bb4": "P", "B4": "a",
        "C5": "s", "C#5": "S", "Db5": "S", "D5": "d", "D#5": "D", "Eb5": "D", "E5": "f", "F5": "g", "F#5": "G", "Gb5": "G", "G5": "h", "G#5": "H", "Ab5": "H", "A5": "j", "A#5": "J", "Bb5": "J", "B5": "k",
        "C6": "l", "C#6": "L", "Db6": "L", "D6": "z", "D#6": "Z", "Eb6": "Z", "E6": "x", "F6": "c", "F#6": "C", "Gb6": "C", "G6": "v", "G#6": "V", "Ab6": "V", "A6": "b", "A#6": "B", "Bb6": "B", "B6": "n",
        "C7": "m", "C#7": "L", "Db7": "L", "D7": "z", "D#7": "Z", "Eb7": "Z", "E7": "x", "F7": "c", "F#7": "C", "Gb7": "C", "G7": "v", "G#7": "V", "Ab7": "V", "A7": "b", "A#7": "B", "Bb7": "B", "B7": "n",
        "C8": "Ctrl+j"

    };
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        const midiData = new Uint8Array(event.target.result);
        const midi = new Midi(midiData);
        midi.header.setTempo(60);
        
        let output = "";
        
        output += `bpm = ${bpmInput}\n\n\n`;
        output += `loadstring(game:HttpGet("https://raw.githubusercontent.com/hellohellohell012321/TALENTLESS/main/loader_main.lua", true))()\n\n\n`
        let lastEndTime = 0;
        let notesByTime = [];

        midi.tracks.forEach(track => {
            track.notes.forEach(note => {
                notesByTime.push({ time: note.time, name: note.name });
            });
        });
        
        notesByTime.sort((a, b) => a.time - b.time);

        let lastKey = null;

        notesByTime.forEach((note, index) => {
            if (index > 0) {
                let rest = note.time - lastEndTime;
                if (rest > 0) {
                    output += `rest(${rest}, bpm)\n`;
                    lastKey = null;
                }
            }

            const currentKey = noteMap[note.name] || note.name;

            let keypressDuration = bpmInput / 600;
            if (keypressDuration > 0.25) {
                keypressDuration = 0.25;
            }

            if (currentKey !== lastKey) {
                output += `keypress("${currentKey}", ${keypressDuration}, bpm)\n`;
                lastKey = currentKey;
            }

            lastEndTime = note.time;
        });
        
        output += `\n\nfinishedSong()`
        const outputText = document.getElementById("output");
       outputText.value = "Uploading to Pastefy...";
        uploadToPastefy("MIDI2LUA SCRIPT", output, function(url) {
            console.log(url);
            // assemble loadstring using url
            outputText.value = `loadstring(game:HttpGet("${url}", true))()`;

        });
    };
    
    reader.readAsArrayBuffer(fileInput.files[0]);
});

document.getElementById("copyButton").addEventListener("click", () => {
    const outputText = document.getElementById("output");
    outputText.select();
    document.execCommand("copy");
});
