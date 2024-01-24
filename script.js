var secretColour;
var secretColourCode;
var mode = "rgb"; //rgb or cmy or hsl
var guessNum;
var prevWin;

//enter event listeners
const inputs = document.getElementsByClassName("grid-container")[0].getElementsByTagName("input")
for (let i = 0; i<inputs.length; i++) {
    inputs[i].addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            const submit = document.getElementsByClassName("submit")[0]
            submit.click();
        }
    })
}

//called when 'play' pressed
pickColour();

function pickColour() {
    //clear previous games and guesses
    const continueButton = document.getElementsByClassName("continue")[0]
    continueButton.style.display = "none";

    const winMessage = document.getElementById("winMessage")
    winMessage.style.display = "none"

    const submit = document.getElementsByClassName("submit")[0]
    submit.style.display = "block"

    prevWin = false;

    guessNum = 0;
    const guessTable = document.getElementsByClassName("table")[0]
    guessTable.innerHTML = ""

    const inputs = document.getElementsByClassName("grid-container")[0].getElementsByTagName("input")
    console.log(inputs)

    for (let i = 0; i<inputs.length; i++) {
        inputs[i].value = ""
    }

    //pick colour
    const red = Math.floor(Math.random()*256);
    const green = Math.floor(Math.random()*256);
    const blue = Math.floor(Math.random()*256);
    secretColour = {
        "red":red,
        "green":green,
        "blue":blue,
    }
    secretColourCode = `rgb(${red}, ${green}, ${blue})`;

    const swatch = document.getElementById("swatch")
    swatch.style.background = `linear-gradient(90deg, ${secretColourCode} 50%, white 50%)`;

    const miniswatch = document.getElementsByClassName("compare")[0]
    miniswatch.style.background = `linear-gradient(90deg, ${secretColourCode} 50%, white 50%)`
    
    const playButton = document.getElementsByClassName("playButton")[0];
    playButton.style.display = "none";

    //reset the game otherwise
    const guessContainer = document.getElementsByClassName("guessContainer")[0];

}

function checkColour(guessColour) {
    //gets and rgb string
    //automate a bit - split guesscolour and secretcolour in the same way, then calculate abs distance for each, and assign colours
    const redG = Number(guessColour.split("(")[1].split(",")[0]);
    const greenG = Number(guessColour.split(",")[1]);
    const blueG = Number(guessColour.split(",")[2].slice(0, -1));

    const redD = Math.abs(redG-secretColour.red);
    const greenD = Math.abs(greenG-secretColour.green);
    const blueD = Math.abs(blueG-secretColour.blue);

    console.log(redD, greenD, blueD)
    return {
        "red": redD, 
        "green": greenD, 
        "blue": blueD
        };
}

function submitColour() {
    guessNum += 1
    addNum(guessNum);

    var guessColour
    if (mode === "rgb") {
        const red = document.getElementById("red")
        const green = document.getElementById("green")
        const blue = document.getElementById("blue")
    
        const redVal = (red.value | 0)
        const greenVal = (green.value | 0)
        const blueVal = (blue.value | 0)

        addCell(redVal)
        addCell(greenVal)
        addCell(blueVal)

        guessColour = `rgb(${redVal}, ${greenVal}, ${blueVal})`
        console.log(guessColour)

    } else if (mode === "cmy") {
        const cyan = document.getElementById("cyan")
        const magenta = document.getElementById("magenta")
        const yellow = document.getElementById("yellow")

        const cyanVal = (cyan.value | 0)
        const magentaVal = (magenta.value | 0)
        const yellowVal = (yellow.value | 0)

        addCell(cyanVal)
        addCell(magentaVal)
        addCell(yellowVal)

        guessColour = `rgb(${255 - (cyan.value | 0)}, ${255 - (magenta.value | 0)}, ${255 - (yellow.value | 0)})`
        console.log(guessColour)

    }

    addSwatch(secretColourCode, guessColour)

    const swatch = document.getElementById("swatch")
    swatch.style.background = `linear-gradient(90deg, ${secretColourCode} 50%, ${guessColour} 50%)`
    console.log(guessColour);

    //check colour accuracy
    const diffs = checkColour(guessColour);
    const diffsArr = Object.values(diffs);
    console.log(diffsArr)

    const table = document.getElementsByClassName("table")[0]
    const cells = Array.from(table.childNodes).slice(-4, -1)
    console.log(cells)

    let correctCount = 0;

    for (let i = 0; i<3; i++) {
        const thisCell = cells[i].childNodes[0];
    
        if (diffsArr[i] == 0) {
            thisCell.style.backgroundColor = "rgb(120, 242, 179)"
            correctCount += 1.1
        } else if (diffsArr[i] <= 5) {
            thisCell.style.backgroundColor = "rgb(67, 182, 27)"
            correctCount += 1
        } else if (diffsArr[i] <= 20) {
            thisCell.style.backgroundColor = "rgb(247, 196, 68)"
        }
    }

    console.log(correctCount);

    if (correctCount >= 3.3) {
        //exactly correct! hide submit button, play again?
        const winMessage = document.getElementById("winMessage")
        winMessage.innerText = "Exact Match: You Win!!!!"
        winMessage.style.display = "block"

        const submit = document.getElementsByClassName("submit")[0]
        submit.style.display = "none"

        const replay = document.getElementsByClassName("playButton")[0]
        replay.style.display = "block";

    } else if (correctCount >= 3.0 && !prevWin) {
        console.log("Win!!!")
        const winMessage = document.getElementById("winMessage")
        winMessage.innerText = "Close Enough: You Win!"
        winMessage.style.display = "block"

        const submit = document.getElementsByClassName("submit")[0]
        submit.style.display = "none"

        const continueButton = document.getElementsByClassName("continue")[0]
        continueButton.style.display = "block";

        const replay = document.getElementsByClassName("playButton")[0]
        replay.style.display = "block";
    }
}

//continue until exact match
function continueGame() {
    prevWin = true
    const continueButton = document.getElementsByClassName("continue")[0]
    continueButton.style.display = "none";

    const winMessage = document.getElementById("winMessage")
    winMessage.style.display = "none"

    const submit = document.getElementsByClassName("submit")[0]
    submit.style.display = "block"

    const replay = document.getElementsByClassName("playButton")[0]
    replay.style.display = "none";
}

function addCell(val) {
    const table = document.getElementsByClassName("table")[0]

    const tableCell = document.createElement("div")
    tableCell.className = "grid-item"

    const text = document.createElement("p")
    text.innerText = val;

    tableCell.appendChild(text)
    table.appendChild(tableCell)
} 

function addSwatch(correct, guess) {
    const table = document.getElementsByClassName("table")[0]

    const tableCell = document.createElement("div")
    tableCell.className = "grid-item"

    const swatch = document.createElement("div")
    swatch.className = "miniswatch compare"
    swatch.style.background = `linear-gradient(90deg, ${correct} 50%, ${guess} 50%)`

    tableCell.appendChild(swatch)
    table.appendChild(tableCell)
}

function addNum(num) {
    const table = document.getElementsByClassName("table")[0]

    const tableCell = document.createElement("div")
    tableCell.className = "grid-item guess-number"

    const text = document.createElement("p")
    text.innerText = num;

    tableCell.appendChild(text)
    table.appendChild(tableCell)
}


function setMode(newMode) {
    let newIds = []
    if (newMode == "rgb") {
        mode = "rgb"
        newIds = ["red", "green", "blue"]
    } else if (newMode == "cmy") {
        mode = "cmy"
        newIds = ["cyan", "magenta", "yellow"]
    } else { //error - invalid mode
        return
    }

    const inputs = document.getElementsByClassName("grid-container")[0].getElementsByTagName("input")
    for (let i = 0; i<inputs.length; i++) {
        inputs[i].id = newIds[i]
    }

    pickColour()
}