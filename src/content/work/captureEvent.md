---
title: Capture et gestion d'évenements
publishDate: 2026-06-04 00:00:00
img:
  - mediaCapture.png
  - captureApp.jpg
img_alt: ApplicationMobiles
description: |
  Application mobile permettant de capturer un média en lui ajoutant des données. Un backoffice permet de gérer tout ce flux.
tags:
  - React native
  - Expo
  - Supabase
  - Cloudinary
  - Vercel
  - React
  - Vite
---

Cette application a été développé avec React native et en utilisant Expo.
Elle permet de capturer un média (photo, audio ou vidéo), de lui ajouter des métadonnées (Numéro d'affaire, client, commentaire, ...) et de la sauvegarder sur la base de données.

Pour la partie backend (base de données et stockage) j'ai utilisé Supabase.
Les photos et vidéos ont un overlay qui permet de les identifier rapidement (logo de l'entreprise, horodatage et position GPS). Pour les vidéos j'ai utilisé Cloudinary pour faire le traitement d'image.

Le back office développé avec React et Vite permet aux utilisateurs de gérer ces différents médias et données. En fonction de leur rôle ils peuvent voir ou non ceux des autres.
