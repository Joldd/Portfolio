---
title: Carbon Footprint Calculator
publishDate: 2025-16-06 00:00:00
img: 
  - "/assets/portfolio/impacts.png"
  - "/assets/portfolio/impacts2.png"
  - "/assets/portfolio/impacts3.png"
img_alt: Carbon_Footprint_Calculator
description: |
  Ce site web permet aux étudiants de calculer leur empreinte carbone.
tags:
  - React
  - Vite
  - Tailwind
  - Node.js
  - Docker
  - Traefik
---

Mon client souhaitait permettre à ses étudiants de prendre connaissance de leur impact carbone. Cependant, les tests existant actuellement ne permettait pas aux étudiants en alternance de renseigner leurs deux logements dans le calcul. C'est ce que qui différencie notre calculateur.
Je l'ai développé en utilisant les ressources fournies par l'l'ADEME  et nosGestesClimats (startUp d'état)

Les utilisateurs ont la possibilité de se créer un compte et de réaliser plusieurs calculs d'empreinte qu'ils pourront retrouver dans leur profil.
Le quiz a été pensé pour être dynamique avec un graphique se mettant à jour à chaque clic et donnant les informations en temps réel.
Un mode administrateur permet aux responsables pédagogiques d'effectuer des recherches dans les différents résultats obtenus sur le site. Ils peuvent obtenir des moyennes d'émission CO2 en fonction des formations, localisation, âges, tout en conservant l'anonymat des utilisateurs.

J'ai déployé ce site sur un serveur VPS en utilisant Docker et Traefik.