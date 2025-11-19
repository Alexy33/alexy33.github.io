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
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
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
    margin-bottom: 1rem;
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
    color: var(--mechanicus-text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    font-style: italic;
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
  <p>"L'organisation mène à la compréhension. La compréhension mène à la maîtrise."</p>
</div>

{% comment %} Compter les posts par plateforme et type {% endcomment %}
{% assign thm_learning_count = 0 %}
{% assign thm_challenge_count = 0 %}
{% assign htb_learning_count = 0 %}
{% assign htb_challenge_count = 0 %}

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
    {% assign thm_learning_count = thm_learning_count | plus: 1 %}
  {% endif %}
  
  {% if is_thm and is_challenge %}
    {% assign thm_challenge_count = thm_challenge_count | plus: 1 %}
  {% endif %}
  
  {% if is_htb and is_learning %}
    {% assign htb_learning_count = htb_learning_count | plus: 1 %}
  {% endif %}
  
  {% if is_htb and is_challenge %}
    {% assign htb_challenge_count = htb_challenge_count | plus: 1 %}
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
      <div class="type-section">
        <div class="type-header">
          <span class="type-title">Learning</span>
          <span class="type-count">{{ thm_learning_count }}</span>
        </div>
        <p class="type-description">
          Modules d'apprentissage théoriques et pratiques pour acquérir de nouvelles compétences en cybersécurité
        </p>
      </div>
      
      {% comment %} Challenge Section {% endcomment %}
      <div class="type-section">
        <div class="type-header">
          <span class="type-title">Challenge</span>
          <span class="type-count">{{ thm_challenge_count }}</span>
        </div>
        <p class="type-description">
          Machines virtuelles et CTF pour mettre en pratique les connaissances acquises
        </p>
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
      <div class="type-section">
        <div class="type-header">
          <span class="type-title">Learning</span>
          <span class="type-count">{{ htb_learning_count }}</span>
        </div>
        <p class="type-description">
          Parcours d'apprentissage structurés via HTB Academy pour devenir pentester professionnel
        </p>
      </div>
      
      {% comment %} Challenge Section {% endcomment %}
      <div class="type-section">
        <div class="type-header">
          <span class="type-title">Challenge</span>
          <span class="type-count">{{ htb_challenge_count }}</span>
        </div>
        <p class="type-description">
          Boxes et challenges réalistes pour approfondir les techniques offensives
        </p>
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