// ============================================================
// MODEL.JS — Henter data fra API og håndterer localStorage
// ============================================================

// VIKTIG: Lim inn din gratis API-nøkkel fra https://www.themoviedb.org/settings/api
const API_KEY = "DIN_API_NØKKEL_HER";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const STORAGE_KEY = "filmtracker_liste";

// ---------- API ----------

async function fetchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=no-NO&include_adult=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Kunne ikke hente filmer.");
  const data = await response.json();
  return data.results;
}

function getImageUrl(path) {
  if (!path) return null;
  return IMG_URL + path;
}

// ---------- LOKAL LAGRING ----------

function getList() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addToList(movie) {
  const list = getList();
  const finnesAllerede = list.find((m) => m.id === movie.id);
  if (finnesAllerede) return false;

  list.push({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
    seen: false,
  });

  saveList(list);
  return true;
}

function removeFromList(id) {
  const list = getList().filter((m) => m.id !== id);
  saveList(list);
}

function toggleSeen(id) {
  const list = getList().map((m) => {
    if (m.id === id) return { ...m, seen: !m.seen };
    return m;
  });
  saveList(list);
}

function isInList(id) {
  return getList().some((m) => m.id === id);
}

function getListCount() {
  return getList().length;
}
