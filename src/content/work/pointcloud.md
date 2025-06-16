---
title: Visionneuse de nuages de points
publishDate: 2025-10-02 00:00:00
img: /assets/portfolio/pointcloud.jpg
img_alt: pointcloud
description: |
  Ce site web permet de naviguer en 3D dans un nuage de points avec des outils de mesures, coupe, tracés, ...
tags:
  - Web
  - Rust
  - Bootstrap
  - Three.js
  - PostgreSQL
---

Ce site web est à destination d'un grand panel de clients.
Il permet d'uploader un nuage de points en ligne afin de le manipuler.
Nous avons cherché à rendre son utilisation la plus intuitive possible.
<p>De mon côté je me suis principalement occupé du développement d'une nouvelle fonctionnalité importante, celle du tracé en 3D.
<p style="margin-top:0">Nous avions en effet identifié un besoin chez les clients qui est de mettre à jour les plans des locaux (plan d'implantation, plan de tuyauterie, etc...).
<p style="margin-top:0">Grace à cet outil il est possible de tracer des formes géométrique en 3D aimantées au nuage de points pour ensuite exporter un plan au format DXF.</p>
<p style="margin-top:0">Cela permet d'obtenir très rapidement un plan précis (dépendant de la qualité du nuage de points) de zones potentiellement difficiles d'accès.</p>

Je me suis aussi occupé de la maintenance et de l'optimisation des différents outils de l'application :
* Vue en coupe
* Mesure en 3D
* Ajout de modèles 3D
* Navigation via des images 360°
* Ajout de tags / fichiers
* Déplacement à la souris ou en vue FPS

