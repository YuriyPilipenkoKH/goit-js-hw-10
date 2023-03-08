import './css/styles.css';
import {fetchCountries} from './fetchCountries'
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputRef: document.querySelector('#search-box'),
    listRef: document.querySelector('.country-list'),
    infoRef: document.querySelector('.country-info'),
  };
  
  refs.inputRef.addEventListener(
    'input',
    debounce(onInputSearchCountry, DEBOUNCE_DELAY)
  );
  
  function onInputSearchCountry(e) {
    const inputText = e.target.value;
    const valueNormalized = inputText.trim().toLowerCase();
  
    if (valueNormalized === '') {
      refs.listRef.innerHTML = '';
      refs.infoRef.innerHTML = '';
      return;
    } else {
      fetchCountries(valueNormalized)
        .then(countries => {
          const findCountry = countries.filter(({ name: { official } }) =>
            official.toLowerCase().includes(valueNormalized)
          );
  
          if (findCountry.length > 10) {
            refs.listRef.innerHTML = '';
            refs.infoRef.innerHTML = '';
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          }
          if (findCountry.length > 1 && findCountry.length <= 10) {
            const markupList = createCountriesList(findCountry);
            refs.listRef.innerHTML = markupList;
            refs.infoRef.innerHTML = '';
            return;
          }
  
          if (findCountry.length === 1) {
            const markupOneCountry = createCountryInformation(findCountry[0]);
            refs.infoRef.innerHTML = markupOneCountry;
            refs.listRef.innerHTML = '';
            return;
          }
  
          if (findCountry.length === 0) {
            refs.listRef.innerHTML = '';
            refs.infoRef.innerHTML = '';
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  
  function createCountriesList(countries) {
    return countries
      .map(
        ({ name: { official }, flags: { svg } }) => `<li class="list__item">
            <img src="${svg}" alt="${official}" width="40" height="40"/>
            <p>${official}</p></li>`
      )
      .join('');
  }
  
  function createCountryInformation({
    flags: { svg },
    name: { official },
    capital,
    population,
    languages,
  }) {
    const langs = Object.values(languages).join(', ');
    return `<div class=""info__item>
    <div class="block-img"><img src="${svg}" alt="${official}" width="50"/>
    <h2>${official}</h2></div>
             <p><b>Capital:</b> ${capital}</p>
             <p><b>Population:</b> ${population}</p>
             <p><b>Languages:</b> ${langs}</p></div>`;
  }