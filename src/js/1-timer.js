import iziToast from 'izitoast';
import flatpickr from 'flatpickr';

// styles
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  timeout: 10000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
});

let intervalId = null;
let userSelectedDate = null;
const dateField = document.querySelector('#datetime-picker');
const startButton = document.querySelector('.start-btn');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const isDateInFuture =
      new Date(selectedDate).getTime() > new Date().getTime();

    if (!isDateInFuture) {
      iziToast.show({
        title: 'Wrong date',
        message: 'Please choose a date in the future',
        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
      });
      startButton.disabled = true;
      return;
    }

    startButton.disabled = false;
    userSelectedDate = selectedDate;
  },
});

startButton.addEventListener('click', event => {
  if (!userSelectedDate) {
    return;
  }

  updateTimeUi();
  intervalId = setInterval(() => updateTimeUi(), 1000);
  startButton.disabled = true;
});

const daysElem = document.querySelector('span[data-days]');
const hoursElem = document.querySelector('span[data-hours]');
const minutesElem = document.querySelector('span[data-minutes]');
const secondsElem = document.querySelector('span[data-seconds]');

function updateTimeUi() {
  const differentMs =
    new Date(userSelectedDate).getTime() - new Date().getTime();
  if (new Date(userSelectedDate).getTime() - new Date().getTime() <= 0) {
    clearInterval(intervalId);

    daysElem.textContent = '00';
    hoursElem.textContent = '00';
    minutesElem.textContent = '00';
    secondsElem.textContent = '00';
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(differentMs);

  daysElem.textContent = days < 10 ? '0' + days : days;
  hoursElem.textContent = hours < 10 ? '0' + hours : hours;
  minutesElem.textContent = minutes < 10 ? '0' + minutes : minutes;
  secondsElem.textContent = seconds < 10 ? '0' + seconds : seconds;
}
