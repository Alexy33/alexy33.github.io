// Roadmap HTB Academy Progress - JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Initialisation de la Roadmap HTB...');
  
  // Récupérer les données depuis le script JSON injecté
  const dataScript = document.getElementById('htb-data');
  
  if (!dataScript) {
    console.error('❌ Script htb-data non trouvé');
    displayHTBProgressError();
    return;
  }
  
  try {
    const htbData = JSON.parse(dataScript.textContent);
    console.log('✅ Données HTB chargées:', htbData);
    
    if (htbData && htbData.overall_progress !== undefined) {
      displayHTBProgress(htbData);
    } else {
      console.error('❌ Données HTB invalides');
      displayHTBProgressError();
    }
  } catch (error) {
    console.error('❌ Erreur parsing JSON:', error);
    displayHTBProgressError();
  }
});

function displayHTBProgress(data) {
  console.log('📊 Affichage des données HTB...');
  
  // Progression globale
  const progressPercent = document.getElementById('htb-progress-percent');
  const progressBar = document.getElementById('htb-progress-bar');
  
  if (progressPercent) {
    progressPercent.textContent = data.overall_progress + '%';
    console.log('  - Progression:', data.overall_progress + '%');
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
    console.log('  - Modules complétés:', data.completed_modules);
  }
  
  if (totalModules) {
    totalModules.textContent = data.total_modules || 28;
    console.log('  - Total modules:', data.total_modules);
  }
  
  if (remaining) {
    const remainingCount = (data.total_modules || 28) - (data.completed_modules || 0);
    remaining.textContent = remainingCount;
    console.log('  - Modules restants:', remainingCount);
  }
  
  // Module en cours avec détails
  if (data.modules && data.modules.length > 0) {
    const currentModule = data.modules.find(m => m.state === 'in_progress');
    
    if (currentModule) {
      console.log('  - Module en cours trouvé:', currentModule.name);
      displayCurrentModule(currentModule);
    } else {
      console.log('  - Aucun module en cours (state=in_progress)');
    }
  } else {
    console.log('  - Aucun module dans les données');
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
    console.log('  - Dernière mise à jour:', date.toLocaleDateString('fr-FR', options));
  }
  
  console.log('✅ Affichage terminé avec succès');
}

function displayCurrentModule(module) {
  console.log('📚 Affichage du module en cours:', module);
  
  const currentModuleContainer = document.getElementById('current-module-container');
  const currentModuleName = document.getElementById('current-module-name');
  const moduleBadges = document.getElementById('module-badges');
  const moduleProgressPercent = document.getElementById('module-progress-percent');
  const moduleProgressFill = document.getElementById('module-progress-fill');
  const moduleSectionsInfo = document.getElementById('module-sections-info');
  const moduleTimeInfo = document.getElementById('module-time-info');
  
  // Afficher le container
  if (currentModuleContainer) {
    currentModuleContainer.style.display = 'block';
  }
  
  // Nom du module
  if (currentModuleName) {
    currentModuleName.textContent = module.name;
  }
  
  // Badges (difficulté et tier)
  if (moduleBadges) {
    let badgesHTML = '';
    
    if (module.difficulty) {
      badgesHTML += `<span class="module-badge difficulty">${module.difficulty}</span>`;
    }
    
    if (module.tier) {
      badgesHTML += `<span class="module-badge tier">${module.tier}</span>`;
    }
    
    moduleBadges.innerHTML = badgesHTML;
    console.log('  - Badges ajoutés:', module.difficulty, module.tier);
  }
  
  // Progression du module
  if (moduleProgressPercent) {
    moduleProgressPercent.textContent = module.progress + '%';
    console.log('  - Progression module:', module.progress + '%');
  }
  
  if (moduleProgressFill) {
    moduleProgressFill.style.width = module.progress + '%';
  }
  
  // Sections (calculer les sections complétées)
  if (moduleSectionsInfo && module.sections_count) {
    const completedSections = Math.floor((module.progress / 100) * module.sections_count);
    moduleSectionsInfo.textContent = `${completedSections} / ${module.sections_count} sections`;
    console.log('  - Sections:', completedSections, '/', module.sections_count);
  }
  
  // Temps estimé
  if (moduleTimeInfo && module.estimated_time) {
    moduleTimeInfo.textContent = `⏱️ ${module.estimated_time}`;
    console.log('  - Temps estimé:', module.estimated_time);
  }
}

function displayHTBProgressError() {
  console.error('⚠️ Affichage en mode erreur');
  
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
  
  console.log('⚠️ Valeurs par défaut affichées');
}