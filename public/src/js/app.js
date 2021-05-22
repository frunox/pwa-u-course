var deferredPrompt;

// enable polyfills (promise.js)if Promise is not supported
if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function () {
    console.log('Service worker registered!');
  });
}

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

var promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('This is executed once the timer is done');
    // reject({ code: 500, message: 'An error happened' });
  }, 3000);
});

// fetch GET request
fetch('https://httpbin.org/ip')
  .then((response) => {
    console.log('FETCH', response);
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('ERROR', err);
  });

// fetch POST request
fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  body: JSON.stringify({ message: 'Working???' }),
})
  .then((response) => {
    console.log('FETCH', response);
    return response.json();
  })
  .then((data) => {
    console.log(data.json);
  })
  .catch((err) => {
    console.log('ERROR', err);
  });

promise
  .then((text) => {
    return text;
  })
  .then((newText) => {
    console.log(newText);
  })
  .catch((err) => {
    console.log('Promise error', err.code, err.message);
  });

console.log('This is executed after setTimeout is called');
