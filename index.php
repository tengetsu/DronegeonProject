<?php
require __DIR__ . '/session.php';
unset($_SESSION['abyss_authenticated']);
?>
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0a0909">
<meta name="description" content="ABYSS // Dungeon Crawl。沈んだ聖域を探索するダークファンタジー・ダンジョンクローラー。">
<title>ABYSS // Dungeon Crawl — The Sunken Sanctum</title>
<link rel="stylesheet" href="portal.css">
</head>
<body>
<div class="ambient"></div>
<header class="topbar shell">
  <a class="brand" href="#top" aria-label="ABYSS トップ">✦ <span>ABYSS</span> <small>/ DEPTHS</small></a>
  <nav aria-label="ページ内ナビゲーション"><a href="#story">STORY</a><a href="#gallery">GALLERY</a><a href="#guide">HOW TO PLAY</a><a class="nav-enter" href="#login">LOGIN <span>↗</span></a></nav>
</header>
<main id="top">
<section class="hero" aria-labelledby="hero-title">
 <img class="hero-image" src="portal_assets/hero.webp" alt="暗い石造りの地下回廊、松明、古代の石像を描いたダークファンタジーの迷宮イメージ" fetchpriority="high">
 <div class="hero-shade"></div>
 <div class="hero-inner shell">
  <p class="eyebrow"><span class="diamond">✧</span> CHAPTER I — THE SUNKEN SANCTUM</p>
  <h1 id="hero-title">ABYSS<span class="hero-stroke"> / </span><em>DEPTHS</em></h1>
  <p class="hero-kicker">DUNGEON CRAWL <span class="tiny-rule"></span> DARK FANTASY</p>
  <p class="hero-copy">光の届かぬ聖域へ。<br>五つの鍵を探し、封印された道を切り拓け。</p>
  <div class="hero-actions"><a class="primary-cta" href="#login">迷宮へ入る <span>↗</span></a><a class="quiet-link" href="#story">世界観を知る ↓</a></div>
  <p class="hero-footnote">WORLD VISUAL — イメージビジュアル</p>
 </div>
 <div class="hero-index shell"><span>01 / THE DESCENT</span><span>SCROLL TO EXPLORE ↓</span></div>
</section>
<section class="story shell section" id="story">
 <div class="section-heading"><span class="overline">01 — THE CHRONICLE</span><h2>闇の底に、<br><em>忘れられた聖域がある。</em></h2></div>
 <div class="story-body"><p>石壁に囲まれた地下迷宮。揺れる松明を頼りに通路を進み、古代の遺物へと続く道を探し出す、一人称視点のダークファンタジー探索ゲーム。</p><p>最初の鍵を手にした瞬間、10分間のカウントダウンが始まる。迷宮に隠された<strong>5つの鍵</strong>を集め、閉ざされた壁の先へ進め。</p>
 <div class="stats"><div><strong>05</strong><span>SEALED KEYS</span></div><div><strong>10<span class="unit">MIN</span></strong><span>AFTER FIRST KEY</span></div><div><strong>02</strong><span>PLAY MODES</span></div></div></div>
</section>
<section class="gallery section" id="gallery">
 <div class="shell"><div class="section-top"><div><span class="overline">02 — THROUGH THE DARKNESS</span><h2>迷宮の<em>風景</em></h2></div><p>石壁、灯火、静寂。<br>ふたつの視点から、深淵を探索する。</p></div>
 <div class="gallery-grid">
  <figure class="shot shot-wide"><img loading="lazy" src="portal_assets/gallery-3d.webp" alt="ダークファンタジーの石造りの地下迷宮と松明を描いたコンセプト画像"><figcaption><span>01 / 3D MODE</span><strong>自らの足で、闇を進む。</strong><small>コンセプトビジュアル</small></figcaption></figure>
  <figure class="shot"><img loading="lazy" src="portal_assets/gallery-retro.webp" alt="開発中のレトロ風ダンジョン画面"><figcaption><span>02 / RETRO MODE</span><strong>一歩ずつ、迷宮を刻む。</strong><small>現在の開発中ゲーム画面</small></figcaption></figure>
  <figure class="shot"><img loading="lazy" src="portal_assets/gallery-atmosphere.webp" alt="開発中のゲーム画面に映る松明を拡大した画像"><figcaption><span>03 / THE ATMOSPHERE</span><strong>灯火だけが、道標。</strong><small>ゲーム画面の松明を拡大</small></figcaption></figure>
 </div></div>
</section>
<section class="guide shell section" id="guide">
 <div class="section-top"><div><span class="overline">03 — FIELD GUIDE</span><h2>探索の<em>手引き</em></h2></div><p>初めての探索者へ。<br>ゲームの基本を、ここで確認。</p></div>
 <div class="guide-grid">
  <article class="guide-card"><span class="card-num">01 / EXPLORE</span><div class="card-glyph">⌖</div><h3>二つの探索モード</h3><p><strong>3D MODE</strong>は滑らかに移動する自由探索。<strong>RETRO MODE</strong>はマス目単位で移動・旋回する、クラシックなダンジョン探索です。</p></article>
  <article class="guide-card"><span class="card-num">02 / COLLECT</span><div class="card-glyph">⚿</div><h3>五つの鍵を集める</h3><p>迷宮のどこかに眠る鍵を探してください。最初の鍵を拾うと<strong>10分間の制限時間</strong>が始まります。</p></article>
  <article class="guide-card"><span class="card-num">03 / UNSEAL</span><div class="card-glyph">◇</div><h3>封印された道を開く</h3><p>5つすべての鍵を集めると、迷宮のどこかで壁が開きます。変化した通路を探して、さらに奥へ進みましょう。</p></article>
 </div>
 <div class="controls"><div><span class="overline">CONTROLS</span><h3>操作方法</h3></div><div class="control-details"><p><strong>PC</strong> — WASD・矢印キーで移動。3D MODEは視点操作にマウスを使用します。</p><p><strong>スマートフォン</strong> — 画面上の操作ボタンを使用します。RETRO MODEは方向転換と一歩ずつの移動が基本です。</p><p class="muted">音量・描画設定はゲーム内のCONFIGから調整できます。</p></div></div>
</section>
<section class="access section" id="login"><div class="shell access-layout"><div class="access-intro"><span class="overline">04 — THE GATEKEEPER</span><h2>扉の向こうへ。<br><em>探索を始めよう。</em></h2><p>ゲームを始めるにはログインが必要です。LOGIN IDとPASSWORDを入力し、封印された聖域へ進んでください。</p><div class="access-seal">✧<span>AUTHORIZED EXPLORERS ONLY</span></div></div>
<div class="login-panel"><div class="login-top"><span>THE ENTRANCE</span><span class="login-symbol">✦</span></div><h3>ACCESS THE ABYSS</h3><p>探索者認証</p>
<form action="login.php" method="post"><label for="username">LOGIN ID</label><input id="username" name="username" autocomplete="username" required maxlength="128" placeholder="Enter your ID"><label for="password">PASSWORD</label><input id="password" type="password" name="password" autocomplete="current-password" required placeholder="Enter your password"><button type="submit">ENTER THE DUNGEON <span>↗</span></button></form>
<p class="error" id="error" role="alert"></p><p class="login-note">認証後、ゲーム画面へ移動します。ゲーム画面にログイン情報は埋め込まれません。</p>
</div></div></section>
</main>
<footer class="footer shell"><div class="brand">✦ <span>ABYSS</span> <small>/ DEPTHS</small></div><p>CHAPTER I — THE SUNKEN SANCTUM</p><small>© ABYSS // DUNGEON CRAWL</small></footer>
<script>if(new URLSearchParams(location.search).has('error'))document.getElementById('error').textContent='LOGIN ID または PASSWORD が正しくありません。';</script>
</body></html>