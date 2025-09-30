const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let W, H, maxConfettis;
let confettis = [];
let animationActive = false;

function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  maxConfettis = Math.floor(W * 0.1);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const colors = [
  "#fce18a",
  "#ff726d",
  "#f4306d",
  "#b48def",
  "#c2185b",
  "#90A4AE",
]; // Colores de confeti

// Objeto Confetti (simplificado)
function Confetti(x, y, color) {
  this.x = x;
  this.y = y;
  this.r = Math.random() * 5 + 1;
  this.d = Math.random() * maxConfettis; // Densidad/Desviación
  this.color = color;
  this.tilt = Math.random() * 10 - 5; // Inclinación
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = this.r * 2;
    ctx.strokeStyle = this.color;
    // Dibuja una línea inclinada
    ctx.moveTo(this.x + this.tilt, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.r * 2);
    ctx.stroke();
  };
}

// Lógica de actualización y movimiento del confeti
function updateConfetti(confetti) {
  confetti.tiltAngle += confetti.tiltAngleIncremental;
  confetti.y += Math.sin(confetti.d) * 0.5 + 2; // Cae y se mueve levemente
  confetti.tilt = Math.sin(confetti.tiltAngle) * 10;

  // Si sale por la parte inferior, lo reubicamos arriba
  if (confetti.y > H) {
    confetti.y = -10;
    confetti.x = Math.random() * W;
  }
}

function addConfetti() {
  confettis.push(
    new Confetti(
      Math.random() * W,
      -Math.random() * H * 2, // Posición de inicio muy alta
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
}

function draw() {
  if (!animationActive) {
    // Si la animación no está activa, sigue llamando a draw para revisar si debe empezar
    requestAnimationFrame(draw);
    return;
  }

  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < confettis.length; i++) {
    confettis[i].draw();
    updateConfetti(confettis[i]);
  }

  // Mantenemos un flujo constante después de la explosión inicial
  if (confettis.length < maxConfettis * 2) {
    addConfetti();
  }

  requestAnimationFrame(draw);
}

// ---------------------------------
// INTERACCIÓN: INICIO DE LA FIESTA AL ENTRAR
// ---------------------------------
const tarjeta = document.querySelector(".tarjeta-contenedor");

tarjeta.addEventListener("mouseenter", () => {
  if (!animationActive) {
    // Creamos una "explosión" inicial
    for (let i = 0; i < maxConfettis * 5; i++) {
      addConfetti();
    }
    animationActive = true;
    // La función draw() ya está corriendo en bucle esperando este cambio
  }
});

// Inicializa el bucle de la animación (esperando la acción del ratón)
requestAnimationFrame(draw);
