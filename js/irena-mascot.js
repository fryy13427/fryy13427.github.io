/* 伊蕾娜桌宠 - 博客右下角互动小部件 */
(function () {
  'use strict';

  // ---- 配置 ----
  var OPEN_SRC = '/img/irena-front-open.png';      // 睁眼帧
  var CLOSED_SRC = '/img/irena-front-closed.png';  // 闭眼帧
  var BLINK_INTERVAL = 3200;                 // 每 3.2 秒眨一次眼
  var BLINK_DURATION = 160;                  // 眨眼持续 160ms
  var BUBBLE_HIDE_DELAY = 3000;              // 气泡 3 秒后自动消失

  // 点击后随机说的话（伊蕾娜风格，可爱傲娇向）
  var MESSAGES = [
    '再欺负我就要生气了哦！(｡･ω･｡)',
    '欸，云朵！',
    '哼，才不是特意陪你的呢！',
    '真是的，不要随便碰我啦！',
    '想我了？……才、才没有呢！',
    '看在你这么认真的份上，夸你一下好了～',
    '我可是天才魔女伊蕾娜哦！',
    '稍微…陪你说说话也不是不可以啦',
    '今天也是优雅的一天呢～',
    '陪我旅行的话，也不是不行哦',
    '笨蛋！……才不是担心你呢',
    '要做我的旅伴吗？……开玩笑的啦',
    '哼，别小看天才魔女哦',
    '被你盯着看，我会害羞的啦！'
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
