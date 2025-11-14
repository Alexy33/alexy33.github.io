// categories.js - Gestion des statistiques de la page catégories

document.addEventListener('DOMContentLoaded', function() {
  // Récupérer tous les éléments de posts sur la page
  const categoryLists = document.querySelectorAll('.category-list');
  
  let totalPosts = 0;
  let thmPosts = 0;
  let htbPosts = 0;
  
  // Parcourir chaque liste de catégories
  categoryLists.forEach(list => {
    const categoryName = list.querySelector('.category-name')?.textContent.toLowerCase() || '';
    const postCount = list.querySelectorAll('.post-preview').length;
    
    totalPosts += postCount;
    
    if (categoryName.includes('tryhackme') || categoryName.includes('thm')) {
      thmPosts += postCount;
    } else if (categoryName.includes('hackthebox') || categoryName.includes('htb')) {
      htbPosts += postCount;
    }
  });
  
  // Mettre à jour les compteurs si les éléments existent
  const totalElement = document.getElementById('total-posts');
  const thmElement = document.getElementById('thm-posts');
  const htbElement = document.getElementById('htb-posts');
  
  if (totalElement) totalElement.textContent = totalPosts;
  if (thmElement) thmElement.textContent = thmPosts;
  if (htbElement) htbElement.textContent = htbPosts;
  
  console.log('Stats calculées:', { total: totalPosts, thm: thmPosts, htb: htbPosts });
});