const JEDI_URL = '//jedi.smartjs.academy/dark-jedis/3616';

const fetch = (url) => {
  return window.fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((reason) => {
      console.error('Fetch error', reason);
    });
};

export default {
  start() {
    return fetch(JEDI_URL);
  },

  next(url) {

  },

  prev(url) {

  },

  hasNext() {

  }
};
