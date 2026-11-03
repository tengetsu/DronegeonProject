<?php
require __DIR__ . '/session.php';
abyss_require_login();
?>
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <title>ABYSS — Dungeon Crawl</title>
    <link rel="stylesheet" href="asset.php?file=style.css">
  </head>
  <body>
    <div id="game"></div>
    <button type="button" id="mobile-game-config" aria-label="設定画面を開く" aria-controls="config-overlay" aria-expanded="false">⚙ CONFIG</button>
    <div class="vignette"></div>
    <div class="grain"></div>
    <div class="hud">
      <div class="top">
        <div>
          <div class="brand">✦ ABYSS / DEPTHS</div>
          <div class="chapter">CHAPTER I — THE SUNKEN SANCTUM</div>
        </div>
        <div class="objective"><b>OBJECTIVE</b>古代の遺物を探し出せ</div>
      </div>
      <div class="bottom">
        <div class="stats">
          <div class="stat">
            <div class="statline">VITALITY</div>
            <div class="bar">
              <div class="fill hp" style="width:100%"></div>
            </div>
          </div>
          <div class="stat">
            <div class="statline">MANA</div>
            <div class="bar">
              <div class="fill mp" style="width:100%"></div>
            </div>
          </div>
        </div>
        <div class="weapon"><span class="symbol">⚔</span> WORN LONGSWORD</div>
      </div>
    </div>
    <div class="crosshair"></div>
    <div id="toast" role="status"></div>
    <div id="overlay">
      <div class="panel">
        <div class="eyebrow">CHAPTER I — THE SUNKEN SANCTUM</div>
        <h1>ABYSS</h1>
        <div class="subtitle">DUNGEON CRAWL</div>
        <div class="rule"></div>
        <p class="desc">古代の遺物を探し出せ。<br>五つの鍵を集め、封印を解け。</p>
        <button id="start" class="start">ENTER THE DUNGEON</button><button id="config" class="config">CONFIG</button><a class="abyss-logout" href="logout.php">LOGOUT / ログアウト</a>
        <p class="keys">WASD / ARROW KEYS — MOVE &nbsp; • &nbsp; C — CONFIG</p>
      </div>
    </div>
    <div id="config-overlay" class="config-overlay" role="dialog" aria-modal="true" aria-label="ゲーム設定">
      <div class="config-panel">
        <div class="config-header">
          <div>
            <div class="config-eyebrow">THE DUNGEON</div>
            <h2>CONFIGURATION</h2>
          </div>
          <button id="config-close" class="config-close" aria-label="Close">×</button>
        </div>
        <div class="config-divider"></div>
        <div class="config-section">
          <h3>AUDIO</h3>
          <div class="config-item">
            <label for="master-volume">MASTER VOLUME</label>
            <div class="config-slider"><input id="master-volume" type="range" min="0" max="100" value="80"><span id="master-volume-value">80%</span></div>
          </div>
          <div class="config-item">
            <label for="sfx-volume">SOUND EFFECTS</label>
            <div class="config-slider"><input id="sfx-volume" type="range" min="0" max="100" value="80"><span id="sfx-volume-value">80%</span></div>
          </div>
        </div>
        <div class="config-section">
          <h3>VISUALS</h3>
          <div class="config-item">
            <label for="brightness">BRIGHTNESS</label>
            <div class="config-slider"><input id="brightness" type="range" min="0" max="200" value="100"><span id="brightness-value">100%</span></div>
          </div>
          <div class="config-item"><label>TORCH SHADOWS</label><label class="config-toggle"><input id="torch-shadows" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label>BLOOM</label><label class="config-toggle"><input id="bloom" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label>AMBIENT EFFECTS</label><label class="config-toggle"><input id="ambient-effects" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label>HIGH RESOLUTION</label><label class="config-toggle"><input id="high-resolution" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label>RETRO MODE</label><label class="config-toggle"><input id="retro-mode" type="checkbox"><span class="toggle-track"></span></label></div>
          <div id="resolution-status" class="config-status"></div>
        </div>
        <div class="config-section">
          <h3>SE CHECK</h3>
          <button type="button" id="test-walk-se" class="config-back">TEST WALK SE / 足音確認</button>
          <p id="se-test-status" role="status" style="font-size:12px;line-height:1.8;color:#d4bb91;min-height:1.8em"></p>
        </div>
        <button id="config-back" class="config-back">BACK TO DUNGEON</button><button type="button" id="back-to-title" class="config-back" style="margin-top:12px;border-color:#8b564a;color:#f0c0ad">Back to Title / タイトル画面へ戻る</button>
      </div>
    </div>
    <div id="abyss-startup-error" role="alert" aria-live="assertive" style="display:none;position:fixed;z-index:100000;left:16px;right:16px;bottom:16px;margin:auto;max-width:680px;background:#211a1c;color:#f5e3d6;border:2px solid #ba8067;box-shadow:0 10px 45px #000d;padding:20px;font:14px/1.9 sans-serif;pointer-events:auto;">
      <strong style="display:block;font-size:18px;margin-bottom:8px">ABYSS — 起動エラー</strong><span id="abyss-startup-message">ゲームの初期化を確認しています。</span>
      <div style="font-size:12px;margin-top:10px;color:#d6b9ab">画面右上の開発者ツール（F12）→ Console でも詳細を確認できます。音声ファイルがなくてもゲームの起動処理自体は続行します。</div>
      <button type="button" onclick="location.reload()" style="margin-top:10px;padding:7px 13px;background:#ae8a65;color:#1c100b;border:0">再読み込み</button>
    </div>
    
<script>
(() => {
  const alertBox = document.getElementById('abyss-startup-error');
  const message = document.getElementById('abyss-startup-message');
  let ready = false;
  let notified = false;
  function showError(detail) {
    if (ready || notified) return;
    notified = true;
    message.textContent = detail || 'ゲーム用JavaScriptを読み込めませんでした。';
    alertBox.style.display = 'block';
  }
  window.addEventListener('abyss:ready', () => { ready = true; alertBox.style.display = 'none'; });
  window.addEventListener('error', e => {
    if (ready) return;
    const detail = (e.error && e.error.message) || e.message || '';
    if (detail) showError('JavaScriptエラー：' + detail);
    else if (e.target && e.target.tagName === 'SCRIPT') showError('JavaScriptファイルの読み込みに失敗しました。ファイル名とasset.phpを確認してください。');
  }, true);
  window.addEventListener('unhandledrejection', e => {
    if (!ready) showError('起動処理エラー：' + (e.reason?.message || String(e.reason)));
  });
  setTimeout(() => {
    if (!ready) showError('ゲームの初期化が完了しませんでした。Three.jsの読み込みやブラウザのConsoleのエラーを確認してください。');
  }, 15000);
})();
</script>
<script type="module" src="asset.php?file=game.js&amp;v=20261103-mobile-config-title-v1"></script>
  </body>
</html>
