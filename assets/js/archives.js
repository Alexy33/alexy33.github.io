// Archives page JavaScript - Version compacte
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Page Archives chargée (version compacte)');
  
  // Initialisation des statistiques
  updateStats();
  
  // Ajout des transitions CSS
  document.querySelectorAll('.post-item').forEach(post => {
    post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  // Mettre à jour les compteurs d'année
  updateYearCounts();
});

function updateStats() {
  const allPosts = document.querySelectorAll('.post-item');
  let thmCount = 0;
  let htbCount = 0;
  let learningCount = 0;
  let challengeCount = 0;
  
  allPosts.forEach(post => {
    const platform = post.dataset.platform;
    const type = post.dataset.type;
    
    if (platform === 'thm') thmCount++;
    if (platform === 'htb') htbCount++;
    if (type === 'learning') learningCount++;
    if (type === 'challenge') challengeCount++;
  });
  
  const totalCount = allPosts.length;
  
  animateCounter('total-posts', totalCount);
  animateCounter('thm-posts', thmCount);
  animateCounter('htb-posts', htbCount);
  animateCounter('learning-posts', learningCount);
  animateCounter('challenge-posts', challengeCount);
  
  console.log(`📊 Stats: ${totalCount} posts total (THM: ${thmCount}, HTB: ${htbCount})`);
}

function updateYearCounts() {
  const yearSections = document.querySelectorAll('.year-section');
  
  yearSections.forEach(section => {
    const posts = section.querySelectorAll('.post-item');
    const count = posts.length;
    const yearCount = section.querySelector('.year-count');
    
    if (yearCount) {
      yearCount.textContent = count;
    }
  });
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const duration = 800;
  const steps = 25;
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

let currentFilters = {
  platform: 'all',
  type: 'all',
  sort: 'recent'
};

function sortByDate(sortType) {
  currentFilters.sort = sortType;
  
  // Gestion des boutons actifs
  document.querySelectorAll('.filter-btn-small[id^="btn-sort-"]').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-sort-${sortType}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  console.log(`🔄 Tri: ${sortType}`);
  applyFiltersAndSort();
}

function filterByPlatform(platform) {
  currentFilters.platform = platform;
  
  // Gestion des boutons actifs
  document.querySelectorAll('.filter-btn-small[id^="btn-platform-"]').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-platform-${platform}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  console.log(`🎯 Filtre plateforme: ${platform}`);
  applyFiltersAndSort();
}

function filterByType(type) {
  currentFilters.type = type;
  
  // Gestion des boutons actifs
  document.querySelectorAll('.filter-btn-small[id^="btn-type-"]').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-type-${type}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  console.log(`📚 Filtre type: ${type}`);
  applyFiltersAndSort();
}

function applyFiltersAndSort() {
  const yearSections = document.querySelectorAll('.year-section');
  let totalVisibleCount = 0;
  
  // Pour chaque section d'année
  yearSections.forEach(yearSection => {
    const posts = yearSection.querySelectorAll('.post-item');
    const postsArray = Array.from(posts);
    const postsList = yearSection.querySelector('.posts-list');
    const yearCount = yearSection.querySelector('.year-count');
    
    // Filtrage
    let visiblePostsInYear = postsArray.filter(post => {
      const platform = post.dataset.platform;
      const type = post.dataset.type;
      
      let shouldShow = true;
      
      // Filtre par plateforme
      if (currentFilters.platform !== 'all' && platform !== currentFilters.platform) {
        shouldShow = false;
      }
      
      // Filtre par type
      if (currentFilters.type !== 'all' && type !== currentFilters.type) {
        shouldShow = false;
      }
      
      return shouldShow;
    });
    
    // Tri par date au sein de chaque année
    visiblePostsInYear.sort((a, b) => {
      const dateA = parseInt(a.dataset.timestamp);
      const dateB = parseInt(b.dataset.timestamp);
      
      if (currentFilters.sort === 'recent') {
        return dateB - dateA; // Plus récent en premier
      } else {
        return dateA - dateB; // Plus ancien en premier
      }
    });
    
    // Cacher tous les posts d'abord
    postsArray.forEach(post => {
      post.style.display = 'none';
      post.style.opacity = '0';
    });
    
    // Réorganiser et afficher les posts visibles
    visiblePostsInYear.forEach((post, index) => {
      postsList.appendChild(post);
      setTimeout(() => {
        post.style.display = 'block';
        setTimeout(() => {
          post.style.opacity = '1';
          post.style.transform = 'translateX(0)';
        }, 10);
      }, index * 30);
    });
    
    // Mettre à jour le compteur d'année
    if (yearCount) {
      yearCount.textContent = visiblePostsInYear.length;
    }
    
    // Gérer la visibilité de la section année
    if (visiblePostsInYear.length > 0) {
      yearSection.style.display = 'block';
      totalVisibleCount += visiblePostsInYear.length;
    } else {
      yearSection.style.display = 'none';
    }
  });
  
  // Réorganiser les sections d'année selon le tri
  const timelineContainer = document.querySelector('.timeline-container');
  const yearSectionsArray = Array.from(yearSections);
  
  yearSectionsArray.sort((a, b) => {
    const yearA = parseInt(a.dataset.year);
    const yearB = parseInt(b.dataset.year);
    
    if (currentFilters.sort === 'recent') {
      return yearB - yearA; // Années récentes en premier
    } else {
      return yearA - yearB; // Années anciennes en premier
    }
  });
  
  yearSectionsArray.forEach(section => {
    timelineContainer.appendChild(section);
  });
  
  console.log(`✅ ${totalVisibleCount} posts affichés`);
  updateNoResults(totalVisibleCount === 0);
}

function searchPosts() {
  const searchTerm = document.getElementById('post-search').value.toLowerCase();
  const yearSections = document.querySelectorAll('.year-section');
  let totalVisibleCount = 0;
  
  if (searchTerm === '') {
    // Si la recherche est vide, réappliquer les filtres normaux
    applyFiltersAndSort();
    return;
  }
  
  yearSections.forEach(yearSection => {
    const posts = yearSection.querySelectorAll('.post-item');
    const yearCount = yearSection.querySelector('.year-count');
    let visiblePostsInYear = 0;
    
    posts.forEach(post => {
      const title = post.dataset.title.toLowerCase();
      const platform = post.dataset.platform;
      const type = post.dataset.type;
      
      // Vérifier si le post correspond à la recherche ET aux filtres actifs
      let shouldShow = title.includes(searchTerm);
      
      if (shouldShow && currentFilters.platform !== 'all' && platform !== currentFilters.platform) {
        shouldShow = false;
      }
      
      if (shouldShow && currentFilters.type !== 'all' && type !== currentFilters.type) {
        shouldShow = false;
      }
      
      if (shouldShow) {
        post.style.display = 'block';
        post.style.opacity = '1';
        post.style.transform = 'translateX(0)';
        visiblePostsInYear++;
        totalVisibleCount++;
      } else {
        post.style.opacity = '0';
        post.style.transform = 'translateX(-10px)';
        setTimeout(() => {
          post.style.display = 'none';
        }, 200);
      }
    });
    
    // Mettre à jour le compteur d'année
    if (yearCount) {
      yearCount.textContent = visiblePostsInYear;
    }
    
    // Gérer la visibilité de la section année
    if (visiblePostsInYear > 0) {
      yearSection.style.display = 'block';
    } else {
      yearSection.style.display = 'none';
    }
  });
  
  console.log(`🔍 Recherche "${searchTerm}": ${totalVisibleCount} résultats`);
  updateNoResults(totalVisibleCount === 0);
}

function updateNoResults(show) {
  const noResults = document.getElementById('no-results');
  if (noResults) {
    noResults.style.display = show ? 'block' : 'none';
  }
}