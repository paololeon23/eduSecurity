/**
 * eduSegurity — catálogo, carrito detallado, pago por WhatsApp
 */
(function () {
  "use strict";

  /** Número país + celular (solo dígitos, sin +) — Perú */
  const WA_NUMBER = "51913420257";
  const BRAND = "eduSegurity";

  /** Precios siempre expresados en soles (PEN) */
  const money = (n) => {
    const v = Math.round(Number(n) * 100) / 100;
    const num = v.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `S/ ${num} soles`;
  };

  const SHIPPING_NOTE = "Envíos coordinados a nivel nacional en todo el Perú.";

  function waUrl(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function openWhatsApp(text) {
    /* Misma pestaña: en móvil, _blank deja una pestaña vacía (about:blank) al abrir la app */
    window.location.assign(waUrl(text));
  }

  /** Fotos locales en /img · campo ref solo uso interno / compatibilidad */
  const products = [
    {
      id: "casco",
      ref: "EDU-HS-701",
      name: "Casco de seguridad",
      price: 89.9,
      badge: "OFERTA",
      image: "img/Casco_de_seguridad.jpeg",
      normRef: "Referencia ANSI Z89.1 Type I · CE EN 397 (según fabricante)",
      conformidad:
        "DAC y ficha técnica disponibles con el pedido.",
      description:
        "Casco industrial, suspensión 6 puntos, barboquejo y ventilación superior. Para minería, obra y planta.",
      options: [
        {
          key: "color",
          label: "Color",
          choices: ["Amarillo seguridad", "Blanco", "Naranja alta visibilidad"],
        },
        {
          key: "talla",
          label: "Talla",
          choices: ["M", "L", "XL"],
        },
      ],
    },
    {
      id: "guantes",
      ref: "EDU-GU-442",
      name: "Guantes industriales",
      price: 34.5,
      badge: "OFERTA",
      image: "img/Guantes_industriales_en_estudio.jpeg",
      normRef:
        "Nivel de desempeño según marcado EN 388 en empaque.",
      conformidad:
        "Lote fabricación y SDS del polímero bajo solicitud.",
      description:
        "Nitrilo reforzado, buen agarre en seco y húmedo. Mantenimiento, logística y manipulación general.",
      options: [
        { key: "talla", label: "Talla", choices: ["S", "M", "L", "XL"] },
        {
          key: "acabado",
          label: "Acabado",
          choices: ["Nitrilo", "Látex", "PU"],
        },
      ],
    },
    {
      id: "chaleco",
      ref: "EDU-CH-883",
      name: "Chaleco reflectivo",
      price: 48.0,
      badge: "OFERTA",
      image: "img/Chaleco_reflectivo_industrial.jpeg",
      normRef: "ANSI/ISEA 107-2015 Clase 2 · bandas retroreflectivas",
      conformidad: "DAC de producto alta visibilidad con envío.",
      description:
        "Chaleco alta visibilidad con bolsillo y cierre frontal. Brigadas de tráfico, almacenes y obra.",
      options: [
        { key: "talla", label: "Talla", choices: ["S/M", "L/XL", "2XL"] },
        {
          key: "banda",
          label: "Banda",
          choices: ["Amarillo fluor", "Naranja fluor"],
        },
      ],
    },
    {
      id: "botas",
      ref: "EDU-BT-210",
      name: "Botas de seguridad",
      price: 189.0,
      badge: "OFERTA",
      image: "img/botas_boots_product.jpeg",
      normRef: "Marcado CE EN ISO 20345 S3 SRC (fabricante declarado)",
      conformidad:
        "Ficha técnica puntera y lámina anticorte adjunta.",
      description:
        "Puntera composite, plantilla antiperforación, suela SRC. Turnos prolongados sobre superficies húmedas.",
      options: [
        {
          key: "talla",
          label: "Talla EUR",
          choices: ["38", "39", "40", "41", "42", "43", "44"],
        },
      ],
    },
    {
      id: "lentes",
      ref: "EDU-LN-059",
      name: "Lentes de protección",
      price: 42.0,
      badge: "OFERTA",
      image: "img/Lentes_de_protección_industrial.jpeg",
      normRef: "EN 166 clasificación marcada en armação (fabricante)",
      conformidad:
        "Protección frente a impacto según marca en montura.",
      description:
        "Tratamiento anti-rayado y opción anti-empañante — laboratorio y taller.",
      options: [
        {
          key: "lente",
          label: "Lente",
          choices: ["Transparente", "Gris solar", "Ámbar"],
        },
      ],
    },
    {
      id: "botas-refuerzo",
      ref: "EDU-BT-211",
      name: "Botas de seguridad — línea reforzada",
      price: 199.0,
      badge: "OFERTA",
      image: "img/botas_boots_product.jpeg",
      normRef: "Marcado CE EN ISO 20345 S3 SRC (fabricante declarado)",
      conformidad:
        "Ficha técnica puntera y lámina anticorte adjunta.",
      description:
        "Misma imagen que nuestra línea estándar de botas; versión con refuerzos laterales y horma cómoda para turnos largos.",
      options: [
        {
          key: "talla",
          label: "Talla EUR",
          choices: ["38", "39", "40", "41", "42", "43", "44"],
        },
      ],
    },
  ];

  /** ------- DOM ------- */
  const productGrid = document.getElementById("productGrid");
  const modal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalMeta = document.getElementById("modalMeta");
  const modalDesc = document.getElementById("modalDesc");
  const modalOptions = document.getElementById("modalOptions");
  const modalAddCart = document.getElementById("modalAddCart");
  const modalBuy = document.getElementById("modalBuy");
  const modalQtyMinus = document.getElementById("modalQtyMinus");
  const modalQtyPlus = document.getElementById("modalQtyPlus");
  const modalQtyInput = document.getElementById("modalQtyInput");

  const navToggle = document.getElementById("navToggle");
  const cartTrigger = document.getElementById("cartTrigger");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartClose = document.getElementById("cartClose");
  const cartList = document.getElementById("cartList");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");
  const cartDrawerTitle = document.getElementById("cartDrawerTitle");
  const cartSummaryLine = document.getElementById("cartSummaryLine");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const toast = document.getElementById("toast");
  const contactForm = document.getElementById("contactForm");
  const formHint = document.getElementById("formHint");
  const yearEl = document.getElementById("year");

  const cartDock = document.getElementById("cartDock");
  const cartDockBtn = document.getElementById("cartDockBtn");
  const cartDockBadge = document.getElementById("cartDockBadge");
  const cartDockLine = document.getElementById("cartDockLine");
  const cartDockAmount = document.getElementById("cartDockAmount");
  const mqDock = window.matchMedia("(max-width: 768px)");

  let modalProductId = null;
  const modalSelections = {};
  /** @type {{ uid:string, id:string, ref:string, name:string, price:number, qty:number, image:string, subtitle:string, normRef:string }[]} */
  let cartItems = [];

  function $(sel, ctx = document) {
    return ctx.querySelector(sel);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.hidden = true;
      }, 400);
    }, 2100);
  }

  function getProduct(id) {
    return products.find((p) => p.id === id);
  }

  function optionSubtitle(p) {
    const parts = [];
    (p.options || []).forEach((g) => {
      const v = modalSelections[g.key];
      if (v) parts.push(`${g.label}: ${v}`);
    });
    return parts.join(" · ");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function fillModalMeta(p) {
    modalMeta.innerHTML =
      `<dt>Descripción</dt><dd>${escapeHtml(p.description)}</dd>` +
      `<dt>Precio</dt><dd>${money(p.price)}</dd>` +
      `<dt>Envío</dt><dd>${escapeHtml(SHIPPING_NOTE)}</dd>` +
      `<dt>Modelo</dt><dd>${escapeHtml(p.ref)}</dd>`;
    modalMeta.hidden = false;
  }

  function getModalQty() {
    const q = parseInt(modalQtyInput.value, 10);
    if (!Number.isFinite(q)) return 1;
    return Math.max(1, Math.min(999, q));
  }

  function setModalQty(q) {
    const v = Math.max(1, Math.min(999, Number(q) || 1));
    modalQtyInput.value = String(v);
  }

  /** WhatsApp: poca decoración · negritas *así* y viñetas (sin iconos) */
  function messageSingleProduct(p, qty) {
    const unit = Number(p.price);
    const sub = Math.round(unit * qty * 100) / 100;
    const lines = [`*${BRAND}*`, `*Pedido · ${qty} u.*`, ""];
    lines.push(`- *${p.name}*`, `  Modelo: ${p.ref}`);
    const optLine = optionSubtitle(p);
    if (optLine) {
      optLine.split(" · ").forEach((bit) => lines.push(`  ${bit.trim()}`));
    }
    lines.push(
      `  Cant.: ${qty}`,
      `  P. unit.: ${money(unit)}`,
      `  Subtotal: ${money(sub)}`
    );
    lines.push("", "*Total (soles):*", money(sub));
    return lines.join("\n");
  }

  function messageCart() {
    const units = cartTotalUnits();
    const parts = [
      `*${BRAND}*`,
      `*Pedido · ${units} u.*`,
      "",
    ];
    cartItems.forEach((i) => {
      const q = Number(i.qty) || 1;
      const sub = Math.round(Number(i.price) * q * 100) / 100;
      parts.push(`- *${i.name}*`, `  Modelo: ${i.ref}`);
      if (i.subtitle) {
        i.subtitle.split(" · ").forEach((line) => parts.push(`  ${line.trim()}`));
      }
      parts.push(
        `  Cant.: ${q}`,
        `  P. unit.: ${money(i.price)}`,
        `  Subtotal: ${money(sub)}`,
        ""
      );
    });
    parts.push("*Total (soles):*", money(cartTotalNumber()));
    return parts.join("\n");
  }

  function cartTotalUnits() {
    return cartItems.reduce((s, i) => s + (Number(i.qty) || 1), 0);
  }

  function cartTotalNumber() {
    const raw = cartItems.reduce(
      (s, i) => s + Number(i.price) * (Number(i.qty) || 1),
      0
    );
    return Math.round(raw * 100) / 100;
  }

  function syncCartDock() {
    if (!cartDock) return;
    const lines = cartItems.length;
    const units = cartTotalUnits();
    const showDock = mqDock.matches && lines > 0;
    cartDock.hidden = !showDock;
    document.body.classList.toggle("has-cart-dock", showDock);

    if (!showDock) {
      cartDock.classList.remove("cart-dock--pulse");
      return;
    }

    cartDockBtn.setAttribute(
      "aria-label",
      `Carrito: ${units} unidad${units === 1 ? "" : "es"}. Total ${money(
        cartTotalNumber()
      )}. Abrir para ver el detalle.`
    );
    cartDockBadge.textContent = String(units);
    cartDockAmount.textContent = money(cartTotalNumber());
    cartDockLine.textContent =
      units === 1
        ? "1 unidad · abre para ver los detalles"
        : `${units} unidades · abre para ver los detalles`;
  }

  function pulseCartDock() {
    if (!cartDock || cartDock.hidden) return;
    cartDock.classList.remove("cart-dock--pulse");
    void cartDock.offsetWidth;
    cartDock.classList.add("cart-dock--pulse");
    window.clearTimeout(pulseCartDock._t);
    pulseCartDock._t = window.setTimeout(() => {
      cartDock.classList.remove("cart-dock--pulse");
    }, 650);
  }

  function openModal(productId) {
    const p = getProduct(productId);
    if (!p) return;
    modalProductId = productId;
    Object.keys(modalSelections).forEach((k) => delete modalSelections[k]);

    modalImg.src = p.image;
    modalImg.alt = p.name;
    modalTitle.textContent = p.name;
    modalPrice.textContent = money(p.price);
    modalDesc.textContent = "";
    modalDesc.hidden = true;
    fillModalMeta(p);
    modalOptions.innerHTML = "";
    setModalQty(1);

    (p.options || []).forEach((group) => {
      const first = group.choices[0];
      modalSelections[group.key] = first;

      const wrap = document.createElement("div");
      wrap.className = "option-group";
      wrap.innerHTML =
        `<span class="option-group__label">${group.label}</span><div class="chip-row" role="group" aria-label="${group.label}"></div>`;
      const row = $(".chip-row", wrap);
      group.choices.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (c === first ? " is-selected" : "");
        b.textContent = c;
        b.addEventListener("click", () => {
          modalSelections[group.key] = c;
          row.querySelectorAll(".chip").forEach((el) => el.classList.remove("is-selected"));
          b.classList.add("is-selected");
        });
        row.appendChild(b);
      });
      modalOptions.appendChild(wrap);
    });

    modal.showModal();
    modalClose.focus();
  }

  function closeModal() {
    modal.close();
    modalProductId = null;
  }

  function payCurrentProductViaWhatsApp() {
    const p = getProduct(modalProductId);
    if (!p) return;
    openWhatsApp(messageSingleProduct(p, getModalQty()));
    closeModal();
    showToast("WhatsApp abierto.");
  }

  function addToCartOnly() {
    const p = getProduct(modalProductId);
    if (!p) return;
    const qty = getModalQty();
    cartItems.push({
      uid: `${p.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      id: p.id,
      ref: p.ref,
      name: p.name,
      price: p.price,
      qty,
      image: p.image,
      subtitle: optionSubtitle(p),
      normRef: p.normRef,
    });
    renderCart();
    pulseCartDock();
    closeModal();
    showToast("Añadido al carrito.");
  }

  function renderProducts() {
    productGrid.innerHTML = "";
    products.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.setAttribute("data-animate", "");
      card.innerHTML = `
        <div class="product-card__media">
          <span class="product-card__badge">${p.badge}</span>
          <img src="${p.image}" alt="${p.name}" width="400" height="300" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${p.name}</h3>
          <p class="product-card__price">${money(p.price)}</p>
          <div class="product-card__actions">
            <button type="button" class="btn btn--ghost btn-details" data-id="${p.id}">Detalles</button>
            <button type="button" class="btn btn--primary btn-buy" data-id="${p.id}">Comprar</button>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
      scrollIO.observe(card);
    });

    productGrid.querySelectorAll(".btn-details").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
    productGrid.querySelectorAll(".btn-buy").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
  }

  function renderCart() {
    const total = cartTotalNumber();
    cartList.innerHTML = "";
    const lines = cartItems.length;
    const units = cartTotalUnits();

    if (lines === 0) {
      cartEmpty.hidden = false;
      cartFooter.hidden = true;
      cartCount.hidden = true;
      cartDrawerTitle.textContent = "Tu carrito · 0 unidades";
      cartSummaryLine.textContent = "";
    } else {
      cartEmpty.hidden = true;
      cartFooter.hidden = false;
      cartCount.hidden = false;
      cartCount.textContent = String(units);
      cartDrawerTitle.textContent = `Tu carrito · ${units} unidad${units === 1 ? "" : "es"}`;
      cartSummaryLine.textContent = `Total en soles · enviar pedido por WhatsApp`;
    }

    cartTotal.textContent = money(total);

    cartItems.forEach((item) => {
      const q = Number(item.qty) || 1;
      const sub = Math.round(Number(item.price) * q * 100) / 100;
      const li = document.createElement("li");
      li.className = "cart-line";
      li.innerHTML = `
        <img class="cart-line__img" src="${item.image}" alt="" width="56" height="56" loading="lazy" referrerpolicy="no-referrer" />
        <div>
          <p class="cart-line__title">${item.name}</p>
          <p class="cart-line__meta">Modelo ${item.ref}${item.subtitle ? " · " + item.subtitle : ""}</p>
          <p class="cart-line__qty">${q} × ${money(item.price)} · Subtotal ${money(sub)}</p>
        </div>
        <span class="cart-line__price">${money(sub)}</span>
        <button type="button" class="cart-line__remove" data-uid="${item.uid}">Quitar</button>
      `;
      cartList.appendChild(li);
    });

    cartList.querySelectorAll(".cart-line__remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const uid = btn.dataset.uid;
        cartItems = cartItems.filter((i) => i.uid !== uid);
        renderCart();
      });
    });

    syncCartDock();
  }

  function openCart() {
    document.body.classList.add("drawer-cart-open");
    cartDrawer.hidden = false;
    requestAnimationFrame(() => cartDrawer.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeCart() {
    document.body.classList.remove("drawer-cart-open");
    cartDrawer.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!cartDrawer.classList.contains("is-open")) cartDrawer.hidden = true;
    }, 450);
  }

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  navToggle.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  document.querySelectorAll(".nav__link").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });

  const header = document.querySelector(".header");
  function onScrollHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  requestAnimationFrame(() => {
    document.querySelector(".hero")?.classList.add("is-ready");
  });

  const scrollIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => scrollIO.observe(el));

  modalClose.addEventListener("click", closeModal);
  modalQtyMinus.addEventListener("click", () => setModalQty(getModalQty() - 1));
  modalQtyPlus.addEventListener("click", () => setModalQty(getModalQty() + 1));
  modalQtyInput.addEventListener("change", () => setModalQty(getModalQty()));
  modalQtyInput.addEventListener("input", () => {
    if (modalQtyInput.value === "") return;
    setModalQty(parseInt(modalQtyInput.value, 10));
  });

  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeModal();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  modalAddCart.addEventListener("click", addToCartOnly);
  modalBuy.addEventListener("click", payCurrentProductViaWhatsApp);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
  });

  cartTrigger.addEventListener("click", openCart);
  if (cartDockBtn) cartDockBtn.addEventListener("click", openCart);
  mqDock.addEventListener("change", () => renderCart());
  cartBackdrop.addEventListener("click", closeCart);
  cartClose.addEventListener("click", closeCart);

  checkoutBtn.addEventListener("click", () => {
    if (cartItems.length === 0) return;
    openWhatsApp(messageCart());
    cartItems = [];
    renderCart();
    closeCart();
    showToast("Listo: revisa WhatsApp.");
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formHint.textContent = "Recibido. Te contactamos pronto.";
    contactForm.reset();
    showToast("Enviado.");
  });

  yearEl.textContent = String(new Date().getFullYear());

  const legalDialogs = {
    terms: document.getElementById("dialogLegalTerms"),
    privacy: document.getElementById("dialogLegalPrivacy"),
    returns: document.getElementById("dialogLegalReturns"),
  };

  document.querySelectorAll("[data-legal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dlg = legalDialogs[btn.dataset.legalOpen];
      if (dlg) dlg.showModal();
    });
  });

  document.querySelectorAll(".legal-modal").forEach((dlg) => {
    dlg.querySelectorAll("[data-legal-close]").forEach((b) => {
      b.addEventListener("click", () => dlg.close());
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });

  renderProducts();
  renderCart();
})();
