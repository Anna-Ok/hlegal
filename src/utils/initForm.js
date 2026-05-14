import { validateField } from './formValidation.js';

const LOADING_DELAY_MS = 800;
const SUCCESS_DELAY_MS = 500;

function getFieldControl(field, block) {
  return field.querySelector(`.${block}__input, .${block}__textarea`);
}

function syncFilledState(field, block) {
  const control = getFieldControl(field, block);
  if (!control) return;

  field.classList.toggle(`${block}__field--filled`, control.value.length > 0);
}

function clearFieldError(field, block) {
  field.classList.remove(`${block}__field--invalid`);
  const control = getFieldControl(field, block);
  const errorTextEl = field.querySelector(`.${block}__error-text`);

  control?.setAttribute('aria-invalid', 'false');
  if (errorTextEl) errorTextEl.textContent = '';
}

function syncSubmitState(form, submit, block) {
  if (!submit) return;

  const hasInvalid = !!form.querySelector(`.${block}__field--invalid`);
  submit.disabled = hasInvalid;
}

function bindField(field, form, submit, block) {
  const control = getFieldControl(field, block);
  const clearBtn = field.querySelector(`.${block}__clear`);
  if (!control) return;

  syncFilledState(field, block);

  control.addEventListener('input', () => {
    syncFilledState(field, block);

    if (field.classList.contains(`${block}__field--invalid`)) {
      if (control.value.length === 0) {
        clearFieldError(field, block);
      } else {
        validateField(field, block);
      }
    }

    syncSubmitState(form, submit, block);
  });

  clearBtn?.addEventListener('click', () => {
    control.value = '';
    field.classList.remove(`${block}__field--filled`, `${block}__field--invalid`);
    clearFieldError(field, block);
    control.focus();
    syncSubmitState(form, submit, block);
  });
}

export function initForm({
  form,
  block,
  submit,
  submitLabel = 'Send message',
  onSuccess,
  loadingDelay = LOADING_DELAY_MS,
  successDelay = SUCCESS_DELAY_MS,
}) {
  if (!form || !block) {
    return { reset() {} };
  }

  const fields = [...form.querySelectorAll(`.${block}__field`)];
  fields.forEach(field => bindField(field, form, submit, block));

  const reset = () => {
    form.reset();
    fields.forEach(field => {
      field.classList.remove(`${block}__field--filled`, `${block}__field--invalid`);
      clearFieldError(field, block);
    });

    if (submit) {
      submit.classList.remove('btn--loading', 'btn--sent');
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!submit) return;

    submit.classList.add('btn--loading');
    submit.disabled = true;

    window.setTimeout(() => {
      const allValid = fields.map(field => validateField(field, block)).every(Boolean);

      if (!allValid) {
        submit.classList.remove('btn--loading');
        submit.disabled = true;
        syncSubmitState(form, submit, block);
        return;
      }

      window.setTimeout(() => {
        submit.classList.remove('btn--loading');
        submit.classList.add('btn--sent');
        submit.textContent = 'Sent';
        submit.disabled = true;
        onSuccess?.();
      }, successDelay);
    }, loadingDelay);
  });

  return { reset };
}
