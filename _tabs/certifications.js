---
layout: page
icon: fas fa-certificate
order: 7
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

  .certifications-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .certifications-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  .certifications-header p {
    color: var(--mechanicus-text-muted);
    font-size: 0.95rem;
    letter-spacing: 1px;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
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

  .mechanicus-divider {
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      var(--mechanicus-border) 20%, 
      var(--mechanicus-border) 80%, 
      transparent
    );
    margin: 2.5rem 0;
  }

  .platform-section {
    margin-bottom: 4rem;
  }

  .platform-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--mechanicus-border);
  }

  .platform-header h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
    margin: 0;
  }

  .platform-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 2px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .platform-badge.thm {
    background: rgba(29, 185, 84, 0.15);
    color: var(--thm-green);
    border: 1px solid var(--thm-green);
  }

  .platform-badge.htb {
    background: rgba(159, 239, 0, 0.15);
    color: var(--htb-green);
    border: 1px solid var(--htb-green);
  }

  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .cert-card {
    background: var(--mechanicus-dark-grey);
    border: 1px solid var(--mechanicus-border);
    border-left: 3px solid var(--mechanicus-orange);
    border-radius: 2px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
  }

  .cert-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 0;
    background: var(--mechanicus-orange);
    transition: height 0.3s ease;
    z-index: 1;
  }

  .cert-card:hover::before {
    height: 100%;
  }

  .cert-card:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 107, 0, 0.2);
  }

  .cert-card.completed {
    border-left-color: var(--thm-green);
  }

  .cert-card.completed::before {
    background: var(--thm-green);
  }

  .cert-card.in-progress {
    border-left-color: var(--mechanicus-orange);
  }

  .cert-card.planned {
    border-left-color: var(--htb-green);
  }

  .cert-card.planned::before {
    background: var(--htb-green);
  }

  .cert-image-container {
    width: 100%;
    height: 260px;
    background: var(--mechanicus-black);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid var(--mechanicus-border);
    position: relative;
  }

  .cert-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .cert-card:hover .cert-image {
    transform: scale(1.05);
  }

  .cert-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cert-card:hover .cert-image-overlay {
    opacity: 1;
  }

  .cert-view-btn {
    padding: 0.7rem 1.5rem;
    background: var(--mechanicus-orange);
    color: var(--mechanicus-white);
    text-decoration: none;
    border-radius: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
  }

  .cert-view-btn:hover {
    background: var(--mechanicus-white);
    color: var(--mechanicus-black);
  }

  .cert-content {
    padding: 1.5rem;
  }

  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
  }

  .cert-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--mechanicus-white);
    margin-bottom: 0.3rem;
    font-family: 'Courier New', monospace;
    line-height: 1.3;
  }

  .cert-status {
    padding: 0.3rem 0.6rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
    font-family: 'Courier New', monospace;
  }

  .cert-status.completed {
    background: rgba(29, 185, 84, 0.2);
    color: var(--thm-green);
    border: 1px solid var(--thm-green);
  }

  .cert-status.in-progress {
    background: var(--mechanicus-orange-subtle);
    color: var(--mechanicus-orange);
    border: 1px solid var(--mechanicus-orange);
  }

  .cert-status.planned {
    background: rgba(159, 239, 0, 0.15);
    color: var(--htb-green);
    border: 1px solid var(--htb-green);
  }

  .cert-description {
    color: var(--mechanicus-text);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .cert-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--mechanicus-border);
    margin-bottom: 1rem;
  }

  .cert-meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: var(--mechanicus-text-muted);
  }

  .cert-meta-item i {
    opacity: 0.6;
  }

  .cert-meta-label {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cert-meta-value {
    color: var(--mechanicus-white);
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .cert-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--mechanicus-black);
    color: var(--mechanicus-text);
    text-decoration: none;
    border: 1px solid var(--mechanicus-border);
    border-radius: 2px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    font-family: 'Courier New', monospace;
  }

  .cert-link:hover {
    background: var(--mechanicus-orange-subtle);
    border-color: var(--mechanicus-orange);
    color: var(--mechanicus-white);
    transform: translateX(3px);
  }

  .cert-link i {
    font-size: 0.85rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .certifications-header h1 {
      font-size: 2rem;
      letter-spacing: 2px;
    }

    .certifications-grid {
      grid-template-columns: 1fr;
    }

    .platform-header h2 {
      font-size: 1.4rem;
    }

    .stat-number {
      font-size: 2rem;
    }

    .cert-image-container {
      height: 220px;
    }
  }

  @media (max-width: 580px) {
    .certifications-header h1 {
      font-size: 1.6rem;
      letter-spacing: 1px;
    }

    .stats-overview {
      grid-template-columns: 1fr;
      max-width: 300px;
    }

    .cert-content {
      padding: 1.2rem;
    }

    .cert-header {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>

<div class="certifications-header">
  <h1>CERTIFICATIONS</h1>
  <p>Mes certifications obtenues et en cours en cybersécurité</p>
</div>

<div class="stats-overview">
  <div class="stat-card">
    <div class="stat-number" id="completed-count">2</div>
    <div class="stat-label">Complétées</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="progress-count">1</div>
    <div class="stat-label">En cours</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="planned-count">1</div>
    <div class="stat-label">Planifiée</div>
  </div>
  <div class="stat-card">
    <div class="stat-number" id="total-count">4</div>
    <div class="stat-label">Total</div>
  </div>
</div>

<div class="mechanicus-divider"></div>

<!-- TryHackMe Section -->
<div class="platform-section">
  <div class="platform-header">
    <h2>TryHackMe</h2>
    <span class="platform-badge thm">THM</span>
  </div>

  <div class="certifications-grid">
    <!-- Certificat Introduction to Cyber Security -->
    <div class="cert-card completed">
      <div class="cert-image-container">
        <img src="https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-5BFCGGQCAQ.pdf" 
             alt="Introduction to Cyber Security Certificate" 
             class="cert-image"
             onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color: var(--mechanicus-text-muted); text-align: center; padding: 2rem;\'>Certificat non disponible</p>'">
        <div class="cert-image-overlay">
          <a href="https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-5BFCGGQCAQ.pdf" 
             target="_blank" 
             class="cert-view-btn">
            Voir le certificat
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
      <div class="cert-content">
        <div class="cert-header">
          <div class="cert-title">Introduction to Cyber Security</div>
          <span class="cert-status completed">Complété</span>
        </div>
        <p class="cert-description">
          Certification validant la compréhension des concepts fondamentaux de la cybersécurité incluant la sécurité offensive et défensive.
        </p>
        <div class="cert-meta">
          <div class="cert-meta-item">
            <i class="fas fa-calendar-check"></i>
            <span class="cert-meta-label">Obtenu:</span>
            <span class="cert-meta-value">2024</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-layer-group"></i>
            <span class="cert-meta-label">Niveau:</span>
            <span class="cert-meta-value">Débutant</span>
          </div>
        </div>
        <a href="https://tryhackme.com/path/outline/introtocyber" target="_blank" class="cert-link">
          Voir le path officiel
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>

    <!-- Certificat Cyber Security 101 - METTEZ VOTRE LIEN ICI -->
    <div class="cert-card completed">
      <div class="cert-image-container">
        <img src="https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-5BFCGGQCAQ.pdf" 
             alt="Cyber Security 101 Certificate" 
             class="cert-image"
             onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color: var(--mechanicus-text-muted); text-align: center; padding: 2rem;\'>Certificat non disponible</p>'">
        <div class="cert-image-overlay">
          <a href="https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-5BFCGGQCAQ.pdf" 
             target="_blank" 
             class="cert-view-btn">
            Voir le certificat
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
      <div class="cert-content">
        <div class="cert-header">
          <div class="cert-title">Cyber Security 101</div>
          <span class="cert-status completed">Complété</span>
        </div>
        <p class="cert-description">
          Certification avancée couvrant les fondamentaux approfondis de la cybersécurité et du pentesting sur TryHackMe.
        </p>
        <div class="cert-meta">
          <div class="cert-meta-item">
            <i class="fas fa-calendar-check"></i>
            <span class="cert-meta-label">Obtenu:</span>
            <span class="cert-meta-value">2024</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-layer-group"></i>
            <span class="cert-meta-label">Niveau:</span>
            <span class="cert-meta-value">Intermédiaire</span>
          </div>
        </div>
        <a href="https://tryhackme.com/r/path/outline/cybersecurity101" target="_blank" class="cert-link">
          Voir le path officiel
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="mechanicus-divider"></div>

<!-- HackTheBox Section -->
<div class="platform-section">
  <div class="platform-header">
    <h2>HackTheBox</h2>
    <span class="platform-badge htb">HTB</span>
  </div>

  <div class="certifications-grid">
    <!-- Penetration Tester Job Role Path - En cours -->
    <div class="cert-card in-progress">
      <div class="cert-image-container" style="background: var(--mechanicus-mid-grey);">
        <div style="text-align: center; padding: 2rem;">
          <i class="fas fa-laptop-code" style="font-size: 4rem; color: var(--mechanicus-orange); opacity: 0.4; margin-bottom: 1rem;"></i>
          <p style="color: var(--mechanicus-text-muted); text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">Formation en cours</p>
        </div>
      </div>
      <div class="cert-content">
        <div class="cert-header">
          <div class="cert-title">Penetration Tester Job Role Path</div>
          <span class="cert-status in-progress">En cours</span>
        </div>
        <p class="cert-description">
          Formation complète couvrant tous les aspects du pentesting moderne : énumération, exploitation web, Active Directory, et post-exploitation.
        </p>
        <div class="cert-meta">
          <div class="cert-meta-item">
            <i class="fas fa-clock"></i>
            <span class="cert-meta-label">Durée:</span>
            <span class="cert-meta-value">~320h</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-book"></i>
            <span class="cert-meta-label">Modules:</span>
            <span class="cert-meta-value">28</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-calendar"></i>
            <span class="cert-meta-label">Début:</span>
            <span class="cert-meta-value">2025</span>
          </div>
        </div>
        <a href="https://academy.hackthebox.com/path/preview/penetration-tester" target="_blank" class="cert-link">
          Voir le path officiel
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>

    <!-- CPTS Certification - Planifiée -->
    <div class="cert-card planned">
      <div class="cert-image-container" style="background: var(--mechanicus-mid-grey);">
        <div style="text-align: center; padding: 2rem;">
          <i class="fas fa-certificate" style="font-size: 4rem; color: var(--htb-green); opacity: 0.4; margin-bottom: 1rem;"></i>
          <p style="color: var(--mechanicus-text-muted); text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">Objectif 2026</p>
        </div>
      </div>
      <div class="cert-content">
        <div class="cert-header">
          <div class="cert-title">CPTS</div>
          <span class="cert-status planned">Planifiée</span>
        </div>
        <p class="cert-description">
          Certified Penetration Testing Specialist. Certification professionnelle reconnue internationalement validant des compétences techniques avancées en pentesting.
        </p>
        <div class="cert-meta">
          <div class="cert-meta-item">
            <i class="fas fa-stopwatch"></i>
            <span class="cert-meta-label">Examen:</span>
            <span class="cert-meta-value">10 jours</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-file-alt"></i>
            <span class="cert-meta-label">Rapport:</span>
            <span class="cert-meta-value">Requis</span>
          </div>
          <div class="cert-meta-item">
            <i class="fas fa-calendar"></i>
            <span class="cert-meta-label">Prévu:</span>
            <span class="cert-meta-value">2026</span>
          </div>
        </div>
        <a href="https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist" target="_blank" class="cert-link">
          En savoir plus
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  // Animation des compteurs
  document.addEventListener('DOMContentLoaded', function() {
    animateCounter('completed-count', 2);
    animateCounter('progress-count', 1);
    animateCounter('planned-count', 1);
    animateCounter('total-count', 4);
  });

  function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const steps = 30;
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
</script>