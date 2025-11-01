// Archives page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des statistiques
  updateStats();
  
  // Ajout des transitions CSS
  document.querySelectorAll('.post-item').forEach(post => {
    post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  // Gestion de l'affichage des filtres de difficulté
  updateDifficultyFilters('all');
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
  difficulty: 'all',
  sort: 'recent'
};

function sortByDate(sortType) {
  currentFilters.sort = sortType;
  
  // Gestion des boutons actifs
  document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-sort-${sortType}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  applyFiltersAndSort();
}

function filterByPlatform(platform) {
  currentFilters.platform = platform;
  currentFilters.type = 'all';
  currentFilters.difficulty = 'all';
  
  // Gestion des boutons actifs
  document.querySelectorAll('.platform-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-platform-${platform}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Réinitialiser les autres filtres
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-type-all').classList.add('active');
  
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  const allDiffBtn = document.getElementById('btn-difficulty-all');
  if (allDiffBtn) allDiffBtn.classList.add('active');
  
  // Afficher les filtres de difficulté appropriés
  updateDifficultyFilters(platform);
  
  applyFiltersAndSort();
}

function filterByType(type) {
  currentFilters.type = type;
  currentFilters.difficulty = 'all';
  
  // Gestion des boutons actifs
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-type-${type}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Réinitialiser le filtre de difficulté
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  const allDiffBtn = document.getElementById('btn-difficulty-all');
  if (allDiffBtn) allDiffBtn.classList.add('active');
  
  applyFiltersAndSort();
}

function filterByDifficulty(difficulty) {
  currentFilters.difficulty = difficulty;
  
  // Gestion des boutons actifs
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-difficulty-${difficulty}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  applyFiltersAndSort();
}

function updateDifficultyFilters(platform) {
  const thmDifficulty = document.getElementById('thm-difficulty');
  const htbDifficulty = document.getElementById('htb-difficulty');
  
  if (platform === 'thm') {
    thmDifficulty.style.display = 'block';
    htbDifficulty.style.display = 'none';
  } else if (platform === 'htb') {
    thmDifficulty.style.display = 'none';
    htbDifficulty.style.display = 'block';
  } else {
    thmDifficulty.style.display = 'none';
    htbDifficulty.style.display = 'none';
  }
}

function applyFiltersAndSort() {
  const yearSections = document.querySelectorAll('.year-section');
  const visibleYears = new Set();
  let visibleCount = 0;
  
  // Pour chaque section d'année
  yearSections.forEach(yearSection => {
    const posts = yearSection.querySelectorAll('.post-item');
    const postsArray = Array.from(posts);
    const postsList = yearSection.querySelector('.posts-list');
    const year = yearSection.dataset.year;
    
    // Filtrage
    let visiblePostsInYear = postsArray.filter(post => {
      const platform = post.dataset.platform;
      const type = post.dataset.type;
      const difficulty = post.dataset.difficulty;
      
      let shouldShow = true;
      
      // Filtre par plateforme
      if (currentFilters.platform !== 'all' && platform !== currentFilters.platform) {
        shouldShow = false;
      }
      
      // Filtre par type
      if (currentFilters.type !== 'all' && type !== currentFilters.type) {
        shouldShow = false;
      }
      
      // Filtre par difficulté
      if (currentFilters.difficulty !== 'all' && difficulty !== currentFilters.difficulty) {
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
        post.style.display = 'flex';
        setTimeout(() => {
          post.style.opacity = '1';
          post.style.transform = 'translateY(0)';
        }, 10);
      }, index * 30);
    });
    
    // Gérer la visibilité de la section année
    if (visiblePostsInYear.length > 0) {
      yearSection.style.display = 'block';
      visibleYears.add(year);
      visibleCount += visiblePostsInYear.length;
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
  
  updateNoResults(visibleCount === 0);
}

function searchPosts() {
  const searchTerm = document.getElementById('post-search').value.toLowerCase();
  const yearSections = document.querySelectorAll('.year-section');
  let visibleCount = 0;
  
  yearSections.forEach(yearSection => {
    const posts = yearSection.querySelectorAll('.post-item');
    let visiblePostsInYear = 0;
    
    posts.forEach(post => {
      const title = post.dataset.title.toLowerCase();
      
      if (title.includes(searchTerm)) {
        post.style.display = 'flex';
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
        visiblePostsInYear++;
        visibleCount++;
      } else {
        post.style.opacity = '0';
        post.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          post.style.display = 'none';
        }, 200);
      }
    });
    
    // Gérer la visibilité de la section année
    if (visiblePostsInYear > 0) {
      yearSection.style.display = 'block';
    } else {
      yearSection.style.display = 'none';
    }
  });
  
  updateNoResults(visibleCount === 0);
}

function updateNoResults(show) {
  const noResults = document.getElementById('no-results');
  if (noResults) {
    noResults.style.display = show ? 'block' : 'none';
  }
}