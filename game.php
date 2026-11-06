<?php
require __DIR__ . '/session.php';
abyss_require_login();
$gameLanguage = ($_SESSION['abyss_portal_lang'] ?? 'ja') === 'en' ? 'en' : 'ja';
if (empty($_SESSION['abyss_language_token'])) {
    $_SESSION['abyss_language_token'] = bin2hex(random_bytes(16));
}
$cfgTranslations = [
    'ja' => [
        'ariaConfig' => 'ゲーム設定',
        'close' => '設定を閉じる',
        'eyebrow' => 'ダンジョン',
        'title' => '設定',
        'languageSection' => '言語',
        'languageLabel' => '表示言語',
        'languageHint' => 'タイトル画面・ゲーム中・設定画面の表示言語を切り替えます。',
        'audio' => '音声',
        'masterVolume' => 'マスター音量',
        'sfxVolume' => '効果音',
        'visuals' => '画面表示',
        'brightness' => '明るさ',
        'shadows' => '松明の影',
        'bloom' => 'ブルーム',
        'ambient' => '環境エフェクト',
        'hires' => '高解像度',
        'retro' => 'レトロモード',
        'seCheck' => 'SE確認',
        'testSE' => '足音SEを試聴',
        'backDungeon' => 'ダンジョンに戻る',
        'backTitle' => 'タイトル画面へ戻る',
        'seLoading' => 'SEを読み込んでいます…',
        'seSuccess' => 'SEを再生しました。音が聞こえれば正常です。',
        'seLoadFail' => '音声ファイルの取得に失敗しました',
        'seTypeFail' => '音声以外が返されました',
        'seFailedPrefix' => 'SEエラー: ',
        'seFailedSuffix' => '。SE/Walk.mp3の配置とブラウザの音量をご確認ください。',
        'pixelRatio' => '描画倍率',
        'confirmTitle' => 'タイトル画面へ戻りますか？ ゲームの進行状況はリセットされます。',
        'langSaveFail' => '表示言語を保存できませんでした。'
    ],
    'en' => [
        'ariaConfig' => 'Game settings',
        'close' => 'Close settings',
        'eyebrow' => 'THE DUNGEON',
        'title' => 'CONFIGURATION',
        'languageSection' => 'LANGUAGE',
        'languageLabel' => 'DISPLAY LANGUAGE',
        'languageHint' => 'Choose the language for the title screen, gameplay and settings.',
        'audio' => 'AUDIO',
        'masterVolume' => 'MASTER VOLUME',
        'sfxVolume' => 'SOUND EFFECTS',
        'visuals' => 'VISUALS',
        'brightness' => 'BRIGHTNESS',
        'shadows' => 'TORCH SHADOWS',
        'bloom' => 'BLOOM',
        'ambient' => 'AMBIENT EFFECTS',
        'hires' => 'HIGH RESOLUTION',
        'retro' => 'RETRO MODE',
        'seCheck' => 'SE CHECK',
        'testSE' => 'TEST WALK SE',
        'backDungeon' => 'RESUME EXPLORATION',
        'backTitle' => 'BACK TO TITLE',
        'seLoading' => 'Loading sound effect…',
        'seSuccess' => 'Footstep test started. If you hear it, sound playback is working.',
        'seLoadFail' => 'Failed to load audio (HTTP',
        'seTypeFail' => 'Server returned non-audio data',
        'seFailedPrefix' => 'Sound error: ',
        'seFailedSuffix' => '. Check SE/Walk.mp3 and your device volume.',
        'pixelRatio' => 'Rendering scale',
        'confirmTitle' => 'Return to the title screen? Your current progress will be lost.',
        'langSaveFail' => 'Could not save the language preference.'
    ]
];
$cfg = static fn(string $key): string => htmlspecialchars($cfgTranslations[$gameLanguage][$key], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$gameTranslations = [
    'ja' => [
        'browserTitle' => 'ABYSS — 深淵の迷宮',
        'mobileConfig' => '設定',
        'openSettings' => '設定画面を開く',
        'hudChapter' => '第1章 — 沈みし聖域',
        'hudObjectiveHeading' => '目的',
        'hudObjective' => '5つの鍵を集め、古代の遺物を探し出せ',
        'vitality' => '生命力',
        'mana' => '魔力',
        'titleChapter' => '第1章 — 沈みし聖域',
        'titleSubtitle' => 'ダンジョン・ドローン・クローラー',
        'titleDesc1' => '迷宮に隠された5つの鍵を集め、封印された道を開け。',
        'titleDesc2' => '奥に眠る古代の遺物を探し出そう。',
        'start' => '迷宮へ入る',
        'settings' => '設定',
        'logout' => 'ログアウト',
        'titleControls' => 'WASD / 矢印キー：移動 ・ C：設定 ・ Esc：設定を閉じる',
        'keyHud' => '取得した鍵の数と、封印解除までの残り時間',
        'questStartTitle' => '封印を解く5つの鍵',
        'questStartMessage' => '10分以内に5つの鍵を集め、封印を解け。',
        'gateOpenedTitle' => '隠された通路が開いた',
        'gateOpenedMessage' => 'どこかで壁が動いたようだ。新しい通路を探そう。',
        'victoryTitle' => '古代の遺物を回収',
        'victoryMessage' => '古代の遺物を発見した。探索成功！',
        'victoryBack' => 'タイトル画面へ戻る',
        'gameOverTitle' => 'GAME OVER',
        'gameOverMessage' => '時間切れ。聖域は再び深い闇に包まれた。',
        'gameOverBack' => 'タイトル画面へ戻る',
        'mapLabel' => '地図',
        'mobileForward' => '前進',
        'mobileBackward' => '後退',
        'mobileTurnLeft' => '左を向く',
        'mobileTurnRight' => '右を向く',
        'startupTitle' => 'ABYSS — 起動エラー',
        'startupInitial' => 'ゲームの起動状態を確認しています。',
        'startupHelp' => 'F12キーで開発者ツールのConsoleを確認できます。音声ファイルがなくてもゲーム本体は起動できます。',
        'startupRetry' => '再読み込み',
        'startupNoScript' => 'ゲーム用JavaScriptを読み込めませんでした。',
        'startupJsError' => 'JavaScriptエラー：',
        'startupScriptLoad' => 'ゲーム用JavaScriptの読み込みに失敗しました。game.js と asset.php を確認してください。',
        'startupRuntimeError' => 'ゲーム起動時のエラー：',
        'startupTimeout' => 'ゲームの初期化が完了しませんでした。Three.jsの読み込みやConsoleのエラーを確認してください。',
    ],
    'en' => [
        'browserTitle' => 'ABYSS — The Sunken Sanctum',
        'mobileConfig' => 'CONFIG',
        'openSettings' => 'Open game settings',
        'hudChapter' => 'CHAPTER I — THE SUNKEN SANCTUM',
        'hudObjectiveHeading' => 'OBJECTIVE',
        'hudObjective' => 'Collect five keys and recover the ancient relic',
        'vitality' => 'VITALITY',
        'mana' => 'MANA',
        'titleChapter' => 'CHAPTER I — THE SUNKEN SANCTUM',
        'titleSubtitle' => 'DUNGEON DRONE CRAWLER',
        'titleDesc1' => 'Find the five keys hidden throughout the dungeon to break the seal.',
        'titleDesc2' => 'Then locate the ancient relic deep within the sanctuary.',
        'start' => 'ENTER THE DUNGEON',
        'settings' => 'CONFIG',
        'logout' => 'LOG OUT',
        'titleControls' => 'WASD / ARROW KEYS: MOVE · C: CONFIG · ESC: CLOSE SETTINGS',
        'keyHud' => 'Keys collected and time remaining on the seal countdown',
        'questStartTitle' => 'FIVE KEYS TO BREAK THE SEAL',
        'questStartMessage' => 'Collect all five keys and break the seal within 10 minutes.',
        'gateOpenedTitle' => 'A HIDDEN PASSAGE HAS OPENED',
        'gateOpenedMessage' => 'A wall has shifted somewhere in the dungeon. Find the new passage.',
        'victoryTitle' => 'ANCIENT RELIC RECOVERED',
        'victoryMessage' => 'You found the ancient relic. The expedition is complete!',
        'victoryBack' => 'BACK TO TITLE',
        'gameOverTitle' => 'GAME OVER',
        'gameOverMessage' => 'Time has run out. Darkness has reclaimed the sanctuary.',
        'gameOverBack' => 'BACK TO TITLE',
        'mapLabel' => 'MAP',
        'mobileForward' => 'Move forward',
        'mobileBackward' => 'Move backward',
        'mobileTurnLeft' => 'Turn left',
        'mobileTurnRight' => 'Turn right',
        'startupTitle' => 'ABYSS — STARTUP ERROR',
        'startupInitial' => 'Checking game initialization…',
        'startupHelp' => 'Open the developer tools (F12) and check the Console for details. Missing audio files do not prevent the game from starting.',
        'startupRetry' => 'RELOAD',
        'startupNoScript' => 'Unable to load the game JavaScript.',
        'startupJsError' => 'JavaScript error: ',
        'startupScriptLoad' => 'The game script could not be loaded. Check game.js and asset.php.',
        'startupRuntimeError' => 'Game startup error: ',
        'startupTimeout' => 'The game did not finish initializing. Check the Three.js connection and any errors in the browser Console.',
    ],
];
$g = static fn(string $key): string => htmlspecialchars($gameTranslations[$gameLanguage][$key], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<!doctype html>
<html lang="<?= $gameLanguage ?>">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <title><?= $g('browserTitle') ?></title>
    <meta name="abyss-language-token" content="<?= htmlspecialchars($_SESSION['abyss_language_token'], ENT_QUOTES, 'UTF-8') ?>">
    <link rel="stylesheet" href="asset.php?file=style.css&amp;v=relic-radiant-victory-v2">
  </head>
  <body>
    <script type="application/json" id="abyss-game-translations"><?= json_encode($gameTranslations, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?></script>
    <div id="game"></div>
    <button type="button" id="mobile-game-config" aria-label="<?= $g('openSettings') ?>" data-game-aria="openSettings" aria-controls="config-overlay" aria-expanded="false">⚙ <span data-game-i18n="mobileConfig"><?= $g('mobileConfig') ?></span></button>
    <div class="vignette"></div>
    <div class="grain"></div>
    <div class="hud">
      <div class="top">
        <div>
          <div class="brand">✦ ABYSS</div>
          <div class="chapter" data-game-i18n="hudChapter"><?= $g('hudChapter') ?></div>
        </div>
        <div class="objective"><b data-game-i18n="hudObjectiveHeading"><?= $g('hudObjectiveHeading') ?></b><span data-game-i18n="hudObjective"><?= $g('hudObjective') ?></span></div>
      </div>
      <div class="bottom">
        <div class="stats">
          <div class="stat">
            <div class="statline" data-game-i18n="vitality"><?= $g('vitality') ?></div>
            <div class="bar">
              <div class="fill hp" style="width:100%"></div>
            </div>
          </div>
          <div class="stat">
            <div class="statline" data-game-i18n="mana"><?= $g('mana') ?></div>
            <div class="bar">
              <div class="fill mp" style="width:100%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="crosshair"></div>
    <div id="toast" role="status"></div>
    <div id="overlay">
      <div class="panel">
        <div class="eyebrow" data-game-i18n="titleChapter"><?= $g('titleChapter') ?></div>
        <h1>ABYSS</h1>
        <div class="subtitle" data-game-i18n="titleSubtitle"><?= $g('titleSubtitle') ?></div>
        <div class="rule"></div>
        <p class="desc"><span data-game-i18n="titleDesc1"><?= $g('titleDesc1') ?></span><br><span data-game-i18n="titleDesc2"><?= $g('titleDesc2') ?></span></p>
        <button id="start" class="start" data-game-i18n="start"><?= $g('start') ?></button><button id="config" class="config" data-game-i18n="settings"><?= $g('settings') ?></button><a class="abyss-logout" href="logout.php" data-game-i18n="logout"><?= $g('logout') ?></a>
        <p class="keys" data-game-i18n="titleControls"><?= $g('titleControls') ?></p>
      </div>
    </div>
    <div id="config-overlay" class="config-overlay" role="dialog" aria-modal="true" aria-label="<?= $cfg('ariaConfig') ?>" data-config-aria="ariaConfig">
      <div class="config-panel">
        <div class="config-header">
          <div>
            <div class="config-eyebrow" data-config-i18n="eyebrow"><?= $cfg('eyebrow') ?></div>
            <h2 data-config-i18n="title"><?= $cfg('title') ?></h2>
          </div>
          <button id="config-close" class="config-close" aria-label="<?= $cfg('close') ?>" data-config-aria="close">×</button>
        </div>
        <div class="config-divider"></div>
        <div class="config-section config-language-section">
          <h3 data-config-i18n="languageSection"><?= $cfg('languageSection') ?></h3>
          <div class="config-item">
            <label for="config-language" data-config-i18n="languageLabel"><?= $cfg('languageLabel') ?></label>
            <select id="config-language" aria-label="<?= $cfg('languageLabel') ?>" data-config-aria="languageLabel">
              <option value="ja" <?= $gameLanguage === 'ja' ? 'selected' : '' ?>>日本語</option>
              <option value="en" <?= $gameLanguage === 'en' ? 'selected' : '' ?>>English</option>
            </select>
          </div>
          <p class="config-language-hint" data-config-i18n="languageHint"><?= $cfg('languageHint') ?></p>
        </div>
        <div class="config-section">
          <h3 data-config-i18n="audio"><?= $cfg('audio') ?></h3>
          <div class="config-item">
            <label for="master-volume" data-config-i18n="masterVolume"><?= $cfg('masterVolume') ?></label>
            <div class="config-slider"><input id="master-volume" type="range" min="0" max="100" value="80"><span id="master-volume-value">80%</span></div>
          </div>
          <div class="config-item">
            <label for="sfx-volume" data-config-i18n="sfxVolume"><?= $cfg('sfxVolume') ?></label>
            <div class="config-slider"><input id="sfx-volume" type="range" min="0" max="100" value="80"><span id="sfx-volume-value">80%</span></div>
          </div>
        </div>
        <div class="config-section">
          <h3 data-config-i18n="visuals"><?= $cfg('visuals') ?></h3>
          <div class="config-item">
            <label for="brightness" data-config-i18n="brightness"><?= $cfg('brightness') ?></label>
            <div class="config-slider"><input id="brightness" type="range" min="0" max="200" value="100"><span id="brightness-value">100%</span></div>
          </div>
          <div class="config-item"><label data-config-i18n="shadows"><?= $cfg('shadows') ?></label><label class="config-toggle"><input id="torch-shadows" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label data-config-i18n="bloom"><?= $cfg('bloom') ?></label><label class="config-toggle"><input id="bloom" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label data-config-i18n="ambient"><?= $cfg('ambient') ?></label><label class="config-toggle"><input id="ambient-effects" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label data-config-i18n="hires"><?= $cfg('hires') ?></label><label class="config-toggle"><input id="high-resolution" type="checkbox"><span class="toggle-track"></span></label></div>
          <div class="config-item"><label data-config-i18n="retro"><?= $cfg('retro') ?></label><label class="config-toggle"><input id="retro-mode" type="checkbox"><span class="toggle-track"></span></label></div>
          <div id="resolution-status" class="config-status"></div>
        </div>
        <div class="config-section">
          <h3 data-config-i18n="seCheck"><?= $cfg('seCheck') ?></h3>
          <button type="button" id="test-walk-se" class="config-back" data-config-i18n="testSE"><?= $cfg('testSE') ?></button>
          <p id="se-test-status" role="status" style="font-size:12px;line-height:1.8;color:#d4bb91;min-height:1.8em"></p>
        </div>
        <button id="config-back" class="config-back" data-config-i18n="backDungeon"><?= $cfg('backDungeon') ?></button>
        <button type="button" id="back-to-title" class="config-back" data-config-i18n="backTitle" style="margin-top:12px;border-color:#8b564a;color:#f0c0ad"><?= $cfg('backTitle') ?></button>
      </div>
    </div>
    <div id="abyss-startup-error" role="alert" aria-live="assertive" style="display:none;position:fixed;z-index:100000;left:16px;right:16px;bottom:16px;margin:auto;max-width:680px;background:#211a1c;color:#f5e3d6;border:2px solid #ba8067;box-shadow:0 10px 45px #000d;padding:20px;font:14px/1.9 sans-serif;pointer-events:auto;">
      <strong style="display:block;font-size:18px;margin-bottom:8px" data-game-i18n="startupTitle"><?= $g('startupTitle') ?></strong><span id="abyss-startup-message"><?= $g('startupInitial') ?></span>
      <div style="font-size:12px;margin-top:10px;color:#d6b9ab" data-game-i18n="startupHelp"><?= $g('startupHelp') ?></div>
      <button type="button" onclick="location.reload()" style="margin-top:10px;padding:7px 13px;background:#ae8a65;color:#1c100b;border:0" data-game-i18n="startupRetry"><?= $g('startupRetry') ?></button>
    </div>
    
<script>
(() => {
  const startupStrings = <?= json_encode($gameTranslations[$gameLanguage], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  const alertBox = document.getElementById('abyss-startup-error');
  const message = document.getElementById('abyss-startup-message');
  let ready = false;
  let notified = false;
  function showError(detail) {
    if (ready || notified) return;
    notified = true;
    message.textContent = detail || startupStrings.startupNoScript;
    alertBox.style.display = 'block';
  }
  window.addEventListener('abyss:ready', () => { ready = true; alertBox.style.display = 'none'; });
  window.addEventListener('error', e => {
    if (ready) return;
    const detail = (e.error && e.error.message) || e.message || '';
    if (detail) showError(startupStrings.startupJsError + detail);
    else if (e.target && e.target.tagName === 'SCRIPT') showError(startupStrings.startupScriptLoad);
  }, true);
  window.addEventListener('unhandledrejection', e => {
    if (!ready) showError(startupStrings.startupRuntimeError + (e.reason?.message || String(e.reason)));
  });
  setTimeout(() => {
    if (!ready) showError(startupStrings.startupTimeout);
  }, 15000);
})();
</script>
<script type="module" src="asset.php?file=game.js&amp;v=relic-radiant-victory-v2"></script>
  </body>
</html>
