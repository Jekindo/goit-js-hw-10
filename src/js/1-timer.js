import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let intervalId = null;
let isTimerOn = false;
let userSelectedDate = null;
const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  timer: document.querySelector('.timer'),
};
const datePicker = flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();

    if (userSelectedDate - Date.now() < 0) {
      iziToast.error({
        message: 'Please choose a date in the future',
        close: true,
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
      return;
    }

    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', onTick);

/*
 * Functions
 */

function onTick() {
  if (isTimerOn) {
    return;
  }

  isTimerOn = true;
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;
    const timeComponents = convertMs(deltaTime);

    updateClockFace(timeComponents);

    if (deltaTime < 0) {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);

  refs.input.disabled = false;

  const timeComponents = convertMs(0);
  updateClockFace(timeComponents);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateClockFace({ days, hours, minutes, seconds }) {
  const timerComponents = {
    days: refs.timer.querySelector('[data-days]'),
    hours: refs.timer.querySelector('[data-hours]'),
    minutes: refs.timer.querySelector('[data-minutes]'),
    seconds: refs.timer.querySelector('[data-seconds]'),
  };

  timerComponents.days.textContent = days;
  timerComponents.hours.textContent = hours;
  timerComponents.minutes.textContent = minutes;
  timerComponents.seconds.textContent = seconds;
}
