'use strict';

var CubeGraph = (function() {

    function CubeGraph(seitenlaenge, mittelpunkt_vector3) {
        this.seitenlaenge = seitenlaenge;
        this.mittelpunkt_vector3 = mittelpunkt_vector3;
    }

    CubeGraph.prototype.getPositions = function() {
        const g = [];

        const vorne_links_oben = this.mittelpunkt_vector3 + [-this.seitenlaenge, this.seitenlaenge, -this.seitenlaenge];
       
        const anzahl_punkte = 10; // Jede Gerade des Würfels besteht dann aus diesen Anzahl Punkten
        const richtungs_vector = [];
        richtungs_vector['x_positive'] = [this.seitenlaenge, 0, 0]; // Der Vektor der Richtung x schaut und die Länge der Seitenlänge des Würfels hat
        richtungs_vector['y_positive'] = [0, this.seitenlaenge, 0]; // Der Vektor der Richtung y schaut und die Länge der Seitenlänge des Würfels hat

        const p = vorne_links_oben; // Dieser Vektor wandert jetzt rund um den Würfel, und jede Zwischen-Station speichern wir in g.
        g.push(vorne_links_oben);


         // Jetzt die vordere obere Kante des Würfels zeichnen
        for(let i = 0; i < anzahl_punkte; ++i) {
            p = p + (richtungs_vector['x'] / anzahl_punkte);
            g.push(p);
        }


        let vorne_rechts_oben = [1, 1, -1];

        let vorne_links_unten = [-1, -1, -1];
        let vorne_rechts_unten = [1, -1, -1];

        let hinten_links_oben = [-1, 1, 1];
        let hinten_rechts_oben = [1, 1, 1];

        let hinten_links_unten = [-1, -1, 1];
        let hinten_rechts_unten = [1, -1, 1];

         [
                        vorne_links_oben, vorne_rechts_oben, vorne_links_unten, vorne_rechts_unten,
                        hinten_links_oben, hinten_rechts_oben, hinten_links_unten,hinten_rechts_unten 
                    ];

        return g;
    }


    return CubeGraph;

})()