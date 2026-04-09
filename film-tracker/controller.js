// ============================================================
// CONTROLLER.JS — Kobler sammen model og view
// ============================================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const tabSearch = document.getElementById("tabSearch");
const tabList = document.getElementById("tabList");
const searchSection = document.getElementById("searchSection");
const listSection = document.getElementById("listSection");
const filterBtns = document.querySelectorAll(".filter");

// ---------- START ----------

function init() {
  updateListCount();
  setupSearch();
  setupTabs();
  setupFilters();
}

// ---------- SØK ----------

function setupSearch() {
  searchBtn.addEventListener("click", handleSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  showLoading();

  try {
    const movies = await fetchMovies(query);
    hideLoading();
    renderSearchResults(movies);
  } catch (error) {
    hideLoading();
    showError("Noe gikk galt. Sjekk API-nøkkelen din og prøv igjen.");
    console.error(error);
  }
}

// ---------- FANER ----------

function setupTabs() {
  tabSearch.addEventListener("click", () => {
    tabSearch.classList.add("active");
    tabList.classList.remove("active");
    searchSection.classList.remove("hidden");
    listSection.classList.add("hidden");
  });

  tabList.addEventListener("click", () => {
    tabList.classList.add("active");
    tabSearch.classList.remove("active");
    listSection.classList.remove("hidden");
    searchSection.classList.add("hidden");
    renderList(getActiveFilter());
  });
}

// ---------- FILTER ----------

function setupFilters() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderList(btn.dataset.filter);
    });
  });
}

// ---------- KJØR APPEN ----------

init();
