const MIN_LENGTH = 8;
const hasNumber = /\d/;
const hasLetter = /[a-zA-Z]/;

function validatePassword(password) {
  return password.length >= MIN_LENGTH && hasNumber.test(password) && hasLetter.test(password);
}

module.exports = { validatePassword };
