// 状态变量
let candidates = []; // 候选人池
let winners = [];    // 已中奖名单
let isRolling = false; // 是否正在滚动
let rollTimer = null; // 滚动定时器 ID

// DOM 元素
const fileInput = document.getElementById('file-input');
const btnImport = document.getElementById('btn-import');
const btnToggle = document.getElementById('btn-toggle');
const displayArea = document.getElementById('display-area');
const winnerListEl = document.getElementById('winner-list');
const totalCountEl = document.getElementById('total-count');
const winnerCountEl = document.getElementById('winner-count');

const modal = document.getElementById('modal');
const modalWinnerName = document.getElementById('modal-winner-name');
const btnCloseModal = document.getElementById('btn-close-modal');

// 1. 导入功能
btnImport.addEventListener('click', () => {
    if (isRolling) return; // 抽奖中禁止导入
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target.result;
        // 按行分割，去除空白行和首尾空格
        const names = text.split(/\r?\n/)
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (names.length === 0) {
            alert('文件内容为空或格式不正确！');
            return;
        }

        // 重置游戏数据
        candidates = names;
        winners = [];
        updateStats();
        updateWinnerList();
        
        // 提示导入成功
        displayArea.innerText = "READY";
        displayArea.style.color = "var(--primary-color)";
        alert(`成功导入 ${names.length} 位员工！`);
        
        // 清空 input 允许重复导入同一文件
        fileInput.value = ''; 
    };
    reader.readAsText(file);
});

// 2. 开始/结束 按钮逻辑
btnToggle.addEventListener('click', () => {
    // 校验：是否已导入员工
    if (candidates.length === 0 && winners.length === 0) {
        alert("员工名称还未导入，请先导入员工名称。");
        return;
    }
    
    // 校验：是否还有剩余候选人
    if (candidates.length === 0) {
        alert("所有员工都已中奖！抽奖结束。");
        return;
    }

    if (isRolling) {
        stopGame();
    } else {
        startGame();
    }
});

function startGame() {
    isRolling = true;
    btnToggle.innerHTML = '<span class="icon">⏹</span> 停止';
    btnToggle.classList.add('active'); // 可添加按下的样式
    
    // 快速滚动动画
    rollTimer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        displayArea.innerText = candidates[randomIndex];
    }, 50); // 每50ms切换一次名字
}

function stopGame() {
    isRolling = false;
    clearInterval(rollTimer);
    btnToggle.innerHTML = '<span class="icon">▶</span> 开始抽奖';
    btnToggle.classList.remove('active');

    // 确定中奖者
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const winnerName = candidates[winnerIndex];

    // 从候选池移除，加入中奖名单
    candidates.splice(winnerIndex, 1);
    winners.push(winnerName);

    // 更新界面
    displayArea.innerText = winnerName;
    updateStats();
    updateWinnerList();
    
    // 弹窗展示
    showModal(winnerName);
}

// 3. 界面更新逻辑
function updateStats() {
    totalCountEl.innerText = candidates.length + winners.length; // 总人数
    winnerCountEl.innerText = winners.length;
}

function updateWinnerList() {
    winnerListEl.innerHTML = '';
    // 倒序显示，最新的在最前面
    [...winners].reverse().forEach(name => {
        const li = document.createElement('li');
        li.innerText = name;
        winnerListEl.appendChild(li);
    });
}

// 4. 弹窗逻辑
function showModal(name) {
    modalWinnerName.innerText = name;
    modal.classList.remove('hidden');
    // 简单的烟花效果或震动可以在这里触发（如果需要）
}

btnCloseModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// 点击遮罩层也可以关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
