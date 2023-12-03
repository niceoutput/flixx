const global = {
  currentPage: window.location.pathname
}

console.log(global.currentPage)

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
