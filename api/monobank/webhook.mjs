import { handleWebhook } from '../_lib/monobank.mjs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handleWebhook
