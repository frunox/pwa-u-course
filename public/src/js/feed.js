var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  console.log('In openCreatePostModal', deferredPrompt);
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    console.log('deferredPrompt exists');
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added app to home screen');
      }
    });
    deferredPrompt = null;
  }
  console.log('deferredPrompt not working', deferredPrompt);
  // CODE for unregistering SW on click of + button
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations().then((registrations) => {
  //     for (let i = 0; i < registrations.length; i++) {
  //       registrations[i].unregister();
  //     }
  //   });
  // }
}

function closeCreatePostModal() {
  console.log('in closeCreatePostModal');
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// NOT IN USE.  Enables 'cache on demand'
const onSaveButtonClicked = (event) => {
  console.log('CLICKED');
  if ('caches' in window) {
    caches.open('user-requested').then((cache) => {
      cache.add('https://httpbin.org/get');
      cache.add('/src/images/sf-boat.jpg');
    });
  }
};

const clearCards = () => {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
};

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'red';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // let cardSaveButton = document.createElement('button');
  // cardSupportingText.appendChild(cardSaveButton);
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

// add function to work with data from Firebase RTD
const updateUI = (data) => {
  clearCards();
  for (let i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
};

let url = 'https://pwagram-3bf0b-default-rtdb.firebaseio.com/posts.json';
// let url = 'https://httpbin.org/post';
let networkDataReceived = false;

// default GET request
fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log('FETCH from web: ', data);
    // convert the data object from RTD to an array
    let dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }

    updateUI(dataArray);
  });

// POST request
// fetch(url, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   body: JSON.stringify({
//     message: 'Some message',
//   }),
// })
//   .then(function (res) {
//     return res.json();
//   })
//   .then(function (data) {
//     networkDataReceived = true;
//     console.log('FETCH from web: ', data);
//     clearCards();
//     createCard();
//   });

if ('caches' in window) {
  caches
    .match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
    })
    .then((data) => {
      console.log('DATA from cache', data);
      if (!networkDataReceived) {
        let dataArray = [];
        for (let key in data) {
          dataArray.push(data[key]);
        }
        updateUI();
      }
    });
}

// POST request
// fetch(url, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   body: {
//     message: 'Some message',
//   },
// })
//   .then(function (res) {
//     return res.json();
//   })
//   .then(function (data) {
//     networkDataReceived = true;
//     console.log('FETCH from web: ', data);
//     clearCards();
//     createCard();
//   });

// if ('caches' in window) {
//   caches
//     .match(url)
//     .then((response) => {
//       if (response) {
//         return response.json();
//       }
//     })
//     .then((data) => {
//       console.log('DATA from cache', data);
//       if (!networkDataReceived) {
//         clearCards();
//         createCard();
//       }
//     });
// }
