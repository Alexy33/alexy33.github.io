// Categories page - Version ultra minimale
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Page Classifications chargée');
  
  // Récupérer les compteurs affichés
  const typeSections = document.querySelectorAll('.type-section');
  
  let thmLearning = 0;
  let thmChallenge = 0;
  let htbLearning = 0;
  let htbChallenge = 0;
  
  typeSections.forEach((section, index) => {
    const count = parseInt(section.querySelector('.type-count').textContent);
    
    if (index === 0) thmLearning = count;
    if (index === 1) thmChallenge = count;
    if (index === 2) htbLearning = count;
    if (index === 3) htbChallenge = count;
  });
  
  console.log('📊 Statistiques:');
  console.log(`   THM Learning: ${thmLearning} posts`);
  console.log(`   THM Challenge: ${thmChallenge} posts`);
  console.log(`   HTB Learning: ${htbLearning} posts`);
  console.log(`   HTB Challenge: ${htbChallenge} posts`);
  console.log(`   Total: ${thmLearning + thmChallenge + htbLearning + htbChallenge} posts`);
  
  // Animation légère au survol
  const platformFolders = document.querySelectorAll('.platform-folder');
  platformFolders.forEach(folder => {
    folder.style.transition = 'all 0.3s ease';
  });
  
  const typeSectionsAll = document.querySelectorAll('.type-section');
  typeSectionsAll.forEach(section => {
    section.style.transition = 'all 0.3s ease';
  });
});