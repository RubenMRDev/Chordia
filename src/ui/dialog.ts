import Swal, { type SweetAlertOptions } from 'sweetalert2';

/**
 * The only place in the product that opens a dialog.
 *
 * Appearance comes from `src/styles/dialog.css`, so nothing here passes colours.
 * Callers pass already-translated strings: this module has no access to the
 * locale context, and every call site is inside a component that does.
 */

const base: SweetAlertOptions = {
  buttonsStyling: false,
  // Focus goes to the safe choice, so Enter never confirms a deletion.
  focusCancel: false,
  reverseButtons: true,
  showClass: { popup: 'swal2-noanimate' },
  hideClass: { popup: 'swal2-noanimate' },
};

interface NotifyOptions {
  title: string;
  text?: string;
  html?: string;
  confirmLabel: string;
}

/** Something worked. */
export const notifyOk = (options: NotifyOptions): Promise<unknown> =>
  Swal.fire({
    ...base,
    icon: 'success',
    title: options.title,
    text: options.text,
    html: options.html,
    confirmButtonText: options.confirmLabel,
  });

/** Something failed, and the message names what. */
export const notifyError = (options: NotifyOptions): Promise<unknown> =>
  Swal.fire({
    ...base,
    icon: 'error',
    title: options.title,
    text: options.text,
    html: options.html,
    confirmButtonText: options.confirmLabel,
  });

/** Something the visitor should know before carrying on. */
export const notifyInfo = (options: NotifyOptions): Promise<unknown> =>
  Swal.fire({
    ...base,
    icon: 'info',
    title: options.title,
    text: options.text,
    html: options.html,
    confirmButtonText: options.confirmLabel,
  });

interface ConfirmOptions {
  title: string;
  text?: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Dresses the confirm button in damper felt and focuses cancel. */
  destructive?: boolean;
}

/** Returns true only when the visitor actually confirmed. */
export const confirmAction = async (
  options: ConfirmOptions,
): Promise<boolean> => {
  const result = await Swal.fire({
    ...base,
    icon: options.destructive ? 'warning' : 'question',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmLabel,
    cancelButtonText: options.cancelLabel,
    focusCancel: Boolean(options.destructive),
    customClass: options.destructive
      ? { popup: 'chordia-destructive' }
      : undefined,
  });
  return result.isConfirmed;
};

/**
 * Escape hatch for a one-off dialog that does not fit the shapes above.
 *
 * It exists so no call site ever calls `Swal.fire` directly: SweetAlert styles
 * its own buttons inline unless `buttonsStyling` is off, and an inline
 * background beats the stylesheet — so a forgotten flag means a stock blue
 * button in the middle of this palette.
 */
export const openDialog = (options: SweetAlertOptions): Promise<unknown> =>
  /*
    The cast is needed because SweetAlert's options type is a discriminated
    union over `input`, and spreading two objects together collapses that
    discrimination. The merged value is still a valid `SweetAlertOptions`.
  */
  Swal.fire({ ...base, ...options } as SweetAlertOptions);

interface ChoiceOptions extends ConfirmOptions {
  text?: string;
}

/**
 * A success dialog that offers a follow-up action, e.g. "saved — view the
 * song?". Returns true when the follow-up was chosen.
 */
export const confirmNext = async (
  options: ChoiceOptions,
): Promise<boolean> => {
  const result = await Swal.fire({
    ...base,
    icon: 'success',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmLabel,
    cancelButtonText: options.cancelLabel,
  });
  return result.isConfirmed;
};
