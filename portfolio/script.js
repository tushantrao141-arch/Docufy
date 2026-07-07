/* ============================================================
   DOCUFY PORTFOLIO — Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Particle Canvas ----
    initParticles();

    // ---- Navbar Scroll Effect ----
    initNavbar();

    // ---- Mobile Menu ----
    initMobileMenu();

    // ---- Hero Terminal Typing Effect ----
    initTypingEffect();

    // ---- Stats Counter Animation ----
    initStatsCounter();

    // ---- CLI Interactive Cards ----
    initCLICards();

    // ---- Copy Button ----
    initCopyButton();

    // ---- Scroll Reveal ----
    initScrollReveal();

    // ---- Smooth Nav Links ----
    initSmoothScroll();
});

// ============================================================
// PARTICLE CANVAS
// ============================================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 160 : 260; // cyan or violet
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles — less on mobile for performance
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 214, 160, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animFrame = requestAnimationFrame(animate);
    }
    animate();
}

// ============================================================
// NAVBAR
// ============================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close menu on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });
}

// ============================================================
// HERO TERMINAL TYPING EFFECT
// ============================================================
function initTypingEffect() {
    const commandEl = document.getElementById('typed-command');
    const outputEl = document.getElementById('terminal-output');
    if (!commandEl || !outputEl) return;

    const sequences = [
        {
            command: 'pip install docufy',
            output: [
                { text: 'Successfully installed docufy-0.2.2', class: 'dimmed' }
            ],
            pause: 1500
        },
        {
            command: 'docufy init',
            output: [
                { text: '⠿ Analyzing Repository Structure...', class: 'dimmed' },
                { text: '✔ Initialized docufy.yaml', class: 'success' }
            ],
            pause: 2000
        },
        {
            command: 'docufy run',
            output: [
                { text: 'Found 12 Files to Process', class: 'dimmed' },
                { text: '⠿ Summarizing (12/12)...', class: 'dimmed' },
                { text: '⠿ Generating README.md', class: 'dimmed' },
                { text: '✔ Generated README.md in 8.3 secs', class: 'success' }
            ],
            pause: 2500
        }
    ];

    let seqIdx = 0;

    async function typeCommand(text) {
        commandEl.textContent = '';
        for (let i = 0; i < text.length; i++) {
            commandEl.textContent += text[i];
            await sleep(40 + Math.random() * 30);
        }
    }

    async function showOutput(lines) {
        for (const line of lines) {
            await sleep(400);
            const div = document.createElement('div');
            div.className = `terminal-line ${line.class || ''}`;
            div.textContent = line.text;
            outputEl.appendChild(div);
        }
    }

    async function runSequence() {
        while (true) {
            const seq = sequences[seqIdx];
            outputEl.innerHTML = '';
            await typeCommand(seq.command);
            await sleep(600);
            await showOutput(seq.output);
            await sleep(seq.pause);
            seqIdx = (seqIdx + 1) % sequences.length;
        }
    }

    runSequence();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// STATS COUNTER
// ============================================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ============================================================
// CLI INTERACTIVE CARDS
// ============================================================
function initCLICards() {
    const cards = document.querySelectorAll('.cli-card');
    const terminalTitle = document.getElementById('cli-terminal-title');
    const terminalBody = document.getElementById('cli-terminal-body');
    if (!cards.length || !terminalBody) return;

    const terminals = {
        init: {
            title: 'docufy init',
            lines: [
                { text: '$ pip install docufy', prompt: true },
                { text: 'Successfully installed docufy-0.2.2', class: 'dimmed' },
                { text: '$ docufy init', prompt: true },
                { text: '⠿ Analyzing Repository Structure', class: 'dimmed' },
                { text: '✔ Initialized docufy.yaml', class: 'success' },
                { text: '' },
                { text: 'Next steps', class: 'dimmed' },
                { text: '  • Review docufy.yaml to customize included files', class: 'dimmed' },
                { text: '  • Run docufy run to generate documentation', class: 'dimmed' }
            ]
        },
        run: {
            title: 'docufy run',
            lines: [
                { text: '$ docufy run', prompt: true },
                { text: 'Found 12 Files to Process', class: 'dimmed' },
                { text: '⠿ Extracting Repository Files', class: 'dimmed' },
                { text: '⠿ Summarizing (1/12)...', class: 'dimmed' },
                { text: '⠿ Summarizing (6/12)...', class: 'dimmed' },
                { text: '⠿ Summarizing (12/12)...', class: 'dimmed' },
                { text: '⠿ Generating README.md', class: 'dimmed' },
                { text: '✔ Generated README.md in 8.3 secs', class: 'success' }
            ]
        },
        update: {
            title: 'docufy update src/utils.py',
            lines: [
                { text: '$ docufy update src/utils.py', prompt: true },
                { text: '⠿ Re-summarizing src/utils.py', class: 'dimmed' },
                { text: '✔ Cache updated for src/utils.py', class: 'success' },
                { text: '⠿ Regenerating README.md', class: 'dimmed' },
                { text: '✔ README.md updated in 2.1 secs', class: 'success' }
            ]
        },
        models: {
            title: 'docufy models',
            lines: [
                { text: '$ docufy models', prompt: true },
                { text: '┌─────────────────────────────────────┐', class: 'dimmed' },
                { text: '│  Available Models (Groq API)        │', class: 'dimmed' },
                { text: '├────────────────┬──────────┬─────────┤', class: 'dimmed' },
                { text: '│ Model          │ Context  │ Output  │', class: 'dimmed' },
                { text: '├────────────────┼──────────┼─────────┤', class: 'dimmed' },
                { text: '│ llama-3.3-70b  │ 128k     │ 32k     │', class: 'dimmed' },
                { text: '│ qwen3-32b      │ 128k     │ 32k     │', class: 'dimmed' },
                { text: '└────────────────┴──────────┴─────────┘', class: 'dimmed' }
            ]
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const key = card.dataset.cli;
            const data = terminals[key];
            if (!data) return;

            if (terminalTitle) terminalTitle.textContent = data.title;

            terminalBody.innerHTML = '';
            data.lines.forEach(line => {
                const div = document.createElement('div');
                div.className = `terminal-line ${line.class || ''}`;
                if (line.prompt) {
                    const prompt = document.createElement('span');
                    prompt.className = 'terminal-prompt';
                    prompt.textContent = '$';
                    div.appendChild(prompt);
                    div.appendChild(document.createTextNode(' ' + line.text.replace('$ ', '')));
                } else {
                    div.textContent = line.text;
                }
                terminalBody.appendChild(div);
            });
        });
    });
}

// ============================================================
// COPY BUTTON
// ============================================================
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    const installCmd = document.getElementById('install-cmd');
    if (!copyBtn || !installCmd) return;

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(installCmd.textContent);
            copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
            copyBtn.style.color = 'var(--accent-cyan)';
            setTimeout(() => {
                copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
                copyBtn.style.color = '';
            }, 2000);
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = installCmd.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
    // Add reveal class to animatable elements
    const revealElements = document.querySelectorAll(
        '.feature-card, .timeline-item, .cli-card, .cli-preview, .arch-card, .ace-table-wrap, .cta-card, .stat-item'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.querySelectorAll('.reveal'));
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 80}ms`;
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });
}
