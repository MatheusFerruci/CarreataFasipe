const formAluno = document.getElementById("formAluno");
const mensagemErro = document.getElementById("mensagemErro");

const areaCadastro = document.getElementById("areaCadastro");
const areaCheckin = document.getElementById("areaCheckin");
const areaTimer = document.getElementById("areaTimer");

const resNome = document.getElementById("resNome");
const resCurso = document.getElementById("resCurso");
const latitudeTexto = document.getElementById("latitude");
const longitudeTexto = document.getElementById("longitude");
const dataHoraTexto = document.getElementById("dataHora");

const btnCheckin = document.getElementById("btnCheckin");
const btnVoltar = document.getElementById("btnVoltar");
const btnRota = document.getElementById("btnRota");
const limparHistorico = document.getElementById("limparHistorico");

const totalCheckins = document.getElementById("totalCheckins");
const historico = document.getElementById("historico");

const fotoInput = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");

let dadosAluno = {};
let localizacaoAtual = {};
let fotoBase64 = "";

carregarHistorico();

fotoInput.addEventListener("change", function () {
    const arquivo = fotoInput.files[0];

    if (!arquivo) {
        previewFoto.style.display = "none";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (e) {
        fotoBase64 = e.target.result;
        previewFoto.src = fotoBase64;
        previewFoto.style.display = "block";
    };

    leitor.readAsDataURL(arquivo);
});

formAluno.addEventListener("submit", function (e) {
    e.preventDefault();

    mensagemErro.textContent = "";

    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const email = document.getElementById("email").value.trim();
    const curso = document.getElementById("curso").value;
    const celular = document.getElementById("celular").value.trim();

    if (nome === "" || matricula === "" || email === "" || curso === "" || celular === "") {
        mensagemErro.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        mensagemErro.textContent = "Digite um e-mail válido.";
        return;
    }

    dadosAluno = {
        nome: nome,
        matricula: matricula,
        email: email,
        curso: curso,
        celular: celular,
        foto: fotoBase64
    };

    pedirLocalizacao();
});

function pedirLocalizacao() {
    if (!navigator.geolocation) {
        mensagemErro.textContent = "Seu navegador não suporta localização.";
        return;
    }

    mensagemErro.textContent = "Solicitando localização...";

    navigator.geolocation.getCurrentPosition(
        function (posicao) {
            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;

            localizacaoAtual = {
                latitude: latitude,
                longitude: longitude
            };

            mostrarTelaCheckin();
        },
        function () {
            mensagemErro.textContent = "A localização é necessária para registrar o check-in.";
        }
    );
}

function mostrarTelaCheckin() {
    const agora = new Date();

    resNome.textContent = dadosAluno.nome;
    resCurso.textContent = dadosAluno.curso;
    latitudeTexto.textContent = localizacaoAtual.latitude.toFixed(6);
    longitudeTexto.textContent = localizacaoAtual.longitude.toFixed(6);
    dataHoraTexto.textContent = agora.toLocaleString("pt-BR");

    areaCadastro.classList.add("oculto");
    areaCheckin.classList.remove("oculto");
}

btnCheckin.addEventListener("click", function () {
    const agora = new Date();

    const checkin = {
        nome: dadosAluno.nome,
        matricula: dadosAluno.matricula,
        email: dadosAluno.email,
        curso: dadosAluno.curso,
        celular: dadosAluno.celular,
        latitude: localizacaoAtual.latitude,
        longitude: localizacaoAtual.longitude,
        dataHora: agora.toLocaleString("pt-BR"),
        foto: dadosAluno.foto
    };

    salvarCheckin(checkin);

    areaCheckin.classList.add("oculto");
    areaTimer.classList.remove("oculto");

    iniciarCronometro(7200);
    carregarHistorico();

    alert("Check-in registrado com sucesso!");
});

btnVoltar.addEventListener("click", function () {
    areaCheckin.classList.add("oculto");
    areaCadastro.classList.remove("oculto");
    mensagemErro.textContent = "";
});

btnRota.addEventListener("click", function () {
    if (!localizacaoAtual.latitude || !localizacaoAtual.longitude) {
        alert("Localização não encontrada.");
        return;
    }

    const origem = `${localizacaoAtual.latitude},${localizacaoAtual.longitude}`;
    const destino = "FASIPE Cuiabá";

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${encodeURIComponent(destino)}&travelmode=driving`;

    window.open(url, "_blank");
});

function salvarCheckin(checkin) {
    let lista = JSON.parse(localStorage.getItem("checkinsCarreata")) || [];
    lista.push(checkin);
    localStorage.setItem("checkinsCarreata", JSON.stringify(lista));
}

function carregarHistorico() {
    let lista = JSON.parse(localStorage.getItem("checkinsCarreata")) || [];

    totalCheckins.textContent = lista.length;
    historico.innerHTML = "";

    if (lista.length === 0) {
        historico.innerHTML = "<p>Nenhum check-in registrado ainda.</p>";
        return;
    }

    lista.forEach(function (item, index) {
        const div = document.createElement("div");
        div.className = "itemHistorico";

        div.innerHTML = `
            <p><strong>${index + 1}. ${item.nome}</strong></p>
            <p>Curso: ${item.curso}</p>
            <p>Matrícula: ${item.matricula}</p>
            <p>Data/Hora: ${item.dataHora}</p>
            <p>Localização: ${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}</p>
        `;

        historico.appendChild(div);
    });
}

limparHistorico.addEventListener("click", function () {
    const confirmar = confirm("Tem certeza que deseja apagar o histórico?");

    if (confirmar) {
        localStorage.removeItem("checkinsCarreata");
        carregarHistorico();
    }
});

function iniciarCronometro(totalSeconds) {
    const display = document.getElementById("countdown");

    const interval = setInterval(function () {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = `${hours}:${minutes}:${seconds}`;

        if (totalSeconds <= 0) {
            clearInterval(interval);
            alert("Tempo finalizado!");
        }

        totalSeconds--;
    }, 1000);
}

// Pular campos com Enter
const campos = document.querySelectorAll("input, select");

campos.forEach(function (campo, index) {
    campo.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();

            const proximo = campos[index + 1];

            if (proximo) {
                proximo.focus();
            }
        }
    });
});