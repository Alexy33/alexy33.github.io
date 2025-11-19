// Categories page - Avec filtres et recherche
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Page Classifications chargée avec filtres');
  
  // Compter et logger les posts
  const sections = [
    { name: 'THM Learning', selector: '[data-type="thm-learning"] .post-item:not(.no-results)' },
    { name: 'THM Challenge', selector: '[data-type="thm-challenge"] .post-item:not(.no-results)' },
    { name: 'HTB Learning', selector: '[data-type="htb-learning"] .post-item:not(.no-results)' },
    { name: 'HTB Challenge', selector: '[data-type="htb-challenge"] .post-item:not(.no-results)' }
  ];
  
  console.log('📊 Statistiques:');
  let total = 0;
  sections.forEach(section => {
    const count = document.querySelectorAll(section.selector).length;
    console.log(`   ${section.name}: ${count} posts`);
    total += count;
  });
  console.log(`   Total: ${total} posts`);
});

// Fonction pour déplier/replier une section
function toggleSection(sectionId) {
  const section = document.querySelector(`[data-type="${sectionId}"]`);
  
  if (!section) {
    console.error(`Section ${sectionId} non trouvée`);
    return;
  }
  
  // Toggle la classe expanded
  section.classList.toggle('expanded');
  
  // Log de l'action
  const isExpanded = section.classList.contains('expanded');
  console.log(`${sectionId}: ${isExpanded ? 'ouvert' : 'fermé'}`);
}

// Fonction pour filtrer les posts par recherche
function filterPosts(sectionId) {
  const section = document.querySelector(`[data-type="${sectionId}"]`);
  if (!section) return;
  
  const searchInput = section.querySelector('.search-input');
  const searchTerm = searchInput.value.toLowerCase();
  const posts = section.querySelectorAll('.post-item:not(.no-results)');
  const noResults = section.querySelector('.no-results');
  
  let visibleCount = 0;
  
  posts.forEach(post => {
    const title = post.dataset.title;
    const difficulty = post.dataset.difficulty || 'all';
    
    // Vérifier si le post correspond à la recherche
    const matchesSearch = title.includes(searchTerm);
    
    // Vérifier si le post correspond au filtre de difficulté actif
    const activeFilter = section.querySelector('.difficulty-filter.active');
    const activeDifficulty = activeFilter ? activeFilter.textContent.toLowerCase() : 'tous';
    const matchesDifficulty = activeDifficulty === 'tous' || difficulty === activeDifficulty;
    
    // Afficher ou masquer le post
    if (matchesSearch && matchesDifficulty) {
      post.classList.remove('hidden');
      visibleCount++;
    } else {
      post.classList.add('hidden');
    }
  });
  
  // Afficher "Aucun résultat" si nécessaire
  if (noResults) {
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }
  
  console.log(`${sectionId}: ${visibleCount} posts affichés`);
}

// Fonction pour filtrer par difficulté
function filterByDifficulty(sectionId, difficulty) {
  const section = document.querySelector(`[data-type="${sectionId}"]`);
  if (!section) return;
  
  // Mettre à jour les boutons actifs
  const filters = section.querySelectorAll('.difficulty-filter');
  filters.forEach(filter => {
    if (filter.textContent.toLowerCase() === difficulty || (difficulty === 'all' && filter.textContent.toLowerCase() === 'tous')) {
      filter.classList.add('active');
    } else {
      filter.classList.remove('active');
    }
  });
  
  // Réappliquer le filtre (qui prend en compte la recherche ET la difficulté)
  filterPosts(sectionId);
  
  console.log(`${sectionId}: filtre difficulté = ${difficulty}`);
}