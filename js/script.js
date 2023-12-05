const global = {
  currentPage: window.location.pathname
}

console.log(global.currentPage)

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach(({id, poster_path, title, release_date}) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
      <a href="movie-details.html?id=${id}">
      ${poster_path
        ? `<img
            src="https://image.tmdb.org/t/p/w500${poster_path}"
            class="card-img-top"
            alt="${title}"
          />`
        : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${title}"
            />`
      }

      </a>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${release_date}</small>
        </p>
      </div>
    `;

    const movieGrid = document.getElementById('popular-movies');

    movieGrid.append(div);

  })
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '5b1f7a4fa8b3886298391bea093cdf5a';
  const API_URL = 'https://api.themoviedb.org/3/';

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
