let lastWord = ''; 
let currentPlayer = 1;
let gameEnded = false; // Trạng thái trò chơi
let mode = ''; // Chế độ chơi
let previousInputs = []; // Mảng lưu trữ các cụm từ đã nhập

// Biến lưu các cụm từ hợp lệ từ file text
let validPhrases = [];

// Tải file words.txt và lưu các cụm từ hợp lệ vào mảng validPhrases
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        // Chuyển đổi file JSON-like thành các cụm từ hợp lệ
        const wordObjects = data.trim().split('\n').map(line => JSON.parse(line));
        validPhrases = wordObjects.map(obj => obj.text.trim().toLowerCase());
    });

// Xử lý sự kiện khi người chơi chọn chế độ
document.getElementById('playWithMachine').addEventListener('click', function() {
    mode = 'machine';
    startGame();
});

document.getElementById('playWithFriends').addEventListener('click', function() {
    mode = 'friends';
    startGame();
});

// Bắt đầu trò chơi
function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('currentPlayer').style.display = 'block';
    updateCurrentPlayer();
    previousInputs = []; // Reset danh sách cụm từ đã nhập
    lastWord = ''; // Reset từ cuối
}

// Xử lý sự kiện khi người chơi gửi từ
document.getElementById('submitWord').addEventListener('click', function() {
    if (gameEnded) return; // Nếu trò chơi đã kết thúc, không làm gì cả
    
    const wordInput = document.getElementById('wordInput');
    const input = wordInput.value.trim().toLowerCase(); // Chuyển chuỗi nhập về chữ thường

    // Kiểm tra có đúng 2 từ không
    const words = input.split(' ');
    if (words.length !== 2) {
        displayMessage('Vui lòng nhập 2 từ cách nhau bởi dấu cách!');
        return;
    }

    // Kiểm tra xem cụm từ đã nhập trước đó
    if (previousInputs.includes(input)) {
        endGame(); // Nếu cụm từ đã nhập trước đó, kết thúc trò chơi
        displayMessage(`Người Chơi ${currentPlayer} thua! Trò chơi kết thúc!`);
        return;
    }

    // Kiểm tra xem cụm từ có trong file validPhrases không
    if (!validPhrases.includes(input)) {
        endGame(); // Nếu cụm từ không có, kết thúc trò chơi
        displayMessage(`Người Chơi ${currentPlayer} thua! Trò chơi kết thúc!`);
        return;
    }

    // Kiểm tra xem cụm từ có bắt đầu bằng lastWord không
    if (lastWord && !input.startsWith(lastWord + ' ')) {
        displayMessage(`Người Chơi ${currentPlayer} thua! Cụm từ phải bắt đầu bằng '${lastWord}'!`);
        endGame();
        return;
    }

    // Cập nhật từ cuối cho lượt tiếp theo
    lastWord = words[1]; // Từ cuối (từ thứ hai)
    displayMessage(`Người Chơi ${currentPlayer} đã nhập '${input}'!`);

    // Lưu cụm từ đã nhập vào danh sách
    previousInputs.push(input);

    // Chuyển lượt cho AI nếu chế độ là máy
    if (mode === 'machine') {
        currentPlayer = 2; // Chuyển sang lượt của AI
        aiPlay(); // Gọi hàm AI để chơi
    } else {
        // Chuyển lượt cho người chơi khác
        currentPlayer = currentPlayer === 1 ? 2 : 1; // Chuyển lượt cho người chơi
    }
    
    updateCurrentPlayer();
    wordInput.value = '';
});

// AI chơi
function aiPlay() {
    // Tìm kiếm các cụm từ bắt đầu bằng lastWord (từ cuối của cụm từ người chơi)
    const aiPhrases = validPhrases.filter(phrase => 
        phrase.startsWith(lastWord + ' ') && phrase.split(' ').length === 2
    );
    
    if (aiPhrases.length === 0) {
        // Nếu không tìm thấy cụm từ hợp lệ, người chơi thắng
        endGame();
        displayMessage('AI không còn cụm từ hợp lệ! Bạn thắng!');
        return;
    }

    // Chọn ngẫu nhiên một cụm từ từ danh sách aiPhrases
    const aiInput = aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
    
    // Hiển thị cụm từ AI đã nhập
    displayMessage(`AI đã nhập '${aiInput}'!`);
    
    // Cập nhật lastWord và chuyển lại lượt cho người chơi
    lastWord = aiInput.split(' ')[1]; // Lưu từ thứ 2 của cụm từ AI
    currentPlayer = 1; // Trở lại lượt của người chơi
    updateCurrentPlayer();
}

// Hiển thị thông báo
function displayMessage(msg) {
    document.getElementById('message').innerText = msg;
}

// Cập nhật người chơi hiện tại
function updateCurrentPlayer() {
    document.getElementById('currentPlayer').innerText = `Lượt của Người Chơi ${currentPlayer}`;
}

// Kết thúc trò chơi
function endGame() {
    gameEnded = true;
    displayMessage(`Người Chơi ${currentPlayer} thua! Trò chơi kết thúc!`);

    // Hiển thị nút "Chơi lại"
    document.getElementById('replayButton').style.display = 'block';
}

// Đặt lại trò chơi
document.getElementById('replayButton').addEventListener('click', resetGame);

function resetGame() {
    // Đặt lại tất cả các biến
    lastWord = ''; 
    currentPlayer = 1; 
    gameEnded = false; // Đặt lại trạng thái trò chơi

    // Cập nhật giao diện
    displayMessage('');
    updateCurrentPlayer();

    // Xóa nội dung ô nhập
    document.getElementById('wordInput').value = '';
    document.getElementById('menu').style.display = 'block'; // Hiện lại menu
    document.getElementById('game').style.display = 'none'; // Ẩn game
}
