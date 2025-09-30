import {onErrorCaptured} from 'vue'
import {Notify} from 'quasar';

export default function useErrorHandler() {

  onErrorCaptured((err, instance, info) => {
    if (typeof err === 'string') {
      Notify.create(err)
    } else {
      Notify.create(err.message || 'Unknown error')
    }
    console.log(err, instance, info);
    return false // prevents further propagation
  })

}
