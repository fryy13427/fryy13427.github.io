/* 伊蕾娜桌宠 - 博客右下角互动小部件 */
(function () {
  'use strict';

  // ---- 配置 ----
  var OPEN_SRC = '/img/irena-front-open.png';      // 睁眼帧
  var CLOSED_SRC = '/img/irena-front-closed.png';  // 闭眼帧
  var BLINK_INTERVAL = 3200;                 // 每 3.2 秒眨一次眼
  var BLINK_DURATION = 160;                  // 眨眼持续 160ms
  var BUBBLE_HIDE_DELAY = 3000;              // 气泡 3 秒后自动消失

  // 点击后随机说的话（伊蕾娜风格）
  var MESSAGES = [
    '再欺负我就要生气了哦！(｡･ω･｡)',
    '欸，云朵！',
    '欢迎来到听风鸣事～',
    '今天也在努力学逆向呢！',
    '嘘——flag 就藏在代码里哦',
    '要一起去看星星吗？',
    '栈溢出？小心一点哦！',
    'CTF 的路上有我陪你～'
  ];

  // ---- DOM 引用 ----
  var box = document.getElementById('irena-mascot');
  var img = document.getElementById('irena-img');
  var bubble = document.getElementById('irena-bubble');

  if (!box || !img || !bubble) return; // 元素缺失则安静退出

  // ---- 预加载闭眼帧，避免第一次眨眼时闪烁 ----
  var preload = new Image();
  preload.src = CLOSED_SRC;

  // ---- 眨眼 ----
  function blink() {
    img.src = CLOSED_SRC;
    setTimeout(function () {
      img.src = OPEN_SRC;
    }, BLINK_DURATION);
  }
  setInterval(blink, BLINK_INTERVAL);

  // ---- 气泡 ----
  function showBubble() {
    // 随机选一句，避免连续重复
    var msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    bubble.textContent = msg;
    bubble.classList.add('show');
    clearTimeout(bubble._timer);
    bubble._timer = setTimeout(function () {
      bubble.classList.remove('show');
    }, BUBBLE_HIDE_DELAY);
  }

  function hideBubble() {
    bubble.classList.remove('show');
  }

  // ---- 互动 ----
  box.addEventListener('click', function (e) {
    // 点击角色本体（不含气泡）才切换气泡
    if (e.target === img || e.target === box) {
      if (bubble.classList.contains('show')) {
        hideBubble();
      } else {
        showBubble();
      }
    }
  });

  // 气泡本身点击即关闭
  bubble.addEventListener('click', function () {
    hideBubble();
  });
})();
