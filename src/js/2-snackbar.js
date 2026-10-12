import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  timeout: 10000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
});

const form = document.querySelector('.form');

function createPromise({ delay, isFulfilled }) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      isFulfilled ? res(delay) : rej(delay);
    }, delay);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const stateValue = formData.get('state');
  const delayMs = Number(formData.get('delay'));

  const eventPromise = createPromise({
    delay: delayMs,
    isFulfilled: stateValue === 'fulfilled',
  });

  e.currentTarget.reset();
  eventPromise
    .then(delay => {
      iziToast.success({
        position: 'topRight',
        messageColor: '#fff',
        progressBar: false,
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        position: 'topRight',
        messageColor: '#fff',
        progressBar: false,
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });
});
