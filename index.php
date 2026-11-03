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
        'language_japanese' => '日本語に切り替える',
        'language_english' => '英語に切り替える',
        'hero_alt' => '松明が灯る暗い石造りの地下迷宮に立つマント姿の冒険者',
        'hero_line1' => '光の届かぬ聖域へ。',
        'hero_line2' => '五つの鍵を探し、封印された道を切り拓け。',
        'hero_enter' => '迷宮へ入る',
        'hero_story' => '世界観を知る',
        'hero_footnote' => 'WORLD VISUAL — イメージビジュアル',
        'story_heading1' => '闇の底に、',
        'story_heading2' => '忘れられた聖域がある。',
        'story_text1' => '石壁に囲まれた地下迷宮。揺れる松明を頼りに通路を進み、古代の遺物へと続く道を探し出す、一人称視点のダークファンタジー探索ゲーム。',
        'story_text2_before' => '最初の鍵を手にした瞬間、10分間のカウントダウンが始まる。迷宮に隠された',
        'story_text2_highlight' => '5つの鍵',
        'story_text2_after' => 'を集め、閉ざされた壁の先へ進め。',
        'sound_heading1' => '闇の奥へ、',
        'sound_heading2' => '音が沈んでいく。',
        'sound_intro' => '音で描く、もうひとつの迷宮。',
        'sound_text1' => 'ABYSSのBGMには、静かに響き続ける音を中心としたドローンミュージックを採用しています。',
        'sound_text2' => '強いメロディで導くのではなく、持続する音と緩やかな変化が、石壁の冷たさ、灯火の揺らぎ、深い闇に包まれる感覚を引き立てます。',
        'sound_text3' => '足音に耳を澄ませながら、音の余韻とともに進む探索をお楽しみください。',
        'sound_definition_title' => 'DRONE MUSIC とは',
        'sound_definition' => '長く続く音や響きの重なり、ゆっくりとした変化そのものを味わう音楽表現です。',
        'sound_visual_label' => '深淵に響く、見えない風景。',
        'credits_heading1' => 'この深淵を、',
        'credits_heading2' => '形にした人々。',
        'credits_intro' => 'ABYSSの世界をともに創り上げる、制作スタッフとすべての探索者へ。',
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
        'guide_intro1' => '初めての探索者へ。',
        'guide_intro2' => 'ゲームの基本を、ここで確認。',
        'guide_mode_title' => '二つの探索モード',
        'guide_mode_before' => 'は滑らかに移動する自由探索。',
        'guide_mode_after' => 'はマス目単位で移動・旋回する、クラシックなダンジョン探索です。',
        'guide_key_title' => '五つの鍵を集める',
        'guide_key_before' => '迷宮のどこかに眠る鍵を探してください。最初の鍵を拾うと',
        'guide_key_highlight' => '10分間の制限時間',
        'guide_key_after' => 'が始まります。',
        'guide_unlock_title' => '封印された道を開く',
        'guide_unlock_text' => '5つすべての鍵を集めると、迷宮のどこかで壁が開きます。変化した通路を探して、さらに奥へ進みましょう。',
        'controls_title' => '操作方法',
        'controls_pc' => 'WASD・矢印キーで移動。3D MODEは視点操作にマウスを使用します。',
        'controls_mobile' => '画面上の操作ボタンを使用します。RETRO MODEは方向転換と一歩ずつの移動が基本です。',
        'controls_mobile_label' => 'スマートフォン',
        'controls_note' => '音量・描画設定はゲーム内のCONFIGから調整できます。',
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
        'language_japanese' => 'Switch to Japanese',
        'language_english' => 'Switch to English',
        'hero_alt' => 'A cloaked explorer standing in a dim torchlit dungeon corridor',
        'hero_line1' => 'Descend into a sanctuary beyond the light.',
        'hero_line2' => 'Find the five keys and break the ancient seal.',
        'hero_enter' => 'ENTER THE ABYSS',
        'hero_story' => 'DISCOVER THE STORY',
        'hero_footnote' => 'WORLD VISUAL — CONCEPT ART',
        'story_heading1' => 'Beneath the darkness,',
        'story_heading2' => 'a forgotten sanctuary awaits.',
        'story_text1' => 'A maze of ancient stone walls. Guided by flickering torches, make your way through shadowy corridors toward a lost relic in this first-person dark fantasy dungeon crawler.',
        'story_text2_before' => 'The moment you collect the first key, a ten-minute countdown begins. Find all ',
        'story_text2_highlight' => 'five hidden keys',
        'story_text2_after' => ' and discover what lies beyond the sealed passage.',
        'sound_heading1' => 'Beyond the dark,',
        'sound_heading2' => 'sound descends.',
        'sound_intro' => 'Another labyrinth, made of sound.',
        'sound_text1' => 'ABYSS features drone music: an atmospheric form built around sustained tones and resonance.',
        'sound_text2' => 'Rather than leading with a pronounced melody, slowly evolving layers of sound evoke the cold stone, flickering firelight, and the vast silence beyond each corridor.',
        'sound_text3' => 'Listen to your footsteps, linger in the echoes, and let the soundscape accompany your descent.',
        'sound_definition_title' => 'WHAT IS DRONE MUSIC?',
        'sound_definition' => 'A style of music that explores continuous tones, layered resonance, and subtle changes over time.',
        'sound_visual_label' => 'An unseen landscape, heard in the abyss.',
        'credits_heading1' => 'The people',
        'credits_heading2' => 'behind the abyss.',
        'credits_intro' => 'For the creators who shape ABYSS, and everyone who joins us on the journey.',
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
        'guide_intro1' => 'For those entering the dungeon for the first time.',
        'guide_intro2' => 'Everything you need to begin your journey.',
        'guide_mode_title' => 'Two ways to explore',
        'guide_mode_before' => ' offers smooth, free movement. ',
        'guide_mode_after' => ' brings back classic grid-based movement and 90-degree turns.',
        'guide_key_title' => 'Collect five keys',
        'guide_key_before' => 'Search the dungeon for hidden keys. Picking up the first key starts a ',
        'guide_key_highlight' => 'ten-minute countdown',
        'guide_key_after' => '.',
        'guide_unlock_title' => 'Break the seal',
        'guide_unlock_text' => 'Gather all five keys to open a hidden wall somewhere in the maze. Find the new passage and continue deeper into the sanctum.',
        'controls_title' => 'HOW TO PLAY',
        'controls_pc' => 'Move with WASD or the arrow keys. In 3D MODE, use your mouse to look around.',
        'controls_mobile' => 'Use the on-screen controls. In RETRO MODE, turn and move one tile at a time.',
        'controls_mobile_label' => 'MOBILE',
        'controls_note' => 'Adjust audio and graphics in the in-game CONFIG menu.',
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
    <link rel="stylesheet" href="portal.css?v=hero-edge-credits-v2">
  </head>
  <body>
    <div class="ambient"></div>
    <header class="topbar shell">
      <a class="brand" href="#top" aria-label="<?= $t('brand_top') ?>">✦ <span>ABYSS</span> <small>/ DEPTHS</small></a>
      <nav aria-label="<?= $t('nav_label') ?>">
        <a href="#story">STORY</a>
        <a href="#sound">MUSIC</a>
        <a href="#gallery">GALLERY</a>
        <a href="#guide">HOW TO PLAY</a>
        <a href="#credits">CREDITS</a>
        <div class="language-switch" role="group" aria-label="<?= $t('change_language') ?>"><a class="language-link<?= $lang === 'ja' ? ' is-active' : '' ?>" href="?lang=ja" lang="ja" hreflang="ja" aria-label="<?= $t('language_japanese') ?>" <?= $lang === 'ja' ? 'aria-current="page"' : '' ?>>JP</a><a class="language-link<?= $lang === 'en' ? ' is-active' : '' ?>" href="?lang=en" lang="en" hreflang="en" aria-label="<?= $t('language_english') ?>" <?= $lang === 'en' ? 'aria-current="page"' : '' ?>>EN</a></div>
      </nav>
    </header>
    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <img class="hero-image" src="portal_assets/hero.webp" alt="<?= $t('hero_alt') ?>" fetchpriority="high">
        <div class="hero-shade"></div>
        <div class="hero-layout shell">
          <div class="hero-inner">
          <p class="eyebrow"><span class="diamond">✧</span> CHAPTER I — THE SUNKEN SANCTUM</p>
          <h1 id="hero-title">ABYSS<span class="hero-stroke"> / </span><em>DEPTHS</em></h1>
          <p class="hero-kicker">DUNGEON CRAWL <span class="tiny-rule"></span> DARK FANTASY</p>
          <p class="hero-copy"><?= $t('hero_line1') ?><br><?= $t('hero_line2') ?></p>
          </div>
            <aside class="login-panel hero-login" id="login" aria-label="THE ENTRANCE">
              <div class="login-top"><span>THE ENTRANCE</span><span class="login-symbol">✦</span></div>
              <h3>ACCESS THE ABYSS</h3>
              <p><?= $t('login_subheading') ?></p>
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
        <div class="hero-index shell"><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <section class="story shell section" id="story">
        <div class="section-heading">
          <span class="overline">01 — THE CHRONICLE</span>
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
      </section>
      <!-- 02: An editorial introduction to the game's drone-music atmosphere. -->
      <section class="sound-section section" id="sound" aria-labelledby="sound-heading">
        <div class="shell">
          <div class="sound-overline-row">
            <span class="overline">02 — THE RESONANCE</span>
            <span class="sound-overline-detail">SOUND AS ATMOSPHERE / ABYSS</span>
          </div>
          <div class="sound-layout">
            <div class="sound-description">
              <h2 id="sound-heading"><?= $t('sound_heading1') ?><br><em><?= $t('sound_heading2') ?></em></h2>
              <p class="sound-lead"><?= $t('sound_intro') ?></p>
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
          <div class="section-top">
            <div>
              <span class="overline">03 — THROUGH THE DARKNESS</span>
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
      <section class="guide shell section" id="guide">
        <div class="section-top">
          <div>
            <span class="overline">04 — FIELD GUIDE</span>
            <h2><?= $t('guide_heading1') ?><?= $lang === 'en' ? ' ' : '' ?><em><?= $t('guide_heading2') ?></em></h2>
          </div>
          <p><?= $t('guide_intro1') ?><br><?= $t('guide_intro2') ?></p>
        </div>
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
        <div class="controls">
          <div>
            <span class="overline">CONTROLS</span>
            <h3><?= $t('controls_title') ?></h3>
          </div>
          <div class="control-details">
            <p><strong>PC</strong> — <?= $t('controls_pc') ?></p>
            <p><strong><?= $t('controls_mobile_label') ?></strong> — <?= $t('controls_mobile') ?></p>
            <p class="muted"><?= $t('controls_note') ?></p>
          </div>
        </div>
      </section>
      <!-- 05: Production credits, in the requested order and spelling. -->
      <section class="credits-section section" id="credits" aria-labelledby="credits-heading">
        <div class="shell">
          <div class="credits-header">
            <span class="overline">05 — CREDITS</span>
            <span class="credits-header-mark" aria-hidden="true">✦</span>
          </div>
          <div class="credits-layout">
            <div class="credits-intro">
              <h2 id="credits-heading"><?= $t('credits_heading1') ?><br><em><?= $t('credits_heading2') ?></em></h2>
              <p><?= $t('credits_intro') ?></p>
              <span class="credits-ornament" aria-hidden="true">✧ ───── ◇ ───── ✧</span>
            </div>
            <div class="credits-names">
              <dl class="credits-list">
                <div class="credits-entry">
                  <dt>Project Director</dt>
                  <dd>Hirotsugu Takubo</dd>
                </div>
                <div class="credits-entry">
                  <dt>Music Designer</dt>
                  <dd>Hirotsugu Takubo</dd>
                </div>
                <div class="credits-entry">
                  <dt>Game/Web/UI/UX Designer</dt>
                  <dd>Tsutomu Kaneko</dd>
                </div>
              </dl>
              <div class="credits-thanks">
                <span>SPECIAL THANKS</span>
                <p><?= $t('credits_special_thanks') ?></p>
              </div>
            </div>
          </div>
          <div class="credits-end" aria-hidden="true"><span>✧</span> ABYSS // THE SUNKEN SANCTUM <span>✧</span></div>
        </div>
      </section>
    </main>
    <footer class="footer shell">
      <div class="brand">✦ <span>ABYSS</span><small>/ DEPTHS</small></div>
      <p>CHAPTER I — THE SUNKEN SANCTUM</p>
      <small>© ABYSS // DUNGEON CRAWL</small>
    </footer>
  </body>
</html>
