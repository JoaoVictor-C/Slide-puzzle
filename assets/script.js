// Selecionando elementos no DOM
const game = document.querySelector('#game_field');
const start_button = document.querySelector('#start');
const reset_button = document.querySelector('#reset');
const time = document.querySelector('#time');
const moves = document.querySelector('#moves');
const cells = game.querySelectorAll('.cell');
const win_modal = document.querySelector('#modal');
const close_modal = document.querySelector('#modal_close');
const restart_modal = document.querySelector('#modal_restart');
const winner_board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let initial_numbers = null;
let interval = null;
let timer = 1;
let started = false;

// Função para embaralhar um array usando o algoritmo Fisher-Yates
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    if (JSON.stringify(array) === JSON.stringify(winner_board)) {
        return shuffle(array);
    }
    return array;
};

// Função para iniciar o jogo
const start = () => {
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    initial_numbers = numbers;
    // Configurando o tabuleiro do jogo com os números embaralhados
    
    numbers.forEach((number, index) => {
        cells[index].innerHTML = number;
        cells[index].classList.remove('empty');
        if (number === 0) {
            cells[index].classList.add('empty');
        }
    });
    clearInterval(interval);
    moves.innerHTML = 0;
    time.innerHTML = '0s';
    started = false;
    timer = 1;
};

// Função para reiniciar o jogo
const reset = () => {
    clearInterval(interval);
    moves.innerHTML = 0;
    time.innerHTML = '0s';
    started = false;
    timer = 1;
    // Resetando o tabuleiro do jogo para o estado inicial
    initial_numbers.forEach((number, index) => {
        cells[index].innerHTML = number;
        cells[index].classList.remove('empty');
        if (number === 0) {
            cells[index].classList.add('empty');
        }
    });
};

// Função para lidar com um movimento no jogo
const move = (index) => {
    const empty_cell = game.querySelector('.empty');
    const empty_cell_index = Array.from(cells).indexOf(empty_cell);
    const empty_cell_row = Math.floor(empty_cell_index / 3);
    const empty_cell_column = empty_cell_index % 3;
    const cell_row = Math.floor(index / 3);
    const cell_column = index % 3;
    // Verifica se a célula clicada pode ser movida para a célula vazia
    if ((cell_row === empty_cell_row && Math.abs(cell_column - empty_cell_column) === 1) || (cell_column === empty_cell_column && Math.abs(cell_row - empty_cell_row) === 1)) {
        empty_cell.classList.remove('empty');
        empty_cell.innerHTML = cells[index].innerHTML;
        cells[index].classList.add('empty');
        cells[index].innerHTML = 0;
        moves.innerHTML = parseInt(moves.innerHTML) + 1;
    }
    // Inicia o cronômetro se ainda não tiver começado
    if (!started) {
        interval = setInterval(() => {
            if (timer < 60) {
                time.innerHTML = `${timer}s`;
            } else {
                const minutes = Math.floor(timer / 60);
                const seconds = timer % 60;
                time.innerHTML = `${minutes}m ${seconds}s`;
            }
            timer++;
        }, 1000);
        started = true;
    }
};

// Event listeners para os botões de iniciar e reiniciar
start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
close_modal.addEventListener('click', () => {
    win_modal.classList.remove('active');
});
restart_modal.addEventListener('click', () => {
    win_modal.classList.remove('active');
    start();
});

// Event listener para cada célula no tabuleiro do jogo
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        move(index);
        // Verifica se o jogador venceu
        const numbers = Array.from(cells).map(cell => parseInt(cell.innerHTML));
        if (JSON.stringify(numbers) === JSON.stringify(winner_board)) {
            clearInterval(interval);
            // Exibe o modal de vitória com informações de tempo e movimentos
            document.querySelector('#modal_time').innerHTML = time.innerHTML;
            document.querySelector('#modal_moves').innerHTML = moves.innerHTML;
            win_modal.classList.add('active');
        }
    });
});

// Inicia o jogo inicialmente
start();
