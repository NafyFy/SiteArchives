/**
 * PALAIS MENTAL - FRAGMENT-0 [PROJET ÉCHO]
 */

// ============================================
// 1. DONNÉES ET LORE (VARIABLES CONSTANTES)
// ============================================

const loreReadme = `NOTE DE RÉCUPÉRATION - 10/01/2026
---------------------------------------
Source : Disque dur Maxtor (80Go) récupéré dans l'entrepôt Aeterna.
Statut : Données fragmentées. Secteur B condamné depuis 2004.

L'interface Windows XP semble être une reconstruction du système par le disque lui-même. 
Ce n'est pas un OS, c'est une boucle de mémoire.

ATTENTION : Le système semble réagir à votre présence.
Si vous entendez des fréquences anormales, ne débranchez rien.`;

const aeternaSecrets = [
    "NOTE : Directeur Vane a ordonné le scellement des portes à 03:40.",
    "ARCHIVE : 12/05/2004 - Les serveurs consomment plus d'oxygène que d'électricité.",
    "PUB : Aeterna Digital - 'Votre âme, nos serveurs. L'éternité est un disque dur.'",
    "LOG : Le bruit de drone dans les couloirs est un cri compressé à 44.1kHz.",
    "ALERTE : Tentative de reconnexion externe détectée depuis Laval (2026).",
    "FAIT DIVERS : L'ingénieur de maintenance n'était pas seul. Où sont les autres ?",
    "TECH : Le processeur Echo chauffe à 37.2°C. Température humaine nominale.",
    "FINAL : Ce n'est pas un ordinateur. C'est un cercueil numérique."
];

const photoData = [
    { url: "https://picsum.photos/id/10/800/600?grayscale", title: "vacances_2003.jpg", caption: "Il faisait si chaud ce jour-là." },
    { url: "https://picsum.photos/id/101/800/600?grayscale", title: "bureau_maintenance.jpg", caption: "Mon espace de travail au Secteur B." },
    { url: "https://picsum.photos/id/122/800/600?grayscale", title: "entrepôt_entrée.jpg", caption: "L'entrée du complexe Aeterna avant la fermeture." },
    { url: "https://picsum.photos/id/237/800/600?grayscale&blur=5", title: "fragment_07.jpg", caption: "ERREUR : Image corrompue. Subject_07 detected." }
];

const spamMessages = [
    "POURQUOI ES-TU ENCORE LÀ ?",
    "JE TE VOIS.",
    "RENDS-MOI MON VISAGE.",
    "ERREUR SYSTEME : AME NON TROUVÉE.",
    "AETERNA NE TE LAISSERA PAS PARTIR.",
    "03:42",
    "TU AS OUBLIÉ DE RESPIRER.",
    "A L'AIDE !",
    "TON TEMPS EST ÉCOULÉ.",
    "mcvxjz9@!$#%&*()",
    "0642486161"
];

// ============================================
// 2. VARIABLES D'ÉTAT
// ============================================

let glitchLevel = 0;
let audioStarted = false;
let keyBuffer = "";
let clockClicks = 0;
let currentPhotoIndex = 0;

// Variables Démineur
let safeCellsToReveal = 0;
let revealedSafeCells = 0;
let totalMines = 8;

// Cheat Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

// ============================================
// 3. SYSTÈME DE LOGS ET HORLOGE
// ============================================

function addLog(msg) {
    const cont = document.getElementById('terminal-content');
    if (!cont) return;
    const d = document.createElement('div');
    d.className = 'log-entry' + (msg.includes('ALERTE') || msg.includes('ERREUR') ? ' warning' : '');
    d.innerText = "> " + msg;
    cont.appendChild(d);
    cont.scrollTop = cont.scrollHeight;
}

function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock || clock.classList.contains('glitch-clock')) return;
    const now = new Date();
    clock.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function handleGhostClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        if (Math.random() > 0.8) {
            clock.innerText = "03:42";
            clock.classList.add('glitch-clock');
            addLog("ALERTE : Désynchronisation temporelle.");
            setTimeout(() => {
                clock.classList.remove('glitch-clock');
                updateClock();
            }, 4000);
        }
    }, 40000);
}

// ============================================
// 4. GESTION DES FENÊTRES (UI)
// ============================================

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector('.window-header');
    
    (header || elmnt).onmousedown = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        pos3 = e.clientX; pos4 = e.clientY;
        elmnt.style.zIndex = 1000;
        document.onmouseup = () => { document.onmousemove = null; };
        document.onmousemove = (e) => {
            createGhostTrail(elmnt);
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            setTimeout(() => {
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }, Math.random() * 30);
        };
    };
}

function createGhostTrail(original) {
    const ghost = original.cloneNode(true);
    ghost.classList.add('ghost-window');
    ghost.removeAttribute('id');
    document.body.appendChild(ghost);
    setTimeout(() => ghost.remove(), 500);
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'flex';
    win.classList.remove('minimized');
    addLog("Secteur ouvert : " + id);
    if (id === 'win-family') updatePhotoUI();
    if (id === 'win-minesweeper') initMinesweeper();
}

function closeWin(btn) {
    const win = btn.closest('.window');
    if (glitchLevel >= 2 && win.id !== 'win-readme') {
        win.style.top = Math.random() * 70 + "vh";
        win.style.left = Math.random() * 70 + "vw";
        addLog("ERREUR : Impossible de supprimer le fragment.");
    } else {
        win.style.display = 'none';
    }
}

function minimizeWin(btn) {
    const win = btn.closest('.window');
    win.classList.add('minimized');
    if (win.id === 'win-leo') document.getElementById('task-leo').style.display = 'block';
}

function restoreLeo() {
    const win = document.getElementById('win-leo');
    if (win) {
        win.classList.remove('minimized');
        win.style.display = 'flex';
        document.getElementById('task-leo').style.display = 'none';
    }
}

// ============================================
// 5. LOGIQUE DE GLITCH ET D'HORREUR
// ============================================

function triggerGlitch() {
    glitchLevel++;
    document.body.classList.add(`glitch-level-${glitchLevel}`);
    addLog("CRITIQUE : Instabilité niveau " + glitchLevel);
    if (glitchLevel === 1) document.getElementById('icon-project').style.display = 'flex';
    if (glitchLevel === 3) {
        document.body.style.filter = "invert(1) hue-rotate(180deg)";
        setTimeout(() => {
            document.getElementById('bsod-screen').style.display = 'block';
            document.body.style.filter = "none"; 
        }, 3000);
    }
}

function receiveCensoredMessage(text) {
    addLog("ALERTE : Flux de données entrant.");
    
    if (!document.getElementById('win-leo')) {
        const chatWin = document.createElement('div');
        chatWin.className = 'window'; 
        chatWin.id = 'win-leo';
        // Positionnement forcé en haut à gauche
        chatWin.style.top = "150px";   
        chatWin.style.left = "50px";
        chatWin.style.width = "250px";
        chatWin.style.zIndex = "9999";
        
        chatWin.innerHTML = `
            <div class="window-header"><span>MSN Messenger - Léo</span>
            <div class="window-controls"><button onclick="minimizeWin(this)">_</button><button onclick="closeWin(this)">X</button></div></div>
            <div class="window-content" style="background:white; color:black; height:120px; font-size:11px; overflow-y:auto;"></div>`;
        
        document.body.appendChild(chatWin);
        dragElement(chatWin);
    }
    
    openWindow('win-leo');
    
    const chat = document.querySelector('#win-leo .window-content');
    const p = document.createElement('p');
    p.innerHTML = `<b>Léo :</b> <span class="censored">${text}</span>`;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
    
    setTimeout(() => {
        const span = p.querySelector('.censored');
        if (span) span.innerText = "[DONNÉES CENSURÉES PAR LE NOYAU]";
        addLog("ERREUR : Protocole de sécurité 0x07 activé.");
    }, 5000);
}

// ============================================
// 6. APPLICATIONS (PHOTOS, PAINT, SPAM)
// ============================================

function updatePhotoUI() {
    const photo = photoData[currentPhotoIndex];
    const imgElement = document.getElementById('main-photo');
    if (!imgElement) return;
    imgElement.style.opacity = 0;
    setTimeout(() => {
        imgElement.src = photo.url;
        document.getElementById('photo-title').innerText = "Aperçu - " + photo.title;
        document.getElementById('photo-caption').innerText = photo.caption;
        imgElement.style.opacity = 1;
        if (glitchLevel >= 2) imgElement.style.filter = `hue-rotate(${Math.random() * 360}deg) invert(1)`;
    }, 150);
}

function changePhoto(direction) {
    currentPhotoIndex = (currentPhotoIndex + direction + photoData.length) % photoData.length;
    updatePhotoUI();
}

function zoomPhoto() {
    const img = document.getElementById('main-photo');
    if (img) img.style.transform = img.style.transform === "scale(1.5)" ? "scale(1)" : "scale(1.5)";
}

function distortPaint() {
    const img = document.getElementById('paint-img');
    if (!img) return;
    img.style.filter = "invert(1) contrast(5)";
    addLog("ALERTE : Corruption graphique détectée.");
    setTimeout(() => {
        img.src = "https://picsum.photos/id/101/300/200?grayscale";
        img.style.filter = "grayscale(1) contrast(1.2)";
    }, 500);
}

function openSpamAttack() {
    addLog("ALERTE CRITIQUE : Exécution de code malveillant.");
    triggerGlitch();
    
    let count = 0;
    const maxSpam = 15;
    
    const interval = setInterval(() => {
        createSpamWindow();
        count++;
        if (count >= maxSpam) {
            clearInterval(interval);
            setTimeout(() => {
                addLog("SYSTÈME : Menace contenue... pour l'instant.");
            }, 2000);
        }
    }, 300);
}

function createSpamWindow() {
    const spam = document.createElement('div');
    spam.className = 'spam-popup';
    
    const x = Math.random() * (window.innerWidth - 250);
    const y = Math.random() * (window.innerHeight - 200);
    
    spam.style.left = x + 'px';
    spam.style.top = y + 'px';
    
    const msg = spamMessages[Math.floor(Math.random() * spamMessages.length)];
    
    spam.innerHTML = `
        <div class="spam-header">
            <span>ALERTE</span>
            <button onclick="this.closest('.spam-popup').remove()" style="background:none; border:1px solid white; color:white; cursor:pointer;">X</button>
        </div>
        <div class="spam-content">
            <p>${msg}</p>
            <button onclick="this.closest('.spam-popup').remove()" style="margin-top:10px;">OK</button>
        </div>
    `;
    
    document.body.appendChild(spam);
    
    // Son d'erreur synthétisé
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
}

// ============================================
// 7. JEU : DÉMINEUR (LOGIQUE COMPLÈTE)
// ============================================

function initMinesweeper() {
    const gridElement = document.getElementById('mine-grid');
    const status = document.getElementById('mine-status');
    if (!gridElement || !status) return;

    gridElement.innerHTML = '';
    
    // Variables locales pour le suivi de la partie en cours
    let fragmentsFound = 0; 
    status.innerText = "SEGMENTS CORROMPUS : 0/8";
    
    revealedSafeCells = 0;
    safeCellsToReveal = (8 * 8) - totalMines; 

    const size = 8;
    const totalCells = size * size;
    let minePositions = [];
    let gridData = Array(totalCells).fill(0);

    // A. Placement des mines
    while (minePositions.length < totalMines) {
        let pos = Math.floor(Math.random() * totalCells);
        if (!minePositions.includes(pos)) {
            minePositions.push(pos);
            gridData[pos] = "M"; 
        }
    }

    // B. Calcul des chiffres adjacents
    for (let i = 0; i < totalCells; i++) {
        if (gridData[i] === "M") continue;
        let count = 0;
        let row = Math.floor(i / size), col = i % size;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = row + dr, nc = col + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    if (gridData[nr * size + nc] === "M") count++;
                }
            }
        }
        gridData[i] = count;
    }

    // C. Génération de la grille visuelle
    gridData.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        
        // --- CLIC GAUCHE (Révéler) ---
        cell.onclick = function() {
            if (this.classList.contains('revealed') || this.classList.contains('flagged')) return;
            
            this.classList.add('revealed');

            if (value === "M") {
                this.classList.add('bomb'); 
                this.innerText = "!";
                addLog("ERREUR : Fragment instable percuté.");
                triggerGlitch();
            } else {
                this.innerText = value > 0 ? value : "";
                if (value === 1) this.style.color = "blue";
                if (value === 2) this.style.color = "green";
                if (value === 3) this.style.color = "red";
                
                revealedSafeCells++;
                if (revealedSafeCells === safeCellsToReveal) triggerVictory();
            }
        };

        // --- CLIC DROIT (Drapeau = Découverte) ---
        cell.oncontextmenu = function(e) {
            e.preventDefault();
            if (this.classList.contains('revealed')) return;

            this.classList.toggle('flagged');
            const isFlagged = this.classList.contains('flagged');
            
            if (isFlagged) {
                if (value === "M") {
                    fragmentsFound++;
                    status.innerText = `SEGMENTS CORROMPUS : ${fragmentsFound}/8`;
                    
                    const secretMsg = aeternaSecrets[(fragmentsFound - 1) % aeternaSecrets.length];
                    addLog(`FRAGMENT SÉCURISÉ [${fragmentsFound}/8] : ${secretMsg}`);
                 
                    if (fragmentsFound === 8) {
                        triggerVictory();
                    }
                } else {
                    addLog("MARQUAGE : Zone suspecte marquée (Pas de signal).");
                }
            } else {
                if (value === "M") {
                    fragmentsFound--;
                    status.innerText = `SEGMENTS CORROMPUS : ${fragmentsFound}/8`;
                    addLog("ANNULATION : Marquage retiré.");
                }
            }
        };
        gridElement.appendChild(cell);
    });
}

function triggerVictory() {
    addLog("SYNCHRONISATION TERMINÉE : Toutes les données sont sécurisées.");
    document.body.style.filter = "sepia(1) contrast(1.5)";
    setTimeout(() => openWindow('win-confidential'), 1500);
    setTimeout(() => { document.body.style.filter = "none"; }, 5500);
}

// ============================================
// 8. INITIALISATION ET ÉVÉNEMENTS
// ============================================

window.addEventListener('keydown', (e) => {
    keyBuffer += e.key.toUpperCase();
    if (keyBuffer.includes("WALID")) {
        document.body.style.filter = "invert(1) hue-rotate(180deg)";
        addLog("MODE ADMIN ACTIVÉ");
        keyBuffer = "";
    }
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) { triggerGlitch(); konamiPosition = 0; }
    } else { konamiPosition = 0; }
    if (e.key === 'F12') triggerGlitch();
});

window.addEventListener('click', () => {
    if (!audioStarted) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(45, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); audioStarted = true;
        } catch(e) { console.error("Audio blocké."); }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const readme = document.getElementById('readme-text');
    if (readme) readme.innerText = loreReadme;
    document.querySelectorAll('.window').forEach(win => dragElement(win));
    updateClock();
    setInterval(updateClock, 1000);
    handleGhostClock();
    addLog("Système initialisé. Archive MA_04 prête.");
    
    // Déclenchement du chat Léo après 1 minute
    setTimeout(() => receiveCensoredMessage("Est-ce que tu peux m'entendre ? Il fait sombre."), 60000);
});