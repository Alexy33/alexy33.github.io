---
layout: page
icon: fas fa-route
order: 6
---

<style>
  .roadmap-header {
    text-align: center;
    padding: 2rem 0;
    margin-bottom: 3rem;
  }

  .roadmap-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .objective-card {
    background: var(--card-bg);
    border-left: 4px solid #ff6b00;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 8px;
  }

  .phase {
    margin-bottom: 3rem;
    padding: 2rem;
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .phase-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .phase-icon {
    font-size: 2rem;
  }

  .phase.completed {
    border-left: 4px solid #28a745;
  }

  .phase.current {
    border-left: 4px solid #ffc107;
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.2);
  }

  .phase.future {
    border-left: 4px solid #6c757d;
    opacity: 0.8;
  }

  .task-list {
    list-style: none;
    padding: 0;
  }

  .task-list li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .task-list li::before {
    content: "✓";
    color: #28a745;
    font-weight: bold;
  }

  .task-list li.pending::before {
    content: "○";
    color: #6c757d;
  }

  .task-list li.current::before {
    content: "▶";
    color: #ffc107;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }

  .stat-card {
    background: var(--button-bg);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #ff6b00;
  }

  .timeline {
    margin: 2rem 0;
    padding-left: 2rem;
    border-left: 2px solid var(--border-color);
  }

  .timeline-item {
    margin-bottom: 2rem;
    position: relative;
  }

  .timeline-item::before {
    content: "●";
    position: absolute;
    left: -2.4rem;
    color: #ff6b00;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

<div class="roadmap-header">
  <h1>Ma Roadmap Cyber</h1>
  <p>Mon parcours personnel vers le pentesting et les certifications internationales</p>
</div>

<div class="objective-card">
  <h2>Mes Objectifs</h2>
  <ul>
    <li><strong>Court terme :</strong> Transition vers HTB Academy pour un apprentissage plus technique</li>
    <li><strong>Moyen terme :</strong> Obtenir la certification CPTS (HTB Certified Penetration Testing Specialist)</li>
    <li><strong>Long terme :</strong> Décrocher un poste en pentesting remote/international</li>
  </ul>
  <p style="margin-top: 1rem; font-style: italic;">Je publie régulièrement mes découvertes sur ce blog et j'apprends continuellement de nouvelles techniques.</p>
</div>

## Timeline

<div class="timeline">
  <div class="timeline-item">
    <h3>2024 - Fondations</h3>
    <p>Apprentissage des bases via TryHackMe</p>
  </div>
  <div class="timeline-item">
    <h3>Actuellement - Transition</h3>
    <p>Finalisation TryHackMe et préparation HTB Academy ← <strong>EN COURS</strong></p>
  </div>
  <div class="timeline-item">
    <h3>Prochaine étape - HTB Academy</h3>
    <p>Formation intensive sur le Penetration Tester Path</p>
  </div>
  <div class="timeline-item">
    <h3>2026 - Certification</h3>
    <p>Passage de la certification CPTS</p>
  </div>
  <div class="timeline-item">
    <h3>Objectif final - Carrière</h3>
    <p>Poste de pentester en remote/international</p>
  </div>
</div>

---

## Phase 1 : Fondations

<div class="phase completed">
  <div class="phase-header">
    <span class="phase-icon"></span>
    <h3>TryHackMe - Bases de la cybersécurité</h3>
  </div>
  
  <ul class="task-list">
    <li>Fondamentaux Linux et réseau</li>
    <li>Introduction au pentesting web</li>
    <li>Scripting Python pour l'automatisation</li>
    <li>Premiers write-ups et documentation</li>
  </ul>

  <p><strong>Compétences acquises :</strong></p>
  <p>Bases solides en pentesting, navigation système, compréhension réseau, et documentation technique via write-ups.</p>
</div>

---

## Phase 2 : Formation intensive

<div class="phase current">
  <div class="phase-header">
    <span class="phase-icon"></span>
    <h3>HTB Academy - Penetration Tester Path</h3>
  </div>
  
  <p><strong>Prochaine étape :</strong> Transition vers HTB Academy pour approfondir mes compétences techniques</p>
  
  <ul class="task-list">
    <li class="current">Finalisation de la formation TryHackMe</li>
    <li class="pending">Démarrage HTB Academy Penetration Tester Path</li>
    <li class="pending">Fundamentals : Réseau, Linux, Windows</li>
    <li class="pending">Basic : Enumération, Information Gathering</li>
    <li class="pending">Intermediate : Web exploitation, Shells & Payloads</li>
    <li class="pending">Advanced : SQLi, XSS, Active Directory basics</li>
    <li class="pending">Pratique sur HackTheBox (boxes Easy → Medium)</li>
  </ul>

  <p><strong>Objectif :</strong></p>
  <p>Compléter le Penetration Tester Path (~300-350h de contenu) pour acquérir des compétences techniques avancées. Publication régulière de write-ups pour documenter ma progression.</p>

  <p><strong>Pourquoi HTB Academy ?</strong></p>
  <ul>
    <li>Contenu plus technique et approfondi</li>
    <li>Reconnaissance professionnelle accrue</li>
    <li>Préparation optimale aux certifications</li>
    <li>Labs réalistes et challengeants</li>
  </ul>
</div>

---

## Phase 3 : Certification professionnelle

<div class="phase future">
  <div class="phase-header">
    <span class="phase-icon"></span>
    <h3>CPTS - Certified Penetration Testing Specialist</h3>
  </div>
  
  <p><strong>Objectif :</strong> Obtenir une certification reconnue internationalement</p>
  
  <ul class="task-list">
    <li class="pending">Révisions approfondies du Penetration Tester Path</li>
    <li class="pending">Pratique intensive sur boxes HackTheBox</li>
    <li class="pending">Simulations d'examen et préparation</li>
    <li class="pending">Passage de la certification CPTS</li>
  </ul>

  <p><strong>CPTS - HackTheBox Academy :</strong></p>
  <p>Certification technique de niveau professionnel, reconnue internationalement. Format : 10 jours d'examen pratique + 10 jours pour le rapport complet.</p>
  
  <p><strong>Valeur ajoutée :</strong></p>
  <ul>
    <li>Validation de compétences techniques solides</li>
    <li>Reconnaissance internationale</li>
    <li>Atout majeur pour le marché du travail</li>
    <li>Possibilité d'évolution vers OSCP par la suite</li>
  </ul>
</div>

---

## Phase 4 : Job Remote/International (Futur)

<div class="phase future">
  <div class="phase-header">
    <span class="phase-icon"></span>
    <h3>Recherche de poste</h3>
  </div>
  
  <p><strong>Timeline :</strong> 2027+</p>
  
  <ul class="task-list">
    <li class="pending">Portfolio GitHub solide (scripts, outils)</li>
    <li class="pending">50+ write-ups publiés</li>
    <li class="pending">CPTS obtenu</li>
    <li class="pending">Anglais technique confirmé</li>
    <li class="pending">Candidatures remote (EU, Canada, etc.)</li>
  </ul>

  <p><strong>Pays/Types de jobs ciblés :</strong></p>
  <ul>
    <li>Remote-first companies (startups tech)</li>
    <li>UK, Canada, pays nordiques</li>
    <li>Pentester junior / Security analyst</li>
    <li>Possibilité d'upgrade avec OSCP si nécessaire</li>
  </ul>
</div>

---

## Défis & Approche

### Challenge : Concilier études et apprentissage cyber
**Approche :** Organisation rigoureuse et passion pour le domaine permettent de progresser régulièrement tout en maintenant un niveau académique élevé à Epitech.

### Challenge : Maîtriser des concepts techniques avancés
**Approche :** Apprentissage itératif, répétition des labs, et documentation systématique via write-ups. Chaque difficulté devient une opportunité d'apprentissage approfondi.

---

## Suivi & Documentation

Cette roadmap est mise à jour régulièrement pour refléter ma progression. Je documente mon parcours via des write-ups détaillés sur ce blog.

**Philosophie :** Apprentissage continu et partage de connaissances avec la communauté.

---

## Stratégie & Choix

**Pourquoi HTB Academy ?**

HTB Academy offre un contenu technique approfondi et une reconnaissance professionnelle croissante. La plateforme propose des labs réalistes qui préparent efficacement aux situations rencontrées en entreprise.

**Pourquoi CPTS ?**

La certification CPTS (Certified Penetration Testing Specialist) valide des compétences techniques solides et est de plus en plus reconnue sur le marché international. Elle offre un excellent tremplin vers des certifications plus avancées comme l'OSCP si nécessaire.

**Objectif international**

Le marché de la cybersécurité est globalisé. Viser des postes remote ou internationaux permet d'accéder à un éventail plus large d'opportunités et d'expériences enrichissantes dans des environnements multiculturels.

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--card-bg); border-radius: 12px;">
  <h3>🚀 Roadmap évolutive</h3>
  <p>Cette roadmap est mise à jour régulièrement pour refléter ma progression et mes apprentissages. Les write-ups publiés sur ce blog documentent mon parcours en détail.</p>
  <p><em>Dernière mise à jour : Novembre 2025</em></p>
</div>