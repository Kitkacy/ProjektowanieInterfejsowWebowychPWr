import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://piwowicka.web.app',
    setupNodeEvents(on, config) {

    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
})
