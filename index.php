<?php
require __DIR__ . '/session.php';
// The portal is the login entry point. Like the previous version, visiting
// index.php clears the game authorization but retains the language preference.
unset($_SESSION['abyss_authenticated']);

$requestedLanguage = $_GET['lang'] ?? null;
if ($requestedLanguage === 'ja' || $requestedLanguage === 'en') {
    $_SESSION['abyss_portal_lang'] = $requestedLanguage;
}
$lang = ($_SESSION['abyss_portal_lang'] ?? 'ja') === 'en' ? 'en' : 'ja';

$translations = [
    'ja' => [
        'page_description' => 'ABYSS // Dungeon Crawl。沈んだ聖域を探索するダークファンタジー・ダンジョンクローラー。',
        'brand_top' => 'ABYSS トップ',
        'nav_label' => 'ページ内ナビゲーション',
        'change_language' => '表示言語を切り替える',
        'menu_open' => 'ナビゲーションメニューを開く',
        'menu_close' => 'ナビゲーションメニューを閉じる',
        'menu_label' => 'メニュー',
        'fullscreen_on' => '全画面',
        'fullscreen_off' => '戻す',
        'fullscreen_error' => 'このブラウザでは全画面表示を開始できません。通常表示でご利用ください。',
        'language_japanese' => '日本語に切り替える',
        'language_english' => '英語に切り替える',
        'hero_alt' => '松明が灯る暗い石造りの地下迷宮に立つマント姿の冒険者',
        'hero_line1' => '光の届かぬ聖域へ',
        'hero_line2' => '五つの鍵を探し、封印された道を切り拓け',
        'hero_gift_note_prefix' => 'このゲームはHirotsugu Takuboのライブに足を運んでくれた方への特典として、',
        'hero_gift_note_keyword' => 'ダンジョン',
        'hero_gift_note_suffix' => 'への鍵をお渡ししたものです。',
        'hero_enter' => '迷宮へ入る',
        'hero_story' => '世界観を知る',
        'hero_footnote' => 'WORLD VISUAL — イメージビジュアル',
        'story_heading1' => '闇の底に',
        'story_heading2' => '忘れられた聖域がある',
        'story_text1' => '石壁に囲まれた地下迷宮。揺れる松明を頼りに通路を進み、古代の遺物へと続く道を探し出す、一人称視点のダークファンタジー探索ゲーム。',
        'story_text2_before' => '入口近くの鍵を手にすると10分間のカウントダウンが始まる。迷宮に隠された',
        'story_text2_highlight' => '5つの鍵',
        'story_text2_after' => 'を集め、閉ざされた壁の先へ進め。',
        'sound_heading1' => '音が描く',
        'sound_heading2' => 'もうひとつの迷宮',
        'sound_text1' => 'ABYSSのBGMには、静かに響き続ける音を中心としたドローンミュージックを採用しています。',
        'sound_text2' => '強いメロディで導くのではなく、持続する音と緩やかな変化が、石壁の冷たさ、灯火の揺らぎ、深い闇に包まれる感覚を引き立てます。',
        'sound_text3' => '足音に耳を澄ませながら、音の余韻とともに進む探索をお楽しみください。',
        'sound_definition_title' => 'DRONE MUSIC とは',
        'sound_definition' => 'メロディやリズムを極限までそぎ落とし、持続音そのものを主役に据えて、微細な音のゆらぎや倍音、音響の質感に意識を集中させる実験的な音楽表現。1960年代にラ・モンテ・ヤングらが確立し、その後アンビエントや現代音楽、ロック、メタルの文脈などにも広がりました。',
        'sound_visual_label' => '深淵に響く、見えない風景。',
        'credits_heading' => '創造主たち',
        'credits_director_bio' => 'サウンドデザイナーとしてプリミティブなドローンミュージックを電子とアコースティックの両面から追求する。また、Sylvan Echoes名義でSpotifyで17万再生されるダンジョンシンセの音源もリリース。',
        'credits_game_designer_bio' => 'ゲーム・Web・UI/UXのデザインを通じて、ABYSSの世界観と探索体験を形にする。ダンジョンの表現や操作画面、ポータルサイトまで一貫して設計し、遊びやすさとダークファンタジーの没入感の両立を追求する。',
        'credits_special_thanks' => 'Liveにお越しの皆様♪',
        'gallery_heading1' => '迷宮の',
        'gallery_heading2' => '風景',
        'gallery_intro1' => '石壁、灯火、静寂。',
        'gallery_intro2' => 'ふたつの視点から、深淵を探索する。',
        'gallery_3d_alt' => '開発中のABYSSの3D MODEゲーム画面。鍵と石造りの通路が映る',
        'gallery_retro_alt' => '開発中のABYSSのRETRO MODEゲーム画面。ドット絵風の通路とミニマップが映る',
        'gallery_torch_alt' => '開発中のABYSSのゲーム画面内の松明',
        'gallery_3d_caption' => '自らの足で、闇を進む。',
        'gallery_retro_caption' => '一歩ずつ、迷宮を刻む。',
        'gallery_torch_caption' => '灯火だけが、道標。',
        'gallery_screenshot' => '開発中のゲーム画面',
        'guide_heading1' => '探索の',
        'guide_heading2' => '手引き',
        'guide_intro1' => 'はじめての探索者の諸君へ。',
        'guide_intro2' => 'ゲームの目的と操作を、ここで確認。',
        'guide_mode_title' => '二つの探索モード',
        'guide_mode_before' => 'は滑らかに移動する自由探索。',
        'guide_mode_after' => 'はマス目単位で移動・旋回する、クラシックなダンジョン探索です。',
        'guide_key_title' => '五つの鍵を集める',
        'guide_key_before' => '迷宮のどこかに眠る鍵を探してください。入口近くの鍵を拾うと',
        'guide_key_highlight' => '10分間の制限時間',
        'guide_key_after' => 'が始まります。',
        'guide_unlock_title' => '封印された道を開く',
        'guide_unlock_text' => '5つすべての鍵を集めると、迷宮のどこかで壁が開きます。変化した通路を探して、さらに奥へ進みましょう。',
        'controls_title' => '操作説明',
        'controls_pc' => 'WASD・矢印キーで移動します。3D MODEではマウスで視点を操作。ゲーム中にCキーでCONFIGを開き、Escキーで閉じられます。RETRO MODEではA・D（←・→）で90度回転、W・S（↑・↓）で1マスずつ前進・後退します。',
        'controls_mobile' => '画面上の方向ボタンで移動・方向転換します。ゲーム中は右下のCONFIGボタンから設定を開けます。RETRO MODEでは1回のタップで1マス移動します。',
        'controls_mobile_label' => 'スマホ',
        'controls_note' => 'CONFIGでは音量・描画品質・3D/RETRO MODE・表示言語（日本語／英語）を切り替えられます。',
        'controls_pc_alt' => 'PC keyboard and mouse controls diagram',
        'controls_mobile_alt' => 'Smartphone directional buttons and CONFIG controls diagram',
        'controls_config_alt' => 'Audio, shadow, mode, and language settings diagram',
        'login_heading1' => '扉の向こうへ。',
        'login_heading2' => '探索を始めよう。',
        'login_intro' => 'ゲームを始めるにはログインが必要です。LOGIN IDとPASSWORDを入力し、封印された聖域へ進んでください。',
        'login_subheading' => '探索者認証',
        'login_button' => 'ENTER THE DUNGEON',
        'login_note' => '認証後、ゲーム画面へ移動します。ゲーム画面にログイン情報は埋め込まれません。',
        'login_error' => 'LOGIN ID または PASSWORD が正しくありません。',
        'placeholder_id' => 'LOGIN IDを入力',
        'placeholder_password' => 'PASSWORDを入力',
    ],
    'en' => [
        'page_description' => 'ABYSS // Dungeon Crawl. Explore the Sunken Sanctum, a dark fantasy first-person dungeon crawler.',
        'brand_top' => 'ABYSS home',
        'nav_label' => 'Page navigation',
        'change_language' => 'Choose display language',
        'menu_open' => 'Open navigation menu',
        'menu_close' => 'Close navigation menu',
        'menu_label' => 'MENU',
        'fullscreen_on' => 'FULLSCREEN',
        'fullscreen_off' => 'EXIT FULLSCREEN',
        'fullscreen_error' => 'Fullscreen is unavailable in this browser. You can continue in the normal view.',
        'language_japanese' => 'Switch to Japanese',
        'language_english' => 'Switch to English',
        'hero_alt' => 'A cloaked explorer standing in a dim torchlit dungeon corridor',
        'hero_line1' => 'Descend into a sanctuary beyond the light.',
        'hero_line2' => 'Find the five keys and break the ancient seal.',
        'hero_gift_note' => 'As a special gift for those who attended Hirotsugu Takubo’s live performance, this game offers you a key to the dungeon.',
        'hero_enter' => 'ENTER THE ABYSS',
        'hero_story' => 'DISCOVER THE STORY',
        'hero_footnote' => 'WORLD VISUAL — CONCEPT ART',
        'story_heading1' => 'Beneath the darkness,',
        'story_heading2' => 'a forgotten sanctuary awaits.',
        'story_text1' => 'A maze of ancient stone walls. Guided by flickering torches, make your way through shadowy corridors toward a lost relic in this first-person dark fantasy dungeon crawler.',
        'story_text2_before' => 'Collect the key near the entrance to start the ten-minute countdown. Find all ',
        'story_text2_highlight' => 'five hidden keys',
        'story_text2_after' => ' and discover what lies beyond the sealed passage.',
        'sound_heading1' => 'Sound paints,',
        'sound_heading2' => 'another labyrinth.',
        'sound_text1' => 'ABYSS features drone music: an atmospheric form built around sustained tones and resonance.',
        'sound_text2' => 'Rather than leading with a pronounced melody, slowly evolving layers of sound evoke the cold stone, flickering firelight, and the vast silence beyond each corridor.',
        'sound_text3' => 'Listen to your footsteps, linger in the echoes, and let the soundscape accompany your descent.',
        'sound_definition_title' => 'WHAT IS DRONE MUSIC?',
        'sound_definition' => 'A style of music that explores continuous tones, layered resonance, and subtle changes over time.',
        'sound_visual_label' => 'An unseen landscape, heard in the abyss.',
        'credits_heading' => 'THE CREATORS',
        'credits_director_bio' => 'As a sound designer, he explores primitive drone music through both electronic and acoustic expression. Under the name Sylvan Echoes, he has also released dungeon synth music with 170,000 streams on Spotify.',
        'credits_game_designer_bio' => 'Through game, web, and UI/UX design, he shapes the world of ABYSS and the experience of exploring it. From the dungeon environments and controls to the portal website, his design work seeks to combine intuitive play with immersive dark fantasy.',
        'credits_special_thanks' => 'Everyone who joined us at the live show ♪',
        'gallery_heading1' => 'GLIMPSES OF',
        'gallery_heading2' => 'THE LABYRINTH',
        'gallery_intro1' => 'Stone walls. Firelight. Silence.',
        'gallery_intro2' => 'Explore the abyss through two different perspectives.',
        'gallery_3d_alt' => 'Actual development screenshot of ABYSS 3D MODE, showing a key inside a stone corridor',
        'gallery_retro_alt' => 'Actual development screenshot of ABYSS RETRO MODE with pixelated corridor walls and a minimap',
        'gallery_torch_alt' => 'Close view of a wall-mounted torch in the ABYSS game',
        'gallery_3d_caption' => 'Walk into the darkness.',
        'gallery_retro_caption' => 'One step at a time.',
        'gallery_torch_caption' => 'Let the fire guide you.',
        'gallery_screenshot' => 'DEVELOPMENT SCREENSHOT',
        'guide_heading1' => 'THE EXPLORER’S',
        'guide_heading2' => 'FIELD GUIDE',
        'guide_intro1' => 'For first-time explorers.',
        'guide_intro2' => 'Review the objective and controls here.',
        'guide_mode_title' => 'Two ways to explore',
        'guide_mode_before' => ' offers smooth, free movement. ',
        'guide_mode_after' => ' brings back classic grid-based movement and 90-degree turns.',
        'guide_key_title' => 'Collect five keys',
        'guide_key_before' => 'Search the dungeon for hidden keys. Collecting the key near the entrance starts a ',
        'guide_key_highlight' => 'ten-minute countdown',
        'guide_key_after' => '.',
        'guide_unlock_title' => 'Break the seal',
        'guide_unlock_text' => 'Gather all five keys to open a hidden wall somewhere in the maze. Find the new passage and continue deeper into the sanctum.',
        'controls_title' => 'HOW TO PLAY',
        'controls_pc' => 'Move with WASD or the arrow keys. In 3D MODE, move the mouse to look around. Press C during play to open CONFIG, or Esc to close it. In RETRO MODE, A/D (left/right arrows) turn 90 degrees; W/S (up/down arrows) move one tile forward or backward.',
        'controls_mobile' => 'Use the on-screen directional buttons to move or turn. Tap CONFIG in the lower-right corner during play to open settings. In RETRO MODE, each forward or backward tap moves one tile.',
        'controls_mobile_label' => 'MOBILE',
        'controls_note' => 'In CONFIG, adjust audio, graphics, 3D/RETRO MODE and the Japanese/English display language.',
        'controls_pc_alt' => 'PC keyboard and mouse controls diagram',
        'controls_mobile_alt' => 'Smartphone directional buttons and CONFIG controls diagram',
        'controls_config_alt' => 'Audio, shadow, mode, and language settings diagram',
        'login_heading1' => 'Beyond the gate,',
        'login_heading2' => 'your journey begins.',
        'login_intro' => 'Log in to enter the dungeon. Enter your LOGIN ID and PASSWORD to step into the sealed sanctuary.',
        'login_subheading' => 'EXPLORER AUTHENTICATION',
        'login_button' => 'ENTER THE DUNGEON',
        'login_note' => 'After authentication, you will be taken to the game. Your login credentials are not embedded in the game page.',
        'login_error' => 'Incorrect LOGIN ID or PASSWORD.',
        'placeholder_id' => 'Enter your login ID',
        'placeholder_password' => 'Enter your password',
    ],
];

// Only translated, project-owned strings are rendered; no user input is echoed.
$t = static fn(string $key): string => htmlspecialchars($translations[$lang][$key], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<!doctype html>
<html lang="<?= $lang ?>">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <meta name="theme-color" content="#0a0909">
    <meta name="description" content="<?= $t('page_description') ?>">
    <title>ABYSS // Dungeon Crawl — The Sunken Sanctum</title>
    <link rel="stylesheet" href="portal.css?v=mobile-45-type-footer-center-20261111">
  </head>
  <body>
    <div class="ambient"></div>
    <!-- Fixed navigation is kept outside the centered shell so its background covers the entire viewport. -->
    <header class="site-header" id="site-header">
      <div class="topbar shell">
        <a class="brand" href="#top" aria-label="<?= $t('brand_top') ?>"><span class="brand-sigil" aria-hidden="true">✦</span><span class="brand-wordmark"><span>ABYSS</span><small>DUNGEON DRONE CRAWLER</small></span></a>
        <button type="button" id="mobile-fullscreen-toggle" class="mobile-fullscreen-toggle" hidden
          aria-label="<?= $t('fullscreen_on') ?>"
          data-fullscreen-on="<?= $t('fullscreen_on') ?>"
          data-fullscreen-off="<?= $t('fullscreen_off') ?>"
          data-fullscreen-error="<?= $t('fullscreen_error') ?>"
          aria-pressed="false"><span aria-hidden="true">⛶</span><span class="fullscreen-label"><?= $t('fullscreen_on') ?></span></button>
        <button
          class="mobile-menu-toggle"
          type="button"
          id="mobile-menu-toggle"
          aria-controls="site-navigation"
          aria-expanded="false"
          aria-label="<?= $t('menu_open') ?>"
          data-label-open="<?= $t('menu_open') ?>"
          data-label-close="<?= $t('menu_close') ?>"
        >
          <span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="menu-toggle-label"><?= $t('menu_label') ?></span>
        </button>
        <nav id="site-navigation" class="site-navigation" aria-label="<?= $t('nav_label') ?>">
          <a href="#story">ABOUT</a>
          <a href="#sound">SOUND</a>
          <a href="#gallery">VIEWS</a>
          <a href="#guide">CONTROLS</a>
          <a href="#credits">CREDITS</a>
          <div class="language-switch" role="group" aria-label="<?= $t('change_language') ?>">
            <a class="language-link<?= $lang === 'ja' ? ' is-active' : '' ?>" href="?lang=ja" lang="ja" hreflang="ja" aria-label="<?= $t('language_japanese') ?>" <?= $lang === 'ja' ? 'aria-current="page"' : '' ?>>JP</a>
            <a class="language-link<?= $lang === 'en' ? ' is-active' : '' ?>" href="?lang=en" lang="en" hreflang="en" aria-label="<?= $t('language_english') ?>" <?= $lang === 'en' ? 'aria-current="page"' : '' ?>>EN</a>
          </div>
        </nav>
      </div>
    </header>
    <div id="fullscreen-message" class="fullscreen-message" role="status" aria-live="polite" hidden></div>
    <main id="top">
      <div class="hero-outer">
      <section class="hero" aria-labelledby="hero-title">
        <img class="hero-image" src="portal_assets/hero.webp" alt="<?= $t('hero_alt') ?>" fetchpriority="high">
        <div class="hero-shade"></div>
        <div class="hero-layout shell">
          <div class="hero-inner">
          <div class="hero-title-lockup">
            <h1 id="hero-title">ABYSS</h1>
            <p class="hero-kicker">DUNGEON DRONE CRAWLER</p>
          </div>
          <p class="hero-copy"><?= $t('hero_line1') ?><br><?= $t('hero_line2') ?></p>
          </div>
            <aside class="login-panel hero-login" id="login" aria-label="ENTRANCE">
              <div class="login-top"><span>ENTRANCE</span><span class="login-symbol">✦</span></div>
              <h3>ACCESS THE ABYSS</h3>
              <p class="login-subheading"><?= $t('login_subheading') ?></p>
              <form action="login.php" method="post">
                <label for="username">LOGIN ID</label>
                <input id="username" name="username" autocomplete="username" required maxlength="128" placeholder="<?= $t('placeholder_id') ?>">
                <label for="password">PASSWORD</label>
                <input id="password" type="password" name="password" autocomplete="current-password" required placeholder="<?= $t('placeholder_password') ?>">
                <button type="submit"><?= $t('login_button') ?> <span>↗</span></button>
              </form>
              <p class="error" id="error" role="alert"><?= isset($_GET['error']) ? $t('login_error') : '' ?></p>
              <p class="login-note"><?= $t('login_note') ?></p>
            </aside>
        </div>
      </section>
    </div><!-- /.hero-outer: centred FHD stage -->
      <section class="story shell section" id="story">
        <div class="story-overline-row">
          <span class="overline">01 — ABOUT</span>
        </div>
        <div class="section-heading">
          <h2><?= $t('story_heading1') ?><br><em><?= $t('story_heading2') ?></em></h2>
        </div>
        <div class="story-body">
          <p><?= $t('story_text1') ?></p>
          <p><?= $t('story_text2_before') ?><strong><?= $t('story_text2_highlight') ?></strong><?= $t('story_text2_after') ?></p>
          <div class="stats">
            <div><strong>05</strong><span>SEALED KEYS</span></div>
            <div><strong>10<span class="unit">MIN</span></strong><span>AFTER FIRST KEY</span></div>
            <div><strong>02</strong><span>PLAY MODES</span></div>
          </div>
        </div>
        <!-- The three exploration cards now follow the ABOUT key/time/mode metrics. -->
        <div class="guide-grid">
          <article class="guide-card">
            <span class="card-num">01 / EXPLORE</span>
            <div class="card-glyph">⌖</div>
            <h3><?= $t('guide_mode_title') ?></h3>
            <p><strong>3D MODE</strong><?= $t('guide_mode_before') ?><strong>RETRO MODE</strong><?= $t('guide_mode_after') ?></p>
          </article>
          <article class="guide-card">
            <span class="card-num">02 / COLLECT</span>
            <div class="card-glyph">⚿</div>
            <h3><?= $t('guide_key_title') ?></h3>
            <p><?= $t('guide_key_before') ?><strong><?= $t('guide_key_highlight') ?></strong><?= $t('guide_key_after') ?></p>
          </article>
          <article class="guide-card">
            <span class="card-num">03 / UNSEAL</span>
            <div class="card-glyph">◇</div>
            <h3><?= $t('guide_unlock_title') ?></h3>
            <p><?= $t('guide_unlock_text') ?></p>
          </article>
        </div>
      </section>
      <!-- 02: An editorial introduction to the game's drone-music atmosphere. -->
      <section class="sound-section section" id="sound" aria-labelledby="sound-heading">
        <div class="shell">
          <div class="sound-overline-row">
            <span class="overline">02 — SOUND</span>
          </div>
          <div class="sound-layout">
            <div class="sound-description">
              <h2 id="sound-heading"><?= $t('sound_heading1') ?><br><em><?= $t('sound_heading2') ?></em></h2>
              <p><?= $t('sound_text1') ?></p>
              <p><?= $t('sound_text2') ?></p>
              <p><?= $t('sound_text3') ?></p>
              <div class="sound-definition">
                <span class="sound-definition-mark" aria-hidden="true">✧</span>
                <div>
                  <h3><?= $t('sound_definition_title') ?></h3>
                  <p><?= $t('sound_definition') ?></p>
                </div>
              </div>
            </div>
            <div class="sound-visual" aria-label="Drone music atmosphere illustration">
              <div class="sound-visual-top"><span>ABYSS / SOUND LANDSCAPE</span><span>02.01 — ◇</span></div>
              <div class="sound-art" aria-hidden="true">
                <div class="sound-orbit sound-orbit-outer"></div>
                <div class="sound-orbit sound-orbit-middle"></div>
                <div class="sound-orbit sound-orbit-inner"></div>
                <div class="sound-halo"></div>
                <div class="sound-core">✦</div>
                <span class="sound-art-axis sound-art-axis-x"></span>
                <span class="sound-art-axis sound-art-axis-y"></span>
              </div>
              <div class="sound-visual-caption">
                <span class="sound-track-kind">BGM — DRONE MUSIC</span>
                <strong>LIVE AT HISOMINE</strong>
                <span class="sound-track-date">JULY 2026</span>
                <p><?= $t('sound_visual_label') ?></p>
              </div>
              <div class="sound-visual-bottom"><span>THE SOUND OF THE SUNKEN SANCTUM</span><span>✧</span></div>
            </div>
          </div>
        </div>
      </section>
      <section class="gallery section" id="gallery">
        <div class="shell">
          <div class="gallery-overline-row">
            <span class="overline">03 — VIEWS</span>
          </div>
          <div class="section-top">
            <div>
              <h2><?= $t('gallery_heading1') ?><?= $lang === 'en' ? ' ' : '' ?><em><?= $t('gallery_heading2') ?></em></h2>
            </div>
            <p><?= $t('gallery_intro1') ?><br><?= $t('gallery_intro2') ?></p>
          </div>
          <div class="gallery-grid">
            <figure class="shot shot-wide">
              <img loading="lazy" src="portal_assets/3dmode.webp" alt="<?= $t('gallery_3d_alt') ?>">
              <figcaption>
                <span>01 / 3D MODE</span>
                <strong><?= $t('gallery_3d_caption') ?></strong>
                <small><?= $t('gallery_screenshot') ?></small>
              </figcaption>
            </figure>
            <figure class="shot">
              <img loading="lazy" src="portal_assets/retromode.webp" alt="<?= $t('gallery_retro_alt') ?>">
              <figcaption>
                <span>02 / RETRO MODE</span>
                <strong><?= $t('gallery_retro_caption') ?></strong>
                <small><?= $t('gallery_screenshot') ?></small>
              </figcaption>
            </figure>
            <figure class="shot">
              <img loading="lazy" src="portal_assets/taimatsu.webp" alt="<?= $t('gallery_torch_alt') ?>">
              <figcaption>
                <span>03 / THE ATMOSPHERE</span>
                <strong><?= $t('gallery_torch_caption') ?></strong>
                <small><?= $t('gallery_screenshot') ?></small>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section class="guide section" id="guide">
        <div class="shell guide-inner">
        <div class="controls-overline-row">
          <span class="overline">04 — CONTROLS</span>
        </div>
        <div class="section-top guide-section-top">
          <div>
            <h2><?= $t('guide_heading1') ?><?= $lang === 'en' ? ' ' : '' ?><em><?= $t('guide_heading2') ?></em></h2>
          </div>
          <p><?= $t('guide_intro1') ?><br><?= $t('guide_intro2') ?></p>
        </div>
        <div class="controls-panel">
          <h3><?= $t('controls_title') ?></h3>
          <div class="controls-cards">
            <article class="control-card">
              <figure class="control-figure" aria-hidden="true">
                <img loading="lazy" src="portal_assets/control_pc.svg" alt="<?= $t('controls_pc_alt') ?>">
              </figure>
              <div class="control-copy">
                <h4>PC</h4>
                <p><?= $t('controls_pc') ?></p>
              </div>
            </article>
            <article class="control-card">
              <figure class="control-figure" aria-hidden="true">
                <img loading="lazy" src="portal_assets/control_mobile.svg" alt="<?= $t('controls_mobile_alt') ?>">
              </figure>
              <div class="control-copy">
                <h4><?= $t('controls_mobile_label') ?></h4>
                <p><?= $t('controls_mobile') ?></p>
              </div>
            </article>
            <article class="control-card">
              <figure class="control-figure" aria-hidden="true">
                <img loading="lazy" src="portal_assets/control_config.svg" alt="<?= $t('controls_config_alt') ?>">
              </figure>
              <div class="control-copy">
                <h4>CONFIG</h4>
                <p class="muted"><?= $t('controls_note') ?></p>
              </div>
            </article>
          </div>
        </div>
        </div>
      </section>
      <!-- 05: Production credits, in the requested order and spelling. -->
      <section class="credits-section section" id="credits" aria-labelledby="credits-heading">
        <div class="shell">
          <div class="credits-header">
            <span class="overline">05 — CREDITS</span>
          </div>
          <div class="credits-layout">
            <div class="credits-intro">
              <h2 id="credits-heading"><?= $t('credits_heading') ?></h2>
            </div>
            <div class="credits-names">
              <dl class="credits-list">
                <div class="credits-entry">
                  <dt>
                    <span class="credits-role">DIRECTION / MUSIC DESIGN</span>
                    <span class="credits-person-name">HIROTSUGU TAKUBO</span>
                  </dt>
                  <dd class="credits-person-bio"><?= $t('credits_director_bio') ?></dd>
                </div>
                <div class="credits-entry">
                  <dt>
                    <span class="credits-role">GAME/WEB/UI/UX DESIGN</span>
                    <span class="credits-person-name">TSUTOMU KANEKO</span>
                  </dt>
                  <dd class="credits-person-bio"><?= $t('credits_game_designer_bio') ?></dd>
                </div>
              </dl>
              <div class="credits-thanks">
                <span>SPECIAL THANKS</span>
                <p><?= $t('credits_special_thanks') ?></p>
              </div>
            </div>
          </div>
          <p class="credits-gift-note"><?php if ($lang === 'ja'): ?><?= $t('hero_gift_note_prefix') ?><span class="credits-gift-word"><?= $t('hero_gift_note_keyword') ?></span><?= $t('hero_gift_note_suffix') ?><?php else: ?><?= $t('hero_gift_note') ?><?php endif; ?></p>
        </div>
      </section>
    </main>
    <footer class="footer shell">
      <a class="brand footer-brand" href="#top" aria-label="ABYSS — TOPへ戻る">
        <span class="brand-sigil" aria-hidden="true">✦</span>
        <span class="brand-wordmark"><span>ABYSS</span><small>DUNGEON DRONE CRAWLER</small></span>
      </a>
      <small>© STUDIO APOGEE 2027</small>
    </footer>
    <script>
      (() => {
        const header = document.getElementById('site-header');
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.getElementById('site-navigation');
        const mobileBreakpoint = window.matchMedia('(max-width: 820px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px)');


        // Hero image placement is CSS-only: 100% stage width up to 1920 CSS px,
        // with proportional scaling and no horizontal cropping. Above 1920,
        // the stage is centered and capped, with equal black side margins.

        // Match the tagline's width to the rendered ABYSS title without stretching glyphs.
        const heroTitle = document.getElementById('hero-title');
        const heroKicker = document.querySelector('.hero-title-lockup .hero-kicker');
        function fitHeroKicker() {
          if (!heroTitle || !heroKicker) return;
          const targetWidth = heroTitle.getBoundingClientRect().width;
          if (targetWidth <= 0) return;
          // Measure the actual browser font and allow for CSS letter spacing.
          const css = getComputedStyle(heroKicker);
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return;
          context.font = `600 100px ${css.fontFamily}`;
          const word = heroKicker.textContent.trim();
          const emSpacing = 0.045;
          const units = context.measureText(word).width / 100 + emSpacing * (word.length - 1);
          if (units <= 0) return;
          heroKicker.style.fontSize = `${(targetWidth / units).toFixed(2)}px`;
          heroKicker.style.width = `${targetWidth.toFixed(2)}px`;
        }
        fitHeroKicker();
        window.addEventListener('resize', fitHeroKicker, {passive: true});
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(fitHeroKicker);
        }

        function setMenuOpen(open) {
          const mobile = mobileBreakpoint.matches;
          const isOpen = Boolean(open && mobile);
          header.classList.toggle('menu-open', isOpen);
          toggle.setAttribute('aria-expanded', String(isOpen));
          toggle.setAttribute('aria-label', toggle.dataset[isOpen ? 'labelClose' : 'labelOpen']);
        }

        toggle.addEventListener('click', () => {
          setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Closing on section selection keeps the chosen destination visible.
        nav.addEventListener('click', (event) => {
          if (event.target.closest('a')) setMenuOpen(false);
        });
        document.addEventListener('click', (event) => {
          if (!header.contains(event.target)) setMenuOpen(false);
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && header.classList.contains('menu-open')) {
            setMenuOpen(false);
            toggle.focus();
          }
        });
        if (mobileBreakpoint.addEventListener) {
          mobileBreakpoint.addEventListener('change', () => setMenuOpen(false));
        } else {
          mobileBreakpoint.addListener(() => setMenuOpen(false));
        }

        // A webpage cannot programmatically remove browser UI. Fullscreen is
        // offered only after a tap and only when the browser supports its API.
        // When turning back to portrait, release fullscreen to restore chrome.
        const fsButton = document.getElementById('mobile-fullscreen-toggle');
        const fsMessage = document.getElementById('fullscreen-message');
        const landscapePhone = window.matchMedia('(orientation: landscape) and (max-height: 650px) and (pointer: coarse)');
        const canFullscreen = typeof document.documentElement.requestFullscreen === 'function' &&
                              typeof document.exitFullscreen === 'function';
        function updateFullscreenUI() {
          const active = Boolean(document.fullscreenElement);
          const visible = canFullscreen && landscapePhone.matches;
          fsButton.hidden = !visible;
          fsButton.setAttribute('aria-pressed', String(active));
          fsButton.setAttribute('aria-label', active ? fsButton.dataset.fullscreenOff : fsButton.dataset.fullscreenOn);
          fsButton.querySelector('.fullscreen-label').textContent = active ? fsButton.dataset.fullscreenOff : fsButton.dataset.fullscreenOn;
          if (!landscapePhone.matches && active) {
            document.exitFullscreen().catch(() => {});
          }
          if (!landscapePhone.matches) {
            fsMessage.hidden = true;
            fsMessage.textContent = '';
          }
        }
        fsButton.addEventListener('click', async () => {
          fsMessage.hidden = true;
          fsMessage.textContent = '';
          try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen({navigationUI: 'hide'});
          } catch (error) {
            // iOS Safari or browser policy may reject Fullscreen API requests.
            fsMessage.textContent = fsButton.dataset.fullscreenError;
            fsMessage.hidden = false;
          }
          updateFullscreenUI();
        });
        document.addEventListener('fullscreenchange', updateFullscreenUI);
        window.addEventListener('resize', updateFullscreenUI, {passive: true});
        window.addEventListener('orientationchange', updateFullscreenUI, {passive: true});
        if (landscapePhone.addEventListener) landscapePhone.addEventListener('change', updateFullscreenUI);
        else landscapePhone.addListener(updateFullscreenUI);
        updateFullscreenUI();
      })();
    </script>
  </body>
</html>
