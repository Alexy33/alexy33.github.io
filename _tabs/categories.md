---
layout: page
icon: fas fa-stream
order: 1
---

<style>
  /* Variables Mechanicus */
  :root {
    --mechanicus-orange: #ff6b00;
    --mechanicus-orange-subtle: rgba(255, 107, 0, 0.15);
    --mechanicus-black: #0a0a0a;
    --mechanicus-dark-grey: #1a1a1a;
    --mechanicus-mid-grey: #2a2a2a;
    --mechanicus-white: #ffffff;
    --mechanicus-text: #e8e8e8;
    --mechanicus-text-muted: #a0a0a0;
    --mechanicus-border: #2a2a2a;
    --thm-green: #1db954;
    --htb-green: #9fef00;
  }

  .categories-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 1rem;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .categories-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  .categories-header p {
    color: var(--mechanicus-text-muted);
    font-size: 0.95rem;
    letter-spacing: 1px;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .mechanicus-quote {
    text-align: center;
    margin: 2rem auto 3rem auto;
    padding: 1.5rem;
    max-width: 600px;
    border-left: 3px solid var(--mechanicus-orange);
    background: var(--mechanicus-dark-grey);
  }

  .mechanicus-quote p {
    color: var(--mechanicus-text-muted);
    font-style: italic;
    font-size: 0.9rem;
    margin: 0;
  }

  .platforms-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .platform-folder {
    background: var(--mechanicus-dark-grey);
    border: 2px solid var(--mechanicus-border);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .platform-folder:hover {
    border-color: var(--mechanicus-orange);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 107, 0, 0.2);
  }

  .folder-header {
    padding: 1.5rem;
    background: var(--mechanicus-black);
    border-bottom: 2px solid var(--mechanicus-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .folder-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .folder-title h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
    margin: 0;
  }

  .platform-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .platform-badge.thm {
    background: rgba(29, 185, 84, 0.2);
    color: var(--thm-green);
    border: 1px solid var(--thm-green);
  }

  .platform-badge.htb {
    background: rgba(159, 239, 0, 0.2);
    color: var(--htb-green);
    border: 1px solid var(--htb-green);
  }

  .folder-content {
    padding: 1.5rem;
  }

  .type-section {
    background: var(--mechanicus-mid-grey);
    border-left: 3px solid var(--mechanicus-orange);
    border-radius: 2px;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .type-section:last-child {
    margin-bottom: 0;
  }

  .type-section:hover {
    background: var(--mechanicus-orange-subtle);
  }

  .type-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    cursor: pointer;
    user-select: none;
  }

  .type-header:hover {
    background: rgba(255, 107, 0, 0.1);
  }

  .type-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .expand-icon {
    color: var(--mechanicus-orange);
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  .type-section.expanded .expand-icon {
    transform: rotate(90deg);
  }

  .type-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-family: 'Courier New', monospace;
  }

  .type-count {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-white);
    padding: 0.4rem 0.9rem;
    border-radius: 2px;
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    border: 1px solid var(--mechanicus-orange);
  }

  .type-description {
    padding: 0 1.5rem 1rem 1.5rem;
    color: var(--mechanicus-text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    font-style: italic;
  }

  .posts-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
    background: var(--mechanicus-black);
    border-top: 1px solid var(--mechanicus-border);
  }

  .type-section.expanded .posts-container {
    max-height: 3000px;
  }

  .filters-section {
    padding: 1.5rem;
    background: var(--mechanicus-dark-grey);
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .search-container {
    position: relative;
    margin-bottom: 1rem;
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

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    color: var(--mechanicus-white);
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--mechanicus-orange);
    box-shadow: 0 0 0 2px var(--mechanicus-orange-subtle);
  }

  .search-input::placeholder {
    color: var(--mechanicus-text-muted);
    opacity: 0.6;
  }

  .difficulty-filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .difficulty-filter {
    padding: 0.5rem 1rem;
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    color: var(--mechanicus-text);
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .difficulty-filter:hover {
    border-color: var(--mechanicus-orange);
    background: var(--mechanicus-orange-subtle);
  }

  .difficulty-filter.active {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-white);
    font-weight: 700;
  }

  .posts-list {
    padding: 0;
  }

  .post-item {
    border-bottom: 1px solid var(--mechanicus-border);
    transition: all 0.2s ease;
    display: block;
  }

  .post-item:last-child {
    border-bottom: none;
  }

  .post-item:hover {
    background: var(--mechanicus-orange-subtle);
  }

  .post-item.hidden {
    display: none;
  }

  .post-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    text-decoration: none;
    color: var(--mechanicus-white);
    gap: 1rem;
  }

  .post-info {
    flex: 1;
  }

  .post-title {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--mechanicus-white);
    margin-bottom: 0.3rem;
    font-family: 'Courier New', monospace;
    transition: color 0.2s ease;
  }

  .post-link:hover .post-title {
    color: var(--mechanicus-orange);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .post-date {
    font-size: 0.75rem;
    color: var(--mechanicus-text-muted);
    font-family: 'Courier New', monospace;
  }

  .post-difficulty {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    background: var(--mechanicus-mid-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    color: var(--mechanicus-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .post-difficulty.easy {
    border-color: #4CAF50;
    color: #4CAF50;
  }

  .post-difficulty.medium {
    border-color: #FFC107;
    color: #FFC107;
  }

  .post-difficulty.hard {
    border-color: #F44336;
    color: #F44336;
  }

  .post-difficulty.insane {
    border-color: #9C27B0;
    color: #9C27B0;
  }

  .post-arrow {
    color: var(--mechanicus-text-muted);
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  .post-link:hover .post-arrow {
    color: var(--mechanicus-orange);
    transform: translateX(5px);
  }

  .empty-state {
    padding: 2rem 1.5rem;
    text-align: center;
    color: var(--mechanicus-text-muted);
    font-style: italic;
    font-size: 0.9rem;
  }

  .no-results {
    padding: 2rem 1.5rem;
    text-align: center;
    color: var(--mechanicus-text-muted);
    font-style: italic;
    font-size: 0.9rem;
    display: none;
  }

  .mechanicus-divider {
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      var(--mechanicus-border) 20%, 
      var(--mechanicus-border) 80%, 
      transparent
    );
    margin: 3rem 1rem;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .platforms-container {
      grid-template-columns: 1fr;
      max-width: 600px;
    }
  }

  @media (max-width: 768px) {
    .categories-header h1 {
      font-size: 2rem;
      letter-spacing: 2px;
    }

    .folder-title h2 {
      font-size: 1.2rem;
    }

    .platforms-container {
      padding: 0 0.5rem;
    }

    .difficulty-filters {
      flex-direction: column;
    }

    .difficulty-filter {
      text-align: center;
    }
  }

  @media (max-width: 580px) {
    .categories-header {
      padding: 1.5rem 0.5rem;
    }

    .categories-header h1 {
      font-size: 1.6rem;
      letter-spacing: 1px;
    }

    .folder-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .mechanicus-quote {
      padding: 1rem;
    }

    .type-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .type-header-left {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 380px) {
    .categories-header h1 {
      font-size: 1.4rem;
    }

    .folder-title {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>

<div class="categories-header">
  <h1>CLASSIFICATIONS</h1>
  <p>
    Organisation des contenus par plateforme et type d'apprentissage
  </p>
</div>

<div class="mechanicus-quote">
  <p>"Celui qui maîtrise ses archives maîtrise son évolution"</p>
</div>

{% comment %} Séparer les posts par plateforme et type {% endcomment %}
{% assign thm_learning_posts = "" | split: "" %}
{% assign thm_challenge_posts = "" | split: "" %}
{% assign htb_learning_posts = "" | split: "" %}
{% assign htb_challenge_posts = "" | split: "" %}

{% for post in site.posts %}
  {% assign is_thm = false %}
  {% assign is_htb = false %}
  {% assign is_learning = false %}
  {% assign is_challenge = false %}
  
  {% for cat in post.categories %}
    {% assign cat_lower = cat | downcase %}
    
    {% if cat_lower == "tryhackme" or cat_lower == "thm" %}
      {% assign is_thm = true %}
    {% endif %}
    
    {% if cat_lower == "hackthebox" or cat_lower == "htb" %}
      {% assign is_htb = true %}
    {% endif %}
    
    {% if cat_lower == "learning" %}
      {% assign is_learning = true %}
    {% endif %}
    
    {% if cat_lower == "challenge" %}
      {% assign is_challenge = true %}
    {% endif %}
  {% endfor %}
  
  {% if is_thm and is_learning %}
    {% assign thm_learning_posts = thm_learning_posts | push: post %}
  {% endif %}
  
  {% if is_thm and is_challenge %}
    {% assign thm_challenge_posts = thm_challenge_posts | push: post %}
  {% endif %}
  
  {% if is_htb and is_learning %}
    {% assign htb_learning_posts = htb_learning_posts | push: post %}
  {% endif %}
  
  {% if is_htb and is_challenge %}
    {% assign htb_challenge_posts = htb_challenge_posts | push: post %}
  {% endif %}
{% endfor %}

<div class="platforms-container">
  
  {% comment %} === TRYHACKME FOLDER === {% endcomment %}
  <div class="platform-folder">
    <div class="folder-header">
      <div class="folder-title">
        <h2>TryHackMe</h2>
        <span class="platform-badge thm">THM</span>
      </div>
    </div>
    
    <div class="folder-content">
      
      {% comment %} Learning Section {% endcomment %}
      <div class="type-section" data-type="thm-learning">
        <div class="type-header" onclick="toggleSection('thm-learning')">
          <div class="type-header-left">
            <i class="fas fa-chevron-right expand-icon"></i>
            <span class="type-title">Learning</span>
          </div>
          <span class="type-count">{{ thm_learning_posts.size }}</span>
        </div>
        <p class="type-description">
          Modules d'apprentissage théoriques et pratiques pour acquérir de nouvelles compétences en cybersécurité
        </p>
        <div class="posts-container">
          <div class="filters-section">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Rechercher un cours..." onkeyup="filterPosts('thm-learning')">
            </div>
          </div>
          <div class="posts-list">
            {% if thm_learning_posts.size > 0 %}
              {% for post in thm_learning_posts %}
                <div class="post-item" data-title="{{ post.title | downcase }}">
                  <a href="{{ post.url }}" class="post-link">
                    <div class="post-info">
                      <div class="post-title">{{ post.title }}</div>
                      <div class="post-meta">
                        <span class="post-date">{{ post.date | date: "%d %B %Y" }}</span>
                      </div>
                    </div>
                    <i class="fas fa-arrow-right post-arrow"></i>
                  </a>
                </div>
              {% endfor %}
              <div class="no-results" id="thm-learning-no-results">Aucun résultat trouvé</div>
            {% else %}
              <div class="empty-state">Aucun post disponible</div>
            {% endif %}
          </div>
        </div>
      </div>
      
      {% comment %} Challenge Section {% endcomment %}
      <div class="type-section" data-type="thm-challenge">
        <div class="type-header" onclick="toggleSection('thm-challenge')">
          <div class="type-header-left">
            <i class="fas fa-chevron-right expand-icon"></i>
            <span class="type-title">Challenge</span>
          </div>
          <span class="type-count">{{ thm_challenge_posts.size }}</span>
        </div>
        <p class="type-description">
          Machines virtuelles et CTF pour mettre en pratique les connaissances acquises
        </p>
        <div class="posts-container">
          <div class="filters-section">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Rechercher un challenge..." onkeyup="filterPosts('thm-challenge')">
            </div>
            <div class="difficulty-filters">
              <button class="difficulty-filter active" onclick="filterByDifficulty('thm-challenge', 'all')">Tous</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('thm-challenge', 'easy')">Easy</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('thm-challenge', 'medium')">Medium</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('thm-challenge', 'hard')">Hard</button>
            </div>
          </div>
          <div class="posts-list">
            {% if thm_challenge_posts.size > 0 %}
              {% for post in thm_challenge_posts %}
                {% assign difficulty = "none" %}
                {% for cat in post.categories %}
                  {% assign cat_lower = cat | downcase %}
                  {% if cat_lower == "easy" or cat_lower == "medium" or cat_lower == "hard" or cat_lower == "insane" %}
                    {% assign difficulty = cat_lower %}
                  {% endif %}
                {% endfor %}
                <div class="post-item" data-title="{{ post.title | downcase }}" data-difficulty="{{ difficulty }}">
                  <a href="{{ post.url }}" class="post-link">
                    <div class="post-info">
                      <div class="post-title">{{ post.title }}</div>
                      <div class="post-meta">
                        <span class="post-date">{{ post.date | date: "%d %B %Y" }}</span>
                        {% if difficulty != "none" %}
                          <span class="post-difficulty {{ difficulty }}">{{ difficulty }}</span>
                        {% endif %}
                      </div>
                    </div>
                    <i class="fas fa-arrow-right post-arrow"></i>
                  </a>
                </div>
              {% endfor %}
              <div class="no-results" id="thm-challenge-no-results">Aucun résultat trouvé</div>
            {% else %}
              <div class="empty-state">Aucun post disponible</div>
            {% endif %}
          </div>
        </div>
      </div>
      
    </div>
  </div>
  
  {% comment %} === HACKTHEBOX FOLDER === {% endcomment %}
  <div class="platform-folder">
    <div class="folder-header">
      <div class="folder-title">
        <h2>HackTheBox</h2>
        <span class="platform-badge htb">HTB</span>
      </div>
    </div>
    
    <div class="folder-content">
      
      {% comment %} Learning Section {% endcomment %}
      <div class="type-section" data-type="htb-learning">
        <div class="type-header" onclick="toggleSection('htb-learning')">
          <div class="type-header-left">
            <i class="fas fa-chevron-right expand-icon"></i>
            <span class="type-title">Learning</span>
          </div>
          <span class="type-count">{{ htb_learning_posts.size }}</span>
        </div>
        <p class="type-description">
          Parcours d'apprentissage structurés via HTB Academy pour devenir pentester professionnel
        </p>
        <div class="posts-container">
          <div class="filters-section">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Rechercher un cours..." onkeyup="filterPosts('htb-learning')">
            </div>
          </div>
          <div class="posts-list">
            {% if htb_learning_posts.size > 0 %}
              {% for post in htb_learning_posts %}
                <div class="post-item" data-title="{{ post.title | downcase }}">
                  <a href="{{ post.url }}" class="post-link">
                    <div class="post-info">
                      <div class="post-title">{{ post.title }}</div>
                      <div class="post-meta">
                        <span class="post-date">{{ post.date | date: "%d %B %Y" }}</span>
                      </div>
                    </div>
                    <i class="fas fa-arrow-right post-arrow"></i>
                  </a>
                </div>
              {% endfor %}
              <div class="no-results" id="htb-learning-no-results">Aucun résultat trouvé</div>
            {% else %}
              <div class="empty-state">Aucun post disponible</div>
            {% endif %}
          </div>
        </div>
      </div>
      
      {% comment %} Challenge Section {% endcomment %}
      <div class="type-section" data-type="htb-challenge">
        <div class="type-header" onclick="toggleSection('htb-challenge')">
          <div class="type-header-left">
            <i class="fas fa-chevron-right expand-icon"></i>
            <span class="type-title">Challenge</span>
          </div>
          <span class="type-count">{{ htb_challenge_posts.size }}</span>
        </div>
        <p class="type-description">
          Boxes et challenges réalistes pour approfondir les techniques offensives
        </p>
        <div class="posts-container">
          <div class="filters-section">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Rechercher un challenge..." onkeyup="filterPosts('htb-challenge')">
            </div>
            <div class="difficulty-filters">
              <button class="difficulty-filter active" onclick="filterByDifficulty('htb-challenge', 'all')">Tous</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('htb-challenge', 'easy')">Easy</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('htb-challenge', 'medium')">Medium</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('htb-challenge', 'hard')">Hard</button>
              <button class="difficulty-filter" onclick="filterByDifficulty('htb-challenge', 'insane')">Insane</button>
            </div>
          </div>
          <div class="posts-list">
            {% if htb_challenge_posts.size > 0 %}
              {% for post in htb_challenge_posts %}
                {% assign difficulty = "none" %}
                {% for cat in post.categories %}
                  {% assign cat_lower = cat | downcase %}
                  {% if cat_lower == "easy" or cat_lower == "medium" or cat_lower == "hard" or cat_lower == "insane" %}
                    {% assign difficulty = cat_lower %}
                  {% endif %}
                {% endfor %}
                <div class="post-item" data-title="{{ post.title | downcase }}" data-difficulty="{{ difficulty }}">
                  <a href="{{ post.url }}" class="post-link">
                    <div class="post-info">
                      <div class="post-title">{{ post.title }}</div>
                      <div class="post-meta">
                        <span class="post-date">{{ post.date | date: "%d %B %Y" }}</span>
                        {% if difficulty != "none" %}
                          <span class="post-difficulty {{ difficulty }}">{{ difficulty }}</span>
                        {% endif %}
                      </div>
                    </div>
                    <i class="fas fa-arrow-right post-arrow"></i>
                  </a>
                </div>
              {% endfor %}
              <div class="no-results" id="htb-challenge-no-results">Aucun résultat trouvé</div>
            {% else %}
              <div class="empty-state">Aucun post disponible</div>
            {% endif %}
          </div>
        </div>
      </div>
      
    </div>
  </div>
  
</div>

<div class="mechanicus-divider"></div>

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--mechanicus-dark-grey); border-radius: 4px; margin: 3rem 1rem;">
  <p style="color: var(--mechanicus-text-muted); font-style: italic; margin: 0;">
    "Chaque donnée classifiée est une connaissance préservée."
  </p>
</div>

<script src="{{ '/assets/js/categories.js' | relative_url }}"></script>