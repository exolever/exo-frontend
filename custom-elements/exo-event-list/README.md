[![Build Status](https://travis-ci.org/ExOLever/exo-service-wizard.svg?branch=devel)](https://travis-ci.org/ExOLever/exo-service-wizard)

![Logo](logo.png) **ExoLever Boilerplate Angular Elements**  

# Installation

1. `git clonehttps://github.com/ExOLever/exo-service-wizard.git`
2. `npm install`
3. `npm run start` to local or `npm run build:elements` to create the custom elements

# Create custom element

1. In the app module constructor, we are creating the customElement. You can modify the selector and the component.
2. Modify index.html to load your component.
3. npm run build:elements, this step will do the ng build and executo the build-script.js file to create an element folder with your custom-element.

# Sample Usage

1. Create an index.html file
2. ```html
   <exo-custom-element></exo-custom-element>
   <script src="https://github.com/ExOLever/exo-service-wizard/releases/download/X.Y.Z/exo-custom-element.js"></script>
   <link rel="stylesheet" href="https://github.com/ExOLever/exo-service-wizard/releases/download/X.Y.Z/styles.css">
   <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
   ```
   where X.Y.Z is the release number

# Running unit test

1. npm run test via karma.js

# Running e2e test

1. npm run e2e

# Running lint 

1. npm run lint

