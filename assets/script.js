// Selecionando elementos no DOM
const game = document.querySelector('#game_field');
const start_button = document.querySelector('#start');
const reset_button = document.querySelector('#reset');
const time = document.querySelector('#time');
const moves = document.querySelector('#moves');
const cells = game.querySelectorAll('.cell');
const win_modal = document.querySelector('#modal');
const close_modal = document.querySelector('#modal_close');
const restart_modal = document.querySelector('#modal_restart')
const modal_message = document.querySelector('#modal_message');
const winner_board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let initial_numbers = null;
let interval = null;
let timer = 1;
let started = false;
let finished = false;

// Função para embaralhar um array usando o algoritmo Fisher-Yates
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // Enquanto ainda houver elementos para embaralhar
    while (currentIndex !== 0) {
        // Escolhe um elemento restante
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Troca o elemento escolhido com o elemento atual
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
    finished = false;
};

// Função para reiniciar o jogo
const reset = () => {
    clearInterval(interval);
    moves.innerHTML = 0;
    time.innerHTML = '0s';
    started = false;
    timer = 1;
    finished = false;
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
    // Verifica se o jogo já acabou
    if (finished) {
        return;
    }
    const empty_cell = game.querySelector('.empty');
    const empty_cell_index = Array.from(cells).indexOf(empty_cell);
    const empty_cell_row = Math.floor(empty_cell_index / 3);
    const empty_cell_column = empty_cell_index % 3;
    const cell_row = Math.floor(index / 3);
    const cell_column = index % 3;
    const direction = getMoveDirection(index, empty_cell_index);
    const numbers = Array.from(cells).map(cell => parseInt(cell.innerHTML));
    // Verifica se a célula clicada pode ser movida para a célula vazia
    if ((cell_row === empty_cell_row && Math.abs(cell_column - empty_cell_column) === 1) || (cell_column === empty_cell_column && Math.abs(cell_row - empty_cell_row) === 1)) {
        // Move a célula clicada para a célula vazia e depois atualiza o valor
        cells[index].style.transform = `translate(${direction.x}px, ${direction.y}px)`;
        setTimeout(() => {
            cells[empty_cell_index].innerHTML = cells[index].innerHTML;
            cells[empty_cell_index].classList.remove('empty');
            cells[index].innerHTML = 0;
            cells[index].classList.add('empty');
            cells[index].style.transform = 'translate(0px, 0px)';
        }, 250);
        // Incrementa o número de movimentos
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

        if (JSON.stringify(numbers) === JSON.stringify(winner_board)) {
            clearInterval(interval);
            // Exibe o modal de vitória com informações de tempo e movimentos
            document.querySelector('#modal_time').innerHTML = time.innerHTML;
            document.querySelector('#modal_moves').innerHTML = moves.innerHTML;
            win_modal.classList.add('active');
            finished = true;
        }
};

// Função para obter a direção do movimento
const getMoveDirection = (currentIndex, emptyIndex) => {
    const cellSize = 113; // Ajuste isso conforme necessário

    const currentRow = Math.floor(currentIndex / 3);
    const currentCol = currentIndex % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const deltaX = (emptyCol - currentCol) * cellSize;
    const deltaY = (emptyRow - currentRow) * cellSize;

    return { x: deltaX, y: deltaY };
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
    });
});

// Inicia o jogo inicialmente
start();

const language_button = document.querySelector('#language');

const translations = {
    'en': {
        'start': 'New game',
        'reset': 'Restart',
        'time_label': `Time: `,
        'moves_label': `Moves: `,
        'modal_h2': 'Congratulations!',
        'modal_message': `You finished the game in <span id="modal_time">${time.innerHTML}</span> with <span id="modal_moves">${moves.innerHTML}</span> moves.`,
        'modal_close': 'Close',
        'modal_restart': 'Start a new game',
        'created_by': 'Created by <a href="https://github.com/JoaoVictor-C" target="_blank">João Victor  <i class="fa-brands fa-github"></i></a>',
        'code_link': 'Code: <a href="https://github.com/JoaoVictor-C/Sliding-game" target="_blank">Sliding puzzle <i class="fa-solid fa-code-compare fa-spin"></i></a>',
    },
    'pt': {
        'start': 'Novo jogo',
        'reset': 'Reiniciar',
        'time_label': `Tempo: `,
        'moves_label': `Movimentos: `,
        'modal_h2': 'Parabéns!',
        'modal_message': `Você terminou o jogo em <span id="modal_time">${time.innerHTML}</span> com <span id="modal_moves">${moves.innerHTML}</span> movimentos.`,
        'modal_close': 'Fechar',
        'modal_restart': 'Iniciar um novo jogo',
        'created_by': 'Criado por <a href="https://github.com/JoaoVictor-C" target="_blank">João Victor  <i class="fa-brands fa-github"></i></a>',
        'code_link': 'Código: <a href="https://github.com/JoaoVictor-C/Sliding-game" target="_blank">Sliding puzzle <i class="fa-solid fa-code-compare fa-spin"></i></a>'   
    }
};

const translate = (language) => {
    const elementsToTranslate = ['start', 'reset', 'time_label', 'moves_label', 'modal_h2', 'modal_message', 'modal_close', 'modal_restart', 'created_by', 'code_link'];
    elementsToTranslate.forEach((element) => {
        try {
            document.querySelector(`#${element}`).innerHTML = translations[language][element];
        } catch (error) {
            console.log(error, element);
        }
    });
};

language_button.addEventListener('click', () => {
    if (language_button.classList.contains('en')) {
        language_button.classList.remove('en');
        language_button.classList.add('pt');
        language_button.setAttribute('src', 'assets/icons/brazil-flag.png');
        translate('pt');
    } else {
        language_button.classList.remove('pt');
        language_button.classList.add('en');
        language_button.setAttribute('src', 'assets/icons/eua-flag.png');
        translate('en');
    }
});