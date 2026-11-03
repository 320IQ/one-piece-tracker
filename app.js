const TOTAL_EPISODES = 1180;
const STORAGE_KEY = "grand-line-log-progress-v1";

const arcs = [
  ["East Blue", 1, 61, "assets/east-blue.jpg"],
  ["Alabasta", 62, 135, "assets/alabasta.jpg"],
  ["Sky Island", 136, 206, "assets/skypiea.jpg"],
  ["Water 7", 207, 325, "assets/water-7.webp"],
  ["Thriller Bark", 326, 384, "assets/thriller-bark.jpg"],
  ["Summit War", 385, 516, "assets/summit-war.jpg"],
  ["Новый Свет", 517, 628, "assets/new-world.jpg"],
  ["Dressrosa", 629, 746, "assets/dressrosa.jpg"],
  ["Whole Cake", 747, 877, "assets/whole-cake.jpg"],
  ["Wano Country", 878, 1085, "assets/wano.jpg"],
  ["Egghead", 1086, 1155, "assets/egghead.jpg"],
  ["Elbaph", 1156, 1180, "assets/elbaph.webp"],
].map(([name, start, end, image]) => ({ name, start, end, image, length: end - start + 1 }));

const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const watched = new Set(savedProgress.filter((episode) => episode > 0 && episode <= TOTAL_EPISODES));
let activeArc = 0;

const elements = {
  arcGrid: document.querySelector("#arcGrid"),
  episodeGrid: document.querySelector("#episodeGrid"),
  episodeTitle: document.querySelector("#episodesTitle"),
  activeArcRange: document.querySelector("#activeArcRange"),
  arcDetail: document.querySelector("#arcDetail"),
  watchedCount: document.querySelector("#watchedCount"),
  progressPercent: document.querySelector("#progressPercent"),
  totalEpisodes: document.querySelector("#totalEpisodes"),
  progressFill: document.querySelector("#progressFill"),
  progressShip: document.querySelector("#progressShip"),
  progressBar: document.querySelector(".progress-track"),
  progressMessage: document.querySelector("#progressMessage"),
  progressNote: document.querySelector("#progressNote"),
  continueButton: document.querySelector("#continueButton"),
  continueLabel: document.querySelector("#continueLabel"),
  setProgressButton: document.querySelector("#setProgressButton"),
  progressDialog: document.querySelector("#progressDialog"),
  progressForm: document.querySelector("#progressForm"),
  episodeInput: document.querySelector("#episodeInput"),
  clearArcButton: document.querySelector("#clearArcButton"),
  resetAllButton: document.querySelector("#resetAllButton"),
  statusText: document.querySelector("#statusText"),
};

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...watched].sort((a, b) => a - b)));
}

function countInArc(arc) {
  return [...watched].filter((episode) => episode >= arc.start && episode <= arc.end).length;
}

function firstUnwatched() {
  for (let episode = 1; episode <= TOTAL_EPISODES; episode += 1) {
    if (!watched.has(episode)) return episode;
  }
  return null;
}

function getArcForEpisode(episode) {
  return arcs.findIndex((arc) => episode >= arc.start && episode <= arc.end);
}

function formatNumber(number) {
  return new Intl.NumberFormat("ru-RU").format(number);
}

function renderArcs() {
  elements.arcGrid.innerHTML = arcs
    .map((arc, index) => {
      const complete = countInArc(arc);
      const percentage = Math.round((complete / arc.length) * 100);
      return `
        <button class="arc-card" type="button" data-index="${String(index + 1).padStart(2, "0")}" data-arc="${index}" aria-pressed="${index === activeArc}">
          <span class="arc-image" style="background-image: url('${arc.image}')"></span>
          <span class="arc-number">${String(index + 1).padStart(2, "0")} / ${arc.start}–${arc.end}</span>
          <strong>${arc.name}</strong>
          <small>${complete} / ${arc.length}</small>
          <span class="mini-progress"><span style="width: ${percentage}%"></span></span>
        </button>`;
    })
    .join("");
}

function renderEpisodes() {
  const arc = arcs[activeArc];
  const complete = countInArc(arc);
  elements.episodeTitle.textContent = arc.name;
  elements.activeArcRange.textContent = `${arc.start}–${arc.end} серии`;
  elements.arcDetail.textContent = `${complete} / ${arc.length} просмотрено`;
  elements.episodeGrid.innerHTML = Array.from({ length: arc.length }, (_, offset) => {
    const episode = arc.start + offset;
    const checked = watched.has(episode);
    return `<button class="episode" type="button" data-episode="${episode}" aria-pressed="${checked}" aria-label="Серия ${episode}${checked ? ", просмотрена" : ""}">${episode}</button>`;
  }).join("");
}

function renderProgress() {
  const completed = watched.size;
  const percentage = Math.round((completed / TOTAL_EPISODES) * 100);
  const nextEpisode = firstUnwatched();
  const nextArcIndex = nextEpisode ? getArcForEpisode(nextEpisode) : -1;
  const nextArc = nextArcIndex >= 0 ? arcs[nextArcIndex] : null;

  elements.watchedCount.textContent = formatNumber(completed);
  elements.progressPercent.textContent = percentage;
  elements.totalEpisodes.textContent = formatNumber(TOTAL_EPISODES);
  elements.progressFill.style.width = `${percentage}%`;
  elements.progressShip.style.left = `${Math.max(0.8, Math.min(99.2, percentage))}%`;
  elements.progressBar.setAttribute("aria-valuenow", completed);
  elements.statusText.textContent = completed ? "маршрут сохранён" : "журнал на борту";

  if (completed === TOTAL_EPISODES) {
    elements.progressMessage.textContent = "Ты покорил все доступные моря.";
    elements.progressNote.textContent = "Все 1 180 серий отмечены. Настоящий Король пиратов.";
    elements.continueLabel.textContent = "Путь пройден";
  } else if (completed === 0) {
    elements.progressMessage.textContent = "Первый шаг — поднять якорь.";
    elements.progressNote.textContent = `Осталось открыть ${formatNumber(TOTAL_EPISODES)} новых историй.`;
    elements.continueLabel.textContent = "Начать с 1-й серии";
  } else {
    elements.progressMessage.textContent = `Следующая остановка — ${nextArc.name}.`;
    elements.progressNote.textContent = `До конца путешествия: ${formatNumber(TOTAL_EPISODES - completed)} серий.`;
    elements.continueLabel.textContent = `Продолжить с ${nextEpisode}-й серии`;
  }
}

function render() {
  renderProgress();
  renderArcs();
  renderEpisodes();
}

function openProgressDialog() {
  const lastContinuous = firstUnwatched() ? firstUnwatched() - 1 : TOTAL_EPISODES;
  elements.episodeInput.value = lastContinuous || "";
  elements.progressDialog.showModal();
  setTimeout(() => elements.episodeInput.focus(), 50);
}

elements.arcGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-arc]");
  if (!button) return;
  activeArc = Number(button.dataset.arc);
  renderArcs();
  renderEpisodes();
  document.querySelector("#episodes").scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.episodeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-episode]");
  if (!button) return;
  const episode = Number(button.dataset.episode);
  if (watched.has(episode)) watched.delete(episode);
  else watched.add(episode);
  saveProgress();
  render();
});

elements.setProgressButton.addEventListener("click", openProgressDialog);
elements.continueButton.addEventListener("click", () => {
  const nextEpisode = firstUnwatched();
  if (!nextEpisode) return;
  activeArc = getArcForEpisode(nextEpisode);
  renderArcs();
  renderEpisodes();
  document.querySelector("#episodes").scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.progressForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const lastEpisode = Math.max(0, Math.min(TOTAL_EPISODES, Number(elements.episodeInput.value)));
  if (!Number.isInteger(lastEpisode)) return;
  watched.clear();
  for (let episode = 1; episode <= lastEpisode; episode += 1) watched.add(episode);
  activeArc = lastEpisode ? getArcForEpisode(lastEpisode) : 0;
  saveProgress();
  elements.progressDialog.close();
  render();
});

elements.clearArcButton.addEventListener("click", () => {
  const arc = arcs[activeArc];
  for (let episode = arc.start; episode <= arc.end; episode += 1) watched.delete(episode);
  saveProgress();
  render();
});

elements.resetAllButton.addEventListener("click", () => {
  watched.clear();
  activeArc = 0;
  saveProgress();
  elements.progressDialog.close();
  render();
});

render();
