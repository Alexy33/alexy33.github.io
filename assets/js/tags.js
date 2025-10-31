// Tags page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des statistiques
  const totalTags = document.querySelectorAll('.tag-card').length;
  let totalPosts = 0;
  
  document.querySelectorAll('.tag-card').forEach(card => {
    totalPosts += parseInt(card.dataset.count);
  });
  
  animateCounter('total-tags', totalTags);
  animateCounter('total-posts', totalPosts);
});

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

function sortTags(method) {
  const container = document.getElementById('tags-container');
  const cards = Array.from(container.getElementsByClassName('tag-card'));
  
  // Gestion des boutons actifs
  document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('btn-' + method);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Filtrage par plateforme
  if (method === 'thm' || method === 'htb') {
    cards.forEach(card => {
      if (card.dataset.platform === method) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    
    // Tri alphabétique après filtrage
    const visibleCards = cards.filter(card => card.style.display !== 'none');
    visibleCards.sort((a, b) => a.dataset.tag.localeCompare(b.dataset.tag));
    visibleCards.forEach(card => container.appendChild(card));
    
    updateNoResults();
    return;
  }
  
  // Afficher tous les tags si "all"
  if (method === 'all') {
    cards.forEach(card => {
      card.style.display = 'flex';
    });
  }
  
  // Tri des cartes
  cards.sort((a, b) => {
    switch(method) {
      case 'alpha':
      case 'all':
        return a.dataset.tag.localeCompare(b.dataset.tag);
      case 'count':
        return parseInt(b.dataset.count) - parseInt(a.dataset.count);
      case 'recent':
        return parseInt(b.dataset.date) - parseInt(a.dataset.date);
      default:
        return 0;
    }
  });
  
  // Réorganisation avec animation
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      container.appendChild(card);
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    }, index * 20);
  });
  
  updateNoResults();
}

function filterTags() {
  const searchTerm = document.getElementById('tag-search').value.toLowerCase();
  const cards = document.querySelectorAll('.tag-card');
  
  cards.forEach(card => {
    const tagName = card.dataset.tag;
    if (tagName.includes(searchTerm)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
  
  updateNoResults();
}

function updateNoResults() {
  const cards = document.querySelectorAll('.tag-card');
  const visibleCount = Array.from(cards).filter(card => card.style.display !== 'none').length;
  const noResults = document.getElementById('no-results');
  
  if (noResults) {
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }
}

// Ajout de transitions CSS
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tag-card').forEach(card => {
    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  });
});