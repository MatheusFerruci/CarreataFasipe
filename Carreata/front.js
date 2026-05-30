// ── pular campos com Enter ──
const inputs = document.querySelectorAll('input')

inputs.forEach(function(input, index) {
    input.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            e.preventDefault()
            const proximo = inputs[index + 1]
            if(proximo) {
                proximo.focus()
            }
        }
    })
})

// ── etapa2 ──
function etapa2() {
    document.getElementById('formAluno').style.display = 'none';
    document.getElementById('modalLocalizacao').style.display = 'none';
}

// ── botão salvar ──
const botao = document.getElementById('botao');
botao.addEventListener('click', function () {
    let timer = document.getElementById('timer');
    let form = document.getElementById('formAluno');
    let res = confirm('Autoriza Localização');

    if (res) {
        console.log('sim');
        form.style.display = 'none';
        timer.style.display = 'block';

        let totalSeconds = 7200;
        const display = document.getElementById('countdown');

        const interval = setInterval(() => {
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;

            hours   = hours   < 10 ? '0' + hours   : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            display.textContent = `${hours}:${minutes}:${seconds}`;

            if (totalSeconds <= 0) {
                clearInterval(interval);
                let parabens = document.getElementById('confirmacao');
                parabens.style.display = 'block';
                display.textContent = "00:00:00";
                alert("Você Conseguiu!");
            } else {
                totalSeconds--;
            }
        }, 1000);
    } else {
        console.log('nao');
    }
});