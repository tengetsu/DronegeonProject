// Load Three.js once; if the first CDN is blocked, try a second provider.
// No map, camera or relic objects are stretched by this fallback.
let THREE;
try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
}
catch (primaryError) {
    console.warn('ABYSS: jsDelivr failed, trying unpkg.', primaryError);
    try {
        THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    }
    catch (secondaryError) {
        const error = new Error('Three.js の読み込みに失敗しました。インターネット接続・CDNへのアクセス・ブラウザ設定をご確認ください。');
        error.cause = secondaryError;
        throw error;
    }
}
// ==================================================
// DOM Elements
// ==================================================
const mount = document.querySelector('#game');
const overlay = document.querySelector('#overlay');
const startButton = document.querySelector('#start');
// Configuration UI
const configOverlay = document.querySelector('#config-overlay');
const configButton = document.querySelector('#config');
const configClose = document.querySelector('#config-close');
const configBack = document.querySelector('#config-back');
// Touch-only in-game CONFIG shortcut.
const mobileGameConfigButton = document.querySelector('#mobile-game-config');
function syncMobileGameConfigButton() {
    const canOpen = gameStarted && !won && !configOpen;
    document.body.classList.toggle('abyss-playing', canOpen);
    mobileGameConfigButton.setAttribute('aria-expanded', String(configOpen));
}
// Configuration Sliders
const masterVolumeInput = document.querySelector('#master-volume');
const sfxVolumeInput = document.querySelector('#sfx-volume');
const brightnessInput = document.querySelector('#brightness');
// Configuration Toggles
const torchShadowsInput = document.querySelector('#torch-shadows');
const bloomInput = document.querySelector('#bloom');
const ambientEffectsInput = document.querySelector('#ambient-effects');
const highResolutionInput = document.querySelector('#high-resolution');
// Start in a low-cost rendering mode; HIGH RESOLUTION can be enabled manually.
highResolutionInput.checked = false;
const ABYSS_MOBILE = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
const ABYSS_MAX_FPS = ABYSS_MOBILE ? 20 : 24;
const ABYSS_IDLE_FPS = 4;
const ABYSS_RENDER_WIDTH = ABYSS_MOBILE ? 720 : 960;
const ABYSS_RENDER_HEIGHT = ABYSS_MOBILE ? 480 : 540;
const retroModeInput = document.querySelector('#retro-mode');
// Slider Value Labels
const masterVolumeValue = document.querySelector('#master-volume-value');
const sfxVolumeValue = document.querySelector('#sfx-volume-value');
const brightnessValue = document.querySelector('#brightness-value');
const resolutionStatus = document.querySelector('#resolution-status');
// ==================================================
// Configuration Settings
// ==================================================
let brightnessMultiplier = 1.0;
let glowMultiplier = 1.0;
let masterVolume = 0.8;
let sfxVolume = 0.8;
// Background music: save BGM/Live-at-hisomine_-July-2026.mp3.
// Audio is served through the authenticated PHP endpoint: asset.php?file=bgm.
// Browsers permit playback after a user gesture (ENTER THE DUNGEON).
const dungeonBgm = new Audio('asset.php?file=bgm');
dungeonBgm.loop = true;
dungeonBgm.preload = 'auto';
dungeonBgm.volume = masterVolume;
dungeonBgm.addEventListener('error', () => {
    console.warn('ABYSS: BGM could not be loaded. Check the BGM folder and filename.');
});
function syncMasterVolume() {
    dungeonBgm.volume = Math.max(0, Math.min(1, masterVolume));
}
function startDungeonBgm() {
    syncMasterVolume();
    if (!dungeonBgm.paused)
        return;
    dungeonBgm.play().catch(error => {
        console.warn('ABYSS: BGM playback was blocked or the file could not be decoded.', error);
    });
}
let soundEffectsEnabled = true;
// The sealed wall moves only when all five keys have been collected.
// Unlike footsteps, this one-shot SE has no walking echo or 3x gain.
const wallMovesSe = new Audio('asset.php?file=wall');
wallMovesSe.preload = 'auto';
wallMovesSe.addEventListener('error', () => {
    console.warn('ABYSS: Wall movement SE could not be loaded. Check ./SE/The Wall Moves.mp3');
});
function playWallMovesSe() {
    if (!soundEffectsEnabled || sfxVolume <= 0)
        return;
    wallMovesSe.volume = Math.max(0, Math.min(1, sfxVolume));
    wallMovesSe.pause();
    wallMovesSe.currentTime = 0;
    wallMovesSe.play().catch(error => {
        console.warn('ABYSS: Wall movement SE playback failed.', error);
    });
}
// Walking SE: place the MP3 in ./SE/ next to index.html.
// 3D: loop only while the player is actually moving.
// RETRO MODE: play once for each successful grid step.
const walkingSe = new Audio('asset.php?file=walk');
walkingSe.preload = 'metadata';
// Dedicated RETRO footstep player. A shared HTMLAudioElement could retain
// the 3D loop/playback state and suppress grid-step sounds.
const retroWalkingSe = new Audio('asset.php?file=walk');
retroWalkingSe.preload = 'metadata';
retroWalkingSe.loop = false;
retroWalkingSe.addEventListener('ended', stopRetroFootstep);
retroWalkingSe.addEventListener('error', () => console.warn('ABYSS: RETRO footstep failed:', retroWalkingSe.error));
walkingSe.loop = false;
walkingSe.addEventListener('error', () => {
    console.warn('ABYSS: Walking SE failed:', walkingSe.error, 'Check asset.php?file=walk after login.');
});
// SOUND EFFECTS controls footstep volume independently of MASTER VOLUME.
// Web Audio gain allows boosting the original SE above HTMLAudioElement's
// volume limit of 1.0. Only the walking SE is amplified; BGM is unchanged.
const WALKING_SE_GAIN = 3.0;
// Subtle stone-dungeon echo. Tune these constants to taste.
// Delay: time until the first reflection; feedback: number/strength of repeats;
// wet: reflected sound volume compared with the original footstep.
const WALKING_ECHO_DELAY = 0.21; // seconds
const WALKING_ECHO_FEEDBACK = 0.24; // 0..less than 1
const WALKING_ECHO_WET = 0.50; // echo mix
let walkingAudioContext = null;
let walkingGainNode = null;
let retroFootstepTimer = null;
let retroWalkingGainNode = null;
const RETRO_FOOTSTEP_MS = 1000;
// Direct HTMLAudio playback avoids muted output when WebAudio is suspended.
// Use independent players for continuous 3D steps and short RETRO steps.
function prepareWalkingAudio() {
    syncWalkingSeVolume();
}
function syncWalkingSeVolume() {
    const volume = Math.max(0, Math.min(1, sfxVolume)) * (soundEffectsEnabled ? 1 : 0);
    walkingSe.volume = volume;
    retroWalkingSe.volume = volume;
}
function stopWalkingSe() {
    walkingSe.pause();
    walkingSe.loop = false;
}
function update3DWalkingSe(isMoving) {
    syncWalkingSeVolume();
    if (!isMoving || !soundEffectsEnabled || sfxVolume <= 0) {
        stopWalkingSe();
        return;
    }
    walkingSe.loop = true;
    if (walkingSe.paused) {
        prepareWalkingAudio();
        walkingSe.play().catch(error => {
            console.warn('ABYSS: Walking SE playback failed.', error);
        });
    }
}
// Resume Web Audio during an actual click/tap/key event, required on mobile.
function unlockAbyssAudio() {
    try {
        prepareWalkingAudio();
    }
    catch (error) {
        console.warn('ABYSS audio initialization:', error);
    }
}
document.addEventListener('pointerdown', unlockAbyssAudio, { capture: true });
document.addEventListener('keydown', unlockAbyssAudio, { capture: true });
// RETRO MODE: use the existing shared walking audio, with no overlapping voices.
// Do not restart a footstep that is still playing; let it finish naturally.
// The shared Web Audio route retains the 3x gain, echo and SFX volume control.
function stopRetroFootstep() {
    if (retroFootstepTimer !== null) {
        clearTimeout(retroFootstepTimer);
        retroFootstepTimer = null;
    }
    retroWalkingSe.pause();
    try {
        retroWalkingSe.currentTime = 0;
    }
    catch (error) { /* no metadata yet */ }
}
function playRetroFootstep() {
    if (!soundEffectsEnabled || sfxVolume <= 0)
        return;
    // A successful grid movement produces at most one second of sound.
    // Do not overlap or restart a sound while the previous step is playing.
    if (retroFootstepTimer !== null)
        return;
    prepareWalkingAudio();
    retroWalkingSe.loop = false;
    try {
        retroWalkingSe.currentTime = 0;
    }
    catch (error) { /* wait for metadata */ }
    retroFootstepTimer = setTimeout(stopRetroFootstep, RETRO_FOOTSTEP_MS);
    retroWalkingSe.play().catch(error => {
        console.warn('ABYSS: RETRO walking SE playback failed.', error);
        stopRetroFootstep();
    });
}
let shadowsEnabled = true;
let bloomEnabled = false;
let ambientEffectsEnabled = false;
let retroModeEnabled = localStorage.getItem('abyss-retro-mode') === 'true';
// ==================================================
// Scene
// ==================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09070d);
scene.fog = new THREE.Fog(0x09070d, 3.5, 16.0);
// ==================================================
// Camera
// ==================================================
// Each original 1x1 grid tile becomes 2.3x2.3 world units. Wall height is 2.3.
// The 15x15 map pattern itself is unchanged; objects are NOT stretched.
const MAP_CELL = 2.3;
const MAP_WORLD_CENTER = -MAP_CELL / 2;
const MAP_WORLD_SIZE = 15 * MAP_CELL;
// 1.0 = original view; 0.80 = approximately 25% wider horizontal view.
// Adjust toward 0.70 for more width or toward 1.0 for less width.
const CAMERA_HORIZONTAL_PROJECTION_SCALE = 1.0;
const camera = new THREE.PerspectiveCamera(82, innerWidth / innerHeight, 0.1, 100);
camera.projectionMatrix.elements[0] *= CAMERA_HORIZONTAL_PROJECTION_SCALE;
camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
// Initial spawn position (mapWorldX/mapWorldZ are declared later).
camera.position.set(5.5 * MAP_CELL, 1.02, 5.5 * MAP_CELL);
// ==================================================
// Renderer
// ==================================================
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'low-power'
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
mount.appendChild(renderer.domElement);
// ==================================================
// Lighting
// ==================================================
const hemisphere = new THREE.HemisphereLight(0x665b70, 0x29232f, 0.72);
scene.add(hemisphere);
const ambient = new THREE.AmbientLight(0x71647c, 0.42);
scene.add(ambient);
const playerLamp = new THREE.PointLight(0xffb477, 2.6, 12.0, 1.8);
scene.add(playerLamp);
// Reference uses a single warm lamp and torch lights, without a strong fill light.
// ==================================================
// Materials
// ==================================================
// Pixel-stone texture adapted from the reference HTML (mortar, chips and cracks).
const stoneCanvas = document.createElement('canvas');
stoneCanvas.width = 128;
stoneCanvas.height = 128;
const stoneCtx = stoneCanvas.getContext('2d');
stoneCtx.fillStyle = '#171219';
stoneCtx.fillRect(0, 0, 128, 128);
let stoneSeed = 87321;
function stoneRand() { stoneSeed = (stoneSeed * 1664525 + 1013904223) >>> 0; return stoneSeed / 4294967296; }
const stoneRows = [{ y: 2, h: 27, offset: -14 }, { y: 31, h: 29, offset: -38 }, { y: 62, h: 27, offset: -8 }, { y: 91, h: 34, offset: -29 }];
for (const row of stoneRows)
    for (let x = row.offset; x < 128; x += 48) {
        const bx = x + 2, by = row.y, bw = 44 + Math.floor(stoneRand() * 4), bh = row.h - 3, base = 68 + Math.floor(stoneRand() * 27);
        stoneCtx.fillStyle = `rgb(${base + 5},${base - 7},${base - 5})`;
        stoneCtx.fillRect(bx, by, bw, bh);
        stoneCtx.fillStyle = `rgb(${base + 20},${base + 6},${base - 1})`;
        stoneCtx.fillRect(bx + 2, by + 2, bw - 5, 2);
        stoneCtx.fillStyle = 'rgba(7,4,9,0.62)';
        stoneCtx.fillRect(bx + 1, by + bh - 3, bw - 2, 3);
        for (let i = 0; i < 12; i++) {
            stoneCtx.fillStyle = stoneRand() > .5 ? 'rgba(220,157,104,0.15)' : 'rgba(12,6,12,0.24)';
            stoneCtx.fillRect(bx + Math.floor(stoneRand() * (bw - 4)), by + Math.floor(stoneRand() * (bh - 4)), 2 + Math.floor(stoneRand() * 5), 2 + Math.floor(stoneRand() * 3));
        }
        if (stoneRand() > .32) {
            stoneCtx.strokeStyle = 'rgba(16,8,12,0.82)';
            stoneCtx.lineWidth = 1;
            const cx = bx + 8 + Math.floor(stoneRand() * (bw - 16)), cy = by + 5 + Math.floor(stoneRand() * (bh - 10));
            stoneCtx.beginPath();
            stoneCtx.moveTo(cx, cy);
            stoneCtx.lineTo(cx + 3, cy + 5);
            stoneCtx.lineTo(cx - 1, cy + 10);
            stoneCtx.lineTo(cx + 4, cy + 14);
            stoneCtx.stroke();
        }
        if (stoneRand() > .28) {
            stoneCtx.fillStyle = 'rgba(48,34,39,0.55)';
            const mx = bx + Math.floor(stoneRand() * (bw - 12)), my = by + bh - 5;
            stoneCtx.fillRect(mx, my, 5 + Math.floor(stoneRand() * 10), 2 + Math.floor(stoneRand() * 4));
        }
    }
const stoneTexture = new THREE.CanvasTexture(stoneCanvas);
stoneTexture.colorSpace = THREE.SRGBColorSpace;
stoneTexture.magFilter = THREE.NearestFilter;
stoneTexture.minFilter = THREE.NearestFilter;
stoneTexture.wrapS = THREE.RepeatWrapping;
stoneTexture.wrapT = THREE.RepeatWrapping;
const stone = new THREE.MeshStandardMaterial({ map: stoneTexture, color: 0xb5a2a0, emissive: 0x120807, roughness: 0.9, flatShading: true });
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x514b59,
    emissive: 0x100d14,
    roughness: 1
});
const trim = new THREE.MeshStandardMaterial({
    color: 0x625967,
    emissive: 0x100d14,
    roughness: 0.9
});
const colliders = [];
// ==================================================
// Create Block
// ==================================================
function block(x, y, z, sx, sy, sz, mat = stone) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    // 高さのある壁や柱だけを衝突判定の対象にする
    if (sy >= 1) {
        colliders.push(m);
    }
    return m;
}
// ==================================================
// Dungeon Floor and Ceiling
// ==================================================
// A wall tile is 2.3 units tall, so make its X/Z footprint 2.3 x 2.3.
// The 15x15 ABYSS_MAP grid stays exactly the same; only physical spacing
// between grid centers changes. Relic, keys and torches retain their shapes.
// Change this value to adjust corridor/wall width without camera distortion.
block(MAP_WORLD_CENTER, -0.2, MAP_WORLD_CENTER, MAP_WORLD_SIZE + 0.8, 0.4, MAP_WORLD_SIZE + 0.8, floorMat);
block(MAP_WORLD_CENTER, 4, MAP_WORLD_CENTER, MAP_WORLD_SIZE + 0.8, 0.5, MAP_WORLD_SIZE + 0.8, stone);
// ==================================================
// Outer Boundary Walls
// ==================================================
// Keep the outer boundary beyond the newly widened 15x15 wall grid.
const outerEdge = MAP_WORLD_SIZE / 2 + 0.2;
block(MAP_WORLD_CENTER - outerEdge, 1.8, MAP_WORLD_CENTER, 0.4, 3.6, MAP_WORLD_SIZE + 0.8, trim);
block(MAP_WORLD_CENTER + outerEdge, 1.8, MAP_WORLD_CENTER, 0.4, 3.6, MAP_WORLD_SIZE + 0.8, trim);
block(MAP_WORLD_CENTER, 1.8, MAP_WORLD_CENTER - outerEdge, MAP_WORLD_SIZE + 0.8, 3.6, 0.4, trim);
block(MAP_WORLD_CENTER, 1.8, MAP_WORLD_CENTER + outerEdge, MAP_WORLD_SIZE + 0.8, 3.6, 0.4, trim);
// ==================================================
// Reference 15x15 dungeon layout (same wall grid as the reference HTML)
// ==================================================
let ABYSS_MAP = [
    "###############",
    "#S....#.......#",
    "###.#.#.#####.#",
    "#...#...#...#.#",
    "#.#####.#.#.#.#",
    "#.....#...#...#",
    "#.###.#####.###",
    "#...#.....#...#",
    "###.#####.###.#",
    "#...#...#.....#",
    "#.###.#.#######",
    "#.....#.....K.#",
    "#.#########.#.#",
    "#...........#E#",
    "###############"
];
const GATE_CELL = { gx: 12, gz: 11 };
let sealedGate = null;
// All five key locations are fixed (grid coordinates, zero-based).
const KEY_CELLS = [
    { gx: 3, gz: 1 },
    { gx: 13, gz: 1 },
    { gx: 8, gz: 7 },
    { gx: 6, gz: 9 },
    { gx: 6, gz: 13 }
];
for (const { gx, gz } of KEY_CELLS) {
    if (ABYSS_MAP[gz]?.[gx] !== '.') {
        throw new Error(`Invalid key placement at X=${gx}, Y=${gz}`);
    }
}
let collectedKeyCount = 0, gateUnlocked = false;
// Five-key quest HUD. The countdown starts only after the key at (3,1).
const KEY_QUEST_DURATION_MS = 10 * 60 * 1000;
let keyQuestDeadline = null;
let keyQuestRemainingMs = KEY_QUEST_DURATION_MS;
const keyQuestStyle = document.createElement('style');
keyQuestStyle.textContent = `
#abyss-key-quest-hud { position:relative; top:auto; bottom:auto; left:auto; margin-top:12px; width:max-content; z-index:35;
  display:none; align-items:center; gap:14px; padding:9px 12px;
  background:rgba(13,9,22,.88); border:2px solid #806071;
  box-shadow:3px 3px 0 #030205; color:#f3db9b;
  font-family:monospace; font-weight:bold; font-size:17px;
  letter-spacing:1px; pointer-events:none; }
.stats { display:none !important; }
#abyss-key-quest-hud .abyss-key-icon { color:#f6c55c; font-size:22px; }
#abyss-key-quest-hud .abyss-key-timer { font-variant-numeric:tabular-nums; color:#e8dfd0; }
#abyss-key-quest-hud .abyss-key-timer.warning { color:#ff7777; }
@media (max-width:900px) and (pointer:coarse) {
  #abyss-key-quest-hud { position:relative; top:auto; bottom:auto; left:auto; margin-top:10px; padding:7px 9px;
    gap:10px; font-size:14px; }
  #abyss-key-quest-hud .abyss-key-icon { font-size:19px; }
}`;
document.head.appendChild(keyQuestStyle);
const keyQuestHud = document.createElement('div');
keyQuestHud.id = 'abyss-key-quest-hud';
keyQuestHud.setAttribute('aria-label', '取得した鍵と封印解除までの残り時間');
keyQuestHud.innerHTML = '<span class="abyss-key-count"><span class="abyss-key-icon">🗝</span> ×<span id="abyss-key-count-value">0</span><span style="opacity:.65">/5</span></span><span class="abyss-key-timer" id="abyss-key-timer">10:00</span>';
// Place the quest HUD directly below CHAPTER I on desktop and mobile.
const chapterHeading = document.querySelector('.chapter');
if (chapterHeading)
    chapterHeading.insertAdjacentElement('afterend', keyQuestHud);
else
    document.body.appendChild(keyQuestHud);
const keyCountValue = document.getElementById('abyss-key-count-value');
const keyTimerValue = document.getElementById('abyss-key-timer');
function updateKeyQuestHud() {
    keyQuestHud.style.display = gameStarted && !won ? 'flex' : 'none';
    keyCountValue.textContent = String(collectedKeyCount);
    if (keyQuestDeadline !== null && !gateUnlocked) {
        keyQuestRemainingMs = Math.max(0, keyQuestDeadline - performance.now());
    }
    const totalSeconds = Math.ceil(keyQuestRemainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    keyTimerValue.textContent = `${String(minutes).padStart(2, '0')}:${seconds}`;
    keyTimerValue.classList.toggle('warning', keyQuestDeadline !== null && !gateUnlocked && totalSeconds <= 60);
}
const mapWorldX = gx => (7 - gx) * MAP_CELL;
const mapWorldZ = gz => (7 - gz) * MAP_CELL;
// Each '#' in the reference map becomes a real 3D wall and a collider.
for (let gz = 0; gz < ABYSS_MAP.length; gz++) {
    for (let gx = 0; gx < ABYSS_MAP[gz].length; gx++) {
        if (ABYSS_MAP[gz][gx] === '#' || ABYSS_MAP[gz][gx] === 'K') {
            const wall = block(mapWorldX(gx) - MAP_CELL / 2, 1.15, mapWorldZ(gz) - MAP_CELL / 2, MAP_CELL, 2.3, MAP_CELL, stone);
            if (ABYSS_MAP[gz][gx] === 'K')
                sealedGate = wall;
        }
    }
}
// ==================================================
// Reference-sketch floor and ceiling: cracked, uneven stone slabs.
// Kept separate from walls/colliders so movement and minimap stay intact.
// ==================================================
function abyssSlabTexture(ceiling = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    let seed = ceiling ? 79331 : 41537;
    const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    ctx.fillStyle = ceiling ? '#17131a' : '#171219';
    ctx.fillRect(0, 0, 128, 128);
    // Four large, irregular slabs per tile, with dark recessed mortar.
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const x = col * 64 + 3, y = row * 64 + 3;
            const v = Math.floor(rand() * 22);
            const r = (ceiling ? 57 : 67) + v;
            const g = (ceiling ? 45 : 49) + v;
            const b = (ceiling ? 49 : 50) + v;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, 58, 58);
            // Edge bevels and dark mortar: old, broken stone.
            ctx.fillStyle = 'rgba(192,139,100,0.16)';
            ctx.fillRect(x + 2, y + 2, 54, 3);
            ctx.fillStyle = 'rgba(5,3,8,0.65)';
            ctx.fillRect(x + 1, y + 54, 57, 4);
            ctx.fillRect(x + 54, y + 4, 4, 54);
            // Chunky pixel grain; nearest-neighbor texture filtering.
            for (let i = 0; i < 55; i++) {
                const px = x + 3 + Math.floor(rand() * 49);
                const py = y + 4 + Math.floor(rand() * 47);
                ctx.fillStyle = rand() > 0.48
                    ? 'rgba(223,166,107,0.12)' : 'rgba(8,5,12,0.22)';
                ctx.fillRect(px, py, 2 + Math.floor(rand() * 6), 2 + Math.floor(rand() * 4));
            }
            // Jagged cracks crossing a stone's surface.
            for (let k = 0; k < 2; k++) {
                if (rand() < 0.25)
                    continue;
                let px = x + 9 + rand() * 39, py = y + 7 + rand() * 16;
                ctx.beginPath();
                ctx.moveTo(Math.floor(px), Math.floor(py));
                for (let s = 0; s < 5; s++) {
                    px += (rand() - .5) * 13;
                    py += 5 + rand() * 6;
                    ctx.lineTo(Math.floor(px), Math.floor(py));
                }
                ctx.strokeStyle = 'rgba(12,7,13,0.72)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            // Worn, irregular torchlight-catching flecks.
            if (!ceiling) {
                for (let i = 0; i < 9; i++) {
                    ctx.fillStyle = 'rgba(220,155,86,0.18)';
                    ctx.fillRect(x + Math.floor(rand() * 53), y + Math.floor(rand() * 51), 2 + Math.floor(rand() * 5), 1 + Math.floor(rand() * 2));
                }
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
}
const abyssFloorSlabs = new THREE.MeshStandardMaterial({
    map: abyssSlabTexture(false), color: 0xb5a2a0,
    roughness: 0.48, metalness: 0.04, emissive: 0x120807,
    flatShading: true
});
const abyssCeilingSlabs = new THREE.MeshStandardMaterial({
    map: abyssSlabTexture(true), color: 0x92858a,
    roughness: 0.95, emissive: 0x090507, flatShading: true
});
const abyssFloorGeo = new THREE.BoxGeometry(MAP_CELL - 0.01, 0.055, MAP_CELL - 0.01);
const abyssCeilingGeo = new THREE.BoxGeometry(MAP_CELL - 0.01, 0.085, MAP_CELL - 0.01);
for (let gz = 0; gz < ABYSS_MAP.length; gz++) {
    for (let gx = 0; gx < ABYSS_MAP[gz].length; gx++) {
        if (ABYSS_MAP[gz][gx] === '#' || ABYSS_MAP[gz][gx] === 'K')
            continue;
        const wx = mapWorldX(gx) - MAP_CELL / 2;
        const wz = mapWorldZ(gz) - MAP_CELL / 2;
        const floorTile = new THREE.Mesh(abyssFloorGeo, abyssFloorSlabs);
        floorTile.position.set(wx, 0.002, wz);
        floorTile.receiveShadow = true;
        scene.add(floorTile);
        const ceilingTile = new THREE.Mesh(abyssCeilingGeo, abyssCeilingSlabs);
        ceilingTile.position.set(wx, 2.355, wz);
        ceilingTile.receiveShadow = true;
        scene.add(ceilingTile);
    }
}
// Floor's subtle specular response picks up existing animated torch lights.
// No new lights, collisions, or map cells are introduced.
// ==================================================
// Decorative Stone Details
// ==================================================
for (let z = -3; z > -19; z -= 4) {
    block(-2.8, 3.75, z, 1.2, 0.25, 1.2, trim);
    block(2.8, 3.75, z, 1.2, 0.25, 1.2, trim);
}
// Rubble generation is disabled so the reference-map corridors stay clear.
// ==================================================
// Torches
// ==================================================
function torch(gx, gz) {
    // Place a wall-mounted 3D torch at the side of the selected walkable tile.
    // This map uses world X = 7 - grid X and world Z = 7 - grid Z.
    const cx = mapWorldX(gx) - MAP_CELL / 2;
    const cz = mapWorldZ(gz) - MAP_CELL / 2;
    const candidates = [
        { dx: 0, dz: -1, wx: 0, wz: 1 },
        { dx: 1, dz: 0, wx: -1, wz: 0 },
        { dx: 0, dz: 1, wx: 0, wz: -1 },
        { dx: -1, dz: 0, wx: 1, wz: 0 }
    ];
    const wall = candidates.find(n => ABYSS_MAP[gz + n.dz] &&
        ABYSS_MAP[gz + n.dz][gx + n.dx] === '#') || candidates[0];
    // World-space direction from the wall toward the corridor.
    const nx = -wall.wx;
    const nz = -wall.wz;
    const wallSurfaceOffset = MAP_CELL / 2 - 0.01;
    const wx = cx + wall.wx * wallSurfaceOffset;
    const wz = cz + wall.wz * wallSurfaceOffset;
    const y = 1.65;
    // Local +Z points away from the wall.
    const group = new THREE.Group();
    // Compact wall torch: 30% of the original model, anchored at the same wall height.
    const torchScale = 0.30;
    group.position.set(wx, y * (1 - torchScale) - 0.30, wz);
    group.rotation.y = Math.atan2(nx, nz);
    group.scale.setScalar(torchScale);
    const iron = new THREE.MeshStandardMaterial({
        color: 0x3b3336, metalness: 0.68, roughness: 0.65,
        emissive: 0x090607
    });
    const blackIron = new THREE.MeshStandardMaterial({
        color: 0x211c21, metalness: 0.7, roughness: 0.75
    });
    const wood = new THREE.MeshStandardMaterial({
        color: 0x513323, roughness: 0.95
    });
    const outerFire = new THREE.MeshBasicMaterial({
        color: 0xff7028, transparent: true, opacity: 0.88,
        depthWrite: false
    });
    const innerFire = new THREE.MeshBasicMaterial({
        color: 0xffd078, transparent: true, opacity: 0.95,
        depthWrite: false
    });
    const add = (geometry, material, x, yy, z) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, yy, z);
        group.add(mesh);
        return mesh;
    };
    // Iron mounting plate, rivets and projecting support arm.
    add(new THREE.BoxGeometry(0.25, 0.39, 0.065), blackIron, 0, y, 0.025);
    for (const yy of [y - 0.13, y + 0.13]) {
        const rivet = add(new THREE.SphereGeometry(0.022, 6, 4), iron, 0, yy, 0.067);
        rivet.scale.z = 0.5;
    }
    const arm = add(new THREE.CylinderGeometry(0.034, 0.044, 0.47, 7), iron, 0, y - 0.02, 0.25);
    arm.rotation.x = Math.PI / 2;
    // A diagonally slanted brace, supporting the wooden torch shaft.
    const brace = add(new THREE.CylinderGeometry(0.024, 0.03, 0.37, 6), blackIron, 0, y - 0.13, 0.19);
    brace.rotation.x = -0.75;
    add(new THREE.CylinderGeometry(0.053, 0.072, 0.52, 7), wood, 0, y + 0.24, 0.41);
    // Metal rim and cup at the top.
    add(new THREE.CylinderGeometry(0.135, 0.082, 0.14, 8), iron, 0, y + 0.53, 0.41);
    add(new THREE.TorusGeometry(0.12, 0.022, 5, 8), blackIron, 0, y + 0.605, 0.41).rotation.x = Math.PI / 2;
    // Volumetric low-poly flame: independent tongues, inner glow and embers.
    // All meshes belong to the scaled torch group; mounting position is unchanged.
    const flameRoot = new THREE.Group();
    flameRoot.position.set(0, y + 0.68, 0.41);
    group.add(flameRoot);
    const flameMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xff4b16, transparent: true, opacity: 0.86, depthWrite: false, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: 0xff9b2a, transparent: true, opacity: 0.94, depthWrite: false, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: 0xffe36a, transparent: true, opacity: 0.96, depthWrite: false, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: 0xfff3b0, transparent: true, opacity: 0.98, depthWrite: false, side: THREE.DoubleSide })
    ];
    const tongues = [];
    const flameSpec = [
        [0, 0, 0, 0.145, 0.49, 0],
        [-0.065, 0.025, 0.01, 0.094, 0.36, 1],
        [0.070, 0.055, -0.03, 0.090, 0.39, 1],
        [0.015, 0.05, 0.06, 0.078, 0.35, 2],
        [-0.015, 0.018, -0.055, 0.060, 0.28, 3],
        [0.035, 0.17, 0.01, 0.052, 0.30, 2]
    ];
    flameSpec.forEach(([x, h, z, radius, height, mat], i) => {
        // A tapered, multi-ring mesh whose vertices ripple from base to tip.
        // Rings are shared around the circumference so the flame is genuinely 3D.
        const sides = 7;
        const rings = 10;
        const vertices = [];
        const indices = [];
        for (let r = 0; r <= rings; r++) {
            const u = r / rings;
            const width = radius * Math.pow(1 - u, 0.78) * (0.90 + 0.10 * Math.sin(u * 9 + i));
            for (let s = 0; s < sides; s++) {
                const a = s * Math.PI * 2 / sides;
                vertices.push(Math.cos(a) * width, u * height, Math.sin(a) * width);
            }
        }
        for (let r = 0; r < rings; r++) {
            for (let s = 0; s < sides; s++) {
                const a = r * sides + s;
                const b = r * sides + (s + 1) % sides;
                indices.push(a, b, a + sides, b, b + sides, a + sides);
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(geometry, flameMaterials[mat]);
        mesh.position.set(x, h, z);
        mesh.rotation.y = i * 1.17;
        flameRoot.add(mesh);
        tongues.push({ mesh, x, z, h, height, phase: i * 1.37, baseVertices: new Float32Array(vertices), rings, sides });
    });
    const embers = [];
    const emberMaterial = new THREE.MeshBasicMaterial({ color: 0xffa342, transparent: true, opacity: 0.9, depthWrite: false });
    for (let i = 0; i < 7; i++) {
        const ember = new THREE.Mesh(new THREE.OctahedronGeometry(0.018 + (i % 3) * 0.005, 0), emberMaterial.clone());
        ember.visible = false;
        flameRoot.add(ember);
        embers.push({ mesh: ember, phase: i / 7, seed: i * 2.399 });
    }
    scene.add(group);
    // Warm light stays close to the wall torch, retaining the dark mood.
    const light = new THREE.PointLight(0xff8a42, 2.6, 6.5, 2);
    light.position.set(wx + nx * (0.45 * torchScale), y + 0.83 * torchScale - 0.30, wz + nz * (0.45 * torchScale));
    light.castShadow = false;
    scene.add(light);
    return { flameRoot, tongues, embers, group, light, base: light.intensity };
}
// Torches are placed on corridor junctions and bends as well as along the route.
// Coordinates are MAP grid cells; each location is a walkable tile.
const TORCH_CELLS = [
    [3, 1], [7, 3], [5, 7], [11, 9], [2, 13], // Existing route markers
    [1, 5], [11, 5], [13, 9], // Upper/middle junctions
    [1, 11], [11, 11], [13, 11], // Lower junctions near the key/exit route
    [5, 1], [3, 3], [5, 5], [7, 5], // Corridor bends
    [3, 9], [5, 11], [9, 11], [9, 13], // Lower corridor bends
    [7, 1], [13, 5], [10, 3] // Wall (7,0) south; (13,6) north; (10,2) south
];
const torches = TORCH_CELLS.map(([gx, gz]) => torch(gx, gz));
// ==================================================
// Relic Pedestal
// ==================================================
block(mapWorldX(13) - MAP_CELL / 2, 0.25, mapWorldZ(13) - MAP_CELL / 2, 0.9, 0.5, 0.9, trim);
// ==================================================
// Relic
// ==================================================
const relic = new THREE.Mesh(new THREE.OctahedronGeometry(0.45), new THREE.MeshStandardMaterial({
    color: 0xb28b4b,
    metalness: 0.75,
    roughness: 0.25,
    emissive: 0x4a2609
}));
relic.position.set(mapWorldX(13) - MAP_CELL / 2, 1.2, mapWorldZ(13) - MAP_CELL / 2);
scene.add(relic);
// ==================================================
// Relic Light
// ==================================================
const relicLight = new THREE.PointLight(0xd59b45, 2, 5);
relicLight.position.set(mapWorldX(13) - MAP_CELL / 2, 1.4, mapWorldZ(13) - MAP_CELL / 2);
scene.add(relicLight);
// Five floating keys: two fixed positions and three randomized reachable cells.
const keyGold = new THREE.MeshStandardMaterial({ color: 0xf4c967, metalness: 0.75, roughness: 0.25, emissive: 0x6a3c0a });
const dungeonKeys = KEY_CELLS.map((cell, index) => {
    const group = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.038, 6, 10), keyGold);
    ring.position.y = 0.19;
    group.add(ring);
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.29, 0.075), keyGold);
    shaft.position.y = -0.025;
    group.add(shaft);
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.06, 0.075), keyGold);
    tooth.position.set(0.055, -0.15, 0);
    group.add(tooth);
    group.position.set(mapWorldX(cell.gx) - MAP_CELL / 2, 0.78, mapWorldZ(cell.gz) - MAP_CELL / 2);
    scene.add(group);
    const light = new THREE.PointLight(0xffc45c, 0.8, 2.4);
    light.position.copy(group.position);
    scene.add(light);
    return { cell, index, group, light, collected: false };
});
function unlockGateWithKey() {
    if (gateUnlocked || collectedKeyCount !== 5)
        return;
    gateUnlocked = true;
    if (sealedGate) {
        scene.remove(sealedGate);
        const i = colliders.indexOf(sealedGate);
        if (i !== -1)
            colliders.splice(i, 1);
        sealedGate.geometry.dispose();
        sealedGate = null;
    }
    ABYSS_MAP[GATE_CELL.gz] = ABYSS_MAP[GATE_CELL.gz].substring(0, GATE_CELL.gx) + '.' + ABYSS_MAP[GATE_CELL.gz].substring(GATE_CELL.gx + 1);
    const wx = mapWorldX(GATE_CELL.gx) - MAP_CELL / 2, wz = mapWorldZ(GATE_CELL.gz) - MAP_CELL / 2;
    const floor = new THREE.Mesh(abyssFloorGeo, abyssFloorSlabs);
    floor.position.set(wx, 0.002, wz);
    floor.receiveShadow = true;
    scene.add(floor);
    const ceiling = new THREE.Mesh(abyssCeilingGeo, abyssCeilingSlabs);
    ceiling.position.set(wx, 2.355, wz);
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    keyQuestRemainingMs = keyQuestDeadline === null ? KEY_QUEST_DURATION_MS : Math.max(0, keyQuestDeadline - performance.now());
    drawRetroMap();
    showGateOpeningMessage();
    playWallMovesSe();
    updateKeyQuestHud();
}
function checkDungeonKeyPickup() {
    if (!gameStarted || won || gateUnlocked)
        return;
    for (const key of dungeonKeys) {
        if (key.collected)
            continue;
        const dx = camera.position.x - key.group.position.x, dz = camera.position.z - key.group.position.z;
        if (dx * dx + dz * dz >= 0.36)
            continue;
        key.collected = true;
        collectedKeyCount++;
        if (key.cell.gx === 3 && key.cell.gz === 1 && keyQuestDeadline === null)
            keyQuestDeadline = performance.now() + KEY_QUEST_DURATION_MS;
        updateKeyQuestHud();
        scene.remove(key.group);
        scene.remove(key.light);
        drawRetroMap();
        if (key.cell.gx === 3 && key.cell.gz === 1) {
            showGateOpeningMessage('FIVE KEYS OF THE SEAL', '10分以内に封印を解くための５つの鍵を手に入れよ');
        }
        if (collectedKeyCount === 5)
            unlockGateWithKey();
    }
}
// ==================================================
// Player Controls
// ==================================================
const keys = {};
let locked = false;
let yaw = 0;
let pitch = 0;
let won = false;
let gameStarted = false;
let configOpen = false;
// RETRO MODE: grid movement and minimap (keeps the existing ABYSS world).
let retroGridDir = 0; // 0 north(+Z), 1 west(-X), 2 south(-Z), 3 east(+X)
let retroShowMap = true;
const RETRO_STEP = MAP_CELL;
const retroMapCanvas = document.createElement('canvas');
retroMapCanvas.width = 160;
retroMapCanvas.height = 200;
retroMapCanvas.id = 'abyss-retro-map';
retroMapCanvas.style.cssText = 'position:fixed;right:14px;top:14px;width:160px;height:200px;z-index:30;display:none;image-rendering:pixelated;border:3px solid #806071;background:#100b18;box-shadow:4px 4px 0 #030205;';
document.body.appendChild(retroMapCanvas);
const retroMapCtx = retroMapCanvas.getContext('2d');
// Mobile RETRO: align the minimap directly under the objective text.
function positionMobileRetroMap() {
    const mobile = window.matchMedia('(pointer: coarse) and (max-width: 900px)').matches;
    if (!mobile) {
        retroMapCanvas.style.removeProperty('--abyss-mobile-map-top');
        retroMapCanvas.style.removeProperty('--abyss-mobile-map-right');
        return;
    }
    const objective = document.querySelector('.objective');
    if (!objective)
        return;
    const rect = objective.getBoundingClientRect();
    retroMapCanvas.style.setProperty('--abyss-mobile-map-top', `${Math.round(rect.bottom + 10)}px`);
    retroMapCanvas.style.setProperty('--abyss-mobile-map-right', `${Math.max(12, Math.round(window.innerWidth - rect.right))}px`);
}
window.addEventListener('resize', positionMobileRetroMap);
window.addEventListener('orientationchange', positionMobileRetroMap);
positionMobileRetroMap();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clock = new THREE.Clock();
// ==================================================
// Overlay Management
// ==================================================
function updateOverlay() {
    locked =
        document.pointerLockElement === renderer.domElement;
    syncMobileGameConfigButton();
    // ゲーム開始前のみタイトル画面を表示
    if (!gameStarted || won) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }
    else {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
}
// ==================================================
// Pointer Lock
// ==================================================
document.addEventListener('pointerlockchange', updateOverlay);
document.addEventListener('pointerlockerror', () => {
    console.error('マウスロックに失敗しました。');
});
// ==================================================
// Keyboard Input
// ==================================================
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (retroModeEnabled && !e.repeat) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code))
            e.preventDefault();
        if (gameStarted && !configOpen && !won) {
            if (e.code === 'KeyW' || e.code === 'ArrowUp')
                retroMove(1);
            else if (e.code === 'KeyS' || e.code === 'ArrowDown')
                retroMove(-1);
            else if (e.code === 'KeyA' || e.code === 'ArrowLeft')
                retroTurn(1);
            else if (e.code === 'KeyD' || e.code === 'ArrowRight')
                retroTurn(-1);
        }
        if (e.code === 'KeyM') {
            retroShowMap = !retroShowMap;
            retroMapCanvas.style.display = gameStarted && !won && retroModeEnabled && retroShowMap ? 'block' : 'none';
            drawRetroMap();
        }
    }
    if ([
        'Space',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
    ].includes(e.code)) {
        e.preventDefault();
    }
    // Cキーで設定画面を開く
    if (e.code === 'KeyC' &&
        !configOpen &&
        gameStarted &&
        !won) {
        openConfig();
    }
    // ESCで設定画面を閉じる
    if (e.code === 'Escape' &&
        configOpen) {
        closeConfigPanel();
    }
});
document.addEventListener('keyup', e => {
    keys[e.code] = false;
});
// MOBILE BUTTON INPUT: support existing buttons or create a fallback D-pad.
let mobileControls = document.getElementById('mobile-controls');
if (!mobileControls) {
    mobileControls = document.createElement('div');
    mobileControls.id = 'mobile-controls';
    mobileControls.innerHTML = `<div class="move-pad">
        <button type="button" class="move-key up" data-key="ArrowUp" aria-label="前進">▲</button>
        <button type="button" class="move-key left" data-key="ArrowLeft" aria-label="左回転">◀</button>
        <button type="button" class="move-key down" data-key="ArrowDown" aria-label="後退">▼</button>
        <button type="button" class="move-key right" data-key="ArrowRight" aria-label="右回転">▶</button>
    </div>`;
    document.body.appendChild(mobileControls);
}
const mobileButtons = mobileControls.querySelectorAll('.move-key');
const mobileKeyAliases = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
    KeyW: 'ArrowUp', KeyS: 'ArrowDown', KeyA: 'ArrowLeft', KeyD: 'ArrowRight' };
mobileButtons.forEach(button => {
    const raw = button.dataset.key || '';
    const key = mobileKeyAliases[raw] || raw;
    function release(event) {
        if (event && event.cancelable)
            event.preventDefault();
        keys[key] = false;
        button.classList.remove('pressed');
    }
    button.addEventListener('pointerdown', event => {
        if (event.cancelable)
            event.preventDefault();
        if (!gameStarted || configOpen || won)
            return;
        button.classList.add('pressed');
        if (retroModeEnabled) {
            // Retro grid controls are one action per tap, not held keys.
            if (key === 'ArrowUp')
                retroMove(1);
            else if (key === 'ArrowDown')
                retroMove(-1);
            else if (key === 'ArrowLeft')
                retroTurn(1);
            else if (key === 'ArrowRight')
                retroTurn(-1);
        }
        else {
            keys[key] = true;
        }
        if (button.setPointerCapture) {
            try {
                button.setPointerCapture(event.pointerId);
            }
            catch (_) { }
        }
    });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', () => release());
});
// ==================================================
// Mouse Look
// ==================================================
document.addEventListener('mousemove', e => {
    if (!locked)
        return;
    yaw -= e.movementX * 0.0022;
    pitch -= e.movementY * 0.0022;
    pitch = Math.max(-1.35, Math.min(1.35, pitch));
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
});
// MOBILE LOOK CONTROL
let lookTouchId = null;
let lastTouchX = 0;
let lastTouchY = 0;
const lookSensitivity = 0.005;
renderer.domElement.addEventListener('touchstart', (event) => {
    if (!gameStarted || configOpen || won)
        return;
    // 移動ボタンを押したときは視点操作しない
    if (event.target.closest('#mobile-controls'))
        return;
    const touch = event.changedTouches[0];
    lookTouchId = touch.identifier;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}, { passive: true });
renderer.domElement.addEventListener('touchmove', (event) => {
    if (lookTouchId === null)
        return;
    if (!gameStarted || configOpen || won)
        return;
    const touch = Array.from(event.changedTouches)
        .find(t => t.identifier === lookTouchId);
    if (!touch)
        return;
    const dx = touch.clientX - lastTouchX;
    const dy = touch.clientY - lastTouchY;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    yaw -= dx * lookSensitivity;
    pitch -= dy * lookSensitivity;
    pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
}, { passive: true });
function endLookTouch(event) {
    if (Array.from(event.changedTouches)
        .some(t => t.identifier === lookTouchId)) {
        lookTouchId = null;
    }
}
renderer.domElement.addEventListener('touchend', endLookTouch);
renderer.domElement.addEventListener('touchcancel', endLookTouch);
// ==================================================
// Start Button
// ==================================================
startButton.addEventListener('click', () => {
    unlockAbyssAudio();
    // VICTORY後は再スタート
    if (won) {
        location.reload();
        return;
    }
    camera.position.set(mapWorldX(1) - MAP_CELL / 2, 1.02, mapWorldZ(1) - MAP_CELL / 2);
    retroGridDir = 3; // 東（+X）
    yaw = Math.PI / 2;
    pitch = 0;
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
    drawRetroMap();
    gameStarted = true;
    syncMobileGameConfigButton();
    updateKeyQuestHud();
    applyRetroMode(); // Reveal the map only after starting, never over the title.
    startDungeonBgm();
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    if (window.matchMedia('(pointer: fine)').matches) {
        renderer.domElement.requestPointerLock();
    }
});
// ==================================================
// Mouse Click to Lock
// ==================================================
renderer.domElement.addEventListener('click', () => {
    if (gameStarted &&
        !won &&
        !configOpen &&
        !locked) {
        if (window.matchMedia('(pointer: fine)').matches)
            renderer.domElement.requestPointerLock();
    }
});
// ==================================================
// Toast Notification
// ==================================================
function toast(msg) {
    const t = document.querySelector('#toast');
    t.textContent = msg;
    t.style.opacity = 1;
    setTimeout(() => {
        t.style.opacity = 0;
    }, 2600);
}
// ==================================================
// Cinematic bilingual gate-opening announcement
// ==================================================
let gateAnnouncementTimer = null;
function showGateOpeningMessage(title = 'A HIDDEN PASSAGE HAS OPENED', message = 'どこかで壁が開いたようだ') {
    let layer = document.getElementById('abyss-gate-announcement');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'abyss-gate-announcement';
        layer.setAttribute('role', 'status');
        layer.setAttribute('aria-live', 'polite');
        layer.innerHTML = `
            <div class="abyss-gate-announcement-content">
                <div class="abyss-gate-announcement-line"></div>
                <h2>A HIDDEN PASSAGE HAS OPENED</h2>
                <p>どこかで壁が開いたようだ</p>
                <div class="abyss-gate-announcement-line"></div>
            </div>`;
        document.body.appendChild(layer);
    }
    layer.querySelector('h2').textContent = title;
    layer.querySelector('p').textContent = message;
    if (gateAnnouncementTimer)
        clearTimeout(gateAnnouncementTimer);
    layer.classList.remove('visible');
    // Force transition restart if the message is triggered again.
    void layer.offsetWidth;
    layer.classList.add('visible');
    gateAnnouncementTimer = setTimeout(() => {
        layer.classList.remove('visible');
        gateAnnouncementTimer = null;
    }, 3600);
}
// ==================================================
// Victory
// ==================================================
function winGame() {
    if (won)
        return;
    won = true;
    gameStarted = false;
    syncMobileGameConfigButton();
    dungeonBgm.pause();
    stopWalkingSe();
    // マウスロックを解除
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
    // CONFIG画面を閉じる
    configOpen = false;
    configOverlay.classList.remove('active');
    // クリア画面を表示
    overlay.innerHTML = `
        <div class="victory-content">
            <h1>RELIC RECOVERED</h1>
            <p>古代の遺物を回収した。</p>
            <button class="config" id="return-title">
                TITLE
            </button>
        </div>
    `;
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    // タイトル画面へ戻る
    document.querySelector('#return-title')
        .addEventListener('click', () => {
        location.reload();
    });
}
// ==================================================
// Configuration UI
// ==================================================
function openConfig() {
    if (won || configOpen)
        return;
    configOpen = true;
    syncMobileGameConfigButton();
    configOverlay.classList.add('active');
    // 設定画面を開いたらマウスロックを解除
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}
// ==================================================
// Close Configuration
// ==================================================
function closeConfigPanel() {
    if (!configOpen)
        return;
    configOpen = false;
    syncMobileGameConfigButton();
    configOverlay.classList.remove('active');
    // ゲーム中ならマウス操作を再開
    if (gameStarted && !won && window.matchMedia('(pointer: fine)').matches) {
        renderer.domElement.requestPointerLock();
    }
}
// ==================================================
// Configuration Buttons
// ==================================================
configButton.addEventListener('click', openConfig);
mobileGameConfigButton.addEventListener('click', openConfig);
configClose.addEventListener('click', closeConfigPanel);
configBack.addEventListener('click', closeConfigPanel);
// Reload game.php to show the in-game title without destroying the login session.
document.querySelector('#back-to-title').addEventListener('click', () => {
    if (!window.confirm('タイトル画面へ戻りますか？ ゲームの進行状況はリセットされます。'))
        return;
    stopWalkingSe();
    stopRetroFootstep();
    dungeonBgm.pause();
    wallMovesSe.pause();
    window.location.reload();
});
// User-initiated SE diagnostic (allowed by mobile autoplay policies).
document.querySelector('#test-walk-se').addEventListener('click', async () => {
    const status = document.querySelector('#se-test-status');
    status.textContent = 'SEを読み込んでいます…';
    try {
        const response = await fetch('asset.php?file=walk', { cache: 'no-store' });
        if (!response.ok)
            throw new Error('音声ファイルの取得に失敗しました (HTTP ' + response.status + ')');
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('audio/'))
            throw new Error('音声以外が返されました: ' + contentType);
        // A separate player ensures test playback is independent of 3D/RETRO movement state.
        const testAudio = new Audio('asset.php?file=walk');
        testAudio.volume = 0.8;
        await testAudio.play();
        status.textContent = 'SE再生開始。音が聞こえれば配信とブラウザ再生は正常です。';
        setTimeout(() => { testAudio.pause(); testAudio.currentTime = 0; }, 1000);
    }
    catch (error) {
        status.textContent = 'SEエラー: ' + error.message + '。SE/Walk.mp3の配置とブラウザの音量をご確認ください。';
        console.warn('ABYSS SE diagnostic:', error);
    }
});
// ==================================================
// Master Volume
// ==================================================
masterVolumeInput.addEventListener('input', () => {
    masterVolume = Number(masterVolumeInput.value) / 100;
    syncMasterVolume();
    masterVolumeValue.textContent =
        masterVolumeInput.value + '%';
});
// ==================================================
// Sound Effects Volume
// ==================================================
sfxVolumeInput.addEventListener('input', () => {
    sfxVolume = Number(sfxVolumeInput.value) / 100;
    syncWalkingSeVolume();
    sfxVolumeValue.textContent =
        sfxVolumeInput.value + '%';
});
// ==================================================
// Brightness
// ==================================================
brightnessInput.addEventListener('input', () => {
    brightnessMultiplier =
        Number(brightnessInput.value) / 100;
    brightnessValue.textContent =
        brightnessInput.value + '%';
    // 画面全体の明るさ
    renderer.toneMappingExposure =
        1.0 * brightnessMultiplier;
    // ダンジョン全体の環境光
    hemisphere.intensity =
        0.48 * brightnessMultiplier;
    ambient.intensity =
        0.18 * brightnessMultiplier;
});
// ==================================================
// Torch Shadows
// ==================================================
function applyShadowSettings() {
    shadowsEnabled = torchShadowsInput.checked;
    // レンダラー全体の影描画
    renderer.shadowMap.enabled = shadowsEnabled;
    // 松明ごとの影生成も切り替える
    torches.forEach((torch) => {
        torch.light.castShadow = false;
    });
}
torchShadowsInput.checked = false;
torchShadowsInput.addEventListener('change', applyShadowSettings);
// 初期設定も反映
applyShadowSettings();
// ==================================================
// High Resolution
// ==================================================
function applyResolutionSettings() {
    // Limit total physical pixels, independent of monitor DPI.
    const physicalScale = Math.min(ABYSS_RENDER_WIDTH / Math.max(1, innerWidth), ABYSS_RENDER_HEIGHT / Math.max(1, innerHeight));
    const actualPixelRatio = retroModeEnabled ? 1 : Math.min(window.devicePixelRatio || 1, highResolutionInput.checked ? 1.0 : 0.75, physicalScale);
    renderer.setPixelRatio(actualPixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.imageRendering = retroModeEnabled ? 'pixelated' : 'auto';
    if (retroModeEnabled) {
        // Keep the canvas full-screen but render internally at a low resolution.
        // NES-like chunky pixels: cap the internal resolution while keeping
        // the original aspect ratio and scaling the result with nearest-neighbor.
        const scale = Math.max(4, window.innerWidth / 320);
        const w = Math.max(160, Math.floor(window.innerWidth / scale));
        const h = Math.max(90, Math.floor(window.innerHeight / scale));
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
    }
    else {
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Expand the horizontal field of view without changing the map geometry.
    // A smaller projection X scale makes corridors appear wider on screen.
    camera.projectionMatrix.elements[0] *= CAMERA_HORIZONTAL_PROJECTION_SCALE;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    resolutionStatus.textContent = `Applied Pixel Ratio: ${renderer.getPixelRatio().toFixed(2)}x`;
    renderer.render(scene, camera);
}
highResolutionInput.addEventListener('change', applyResolutionSettings);
applyResolutionSettings();
// ==================================================
// Bloom
// ==================================================
bloomInput.addEventListener('change', () => {
    bloomEnabled = bloomInput.checked;
});
// ==================================================
// Ambient Effects
// ==================================================
ambientEffectsInput.addEventListener('change', () => {
    ambientEffectsEnabled = ambientEffectsInput.checked;
});
// ==================================================
// Retro Mode
// ==================================================
function applyRetroMode() {
    document.body.classList.toggle('retro-mode', retroModeEnabled);
    // レトロモードではリアルな影を無効化
    renderer.shadowMap.enabled = retroModeEnabled ? false : shadowsEnabled;
    retroMapCanvas.style.display = gameStarted && !won && retroModeEnabled && retroShowMap ? 'block' : 'none';
    if (retroModeEnabled)
        drawRetroMap();
    retroModeInput.checked = retroModeEnabled;
    localStorage.setItem('abyss-retro-mode', String(retroModeEnabled));
    applyResolutionSettings();
}
retroModeInput.addEventListener('change', () => {
    retroModeEnabled = retroModeInput.checked;
    stopWalkingSe();
    stopRetroFootstep();
    applyRetroMode();
});
// 保存済み設定を初期表示に反映
applyRetroMode();
// ==================================================
// Wall Collision
// ==================================================
function canMoveTo(x, z) {
    const radius = 0.3;
    // プレイヤーの体の高さ（カメラは目の高さ）
    const playerBottom = 0;
    const playerTop = 1.8;
    for (const wall of colliders) {
        const box = new THREE.Box3().setFromObject(wall);
        // 高さ方向に重ならない物体は無視
        if (playerTop <= box.min.y ||
            playerBottom >= box.max.y) {
            continue;
        }
        // プレイヤーの半径を考慮して衝突を判定
        const hitX = x + radius > box.min.x &&
            x - radius < box.max.x;
        const hitZ = z + radius > box.min.z &&
            z - radius < box.max.z;
        if (hitX && hitZ) {
            return false;
        }
    }
    return true;
}
// ==================================================
// RETRO MODE grid controls + map
// ==================================================
function retroTurn(amount) {
    // ミニマップの方向順：北(+Z) → 西(-X) → 南(-Z) → 東(+X)
    retroGridDir = (retroGridDir + amount + 4) % 4;
    const yawAngles = [Math.PI, -Math.PI / 2, 0, Math.PI / 2];
    yaw = yawAngles[retroGridDir];
    pitch = 0;
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
    drawRetroMap();
}
function retroMove(step) {
    // mapWorldZ(gz) = 7 - gz のため、ミニマップ上の北はワールド +Z
    // 北 → 西 → 南 → 東 の順でカメラ・移動・ミニマップを統一
    const dirs = [{ x: 0, z: 1 }, { x: 1, z: 0 }, { x: 0, z: -1 }, { x: -1, z: 0 }];
    const d = dirs[retroGridDir];
    const nx = camera.position.x + d.x * RETRO_STEP * step;
    const nz = camera.position.z + d.z * RETRO_STEP * step;
    if (canMoveTo(nx, nz)) {
        camera.position.x = nx;
        camera.position.z = nz;
        playRetroFootstep();
    }
    drawRetroMap();
}
function drawRetroMap() {
    if (!retroMapCtx)
        return;
    const ctx = retroMapCtx, w = retroMapCanvas.width, h = retroMapCanvas.height;
    ctx.fillStyle = '#100b18';
    ctx.fillRect(0, 0, w, h);
    const cell = 9, ox = 12, oy = 12;
    for (let z = 0; z < ABYSS_MAP.length; z++) {
        for (let x = 0; x < ABYSS_MAP[z].length; x++) {
            const t = ABYSS_MAP[z][x];
            ctx.fillStyle = (t === '#' || t === 'K') ? '#594653' : '#17121d';
            ctx.fillRect(ox + x * cell, oy + z * cell, cell - 1, cell - 1);
            if (dungeonKeys.some(key => !key.collected && key.cell.gx === x && key.cell.gz === z)) {
                ctx.fillStyle = '#f2d36b';
                ctx.fillRect(ox + x * cell + 2, oy + z * cell + 2, 5, 5);
            }
            if (t === 'E') {
                ctx.fillStyle = '#55d6c2';
                ctx.fillRect(ox + x * cell + 2, oy + z * cell + 2, 5, 5);
            }
        }
    }
    const gx = Math.max(0, Math.min(14, Math.round(6.5 - camera.position.x / MAP_CELL)));
    const gz = Math.max(0, Math.min(14, Math.round(6.5 - camera.position.z / MAP_CELL)));
    const px = ox + gx * cell + cell / 2, py = oy + gz * cell + cell / 2;
    ctx.fillStyle = '#ff6b72';
    ctx.fillRect(px - 3, py - 3, 6, 6);
    const d = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }][retroGridDir];
    ctx.strokeStyle = '#f4d76b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + d.x * 7, py + d.y * 7);
    ctx.stroke();
    ctx.fillStyle = '#d9b9a0';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('MAP', 7, h - 7);
}
// ==================================================
// Game Update and Rendering
// ==================================================
// Reduce rendering workload on phones and avoid needless 60+ FPS updates.
let lastFrameAt = 0;
let flameNormalFrame = 0;
let lastTorchUpdateAt = 0;
let lastAnimationTime = 0;
function animate(now = 0) {
    requestAnimationFrame(animate);
    if (document.hidden)
        return;
    const targetInterval = 1000 / (gameStarted && !configOpen && !won ? ABYSS_MAX_FPS : ABYSS_IDLE_FPS);
    if (now - lastFrameAt < targetInterval)
        return;
    lastFrameAt = now;
    flameNormalFrame++;
    playerLamp.position.set(camera.position.x, camera.position.y, camera.position.z);
    // 前フレームからの経過時間（秒）
    const delta = Math.min(lastAnimationTime ? (now - lastAnimationTime) / 1000 : 0.025, 0.05);
    lastAnimationTime = now;
    // ゲーム開始後、設定画面が閉じている間だけ移動
    const previousWalkX = camera.position.x;
    const previousWalkZ = camera.position.z;
    if (gameStarted && !configOpen && !won && !retroModeEnabled) {
        const moveSpeed = MAP_CELL; // Preserve roughly one grid cell per second in widened corridors
        const move = new THREE.Vector3();
        // 前後移動
        if (keys['KeyW'] || keys['ArrowUp']) {
            move.z -= 1;
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
            move.z += 1;
        }
        // Aキーで左を向き、Dキーで右を向く
        const turnSpeed = 2.0; // 旋回速度（ラジアン/秒）
        if (keys['KeyA'] || keys['ArrowLeft']) {
            yaw += turnSpeed * delta;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            yaw -= turnSpeed * delta;
        }
        // カメラの向きを更新
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
        // 斜め移動が速くなりすぎないようにする
        if (move.lengthSq() > 0) {
            move.normalize();
            // カメラが実際に向いている方向を取得
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            // 上下方向の視点角度を除き、水平移動にする
            forward.y = 0;
            forward.normalize();
            // カメラの右方向を計算
            const right = new THREE.Vector3(-forward.z, 0, forward.x);
            // 入力に応じて移動方向を決定
            const moveX = right.x * move.x - forward.x * move.z;
            const moveZ = right.z * move.x - forward.z * move.z;
            const stepX = moveX * moveSpeed * delta;
            const stepZ = moveZ * moveSpeed * delta;
            // X方向を先に判定
            const nextX = camera.position.x + stepX;
            if (canMoveTo(nextX, camera.position.z)) {
                camera.position.x = nextX;
            }
            // Z方向を判定
            const nextZ = camera.position.z + stepZ;
            if (canMoveTo(camera.position.x, nextZ)) {
                camera.position.z = nextZ;
            }
        }
    }
    // Never pause RETRO footsteps from the 3D-mode audio updater.
    // Previously this ran with isMoving=false on EVERY RETRO frame, cutting off
    // the sound immediately after playRetroFootstep() started it.
    if (!retroModeEnabled) {
        update3DWalkingSe(gameStarted && !configOpen && !won &&
            (Math.abs(camera.position.x - previousWalkX) > 0.00001 ||
                Math.abs(camera.position.z - previousWalkZ) > 0.00001));
    }
    checkDungeonKeyPickup();
    updateKeyQuestHud();
    {
        const t = performance.now() * 0.001;
        for (const key of dungeonKeys) {
            if (key.collected)
                continue;
            key.group.rotation.y = t * 1.2 + key.index * 0.4;
            key.group.position.y = 0.78 + Math.sin(t * 2.5 + key.index) * 0.065;
        }
    }
    // 松明の揺らぎ
    if (ambientEffectsEnabled && now - lastTorchUpdateAt >= 250) {
        lastTorchUpdateAt = now;
        const time = now * 0.001;
        torches.forEach((torch, i) => {
            const t = time + i * 2.31;
            const flicker = Math.sin(t * 6.3) * 0.48 + Math.sin(t * 10.7 + 1.2) * 0.30 + Math.sin(t * 17.1) * 0.22;
            torch.light.intensity = torch.base * (0.90 + 0.13 * flicker);
            torch.tongues.forEach(({ mesh, x, z, h, height, phase, baseVertices, rings, sides }, j) => {
                const position = mesh.geometry.attributes.position;
                const waveTime = t * (3.8 + j * 0.17) + phase;
                for (let r = 0; r <= rings; r++) {
                    const u = r / rings;
                    // The root stays attached to the cup. Ripples grow towards the tip.
                    const influence = u * u * (3 - 2 * u);
                    const waveX = (Math.sin(waveTime - u * 6.4) * 0.092
                        + Math.sin(waveTime * 1.71 - u * 11.3 + 1.4) * 0.031) * influence;
                    const waveZ = (Math.cos(waveTime * 0.84 - u * 7.1) * 0.075
                        + Math.sin(waveTime * 1.37 - u * 9.5) * 0.027) * influence;
                    const twist = influence * (0.28 * Math.sin(waveTime * 0.9 - u * 5.0));
                    const c = Math.cos(twist), s = Math.sin(twist);
                    const stretch = 1 + 0.09 * Math.sin(waveTime * 1.4 + u * 4.0);
                    for (let k = 0; k < sides; k++) {
                        const idx = (r * sides + k) * 3;
                        const bx = baseVertices[idx], bz = baseVertices[idx + 2];
                        position.array[idx] = bx * c - bz * s + waveX;
                        position.array[idx + 1] = baseVertices[idx + 1] * stretch;
                        position.array[idx + 2] = bx * s + bz * c + waveZ;
                    }
                }
                position.needsUpdate = true;
                // Rebuilding every flame's normals each frame is CPU-heavy.
                // Normals remain fixed; rebuilding them per torch was CPU-intensive.
            });
            torch.embers.forEach(({ mesh, phase, seed }) => {
                const progress = (time * (0.65 + (seed % 3) * 0.1) + phase) % 1;
                mesh.visible = progress > 0.15 && progress < 0.9;
                mesh.position.set(Math.sin(seed * 3.1 + progress * 5.5) * (0.06 + progress * 0.18), 0.19 + progress * 0.70, Math.cos(seed * 2.7 + progress * 4.7) * (0.05 + progress * 0.16));
                mesh.scale.setScalar((1 - progress) * 0.9 + 0.15);
                mesh.material.opacity = Math.max(0, 0.9 * (1 - progress));
            });
        });
        relic.rotation.y += delta * 0.6;
    }
    // 古代の遺物との接触判定
    if (gameStarted && !won) {
        const distance = camera.position.distanceTo(relic.position);
        if (distance < 1.0) {
            winGame();
        }
    }
    // RETRO MODE only: place the render camera one map square behind the player.
    // Example: player at (X=5,Y=1), facing east -> view from (X=4,Y=1).
    // Only the rendered viewpoint changes. Player position, collisions,
    // key pickup and the minimap continue to use the real player position.
    const playerPosition = camera.position.clone();
    if (gameStarted && retroModeEnabled) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() > 0.000001) {
            forward.normalize();
            const targetX = playerPosition.x - forward.x * MAP_CELL;
            const targetZ = playerPosition.z - forward.z * MAP_CELL;
            const targetGridX = Math.round(6.5 - targetX / MAP_CELL);
            const targetGridY = Math.round(6.5 - targetZ / MAP_CELL);
            // Check the actual destination map square, not the player's
            // 0.3-unit collision radius, which shortened the old offset.
            const targetRow = ABYSS_MAP[targetGridY];
            const targetCell = targetRow && targetRow[targetGridX];
            if (targetCell && targetCell !== '#' && targetCell !== 'K') {
                camera.position.set(targetX, playerPosition.y, targetZ);
            }
            else {
                // Keep the camera out of a wall when the rear square is solid.
                const back = forward.clone().negate();
                const step = 0.025;
                for (let distance = step; distance < MAP_CELL; distance += step) {
                    const x = playerPosition.x + back.x * distance;
                    const z = playerPosition.z + back.z * distance;
                    if (!canMoveTo(x, z))
                        break;
                    camera.position.set(x, playerPosition.y, z);
                }
            }
        }
    }
    renderer.render(scene, camera);
    camera.position.copy(playerPosition);
}
window.addEventListener('resize', () => {
    applyResolutionSettings();
    drawRetroMap();
});
animate();
// Reached only when the module completed its setup and buttons are bound.
window.__abyssGameInitialized = true;
window.dispatchEvent(new Event('abyss:ready'));
