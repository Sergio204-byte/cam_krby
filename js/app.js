// --- VARIABLES GLOBALES ---
// Necesitamos guardar el texto morse original y los elementos fuera de las funciones
let originalMorseText = "";
let morseContainer;
let decodeBtn;

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Inicializar variables y guardar el morse original
    morseContainer = document.querySelector('.morse-text');
    decodeBtn = document.querySelector('.btn_decodificar');
    if (morseContainer) {
        // Guardamos el HTML exacto del morse para restaurarlo después
        originalMorseText = morseContainer.innerHTML;
    }

    // 2. Registrar el plugin de GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- ANIMACIÓN DE ENTRADA (Hero) ---
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".avatar-container", { duration: 1.2, y: 50, opacity: 0, ease: "back.out(1.7)" })
      .from(".main-title", { duration: 1, y: 30, opacity: 0, scale: 0.9 }, "-=0.8")
      .from(".hero-text p", { duration: 0.8, y: 20, opacity: 0, stagger: 0.2 }, "-=0.5");

    // --- ANIMACIÓN AL HACER SCROLL ---
    const sections = document.querySelectorAll('.section:not(:first-of-type)');
    sections.forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
});

// --- FUNCIÓN 1: DECODIFICAR (Accionada por el botón) ---
function decodificarMensaje() {
    // Animación de salida del morse
    gsap.to(morseContainer, { duration: 0.3, opacity: 0, onComplete: () => {
        // 1. Cambiar texto al traducido
        morseContainer.innerHTML = `
            "Desde el momento en que te vi<br>
            me sentí tan distante a ti<br>
            me decidí preguntar cómo te llamas<br>
            y ahora no puedo vivir<br>
            sin esos ojos tan perfectos, sabes que no puedo..."
        `;
        
        // 2. Aplicar estilos de "texto legible"
        morseContainer.style.fontFamily = "'Inter', sans-serif";
        morseContainer.style.letterSpacing = "normal";
        morseContainer.style.lineHeight = "1.6";
        morseContainer.style.background = "rgba(56, 189, 248, 0.1)";
        morseContainer.style.borderLeft = "3px solid var(--success)"; // Este estilo activa el cursor pointer en CSS
        
        // 3. Animación de entrada del nuevo texto
        gsap.to(morseContainer, { duration: 0.5, opacity: 1 });
        
        // 4. Ocultar el botón
        gsap.to(decodeBtn, { duration: 0.3, scale: 0, opacity: 0, onComplete: () => {
             decodeBtn.style.display = "none";
        }});

        // 5. ¡NUEVO! Agregar el evento para revertir al dar clic en el texto
        // Usamos { once: true } para que el evento se elimine solo después del primer clic
        morseContainer.addEventListener('click', revertirMensaje, { once: true });
    }});
}

// --- FUNCIÓN 2: REVERTIR (Accionada por clic en el texto traducido) ---
function revertirMensaje() {
    // Animación de salida del texto traducido
    gsap.to(morseContainer, { duration: 0.3, opacity: 0, onComplete: () => {
        // 1. Restaurar el morse original
        morseContainer.innerHTML = originalMorseText;

        // 2. Quitar los estilos en línea para volver a los del CSS original
        // Al ponerlos en "", el navegador vuelve a usar los estilos de la clase .morse-text
        morseContainer.style.fontFamily = "";
        morseContainer.style.letterSpacing = "";
        morseContainer.style.lineHeight = "";
        morseContainer.style.background = "";
        morseContainer.style.borderLeft = "";

        // 3. Animación de entrada del morse
        gsap.to(morseContainer, { duration: 0.5, opacity: 1 });

        // 4. Volver a mostrar el botón
        decodeBtn.style.display = "inline-block"; // Aseguramos que sea visible antes de animar
        gsap.to(decodeBtn, { duration: 0.3, scale: 1, opacity: 1 });
    }});
}
// --- MINI JUEGO BASKETBALL ---
document.addEventListener("DOMContentLoaded", () => {
    const ball = document.getElementById('ball');
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    
    // Variables de física
    let isDragging = false;
    let startX, startY, endX, endY;
    let ballX = gameContainer.offsetWidth / 2 - 25; // Centro inicial
    let ballY = gameContainer.offsetHeight - 100;   // Abajo inicial
    let velocityX = 0;
    let velocityY = 0;
    let gravity = 0.6;
    let isFlying = false;
    let score = 0;
    let rotation = 0;

    // Posiciones iniciales
    const resetBall = () => {
        isFlying = false;
        velocityX = 0;
        velocityY = 0;
        ballX = gameContainer.offsetWidth / 2 - 25;
        ballY = gameContainer.offsetHeight - 80;
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
        ball.style.transform = `rotate(0deg)`;
        ball.style.opacity = 1;
    };

    resetBall();

    // Eventos Mouse / Touch
    const startDrag = (e) => {
        if (isFlying) return;
        isDragging = true;
        // Obtener coordenadas (soporta mouse y touch)
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        ball.style.transition = 'none'; // Quitar transición para respuesta instantánea
    };

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        endX = e.clientX || e.changedTouches[0].clientX;
        endY = e.clientY || e.changedTouches[0].clientY;

        // Calcular fuerza del lanzamiento
        let deltaX = startX - endX;
        let deltaY = startY - endY;

        // Solo lanzar si el deslizamiento fue hacia arriba (positivo en Y)
        if (deltaY > 0) {
            isFlying = true;
            velocityX = -deltaX * 0.15; // Ajustar sensibilidad horizontal
            velocityY = -deltaY * 0.15; // Ajustar fuerza vertical
            
            // Limitar velocidad máxima
            if(velocityY < -25) velocityY = -25; 
            
            requestAnimationFrame(gameLoop);
        }
    };

    ball.addEventListener('mousedown', startDrag);
    ball.addEventListener('touchstart', startDrag);

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Bucle del juego (Física)
    function gameLoop() {
        if (!isFlying) return;

        // Aplicar gravedad
        velocityY += gravity;
        ballX += velocityX;
        ballY += velocityY;

        // Rotación visual
        rotation += velocityX * 2;
        ball.style.transform = `rotate(${rotation}deg)`;

        // Colisión con paredes (Izquierda/Derecha)
        if (ballX <= 0 || ballX >= gameContainer.offsetWidth - 50) {
            velocityX *= -0.6; // Rebote y pérdida de energía
            ballX = Math.max(0, Math.min(ballX, gameContainer.offsetWidth - 50));
        }

        // Colisión con el suelo (Reiniciar)
        if (ballY >= gameContainer.offsetHeight - 50) {
            // Si cae al suelo, esperamos un poquito y reseteamos
            if(Math.abs(velocityY) < 2) {
                setTimeout(resetBall, 500);
                return; 
            }
            velocityY *= -0.5; // Pequeño rebote en el suelo
            ballY = gameContainer.offsetHeight - 50;
        }

        // --- LÓGICA DE ENCESTAR ---
        // Coordenadas aproximadas del aro (ajustar según tu CSS)
        // El aro está centrado en top: 80px.
        const hoopY = 110; 
        const hoopCenter = gameContainer.offsetWidth / 2;
        
        // Detectar si la pelota pasa por el aro (de arriba a abajo)
        // Distancia horizontal al centro
        let distToHoop = Math.abs((ballX + 25) - hoopCenter);

        // Si la pelota está a la altura del aro y cayendo (velocityY > 0)
        if (ballY > hoopY && ballY < hoopY + 20 && velocityY > 0) {
            if (distToHoop < 30) {
                // ¡CANASTA!
                score++;
                scoreElement.innerText = score;
                scoreElement.classList.add('score-anim');
                setTimeout(() => scoreElement.classList.remove('score-anim'), 300);
                
                // Efecto visual: pelota pasa "detrás" del aro visualmente si fuera 3D,
                // aquí simplemente reseteamos rápido tras pasar
            }
        }

        // Actualizar posición DOM
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';

        requestAnimationFrame(gameLoop);
    }
});