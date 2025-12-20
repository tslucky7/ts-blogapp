// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "./application"

// Eager load all controllers defined in the import map under controllers/**/*_controller
import HelloController from "./hello_controller"
application.register("hello", HelloController)
