Wie erstellt man ein WebGL-Projekt mit Webpack in Visual Studio Code?
Ein einfaches Beispiel, das komplizierteste ist wohl die Sache mit Webpack.
(Wir leben schon in einer verrückten Welt, das Drumherum ist immer viel komplexer und grösser als das Projekt das man eigentlich machen wollte)

my-webgl-project/
├── dist/
│   |── bundle.js
|   └── index.html
├── src/
│   ├── utils/
│   │   └── MyUtil.js
│   └── index.js
├── package.json
└── webpack.config.js

1.) npm init -y
2.) npm install --save-dev webpack webpack-cli webpack-dev-server
3.) webpack.config.js erstellen (siehe im Projekt)
4.) npm install --save-dev @babel/core babel-loader @babel/preset-env
5.) In package.json die 2 Befehle in "scripts" hinzufügen: 
scripts": {
    "start": "webpack serve --open",
    "build": "webpack"
  }
6.) npm run build
7.) npm start
8.) Und hier kann man das Projekt dann anschauen im Browser: http://localhost:9000


Optional:

9.) Konsole in Visual Studio Code öffnen 

10.) git init
11.) git add .
12.) git commit -m "first commit"
13.) git remote add origin https://github.com/siffkroete13/WebGL_basic_example.git
14.) git push -u origin main

Fertig!