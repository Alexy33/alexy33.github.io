---
layout: page
icon: fas fa-tags
order: 2
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
  }

  .tags-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 1rem;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .tags-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  .tags-header p {
    color: var(--mechanicus-text-muted);
    font-size: 0.95rem;
    letter-spacing: 1px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }

  .stat-card {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 2px solid var(--mechanicus-orange);
    padding: 1.5rem;
    border-radius: 2px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    background: var(--mechanicus-orange-subtle);
    transform: translateY(-2px);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--mechanicus-text-muted);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .controls-section {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    padding: 1.5rem;
    margin: 0 1rem 2rem 1rem;
  }

  .controls-label {
    color: var(--mechanicus-white);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    font-weight: 600;
    border-bottom: 1px solid var(--mechanicus-border);
    padding-bottom: 0.5rem;
  }

  .tags-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .sort-btn {
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

  .tag-search {
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

  .tag-search:focus {
    outline: none;
    border-color: var(--mechanicus-orange);
    background: var(--mechanicus-dark-grey);
    box-shadow: 0 0 0 2px var(--mechanicus-orange-subtle);
  }

  .tag-search::placeholder {
    color: var(--mechanicus-text-muted);
    opacity: 0.6;
  }

  .tags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
    padding: 0 1rem;
  }

  .tag-card {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 2px solid var(--mechanicus-orange);
    border-radius: 2px;
    padding: 1rem 1.2rem;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    min-height: 90px;
  }

  .tag-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 0;
    background: var(--mechanicus-orange);
    transition: height 0.3s ease;
  }

  .tag-card:hover::before {
    height: 100%;
  }

  .tag-card:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    transform: translateX(3px);
  }

  .tag-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--mechanicus-white);
    margin-bottom: 0.6rem;
    text-decoration: none;
    display: block;
    font-family: 'Courier New', monospace;
    transition: color 0.25s ease;
    line-height: 1.3;
    word-break: break-word;
  }

  .tag-name:hover {
    color: var(--mechanicus-orange);
  }

  .tag-name::before {
    content: '# ';
    color: var(--mechanicus-orange);
    opacity: 0.5;
    font-weight: 400;
  }

  .tag-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: auto;
    flex-wrap: wrap;
  }

  .tag-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--mechanicus-text-muted);
    font-size: 0.8rem;
  }

  .tag-badge {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-white);
    padding: 0.2rem 0.5rem;
    border-radius: 2px;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    min-width: 28px;
    text-align: center;
    border: 1px solid var(--mechanicus-orange);
  }

  .tag-count-text {
    text-transform: lowercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    opacity: 0.8;
  }

  .tag-platform {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--mechanicus-text-muted);
  }

  .tag-platform.thm {
    border-color: #1db954;
    color: #1db954;
  }

  .tag-platform.htb {
    border-color: #9fef00;
    color: #9fef00;
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

  /* Responsive */
  @media (max-width: 1024px) {
    .tags-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .tags-header h1 {
      font-size: 2rem;
      letter-spacing: 2px;
    }

    .tags-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.8rem;
    }

    .tag-card {
      padding: 0.9rem 1rem;
      min-height: 85px;
    }

    .tag-name {
      font-size: 1rem;
    }
    
    .tags-controls {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-number {
      font-size: 2rem;
    }

    .controls-section,
    .mechanicus-divider {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 580px) {
    .tags-header {
      padding: 1.5rem 0.5rem;
    }

    .tags-header h1 {
      font-size: 1.6rem;
      letter-spacing: 1px;
    }

    .tags-grid {
      grid-template-columns: 1fr;
      padding: 0 0.5rem;
    }

    .tags-controls {
      grid-template-columns: 1fr;
    }

    .stats-container {
      grid-template-columns: 1fr;
      max-width: 300px;
      padding: 0 0.5rem;
    }

    .tag-card {
      min-height: 80px;
    }

    .controls-section {
      padding: 1rem;
    }

    .sort-btn {
      padding: 0.8rem 1rem;
    }
  }

  @media (max-width: 380px) {
    .tags-header h1 {
      font-size: 1.4rem;
    }

    .tag-name {
      font-size: 0.95rem;
    }

    .tag-card {
      padding: 0.8rem;
    }

    .stat-number {
      font-size: 1.8rem;
    }
  }
</style>

<div class="tags-header">
  <h1>DATA ARCHIVES</h1>
  <p>Classification des tags sur chacuns de mes cours / challenges pour pouvoir les différencier c'est a dire que si vous cherchez une compétence en particulier que j'ai pu faire dans tout mes write-up sans avoir a regarder tout ce que j'ai fait, vous pouvez chercher ce qui <strong>VOUS</strong> intéresse ici !</p>
</div>

<div class="stats-container">
  <div class="stat-card">
    <div class="stat-number" id="total-tags">0</div>
    <div class="stat-label">Classifications</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="total-posts">0</div>
    <div class="stat-label">Entrées</div>
  </div>
</div>

<div class="mechanicus-divider"></div>

<div class="controls-section">
  <div class="controls-label">PROTOCOLES DE TRI</div>
  
  <div class="tags-controls">
    <button class="sort-btn active" onclick="sortTags('alpha')" id="btn-alpha">
      <i class="fas fa-sort-alpha-down"></i>
      <span>Alphabétique</span>
    </button>
    <button class="sort-btn" onclick="sortTags('count')" id="btn-count">
      <i class="fas fa-sort-numeric-down"></i>
      <span>Par volume</span>
    </button>
    <button class="sort-btn" onclick="sortTags('recent')" id="btn-recent">
      <i class="fas fa-clock"></i>
      <span>Récents</span>
    </button>
    <button class="sort-btn" onclick="sortTags('thm')" id="btn-thm">
      <i class="fas fa-flag"></i>
      <span>TryHackMe</span>
    </button>
    <button class="sort-btn" onclick="sortTags('htb')" id="btn-htb">
      <i class="fas fa-cube"></i>
      <span>HackTheBox</span>
    </button>
    <button class="sort-btn" onclick="sortTags('all')" id="btn-all">
      <i class="fas fa-list"></i>
      <span>Tous</span>
    </button>
  </div>

  <div class="search-container">
    <i class="fas fa-search search-icon"></i>
    <input 
      type="text" 
      class="tag-search" 
      id="tag-search" 
      placeholder="Rechercher dans les archives..."
      onkeyup="filterTags()"
    >
  </div>
</div>

<div class="tags-grid" id="tags-container">
  {% assign sorted_tags = site.tags | sort %}
  {% for tag in sorted_tags %}
    {% assign tag_name = tag[0] %}
    {% assign posts = tag[1] %}
    {% assign latest_post = posts | sort: 'date' | reverse | first %}
    
    {% comment %}Déterminer la plateforme basée sur les catégories ou le contenu{% endcomment %}
    {% assign platform = "general" %}
    {% for post in posts %}
      {% if post.categories contains "TryHackMe" or post.categories contains "tryhackme" or post.categories contains "THM" %}
        {% assign platform = "thm" %}
        {% break %}
      {% elsif post.categories contains "HackTheBox" or post.categories contains "hackthebox" or post.categories contains "HTB" %}
        {% assign platform = "htb" %}
        {% break %}
      {% endif %}
    {% endfor %}
    
    <div class="tag-card" data-tag="{{ tag_name | downcase }}" data-count="{{ posts.size }}" data-date="{{ latest_post.date | date: '%s' }}" data-platform="{{ platform }}">
      <div>
        <a href="{{ site.baseurl }}/tags/{{ tag_name | slugify }}/" class="tag-name">
          {{ tag_name }}
        </a>
        <div class="tag-meta">
          <div class="tag-count">
            <span class="tag-badge">{{ posts.size }}</span>
            <span class="tag-count-text">{% if posts.size > 1 %}entrées{% else %}entrée{% endif %}</span>
          </div>
          {% if platform == "thm" %}
            <span class="tag-platform thm">THM</span>
          {% elsif platform == "htb" %}
            <span class="tag-platform htb">HTB</span>
          {% endif %}
        </div>
      </div>
    </div>
  {% endfor %}
</div>

<div class="no-results" id="no-results" style="display: none;">
  <i class="fas fa-exclamation-triangle"></i>
  <p>Aucune donnée trouvée</p>
</div>

<script src="{{ '/assets/js/tags.js' | relative_url }}"></script>