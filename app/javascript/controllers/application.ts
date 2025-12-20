import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false

// Extend Window interface to include Stimulus
declare global {
  interface Window {
    Stimulus: Application
  }
}

window.Stimulus = application

export { application }
