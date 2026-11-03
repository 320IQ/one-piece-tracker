const TOTAL_EPISODES = 1180;
const EPISODE_MINUTES = 20;
const PROGRESS_KEY = "grand-line-tracker-progress-v2";
const SETTINGS_KEY = "grand-line-tracker-settings-v1";

const arc = (name, ranges, kind = "story") => ({ name, ranges, kind });

const sagas = [
  {
    name: "Ист-Блю",
    range: [1, 61],
    arcs: [
      arc("Рассвет приключений", [[1, 3]]),
      arc("Оранжевый город", [[4, 8]]),
      arc("Деревня Сироп", [[9, 18]]),
      arc("Барати", [[19, 30]]),
      arc("Парк Арлонга", [[31, 45]]),
      arc("Истории команды Багги", [[46, 47]], "filler"),
      arc("Логтаун", [[48, 53]]),
      arc("Остров военного корабля", [[54, 61]], "filler"),
    ],
  },
  {
    name: "Алабаста",
    range: [62, 143],
    arcs: [
      arc("Реверс-Маунтин", [[62, 63]]),
      arc("Виски-Пик", [[64, 67]]),
      arc("Коби и Хельмеппо", [[68, 69]]),
      arc("Маленький сад", [[70, 77]]),
      arc("Остров Драм", [[78, 91]]),
      arc("Алабаста", [[92, 130]]),
      arc("После Алабасты", [[131, 135]], "filler"),
      arc("Остров Козьей Головы", [[136, 138]], "filler"),
      arc("Остров Рулука", [[139, 143]], "filler"),
    ],
  },
  {
    name: "Небесный остров",
    range: [144, 206],
    arcs: [
      arc("Джая", [[144, 152]]),
      arc("Скайпия", [[153, 195]]),
      arc("G-8", [[196, 206]], "filler"),
    ],
  },
  {
    name: "Вотер-Севен",
    range: [207, 336],
    arcs: [
      arc("Длинное кольцо — Длинная земля", [[207, 219], [227, 228]]),
      arc("Сон океана", [[220, 224]], "filler"),
      arc("Возвращение Фокси", [[225, 226]], "filler"),
      arc("Вотер-Севен", [[229, 263]]),
      arc("Эниес-Лобби", [[264, 312]]),
      arc("После Эниес-Лобби", [[313, 325]]),
      arc("Охотники за льдом", [[326, 336]], "filler"),
    ],
  },
  {
    name: "Триллер-Барк",
    range: [337, 384],
    arcs: [
      arc("Триллер-Барк", [[337, 381]]),
      arc("Остров Спа", [[382, 384]], "filler"),
    ],
  },
  {
    name: "Великая война",
    range: [385, 522],
    arcs: [
      arc("Архипелаг Сабаоди", [[385, 405]]),
      arc("Исторические спецвыпуски о Боссе Луффи", [[406, 407]], "special"),
      arc("Амазон Лили", [[408, 421]]),
      arc("Импел-Даун", [[422, 425], [430, 456]]),
      arc("Малый Ист-Блю", [[426, 429]], "filler"),
      arc("Маринфорд", [[457, 489]]),
      arc("После войны", [[490, 491], [493, 516]]),
      arc("Кроссовер с «Торико»", [[492, 492]], "special"),
      arc("Возвращение на Сабаоди", [[517, 522]]),
    ],
  },
  {
    name: "Остров Рыболюдей",
    range: [523, 578],
    arcs: [
      arc("Остров Рыболюдей", [[523, 574]]),
      arc("Амбиции Z", [[575, 578]], "filler"),
    ],
  },
  {
    name: "Дрессроза",
    range: [579, 746],
    arcs: [
      arc("Панк-Хазард", [[579, 589], [591, 625]]),
      arc("Кроссовер с «Торико»", [[590, 590]], "special"),
      arc("Возвращение Цезаря", [[626, 628]], "filler"),
      arc("Дрессроза", [[629, 746]]),
    ],
  },
  {
    name: "Сага о четырёх императорах",
    range: [747, 1085],
    arcs: [
      arc("Серебряная шахта", [[747, 750]], "filler"),
      arc("Зоу", [[751, 779]]),
      arc("Новобранцы морского дозора", [[780, 782]], "filler"),
      arc("Остров Whole Cake", [[783, 877]]),
      arc("Ревери", [[878, 889]]),
      arc("Страна Вано", [[890, 894], [897, 906], [908, 1028], [1031, 1085]]),
      arc("Гильдия Сидра", [[895, 896]], "filler"),
      arc("Спецвыпуск «Рассвет приключений»", [[907, 907]], "special"),
      arc("Прошлое Уты", [[1029, 1030]], "filler"),
    ],
  },
  {
    name: "Финальная сага",
    range: [1086, 1180],
    arcs: [
      arc("Эггхед", [[1086, 1155]]),
      arc("Эльбаф", [[1156, 1180]]),
    ],
  },
];

const allArcs = sagas.flatMap((saga, sagaIndex) =>
  saga.arcs.map((item) => ({ ...item, saga: saga.name, sagaIndex })),
);

const elements = {
  sagaGrid: document.querySelector("#sagaGrid"),
  arcSummary: document.querySelector("#arcSummary"),
  watchedCount: document.querySelector("#watchedCount"),
  totalEpisodes: document.querySelector("#totalEpisodes"),
  progressPercent: document.querySelector("#progressPercent"),
  progressFill: document.querySelector("#progressFill"),
  progressBar: document.querySelector(".progress-track"),
  progressMessage: document.querySelector("#progressMessage"),
  currentArcMessage: document.querySelector("#currentArcMessage"),
  watchedInput: document.querySelector("#watchedInput"),
  progressForm: document.querySelector("#progressForm"),
  remainingEpisodes: document.querySelector("#remainingEpisodes"),
  remainingHours: document.querySelector("#remainingHours"),
  remainingDays: document.querySelector("#remainingDays"),
  speedInput: document.querySelector("#speedInput"),
  episodesPerDayInput: document.querySelector("#episodesPerDayInput"),
  statusText: document.querySelector("#statusText"),
  themeToggle: document.querySelector("#themeToggle"),
  themeIcon: document.querySelector("#themeIcon"),
  themeLabel: document.querySelector("#themeLabel"),
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function initialProgress() {
  const current = readJson(PROGRESS_KEY, null);
  if (Number.isInteger(current)) return Math.max(0, Math.min(TOTAL_EPISODES, current));

  // Keep progress from the earlier version by carrying forward its uninterrupted watched count.
  const previous = readJson("grand-line-log-progress-v1", []);
  const previousSet = new Set(Array.isArray(previous) ? previous : []);
  let lastWatched = 0;
  while (previousSet.has(lastWatched + 1) && lastWatched < TOTAL_EPISODES) lastWatched += 1;
  return lastWatched;
}

const settings = readJson(SETTINGS_KEY, {});
let watchedCount = initialProgress();

function storeSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    speed: Number(elements.speedInput.value),
    episodesPerDay: Number(elements.episodesPerDayInput.value),
    theme: document.documentElement.dataset.theme || "light",
  }));
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function episodeCount(item) {
  return item.ranges.reduce((total, [start, end]) => total + end - start + 1, 0);
}

function rangeLabel(item) {
  const full = item.ranges.map(([start, end]) => start === end ? `${start}` : `${start}–${end}`);
  if (full.length <= 2) return `серии ${full.join(", ")}`;
  return `серии ${full[0]}, ${full[1]} и ещё ${full.length - 2}`;
}

function watchedInArc(item) {
  return item.ranges.reduce((total, [start, end]) => {
    return total + Math.max(0, Math.min(watchedCount, end) - start + 1);
  }, 0);
}

function getCurrentArc() {
  if (watchedCount >= TOTAL_EPISODES) return null;
  const nextEpisode = watchedCount + 1;
  return allArcs.find((item) => item.ranges.some(([start, end]) => nextEpisode >= start && nextEpisode <= end)) || null;
}

function arcStatus(item, currentArc, sagaName) {
  if (currentArc && item.name === currentArc.name && sagaName === currentArc.saga) return "current";
  if (watchedInArc(item) === episodeCount(item)) return "complete";
  if (watchedInArc(item) > 0) return "partial";
  return "future";
}

function renderArcs() {
  const currentArc = getCurrentArc();
  let sectionNumber = 0;
  elements.sagaGrid.innerHTML = sagas.map((saga, sagaIndex) => {
    sectionNumber += 1;
    const sagaEpisodes = saga.range[1] - saga.range[0] + 1;
    const sagaWatched = Math.max(0, Math.min(watchedCount, saga.range[1]) - saga.range[0] + 1);
    const rows = saga.arcs.map((item) => {
      const status = arcStatus(item, currentArc, saga.name);
      const viewed = watchedInArc(item);
      const total = episodeCount(item);
      const detail = `${rangeLabel(item)} · ${formatNumber(total)} ${total === 1 ? "серия" : "серий"}`;
      const statusLabel = status === "current" ? "Сейчас" : status === "complete" ? "Пройдена" : status === "partial" ? "Начата" : "Впереди";
      const kindLabel = item.kind === "filler" ? "филлер" : item.kind === "special" ? "спецвыпуск" : "";
      return `
        <div class="arc-row ${status === "current" ? "is-current" : ""} ${status === "complete" ? "is-complete" : ""}" ${status === "current" ? 'aria-current="step"' : ""} title="${item.name}: ${detail}">
          <span class="arc-marker" aria-hidden="true"></span>
          <span class="arc-copy">
            <span class="arc-title">${item.name}${kindLabel ? `<small class="arc-kind">${kindLabel}</small>` : ""}</span>
            <span class="arc-range">${detail}</span>
          </span>
          <span class="arc-state">${statusLabel}${status === "partial" ? ` · ${viewed}/${total}` : ""}</span>
        </div>`;
    }).join("");

    const active = saga.arcs.some((item) => currentArc && item.name === currentArc.name && sagaIndex === currentArc.sagaIndex);
    return `
      <section class="saga-card ${active ? "has-current" : ""}" aria-label="Сага ${saga.name}">
        <header class="saga-heading">
          <span class="saga-index">САГА ${String(sectionNumber).padStart(2, "0")}</span>
          <h3>${saga.name}</h3>
          <span class="saga-progress">${formatNumber(sagaWatched)} / ${formatNumber(sagaEpisodes)}</span>
        </header>
        <div class="saga-arcs">${rows}</div>
      </section>`;
  }).join("");
  elements.arcSummary.textContent = `${allArcs.length} арок и спецвыпусков · ${sagas.length} саг`;
}

function formatHours(totalMinutes) {
  const roundedMinutes = Math.round(totalMinutes);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;
  if (!minutes) return `${formatNumber(hours)} ч`;
  return `${formatNumber(hours)} ч ${minutes} мин`;
}

function renderProgress() {
  const remaining = Math.max(0, TOTAL_EPISODES - watchedCount);
  const percentage = Math.round((watchedCount / TOTAL_EPISODES) * 100);
  const currentArc = getCurrentArc();
  const speed = Number(elements.speedInput.value) || 1;
  const episodesPerDay = Math.max(1, Number(elements.episodesPerDayInput.value) || 1);
  const hours = (remaining * EPISODE_MINUTES) / speed;
  const days = Math.ceil(remaining / episodesPerDay);

  elements.watchedCount.textContent = formatNumber(watchedCount);
  elements.totalEpisodes.textContent = formatNumber(TOTAL_EPISODES);
  elements.progressPercent.textContent = `${percentage}%`;
  elements.progressFill.style.width = `${percentage}%`;
  elements.progressBar.setAttribute("aria-valuenow", watchedCount);
  elements.watchedInput.value = watchedCount;
  elements.remainingEpisodes.textContent = formatNumber(remaining);
  elements.remainingHours.textContent = formatHours(hours);
  elements.remainingDays.textContent = `${formatNumber(days)} ${days === 1 ? "день" : "дней"}`;
  elements.statusText.textContent = watchedCount ? "Прогресс сохранён" : "Журнал готов";

  if (remaining === 0) {
    elements.progressMessage.textContent = "Ты прошёл весь доступный маршрут.";
    elements.currentArcMessage.textContent = "Все доступные арки просмотрены.";
  } else if (watchedCount === 0) {
    elements.progressMessage.textContent = "Начни с первой серии — впереди целое море историй.";
    elements.currentArcMessage.textContent = `Текущая арка: ${currentArc?.name || "Рассвет приключений"}`;
  } else {
    elements.progressMessage.textContent = `Осталось ${formatNumber(remaining)} серий до конца маршрута.`;
    elements.currentArcMessage.textContent = `Сейчас смотришь: ${currentArc?.name || "следующая арка"}`;
  }
}

function render() {
  renderProgress();
  renderArcs();
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  elements.themeToggle.setAttribute("aria-pressed", String(dark));
  elements.themeToggle.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
  elements.themeIcon.textContent = dark ? "☼" : "☾";
  elements.themeLabel.textContent = dark ? "Светлая тема" : "Тёмная тема";
}

elements.progressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  watchedCount = Math.max(0, Math.min(TOTAL_EPISODES, Number(elements.watchedInput.value) || 0));
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(watchedCount));
  render();
});

elements.speedInput.addEventListener("change", () => {
  storeSettings();
  renderProgress();
});

elements.episodesPerDayInput.addEventListener("input", renderProgress);
elements.episodesPerDayInput.addEventListener("change", () => {
  const value = Math.max(1, Math.min(50, Number(elements.episodesPerDayInput.value) || 1));
  elements.episodesPerDayInput.value = value;
  storeSettings();
  renderProgress();
});

elements.themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  storeSettings();
});

elements.speedInput.value = ["0.75", "1", "1.25", "1.5", "1.75", "2"].includes(String(settings.speed)) ? String(settings.speed) : "1.5";
elements.episodesPerDayInput.value = Math.max(1, Math.min(50, Number(settings.episodesPerDay) || 5));
applyTheme(settings.theme === "dark" ? "dark" : "light");
render();
