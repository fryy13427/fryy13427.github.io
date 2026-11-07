/* 伊蕾娜桌宠 - 博客互动小部件（可拖动版） */
(function () {
  'use strict';

  // ---- 配置 ----
  var OPEN_SRC = '/img/irena-front-open.png';      // 睁眼帧
  var CLOSED_SRC = '/img/irena-front-closed.png';  // 闭眼帧
  var BLINK_INTERVAL = 3200;                 // 每 3.2 秒眨一次眼
  var BLINK_DURATION = 160;                  // 眨眼持续 160ms
  var BUBBLE_HIDE_DELAY = 3000;              // 气泡 3 秒后自动消失
  var STORE_KEY = 'irena-mascot-pos';        // 拖动位置记忆
  var DRAG_THRESHOLD = 6;                    // 移动超过 6px 才算拖动

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

  img.draggable = false; // 阻止图片被浏览器原生拖拽

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

  // 气泡本身点击即关闭
  bubble.addEventListener('click', function (e) {
    e.stopPropagation();
    hideBubble();
  });

  // ---- 拖动相关工具 ----
  function clamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
  }

  // 把当前 left/bottom 定位换算成 left/top，便于拖动
  function useLeftTop(rect) {
    box.style.left = rect.left + 'px';
    box.style.top = rect.top + 'px';
    box.style.bottom = 'auto';
  }

  // 把位置限制在可视范围内
  function clampPosition() {
    if (!box.style.top) return; // 尚未拖动过，保持 CSS 默认定位
    var rect = box.getBoundingClientRect();
    var maxLeft = Math.max(0, window.innerWidth - rect.width);
    var maxTop = Math.max(0, window.innerHeight - rect.height);
    box.style.left = clamp(parseFloat(box.style.left) || 0, 0, maxLeft) + 'px';
    box.style.top = clamp(parseFloat(box.style.top) || 0, 0, maxTop) + 'px';
  }

  function savePos() {
    try {
      var rect = box.getBoundingClientRect();
      localStorage.setItem(STORE_KEY, JSON.stringify({
        left: Math.round(rect.left),
        top: Math.round(rect.top)
      }));
    } catch (e) { /* 隐私模式下忽略 */ }
  }

  function restorePos() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var p = JSON.parse(raw);
      if (typeof p.left !== 'number' || typeof p.top !== 'number') return;
      box.style.left = p.left + 'px';
      box.style.top = p.top + 'px';
      box.style.bottom = 'auto';
      clampPosition();
    } catch (e) { /* 数据损坏则用默认位置 */ }
  }

  function resetPos() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    box.style.left = '';
    box.style.top = '';
    box.style.bottom = '';
  }

  restorePos();

  // ---- 拖动交互 ----
  var dragging = false;
  var moved = false;
  var startX = 0, startY = 0;
  var startLeft = 0, startTop = 0;
  var lastClickAt = 0;

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return; // 只响应左键 / 触摸
    if (bubble.contains(e.target)) return;                // 点气泡不算拖动

    var rect = box.getBoundingClientRect();
    useLeftTop(rect);

    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    box.classList.add('dragging');
    hideBubble();

    try { box.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;

    if (!moved && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) moved = true;
    if (!moved) return;

    var rect = box.getBoundingClientRect();
    var maxLeft = Math.max(0, window.innerWidth - rect.width);
    var maxTop = Math.max(0, window.innerHeight - rect.height);

    box.style.left = clamp(startLeft + dx, 0, maxLeft) + 'px';
    box.style.top = clamp(startTop + dy, 0, maxTop) + 'px';
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    box.classList.remove('dragging');
    try { box.releasePointerCapture(e.pointerId); } catch (err) {}

    if (moved) {
      savePos();
      return;
    }

    // 没移动 = 轻点：双击复位，单击切换气泡
    var now = Date.now();
    if (now - lastClickAt < 320) {
      lastClickAt = 0;
      hideBubble();
      resetPos();
      return;
    }
    lastClickAt = now;

    if (bubble.classList.contains('show')) {
      hideBubble();
    } else {
      showBubble();
    }
  }

  box.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  // 窗口尺寸变化时把桌宠拉回可视范围
  window.addEventListener('resize', function () {
    clampPosition();
    // 恢复过记忆位置但缩放到越界时，同步更新保存值
    if (box.style.top) savePos();
  });
})();
