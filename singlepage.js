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
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      const countries = await res.json();
      console.log('Countries loaded:', countries.length);
  
      const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
  
      if (!country) {
        detailContainer.innerHTML = `<p>Country "${countryName}" not found.</p>`;
        return;
      }
  
      detailContainer.innerHTML = `
  <section class="country-detail">
    <img src="${country.flags.png}" alt="Flag of ${country.name}" width="200" />
    <h2>${country.name}</h2>
    <p><strong>Native Name:</strong> ${country.nativeName}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion}</p>
    <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
    <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(', ')}</p>
    <p><strong>Currencies:</strong> ${country.currencies.map(c => c.name).join(', ')}</p>
    <p><strong>Languages:</strong> ${country.languages.map(l => l.name).join(', ')}</p>
    <p><strong>Borders:</strong> ${country.borders && country.borders.length ? country.borders.join(', ') : 'None'}</p>
  </section>
`;
    } catch (err) {
      detailContainer.innerHTML = '<p>Error loading country details.</p>';
      console.error('Fetch error:', err);
    }
  }
  
  loadCountryDetails();
  