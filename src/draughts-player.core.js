// ----------------------------------------------------------------------------------------------------
// Types énumérés
// ----------------------------------------------------------------------------------------------------

var Piece = {
    VIDE : 0,
    PBLANC : 1,
    PNOIR : 2,
    DBLANC : 3,
    DNOIR : 4
};

var Couleur = {
    AUCUNE : 0,
    BLANC : 1,
    NOIR : 2
};

var Diago = {
    DG : 0,
    TT : 1
};


// ----------------------------------------------------------------------------------------------------
// Classe Case
// ----------------------------------------------------------------------------------------------------
function Case() {
    this.numero = 0;
    this.piece = Piece.VIDE;
}

Case.prototype.init1 = function(numero) {
    this.numero = numero;
    return this;
};
Case.prototype.init2 = function(numero, piece) {
    this.numero = numero;
    this.piece = piece;
    return this;
};

Case.prototype.getNumero = function() {
    return this.numero;
};
Case.prototype.setNumero = function(numero) {
    this.numero = numero;
};
Case.prototype.getPiece = function() {
    return this.piece;
};
Case.prototype.setPiece = function(piece) {
    this.piece = piece;
};

Case.prototype.isPion = function() {
    return (this.piece === Piece.PBLANC || this.piece === Piece.PNOIR);
};
Case.prototype.isDame = function() {
    return (this.piece === Piece.DBLANC || this.piece === Piece.DNOIR);
};
Case.prototype.isBlanc = function() {
    return (this.piece === Piece.PBLANC || this.piece === Piece.DBLANC);
};
Case.prototype.isNoir = function() {
    return (this.piece === Piece.PNOIR || this.piece === Piece.DNOIR);
};
Case.prototype.isVide = function() {
    return (this.piece === Piece.VIDE);
};

Case.prototype.getCouleur = function() {
    var c = Couleur.AUCUNE;

    if (this.isBlanc()) {
        c = Couleur.BLANC;
    } else if (this.isNoir()) {
        c = Couleur.NOIR;
    }
    return c;
};

Case.prototype.debug = function() {
    console.log("Case n°" + this.numero + " (" + this.piece + ")");
};


// ----------------------------------------------------------------------------------------------------
// Classe RafleItem
// ----------------------------------------------------------------------------------------------------
function RafleItem() {
    this.numCasePrise = null;
    this.numCaseFinale = null;
}

RafleItem.prototype.init1 = function(numCasePrise, numCaseFinale) {
    this.numCasePrise = numCasePrise;
    this.numCaseFinale = numCaseFinale;
    return this;
};
RafleItem.prototype.init2 = function(numCase) {
    this.numCasePrise = null;
    this.numCaseFinale = numCase;
    return this;
};

RafleItem.prototype.getNumero = function() {
    return this.getNumeroCaseFinale();
};
RafleItem.prototype.getNumeroCaseFinale = function() {
    return this.numCaseFinale;
};
RafleItem.prototype.getNumeroCasePrise = function() {
    return this.numCasePrise;
};

RafleItem.prototype.toString = function() {
    //return JSON.stringify(this);
    return "" + this.numCaseFinale;
};



// ----------------------------------------------------------------------------------------------------
// Classe Mouvement
// ----------------------------------------------------------------------------------------------------
function Mouvement() {
    this.numCaseDepart = null;
    this.numCaseArrivee = null;
    this.numCasesInter = []; // [int]

    this.isPrise = false;
    this.isPromuDame = false;

    this.casesPose = [];  // [int]
    this.casesPrise = []; // [Case]

    this.statut = true;
    this.message = "";
}

Mouvement.prototype.init = function(numDepart, numArrivee) {
    this.numCaseDepart = numDepart;
    this.numCaseArrivee = numArrivee;
    this.numCasesInter = []; // [int]

    this.casesPose = [];  // [int]
    this.casesPrise = []; // [Case]

    this.statut = true;
    this.message = "";
    return this;
};


Mouvement.prototype.getNumCaseDepart = function() {
    return this.numCaseDepart;
};
Mouvement.prototype.setNumCaseDepart = function(numCaseDepart) {
    this.numCaseDepart = numCaseDepart;
};
Mouvement.prototype.getNumCaseArrivee = function() {
    return this.numCaseArrivee;
};
Mouvement.prototype.setNumCaseArrivee = function(numCaseArrivee) {
    this.numCaseArrivee = numCaseArrivee;
};
Mouvement.prototype.getNumCasesInter = function() {
    return this.numCasesInter;
};
Mouvement.prototype.setNumCasesInter = function(numCasesInter) {
    this.numCasesInter = numCasesInter;
};
Mouvement.prototype.isPrise = function() {
    return this.isPrise;
};
Mouvement.prototype.setPrise = function(isPrise) {
    this.isPrise = isPrise;
};
Mouvement.prototype.isPromuDame = function() {
    return this.isPromuDame;
};
Mouvement.prototype.setPromuDame = function(isPromuDame) {
    this.isPromuDame = isPromuDame;
};
Mouvement.prototype.getCasesPose = function() {
    return this.casesPose;
};
Mouvement.prototype.getCasesPrise = function() {
    return this.casesPrise;
};
Mouvement.prototype.addNumCasePose = function(numCase) {
    this.casesPose.push(numCase);
};
Mouvement.prototype.addNumCasePrise = function(numCase, piece) {
    this.casesPrise.push(new Case().init2(numCase, piece));
};
Mouvement.prototype.isStatut = function() {
    return this.statut;
};
Mouvement.prototype.setStatut = function(statut) {
    this.statut = statut;
};
Mouvement.prototype.getMessage = function() {
    return this.message;
};
Mouvement.prototype.setMessage = function(message) {
    this.message = message;
};

Mouvement.prototype.nbCasesPrises = function() {
    return this.casesPrise.length;
};

Mouvement.prototype.size = function() {
    return this.casesPrise.length + this.casesPose.length;
};

Mouvement.prototype.toString = function() {
    var tmp = "";
    var nb = this.casesPose.length;
    for (var i = 0; i < nb; i++) {
        if (tmp !== "") {
            tmp += ", ";
        }
        tmp += this.casesPose[i];
    }

    var tmp2 = "";
    for (var i = 0; i < this.casesPrise.length; i++) {
        if (tmp2 !== "") {
            tmp2 += ", ";
        }
        tmp2 += this.casesPrise[i].getNumero();
    }

    var sep = "-";
    if (this.isPrise) {
        sep = "x";
    }

    var s = "" + this.numCaseDepart;
    if (this.numCasesInter.length > 0) {
        s += sep + "(" + this.numCasesInter + ")";
    }
    s += sep + this.numCaseArrivee;
    s += " : Pose(" + tmp + ")";
    s += " - Pris(" + tmp2 + ")";
    s += " - Statut(" + this.statut + ")";
    return s;
};

Mouvement.prototype.getNotation = function() {
    var sep = this.isPrise() ? "x" : "-";

    var s = "";
    s += this.numCaseDepart;

    if (this.numCasesInter.length > 0) {
        s += sep;
        s += this.numCasesInter;
    }

    s += sep;
    s += this.numCaseArrivee;
    return s;
};

/*
 * Vrai si
 * <ul>
 * <li>Même case de départ</li>
 * <li>Même case d'arrivée</li>
 * <li>Mêmes cases prises</li>
 * </ul>
 */
Mouvement.prototype.equals = function(mouvement) {
    var isEqual = true;

    isEqual = isEqual && (this.getNumCaseDepart() == mouvement.getNumCaseDepart());
    isEqual = isEqual && (this.getNumCaseArrivee() == mouvement.getNumCaseArrivee());

    if (isEqual) {
        var lc = this.getCasesPrise();
        var lc2 = mouvement.getCasesPrise();

        isEqual = isEqual && (lc.length == lc2.length);
        if (isEqual) {
            for (var i = 0; i < lc.length; i++) {
                var trouve = false;
                for (var j = 0; j < lc2.length; j++) {
                    if (lc[i].getNumero() == lc2[j].getNumero() && lc[i].getPiece() == lc2[j].getPiece()) {
                        trouve = true;
                    }
                }
                if (!trouve) {
                    isEqual = false;
                    break;
                }
            }
        }
    }

    return isEqual;
};


// ----------------------------------------------------------------------------------------------------
// Classe Damier
// ----------------------------------------------------------------------------------------------------
function Damier() {

    /** Les 50 cases noires du damier. */
    this.cases = []; // [Case]

    /** Liste des diagonales parallèles à la Grande Diagonale. */
    this.diagonalesGD = [
        [ 6, 1 ], 
        [ 16, 11, 7, 2 ], 
        [ 26, 21, 17, 12, 8, 3 ], 
        [ 36, 31, 27, 22, 18, 13, 9, 4 ], 
        [ 46, 41, 37, 32, 28, 23, 19, 14, 10, 5 ],
        [ 47, 42, 38, 33, 29, 24, 20, 15 ], 
        [ 48, 43, 39, 34, 30, 25 ], 
        [ 49, 44, 40, 35 ], 
        [ 50, 45 ] 
    ];

    /** Liste des diagonale parallèle au Tric Trac. */
    this.diagonalesTT = [ 
        [ 5 ], 
        [ 15, 10, 4 ], 
        [ 25, 20, 14, 9, 3 ], 
        [ 35, 30, 24, 19, 13, 8, 2 ], 
        [ 45, 40, 34, 29, 23, 18, 12, 7, 1 ], 
        [ 50, 44, 39, 33, 28, 22, 17, 11, 6 ],
        [ 49, 43, 38, 32, 27, 21, 16 ], 
        [ 48, 42, 37, 31, 26 ], 
        [ 47, 41, 36 ], 
        [ 46 ] 
    ];
}

Damier.prototype.init = function() {
    this.cases = [];
    
    /** Initialisation des 50 cases noires. */
    for (var k = 1; k <= 50; k++) {
        var c = new Case().init1(k);
        this.cases.push(c);
    }

    return this;
};


/** Position initiale : 20 x 20 */
Damier.prototype.setPosition20x20 = function() {
    for (var num = 1; num <= 20; num++) {
        this.setPiece(num, Piece.PNOIR);
    }

    for (var num = 31; num <= 50; num++) {
        this.setPiece(num, Piece.PBLANC);
    }
};

/** Pose des pièces sur le damier */
Damier.prototype.setPosition = function(piece, numeros) {
    for (var k = 0; k < numeros.length; k++) {
        this.setPiece(numeros[k], piece);
    }
};

/** Ajouter une pièce sur une case. */
Damier.prototype.setPiece = function(numero, piece) {
    var c = this.getCase(numero);
    c.setPiece(piece);
};

/** Retourne une case. */
Damier.prototype.getCase = function(numero) {
    return this.cases[numero - 1];
};

/** Connaitre la pièce se trouvant sur une case. */
Damier.prototype.isPiece = function(numero, piece) {
    return (this.getPiece(numero) === piece);
};

/** Retourne la pièce. */
Damier.prototype.getPiece = function(numero) {
    return this.getCase(numero).getPiece();
};

/** Retourne la diagonaleGD contenant une case donnée. */
Damier.prototype.getDiagonaleGD = function(numero) {
    var diag = [];
    boucle: 
    for (var i = 0; i < this.diagonalesGD.length; i++) {
        var diagonale = this.diagonalesGD[i];
        for (var j = 0; j < diagonale.length; j++) {
            if (diagonale[j] === numero) {
                diag = diagonale;
                break boucle;
            }
        }
    }

    var diago = new Diagonale().init(Diago.GD);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

/** Retourne la diagonaleTT contenant une case donnée. */
Damier.prototype.getDiagonaleTT = function(numero) {
    var diag = [];
    boucle: 
    for (var i = 0; i < this.diagonalesTT.length; i++) {
        var diagonale = this.diagonalesTT[i];
        for (var j = 0; j < diagonale.length; j++) {
            if (diagonale[j] === numero) {
                diag = diagonale;
                break boucle;
            }
        }
    }

    var diago = new Diagonale().init(Diago.TT);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

Damier.prototype.cloneDamier = function() {
    var d = new Damier().init();

    for (var k = 0; k < this.cases.length; k++) {
        var c = this.cases[k];
        d.setPiece(c.getNumero(), c.getPiece());
    }

    return d;
};

/** Applique le mouvement sur le damier. */
Damier.prototype.jouer = function(mouvement) {
    var pieceJouee = this.getPiece(mouvement.getNumCaseDepart());

    // Retirer la pièce de la case de départ
    this.setPiece(mouvement.getNumCaseDepart(), Piece.VIDE);

    // Retirer les pièces des cases prises
    for (var i = 0; i < mouvement.getCasesPrise().length; i++) {
        var c = mouvement.getCasesPrise()[i];
        this.setPiece(c.getNumero(), Piece.VIDE);
    }

    // Poser la pièce sur la case d'arrivée
    if (!mouvement.isPromuDame()) {
        this.setPiece(mouvement.getNumCaseArrivee(), pieceJouee);
    }
    // Ce mouvement promeu en Dame
    else {
        if (pieceJouee == Piece.PBLANC) {
            this.setPiece(mouvement.getNumCaseArrivee(), Piece.DBLANC);
        } else if (pieceJouee == Piece.PNOIR) {
            this.setPiece(mouvement.getNumCaseArrivee(), Piece.DNOIR);
        }
    }
};

/** Annule le mouvement sur le damier. */
Damier.prototype.jouerInv = function(mouvement) {
    var pieceJouee = this.getPiece(mouvement.getNumCaseArrivee());

    // Retirer la pièce de la case d'arrivée
    this.setPiece(mouvement.getNumCaseArrivee(), Piece.VIDE);

    // Remettre les pièces qui avaient été prises.
    for (var i = 0; i < mouvement.getCasesPrise().length; i++) {
        var c = mouvement.getCasesPrise()[i];
        this.setPiece(c.getNumero(), c.getPiece());
    }

    // Remettre la pièce sur la case de départ
    if (!mouvement.isPromuDame()) {
        this.setPiece(mouvement.getNumCaseDepart(), pieceJouee);
    }

    // La dame redevient pion
    else {
        if (pieceJouee == Piece.DBLANC) {
            this.setPiece(mouvement.getNumCaseDepart(), Piece.PBLANC);
        } else if (pieceJouee == Piece.DNOIR) {
            this.setPiece(mouvement.getNumCaseDepart(), Piece.PNOIR);
        }
    }
};

Damier.prototype.debugDamier = function() {
    var ligne = "";

    console.log("================================");
    for (var k = 0; k < 10; k++) {
        ligne += "|";
        for (var l = 1; l <= 5; l++) {

            var num = 5 * k + l;
            var p = this.getCase(num).getPiece();

            if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                ligne += "   ";
            }

            switch (p) {
            case Piece.PBLANC:
                ligne += " o ";
                break;
            case Piece.PNOIR:
                ligne += " x ";
                break;
            case Piece.DBLANC:
                ligne += " O ";
                break;
            case Piece.DNOIR:
                ligne += " X ";
                break;
            default:
                ligne += " . ";
            }

            if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                ligne += "   ";
            }
        }
        ligne += "|";

        console.log(ligne);
        ligne = "";
    }
    console.log("================================");
};




// ----------------------------------------------------------------------------------------------------
// Class NTree
// ----------------------------------------------------------------------------------------------------
function NTree() {
    this.element = null; // E
    this.left = null;  // NTree<E>
    this.right = null; // NTree<E>
}


NTree.prototype.init1 = function() {
    this.element = null;
    this.left = null;
    this.right = null;
    return this;
};

NTree.prototype.init2 = function(element) {
    this.element = element;
    this.left = null;
    this.right = null;
    return this;
};

NTree.prototype.getElement = function() {
    return this.element;
};

NTree.prototype.setElement = function(element) {
    this.element = element;
};

NTree.prototype.hasGauche = function() {
    return (this.left != null);
};

NTree.prototype.hasDroit = function() {
    return (this.right != null);
};

NTree.prototype.isFeuille = function() {
    return !(this.hasDroit());
};

// Ajoute une liste de fils dans un noeud binaire
// (fils à droite, frère à gauche)
NTree.prototype.setFils = function(liste) {
    var nb = liste.length;
    if (nb > 0) {
        var val = liste[0];

        // 1er element en fils droit
        var btCourant = new NTree().init2(val);
        this.right = btCourant;

        // les autres : en frère à gauche
        if (nb > 1) {
            for (var k = 1; k < nb; k++) {
                var btg = new NTree().init1();
                btg.setElement(liste[k]);
                btCourant.left = btg;
                btCourant = btg;
            }
        }
    }
};

// Retourne tous les fils
NTree.prototype.getFils = function() {
    var liste = [];

    if (this.hasDroit()) {
        // Ajout du fils droits
        var btd = this.right;
        liste.push(btd.getElement());

        // Et des fils gauche successifs
        var btCourant = btd;
        while (btCourant.hasGauche()) {
            liste.push(btCourant.left.getElement());
            btCourant = btCourant.left;
        }
    }
    return liste;
};

// Retourne tous les noeuds fils
NTree.prototype.getNoeudsFils = function() {
    var liste = [];

    if (this.hasDroit()) {
        // Ajout du fils droits
        var btd = this.right;
        liste.push(btd);

        // Et des fils gauches successifs
        var btCourant = btd;
        while (btCourant.hasGauche()) {
            liste.push(btCourant.left);
            btCourant = btCourant.left;
        }
    }
    return liste;
};

NTree.prototype.traverse = function() {
    var listes = [[]];
    traverse(this, [], listes);
    return listes;
};

NTree.prototype.traverse = function(node, path, result) {
    path.push(node);
    if (node.isFeuille()) {
        var res = [];
        for (var k = 0; k < path.length; k++) {
            res.push(path[k].getElement());
        }
        result.push(res);
    } else {
        var fils = node.getNoeudsFils();

        for (var i = 0; i < fils.length; i++) {
            traverse(n, [path], result);
        }
    }
};



// ----------------------------------------------------------------------------------------------------
// Class Diagonale
// ----------------------------------------------------------------------------------------------------
function Diagonale() {
    this.cases = []; // [case]
    this.type = null; // Diago
}


Diagonale.prototype.init1 = function(typeDiago) {
    this.cases = [];
    this.type = typeDiago;
    return this;
};


Diagonale.prototype.addCase = function(c) {
    this.cases.push(c);
};

Diagonale.prototype.size = function() {
    return this.cases.length;
};

Diagonale.prototype.getCaseByNumero = function(numero) {
    var c = null;
    for (var k = 0; k < this.size(); k++) {
        var cTmp = this.cases[k];
        if (cTmp.getNumero() == numero) {
            c = cTmp;
            break;
        }
    }
    return c;
};

Diagonale.prototype.getCaseByIndex = function(idx) {
    return this.cases[idx];
};

/** index de la case dans la liste. */
Diagonale.prototype.indexOf = function(numero) {
    var idx = -1;
    for (var k = 0; k < this.size(); k++) {
        var c = this.cases[k];
        if (c.getNumero() == numero) {
            idx = k;
            break;
        }
    }
    return idx;
};

Diagonale.prototype.isVide = function(idxCase) {
    var piece = this.cases[idxCase];
    return piece.isVide();
};

Diagonale.prototype.getCouleurByIndex = function(idxCase) {
    var piece = this.cases[idxCase];
    return piece.getCouleur();
};

Diagonale.prototype.isCouleurOppose = function(c1, c2) {
    return ((c1 == Couleur.BLANC && c2 == Couleur.NOIR) || (c1 == Couleur.NOIR && c2 == Couleur.BLANC));
};

Diagonale.prototype.getDeplacementsSimples = function(numCase) {
    var liste = [];

    var c = this.getCaseByNumero(numCase);
    var lg = this.size();
    var idxCase = this.indexOf(numCase);

    // Déplacement Pion Blanc dans le sens gauche-droite ?
    if (c.getPiece() == Piece.PBLANC) {
        // La case à droite doit être libre.
        if (idxCase + 1 < lg) {
            if (this.isVide(idxCase + 1)) {
                liste.push(this.getCaseByIndex(idxCase + 1).getNumero());
            }
        }

    }
    // Déplacement Pion Noir dans le sens droite-gauche ?
    else if (c.getPiece() == Piece.PNOIR) {
        // La case à gauche doit être libre.
        if (idxCase - 1 >= 0) {
            if (this.isVide(idxCase - 1)) {
                liste.push(this.getCaseByIndex(idxCase - 1).getNumero());
            }
        }
    }

    // Déplacement Dame Blanche ou Noire dans les 2 sens
    else if (c.isDame()) {

        // Déplacement dans le sens gauche-droite ?
        // -----------------------------------------
        // Au moins 1 case à droite.
        if (idxCase + 1 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxCase + 1; k < lg; k++) {
                if (this.isVide(k)) {
                    liste.push(this.getCaseByIndex(k).getNumero());
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

        }

        // Déplacement dans le sens droite-gauche ?
        // -----------------------------------------
        // Au moins 1 case à gauche.
        if (idxCase - 1 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxCase - 1; k >= 0; k--) {
                if (this.isVide(k)) {
                    liste.push(this.getCaseByIndex(k).getNumero());
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }
        }
    }

    return liste;
};


/**
 * @param numCasesDejaPrises
 *            Pour ne pas la reprendre (coup Turc).
 */
Diagonale.prototype.getRaflesItem = function(numCase, numCasesDejaPrises) {
    var c = this.getCaseByNumero(numCase);
    var couleur = c.getCouleur();

    raflesItem = [];

    var lg = this.size();
    var idxCase = this.indexOf(numCase);

    if (c.isPion()) {

        // Prise dans le sens gauche-droite ?
        // S'il y a au moins 2 cases devant.
        if (idxCase + 2 < lg) {
            if (this.isVide(idxCase + 2)) {
                var cCase1 = this.getCouleurByIndex(idxCase + 1);
                if (this.isCouleurOppose(couleur, cCase1)) {
                    // prise OK
                    var casePrise = this.getCaseByIndex(idxCase + 1);
                    var caseArrivee = this.getCaseByIndex(idxCase + 2);
                    if (!numCasesDejaPrises.contains(casePrise.getNumero())) {
                        var ri = new RafleItem().init1(casePrise.getNumero(), caseArrivee.getNumero());
                        raflesItem.push(ri);
                    }
                }
            }
        }

        // Prise dans le sens droite-gauche ?
        // S'il y a au moins 2 cases derrière.
        if (idxCase - 2 >= 0) {
            if (this.isVide(idxCase - 2)) {
                var cCase1 = this.getCouleurByIndex(idxCase - 1);
                if (this.isCouleurOppose(couleur, cCase1)) {
                    // prise OK
                    var casePrise = this.getCaseByIndex(idxCase - 1);
                    var caseArrivee = this.getCaseByIndex(idxCase - 2);
                    // System.out.println("debug[" + this.type + "] : " +
                    // (idxCase - 1) + "=" + casePrise);
                    if (!numCasesDejaPrises.contains(casePrise.getNumero())) {
                        var ri = new RafleItem().init1(casePrise.getNumero(), caseArrivee.getNumero());
                        raflesItem.push(ri);
                    }
                }

            }
        }
    } else if (c.isDame()) {

        // -----------------------------------
        // Prise dans le sens gauche-droite ?
        // -----------------------------------

        // il faut : [0..n] vide + 1 Couleur opposee + [1..n] vide
        var nbVideAvant = 0;
        var idxPieceAPrendre = -1;
        var nbVideApres = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases devant.
        if (idxCase + 2 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxCase + 1; k < lg; k++) {
                if (this.isVide(k)) {
                    nbVideAvant++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'après n'est pas hors du damier
            if (idxCase + nbVideAvant + 2 < lg) {
                idxPieceAPrendre = idxCase + nbVideAvant + 1;
                // Case casePrise = getCaseByIndex(idxPieceAPrendre);

                // S'assurer que la case prise est de couleur opposée.
                var cCasePrise = this.getCouleurByIndex(idxPieceAPrendre);
                if (this.isCouleurOppose(couleur, cCasePrise)) {
                    // Verifier qu'il existe au moins une case
                    // d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceAPrendre + 1; k < lg; k++) {
                        if (this.isVide(k)) {
                            nbVideApres++;
                        } else {
                            // On a rencontré une pièce ou le bord
                            // => fin d'analyse.
                            break;
                        }
                    }

                }
            }
        }

        // Y a t-il une prise possible ?
        if (idxPieceAPrendre >= 0 && nbVideApres > 0) {
            var casePrise = this.getCaseByIndex(idxPieceAPrendre);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!numCasesDejaPrises.contains(casePrise.getNumero())) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbVideApres; k++) {
                    var caseArrivee = this.getCaseByIndex(idxPieceAPrendre + k);
                    var ri = new RafleItem().init1(casePrise.getNumero(), caseArrivee.getNumero());
                    raflesItem.push(ri);
                }
            }

        }

        // -----------------------------------
        // Prise dans le sens droite-gauche ?
        // -----------------------------------

        // il faut : [0..n] vide + 1 Couleur opposee + [1..n] vide
        nbVideAvant = 0;
        idxPieceAPrendre = -1;
        nbVideApres = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases derrière.
        if (idxCase - 2 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxCase - 1; k >= 0; k--) {
                if (this.isVide(k)) {
                    nbVideAvant++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'avant n'est pas hors du damier
            if (idxCase - nbVideAvant - 2 >= 0) {
                idxPieceAPrendre = idxCase - nbVideAvant - 1;
                // Case casePrise = getCaseByIndex(idxPieceAPrendre);

                // S'assurer que la case prise est de couleur opposée.
                var cCasePrise = this.getCouleurByIndex(idxPieceAPrendre);
                if (this.isCouleurOppose(couleur, cCasePrise)) {
                    // Verifier qu'il existe au moins une case
                    // d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceAPrendre - 1; k >= 0; k--) {
                        if (this.isVide(k)) {
                            nbVideApres++;
                        } else {
                            // On a rencontré une pièce ou le bord
                            // => fin d'analyse.
                            break;
                        }
                    }

                }
            }
        }

        // Y a t-il une prise possible ?
        if (idxPieceAPrendre >= 0 && nbVideApres > 0) {
            var casePrise = this.getCaseByIndex(idxPieceAPrendre);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!numCasesDejaPrises.contains(casePrise.getNumero())) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbVideApres; k++) {
                    var caseArrivee = this.getCaseByIndex(idxPieceAPrendre - k);
                    var ri = new RafleItem().init1(casePrise.getNumero(), caseArrivee.getNumero());
                    raflesItem.push(ri);
                }
            }
        }
    }

    return raflesItem;
};

Diagonale.prototype.toString = function() {
    var s = "Diagonale [" + this.type + "] = ";

    for (var k = 0; k < this.size(); k++) {
        s += this.cases[k].getNumero();
        var p = this.cases[k].getPiece();

        s += "[";
        switch (p) {
            case Piece.PBLANC:
                s += "b";
                break;
            case Piece.PNOIR:
                s += "n";
                break;
            case Piece.DBLANC:
                s += "B";
                break;
            case Piece.DNOIR:
                s += "N";
                break;
            default:
                s += "*";
        }
        s += "] ";
    }

    return s;
};




// ----------------------------------------------------------------------------------------------------
// Class PathFinder
// ----------------------------------------------------------------------------------------------------
function PathFinder() {
}

PathFinder.prototype.init = function() {
    return this;
};


PathFinder.prototype.getMouvementsSimples = function(damier, numCaseDepart) {
    var mouvements = []; // [Mouvement]

    // Récupération des 2 diagonales
    var diagoGD = damier.getDiagonaleGD(numCaseDepart);
    var diagoTT = damier.getDiagonaleTT(numCaseDepart);

    // Déplacements simples (observés sur chacune des 2 diagonales)
    var liste = diagoGD.getDeplacementsSimples(numCaseDepart);
    liste = liste.concat(diagoTT.getDeplacementsSimples(numCaseDepart));

    for (var k = 0; k < liste.length; k++) {
        var numCaseArrivee = liste[k];
        var mouvement = new Mouvement().init(numCaseDepart, numCaseArrivee);
        mouvements.push(mouvement);
    }

    return mouvements;
};

PathFinder.prototype.getMouvementsRafles = function(damier, numCaseDepart) {
    var tree = this.getArbreRafles(damier, numCaseDepart); // NTree<RafleItem>
    return this.treeToMouvements(damier, tree);
};

PathFinder.prototype.treeToMouvements = function(damier, tree) {
    var listes = tree.traverse(); // [[RafleItem]]

    var mouvements = []; // [Mouvement]

    for (var k = 0; k < listes.length; k++) {
        var liste = listes[k]);

        // le 1er element n'est pas une prise mais le point de départ.
        // Toujours présents même s'il n'existe aucune prise.
        if (liste.length() > 1) {
            var riDeb = liste[0];
            var riFin = liste[liste.length - 1];

            var nDepart = riDeb.getNumeroCaseFinale();
            var nArrivee = riFin.getNumeroCaseFinale();
            var mouvement = new Mouvement().init(nDepart, nArrivee);

            for (var j = 0; j < liste.length; j++) {
                var ri = liste[j];
                mouvement.addNumCasePose(ri.getNumeroCaseFinale());
                if (ri.getNumeroCasePrise() != null) {
                    mouvement.addNumCasePrise(ri.getNumeroCasePrise(), damier.getPiece(ri.getNumeroCasePrise()));
                }
            }
            mouvements.push(mouvement);
        }
    }
    return mouvements;
};

PathFinder.prototype.getArbreRafles = function(damier, numCaseDepart) {
    var ri = new RafleItem().init2(numCaseDepart);

    var ntreeRoot = new NTree().init1();
    ntreeRoot.setElement(ri);

    this.construireRafles(damier.cloneDamier(), ntreeRoot, []);

    return ntreeRoot;
};

PathFinder.prototype.construireRafles = function(damier, node, numCasesDejaPrises) {
    // damier.debugDamier();

    var ri = node.getElement();
    var numCaseNouveauDepart = ri.getNumero();
    // console.log("");
    // console.log("construireRafles(" + numCaseNouveauDepart + ", [" + numCasesDejaPrises + "])");

    // Récupération des 2 diagonales
    var diagoGD = damier.getDiagonaleGD(numCaseNouveauDepart);
    var diagoTT = damier.getDiagonaleTT(numCaseNouveauDepart);

    // debug
    // console.log(diagoGD);
    // console.log(diagoTT);
    // ---

    // Liste des prises unitaires (observées sur chacune des 2 diagonales)
    var liste = diagoGD.getRaflesItem(numCaseNouveauDepart, numCasesDejaPrises);
    liste = liste.concat(diagoTT.getRaflesItem(numCaseNouveauDepart, numCasesDejaPrises));

    // debug
    // String sri = "";
    // for (var k = 0; k < liste.length; k++) {
    //     var riTmp = liste[k];
    //     sri += riTmp.toString() + "-";
    // }
    // console.log("Arrivées possibles : " + sri);
    // ---

    // Ajout de ces rafles simples dans l'arbre.
    node.setFils(liste);

    // Recommencer recursivement sur les rafles filles.
    var noeudsFils = node.getNoeudsFils();
    for (var k = 0; k < noeudsFils.length; k++) {
        var nf = noeudsFils[k];
        var r = nf.getElement();

        // On met à jour la liste des cases déjà prises.
        var lcdp = [];
        lcdp = lcdp.concat(numCasesDejaPrises);
        lcdp.push(r.getNumeroCasePrise());
        // ---

        // On deplace le pion avant de poursuivre
        // (sans retirer la pièce prise).
        var diag = damier.cloneDamier();
        var numDeb = ri.getNumero();
        var numFin = r.getNumeroCaseFinale();
        var caseDeb = diag.getCase(numDeb);
        var piece = caseDeb.getPiece();
        diag.getCase(numDeb).setPiece(Piece.VIDE);
        diag.getCase(numFin).setPiece(piece);

        // ---
        this.construireRafles(diag, nf, lcdp);
    }
};

PathFinder.prototype.displayTreePaths = function(tree) {
    var listes = tree.traverse(); // [[RafleItem]]

    console.log("Nombre de mouvements : " + listes.length);
    for (var k = 0; k < listes.length; k++) {
        var liste = listes[k];
        var s = "";
        for (var j = 0; j < liste.length; j++) {
            var ri = liste[j];
            s += " > " + ri.getNumeroCaseFinale() + "[" + ri.getNumeroCasePrise() + "]";
        }
        console.log(s);
    }
};



// ----------------------------------------------------------------------------------------------------
// Class Arbitre
// ----------------------------------------------------------------------------------------------------

// http://javascript.info/tutorial/static-variables-and-methods
// http://stackoverflow.com/questions/1535631/static-variables-in-javascript
// http://stackoverflow.com/questions/7307243/how-to-declare-a-static-variable-in-javascript

function Arbitre() {
    this.pf = new PathFinder().init(); // how to make this static ?
}

/** Crée le mouvement demandé. */
Arbitre.prototype.getMouvement = function(damier, depart, arrivee, numCasesInter) {

    // Toutes les combinaisons de rafles
    var listeMouvementsRafle = pf.getMouvementsRafles(damier, depart);
    var existeRafle = listeMouvementsRafle.length > 0;

    // debug
    // for (Mouvement m : listeMouvementsRafle) {
    // System.out.println(m.toString());
    // }
    // ---

    var listeMouvements = [];

    // Ne conserver que la/les rafles majoritaires
    if (existeRafle) {
        // System.out.println("CAS : RAFLE");
        listeMouvements = this.filtreMajoritaire(listeMouvementsRafle);
    }
    // Aucune prise possible => on regarde les déplacements simples
    else {
        // System.out.println("CAS : DEPLACEMENT SIMPLE");
        listeMouvements = pf.getMouvementsSimples(damier, depart);
    }

    // Ne conserver que le/les mouvements qui arrivent sur la case indiquée.
    var listeOK = this.filtreArrivee(listeMouvements, arrivee);

    // Ne conserver que le/les mouvements qui passent par les cases
    // indiquées.
    if (numCasesInter != null && numCasesInter.length > 0) {
        listeOK = this.filtreInter(listeOK, numCasesInter);
    }

    // Si plusieurs mouvements sont valides, on prendra le premier.
    var mouvement = null;
    if (listeOK.length > 0) {
        mouvement = listeOK[0];

        // Enregistrer les mouvements intermédiaires précisées
        if (numCasesInter != null) {
            mouvement.setNumCasesInter(numCasesInter);
        }

        if (listeOK.length > 1) {
            console.log("Il existe des variantes pour le coup " + depart + "/" + arrivee);
        }
    }

    // Le mouvement demandé est irrégulier.
    if (mouvement == null) {
        mouvement = new Mouvement().init(depart, arrivee);
        mouvement.setStatut(false);
        mouvement.setMessage("Mouvement irrégulier..."); // A préciser
    }

    // Préciser s'il s'agit d'une rafle (pour la notation)
    mouvement.setPrise(existeRafle);

    // Préciser si la piece a été promu en dame.
    var piece = damier.getPiece(depart);
    var isPromu = (piece == Piece.PBLANC && arrivee >= 1 && arrivee <= 5);
    isPromu = isPromu || (piece == Piece.PNOIR && arrivee >= 45 && arrivee <= 50);
    mouvement.setPromuDame(isPromu);

    return mouvement;
};

/**
 * Ne conserver que le/les mouvements les plus longs. <br />
 * Note : une prise est toujours plus longue qu'un déplacement simple.
 */
Arbitre.prototype.filtreMajoritaire = function(mouvements) {
    var liste = [];

    var lMax = this.mouvementMax(mouvements);
    for (var k = 0; k < mouvements.length; k++) {
        var m = mouvements[k];
        if (m.size() == lMax) {
            liste.push(m);
        }
    }

    // Eviter les faux positifs de variantes
    liste = this.filtreDoublons(liste);

    return liste;
};

/**
 * Retire les mouvements identiques (mêmes cases prises et même arrivée) <br/>
 * => Eviter les faux positifs de variantes...<br />
 * Exemple d'une dame avec plusieurs pts de repos possibles entre 2 prises.
 */
Arbitre.prototype.filtreDoublons = function(mouvements) {
    var liste = []; // [Mouvement]

    if (mouvements.length > 1) {
        for (var k = 0; k < mouvements.length; k++) {
            var m = mouvements[k];
            var isDoublon = false;
            for (var j = 0; j < liste.length; j++) {
                var cf = liste[j];
                if (m == cf) {
                    isDoublon = true;
                }
            }
            if (!isDoublon) {
                liste.push(m);
            }
        }
    } else {
        liste = mouvements;
    }

    return liste;
};

/** Longueur du plus long mouvement. */
Arbitre.prototype.mouvementMax = function(mouvements) {
    var lMax = -1;

    for (var k = 0; k < mouvements.length; k++) {
        var m = mouvements[k];
        if (m.size() > lMax) {
            lMax = m.size();
        }
    }
    return lMax;
};

/** Ne conserve que les mouvements qui arrivent sur la case indiquée. */
Arbitre.prototype.filtreArrivee = function(mouvements, numArrivee) {
    var liste = []; // [Mouvement]

    for (var k = 0; k < mouvements.length; k++) {
        var m = mouvements[k];
        if (m.getNumCaseArrivee() == numArrivee) {
            liste.push(m);
        }
    }
    return liste;
};

/**
 * Ne conserve que les mouvements qui passent par les cases intermédiaires
 * indiquées.
 * 
 * @param inters
 *            : REQUIS, non null
 */
Arbitre.prototype.filtreInter = function(mouvements, numCasesInter) {
    var liste = []; // [Mouvement]

    if (mouvements != null) {
        // Pour chaque mouvement
        for (var k = 0; k < mouvements.length; k++) {
            var m = mouvements[k];

            var casesPose = m.getCasesPose();
            var tousTrouve = true;
            var nbPose = casesPose.length;

            var lastIdxPose = -1;

            // Pour chaque inter spécifié
            for (var j = 0; j < numCasesInter.length; j++) {
                var inter = numCasesInter[j];

                // On regarde s'il fait partie des cases sur laquelle la pièce s'est posée
                var trouve = false;
                for (var idxPose = 0; idxPose < nbPose; idxPose++) {
                    // La case posée existe
                    if (inter == casesPose[idxPose]) {
                        // ET on ne l'a pas déjà prise en compte
                        if (idxPose > lastIdxPose) {
                            trouve = true;
                            lastIdxPose = idxPose;
                        }
                    }
                }

                if (!trouve) {
                    tousTrouve = false;
                    break; // mouvement suivant
                }
            }

            if (tousTrouve) {
                liste.push(m);
            }

        }
    }
    return liste;
};







// ----------------------------------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------------------------------

console.log("--------------------------------------");
console.log("Case");
console.log("--------------------------------------");
var c1 = new Case().init1(1);
var c2 = new Case().init2(2, Piece.PNOIR);
c1.debug();
c2.debug();
console.log(c1.isDame());
console.log(c2.isNoir());
console.log(c2.isPion());
console.log(c2.getCouleur());
console.log(c2.getNumero());
c1.setPiece(Piece.DBLANC);
console.log(c1.isDame());

console.log("--------------------------------------");
console.log("RafleItem");
console.log("--------------------------------------");
var ri1 = new RafleItem().init1(7, 8);
var ri2 = new RafleItem().init2(6);
console.log("" + ri1);
console.log("" + ri2);

console.log("--------------------------------------");
console.log("Mouvement");
console.log("--------------------------------------");
var m1 = new Mouvement().init(12, 23);
var m2 = new Mouvement().init(22, 28);
m2.setPrise(true);
console.log("" + m1);
console.log("" + m2);

console.log("--------------------------------------");
console.log("Damier");
console.log("--------------------------------------");
var d = new Damier().init();
d.setPosition(Piece.PBLANC, [33, 38, 39, 43, 44]);
d.setPosition(Piece.PNOIR, [12, 13, 14, 22, 24]);
d.debugDamier();


console.log("--------------------------------------");
console.log("Arbre");
console.log("--------------------------------------");
var racine = new NTree().init2("Racine");

var t1 = new NTree().init2("A");
var t2 = new NTree().init2("B");
var t3 = new NTree().init2("C");
var t4 = new NTree().init2("D");

var fils = [t1, t2, t3, t4];

racine.setFils(fils);

console.log("racine.isFeuille = " + racine.isFeuille());
console.log("t1.isFeuille = " + t1.isFeuille());
console.log("t2.isFeuille = " + t2.isFeuille());
console.log("t3.isFeuille = " + t3.isFeuille());
console.log("t4.isFeuille = " + t4.isFeuille());

var liste = racine.getFils();
console.log(liste);
for (var i = 0; i < liste.length; i++) {
    var val = liste[i].getElement();
    console.log("fils n°" + i + " = " + val);
}




