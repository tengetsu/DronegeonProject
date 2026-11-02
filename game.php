<?php
require __DIR__ . '/session.php';
abyss_require_login();
?>
<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>ABYSS — Dungeon Crawl</title><link rel="stylesheet" href="asset.php?file=style.css"></head><body>
<div id="game"></div><div class="vignette"></div><div class="grain"></div>
<div class="hud"><div class="top"><div><div class="brand">✦ ABYSS / DEPTHS</div><div class="chapter">CHAPTER I — THE SUNKEN SANCTUM</div></div><div class="objective"><b>OBJECTIVE</b>古代の遺物を探し出せ</div></div>
<div class="bottom"><div class="stats"><div class="stat"><div class="statline">VITALITY</div><div class="bar"><div class="fill hp" style="width:100%"></div></div></div><div class="stat"><div class="statline">MANA</div><div class="bar"><div class="fill mp" style="width:100%"></div></div></div></div><div class="weapon"><span class="symbol">⚔</span> WORN LONGSWORD</div></div></div>
<div class="crosshair"></div><div id="toast" role="status"></div>
<div id="overlay"><div class="panel"><div class="eyebrow">CHAPTER I — THE SUNKEN SANCTUM</div><h1>ABYSS</h1><div class="subtitle">DUNGEON CRAWL</div><div class="rule"></div><p class="desc">古代の遺物を探し出せ。<br>五つの鍵を集め、封印を解け。</p><button id="start" class="start">ENTER THE DUNGEON</button><button id="config" class="config">CONFIG</button><a class="abyss-logout" href="logout.php">LOGOUT / ログアウト</a><p class="keys">WASD / ARROW KEYS — MOVE &nbsp; • &nbsp; C — CONFIG</p></div></div>
<div id="config-overlay" class="config-overlay"><div class="config-panel"><div class="config-header"><div><div class="config-eyebrow">THE DUNGEON</div><h2>CONFIGURATION</h2></div><button id="config-close" class="config-close" aria-label="Close">×</button></div><div class="config-divider"></div>
<div class="config-section"><h3>AUDIO</h3>
<div class="config-item"><label for="master-volume">MASTER VOLUME</label><div class="config-slider"><input id="master-volume" type="range" min="0" max="100" value="80"><span id="master-volume-value">80%</span></div></div>
<div class="config-item"><label for="sfx-volume">SOUND EFFECTS</label><div class="config-slider"><input id="sfx-volume" type="range" min="0" max="100" value="80"><span id="sfx-volume-value">80%</span></div></div>
</div><div class="config-section"><h3>VISUALS</h3>
<div class="config-item"><label for="brightness">BRIGHTNESS</label><div class="config-slider"><input id="brightness" type="range" min="0" max="200" value="100"><span id="brightness-value">100%</span></div></div>
<div class="config-item"><label>TORCH SHADOWS</label><label class="config-toggle"><input id="torch-shadows" type="checkbox"><span class="toggle-track"></span></label></div>
<div class="config-item"><label>BLOOM</label><label class="config-toggle"><input id="bloom" type="checkbox"><span class="toggle-track"></span></label></div>
<div class="config-item"><label>AMBIENT EFFECTS</label><label class="config-toggle"><input id="ambient-effects" type="checkbox"><span class="toggle-track"></span></label></div>
<div class="config-item"><label>HIGH RESOLUTION</label><label class="config-toggle"><input id="high-resolution" type="checkbox"><span class="toggle-track"></span></label></div>
<div class="config-item"><label>RETRO MODE</label><label class="config-toggle"><input id="retro-mode" type="checkbox"><span class="toggle-track"></span></label></div><div id="resolution-status" class="config-status"></div></div><div class="config-section"><h3>SE CHECK</h3><button type="button" id="test-walk-se" class="config-back">TEST WALK SE / 足音確認</button><p id="se-test-status" role="status" style="font-size:12px;line-height:1.8;color:#d4bb91;min-height:1.8em"></p></div><button id="config-back" class="config-back">BACK TO DUNGEON</button><button type="button" id="exit-game" class="config-back" style="margin-top:12px;border-color:#8b564a;color:#f0c0ad">GAME EXIT / ゲーム終了</button></div></div>
<script type="module" src="asset.php?file=abyss_game_retro_movement_fix.js"></script></body></html>