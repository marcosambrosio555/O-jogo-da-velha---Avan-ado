const container = document.querySelector(".game")

for (let i = 0; i < 9; i++) {
    container.innerHTML += `<input type='text' class='btn' readonly></input>`
}

const btns = document.querySelectorAll(".btn")
const reset = document.querySelector(".reset")
const newGame = document.querySelector(".newGame")

const data = {
    player1Points: 0,
    player2Points: 0,
    player1: true,
    simbol: "X",
    click: 0,
    computer: false,
    turnComputer: false
}

btns.forEach(btn => {
    btn.addEventListener("mouseover", () => btn.setAttribute("placeholder", data.simbol))
    btn.addEventListener("mouseout", () => btn.setAttribute("placeholder", ""))
    btn.addEventListener("click", () => {
        if (!data.turnComputer) {
            mark(btn)
        }
    })
})

reset.addEventListener("click", () => {
    resetFunction()
    if (data.computer) {
        if (data.player1) {
            data.turnComputer = false
        } else {
            data.turnComputer = true
        }
        computerTurnFunction()
    }
})

function resetFunction() {
    data.click = 0;
    reset.style.display = "none"
    btns.forEach((btn) => {
        btn.value = ""
        btn.style.color = "transparent"
        btn.classList.remove("animation")
    })
}

newGame.addEventListener("click", () => {

    resetFunction()

    data.player1Points = 0
    data.player2Points = 0
    data.player1 = true
    data.simbol = "X"
    data.turnComputer = false

    document.querySelector(".players div.active").classList.remove("active")
    document.querySelector(".players .player1").classList.add("active")

    const optionConfig = document.querySelector(".config input:checked").id
    if (optionConfig === "player") {
        document.querySelector(".players .player2").innerHTML = "Jogador 2 (o) : <span class='points'></span>"
        data.computer = false
    } else {
        data.computer = true
        document.querySelector(".players .player2").innerHTML = "Computador (o) : <span class='points'></span>"
    }

    updateResults()

})

function mark(btn) {

    if (!btn) return
    if (btn.value === "X" || btn.value === "O") return
    if (reset.style.display === "block") return

    btn.value = data.simbol

    if (data.player1) {
        data.simbol = "O"
    } else {
        data.simbol = "X"
    }

    btn.style.color = "#fff"
    data.player1 = !data.player1;
    data.click++;

    document.querySelector(".players div.active").classList.remove("active")

    if (data.player1) {
        document.querySelector(".players .player1").classList.add("active")
    } else {
        document.querySelector(".players .player2").classList.add("active")
    }

    if (data.click === 9) {
        reset.style.display = "block"
    }

    const forms = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    for (let form of forms) {
        const winner = verification(...form)
        if (winner) break;
    }

    if (data.computer) {
        if (!data.turnComputer) {
            data.turnComputer = true
            if (reset.style.display !== "block") {
                computerTurnFunction()
            }
        } else {
            data.turnComputer = false
        }
    }

}

function verification(a, b, c) {
    if (btns[a].value === "X" &&
        btns[b].value === "X" &&
        btns[c].value === "X" ||
        btns[a].value === "O" &&
        btns[b].value === "O" &&
        btns[c].value === "O"
    ) {
        btns[a].classList.add("animation")
        btns[b].classList.add("animation")
        btns[c].classList.add("animation")
        reset.style.display = "block"
        if (data.player1) {
            data.player2Points++
        } else {
            data.player1Points++
        }
        updateResults()
        return true
    }
}

function updateResults() {
    document.querySelector(".player1 .points").innerText = data.player1Points;
    document.querySelector(".player2 .points").innerText = data.player2Points;
}

updateResults()


function computerTurnFunction() {

    if (!data.turnComputer) return
    if (data.player1) return

    let btnClicked;

    const btns = document.querySelectorAll(".game input")
    const center = btns[4].value === "" ? true : false

    const btnsValidate = [...btns].filter((btn, index) => {
        if (btn.value === "") {
            return btn
        }
    })

    if (center) {
        btnClicked = btns[4]
    }

    if (!btnClicked) {
        btnClicked = checkEstrategy("O")
    }

    if (!btnClicked) {
        btnClicked = checkEstrategy("X")
    }

    if (!btnClicked) {
        const numberRandom = Math.floor(Math.random() * btnsValidate.length)
        btnClicked = btnsValidate[numberRandom]
    }

    setTimeout(() => {
        mark(btnClicked)
    }, 1500)

}

function checkEstrategy(simbol) {

    let btnSelected;

    const forms = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    for (let form of forms) {
        const btn = check(...form, simbol)
        if (btn) {
            btnSelected = btn.value === "" ? btn : null;
            break;
        }
    }

    return btnSelected
}

function check(a, b, c, simbol) {

    let sameSimbols = 0;
    let btn;

    btns[a].value === simbol ? sameSimbols++ : btn = btns[a]
    btns[b].value === simbol ? sameSimbols++ : btn = btns[b]
    btns[c].value === simbol ? sameSimbols++ : btn = btns[c]

    if (sameSimbols === 2) {
        return btn
    } else {
        return null
    }

}