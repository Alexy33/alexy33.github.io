// Certifications page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Animation des compteurs
  animateCounter('completed-count', 2);
  animateCounter('progress-count', 1);
  animateCounter('planned-count', 1);
  animateCounter('total-count', 4);
});

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const duration = 1000;
  const steps = 30;
  const increment = targetValue / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetValue) {
      element.textContent = targetValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, duration / steps);
}