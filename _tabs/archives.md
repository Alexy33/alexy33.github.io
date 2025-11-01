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

  .sort-section {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    padding: 1rem 1.5rem;
    margin: 0 1rem 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .sort-label {
    color: var(--mechanicus-white);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .sort-btn {
    padding: 0.6rem 1.2rem;
    background: var(--mechanicus-black);
    color: var(--mechanicus-text);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Courier New', monospace;
  }

  .sort-btn:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-white);
  }

  .sort-btn.active {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-white);
    border-color: var(--mechanicus-orange);
    font-weight: 700;
  }

  .sort-btn i {
    font-size: 0.9rem;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
    padding: 0 1rem;
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

  .filters-section {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    padding: 1.5rem;
    margin: 0 1rem 2.5rem 1rem;
  }

  .filter-group {
    margin-bottom: 1.5rem;
  }

  .filter-group:last-child {
    margin-bottom: 0;
  }

  .filter-label {
    color: var(--mechanicus-white);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-label-number {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-orange);
    border: 1px solid var(--mechanicus-orange);
    padding: 0.2rem 0.5rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .filter-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .filter-btn {
    padding: 0.7rem 1rem;
    background: var(--mechanicus-black);
    color: var(--mechanicus-text);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: 'Courier New', monospace;
  }

  .filter-btn:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-white);
  }

  .filter-btn.active {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-white);
    border-color: var(--mechanicus-orange);
    font-weight: 700;
  }

  .filter-btn i {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .search-container {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mechanicus-text-muted);
    font-size: 1rem;
    pointer-events: none;
  }

  .post-search {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.8rem;
    font-size: 0.95rem;
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

  .timeline-container {
    position: relative;
    padding: 0 1rem;
  }

  .year-section {
    margin-bottom: 2rem;
  }

  .year-header {
    position: relative;
    margin: 3rem 0 2rem 0;
    padding-left: 3rem;
  }

  .year-header::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: var(--mechanicus-orange);
    border-radius: 50%;
    border: 3px solid var(--mechanicus-black);
    box-shadow: 0 0 0 2px var(--mechanicus-orange);
  }

  .year-header h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
    margin: 0;
  }

  .posts-list {
    position: relative;
    padding-left: 3rem;
    border-left: 2px solid var(--mechanicus-border);
    margin-left: 5px;
  }

  .post-item {
    position: relative;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 3px solid var(--mechanicus-orange);
    border-radius: 2px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-item::before {
    content: '';
    position: absolute;
    left: -3.9rem;
    top: 2rem;
    width: 8px;
    height: 8px;
    background: var(--mechanicus-white);
    border-radius: 50%;
    border: 2px solid var(--mechanicus-border);
  }

  .post-item:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    transform: translateX(5px);
  }

  .post-item:hover::before {
    background: var(--mechanicus-orange);
    border-color: var(--mechanicus-orange);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .post-title-group {
    flex: 1;
    min-width: 200px;
  }

  .post-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-decoration: none;
    display: block;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
    line-height: 1.3;
    transition: color 0.3s ease;
  }

  .post-title:hover {
    color: var(--mechanicus-orange);
  }

  .post-date {
    color: var(--mechanicus-text-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .post-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .post-badge {
    padding: 0.3rem 0.7rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
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

  .post-badge.difficulty.insane {
    background: rgba(156, 39, 176, 0.15);
    color: #9C27B0;
    border-color: #9C27B0;
  }

  .post-description {
    color: var(--mechanicus-text);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .post-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--mechanicus-border);
  }

  .post-category {
    padding: 0.2rem 0.6rem;
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    font-size: 0.75rem;
    color: var(--mechanicus-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

    .sort-section {
      flex-direction: column;
      align-items: stretch;
    }

    .sort-buttons {
      width: 100%;
    }

    .sort-btn {
      flex: 1;
    }

    .stats-container {
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    }

    .filter-buttons {
      grid-template-columns: repeat(2, 1fr);
    }

    .year-header h2 {
      font-size: 1.5rem;
    }

    .posts-list {
      padding-left: 2rem;
    }

    .post-item {
      padding: 1.2rem;
    }

    .post-item::before {
      left: -3.2rem;
    }

    .stat-number {
      font-size: 1.8rem;
    }

    .filters-section,
    .mechanicus-divider,
    .sort-section {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
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
      grid-template-columns: repeat(2, 1fr);
      padding: 0 0.5rem;
    }

    .filter-buttons {
      grid-template-columns: 1fr;
    }

    .filters-section {
      padding: 1rem;
    }

    .sort-buttons {
      flex-direction: column;
    }

    .year-header {
      padding-left: 2rem;
      margin: 2rem 0 1.5rem 0;
    }

    .year-header h2 {
      font-size: 1.3rem;
    }

    .year-header::before {
      width: 10px;
      height: 10px;
    }

    .posts-list {
      padding-left: 1.5rem;
      margin-left: 3px;
    }

    .post-item::before {
      left: -2.7rem;
    }

    .post-title {
      font-size: 1.1rem;
    }

    .post-header {
      flex-direction: column;
      gap: 0.8rem;
    }
  }

  @media (max-width: 380px) {
    .archives-header h1 {
      font-size: 1.4rem;
    }

    .stats-container {
      grid-template-columns: 1fr;
    }

    .stat-number {
      font-size: 1.6rem;
    }

    .post-item {
      padding: 1rem;
    }

    .post-title {
      font-size: 1rem;
    }
  }
</style>

<div class="archives-header">
  <h1>ARCHIVES</h1>
  <p>Chronologie complète de mes write-ups et challenges</p>
</div>

<!-- Section de tri par date -->
<div class="sort-section">
  <span class="sort-label">
    <i class="fas fa-sort"></i>
    Tri par date
  </span>
  <div class="sort-buttons">
    <button class="sort-btn active" onclick="sortByDate('recent')" id="btn-sort-recent">
      <i class="fas fa-arrow-down"></i>
      <span>Plus récent</span>
    </button>
    <button class="sort-btn" onclick="sortByDate('oldest')" id="btn-sort-oldest">
      <i class="fas fa-arrow-up"></i>
      <span>Plus ancien</span>
    </button>
  </div>
</div>

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

<div class="mechanicus-divider"></div>

<div class="filters-section">
  <!-- Filtre 1 : Plateforme -->
  <div class="filter-group">
    <span class="filter-label">
      <span class="filter-label-number">1</span>
      Plateforme
    </span>
    <div class="filter-buttons">
      <button class="filter-btn platform-btn active" onclick="filterByPlatform('all')" id="btn-platform-all">
        <i class="fas fa-list"></i>
        <span>Tous</span>
      </button>
      <button class="filter-btn platform-btn" onclick="filterByPlatform('thm')" id="btn-platform-thm">
        <i class="fas fa-flag"></i>
        <span>TryHackMe</span>
      </button>
      <button class="filter-btn platform-btn" onclick="filterByPlatform('htb')" id="btn-platform-htb">
        <i class="fas fa-cube"></i>
        <span>HackTheBox</span>
      </button>
    </div>
  </div>

  <div class="mechanicus-divider" style="margin: 1.5rem 0;"></div>

  <!-- Filtre 2 : Type -->
  <div class="filter-group">
    <span class="filter-label">
      <span class="filter-label-number">2</span>
      Type
    </span>
    <div class="filter-buttons">
      <button class="filter-btn type-btn active" onclick="filterByType('all')" id="btn-type-all">
        <i class="fas fa-list"></i>
        <span>Tous</span>
      </button>
      <button class="filter-btn type-btn" onclick="filterByType('learning')" id="btn-type-learning">
        <i class="fas fa-graduation-cap"></i>
        <span>Learning</span>
      </button>
      <button class="filter-btn type-btn" onclick="filterByType('challenge')" id="btn-type-challenge">
        <i class="fas fa-puzzle-piece"></i>
        <span>Challenges</span>
      </button>
    </div>
  </div>

  <div class="mechanicus-divider" style="margin: 1.5rem 0;"></div>

  <!-- Filtre 3 : Difficulté (TryHackMe) -->
  <div class="filter-group" id="thm-difficulty" style="display: none;">
    <span class="filter-label">
      <span class="filter-label-number">3</span>
      Difficulté - TryHackMe
    </span>
    <div class="filter-buttons">
      <button class="filter-btn difficulty-btn active" onclick="filterByDifficulty('all')" id="btn-difficulty-all">
        <i class="fas fa-list"></i>
        <span>Tous</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('easy')" id="btn-difficulty-easy">
        <span>Easy</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('medium')" id="btn-difficulty-medium">
        <span>Medium</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('hard')" id="btn-difficulty-hard">
        <span>Hard</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('insane')" id="btn-difficulty-insane">
        <span>Insane</span>
      </button>
    </div>
  </div>

  <!-- Filtre 3 : Difficulté (HackTheBox) -->
  <div class="filter-group" id="htb-difficulty" style="display: none;">
    <span class="filter-label">
      <span class="filter-label-number">3</span>
      Difficulté - HackTheBox
    </span>
    <div class="filter-buttons">
      <button class="filter-btn difficulty-btn active" onclick="filterByDifficulty('all')" id="btn-difficulty-all">
        <i class="fas fa-list"></i>
        <span>Tous</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('veryeasy')" id="btn-difficulty-veryeasy">
        <span>Very Easy</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('easy')" id="btn-difficulty-easy">
        <span>Easy</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('medium')" id="btn-difficulty-medium">
        <span>Medium</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('hard')" id="btn-difficulty-hard">
        <span>Hard</span>
      </button>
      <button class="filter-btn difficulty-btn" onclick="filterByDifficulty('insane')" id="btn-difficulty-insane">
        <span>Insane</span>
      </button>
    </div>
  </div>

  <div class="mechanicus-divider" style="margin: 1.5rem 0;"></div>

  <!-- Recherche -->
  <div class="filter-group">
    <span class="filter-label">Recherche</span>
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        class="post-search" 
        id="post-search" 
        placeholder="Rechercher un write-up..."
        onkeyup="searchPosts()"
      >
    </div>
  </div>
</div>

<div class="timeline-container">
  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  
  {% for year_group in posts_by_year %}
    <div class="year-section" data-year="{{ year_group.name }}">
      <div class="year-header">
        <h2>{{ year_group.name }}</h2>
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
            
            <div class="post-header">
              <div class="post-title-group">
                <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>
                <div class="post-date">{{ post.date | date: "%d %B %Y" }}</div>
              </div>

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

            {% if post.description %}
              <p class="post-description">{{ post.description }}</p>
            {% endif %}

            {% if post.categories.size > 0 %}
              <div class="post-categories">
                {% for category in post.categories %}
                  <span class="post-category">{{ category }}</span>
                {% endfor %}
              </div>
            {% endif %}
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