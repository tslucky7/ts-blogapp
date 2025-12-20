// Global type definitions for the application

import { Application } from "@hotwired/stimulus"

declare global {
  interface Window {
    Stimulus: Application
  }
}

export {}

