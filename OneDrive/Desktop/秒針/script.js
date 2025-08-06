// 時計の針を取得
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const digitalClock = document.getElementById('digital-clock');

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // 各針の角度を計算
    const secondAngle = seconds * 6; // 60秒で360度なので1秒あたり6度
    const minuteAngle = minutes * 6 + seconds * 0.1; // 分針は秒の影響も受ける
    const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 時針は分の影響も受ける
    
    // 針を回転させる
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    
    // デジタル時計の更新
    const digitalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    digitalClock.textContent = digitalTime;
    
    // 秒針にティック効果を追加
    secondHand.classList.remove('tick');
    setTimeout(() => {
        secondHand.classList.add('tick');
    }, 10);
}

// 初期表示
updateClock();

// 1秒ごとに時計を更新
setInterval(updateClock, 1000);

// ページが読み込まれたときの初期化
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    
    // より正確な秒針の動きのために、ミリ秒も考慮した更新
    function preciseUpdate() {
        const now = new Date();
        const milliseconds = now.getMilliseconds();
        const seconds = now.getSeconds();
        
        // より滑らかな秒針の動き
        const preciseSecondAngle = (seconds + milliseconds / 1000) * 6;
        secondHand.style.transform = `rotate(${preciseSecondAngle}deg)`;
        
        requestAnimationFrame(preciseUpdate);
    }
    
    // 滑らかな秒針の動きを開始
    requestAnimationFrame(preciseUpdate);
});