import Notiflix from 'notiflix';

const BASE_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,flags,population,languages,
	 `
  ).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('"Oops, there is no country with that name"');
      throw new Error(response.status);
    }
    return response.json();
  });
}