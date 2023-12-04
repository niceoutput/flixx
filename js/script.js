const global = {
  currentPage: window.location.pathname
}

console.log(global.currentPage)

async function displayPopularMovies() {
  const results = await fetchAPIData('movie/popular');
  console.log(results);
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '5b1f7a4fa8b3886298391bea093cdf5a';
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjFmN2E0ZmE4YjM4ODYyOTgzOTFiZWEwOTNjZGY1YSIsInN1YiI6IjVlODY0YjE4Mzk3NTYxMDAxMjk3YTNkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rXweNiZqdSsRIW5XFdZdgGhTMGGlamz39DJR9HVEwFY';

  // const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();

  return data;
}

// Highlighte active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  })
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case 'index.html':
      displayPopularMovies();
      console.log('Home');
      break;

    case '/shows.html':
      console.log('Shows');
      break;

    case '/movie-details.html':
      console.log('Details');
      break;

    case '/tv-details.html':
      console.log('TV Details');
      break;

    case '/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
