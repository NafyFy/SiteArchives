/**
 * PALAIS MENTAL - FRAGMENT-0 [PROJET ÉCHO]
 */

// ============================================
// 1. DONNÉES ET LORE
// ============================================

const loreReadme = `NOTE DE RÉCUPÉRATION - 10/01/2026
---------------------------------------
Source : Disque dur Maxtor (80Go) récupéré dans l'entrepôt Aeterna.
Statut : Données fragmentées. Secteur B condamné depuis 2004.

L'interface Windows XP semble être une reconstruction du système par le disque lui-même. 
Ce n'est pas un OS, c'est une boucle de mémoire.

ATTENTION : Le système semble réagir à votre présence.
Si vous entendez des fréquences anormales, ne débranchez rien.`;

const messagesGlitch = [
    "Ceci n'est pas un souvenir.", 
    "ERREUR 404", 
    "Regarde derrière toi.", 
    "L'archive a faim.", 
    "Subject_07_Detected"
];

const journalEntries = [
    "12/03/2004 : J'ai trouvé une porte dans le serveur.",
    "15/03/2004 : Le site me répond. Avec mes propres souvenirs.",
    "AIDEZ-MOI. ILS NE VEULENT PAS QUE JE SORTE."
];

const photoData = [
    { url: "https://picsum.photos/id/10/800/600?grayscale", title: "vacances_2003.jpg", caption: "Il faisait si chaud ce jour-là." },
    { url: "https://picsum.photos/id/101/800/600?grayscale", title: "bureau_maintenance.jpg", caption: "Mon espace de travail au Secteur B." },
    { url: "https://picsum.photos/id/122/800/600?grayscale", title: "entrepôt_entrée.jpg", caption: "L'entrée du complexe Aeterna avant la fermeture." },
    { url: "https://picsum.photos/id/237/800/600?grayscale&blur=5", title: "fragment_07.jpg", caption: "ERREUR : Image corrompue. Subject_07 detected." }
];

// Variables globales
let glitchLevel = 0;
let audioStarted = false;
let keyBuffer = "";
let clockClicks = 0;
let currentPhotoIndex = 0;

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

// ============================================
// 2. SYSTÈME DE LOGS ET HORLOGE
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
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.innerText = `${hours}:${minutes}`;
}

// ============================================
// 3. L'HORLOGE HANTÉE (Indice 03:42)
// ============================================

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
// 4. GESTION DES FENÊTRES
// ============================================

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector('.window-header');
    
    (header || elmnt).onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.zIndex = 1000;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        createGhostTrail(elmnt);
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Effet saccadé (Lag processeur 2004)
        setTimeout(() => {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }, Math.random() * 30);
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function createGhostTrail(original) {
    const ghost = original.cloneNode(true);
    ghost.classList.add('ghost-window');
    ghost.removeAttribute('id');
    ghost.style.left = original.style.left;
    ghost.style.top = original.style.top;
    document.body.appendChild(ghost);
    
    setTimeout(() => ghost.remove(), 500);
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.display = 'flex';
    win.classList.remove('minimized');
    addLog("Secteur ouvert : " + id);
    
    // Cas spécial pour les photos
    if (id === 'win-family') {
        updatePhotoUI();
    }
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
    
    if (win.id === 'win-leo') {
        document.getElementById('task-leo').style.display = 'block';
    }
}

function restoreLeo() {
    const win = document.getElementById('win-leo');
    if (!win) return;
    
    win.classList.remove('minimized');
    win.style.display = 'flex';
    document.getElementById('task-leo').style.display = 'none';
}

// ============================================
// 5. PROGRESSION DU GLITCH ET BSOD
// ============================================

function triggerGlitch() {
    glitchLevel++;
    document.body.classList.add(`glitch-level-${glitchLevel}`);
    addLog("CRITIQUE : Instabilité niveau " + glitchLevel);
    
    if (glitchLevel === 1) {
        document.getElementById('icon-project').style.display = 'flex';
    }
    
    if (glitchLevel === 3) {
        setTimeout(() => {
            document.getElementById('bsod-screen').style.display = 'block';
        }, 3000);
    }
}

// ============================================
// 6. MESSAGES CENSURÉS DE LÉO
// ============================================

function receiveCensoredMessage(text) {
    addLog("ALERTE : Flux de données entrant.");
    openWindow('win-leo');
    
    const chat = document.querySelector('#win-leo .window-content');
    const p = document.createElement('p');
    p.innerHTML = `<b>Léo :</b> <span class="censored">${text}</span>`;
    chat.appendChild(p);
    
    setTimeout(() => {
        const span = p.querySelector('.censored');
        if (span) {
            span.innerText = "[DONNÉES CENSURÉES PAR LE NOYAU]";
        }
        addLog("ERREUR : Protocole de sécurité 0x07 activé.");
    }, 2500);
}

// ============================================
// 7. GESTION DES PHOTOS
// ============================================

function updatePhotoUI() {
    const photo = photoData[currentPhotoIndex];
    const imgElement = document.getElementById('main-photo');
    
    if (!imgElement) return;
    
    // Effet de fondu au changement
    imgElement.style.opacity = 0;
    
    setTimeout(() => {
        imgElement.src = photo.url;
        document.getElementById('photo-title').innerText = "Aperçu - " + photo.title;
        document.getElementById('photo-caption').innerText = photo.caption;
        imgElement.style.opacity = 1;
        
        // Si glitchLevel est haut, on déforme l'image
        if (glitchLevel >= 2) {
            imgElement.style.filter = `hue-rotate(${Math.random() * 360}deg) invert(1)`;
        }
    }, 150);
}

function changePhoto(direction) {
    currentPhotoIndex += direction;
    
    if (currentPhotoIndex >= photoData.length) {
        currentPhotoIndex = 0;
    }
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = photoData.length - 1;
    }
    
    updatePhotoUI();
    addLog("Accès fichier : " + photoData[currentPhotoIndex].title);
}

function zoomPhoto() {
    const img = document.getElementById('main-photo');
    if (!img) return;
    
    img.style.transform = img.style.transform === "scale(1.5)" ? "scale(1)" : "scale(1.5)";
    addLog("Zoom numérique... Analyse des pixels en cours.");
}

// ============================================
// 8. EASTER EGGS - PAINT
// ============================================

function distortPaint() {
    const img = document.getElementById('paint-img');
    if (!img) return;
    
    img.style.filter = "invert(1) contrast(5)";
    addLog("ALERTE : Corruption graphique détectée dans le fichier BMP.");
    
    setTimeout(() => {
        img.src = "https://picsum.photos/id/101/300/200?grayscale";
        img.style.filter = "grayscale(1) contrast(1.2)";
    }, 500);
}

// ============================================
// 9. EASTER EGGS ET SECRETS
// ============================================

window.addEventListener('keydown', (e) => {
    // 1. Mot clé WALID
    keyBuffer += e.key.toUpperCase();
    if (keyBuffer.includes("WALID")) {
        document.body.style.filter = "invert(1) hue-rotate(180deg)";
        addLog("MODE ADMIN : RÉALITÉ INVERSÉE");
        keyBuffer = "";
    }
    
    // 2. Konami Code
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            addLog("TRICHE DÉTECTÉE.");
            document.getElementById('bsod-screen').style.display = 'block';
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
    
    // 3. F12
    if (e.key === 'F12') {
        addLog("FOUINEUR DÉTECTÉ.");
        triggerGlitch();
    }
});

// Secret horloge (5 clics)
document.getElementById('clock')?.addEventListener('click', () => {
    clockClicks++;
    if (clockClicks === 5) {
        openWindow('win-student-card');
        clockClicks = 0;
    }
});

// ============================================
// 10. CLIPPY MALÉFIQUE
// ============================================

setTimeout(() => {
    const clippy = document.getElementById('evil-clippy');
    if (clippy) {
        clippy.style.display = 'block';
        clippy.onclick = () => {
            document.getElementById('clippy-speech').style.display = 'block';
            triggerGlitch();
            setTimeout(() => {
                clippy.style.display = 'none';
            }, 4000);
        };
    }
}, 150000); // 2.5 minutes

// ============================================
// 11. AUDIO DRONE
// ============================================

window.addEventListener('click', () => {
    if (!audioStarted) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine'; // 'brown' n'existe pas
            osc.frequency.setValueAtTime(45, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            
            audioStarted = true;
        } catch (error) {
            console.error("Erreur audio:", error);
        }
    }
});

// ============================================
// 12. CRÉATION DYNAMIQUE DE LA FENÊTRE MSN
// ============================================

setTimeout(() => {
    if (!document.getElementById('win-leo')) {
        const chatWin = document.createElement('div');
        chatWin.className = 'window';
        chatWin.id = 'win-leo';
        chatWin.style.bottom = "40px";
        chatWin.style.right = "20px";
        chatWin.style.width = "250px";
        chatWin.style.display = 'none';
        
        chatWin.innerHTML = `
            <div class="window-header">
                <span>MSN Messenger - Léo</span>
                <div class="window-controls">
                    <button class="minimize-btn" onclick="minimizeWin(this)">_</button>
                    <button class="close-btn" onclick="closeWin(this)">X</button>
                </div>
            </div>
            <div class="window-content" style="background:white; color:black; height:120px; font-size:11px;"></div>
        `;
        
        document.body.appendChild(chatWin);
        dragElement(chatWin);
    }
    
    receiveCensoredMessage("Est-ce que tu peux m'entendre ? Il fait sombre dans l'entrepôt.");
}, 60000); // 1 minute

// ============================================
// 13. INITIALISATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Charger le texte README
    const readme = document.getElementById('readme-text');
    if (readme) {
        readme.innerText = loreReadme;
    }
    
    // Rendre toutes les fenêtres draggables
    document.querySelectorAll('.window').forEach(win => {
        dragElement(win);
    });
    
    // Démarrer l'horloge
    updateClock();
    setInterval(updateClock, 1000);
    handleGhostClock();
    
    // Log de démarrage
    addLog("Système initialisé. Archive MA_04 prête.");
});