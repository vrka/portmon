import {Dialog} from 'quasar';

/**
 * Wrap a function with a confirmation dialog
 * @param action () => Promise<void> | void Function to run if confirmed
 */
export function confirm(action, message = "Are you sure?") {
  Dialog.create({
    title: "Please confirm",
    message,
    cancel: true,
    persistent: true
  }).onOk(action)
}
