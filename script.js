// Fetch data.json and initialize
let countries = [];
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const countryList = document.getElementById('country-list');
const regionFilter = document.getElementById('region-filter');
const searchInput = document.getElementById('searchInput');
const body = document.body;

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  if (body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    darkModeToggle.querySelector('p').textContent = 'Light Mode';
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    darkModeToggle.querySelector('p').textContent = 'Dark Mode';
  }
});

// Load countries data
async function loadCountries() {
  try {
    const res = await fetch('data.json');
    countries = await res.json();
    renderCountries(countries);
  } catch (err) {
    console.error('Error loading countries:', err);
  }
}

// Render countries to the DOM
function renderCountries(data) {
  countryList.innerHTML = '';
  if (data.length === 0) {
    countryList.innerHTML = '<p>No countries found.</p>';
    return;
  }

  data.forEach(country => {
    const countryCard = document.createElement('article');
    countryCard.classList.add('country-card');
    countryCard.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name}" loading="lazy" />
      <div class="country-info">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
      </div>
    `;

    // Add click event to navigate to detail page with country name as param
    countryCard.addEventListener('click', () => {
      const countryNameEncoded = encodeURIComponent(country.name);
      window.location.href = `singlepage.html?country=${countryNameEncoded}`;
    });

    countryList.appendChild(countryCard);
  });
}

// Filter countries by region
regionFilter.addEventListener('change', () => {
  filterCountries();
});

// Filter countries by search input
searchInput.addEventListener('input', () => {
  filterCountries();
});

// Combined filter function
function filterCountries() {
  const region = regionFilter.value;
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = countries;

  if (region) {
    filtered = filtered.filter(c => c.region === region);
  }

  if (searchTerm) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(searchTerm));
  }

  renderCountries(filtered);
}

// Initialize app
loadCountries();
