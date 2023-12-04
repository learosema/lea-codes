const themePickerButton = document.querySelector('#themePickerButton');
themePickerButton.addEventListener('click', () => themePicker.showModal());

const currentTheme = localStorage?.getItem('theme');
if (currentTheme) {
  document.body.setAttribute('data-theme', currentTheme);
  const themeButton = document.querySelector(`.themes__button svg[data-theme="${currentTheme}"]`)?.parentElement;
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', true);
  }
}

const themeButtons = Array.from(document.querySelectorAll('.themes__button'));

themeButtons.forEach(button => button.addEventListener('click', () => {
  const newState = button.getAttribute('aria-pressed') !== 'true';
  const theme = button.querySelector('svg').getAttribute('data-theme');
  themeButtons.forEach(b => b.setAttribute('aria-pressed', b === button ? newState : false));
  if (newState) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  } else {
    document.body.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
  themePicker.close();
}));
