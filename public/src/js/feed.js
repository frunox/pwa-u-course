var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);

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
}

function closeCreatePostModal() {
  console.log('in closeCreatePostModal');
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
