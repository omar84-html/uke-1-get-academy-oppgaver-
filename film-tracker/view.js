// ============================================================
// VIEW.JS — Tegner alt på skjermen
// ============================================================

const movieGrid = document.getElementById("movieGrid");
const listGrid = document.getElementById("listGrid");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const searchHint = document.getElementById("searchHint");
const emptyMsg = document.getElementById("emptyMsg");
const listCountBadge = document.getElementById("listCount");

// ---------- FILMKORT (søkeresultater) ----------

function renderSearchResults(movies) {
  movieGrid.innerHTML = "";
  searchHint.classList.add("hidden");

  if (movies.length === 0) {
    movieGrid.innerHTML = `<p class="hint">Ingen filmer funnet. Prøv et annet søk.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const card = createSearchCard(movie);
    movieGrid.appendChild(card);
  });
}

function createSearchCard(movie) {
  const saved = isInList(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Ukjent";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "–";
  const imgUrl = getImageUrl(movie.poster_path);

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.innerHTML = `
    ${imgUrl
      ? `<img src="${imgUrl}" alt="${movie.title}" loading="lazy">`
      : `<div class="no-poster">🎬</div>`
    }
    <div class="card-info">
      <div class="card-title" title="${movie.title}">${movie.title}</div>
      <div class="card-meta">
        <span>${year}</span>
        <span class="rating">⭐ ${rating}</span>
      </div>
      <button class="card-btn ${saved ? "btn-saved" : "btn-add"}" data-id="${movie.id}" ${saved ? "disabled" : ""}>
        ${saved ? "✓ Lagt til" : "+ Legg til liste"}
      </button>
    </div>
  `;

  if (!saved) {
    card.querySelector(".card-btn").addEventListener("click", () => {
      addToList(movie);
      updateListCount();
      card.querySelector(".card-btn").textContent = "✓ Lagt til";
      card.querySelector(".card-btn").className = "card-btn btn-saved";
      card.querySelector(".card-btn").disabled = true;
    });
  }

  return card;
}

// ---------- MIN LISTE ----------

function renderList(filter = "all") {
  listGrid.innerHTML = "";
  let list = getList();

  if (filter === "seen") list = list.filter((m) => m.seen);
  if (filter === "unseen") list = list.filter((m) => !m.seen);

  if (list.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");

  list.forEach((movie) => {
    const card = createListCard(movie);
    listGrid.appendChild(card);
  });
}

function createListCard(movie) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Ukjent";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "–";
  const imgUrl = getImageUrl(movie.poster_path);

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.dataset.id = movie.id;

  card.innerHTML = `
    ${movie.seen ? `<span class="seen-badge">Sett ✅</span>` : ""}
    ${imgUrl
      ? `<img src="${imgUrl}" alt="${movie.title}" loading="lazy">`
      : `<div class="no-poster">🎬</div>`
    }
    <div class="card-info">
      <div class="card-title" title="${movie.title}">${movie.title}</div>
      <div class="card-meta">
        <span>${year}</span>
        <span class="rating">⭐ ${rating}</span>
      </div>
      <button class="card-btn ${movie.seen ? "btn-seen" : "btn-unseen"}" data-action="seen">
        ${movie.seen ? "✅ Sett" : "Merk som sett"}
      </button>
      <button class="card-btn btn-remove" data-action="remove">
        Fjern
      </button>
    </div>
  `;

  card.querySelector("[data-action='seen']").addEventListener("click", () => {
    toggleSeen(movie.id);
    renderList(getActiveFilter());
    updateListCount();
  });

  card.querySelector("[data-action='remove']").addEventListener("click", () => {
    removeFromList(movie.id);
    renderList(getActiveFilter());
    updateListCount();
  });

  return card;
}

// ---------- HJELPE-FUNKSJONER ----------

function showLoading() {
  loadingMsg.classList.remove("hidden");
  movieGrid.innerHTML = "";
  errorMsg.classList.add("hidden");
  searchHint.classList.add("hidden");
}

function hideLoading() {
  loadingMsg.classList.add("hidden");
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function updateListCount() {
  listCountBadge.textContent = getListCount();
}

function getActiveFilter() {
  const active = document.querySelector(".filter.active");
  return active ? active.dataset.filter : "all";
}
