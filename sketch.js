let sistema;
let globalX = 0; let globalY = 0;
let gifs = [];

function preload() {
  gifs[0] = loadImage('assets/memoria.gif');
  gifs[1] = loadImage('assets/herencia.gif');
  gifs[2] = loadImage('assets/caducidad.gif');
  gifs[3] = loadImage('assets/identidad.gif');
  gifs[4] = loadImage('assets/empatia.gif');
  gifs[5] = loadImage('assets/colaboracion.gif');
  gifs[6] = loadImage('assets/incertidumbre.gif');
  gifs[7] = loadImage('assets/ansiedad.gif');
  gifs[8] = loadImage('assets/expectativa.gif');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  noSmooth();
  sistema = new SistemaPrincipal();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#F4F0EB"); 
  sistema.update();
  sistema.display();
}

// --- EVENTOS TÁCTILES Y DE MOUSE ---
function actualizarCoordenadasGlobales() {
  if (touches.length > 0) { globalX = touches[0].x; globalY = touches[0].y; } 
  else { globalX = mouseX; globalY = mouseY; }
}
function touchStarted() {
  actualizarCoordenadasGlobales();
  if (touches.length >= 3) { sistema.cambiarEstado(0); return false; }
  sistema.presionar(globalX, globalY); return false;
}
function touchMoved() { actualizarCoordenadasGlobales(); sistema.arrastrar(globalX, globalY); return false; }
function touchEnded() { sistema.soltar(globalX, globalY); return false; }

function mouseWheel(event) {
  if (sistema && sistema.estadoActual === 9) {
    sistema.cExpectativa.manejarRueda(mouseX, mouseY, event.delta);
  }
}

// DICCIONARIO DE COLORES (MATRIZ DE ACTORES)
// 0: Negro (Actor A), 1: Azul (Actor B), 2: Rojo (Actor C)
const COLORES = ["#1A1A1A", "#164E96", "#D42A2A"]; 
const RGB_COLORES = [ [26, 26, 26], [22, 78, 150], [212, 42, 42] ];

// --- ARQUITECTURA ---
class SistemaPrincipal {
  constructor() {
    this.estadoActual = 0; 
    this.cMemoria = new ConceptoMemoria();
    this.cHerencia = new ConceptoHerencia();
    this.cCaducidad = new ConceptoCaducidad();
    this.cIdentidad = new ConceptoIdentidad();
    this.cEmpatia = new ConceptoEmpatia();
    this.cColaboracion = new ConceptoColaboracion();
    this.cIncertidumbre = new ConceptoIncertidumbre();
    this.cAnsiedad = new ConceptoAnsiedad();
    this.cExpectativa = new ConceptoExpectativa();
  }
  cambiarEstado(n) {
    this.estadoActual = n;
    if (n === 1) this.cMemoria = new ConceptoMemoria();
    if (n === 2) this.cHerencia = new ConceptoHerencia();
    if (n === 3) this.cCaducidad = new ConceptoCaducidad();
    if (n === 4) this.cIdentidad = new ConceptoIdentidad();
    if (n === 5) this.cEmpatia = new ConceptoEmpatia();
    if (n === 6) this.cColaboracion = new ConceptoColaboracion();
    if (n === 7) this.cIncertidumbre = new ConceptoIncertidumbre();
    if (n === 8) this.cAnsiedad = new ConceptoAnsiedad();
    if (n === 9) this.cExpectativa = new ConceptoExpectativa();
  }
  update() { 
    if (this.estadoActual === 1) this.cMemoria.update();
    else if (this.estadoActual === 2) this.cHerencia.update();
    else if (this.estadoActual === 3) this.cCaducidad.update();
    else if (this.estadoActual === 4) this.cIdentidad.update();
    else if (this.estadoActual === 5) this.cEmpatia.update();
    else if (this.estadoActual === 6) this.cColaboracion.update();
    else if (this.estadoActual === 7) this.cIncertidumbre.update();
    else if (this.estadoActual === 8) this.cAnsiedad.update();
    else if (this.estadoActual === 9) this.cExpectativa.update();
  }
  display() { 
    if (this.estadoActual === 0) this.dibujarGrilla();
    else if (this.estadoActual === 1) this.cMemoria.display();
    else if (this.estadoActual === 2) this.cHerencia.display();
    else if (this.estadoActual === 3) this.cCaducidad.display();
    else if (this.estadoActual === 4) this.cIdentidad.display();
    else if (this.estadoActual === 5) this.cEmpatia.display();
    else if (this.estadoActual === 6) this.cColaboracion.display();
    else if (this.estadoActual === 7) this.cIncertidumbre.display();
    else if (this.estadoActual === 8) this.cAnsiedad.display();
    else if (this.estadoActual === 9) this.cExpectativa.display();

    if (this.estadoActual !== 0) {
      this.dibujarBotonVolver();
    }
  }

  dibujarBotonVolver() {
    push();
    stroke("#1A1A1A"); 
    strokeWeight(2); 
    noFill(); 
    drawingContext.setLineDash([]); 
    
    let cx = 40;
    let cy = 40;
    let size = 12; 
    
    beginShape();
    vertex(cx + size, cy - size);
    vertex(cx - size / 2, cy); 
    vertex(cx + size, cy + size);
    endShape();
    pop();
  }

  dibujarGrilla() {
    stroke("#1A1A1A"); 
    strokeWeight(1.5); 
    drawingContext.setLineDash([]);
    
    let tx = width / 3; 
    let ty = height / 3;
    
    line(tx, 0, tx, height); 
    line(tx * 2, 0, tx * 2, height);
    line(0, ty, width, ty); 
    line(0, ty * 2, width, ty * 2);

    for (let i = 0; i < 9; i++) {
      let col = i % 3; 
      let row = floor(i / 3);
      let x = col * tx;
      let y = row * ty;
      
      let margen = 20;
      let w = tx - (margen * 2);
      let h = ty - (margen * 2);
      
      if (gifs[i]) {
        imageMode(CENTER);
        image(gifs[i], x + tx / 2, y + ty / 2, w, h);
      }
    }
  }

  presionar(x, y) {
    if (this.estadoActual === 0) {
      let col = floor(x / (width / 3)); let row = floor(y / (height / 3));
      let cuadrante = (row * 3) + col + 1;
      if ([1,2,3,4,5,6,7,8,9].includes(cuadrante)) this.cambiarEstado(cuadrante);
      return; 
    } 
    
    if (dist(x, y, 40, 40) < 50) {
      this.cambiarEstado(0);
      return; 
    }

    if (this.estadoActual === 1) this.cMemoria.presionar(x, y);
    else if (this.estadoActual === 2) this.cHerencia.presionar(x, y);
    else if (this.estadoActual === 3) this.cCaducidad.presionar(x, y);
    else if (this.estadoActual === 4) this.cIdentidad.presionar(x, y);
    else if (this.estadoActual === 5) this.cEmpatia.presionar(x, y);
    else if (this.estadoActual === 6) this.cColaboracion.presionar(x, y);
    else if (this.estadoActual === 7) this.cIncertidumbre.presionar(x, y);
    else if (this.estadoActual === 8) this.cAnsiedad.presionar(x, y);
    else if (this.estadoActual === 9) this.cExpectativa.presionar(x, y);
  }
  
  arrastrar(x, y) {
    if (this.estadoActual === 1) this.cMemoria.arrastrar(x, y);
    else if (this.estadoActual === 2) this.cHerencia.arrastrar(x, y);
    else if (this.estadoActual === 3) this.cCaducidad.arrastrar(x, y);
    else if (this.estadoActual === 4) this.cIdentidad.arrastrar(x, y);
    else if (this.estadoActual === 5) this.cEmpatia.arrastrar(x, y);
    else if (this.estadoActual === 6) this.cColaboracion.arrastrar(x, y);
    else if (this.estadoActual === 7) this.cIncertidumbre.arrastrar(x, y);
    else if (this.estadoActual === 8) this.cAnsiedad.arrastrar(x, y);
    else if (this.estadoActual === 9) this.cExpectativa.arrastrar(x, y);
  }
  
  soltar(x, y) {
    if (this.estadoActual === 1) this.cMemoria.soltar();
    else if (this.estadoActual === 2) this.cHerencia.soltar(x, y);
    else if (this.estadoActual === 3) this.cCaducidad.soltar(x, y);
    else if (this.estadoActual === 4) this.cIdentidad.soltar();
    else if (this.estadoActual === 5) this.cEmpatia.soltar();
    else if (this.estadoActual === 6) this.cColaboracion.soltar();
    else if (this.estadoActual === 7) this.cIncertidumbre.soltar();
    else if (this.estadoActual === 8) this.cAnsiedad.soltar();
    else if (this.estadoActual === 9) this.cExpectativa.soltar();
  }
}

// --- CLASES BÁSICAS Y ESTILOS ---
function aplicarEstilo(colorHex, estilo, opacidad = 255) {
  let c = color(colorHex); c.setAlpha(opacidad);
  if (estilo === 0) { fill(c); noStroke(); drawingContext.setLineDash([]); } //azules
  else if (estilo === 1) { noFill(); stroke(c); strokeWeight(8); drawingContext.setLineDash([]); } // negros 
  else if (estilo === 2) { noFill(); stroke(c); strokeWeight(3); drawingContext.setLineDash([15, 15]); } //rojos
}

class Cuadrado {
  constructor(x, y, tam, col, est) { 
    this.x = x; this.y = y; this.tam = tam; this.color = col; this.estilo = est; 
    this.arrastrando = false; 
    this.targetX = x; this.targetY = y; 
    this.offsetId = random(TWO_PI); 
  }
  
  display() { 
    push(); 
    aplicarEstilo(this.color, this.estilo); 
    rectMode(CENTER); 
    
    let ox = this.arrastrando ? 0 : sin(millis() * 0.0008 + this.offsetId) * 12;
    let oy = this.arrastrando ? 0 : cos(millis() * 0.001 + this.offsetId) * 12;
    
    translate(this.x + ox, this.y + oy);
    square(0, 0, this.tam); 
    pop(); 
  }
  
  tocando(tx, ty) { 
    let ox = this.arrastrando ? 0 : sin(millis() * 0.0008 + this.offsetId) * 12;
    let oy = this.arrastrando ? 0 : cos(millis() * 0.001 + this.offsetId) * 12;
    let m = this.tam / 2; 
    return (tx > (this.x + ox) - m && tx < (this.x + ox) + m && ty > (this.y + oy) - m && ty < (this.y + oy) + m); 
  }
}

class Triangulo {
  constructor(x, y, tam, col, est) { this.x=x; this.y=y; this.tam=tam; this.color=col; this.estilo=est; this.arrastrando=false; }
  display() { push(); aplicarEstilo(this.color, this.estilo); translate(this.x, this.y); let h = this.tam*(sqrt(3)/2); triangle(0, -h*(2/3), -this.tam/2, h*(1/3), this.tam/2, h*(1/3)); pop(); }
  tocando(tx, ty) { return (dist(tx, ty, this.x, this.y) < this.tam/2); }
}

class Circulo {
  constructor(x, y, tam, col, est) { this.x=x; this.y=y; this.tam=tam; this.color=col; this.estilo=est; this.arrastrando=false; }
  display() { push(); aplicarEstilo(this.color, this.estilo); circle(this.x, this.y, this.tam); pop(); }
  tocando(tx, ty) { return (dist(tx, ty, this.x, this.y) < this.tam/2); }
}


// =========================================================
// SUBSISTEMA 1 (PASADO)
// =========================================================

// --- CONCEPTO 1: MEMORIA ---
class ConceptoMemoria {
  constructor() {
    let tB = min(width, height) * 0.35; 
    this.c1 = new Cuadrado(width * 0.20, height * 0.30, tB * 0.75, COLORES[0], 1); // Negro
    this.c2 = new Cuadrado(width * 0.75, height * 0.40, tB * 1.20, COLORES[1], 0); // Azul
    this.c3 = new Cuadrado(width * 0.40, height * 0.75, tB * 0.95, COLORES[2], 2); // Rojo
    
    this.rastros = []; 
    this.rastroActual = null;
    this.figuraActiva = null;
  }

  update() { 
    for (let i = this.rastros.length - 1; i >= 0; i--) {
      let r = this.rastros[i];
      if (!r.activo) {
        r.opacidad -= 0.85; 
        if (r.opacidad <= 0) {
          this.rastros.splice(i, 1);
        }
      }
    }
  }

  display() {
    for (let r of this.rastros) {
      if (r.puntos.length > 1) { 
        noFill(); 
        
        if (r.id === 0) { 
          stroke(26, 26, 26, r.opacidad); strokeWeight(8); drawingContext.setLineDash([]); //negro
        } else if (r.id === 1) { 
          stroke(22, 78, 150, r.opacidad); strokeWeight(25); drawingContext.setLineDash([]); //azul
        } else if (r.id === 2) { 
          stroke(212, 42, 42, r.opacidad); strokeWeight(3); drawingContext.setLineDash([15, 15]); 
        }
        
        beginShape(); 
        for (let p of r.puntos) vertex(p.x, p.y); 
        endShape(); 
        drawingContext.setLineDash([]); 
      }
    }
    
    this.c2.display(); 
    this.c3.display(); 
    this.c1.display();
  }

  iniciarNuevoRastro(figura, id) { 
    let nuevoRastro = { puntos: [createVector(figura.x, figura.y)], id: id, opacidad: 255, activo: true };
    this.rastros.push(nuevoRastro);
    this.rastroActual = nuevoRastro;
    this.figuraActiva = figura;
  }

  presionar(tx, ty) {
    if (this.c3.tocando(tx, ty)) { this.c3.arrastrando = true; this.iniciarNuevoRastro(this.c3, 2); }
    else if (this.c2.tocando(tx, ty)) { this.c2.arrastrando = true; this.iniciarNuevoRastro(this.c2, 1); }
    else if (this.c1.tocando(tx, ty)) { this.c1.arrastrando = true; this.iniciarNuevoRastro(this.c1, 0); }
  }

  arrastrar(tx, ty) {
    let mx = abs(mouseX - pmouseX); let my = abs(mouseY - pmouseY); 
    let dx = mouseX - pmouseX; let dy = mouseY - pmouseY;
    
    if (this.c1.arrastrando) this.mover(this.c1, mx, my, dx, dy);
    else if (this.c2.arrastrando) this.mover(this.c2, mx, my, dx, dy);
    else if (this.c3.arrastrando) this.mover(this.c3, mx, my, dx, dy);
  }

  mover(f, mx, my, dx, dy) { 
    if (mx > my) { f.x += dx; } else { f.y += dy; }
    let m = f.tam / 2; 
    f.x = constrain(f.x, m, width - m); 
    f.y = constrain(f.y, m, height - m); 
    if (this.rastroActual) { this.rastroActual.puntos.push(createVector(f.x, f.y)); }
  }

  soltar() { 
    this.c1.arrastrando = false; this.c2.arrastrando = false; this.c3.arrastrando = false; 
    if (this.rastroActual) {
      this.rastroActual.activo = false;
      this.rastroActual = null;
      this.figuraActiva = null;
    }
  }
}

// --- CONCEPTO 2: HERENCIA ---
class Madre {
  constructor(c, e, x, y, tam) { 
    this.color = c; this.estilo = e; this.x = x; this.y = y; this.tam = tam; 
    this.hijos = []; this.retornando = false; this.startX = 0; this.startY = 0; 
    this.fig = new Cuadrado(x, y, tam, COLORES[c], e); 
    this.refillHijos(); 
  }

  refillHijos() {
    this.posiblesHijos = [];
    for (let i = 0; i < 3; i++) {
      if (i !== this.estilo) this.posiblesHijos.push({ c: this.color, e: i });
      if (i !== this.color) this.posiblesHijos.push({ c: i, e: this.estilo });
    }
    for(let i = this.posiblesHijos.length - 1; i > 0; i--){
      const j = Math.floor(random() * (i + 1)); 
      const temp = this.posiblesHijos[i];
      this.posiblesHijos[i] = this.posiblesHijos[j]; 
      this.posiblesHijos[j] = temp;
    }
  }

  generarHijo(dx, dy) {
    if (this.hijos.length >= 3) return; 
    if (this.posiblesHijos.length === 0) this.refillHijos();
    let config = this.posiblesHijos.pop();
    this.hijos.push({ 
      fig: new Cuadrado(this.x, this.y, this.tam * 0.4, COLORES[config.c], config.e), 
      vx: constrain(dx * 0.1, -15, 15), vy: constrain(dy * 0.1, -15, 15) 
    });
  }

  update() {
    if (this.hijos.length === 3 && !this.retornando) { 
      let ult = this.hijos[2]; 
      if (abs(ult.vx) < 1 && abs(ult.vy) < 1) this.retornando = true; 
    }
    for (let i = this.hijos.length - 1; i >= 0; i--) {
      let h = this.hijos[i];
      if (this.retornando) { 
        h.fig.x = lerp(h.fig.x, this.x, 0.05); 
        h.fig.y = lerp(h.fig.y, this.y, 0.05); 
        if (dist(h.fig.x, h.fig.y, this.x, this.y) < 5) this.hijos.splice(i, 1); 
      } else { 
        h.fig.x += h.vx; h.fig.y += h.vy; h.vx *= 0.95; h.vy *= 0.95; 
        let m = h.fig.tam / 2; 
        if (h.fig.x < m || h.fig.x > width - m) h.vx *= -1; 
        if (h.fig.y < m || h.fig.y > height - m) h.vy *= -1; 
        h.fig.x = constrain(h.fig.x, m, width - m); h.fig.y = constrain(h.fig.y, m, height - m); 
      }
    }
    if (this.retornando && this.hijos.length === 0) { 
      this.retornando = false; this.refillHijos(); 
    }
  }
  
  display() { 
    for (let h of this.hijos) h.fig.display(); 
    this.fig.display(); 
  }
}

class ConceptoHerencia {
  constructor() {
    let tB = min(width, height) * 0.35;
    this.madres = [
      new Madre(0, 1, width * 0.5, height * 0.25, tB * 0.75),  
      new Madre(1, 0, width * 0.25, height * 0.65, tB * 1.20), 
      new Madre(2, 2, width * 0.8, height * 0.7, tB * 0.95)    
    ]; 
    this.mActiva = null;
  }
  
  update() { for (let m of this.madres) m.update(); } 
  display() { 
    this.madres[1].display(); 
    this.madres[2].display(); 
    this.madres[0].display(); 
  }
  
  presionar(tx, ty) { 
    for (let m of this.madres) { 
      if (m.fig.tocando(tx, ty) && !m.retornando) { 
        this.mActiva = m; m.startX = tx; m.startY = ty; m.fig.arrastrando = true; 
        break; 
      } 
    } 
  }
  
  arrastrar(tx, ty) {}
  
  soltar(tx, ty) { 
    if (this.mActiva) { 
      let dx = tx - this.mActiva.startX; let dy = ty - this.mActiva.startY; 
      if (dist(this.mActiva.startX, this.mActiva.startY, tx, ty) > 40 && this.mActiva.hijos.length < 3) {
        this.mActiva.generarHijo(dx, dy); 
      }
      this.mActiva.fig.arrastrando = false; 
      this.mActiva = null; 
    } 
  }
}

// --- CONCEPTO 3: CADUCIDAD ---
class FiguraCaduca {
  constructor(c, e, x, y, tam) { 
    this.color = c; this.estilo = e; this.x = x; this.y = y; 
    this.tamOriginal = tam; this.salud = 255; this.factorDesgaste = 1.0; 
    this.offsetId = random(TWO_PI); this.arrastrando = false;
  }

  display() {
    if (this.salud <= 0) return; 
    
    push(); 
    let r = RGB_COLORES[this.color]; 
    let ox = this.arrastrando ? 0 : sin(millis() * 0.0008 + this.offsetId) * 12;
    let oy = this.arrastrando ? 0 : cos(millis() * 0.001 + this.offsetId) * 12;
    translate(this.x + ox, this.y + oy); 
    
    rectMode(CENTER); 
    
    if (this.estilo === 0) { 
      fill(r[0], r[1], r[2], this.salud); noStroke(); drawingContext.setLineDash([]); 
      square(0, 0, this.tamOriginal); 
    } 
    else if (this.estilo === 1) { 
      noFill(); stroke(r[0], r[1], r[2], 255); strokeWeight(8); drawingContext.setLineDash([]); 
      let tamActual = map(this.salud, 0, 255, 0, this.tamOriginal);
      square(0, 0, tamActual); 
    } 
    else if (this.estilo === 2) {
      noFill(); stroke(r[0], r[1], r[2], 255); strokeWeight(3); 
      let dash = 15; let gap = 15 + pow(map(this.salud, 255, 0, 0, 25), 2); 
      drawingContext.setLineDash([dash, gap]); 
      square(0, 0, this.tamOriginal); 
    }
    
    pop();
  }

  tocando(tx, ty) { 
    if (this.salud <= 0) return false; 
    let ox = this.arrastrando ? 0 : sin(millis() * 0.0008 + this.offsetId) * 12;
    let oy = this.arrastrando ? 0 : cos(millis() * 0.001 + this.offsetId) * 12;
    return dist(tx, ty, this.x + ox, this.y + oy) < (this.tamOriginal / 2) + 20; 
  }
}

class ConceptoCaducidad {
  constructor() { this.iniciarFiguras(); }

  iniciarFiguras() { 
    let tB = min(width, height) * 0.35; 
    this.figuras = [
      new FiguraCaduca(0, 1, width * 0.7, height * 0.8, tB * 0.75),  
      new FiguraCaduca(1, 0, width * 0.3, height * 0.75, tB * 1.20), 
      new FiguraCaduca(2, 2, width * 0.45, height * 0.25, tB * 0.95) 
    ]; 
    this.muerto = false; this.tMuerto = 0; 
  }

  update() { 
    if (this.muerto) { 
      if (millis() - this.tMuerto > 3000) this.iniciarFiguras(); 
    } else { 
      let todas = true; 
      for (let f of this.figuras) {
        if (f.salud > 0) todas = false; 
        f.factorDesgaste = lerp(f.factorDesgaste, 1.0, 0.05); 
      }
      if (todas) { this.muerto = true; this.tMuerto = millis(); } 
    } 
  }

  display() { 
    this.figuras[1].display(); 
    this.figuras[2].display(); 
    this.figuras[0].display(); 
  }

  presionar(tx, ty) {
    if (this.muerto) return;
    for (let f of this.figuras) {
      if (f.tocando(tx, ty)) f.arrastrando = true;
    }
  }

  arrastrar(tx, ty) { 
    if (this.muerto) return; 
    let r = dist(mouseX, mouseY, pmouseX, pmouseY); 
    if (r > 0) { 
      for (let f of this.figuras) {
        if (f.tocando(tx, ty)) { 
          f.arrastrando = true; 
          f.factorDesgaste += 0.08; 
          f.salud -= r * 0.05 * f.factorDesgaste; 
          if (f.salud < 0) f.salud = 0; 
        } 
      }
    } 
  }

  soltar() {
    for (let f of this.figuras) f.arrastrando = false;
  }
}


// =========================================================
// SUBSISTEMA 2 (PRESENTE)
// =========================================================

class ConceptoIdentidad {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.posInicio = createVector(width / 2, height / 2);
    this.posEsquina = createVector(width * 0.25, height * 0.25);
    this.tamBase = this.tB * 1.35; 
    this.offsetId = random(TWO_PI); // Identificador para la oscilación
    this.reset();
  }
  reset() {
    this.fase = 0; this.tiempoMuerte = 0; this.tiempoInicio = millis(); 
    this.x = this.posInicio.x; this.y = this.posInicio.y;
    this.targetX = this.posInicio.x; this.targetY = this.posInicio.y;
    this.escala = 1.0; this.opacidad = 255; this.anguloAzul = 0; 
    this.tiempoEfecto = 0; this.presionado = false;
    let offset1 = createVector(-width * 0.3, height * 0.3);
    let offset2 = createVector(width * 0.35, -height * 0.25);
    this.atacantes = [
      { id: 1, offset: offset1, x: this.x + offset1.x, y: this.y + offset1.y, tamBase: this.tB * 0.75, tamMinimo: this.tB * 0.50, tam: this.tB * 0.75, cooldown: 0, angulo: 0 },
      { id: 2, offset: offset2, x: this.x + offset2.x, y: this.y + offset2.y, tamBase: this.tB * 0.95, tamMinimo: this.tB * 0.60, tam: this.tB * 0.95, cooldown: 0, angulo: -HALF_PI }
    ];
  }
  update() {
    let vel = 0.15; 
    if (this.fase === 0) {
      if (this.opacidad <= 0 || this.escala <= 0) {
        this.fase = 1; this.tiempoMuerte = millis(); return; 
      }
      let tiempoTranscurrido = millis() - this.tiempoInicio;
      if (tiempoTranscurrido < 1500) {
        this.targetX = this.posInicio.x; this.targetY = this.posInicio.y;
        this.x = this.posInicio.x; this.y = this.posInicio.y; return; 
      }
      let enApunte = tiempoTranscurrido < 2500;
      for (let a of this.atacantes) if (a.cooldown > 0) a.cooldown--;
      let activo = this.presionado || this.tiempoEfecto > 0;
      if (activo) {
        if (!this.presionado && this.tiempoEfecto > 0) this.tiempoEfecto--; 
        this.escala = min(1.35, this.escala + 0.02); this.opacidad = min(255, this.opacidad + 10);
        this.targetX = this.posInicio.x; this.targetY = this.posInicio.y;
        let distanciaSegura = (this.tamBase * this.escala) * 1.1;
        for (let a of this.atacantes) {
          a.cooldown = 0; 
          let posAnclajeActual = createVector(this.x + a.offset.x, this.y + a.offset.y);
          let dirAnclaje = p5.Vector.sub(posAnclajeActual, createVector(this.x, this.y)).normalize();
          let posDestinoSegura = p5.Vector.add(createVector(this.x, this.y), p5.Vector.mult(dirAnclaje, distanciaSegura));
          a.x = lerp(a.x, posDestinoSegura.x, vel); a.y = lerp(a.y, posDestinoSegura.y, vel);
          let targetAngle = atan2(this.y - a.y, this.x - a.x) + HALF_PI;
          a.angulo = this.lerpAngle(a.angulo, targetAngle, vel);
          a.tam = lerp(a.tam, a.tamMinimo, vel);
        }
      } else {
        let posAzul = createVector(this.x, this.y); let siendoAtacado = false;
        for (let a of this.atacantes) {
          let posAnclajeActual = createVector(this.x + a.offset.x, this.y + a.offset.y);
          let posAtacante = createVector(a.x, a.y);
          let dir = p5.Vector.sub(posAzul, posAtacante); let distAtaque = dir.mag();
          let tamAzul = this.tamBase * this.escala; let tamAtacante = a.tam;
          let distanciaColision; let distPuntaAtacante = tamAtacante * 0.57735;
          if (a.id === 1) {
            let distBaseAzul = tamAzul * 0.28867; distanciaColision = distBaseAzul + distPuntaAtacante;
          } else {
            let distLadoAzul = tamAzul * 0.33333; distanciaColision = distLadoAzul + distPuntaAtacante;
          }
          let targetAngle = atan2(this.y - a.y, this.x - a.x) + HALF_PI;
          a.angulo = this.lerpAngle(a.angulo, targetAngle, vel);
          a.tam = lerp(a.tam, a.tamBase, vel * 0.5);
          if (a.cooldown === 0) {
            if (enApunte) {
              a.x = lerp(a.x, posAnclajeActual.x, vel); a.y = lerp(a.y, posAnclajeActual.y, vel);
            } else {
              if (distAtaque > distanciaColision) {
                a.x = lerp(a.x, posAzul.x, vel * 1.5); a.y = lerp(a.y, posAzul.y, vel * 1.5);
              } else {
                siendoAtacado = true;
                this.escala = max(0, this.escala * 0.96); this.opacidad = max(0, this.opacidad - 12.0); 
                let dirRebote = dir.copy().normalize().mult(-15);
                a.x += dirRebote.x; a.y += dirRebote.y; a.cooldown = 15; 
              }
            }
          } else {
            a.x = lerp(a.x, posAnclajeActual.x, vel); a.y = lerp(a.y, posAnclajeActual.y, vel);
          }
        }
        if (siendoAtacado) {
          this.targetX = lerp(this.targetX, this.posEsquina.x, 0.4);
          this.targetY = lerp(this.targetY, this.posEsquina.y, 0.4);
        }
      }
      this.x = lerp(this.x, this.targetX, vel); this.y = lerp(this.y, this.targetY, vel);
    } else if (this.fase === 1) {
      if (millis() - this.tiempoMuerte > 2000) { this.reset(); return; }
      for (let a of this.atacantes) {
        let posAnclajeCalma = createVector(this.posInicio.x + a.offset.x, this.posInicio.y + a.offset.y);
        a.x = lerp(a.x, posAnclajeCalma.x, vel); a.y = lerp(a.y, posAnclajeCalma.y, vel);
        let targetAngle = atan2(this.posInicio.y - a.y, this.posInicio.x - a.x) + HALF_PI;
        a.angulo = this.lerpAngle(a.angulo, targetAngle, vel);
        a.tam = lerp(a.tam, a.tamBase, vel * 0.5);
      }
    }
  }
  lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff < -PI) diff += TWO_PI;
    while (diff > PI) diff -= TWO_PI;
    return a + diff * t;
  }
  display() {
    if (this.fase === 0 && this.opacidad > 0 && this.escala > 0) {
      // Oscilación muy suave (flotación leve de ±4 píxeles)
      let ox = (this.presionado || this.tiempoEfecto > 0) ? 0 : sin(millis() * 0.0008 + this.offsetId) * 9;
      let oy = (this.presionado || this.tiempoEfecto > 0) ? 0 : cos(millis() * 0.001 + this.offsetId) * 9;

      push(); 
      translate(this.x + ox, this.y + oy); 
      rotate(radians(this.anguloAzul)); 
      scale(this.escala);
      aplicarEstilo(COLORES[1], 0, this.opacidad);
      let r = this.tamBase / 2;
      let x1 = r * cos(-HALF_PI); let y1 = r * sin(-HALF_PI);
      let x2 = r * cos(-HALF_PI + TWO_PI / 3); let y2 = r * sin(-HALF_PI + TWO_PI / 3);
      let x3 = r * cos(-HALF_PI + 2 * TWO_PI / 3); let y3 = r * sin(-HALF_PI + 2 * TWO_PI / 3);
      triangle(x1, y1, x2, y2, x3, y3); 
      pop();
    }
    let aRojo = this.atacantes.find(a => a.id === 2);
    if (aRojo) {
      push(); translate(aRojo.x, aRojo.y); rotate(aRojo.angulo); aplicarEstilo(COLORES[2], 2);
      let rA = aRojo.tam / 2;
      let ax1 = rA * cos(-HALF_PI); let ay1 = rA * sin(-HALF_PI);
      let ax2 = rA * cos(-HALF_PI + TWO_PI / 3); let ay2 = rA * sin(-HALF_PI + TWO_PI / 3);
      let ax3 = rA * cos(-HALF_PI + 2 * TWO_PI / 3); let ay3 = rA * sin(-HALF_PI + 2 * TWO_PI / 3);
      triangle(ax1, ay1, ax2, ay2, ax3, ay3); pop();
    }
    let aNegro = this.atacantes.find(a => a.id === 1);
    if (aNegro) {
      push(); translate(aNegro.x, aNegro.y); rotate(aNegro.angulo); aplicarEstilo(COLORES[0], 1); 
      let rA = aNegro.tam / 2;
      let ax1 = rA * cos(-HALF_PI); let ay1 = rA * sin(-HALF_PI);
      let ax2 = rA * cos(-HALF_PI + TWO_PI / 3); let ay2 = rA * sin(-HALF_PI + TWO_PI / 3);
      let ax3 = rA * cos(-HALF_PI + 2 * TWO_PI / 3); let ay3 = rA * sin(-HALF_PI + 2 * TWO_PI / 3);
      triangle(ax1, ay1, ax2, ay2, ax3, ay3); pop();
    }
  }
  presionar(tx, ty) {
    if (this.fase !== 0 || millis() - this.tiempoInicio < 1500) return; 
    let r = max((this.tamBase * this.escala) / 2, 40);
    if (dist(tx, ty, this.x, this.y) < r) { this.presionado = true; this.tiempoEfecto = 45; }
  }
  arrastrar(tx, ty) {
    if (this.presionado) { this.tiempoEfecto = 45; }
  }
  soltar() {
    this.presionado = false;
  }
}

// --- CONCEPTO 5: EMPATÍA ---
class FiguraEmpatia {
  constructor(c, e, x, y, tam, tBase, anguloInicial, esCentral = false) {
    this.colorIndex = c; // 0: Negro, 1: Azul, 2: Rojo
    this.colorHex = COLORES[c];
    this.estilo = e;
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.tBase = tBase;

    // Ángulo absoluto en grados. 0° sitúa la base horizontal abajo y el vértice hacia arriba.
    this.angulo = anguloInicial;
    this.esCentral = esCentral; // Define si es el ancla estática inmutable

    this.vx = this.esCentral ? 0 : random(-1.5, 1.5);
    this.vy = this.esCentral ? 0 : random(-1.5, 1.5);
    this.lastTouchAngle = null;

    this.escala = 1.0;
    this.oscilando = !this.esCentral;
    this.offsetOscilacion = random(TWO_PI);
    this.acoplada = this.esCentral; // Estado individual de sintonía y viaje al centro
  }

  update(isHarmonic) {
    // Si es central o ya está acoplada/viajando al centro, no procesa física de deriva
    if (!this.esCentral && !this.acoplada && !isHarmonic) {
      this.x += this.vx;
      this.y += this.vy;

      this.vx *= 0.98;
      this.vy *= 0.98;

      let speed = dist(0, 0, this.vx, this.vy);
      if (speed < 0.5) {
        let ang = random(TWO_PI);
        this.vx += cos(ang) * 0.1;
        this.vy += sin(ang) * 0.1;
      }
    }

    // Rebote elástico en los márgenes mientras no esté acoplada
    if (!this.acoplada) {
      let m = (this.tam * this.escala) / 2;
      if (this.x < m || this.x > width - m) {
        this.vx *= -1;
        this.x = constrain(this.x, m, width - m);
      }
      if (this.y < m || this.y > height - m) {
        this.vy *= -1;
        this.y = constrain(this.y, m, height - m);
      }
    }
  }

  display() {
    push();
    aplicarEstilo(this.colorHex, this.estilo);
    translate(this.x, this.y);

    let anguloVisible = this.angulo;
    if (this.oscilando && !this.acoplada) {
      anguloVisible += sin(millis() * 0.002 + this.offsetOscilacion) * 12;
    }

    rotate(radians(anguloVisible));
    scale(this.escala);

    let h = this.tam * (sqrt(3) / 2);
    // Vértice superior en -h*(2/3) y base horizontal en h*(1/3)
    triangle(0, -h * (2 / 3), -this.tam / 2, h * (1 / 3), this.tam / 2, h * (1 / 3));

    // Eje longitudinal constructivista vertical (|)
    stroke(26, 26, 26);
    strokeWeight(3);
    drawingContext.setLineDash([]);
    let yBase = h * (1 / 3);
    let yPunta = -h * (2 / 3);
    let ext = h * 0.15; // Extensión saliente contenida
    line(0, yPunta - ext, 0, yBase + ext);

    pop();
  }

  tocando(tx, ty) {
    if (this.esCentral || this.acoplada) return false;

    // Contacto sobre el cuerpo triangular
    if (dist(tx, ty, this.x, this.y) < (this.tam * this.escala) / 2) return true;

    // Contacto sobre el eje longitudinal acortado
    let angleRad = radians(this.angulo - 90);
    let dirX = cos(angleRad);
    let dirY = sin(angleRad);
    let h = this.tam * (sqrt(3) / 2);
    let ext = (h / 2) * 1.15;
    let wx = tx - this.x;
    let wy = ty - this.y;
    let proj = wx * dirX + wy * dirY;
    let perpX = wx - proj * dirX;
    let perpY = wy - proj * dirY;
    let distPerp = dist(0, 0, perpX, perpY);

    return abs(proj) < ext && distPerp < 35;
  }
}

class ConceptoEmpatia {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.reset();
  }

  reset() {
    let cx = width / 2;
    let cy = height / 2;
    let anguloVerticalEje = 0; // 0° garantiza que la línea del eje quede vertical absoluta (|)

    this.figuras = [
      // Figura 0: Negro (Actor A) - Móvil
      new FiguraEmpatia(0, 1, width * 0.25, height * 0.30, this.tB * 0.85, this.tB, 50, false),
      // Figura 1: Azul (Actor B) - Central estático inmutable
      new FiguraEmpatia(1, 0, cx, cy, this.tB, this.tB, anguloVerticalEje, true),
      // Figura 2: Rojo (Actor C) - Móvil
      new FiguraEmpatia(2, 2, width * 0.75, height * 0.70, this.tB * 1.10, this.tB, 135, false)
    ];

    this.isHarmonic = false;
    this.harmonicTimer = 0;
  }

  update() {
    let vel = 0.1; // Lerp característico del Presente
    let central = this.figuras[1];
    let cx = central.x;
    let cy = central.y;

    let aCentral = central.angulo % 180;
    if (aCentral < 0) aCentral += 180;

    // 1. Evaluación y acople progresivo e independiente para cada figura
    for (let f of this.figuras) {
      if (f.esCentral) continue;

      let aF = f.angulo % 180;
      if (aF < 0) aF += 180;

      let difAngulo = min(abs(aF - aCentral), 180 - abs(aF - aCentral));

      // Si alcanza la orientación vertical (≤ 5°), se activa su acople de inmediato
      if (difAngulo <= 5) {
        f.acoplada = true;
        f.oscilando = false;
        f.vx = 0;
        f.vy = 0;

        // Viaja de inmediato hacia el centro para apilarse sobre la base
        f.x = lerp(f.x, cx, vel);
        f.y = lerp(f.y, cy, vel);

        // Snap angular suave al ángulo del central
        let targetAng = round((f.angulo - central.angulo) / 180) * 180 + central.angulo;
        f.angulo = lerp(f.angulo, targetAng, vel);
      } else {
        // Si no está acoplada, continúa flotando normalmente
        f.acoplada = false;
        f.update(false);
        f.escala = lerp(f.escala, 1.0, vel);
      }
    }

    // 2. Fuerzas de Repulsión Dinámicas (solo activas para figuras libres/no acopladas)
    for (let i = 0; i < this.figuras.length; i++) {
      for (let j = i + 1; j < this.figuras.length; j++) {
        let fA = this.figuras[i];
        let fB = this.figuras[j];

        // Solo hay repulsión si al menos una de las dos figuras está libre y fuera de eje
        if (!fA.acoplada || !fB.acoplada) {
          let angA = fA.angulo % 180; if (angA < 0) angA += 180;
          let angB = fB.angulo % 180; if (angB < 0) angB += 180;
          let alineadas = min(abs(angA - angB), 180 - abs(angA - angB)) <= 5;

          if (!alineadas) {
            let d = dist(fA.x, fA.y, fB.x, fB.y);
            let umbral = (fA.tam + fB.tam) * 0.72;

            if (d < umbral && d > 0) {
              let fuerza = map(d, 0, umbral, 0.65, 0);
              let dirX = (fA.x - fB.x) / d;
              let dirY = (fA.y - fB.y) / d;

              // Solo se empujan las figuras que no estén fijadas ni acopladas
              if (!fA.esCentral && !fA.acoplada) {
                fA.vx += dirX * fuerza;
                fA.vy += dirY * fuerza;
              }
              if (!fB.esCentral && !fB.acoplada) {
                fB.vx -= dirX * fuerza;
                fB.vy -= dirY * fuerza;
              }
            }
          }
        }
      }
    }

    // 3. Validación de Empatía Global (los tres están alineados y en el centro)
    let todosAlineados = this.figuras.every(f => f.acoplada);
    let todosCercaDelCentro = this.figuras.every(f => dist(f.x, f.y, cx, cy) < 6);

    if (todosAlineados && todosCercaDelCentro) {
      if (!this.isHarmonic) {
        this.isHarmonic = true;
        this.harmonicTimer = millis();
      }

      // Expansión armónica conjunta en el centro
      for (let f of this.figuras) {
        f.x = lerp(f.x, cx, vel);
        f.y = lerp(f.y, cy, vel);
        f.escala = lerp(f.escala, 1.3, vel);
      }

      // Reinicio automático a los 3 segundos de sostener la armonía
      if (millis() - this.harmonicTimer > 3000) {
        this.reset();
      }
    } else {
      this.isHarmonic = false;
      this.harmonicTimer = 0;
    }
  }

  display() {
    // Orden estricto de capas (Z-index de atrás hacia adelante):
    // 1. Atrás (fondo): Azul (Índice 1 - sólido)
    // 2. Al medio: Negro (Índice 0 - contorno continuo)
    // 3. Al frente: Rojo (Índice 2 - borde punteado)
    let ordenZ = [1, 0, 2];

    for (let idx of ordenZ) {
      this.figuras[idx].display();
    }
  }

  presionar() {}

  arrastrar(tx, ty) {
    if (this.isHarmonic) return;

    for (let f of this.figuras) {
      // Ignora la figura central y cualquier figura ya acoplada en viaje
      if (f.esCentral || f.acoplada) continue;

      let t0 = touches.length > 0 ? touches[0] : null;
      let t1 = touches.length > 1 ? touches[1] : null;

      // Multitouch (2 contactos: rotación y arrastre)
      if (t0 && t1) {
        if (f.tocando(t0.x, t0.y) || f.tocando(t1.x, t1.y)) {
          let currentAngle = degrees(atan2(t1.y - t0.y, t1.x - t0.x));
          if (f.lastTouchAngle !== null) {
            let diff = currentAngle - f.lastTouchAngle;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            f.angulo += diff;
          }
          f.lastTouchAngle = currentAngle;
        }
      }
      // Touch con un solo punto
      else if (t0) {
        if (f.tocando(t0.x, t0.y)) {
          f.x += mouseX - pmouseX;
          f.y += mouseY - pmouseY;
        }
        f.lastTouchAngle = null;
      }
      // Ratón / Mouse
      else {
        f.lastTouchAngle = null;
        if (mouseIsPressed && f.tocando(mouseX, mouseY)) {
          if (dist(mouseX, mouseY, f.x, f.y) > (f.tam * f.escala) / 4) {
            let a1 = atan2(mouseY - f.y, mouseX - f.x);
            let a2 = atan2(pmouseY - f.y, pmouseX - f.x);
            f.angulo += degrees(a1 - a2);
          } else {
            f.x += mouseX - pmouseX;
            f.y += mouseY - pmouseY;
          }
        }
      }
    }
  }

  soltar() {
    for (let f of this.figuras) {
      f.lastTouchAngle = null;
    }
  }
}


//
//COLABORACIONNN
class ConceptoColaboracion {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.reset();
  }

  reset() {
    this.fase = 0;
    this.tiempoInicio = millis();
    this.escalaTriunfo = 1.0; 

    this.a = {
      x: width * 0.25, y: height * 0.45,
      targetX: width * 0.25, targetY: height * 0.45,
      inicioX: width * 0.25, inicioY: height * 0.45,
      arrastrando: false, floatOffset: random(TWO_PI), lastTx: 0, lastTy: 0
    };

    this.b = { x: width * 0.60, y: height * 0.45 };
    this.centroFusionX = this.b.x;
    this.centroFusionY = this.b.y;

    this.c = {
      x: width * 0.85, y: height * 0.45,
      targetX: width * 0.85, targetY: height * 0.45,
      inicioX: width * 0.85, inicioY: height * 0.45,
      arrastrando: false, floatOffset: random(TWO_PI), lastTx: 0, lastTy: 0
    };

    this.particulas = [];
    let N = 5; 
    let L = this.tB * 1.20; 
    let H = L * (sqrt(3) / 2); 
    let l = L / N; let h = H / N; 

    let index = 0;
    for (let r = N - 1; r >= 0; r--) {
      for (let i = 0; i <= 2 * r; i++) {
        let invertido = (i % 2 !== 0); 
        let X = -r * (l / 2) + i * (l / 2);
        let Y = r * h + (invertido ? (h / 3) : (h * 2 / 3));
        let xBase = X; let yBase_rel = Y - (H * 2 / 3);
        
        this.particulas.push({
          id: index++,
          xBase: xBase, yBase: yBase_rel,
          x: this.b.x + xBase, y: this.b.y + yBase_rel,
          vx: 0, vy: 0, invertido: invertido, fila: r, angulo: 0, desprendida: false, enPiso: false
        });
      }
    }

    this.fusionTimer = 0;
  }

  update() {
    let vel = 0.08; 
    let pisoY = height - this.tB * 0.5; 

    if (this.fase === 0) {
      // 1. INICIO ACELERADO A LOS 0.1 SEGUNDOS (100 ms)
      if (millis() - this.tiempoInicio > 500) this.fase = 1;
      for (let p of this.particulas) { p.x = this.b.x + p.xBase; p.y = this.b.y + p.yBase; }
    }

    if (this.fase === 1) {
      this.centroFusionX = (this.a.x + this.c.x) / 2;
      this.centroFusionY = (this.a.y + this.c.y) / 2;

      // Geometría y dimensiones
      let baseA = this.tB * 0.75;
      let hA = baseA * (sqrt(3)/2);
      let baseC = this.tB * 0.95;
      let hC = baseC * (sqrt(3)/2);

      let medioAnchoAzul = (this.tB * 1.20) / 2;

      // Vértices de contacto reales en pantalla
      let verticeAX = this.a.x + baseA / 2; // Punta inferior derecha (Negro)
      let verticeAY = this.a.y + hA * (1 / 3);

      let verticeCX = this.c.x - baseC / 2; // Punta inferior izquierda (Rojo)
      let verticeCY = this.c.y + hC * (1 / 3);

      let distVertices = dist(verticeAX, verticeAY, verticeCX, verticeCY);

      let despA = dist(this.a.x, this.a.y, this.a.inicioX, this.a.inicioY);
      let despC = dist(this.c.x, this.c.y, this.c.inicioX, this.c.inicioY);
      let movA = despA >= 2;
      let movC = despC >= 2;

      // Detección de contacto con los bordes exteriores azules
      let tocaA = verticeAX >= (this.b.x - medioAnchoAzul);
      let tocaC = verticeCX <= (this.b.x + medioAnchoAzul);

      // --- REGLA 1: BLOQUEO UNILATERAL (CONGELAMIENTO EN EL BORDE) ---

      // Si C (Rojo) toca lo azul pero A (Negro) aún NO tocó su lado:
      if (tocaC && !tocaA) {
        let limiteRojo = (this.b.x + medioAnchoAzul) + (baseC / 2);
        this.c.targetX = max(this.c.targetX, limiteRojo);
        this.c.x = max(this.c.x, limiteRojo); // Freno inmediato sobre 'x' sin inercia
      }

      // Si A (Negro) toca lo azul pero C (Rojo) aún NO tocó su lado:
      if (tocaA && !tocaC) {
        let limiteNegro = (this.b.x - medioAnchoAzul) - (baseA / 2);
        this.a.targetX = min(this.a.targetX, limiteNegro);
        this.a.x = min(this.a.x, limiteNegro); // Freno inmediato sobre 'x' sin inercia
      }

      // --- REGLA 2: LÍMITE ABSOLUTO EN EL CENTRO ---
      // El vértice izquierdo del Rojo NUNCA puede sobrepasar el centro (this.b.x)
      if (this.c.targetX - baseC / 2 < this.b.x) {
        this.c.targetX = this.b.x + baseC / 2;
      }
      // El vértice derecho del Negro NUNCA puede sobrepasar el centro (this.b.x)
      if (this.a.targetX + baseA / 2 > this.b.x) {
        this.a.targetX = this.b.x - baseA / 2;
      }

      // --- RECONSTRUCCIÓN Y CAÍDA DE PARTÍCULAS ---
      let ambosTocanYSeMueven = movA && movC && tocaA && tocaC;

      let maxDistVert = width * 0.5;
      let factorAproximacion = constrain(map(distVertices, maxDistVert, 15, 0, 1), 0, 1);

      let totalParti = this.particulas.length;
      let numFormadas = 0;

      if (ambosTocanYSeMueven) {
        numFormadas = floor(totalParti * factorAproximacion);
      }

      let tiempoEnFase1 = millis() - this.tiempoInicio - 500;

      for (let p of this.particulas) {
        let seConstruye = (p.id < numFormadas);

        if (seConstruye) {
          let targetX = this.centroFusionX + p.xBase;
          let targetY = this.centroFusionY + p.yBase;

          p.x = lerp(p.x, targetX, vel); 
          p.y = lerp(p.y, targetY, vel);
          p.angulo = lerp(p.angulo, 0, vel);
        } else {
          let delayCaida = (4 - p.fila) * 80; 
          
          if (tiempoEnFase1 > delayCaida && !p.desprendida) { p.desprendida = true; p.vx = random(-1.5, 1.5); }
          if (p.desprendida && !p.enPiso) {
            p.vy += 0.8; p.y += p.vy; p.x += p.vx; p.angulo += p.vx * 0.05; 
            
            if (p.y >= pisoY) { p.y = pisoY; p.vy = 0; p.vx = 0; p.enPiso = true; }
          }
        }
      }

      if (distVertices < 20 && ambosTocanYSeMueven) {
        this.fase = 2;
        this.fusionTimer = millis();
      }
    }

    if (this.fase === 2) {
      this.escalaTriunfo = lerp(this.escalaTriunfo, 1.8, vel);
      this.centroFusionX = lerp(this.centroFusionX, width / 2, vel);
      this.centroFusionY = lerp(this.centroFusionY, height / 2, vel);

      for (let p of this.particulas) {
        let targetX = this.centroFusionX + p.xBase * this.escalaTriunfo;
        let targetY = this.centroFusionY + p.yBase * this.escalaTriunfo;
        p.x = lerp(p.x, targetX, vel);
        p.y = lerp(p.y, targetY, vel);
        p.angulo = lerp(p.angulo, 0, vel);
      }

      this.a.targetX = width * 0.35; this.c.targetX = width * 0.65;
      this.a.targetY = height * 0.5; this.c.targetY = height * 0.5;

      if (millis() - this.fusionTimer > 3000) { this.reset(); }
    }

    // Suavizado de movimiento con lerp
    this.a.x = lerp(this.a.x, this.a.targetX, vel); this.a.y = lerp(this.a.y, this.a.targetY, vel);
    this.c.x = lerp(this.c.x, this.c.targetX, vel); this.c.y = lerp(this.c.y, this.c.targetY, vel);

    // Límites de pantalla generales
    let margin = this.tB * 0.4;
    this.a.targetX = constrain(this.a.targetX, margin, width - margin);
    this.a.targetY = constrain(this.a.targetY, margin, height - margin);

    this.c.targetX = constrain(this.c.targetX, margin, width - margin);
    this.c.targetY = constrain(this.c.targetY, margin, height - margin);
  }

  display() {
    let fA = this.a.arrastrando ? 0 : sin(millis() * 0.002 + this.a.floatOffset) * 8;
    let fC = this.c.arrastrando ? 0 : sin(millis() * 0.002 + this.c.floatOffset) * 8;

    let L = this.tB * 1.20; 
    let l = L / 5; 
    let hSmall = l * (sqrt(3) / 2); 

    for (let p of this.particulas) {
      push();
      fill(22, 78, 150); stroke(22, 78, 150); strokeWeight(1.5); drawingContext.setLineDash([]);
      
      translate(p.x, p.y);
      rotate(p.angulo);
      scale(this.fase === 2 ? this.escalaTriunfo : 1.0); 
      
      if (!p.invertido) triangle(0, -hSmall*(2/3), -l/2, hSmall*(1/3), l/2, hSmall*(1/3));
      else triangle(0, hSmall*(2/3), -l/2, -hSmall*(1/3), l/2, -hSmall*(1/3));
      pop();
    }

    push();
    aplicarEstilo(COLORES[2], 2);
    translate(this.c.x, this.c.y + fC);
    let hC = (this.tB * 0.95) * (sqrt(3)/2);
    triangle(0, -hC*(2/3), -(this.tB*0.95)/2, hC*(1/3), (this.tB*0.95)/2, hC*(1/3));
    pop();

    push();
    aplicarEstilo(COLORES[0], 1);
    translate(this.a.x, this.a.y + fA);
    let hA = (this.tB * 0.75) * (sqrt(3)/2);
    triangle(0, -hA*(2/3), -(this.tB*0.75)/2, hA*(1/3), (this.tB*0.75)/2, hA*(1/3));
    pop();
  }

  presionar(tx, ty) {
    if (this.fase !== 1) return; 
    if (touches.length > 0 && touches.length < 2) return;

    let r = (this.tB * 1.1) / 2;

    if (touches.length >= 2) {
      let t0 = touches[0]; let t1 = touches[1];
      let d0A = dist(t0.x, t0.y, this.a.x, this.a.y);
      let d1A = dist(t1.x, t1.y, this.a.x, this.a.y);

      if (d0A < d1A) {
        this.a.lastTx = t0.x; this.a.lastTy = t0.y; this.c.lastTx = t1.x; this.c.lastTy = t1.y;
      } else {
        this.a.lastTx = t1.x; this.a.lastTy = t1.y; this.c.lastTx = t0.x; this.c.lastTy = t0.y;
      }
      this.a.arrastrando = true; this.c.arrastrando = true;
    } else {
      if (dist(tx, ty, this.a.x, this.a.y) < r) {
        this.a.arrastrando = true; this.a.lastTx = tx; this.a.lastTy = ty;
      } else if (dist(tx, ty, this.c.x, this.c.y) < r) {
        this.c.arrastrando = true; this.c.lastTx = tx; this.c.lastTy = ty;
      }
    }
  }

  arrastrar(tx, ty) {
    if (this.fase !== 1) return;
    if (touches.length > 0 && touches.length < 2) return;

    if (touches.length >= 2) {
      let t0 = touches[0]; let t1 = touches[1];
      let d0A = dist(t0.x, t0.y, this.a.x, this.a.y); let d1A = dist(t1.x, t1.y, this.a.x, this.a.y);

      if (d0A < d1A) {
        if (this.a.arrastrando) { this.a.targetX += (t0.x - this.a.lastTx); this.a.targetY += (t0.y - this.a.lastTy); this.a.lastTx = t0.x; this.a.lastTy = t0.y; }
        if (this.c.arrastrando) { this.c.targetX += (t1.x - this.c.lastTx); this.c.targetY += (t1.y - this.c.lastTy); this.c.lastTx = t1.x; this.c.lastTy = t1.y; }
      } else {
        if (this.a.arrastrando) { this.a.targetX += (t1.x - this.a.lastTx); this.a.targetY += (t1.y - this.a.lastTy); this.a.lastTx = t1.x; this.a.lastTy = t1.y; }
        if (this.c.arrastrando) { this.c.targetX += (t0.x - this.c.lastTx); this.c.targetY += (t0.y - this.c.lastTy); this.c.lastTx = t0.x; this.c.lastTy = t0.y; }
      }
    } else {
      if (this.a.arrastrando) { this.a.targetX += (tx - this.a.lastTx); this.a.targetY += (ty - this.a.lastTy); this.a.lastTx = tx; this.a.lastTy = ty; }
      if (this.c.arrastrando) { this.c.targetX += (tx - this.c.lastTx); this.c.targetY += (ty - this.c.lastTy); this.c.lastTx = tx; this.c.lastTy = ty; }
    }
  }

  soltar() {
    this.a.arrastrando = false;
    this.c.arrastrando = false;
  }
}
// =========================================================
// SUBSISTEMA 3 (FUTURO)
// =========================================================

// --- CONCEPTO 7: INCERTIDUMBRE ---
class ConceptoIncertidumbre {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.ultimoResultadoSoltar = -1; 
    this.reset();
  }
  reset() {
    let cx = width / 2; let cy = height / 2; let R = this.tB * 0.8; 
    this.f0 = new Circulo(cx, cy - R, this.tB * 0.75, COLORES[0], 1); this.f0.idActor = 0;
    this.f1 = new Circulo(cx - R * 0.866, cy + R * 0.5, this.tB * 1.20, COLORES[1], 0); this.f1.idActor = 1;
    this.f2 = new Circulo(cx + R * 0.866, cy + R * 0.5, this.tB * 0.95, COLORES[2], 2); this.f2.idActor = 2;
    this.figuras = [this.f0, this.f1, this.f2];
    this.figActiva = null; this.framesArrastrando = 0; this.idOriginalArrastrado = -1; this.idMutadoArrastrado = -1;
    this.lastTx = 0; this.lastTy = 0; this.tiempoInicio = millis();
  }
  update() {
    if (millis() - this.tiempoInicio > 30000) this.reset();
    for (let f of this.figuras) {
      let m = f.tam / 2; f.x = constrain(f.x, m, width - m); f.y = constrain(f.y, m, height - m);
    }
  }
  display() { 
    let inactivos = this.figuras.filter(f => f !== this.figActiva);
    inactivos.sort((a, b) => {
      let pesoA = a.idActor === 1 ? 0 : (a.idActor === 2 ? 1 : 2);
      let pesoB = b.idActor === 1 ? 0 : (b.idActor === 2 ? 1 : 2);
      return pesoA - pesoB;
    });
    
    let drawOrder = [...inactivos];
    if (this.figActiva) drawOrder.push(this.figActiva);

    for (let f of drawOrder) { 
      let offsetX = 0; let offsetY = 0;
      if (this.figActiva !== f) {
        offsetX = sin(millis() * 0.004 + f.idActor) * 12;
        offsetY = cos(millis() * 0.005 + f.idActor) * 12;
      }
      push(); translate(offsetX, offsetY); f.display(); pop();
    } 
  }
  presionar(tx, ty) {
    let hitOrder = [...this.figuras].sort((a, b) => {
      let pesoA = a.idActor === 1 ? 0 : (a.idActor === 2 ? 1 : 2);
      let pesoB = b.idActor === 1 ? 0 : (b.idActor === 2 ? 1 : 2);
      return pesoB - pesoA;
    });
    
    for (let f of hitOrder) {
      if (f.tocando(tx, ty)) {
        this.figActiva = f; this.idOriginalArrastrado = f.idActor; this.idMutadoArrastrado = f.idActor;
        this.framesArrastrando = 0; this.lastTx = tx; this.lastTy = ty; this.tiempoInicio = millis();
        break;
      }
    }
  }
  arrastrar(tx, ty) {
    if (this.figActiva) {
      let dx = tx - this.lastTx; let dy = ty - this.lastTy;
      this.figActiva.x += dx; this.figActiva.y += dy;
      this.lastTx = tx; this.lastTy = ty;
      this.framesArrastrando++;
      if (this.framesArrastrando === 3) {
        if (random() < 0.8) {
          let otrosIDs = [0, 1, 2].filter(id => id !== this.idOriginalArrastrado);
          this.idMutadoArrastrado = random(otrosIDs);
          this.aplicarIdentidad(this.figActiva, this.idMutadoArrastrado);
        }
      }
    }
  }
  soltar() {
    if (this.figActiva) {
      let posiblesResultados = [0, 1, 2].filter(r => r !== this.ultimoResultadoSoltar);
      let resultado = random(posiblesResultados); this.ultimoResultadoSoltar = resultado; let finalId;
      if (resultado === 0) finalId = this.idMutadoArrastrado;
      else if (resultado === 1) finalId = this.idOriginalArrastrado;
      else {
        let restantes = [0, 1, 2].filter(id => id !== this.idOriginalArrastrado && id !== this.idMutadoArrastrado);
        finalId = random(restantes);
      }
      this.aplicarIdentidad(this.figActiva, finalId);
      this.figActiva = null;
    }
  }
  aplicarIdentidad(figura, id) {
    figura.idActor = id;
    if (id === 0) { figura.color = COLORES[0]; figura.estilo = 1; }
    else if (id === 1) { figura.color = COLORES[1]; figura.estilo = 0; }
    else if (id === 2) { figura.color = COLORES[2]; figura.estilo = 2; }
  }
}

// --- CONCEPTO 8: ANSIEDAD ---
class ConceptoAnsiedad {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.primerIntento = true;
    this.reset();
  }
  
  reset() {
    let tamInicial = this.tB * 2.5;
    let radio = tamInicial / 2;

    // MARGENES STRICTOS: 
    // Aseguran que todo el borde del círculo quede dentro de la pantalla (0% tapado)
    let minX = radio;
    let maxX = width - radio;
    let minY = radio;
    let maxY = height - radio;

    if (this.primerIntento) {
      this.cx = width / 2; 
      this.cy = height / 2; 
      this.primerIntento = false;
    } else {
      // Si el tamaño del círculo es mayor a la pantalla, se centra
      this.cx = (maxX > minX) ? random(minX, maxX) : width / 2; 
      this.cy = (maxY > minY) ? random(minY, maxY) : height / 2;
    }

    this.b = new Circulo(this.cx, this.cy, tamInicial, COLORES[1], 0); 
    this.a = new Circulo(this.cx - this.tB * 0.3, this.cy, this.tB * 0.35, COLORES[0], 1); 
    this.a.idActor = 0;
    this.c = new Circulo(this.cx + this.tB * 0.3, this.cy, this.tB * 0.45, COLORES[2], 2); 
    this.c.idActor = 2;
    
    let speed = min(width, height) * 0.005; 
    let angA = random(TWO_PI);
    this.a.vx = cos(angA) * speed; 
    this.a.vy = sin(angA) * speed;
    
    let angC = random(TWO_PI);
    this.c.vx = cos(angC) * speed; 
    this.c.vy = sin(angC) * speed;
    
    this.fase = 0; 
    this.timeStart = millis(); 
    this.deadTime = 0;
  }
  
  update() {
    if (this.fase === 0) {
      let elapsed = (millis() - this.timeStart) / 1000; 
      let shrinkRate = 2.0 + (elapsed * 1.5); 
      this.b.tam -= shrinkRate;
      
      if (this.b.tam <= 0) {
        this.b.tam = 0; 
        this.fase = 1; 
        this.deadTime = millis();
      } else {
        let dx = this.c.x - this.a.x; 
        let dy = this.c.y - this.a.y;
        let distAC = sqrt(dx*dx + dy*dy); 
        let minF = (this.a.tam / 2 + this.c.tam / 2);
        
        if (distAC < minF && distAC > 0) {
          let nx = dx / distAC; 
          let ny = dy / distAC; 
          let overlap = minF - distAC;
          this.a.x -= nx * overlap / 2; 
          this.a.y -= ny * overlap / 2;
          this.c.x += nx * overlap / 2; 
          this.c.y += ny * overlap / 2;
          let auxVx = this.a.vx; 
          let auxVy = this.a.vy;
          this.a.vx = this.c.vx; 
          this.a.vy = this.c.vy; 
          this.c.vx = auxVx; 
          this.c.vy = auxVy;
        }
        this.updateInner(this.a); 
        this.updateInner(this.c);
      }
    } else if (this.fase === 1) {
      if (millis() - this.deadTime > 2000) this.reset();
    }
  }
  
  updateInner(fig) {
    fig.x += fig.vx; 
    fig.y += fig.vy;
    
    let proporcion = fig.estilo === 1 ? 0.14 : 0.18; 
    let targetTam = this.b.tam * proporcion;
    fig.tam = lerp(fig.tam, max(0, targetTam), 0.25); 
    
    let dx = fig.x - this.cx; 
    let dy = fig.y - this.cy;
    let distCenter = sqrt(dx*dx + dy*dy); 
    let maxDist = (this.b.tam / 2) - (fig.tam / 2);
    
    if (maxDist <= 0) {
      fig.x = this.cx; 
      fig.y = this.cy;
    } else if (distCenter > maxDist) {
      let nx = dx / distCenter; 
      let ny = dy / distCenter;
      fig.x = this.cx + nx * maxDist; 
      fig.y = this.cy + ny * maxDist;
      
      let dot = fig.vx * nx + fig.vy * ny;
      fig.vx -= 2 * dot * nx; 
      fig.vy -= 2 * dot * ny;
    }
    
    let speed = dist(0, 0, fig.vx, fig.vy);
    let targetSpeed = min(width, height) * 0.005;
    if (speed > 0) { 
      fig.vx = (fig.vx / speed) * targetSpeed; 
      fig.vy = (fig.vy / speed) * targetSpeed; 
    }
  }
  
  display() {
    if (this.fase === 0) { 
      this.b.display(); 
      this.c.display(); 
      this.a.display(); 
    }
  }
  
  presionar(tx, ty) {
    if (this.fase === 0) {
      let d = dist(tx, ty, this.cx, this.cy);
      if (d < this.b.tam / 2) { 
        this.b.tam = min(this.tB * 2.5, this.b.tam + this.tB * 0.25); 
      }
    }
  }

  arrastrar(tx, ty) {} 
  soltar() {}
}
// --- CONCEPTO 9: EXPECTATIVA ---
class ConceptoExpectativa {
  constructor() {
    this.tB = min(width, height) * 0.35;
    this.reset();
  }

  reset() {
    let pos0 = { x: width * 0.28, y: height * 0.35 }; 
    let pos1 = { x: width * 0.68, y: height * 0.42 }; 
    let pos2 = { x: width * 0.38, y: height * 0.72 }; 

    let tamChico = this.tB * 0.75;
    let tamMediano = this.tB * 0.95;
    let tamGrande = this.tB * 1.20;

    this.cNegro = { id: 0, x: pos0.x, y: pos0.y, tamBase: tamChico, escala: 1.0, zIndex: 3 };
    this.cAzul = { id: 1, x: pos1.x, y: pos1.y, tamBase: tamGrande, escala: 1.0, zIndex: 1 };
    this.cRojo = { id: 2, x: pos2.x, y: pos2.y, tamBase: tamMediano, escala: 1.0, zIndex: 2 };

    let figuras = [this.cNegro, this.cAzul, this.cRojo];

    for (let f of figuras) {
      let menorDistanciaTope = Infinity;
      for (let otra of figuras) {
        if (f.id !== otra.id) {
          let d = dist(f.x, f.y, otra.x, otra.y);
          let radioPermitido = d - 0.7 * (otra.tamBase / 2);
          let escPermitida = (radioPermitido * 2) / f.tamBase;
          if (escPermitida < menorDistanciaTope) menorDistanciaTope = escPermitida;
        }
      }
      f.escalaMax = max(1.2, menorDistanciaTope);
    }
    this.distPellizcoInicial = null;
    this.circuloSeleccionado = null;
  }

  update() {
    this.cNegro.escala = constrain(this.cNegro.escala, 0.3, this.cNegro.escalaMax);
    this.cAzul.escala = constrain(this.cAzul.escala, 0.3, this.cAzul.escalaMax);
    this.cRojo.escala = constrain(this.cRojo.escala, 0.3, this.cRojo.escalaMax);
  }

  display() {
    let ordenadas = [this.cNegro, this.cAzul, this.cRojo].sort((a, b) => a.zIndex - b.zIndex);
    
    for (let fig of ordenadas) {
      let offsetX = 0; let offsetY = 0;
      if (this.circuloSeleccionado !== fig) {
        offsetX = sin(millis() * 0.004 + fig.id) * 12; offsetY = cos(millis() * 0.005 + fig.id) * 12;
      }
      if (fig.id === 0) this.dibujarNegro(fig, offsetX, offsetY);
      else if (fig.id === 1) this.dibujarAzul(fig, offsetX, offsetY);
      else if (fig.id === 2) this.dibujarRojo(fig, offsetX, offsetY);
    }
  }

  dibujarNegro(fig, offsetX, offsetY) {
    let tam = fig.tamBase * fig.escala; let grosor = map(fig.escala, 0.3, fig.escalaMax, 10, 1);
    push(); translate(fig.x + offsetX, fig.y + offsetY); noFill(); stroke(COLORES[0]); strokeWeight(grosor); drawingContext.setLineDash([]); circle(0, 0, tam); pop();
  }

  dibujarAzul(fig, offsetX, offsetY) {
    let tam = fig.tamBase * fig.escala;

    // Opacidad reactiva al tamaño del círculo azul
    let alpha = map(fig.escala, 0.3, fig.escalaMax, 290, 50, true);

    push(); 
    translate(fig.x + offsetX, fig.y + offsetY); 

    let c = color(COLORES[1]);
    c.setAlpha(alpha);

    fill(c); 
    noStroke(); 
    drawingContext.setLineDash([]); 
    circle(0, 0, tam); 
    pop();
  }

  dibujarRojo(fig, offsetX, offsetY) {
    let tam = fig.tamBase * fig.escala; let numeroGuiones = map(fig.escala, 0.3, fig.escalaMax, 36, 6);
    let perimetro = PI * tam; let largoLid = perimetro / (numeroGuiones * 2);
    push(); translate(fig.x + offsetX, fig.y + offsetY); noFill(); stroke(COLORES[2]); strokeWeight(4); drawingContext.setLineDash([largoLid, largoLid]); circle(0, 0, tam); pop();
  }

  enfocarFigura(fig) {
    if (!fig) return;
    this.cAzul.zIndex = 1; this.cRojo.zIndex = 2; this.cNegro.zIndex = 3;
    fig.zIndex = 10;
  }

  obtenerCirculoBajoPuntero(x, y) {
    let figuras = [this.cNegro, this.cAzul, this.cRojo].sort((a, b) => b.zIndex - a.zIndex);
    for (let f of figuras) {
      if (dist(x, y, f.x, f.y) < (f.tamBase * f.escala) / 2 + 15) return f;
    }
    return null;
  }

  manejarRueda(mx, my, delta) {
    let c = this.obtenerCirculoBajoPuntero(mx, my);
    if (c) { this.enfocarFigura(c); c.escala += delta * 0.001; }
  }

  arrastrar(tx, ty) {
    if (touches.length === 2) {
      let centroX = (touches[0].x + touches[1].x) / 2; let centroY = (touches[0].y + touches[1].y) / 2;
      let d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);

      if (this.distPellizcoInicial === null) {
        this.distPellizcoInicial = d;
        this.circuloSeleccionado = this.obtenerCirculoBajoPuntero(centroX, centroY);
        this.enfocarFigura(this.circuloSeleccionado);
      } else if (this.circuloSeleccionado) {
        let cambio = d - this.distPellizcoInicial;
        this.circuloSeleccionado.escala -= cambio * 0.005;
        this.distPellizcoInicial = d;
      }
    }
  }
  presionar(tx, ty) {}
  soltar() { this.distPellizcoInicial = null; this.circuloSeleccionado = null; }
}
