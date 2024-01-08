const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1
  },
  api: {
    apiKey: '5b1f7a4fa8b3886298391bea093cdf5a',
    apiUrl: 'https://api.themoviedb.org/3/'
  }
}

console.log(global.currentPage)

// Search functionality Movies/Shows
async function search() {
  // Create the query string
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page} = await searchAPIData();

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

   displaySearchResults(results);

   document.querySelector('#search-term').value = '';

  } else {
    showAlert('Please enter the correct search term');
  }
}

function displaySearchResults(results) {
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
      ${result.poster_path
        ? `<img
            src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
        : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
      }

      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>
    `;

    const movieGrid = document.getElementById('search-results');

    movieGrid.append(div);

  })
}

// Display Slider
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  console.log(results);
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${result.id}">
        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${Math.ceil(result.vote_average)} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  })
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
  // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 20
    }
  }
})

}

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

// Display Popular Show
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-shows').appendChild(div);
  });
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
    production_companies,
    backdrop_path
    } = await fetchAPIData(`movie/${movieId}`);

    // Overlay for background image
    displayBackgroundImage('movie', backdrop_path);

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
      }
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

//Display backdrop on Details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  type === 'movie'
    ? document.getElementById('movie-details').appendChild(overlayDiv)
    : document.getElementById('show-details').appendChild(overlayDiv);
}

// Display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const {
    name,
    poster_path,
    vote_average,
    last_air_date,
    overview,
    genres,
    homepage,
    number_of_episodes,
    last_episode_to_air: {air_date},
    runtime,
    status,
    production_companies,
    backdrop_path
    } = await fetchAPIData(`tv/${showId}`);

    // Overlay for background image
    displayBackgroundImage('tv', backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
        ${poster_path
        ? `<img
            src="https://image.tmdb.org/t/p/w500${poster_path}"
            class="card-img-top"
            alt="${name}"
          />`
        : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${name}"
            />`
      }
      </div>
      <div>
        <h2>${name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${last_air_date}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${genres.map(({name}) => `<li>${name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of episodes: </span> ${number_of_episodes}</li>
        <li><span class="text-secondary">Last episode to air:</span> ${air_date} </li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies.map(({name}) => `<span>${name}</span>`).join('')}</div>
    </div>
  `;

  document.getElementById('show-details').appendChild(div);
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();

  return data;
}

// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );
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

// Show alert
function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');

  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  document.getElementById('alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case 'index.html':
      displaySlider();
      displayPopularMovies();
      console.log('Home');
      break;

    case '/shows.html':
      console.log('Shows');
      displayPopularShows();
      break;

    case '/movie-details.html':
      displayMovieDetails();
      // console.log('Details');
      break;

    case '/tv-details.html':
      displayShowDetails();
      console.log('TV Details');
      break;

    case '/search.html':
      console.log('Search');
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
