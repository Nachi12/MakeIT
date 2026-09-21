/**
 * MakeIT — Static Website Configuration
 * 
 * Configure the URL of your separate MakeIT PHP backend server.
 * 
 * PRODUCTION EXAMPLE:
 *   API_BASE_URL: "https://api.makeit.digital"
 * 
 * LOCAL DEVELOPMENT EXAMPLE:
 *   API_BASE_URL: "http://127.0.0.1:8088"
 * 
 * When left empty (""), requests will use the relative path "/api/leads/create.php".
 */
window.MAKEIT_CONFIG = {
  // Configurable PHP backend API URL:
  // For production Netlify deployment: set to e.g. "https://api.makeit.digital"
  // For local testing:
  API_BASE_URL: "http://127.0.0.1:8088"
};
