---
layout: page
icon: fas fa-archive
order: 3
---

<style>
  /* Variables Mechanicus */
  :root {
    --mechanicus-orange: #ff6b00;
    --mechanicus-orange-subtle: rgba(255, 107, 0, 0.15);
    --mechanicus-orange-hover: rgba(255, 107, 0, 0.3);
    --mechanicus-black: #0a0a0a;
    --mechanicus-dark-grey: #1a1a1a;
    --mechanicus-mid-grey: #2a2a2a;
    --mechanicus-light-grey: #3a3a3a;
    --mechanicus-white: #ffffff;
    --mechanicus-text: #e8e8e8;
    --mechanicus-text-muted: #a0a0a0;
    --mechanicus-border: #2a2a2a;
    --thm-green: #1db954;
    --htb-green: #9fef00;
  }

  .archives-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 2rem 1rem 1rem 1rem;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .archives-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  .archives-header p {
    color: var(--mechanicus-text-muted);
    font-size: 0.95rem;
    letter-spacing: 1px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .stat-card {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 2px solid var(--mechanicus-orange);
    padding: 1.2rem;
    border-radius: 2px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    background: var(--mechanicus-orange-subtle);
    transform: translateY(-2px);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.3rem;
  }

  .stat-label {
    color: var(--mechanicus-text-muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  /* Filtres compacts en haut */
  .compact-filters {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    padding: 1.2rem;
    margin: 0 1rem 2rem 1rem;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }

  .filters-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .filter-group-inline {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-label-inline {
    color: var(--mechanicus-white);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    white-space: nowrap;
  }

  .filter-btn-small {
    padding: 0.5rem 0.9rem;
    background: var(--mechanicus-black);
    color: var(--mechanicus-text);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
    white-space: nowrap;
    font-family: 'Courier New', monospace;
  }

  .filter-btn-small:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-white);
  }

  .filter-btn-small.active {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-white);
    border-color: var(--mechanicus-orange);
    font-weight: 700;
  }

  .filter-btn-small i {
    font-size: 0.8rem;
    margin-right: 0.3rem;
  }

  /* Barre de recherche compacte */
  .search-bar-compact {
    width: 100%;
    max-width: 400px;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mechanicus-text-muted);
    font-size: 0.9rem;
    pointer-events: none;
  }

  .post-search {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    font-size: 0.85rem;
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    background: var(--mechanicus-black);
    color: var(--mechanicus-white);
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
  }

  .post-search:focus {
    outline: none;
    border-color: var(--mechanicus-orange);
    background: var(--mechanicus-dark-grey);
    box-shadow: 0 0 0 2px var(--mechanicus-orange-subtle);
  }

  .post-search::placeholder {
    color: var(--mechanicus-text-muted);
    opacity: 0.6;
  }

  .mechanicus-divider {
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      var(--mechanicus-border) 20%, 
      var(--mechanicus-border) 80%, 
      transparent
    );
    margin: 2.5rem 1rem;
  }

  /* TIMELINE - élément principal */
  .timeline-container {
    position: relative;
    padding: 0 1rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .year-section {
    margin-bottom: 3rem;
  }

  .year-header {
    position: relative;
    margin: 0 0 2rem 3rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .year-marker {
    position: absolute;
    left: -3rem;
    width: 18px;
    height: 18px;
    background: var(--mechanicus-orange);
    border-radius: 50%;
    border: 4px solid var(--mechanicus-black);
    box-shadow: 0 0 0 3px var(--mechanicus-orange);
  }

  .year-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
    margin: 0;
  }

  .year-count {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-orange);
    border: 1px solid var(--mechanicus-orange);
    padding: 0.3rem 0.7rem;
    border-radius: 2px;
    font-size: 0.8rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
  }

  .posts-list {
    position: relative;
    padding-left: 3rem;
    border-left: 3px solid var(--mechanicus-border);
  }

  .post-item {
    position: relative;
    margin-bottom: 0.8rem;
    padding: 0.8rem 1rem;
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 3px solid var(--mechanicus-orange);
    border-radius: 2px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .post-item::before {
    content: '';
    position: absolute;
    left: -3.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: var(--mechanicus-white);
    border-radius: 50%;
    border: 2px solid var(--mechanicus-border);
    transition: all 0.2s ease;
  }

  .post-item:hover {
    background: var(--mechanicus-orange-subtle);
    border-left-color: var(--mechanicus-orange);
    transform: translateX(5px);
  }

  .post-item:hover::before {
    background: var(--mechanicus-orange);
    border-color: var(--mechanicus-orange);
  }

  .post-date {
    color: var(--mechanicus-text-muted);
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
    min-width: 90px;
  }

  .post-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--mechanicus-white);
    text-decoration: none;
    font-family: 'Courier New', monospace;
    transition: color 0.2s ease;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-title:hover {
    color: var(--mechanicus-orange);
  }

  .post-badges {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .post-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 2px;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
  }

  .post-badge.platform {
    background: rgba(29, 185, 84, 0.15);
    color: var(--thm-green);
    border: 1px solid var(--thm-green);
  }

  .post-badge.platform.htb {
    background: rgba(159, 239, 0, 0.15);
    color: var(--htb-green);
    border: 1px solid var(--htb-green);
  }

  .post-badge.type {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-orange);
    border: 1px solid var(--mechanicus-orange);
  }

  .post-badge.difficulty {
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    color: var(--mechanicus-text);
  }

  .post-badge.difficulty.easy {
    background: rgba(76, 175, 80, 0.15);
    color: #4CAF50;
    border-color: #4CAF50;
  }

  .post-badge.difficulty.medium {
    background: rgba(255, 193, 7, 0.15);
    color: #FFC107;
    border-color: #FFC107;
  }

  .post-badge.difficulty.hard {
    background: rgba(244, 67, 54, 0.15);
    color: #F44336;
    border-color: #F44336;
  }

  .post-badge.difficulty.insane, .post-badge.difficulty.veryeasy {
    background: rgba(156, 39, 176, 0.15);
    color: #9C27B0;
    border-color: #9C27B0;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--mechanicus-text-muted);
  }

  .no-results i {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    opacity: 0.2;
  }

  .no-results p {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
    color: var(--mechanicus-white);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .archives-header h1 {
      font-size: 2rem;
      letter-spacing: 2px;
    }

    .stats-container {
      grid-template-columns: repeat(2, 1fr);
      padding: 0 0.5rem;
    }

    .filters-row {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-group-inline {
      width: 100%;
      justify-content: center;
    }

    .search-bar-compact {
      max-width: 100%;
    }

    .year-header h2 {
      font-size: 1.6rem;
    }

    .posts-list {
      padding-left: 2.5rem;
    }

    .post-item {
      padding: 0.7rem 0.8rem;
      flex-wrap: wrap;
    }

    .post-item::before {
      left: -3rem;
    }

    .post-date {
      min-width: auto;
      font-size: 0.7rem;
    }

    .post-title {
      font-size: 0.9rem;
      flex: 1 1 100%;
      margin-bottom: 0.3rem;
    }

    .stat-number {
      font-size: 1.8rem;
    }

    .timeline-container {
      padding: 0 0.5rem;
    }
  }

  @media (max-width: 580px) {
    .archives-header {
      padding: 1.5rem 0.5rem 1rem 0.5rem;
    }

    .archives-header h1 {
      font-size: 1.6rem;
      letter-spacing: 1px;
    }

    .stats-container {
      grid-template-columns: 1fr;
      max-width: 300px;
    }

    .compact-filters {
      padding: 1rem;
      margin: 0 0.5rem 2rem 0.5rem;
    }

    .filter-group-inline {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .filter-btn-small {
      width: 100%;
      justify-content: center;
    }

    .year-header {
      margin-left: 2rem;
    }

    .year-marker {
      left: -2rem;
      width: 14px;
      height: 14px;
    }

    .year-header h2 {
      font-size: 1.4rem;
    }

    .posts-list {
      padding-left: 2rem;
    }

    .post-item::before {
      left: -2.5rem;
      width: 6px;
      height: 6px;
    }

    .post-title {
      font-size: 0.85rem;
    }

    .post-date {
      font-size: 0.65rem;
    }

    .post-badges {
      gap: 0.3rem;
    }

    .post-badge {
      font-size: 0.6rem;
      padding: 0.2rem 0.4rem;
    }
  }

  @media (max-width: 380px) {
    .archives-header h1 {
      font-size: 1.4rem;
    }

    .stat-number {
      font-size: 1.6rem;
    }

    .post-item {
      padding: 0.6rem;
    }

    .post-title {
      font-size: 0.8rem;
    }
  }
</style>

<div class="archives-header">
  <h1>ARCHIVES</h1>
  <p>Chronologie de mon parcours en cybersécurité</p>
</div>

<!-- Stats compactes -->
<div class="stats-container">
  <div class="stat-card">
    <div class="stat-number" id="total-posts">0</div>
    <div class="stat-label">Total</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="thm-posts">0</div>
    <div class="stat-label">TryHackMe</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="htb-posts">0</div>
    <div class="stat-label">HackTheBox</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="learning-posts">0</div>
    <div class="stat-label">Learning</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="challenge-posts">0</div>
    <div class="stat-label">Challenges</div>
  </div>
</div>

<!-- Filtres compacts -->
<div class="compact-filters">
  <div class="filters-row">
    <!-- Tri temporel -->
    <div class="filter-group-inline">
      <span class="filter-label-inline">Tri:</span>
      <button class="filter-btn-small active" onclick="sortByDate('recent')" id="btn-sort-recent">
        <i class="fas fa-arrow-down"></i>Récent
      </button>
      <button class="filter-btn-small" onclick="sortByDate('oldest')" id="btn-sort-oldest">
        <i class="fas fa-arrow-up"></i>Ancien
      </button>
    </div>

    <!-- Plateforme -->
    <div class="filter-group-inline">
      <span class="filter-label-inline">Plateforme:</span>
      <button class="filter-btn-small active" onclick="filterByPlatform('all')" id="btn-platform-all">
        Tous
      </button>
      <button class="filter-btn-small" onclick="filterByPlatform('thm')" id="btn-platform-thm">
        THM
      </button>
      <button class="filter-btn-small" onclick="filterByPlatform('htb')" id="btn-platform-htb">
        HTB
      </button>
    </div>

    <!-- Type -->
    <div class="filter-group-inline">
      <span class="filter-label-inline">Type:</span>
      <button class="filter-btn-small active" onclick="filterByType('all')" id="btn-type-all">
        Tous
      </button>
      <button class="filter-btn-small" onclick="filterByType('learning')" id="btn-type-learning">
        Learning
      </button>
      <button class="filter-btn-small" onclick="filterByType('challenge')" id="btn-type-challenge">
        Challenge
      </button>
    </div>
  </div>

  <div class="mechanicus-divider" style="margin: 1rem 0;"></div>

  <!-- Recherche -->
  <div class="filters-row">
    <div class="search-bar-compact">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        class="post-search" 
        id="post-search" 
        placeholder="Rechercher..."
        onkeyup="searchPosts()"
      >
    </div>
  </div>
</div>

<div class="mechanicus-divider"></div>

<!-- TIMELINE CHRONOLOGIQUE - ÉLÉMENT PRINCIPAL -->
<div class="timeline-container">
  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  
  {% for year_group in posts_by_year %}
    <div class="year-section" data-year="{{ year_group.name }}">
      <div class="year-header">
        <div class="year-marker"></div>
        <h2>{{ year_group.name }}</h2>
        <span class="year-count">{{ year_group.items.size }}</span>
      </div>

      <div class="posts-list">
        {% for post in year_group.items %}
          {% comment %}Déterminer la plateforme{% endcomment %}
          {% assign platform = "general" %}
          {% if post.categories contains "TryHackMe" or post.categories contains "tryhackme" or post.categories contains "THM" %}
            {% assign platform = "thm" %}
          {% elsif post.categories contains "HackTheBox" or post.categories contains "hackthebox" or post.categories contains "HTB" %}
            {% assign platform = "htb" %}
          {% endif %}

          {% comment %}Déterminer le type{% endcomment %}
          {% assign type = "general" %}
          {% if post.tags contains "learning" or post.tags contains "Learning" or post.categories contains "learning" or post.categories contains "Learning" %}
            {% assign type = "learning" %}
          {% elsif post.tags contains "challenge" or post.tags contains "Challenge" or post.categories contains "challenge" or post.categories contains "Challenge" %}
            {% assign type = "challenge" %}
          {% endif %}

          {% comment %}Déterminer la difficulté{% endcomment %}
          {% assign difficulty = "none" %}
          {% for category in post.categories %}
            {% assign cat_lower = category | downcase %}
            {% if cat_lower == "easy" or cat_lower == "medium" or cat_lower == "hard" or cat_lower == "insane" or cat_lower == "very easy" %}
              {% assign difficulty = cat_lower | replace: " ", "" %}
            {% endif %}
          {% endfor %}

          <div class="post-item" 
               data-platform="{{ platform }}" 
               data-type="{{ type }}"
               data-difficulty="{{ difficulty }}"
               data-year="{{ year_group.name }}"
               data-title="{{ post.title | downcase }}"
               data-timestamp="{{ post.date | date: '%s' }}">
            
            <div class="post-date">{{ post.date | date: "%d %b %Y" }}</div>
            
            <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>

            <div class="post-badges">
              {% if platform == "thm" %}
                <span class="post-badge platform">THM</span>
              {% elsif platform == "htb" %}
                <span class="post-badge platform htb">HTB</span>
              {% endif %}

              {% if type == "learning" %}
                <span class="post-badge type">Learning</span>
              {% elsif type == "challenge" %}
                <span class="post-badge type">Challenge</span>
              {% endif %}

              {% if difficulty != "none" %}
                <span class="post-badge difficulty {{ difficulty }}">{{ difficulty | capitalize | replace: "Veryeasy", "Very Easy" }}</span>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</div>

<div class="no-results" id="no-results" style="display: none;">
  <i class="fas fa-search"></i>
  <p>Aucun write-up trouvé</p>
</div>

<script src="{{ '/assets/js/archives.js' | relative_url }}"></script>