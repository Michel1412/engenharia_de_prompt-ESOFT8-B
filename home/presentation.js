(function () {
  const slides = window.PRESENTATION_SLIDES || [];
  const slidesEl = document.getElementById("slides");
  const dotsEl = document.getElementById("dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const counterEl = document.getElementById("slide-counter");

  if (!slidesEl || !slides.length) return;

  let index = 0;
  let touchX = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatInt(n) {
    return Math.round(n).toLocaleString("pt-BR");
  }

  function assetHref(href) {
    return href
      .split("/")
      .map((part) => (part ? encodeURIComponent(part) : ""))
      .join("/");
  }

  function renderSlideHtml(slide) {
    const parts = [];
    if (slide.kicker) {
      parts.push(`<p class="slide-kicker">${slide.kicker}</p>`);
    }
    parts.push(`<h2 class="slide-title">${slide.title}</h2>`);

    if (slide.body) {
      parts.push(
        `<div class="slide-body">${slide.body.map((p) => `<p>${p}</p>`).join("")}</div>`,
      );
    }

    if (slide.links) {
      parts.push(
        `<ul class="slide-links">${slide.links
          .map(
            (link) =>
              `<li><a href="${assetHref(link.href)}" target="_blank" rel="noopener">${link.label}</a></li>`,
          )
          .join("")}</ul>`,
      );
    }

    if (slide.chips) {
      parts.push(
        `<ul class="slide-chips">${slide.chips.map((c) => `<li>${c}</li>`).join("")}</ul>`,
      );
    }

    if (slide.list) {
      parts.push(
        `<ul class="slide-list">${slide.list
          .map(
            (item) =>
              `<li><span class="slide-list__label">${item.label}</span><span class="slide-list__text">${item.text}</span></li>`,
          )
          .join("")}</ul>`,
      );
    }

    if (slide.table) {
      const head = slide.table.headers
        .map((h) => `<th scope="col">${h}</th>`)
        .join("");
      const body = slide.table.rows
        .map(
          (row) =>
            `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`,
        )
        .join("");
      parts.push(
        `<div class="slide-table-wrap"><table class="slide-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`,
      );
    }

    if (slide.countUp) {
      parts.push(
        `<div class="count-grid" data-count-grid>${slide.countUp
          .map(
            (item) =>
              `<div class="count-card"><span class="count-card__label">${item.label}</span><span class="count-card__value" data-count="${item.value}">0</span></div>`,
          )
          .join("")}</div>`,
      );
    }

    if (slide.formula) {
      parts.push(`<p class="slide-formula">${slide.formula}</p>`);
    }

    if (slide.note) {
      parts.push(`<p class="slide-note">${slide.note}</p>`);
    }

    if (slide.placeholders) {
      parts.push(
        `<dl class="placeholders">${slide.placeholders
          .map(
            (p) =>
              `<div><dt>${p.label}</dt><dd class="is-placeholder">${p.value}</dd></div>`,
          )
          .join("")}</dl>`,
      );
    }

    if (slide.pendencias) {
      parts.push(
        `<div class="pendencias"><p class="pendencias__title">Pendências (não inventar)</p><ul>${slide.pendencias
          .map((p) => `<li>${p}</li>`)
          .join("")}</ul></div>`,
      );
    }

    return parts.join("");
  }

  function build() {
    slidesEl.innerHTML = slides
      .map(
        (slide, i) =>
          `<article class="slide${i === 0 ? " is-active" : ""}" data-index="${i}" id="slide-${slide.id}" aria-hidden="${i === 0 ? "false" : "true"}"><div class="slide-panel">${renderSlideHtml(slide)}</div></article>`,
      )
      .join("");

    dotsEl.innerHTML = slides
      .map(
        (slide, i) =>
          `<button type="button" class="dot${i === 0 ? " is-active" : ""}" role="tab" aria-selected="${i === 0}" aria-controls="slide-${slide.id}" data-index="${i}" aria-label="Ir para slide ${i + 1}: ${slide.title}"></button>`,
      )
      .join("");
  }

  function animateCounts(root) {
    const nodes = root.querySelectorAll("[data-count]");
    nodes.forEach((el) => {
      const target = Number(el.getAttribute("data-count"));
      if (!Number.isFinite(target)) return;
      if (reduceMotion) {
        el.textContent = formatInt(target);
        return;
      }
      const duration = 900;
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = formatInt(target * eased);
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = formatInt(target);
      }
      requestAnimationFrame(frame);
    });
  }

  function goTo(next) {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    const prev = index;
    index = clamped;

    const articles = slidesEl.querySelectorAll(".slide");
    articles.forEach((el, i) => {
      const active = i === index;
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-exit-left", !active && i < index);
      el.classList.toggle("is-exit-right", !active && i > index);
      el.setAttribute("aria-hidden", active ? "false" : "true");
      if (active && slides[i].countUp) {
        const values = el.querySelectorAll("[data-count]");
        values.forEach((v) => {
          v.textContent = "0";
        });
        animateCounts(el);
      }
    });

    dotsEl.querySelectorAll(".dot").forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
    counterEl.textContent = `${index + 1} / ${slides.length}`;

    if (prev !== index) {
      slidesEl.classList.remove("is-animating");
      void slidesEl.offsetWidth;
      slidesEl.classList.add("is-animating");
    }
  }

  build();
  goTo(0);

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  dotsEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".dot");
    if (!btn) return;
    goTo(Number(btn.dataset.index));
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  const deck = document.querySelector(".deck");
  deck.addEventListener(
    "touchstart",
    (event) => {
      touchX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );
  deck.addEventListener(
    "touchend",
    (event) => {
      if (touchX == null) return;
      const dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 48) return;
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    },
    { passive: true },
  );
})();
