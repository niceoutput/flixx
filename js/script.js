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

// Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const {
    title,
    poster_path,
    vote_average,
    release_date,
    overview,
    genres,
    homepage,
    budget,
    revenue,
    runtime,
    status,
    production_companies
    } = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
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
      }="Movie Title"
        />
      </div>
      <div>
        <h2>${title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${release_date}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${genres.map(({name}) => `<li>${name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget: </span> $${addCommasToNumber(budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(revenue)} </li>
        <li><span class="text-secondary">Runtime:</span> ${runtime}</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies.map(({name}) => `<span>${name}</span>`).join('')}</div>
    </div>
  `;

  document.getElementById('movie-details').appendChild(div);
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

function addCommasToNumber(number) {
  return number.toString().replace(/B(?=(d{3})+(?!d))/g, ',');
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
      displayMovieDetails();
      // console.log('Details');
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
