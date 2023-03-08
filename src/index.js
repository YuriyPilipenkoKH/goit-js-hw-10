import './css/styles.css';
import {fetchCountries} from './fetchCountries'
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
  };

  refs.input.setAttribute('placeholder',"Enter country name")
  
  refs.input.addEventListener(
    'input',
    debounce(onInputSearchCountry, DEBOUNCE_DELAY)
  );
  
  function onInputSearchCountry(e) {
    const inputText = e.target.value;
    const valueNormalized = inputText.trim().toLowerCase();
  
    if (valueNormalized === '') {
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      return;
    } else {
      fetchCountries(valueNormalized)
        .then(countries => {
          const findCountry = countries.filter(({ name }) =>
            name.official.toLowerCase().includes(valueNormalized)
          );
  
          if (findCountry.length > 10) {
            refs.list.innerHTML = '';
            refs.info.innerHTML = '';
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          }
          if (findCountry.length > 1 && findCountry.length <= 10) {
            const markupList = createCountriesList(findCountry);
            refs.list.innerHTML = markupList;
            refs.info.innerHTML = '';
            return;
          }
  
          if (findCountry.length === 1) {
            const markupOneCountry = createCountryInformation(findCountry[0]);
            refs.info.innerHTML = markupOneCountry;
            refs.list.innerHTML = '';
            return;
          }
  
          if (findCountry.length === 0) {
            refs.list.innerHTML = '';
            refs.info.innerHTML = '';
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
        ({ name , flags }) => `
        <li class="list__item">
                <img src="${flags.svg}" alt="${name.official}" width="30" height="30"/>
                <h4>${name.official}</h4>
            </li>
        `
      )
      .join('');
  }
  
  function createCountryInformation({
    flags: { svg },
    name: {official} ,
    capital,
    population,
    languages,
  }) {
    const langs = Object.values(languages).join(', ');
    return `
    <div class="info__item">
            <div class="block-img">
              <img src="${svg}" alt="${official}" width="50"/>
              <h2>${official}</h2>
           </div>
                     <p><b>Capital:</b> ${capital}</p>
                     <p><b>Population:</b> ${population}</p>
                     <p><b>Languages:</b> ${langs}</p>
            </div>
    `
  }