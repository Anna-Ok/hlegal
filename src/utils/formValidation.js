export const FORM_MESSAGES = {
  required: 'This field cannot be empty',
  email: 'Invalid email format',
  phone: 'Invalid phone number',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value);
}

export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7;
}

export function getFieldValidationMessage(control) {
  if (!control) return '';

  const value = control.value.trim();
  if (!value) return FORM_MESSAGES.required;

  if (control.type === 'email' && !isValidEmail(value)) {
    return FORM_MESSAGES.email;
  }

  if (control.type === 'tel' && !isValidPhone(value)) {
    return FORM_MESSAGES.phone;
  }

  return '';
}

export function validateField(field, block) {
  const control = field.querySelector(`.${block}__input, .${block}__textarea`);
  const errorEl = field.querySelector(`.${block}__error`);
  const errorTextEl = field.querySelector(`.${block}__error-text`);
  const message = getFieldValidationMessage(control);

  if (message) {
    if (errorTextEl) errorTextEl.textContent = message;
    field.classList.add(`${block}__field--invalid`);
    control?.setAttribute('aria-invalid', 'true');
    return false;
  }

  field.classList.remove(`${block}__field--invalid`);
  control?.setAttribute('aria-invalid', 'false');
  if (errorTextEl) errorTextEl.textContent = '';
  return true;
}
