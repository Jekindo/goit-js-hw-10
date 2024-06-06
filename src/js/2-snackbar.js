import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  const data = {
    delay: form.elements.delay.value,
    state: form.elements.state.value,
  };

  createPromise(data).then(onFulfilled).catch(onRejected);

  form.reset();
}

function createPromise({ delay, state }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (state) {
        case 'fulfilled':
          resolve(`✅ Fulfilled promise in ${delay}ms`);
          break;

        case 'rejected':
          reject(`❌ Rejected promise in ${delay}ms`);
          break;
      }
    }, delay);
  });
}

function onFulfilled(result) {
  iziToast.success({
    message: result,
    close: true,
    position: 'topRight',
  });
}

function onRejected(error) {
  iziToast.error({
    message: error,
    close: true,
    position: 'topRight',
  });
}
