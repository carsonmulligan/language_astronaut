import { initializeSolarSystem } from './scenes/solarSystem.js';
import { initializeFarmingWorld } from './scenes/farmingWorld.js';
import { checkUserAuth, loadUserPreferences } from './utils/userPreferences.js';

let currentScene = 'solarSystem'; // Default scene

// Initialize the application
function initApp() {
    checkUserAuth().then(user => {
        if (user) {
            loadUserPreferences(user).then(preferences => {
                // Use user preferences to customize the experience
                startScene(currentScene, preferences);
            });
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'auth/login.html';
        }
    });
}

// Start the appropriate scene based on the current scene
function startScene(scene, preferences) {
    if (scene === 'solarSystem') {
        initializeSolarSystem(onPlanetSelected);
    } else if (scene === 'farmingWorld') {
        initializeFarmingWorld(preferences);
    }
}

// Callback function for when a planet is selected in the solar system
function onPlanetSelected(planet) {
    currentScene = 'farmingWorld';
    startScene('farmingWorld', { selectedPlanet: planet });
}

initApp();
