// Helper function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  const detailContainer = document.getElementById('detail-container');
  const backButton = document.getElementById('back-button');
  
  backButton.addEventListener('click', () => {
    window.history.back();
  });
  
  async function loadCountryDetails() {
    const countryName = getQueryParam('country');
    console.log('Country param:', countryName);
  
    if (!countryName) {
      detailContainer.innerHTML = '<p>No country selected.</p>';
      return;
    }
  
    try {
      const res = await fetch('data.json');
      console.log('Fetch response status:', res.status);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      const countries = await res.json();
      console.log('Countries loaded:', countries.length);
  
      const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
      console.log('Country found:', country);
  
      if (!country) {
        detailContainer.innerHTML = `<p>Country "${countryName}" not found.</p>`;
        return;
      }
  
      let bordersHTML = 'None';
      if (country.borders && country.borders.length) {
        bordersHTML = country.borders.map(code => {
          const borderCountry = countries.find(c => c.alpha3Code === code);
          if (!borderCountry) return '';
          return `<button class="border-btn" data-country="${borderCountry.name}">${borderCountry.name}</button>`;
        }).join(' ');
      }
  
      detailContainer.innerHTML = `
        <section class="country-detail">
          <img src="${country.flags.png}" alt="Flag of ${country.name}" />
          <h2>${country.name}</h2>
          <p><strong>Native Name:</strong> ${country.nativeName}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Subregion:</strong> ${country.subregion}</p>
          <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
          <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(', ')}</p>
          <p><strong>Currencies:</strong> ${country.currencies.map(c => c.name).join(', ')}</p>
          <p><strong>Languages:</strong> ${country.languages.map(l => l.name).join(', ')}</p>
          <p><strong>Borders:</strong> ${bordersHTML}</p>
        </section>
      `;
  
      // Add click event listeners for border buttons to navigate to that country detail page
      document.querySelectorAll('.border-btn').forEach(button => {
        button.addEventListener('click', () => {
          const selectedCountry = button.getAttribute('data-country');
          window.location.href = `singlepage.html?country=${encodeURIComponent(selectedCountry)}`;
        });
      });
  
    } catch (err) {
      detailContainer.innerHTML = '<p>Error loading country details.</p>';
      console.error('Fetch error:', err);
    }
  }
  
  loadCountryDetails();
  