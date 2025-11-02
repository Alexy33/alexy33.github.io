---
layout: page
icon: fas fa-route
order: 6
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
    --htb-green: #9fef00;
  }

  .roadmap-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 1rem;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .roadmap-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  .roadmap-header p {
    color: var(--mechanicus-text-muted);
    font-size: 0.95rem;
    letter-spacing: 1px;
  }

  /* HTB Progress Section */
  .htb-live-progress {
    background: var(--mechanicus-dark-grey);
    border: 2px solid var(--htb-green);
    border-radius: 4px;
    padding: 2rem;
    margin: 0 1rem 3rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .htb-live-progress::before {
    content: 'LIVE';
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--htb-green);
    color: var(--mechanicus-black);
    padding: 0.3rem 0.8rem;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .htb-progress-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .htb-logo {
    font-size: 2.5rem;
  }

  .htb-progress-title h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--htb-green);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
    margin: 0 0 0.3rem 0;
  }

  .htb-progress-subtitle {
    color: var(--mechanicus-text-muted);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .htb-main-progress {
    margin: 2rem 0;
  }

  .progress-percentage {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .progress-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--htb-green);
    font-family: 'Courier New', monospace;
  }

  .progress-label {
    color: var(--mechanicus-text-muted);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .progress-bar-container {
    width: 100%;
    height: 30px;
    background: var(--mechanicus-black);
    border: 2px solid var(--mechanicus-border);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--htb-green), var(--mechanicus-orange));
    transition: width 1s ease;
    position: relative;
  }

  .progress-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .htb-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .htb-stat-card {
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-border);
    border-left: 3px solid var(--htb-green);
    padding: 1.2rem;
    border-radius: 3px;
  }

  .htb-stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.3rem;
  }

  .htb-stat-label {
    color: var(--mechanicus-text-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .current-module {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--mechanicus-black);
    border: 1px solid var(--mechanicus-orange);
    border-radius: 3px;
  }

  .current-module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .current-module-label {
    color: var(--mechanicus-orange);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .current-module-badge {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .module-badge {
    padding: 0.3rem 0.6rem;
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--mechanicus-text-muted);
  }

  .module-badge.difficulty {
    border-color: var(--htb-green);
    color: var(--htb-green);
  }

  .module-badge.tier {
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-orange);
  }

  .current-module-name {
    color: var(--mechanicus-white);
    font-size: 1.3rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    margin-bottom: 1rem;
  }

  .module-progress-container {
    margin-top: 1rem;
  }

  .module-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .module-progress-label {
    color: var(--mechanicus-text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .module-progress-percent {
    color: var(--mechanicus-orange);
    font-size: 1.2rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
  }

  .module-progress-bar {
    width: 100%;
    height: 20px;
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
  }

  .module-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--mechanicus-orange), #ff8c00);
    transition: width 1s ease;
    position: relative;
  }

  .module-progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    animation: shimmer 2s infinite;
  }

  .module-sections {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--mechanicus-text-muted);
  }

  .last-updated {
    text-align: right;
    color: var(--mechanicus-text-muted);
    font-size: 0.75rem;
    margin-top: 1.5rem;
    font-style: italic;
  }

  /* Timeline Section */
  .timeline-section {
    margin: 4rem 1rem;
  }

  .timeline-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .timeline-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
  }

  .timeline {
    position: relative;
    padding-left: 2rem;
    border-left: 2px solid var(--mechanicus-border);
  }

  .timeline-item {
    margin-bottom: 2.5rem;
    position: relative;
    padding-left: 2rem;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: -2.5rem;
    top: 0.5rem;
    width: 10px;
    height: 10px;
    background: var(--mechanicus-orange);
    border-radius: 50%;
    border: 2px solid var(--mechanicus-dark-grey);
  }

  .timeline-item.completed::before {
    background: var(--htb-green);
  }

  .timeline-item.current::before {
    background: var(--mechanicus-orange);
    box-shadow: 0 0 10px var(--mechanicus-orange);
    animation: pulse 2s infinite;
  }

  .timeline-date {
    font-size: 0.8rem;
    color: var(--mechanicus-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
  }

  .timeline-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
  }

  .timeline-description {
    font-size: 0.9rem;
    color: var(--mechanicus-text);
    line-height: 1.6;
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
  @media (max-width: 768px) {
    .roadmap-header h1 {
      font-size: 2rem;
    }

    .htb-progress-header {
      flex-direction: column;
      text-align: center;
    }

    .progress-number {
      font-size: 2.5rem;
    }

    .htb-stats-grid {
      grid-template-columns: 1fr;
    }

    .htb-live-progress {
      padding: 1.5rem;
      margin: 0 0.5rem 2rem 0.5rem;
    }

    .timeline-section {
      margin: 3rem 0.5rem;
    }

    .current-module-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 580px) {
    .roadmap-header h1 {
      font-size: 1.6rem;
      letter-spacing: 1px;
    }

    .htb-progress-title h2 {
      font-size: 1.2rem;
    }

    .progress-number {
      font-size: 2rem;
    }

    .timeline {
      padding-left: 1.5rem;
    }

    .timeline-item {
      padding-left: 1.5rem;
    }

    .timeline-item::before {
      left: -2.2rem;
    }

    .current-module-name {
      font-size: 1.1rem;
    }
  }
</style>

<div class="roadmap-header">
  <h1>MA ROADMAP CYBER</h1>
  <p>Mon parcours personnel vers le pentesting et les certifications internationales</p>
</div>

<!-- HTB Academy Progress - LIVE -->
<div class="htb-live-progress">
  <div class="htb-progress-header">
    <div class="htb-logo">🎯</div>
    <div class="htb-progress-title">
      <h2>HackTheBox Academy</h2>
      <div class="htb-progress-subtitle">
        Penetration Tester Job Role Path
      </div>
    </div>
  </div>

  <div class="htb-main-progress">
    <div class="progress-percentage">
      <div>
        <div class="progress-number" id="htb-progress-percent">--</div>
        <div class="progress-label">Progression globale</div>
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div class="progress-bar-fill" id="htb-progress-bar" style="width: 0%"></div>
    </div>
  </div>

  <div class="htb-stats-grid">
    <div class="htb-stat-card">
      <div class="htb-stat-value" id="htb-completed-modules">--</div>
      <div class="htb-stat-label">Modules complétés</div>
    </div>
    <div class="htb-stat-card">
      <div class="htb-stat-value" id="htb-total-modules">--</div>
      <div class="htb-stat-label">Total modules</div>
    </div>
    <div class="htb-stat-card">
      <div class="htb-stat-value" id="htb-remaining">--</div>
      <div class="htb-stat-label">Modules restants</div>
    </div>
  </div>

  <div class="current-module" id="current-module-container" style="display: none;">
    <div class="current-module-header">
      <div class="current-module-label">📚 Module en cours</div>
      <div class="current-module-badge" id="module-badges"></div>
    </div>
    <div class="current-module-name" id="current-module-name">--</div>
    
    <div class="module-progress-container">
      <div class="module-progress-header">
        <span class="module-progress-label">Progression du module</span>
        <span class="module-progress-percent" id="module-progress-percent">0%</span>
      </div>
      <div class="module-progress-bar">
        <div class="module-progress-fill" id="module-progress-fill" style="width: 0%"></div>
      </div>
      <div class="module-sections">
        <span id="module-sections-info">-- / -- sections</span>
        <span id="module-time-info">⏱️ --</span>
      </div>
    </div>
  </div>

  <div class="last-updated">
    Dernière mise à jour: <span id="htb-last-updated">--</span>
  </div>
</div>

<div class="mechanicus-divider"></div>

<!-- Timeline -->
<div class="timeline-section">
  <div class="timeline-header">
    <h2>TIMELINE</h2>
  </div>

  <div class="timeline">
    <div class="timeline-item completed">
      <div class="timeline-date">2024</div>
      <div class="timeline-title">Fondations</div>
      <div class="timeline-description">
        Apprentissage des bases via TryHackMe. Compréhension des fondamentaux du pentesting, networking, et systèmes Linux/Windows.
      </div>
    </div>

    <div class="timeline-item current">
      <div class="timeline-date">2025 - Actuellement</div>
      <div class="timeline-title">Formation intensive - HTB Academy</div>
      <div class="timeline-description">
        Progression sur le Penetration Tester Job Role Path de HackTheBox Academy. Focus sur les techniques avancées et lab pratiques.
      </div>
    </div>

    <div class="timeline-item">
      <div class="timeline-date">2026</div>
      <div class="timeline-title">Certification CPTS</div>
      <div class="timeline-description">
        Finalisation du Penetration Tester Path et passage de la certification CPTS pour valider mes compétences professionnelles.
      </div>
    </div>

    <div class="timeline-item">
      <div class="timeline-date">2027+</div>
      <div class="timeline-title">OSCP et carrière</div>
      <div class="timeline-description">
        Obtention de l'OSCP si nécessaire et recherche active de poste en pentesting remote/international. Développement continu des compétences.
      </div>
    </div>
  </div>
</div>

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--mechanicus-dark-grey); border-radius: 4px; margin: 3rem 1rem;">
  <h3 style="color: var(--mechanicus-white); text-transform: uppercase; letter-spacing: 2px; font-family: 'Courier New', monospace;">ROADMAP ÉVOLUTIVE</h3>
  <p style="color: var(--mechanicus-text-muted); margin-top: 1rem;">
    Cette roadmap est mise à jour automatiquement tous les jours avec ma progression réelle sur HTB Academy.
  </p>
</div>

<!-- Injection des données Jekyll pour le JS externe -->
<script id="htb-data" type="application/json">
{{ site.data.htb-progress | jsonify }}
</script>

<script src="{{ '/assets/js/roadmap.js' | relative_url }}"></script>