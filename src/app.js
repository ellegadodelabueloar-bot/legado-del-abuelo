(function(){
  "use strict";

  /* ====== DATOS ======
     WPP: número de WhatsApp con código de país, sin + ni espacios (ej "5491122334455").
     Mientras esté vacío, los botones de pedido llevan a Instagram. */
  var WPP = "541169387182";

  var FLAVORS = [
    { id:"honey", name:"Honey", sub:"Mostaza con miel", price:"12000",
      accent:"#C6822E", pat:"#E0A64E", bg1:"#55321A", bg2:"#2A190C", ink:"#C6822E", panel:"#38230F",
      desc:"Dulce primero, mostaza después. La miel redondea el filo de la semilla y deja un final tibio, casi acaramelado.",
      heat:1, pairs:["Pollo al horno","Papas rústicas","Sándwich de cerdo","Aderezo de ensalada"] },
    { id:"suave", name:"Suave", sub:"La de todos los días", price:"10500",
      accent:"#D8C39E", pat:"#E8DAB8", bg1:"#4F4527", bg2:"#241D10", ink:"#D8C39E", panel:"#33301B",
      desc:"Equilibrada y cremosa, con la semilla entera bien a la vista. No pica: acompaña sin tapar lo que tenés en el plato.",
      heat:2, pairs:["Milanesas","Hamburguesas","Panchos","Picada"] },
    { id:"picante", name:"Picante", sub:"Con ají y pimentón", price:"10500",
      accent:"#78120B", pat:"#B8402C", bg1:"#521510", bg2:"#240806", ink:"#C2452F", panel:"#3A1109",
      desc:"Arranca como mostaza y termina como ají. El calor sube sobre el final y se queda un rato largo.",
      heat:5, pairs:["Asado","Provoleta","Chorizo","Quesos duros"] },
    { id:"antigua", name:"Antigua", sub:"La de grano entero", price:"12000",
      accent:"#8A5A2B", pat:"#C79552", bg1:"#4A3216", bg2:"#241708", ink:"#C79552", panel:"#3A2712",
      desc:"Grano entero, como se hacía antes de que existiera la industrial: la semilla no se muele del todo, así que cada cucharada trae textura y un sabor más rústico.",
      heat:2, pairs:["Quesos duros","Fiambres","Pan casero","Ensaladas tibias"] }
  ];
  var N = FLAVORS.length;

  var COMBO = { name:"Combo Degustación", price:"25000",
    desc:"Las tres variedades clásicas juntas: Honey, Suave y Picante, 150 g cada una. Para probarlas todas o para regalar." };

  var BUILDER_TIERS = [ { min:5, pct:15 }, { min:3, pct:10 } ]; // orden de mayor a menor umbral
  var BUILDER_MIN = 3;

  function wppLink(f){
    var msg = f ? "Hola! Quiero pedir la Mostaza " + f.name + " (150 g)." : "Hola! Quiero hacer un pedido.";
    return WPP ? "https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg)
               : "https://instagram.com/legadodelabuelo.ar";
  }
  function comboLink(){
    var msg = "Hola! Quiero pedir el " + COMBO.name + " (Honey + Suave + Picante, 150 g c/u).";
    return WPP ? "https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg)
               : "https://instagram.com/legadodelabuelo.ar";
  }
  var CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.3a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>';
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.6 4c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z"/></svg>';
  var IG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>';

  var $ = function(s){ return document.querySelector(s); };

  /* ====== GRANOS SOBRE LA MONTAÑA ====== */
  function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function scatter(target, count, seed, baseY, amp, spread, depth){
    var r = rng(seed), out = "";
    for (var i = 0; i < count; i++){
      var x = -40 + r() * 1580;
      var hill = baseY - amp * Math.exp(-Math.pow((x - 750) / spread, 2));
      var y = hill + Math.pow(r(), 1.7) * depth + 3;
      var rx = 2.6 + r() * 3.2;
      out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + rx.toFixed(1) +
             '" ry="' + (rx * 0.86).toFixed(1) + '" opacity="' + (0.28 + r() * 0.42).toFixed(2) + '"/>';
    }
    target.innerHTML = out;
  }
  scatter($("#seedsBack"), 200, 7, 300, 210, 420, 96);
  scatter($("#seedsFront"), 160, 23, 300, 130, 500, 70);

  /* ====== CARRUSEL ORBITAL ====== */
  var orbit = $("#orbit"), namelayer = $("#namelayer"), stage = $("#stage"),
      frame = $("#frame"), ticket = $("#ticket"), ticketPrice = $("#ticketPrice"), ticketCta = $("#ticketCta");
  var framePattern = frame.querySelector(".pattern");
  var items = [], names = [];

  FLAVORS.forEach(function(f, i){
    var el = document.createElement("div");
    el.className = "item";
    el.innerHTML = '<div class="card"></div><div class="jarwrap"><img class="jar" src="assets/jars/' + f.id +
                   '.png" alt="Frasco de Mostaza ' + f.name + ' de 150 gramos" draggable="false"></div>' +
                   '<button class="hit" type="button" aria-label="Ver Mostaza ' + f.name + '"></button>';
    el.querySelector(".hit").addEventListener("click", function(){ if (!dragged) goTo(i); });
    orbit.appendChild(el);
    items.push({ el: el, card: el.querySelector(".card") });

    var n = document.createElement("div");
    n.className = "fname"; n.textContent = f.name;
    namelayer.appendChild(n); names.push(n);
  });

  var idx = 0, target = 0, dragging = false, dragged = false, startX = 0, startIdx = 0, raf = 0;

  function shortest(d){ d = ((d % N) + N) % N; return d > N / 2 ? d - N : d; }
  function mix(a, b, t){
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round((pa >> 16 & 255) + ((pb >> 16 & 255) - (pa >> 16 & 255)) * t);
    var g = Math.round((pa >> 8 & 255) + ((pb >> 8 & 255) - (pa >> 8 & 255)) * t);
    var bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  var measure = $("#measure");
  function geom(){
    var r = measure.getBoundingClientRect();
    return { rx: r.width || 300, ry: r.height || 180 };
  }
  var G = geom();
  addEventListener("resize", function(){ G = geom(); render(); });

  var ANG = 0.92; // radianes entre posiciones vecinas

  function render(){
    items.forEach(function(it, i){
      var t = shortest(i - idx);
      var a = t * ANG;
      var x = Math.sin(a) * G.rx;
      var y = (1 - Math.cos(a)) * G.ry;
      var k = Math.min(Math.abs(t), 1);
      var scale = 1 - 0.63 * k;
      var fade = Math.abs(t) > 1.12 ? Math.max(0, 1 - (Math.abs(t) - 1.12) * 2.6) : 1;
      it.el.style.transform = "translate(-50%,-50%) translate(" + x.toFixed(1) + "px," + y.toFixed(1) +
                              "px) rotate(" + (t * 11).toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      it.el.style.opacity = fade;
      it.el.style.zIndex = Math.abs(t) < 0.38 ? 5 : 8;
      it.card.style.opacity = (k * k).toFixed(3);
      names[i].style.opacity = (Math.max(0, 1 - k * 1.45) * fade).toFixed(3);
      names[i].style.transform = "translate(-50%,-50%) translateX(" + (x * 0.35).toFixed(1) + "px)";
    });

    // color de fondo mezclado entre las dos variedades más cercanas
    var lo = Math.floor(((idx % N) + N) % N), frac = (((idx % N) + N) % N) - lo;
    var A = FLAVORS[lo % N], B = FLAVORS[(lo + 1) % N];
    frame.style.setProperty("--acento", mix(A.accent, B.accent, frac));
    frame.style.setProperty("--fondo-1", mix(A.bg1, B.bg1, frac));
    frame.style.setProperty("--fondo-2", mix(A.bg2, B.bg2, frac));
    framePattern.style.color = mix(A.pat, B.pat, frac);
  }

  function settle(){
    var f = FLAVORS[((Math.round(target) % N) + N) % N];
    ticketPrice.textContent = f.price ? "$" + f.price : "Consultar";
    ticketCta.href = wppLink(f);
    ticketCta.setAttribute("aria-label", "Pedir Mostaza " + f.name);
    stage.setAttribute("aria-activedescendant", "");
  }
  function goTo(i){
    target = idx + shortest(i - idx);
    stage.classList.remove("no-anim");
    idx = target; render(); settle();
  }
  function step(d){ goTo(((Math.round(idx) + d) % N + N) % N); }

  $("#next").addEventListener("click", function(){ step(1); });
  $("#prev").addEventListener("click", function(){ step(-1); });
  stage.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight"){ e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft"){ e.preventDefault(); step(-1); }
  });

  stage.addEventListener("pointerdown", function(e){
    if (e.target.closest(".arrows") || e.target.closest("a")) return;
    dragging = true; dragged = false; startX = e.clientX; startIdx = idx;
    stage.classList.add("no-anim"); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", function(e){
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 5) dragged = true;
    idx = startIdx - dx / 230;
    if (!raf) raf = requestAnimationFrame(function(){ raf = 0; render(); });
  });
  function endDrag(){
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("no-anim");
    target = Math.round(idx); idx = target; render(); settle();
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  var wheelAcc = 0, wheelTimer = 0;
  stage.addEventListener("wheel", function(e){
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (!d) return;
    e.preventDefault(); wheelAcc += d;
    clearTimeout(wheelTimer);
    if (Math.abs(wheelAcc) > 60){ step(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
    wheelTimer = setTimeout(function(){ wheelAcc = 0; }, 220);
  }, { passive: false });

  render(); settle();

  /* ====== FICHAS ====== */
  $("#fichas").innerHTML = FLAVORS.map(function(f){
    var dots = "";
    for (var i = 1; i <= 5; i++) dots += '<i class="' + (i <= f.heat ? "on" : "") + '"></i>';
    return '<article class="ficha" style="--fbg:' + f.bg1 + ';--fink:' + f.ink + ';--panel:' + f.panel + '">' +
      '<div class="top"><div class="pat tile" aria-hidden="true"></div>' +
        '<img src="assets/jars/' + f.id + '.png" alt="Frasco de Mostaza ' + f.name + '"></div>' +
      '<div class="body"><h3>' + f.name + '</h3><div class="sub">' + f.sub + '</div>' +
        '<p>' + f.desc + '</p>' +
        '<div class="escala">Picor<span class="dots">' + dots + '</span>' + f.heat + ' de 5</div>' +
        '<ul class="marida">' + f.pairs.map(function(p){ return "<li>" + p + "</li>"; }).join("") + '</ul>' +
        '<div class="cta"><a class="btn" href="' + wppLink(f) + '" target="_blank" rel="noopener">' +
          (WPP ? WA_ICON : IG_ICON) + "Pedir la " + f.name + '</a></div>' +
      '</div></article>';
  }).join("");

  $("#combo").innerHTML =
    '<article class="combo">' +
      '<div class="combo-jars">' +
        FLAVORS.map(function(f){ return '<img src="assets/jars/' + f.id + '.png" alt="Frasco de Mostaza ' + f.name + '">'; }).join("") +
      '</div>' +
      '<div class="combo-body">' +
        '<p class="eyebrow">Las tres juntas</p>' +
        '<h3>' + COMBO.name + '</h3>' +
        '<p>' + COMBO.desc + '</p>' +
        '<div class="combo-price">$' + COMBO.price + '</div>' +
        '<a class="btn" href="' + comboLink() + '" target="_blank" rel="noopener">' +
          (WPP ? WA_ICON : IG_ICON) + 'Pedir el combo</a>' +
      '</div>' +
    '</article>';

  $("#acciones").innerHTML =
    '<a class="btn" href="' + wppLink(null) + '" target="_blank" rel="noopener">' +
      (WPP ? WA_ICON + "Escribir por WhatsApp" : IG_ICON + "Escribir por Instagram") + '</a>' +
    '<a class="btn ghost" href="#catalogo">' + CART_ICON + 'Ver las mostazas</a>' +
    (WPP ? "" : '<div style="flex-basis:100%"><span class="pendiente">Falta cargar el número de WhatsApp</span></div>');

  /* ====== ARMÁ TU COMBO ====== */
  var builderQty = {};
  FLAVORS.forEach(function(f){ builderQty[f.id] = 0; });

  $("#armadorItems").innerHTML = FLAVORS.map(function(f){
    return '<div class="aitem" style="--facc:' + f.accent + '">' +
      '<img src="assets/jars/' + f.id + '.png" alt="Frasco de Mostaza ' + f.name + '">' +
      '<div class="ainfo"><h4>' + f.name + '</h4><div class="aprice">$' + f.price + '</div></div>' +
      '<div class="acount">' +
        '<button type="button" class="adec" data-id="' + f.id + '" aria-label="Sacar un frasco de ' + f.name + '">−</button>' +
        '<span class="aqty" id="aqty-' + f.id + '">0</span>' +
        '<button type="button" class="ainc" data-id="' + f.id + '" aria-label="Sumar un frasco de ' + f.name + '">+</button>' +
      '</div></div>';
  }).join("");

  var arCount = $("#arCount"), arSubtotal = $("#arSubtotal"), arDiscLine = $("#arDiscLine"),
      arPct = $("#arPct"), arDiscAmt = $("#arDiscAmt"), arTotal = $("#arTotal"),
      arCta = $("#arCta"), arHint = $("#arHint");

  function builderTotals(){
    var count = 0, subtotal = 0;
    FLAVORS.forEach(function(f){
      var q = builderQty[f.id] || 0;
      count += q; subtotal += q * (parseInt(f.price, 10) || 0);
    });
    var tier = null;
    for (var i = 0; i < BUILDER_TIERS.length; i++){ if (count >= BUILDER_TIERS[i].min){ tier = BUILDER_TIERS[i]; break; } }
    var pct = tier ? tier.pct : 0;
    var total = Math.round(subtotal * (1 - pct / 100));
    return { count: count, subtotal: subtotal, pct: pct, total: total };
  }

  function builderLink(t){
    var parts = [];
    FLAVORS.forEach(function(f){
      var q = builderQty[f.id] || 0;
      if (q > 0) parts.push(q + " " + f.name);
    });
    var msg = "Hola! Quiero armar mi combo: " + parts.join(", ") + " (150 g c/u). Total: $" + t.total +
      (t.pct ? " (con " + t.pct + "% off)." : ".");
    return WPP ? "https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg)
               : "https://instagram.com/legadodelabuelo.ar";
  }

  function renderArmador(){
    var t = builderTotals();
    arCount.textContent = t.count;
    arSubtotal.textContent = "$" + t.subtotal;
    if (t.pct){
      arDiscLine.hidden = false;
      arPct.textContent = t.pct + "%";
      arDiscAmt.textContent = "$" + (t.subtotal - t.total);
    } else {
      arDiscLine.hidden = true;
    }
    arTotal.textContent = "$" + t.total;
    var ok = t.count >= BUILDER_MIN;
    arCta.href = ok ? builderLink(t) : "javascript:void(0)";
    arCta.setAttribute("aria-disabled", ok ? "false" : "true");
    arCta.textContent = ok ? "Pedir mi combo" : "Pedir mi combo";
    if (ok){ arHint.hidden = true; }
    else { arHint.hidden = false; arHint.textContent = "Sumá " + (BUILDER_MIN - t.count) + " frasco" + (BUILDER_MIN - t.count === 1 ? "" : "s") + " más para armar el combo (mínimo " + BUILDER_MIN + ")."; }
  }

  $("#armadorItems").addEventListener("click", function(e){
    var btn = e.target.closest("button");
    if (!btn) return;
    var id = btn.dataset.id, cur = builderQty[id] || 0;
    if (btn.classList.contains("ainc")) builderQty[id] = cur + 1;
    if (btn.classList.contains("adec")) builderQty[id] = Math.max(0, cur - 1);
    $("#aqty-" + id).textContent = builderQty[id];
    renderArmador();
  });

  renderArmador();

  /* ====== NAV ====== */
  Array.prototype.forEach.call(document.querySelectorAll("[data-go]"), function(b){
    b.addEventListener("click", function(){
      var el = document.getElementById(b.dataset.go);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  var navBtns = document.querySelectorAll("[data-go]");
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(navBtns, function(b){
          b.setAttribute("aria-current", b.dataset.go === en.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["inicio","herencia","catalogo","armador","adentro","pedido"].forEach(function(id){
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  /* ====== SELECTOR DE TIPOGRAFIA ====== */
  var fbtns = document.querySelectorAll(".fontbar button");
  function setFont(v){
    document.documentElement.setAttribute("data-font", v);
    Array.prototype.forEach.call(fbtns, function(b){
      b.setAttribute("aria-pressed", b.dataset.font === v ? "true" : "false");
    });
    try { localStorage.setItem("lda-font", v); } catch (e) {}
  }
  Array.prototype.forEach.call(fbtns, function(b){
    b.addEventListener("click", function(){ setFont(b.dataset.font); });
  });
  try {
    var saved = localStorage.getItem("lda-font");
    if (saved) setFont(saved); else document.documentElement.setAttribute("data-font", "manual");
  } catch (e) { document.documentElement.setAttribute("data-font", "manual"); }
})();
