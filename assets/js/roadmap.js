// Roadmap HTB Academy Progress - JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Chargement des données HTB...');
  loadHTBProgress();
});

function loadHTBProgress() {
  // Charger le fichier JSON
  fetch('/_data/htb-progress.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Données HTB chargées:', data);
      displayHTBProgress(data);
    })
    .catch(error => {
      console.error('❌ Erreur lors du chargement des données HTB:', error);
      displayHTBProgressError();
    });
}

function displayHTBProgress(data) {
  console.log('📊 Affichage des données...');
  
  // Progression globale
  const progressPercent = document.getElementById('htb-progress-percent');
  const progressBar = document.getElementById('htb-progress-bar');
  
  if (progressPercent) {
    progressPercent.textContent = data.overall_progress + '%';
  }
  
  if (progressBar) {
    progressBar.style.width = data.overall_progress + '%';
  }
  
  // Stats modules
  const completedModules = document.getElementById('htb-completed-modules');
  const totalModules = document.getElementById('htb-total-modules');
  const remaining = document.getElementById('htb-remaining');
  
  if (completedModules) {
    completedModules.textContent = data.completed_modules || 0;
  }
  
  if (totalModules) {
    totalModules.textContent = data.total_modules || 28;
  }
  
  if (remaining) {
    remaining.textContent = (data.total_modules || 28) - (data.completed_modules || 0);
  }
  
  // Module en cours
  const currentModuleContainer = document.getElementById('current-module-container');
  const currentModuleName = document.getElementById('current-module-name');
  
  if (data.current_module && data.current_module !== 'En attente de mise à jour') {
    if (currentModuleContainer) {
      currentModuleContainer.style.display = 'block';
    }
    if (currentModuleName) {
      currentModuleName.textContent = data.current_module;
    }
  }
  
  // Dernière mise à jour
  const lastUpdated = document.getElementById('htb-last-updated');
  if (lastUpdated && data.last_updated) {
    const date = new Date(data.last_updated);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    lastUpdated.textContent = date.toLocaleDateString('fr-FR', options);
  }
  
  console.log('✅ Affichage terminé');
}

function displayHTBProgressError() {
  console.error('⚠️ Affichage du mode erreur');
  
  // Afficher des valeurs par défaut
  const elements = {
    'htb-progress-percent': '0',
    'htb-completed-modules': '0',
    'htb-total-modules': '28',
    'htb-remaining': '28',
    'htb-last-updated': 'Données non disponibles'
  };
  
  for (const [id, value] of Object.entries(elements)) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.textContent = value;
    }
  }
  
  // Masquer le module en cours
  const currentModuleContainer = document.getElementById('current-module-container');
  if (currentModuleContainer) {
    currentModuleContainer.style.display = 'none';
  }
}