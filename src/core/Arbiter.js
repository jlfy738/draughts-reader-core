function Arbiter() {
}

Arbiter.pf = new PathFinder();

/** Crée le mouvement demandé. */
Arbiter.getMove = function(board, startingSqNum, endingSqNum, middleSquaresNum) {

    // Toutes les combinaisons de rafles
    var listRafleMovements = Arbiter.pf.getRafleMovements(board, startingSqNum);
    var existsRafle = listRafleMovements.length > 0;

    var listMovements = [];

    // Ne conserver que la/les rafles majoritaires
    if (existsRafle) {
        // console.log("CAS : RAFLE");
        listMovements = this._filterMajority(listRafleMovements);
    }
    // Aucune prise possible => on regarde les déplacements simples
    else {
        // console.log("CAS : DEPLACEMENT SIMPLE");
        listMovements = Arbiter.pf.getSimpleMovements(board, startingSqNum);
    }

    // Ne conserver que le/les mouvements qui arrivent sur la case indiquée.
    var listOK = this._filterEnding(listMovements, endingSqNum);

    // Ne conserver que le/les mouvements qui passent par les cases
    // indiquées.
    if (middleSquaresNum != null && middleSquaresNum.length > 0) {
        listOK = this._filterInter(listOK, middleSquaresNum);
    }

    // Si plusieurs mouvements sont valides, on prendra le premier.
    var move = null;
    if (listOK.length > 0) {
        move = listOK[0];

        // Enregistrer les mouvements intermédiaires précisées
        if (middleSquaresNum != null) {
            move.middleSquaresNum = middleSquaresNum;
        }

        if (listOK.length > 1) {
            console.log("Il existe des variantes pour le coup " + startingSqNum + "/" + endingSqNum);
        }
    }

    // Le mouvement demandé est irrégulier.
    if (move == null) {
        move = new Move(startingSqNum, endingSqNum);
        move.status = false;
        move.message = "Mouvement irrégulier..."; // A préciser
    }

    // Préciser s'il s'agit d'une rafle (pour la notation)
    move.isCaptured = existsRafle;

    // Préciser si la piece a été promu en dame.
    var piece = board.getPiece(startingSqNum);
    var isCrowned = (piece == Piece.PAWN_WHITE && endingSqNum >= 1 && endingSqNum <= 5);
    isCrowned = isCrowned || (piece == Piece.PAWN_BLACK && endingSqNum >= 45 && endingSqNum <= 50);
    move.isCrowned = isCrowned;

    return move;
};

/**
 * Ne conserver que le/les mouvements les plus longs. <br />
 * Note : une prise est toujours plus longue qu'un déplacement simple.
 */
Arbiter._filterMajority = function(moves) {
    var list = [];

    var lMax = this._moveMax(moves);
    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.size() == lMax) {
            list.push(m);
        }
    }

    // Eviter les faux positifs de variantes
    list = this._filterDuplicates(list);

    return list;
};

/**
 * Retire les mouvements identiques (mêmes cases prises et même arrivée) <br/>
 * => Eviter les faux positifs de variantes...<br />
 * Exemple d'une dame avec plusieurs pts de repos possibles entre 2 prises.
 */
Arbiter._filterDuplicates = function(moves) {
    var list = []; // [Move]

    if (moves.length > 1) {
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];
            var isDuplicate = false;
            for (var j = 0; j < list.length; j++) {
                var cf = list[j];
                if (m == cf) {
                    isDuplicate = true;
                }
            }
            if (!isDuplicate) {
                list.push(m);
            }
        }
    } else {
        list = moves;
    }

    return list;
};

/** Longueur du plus long mouvement. */
Arbiter._moveMax = function(moves) {
    var lMax = -1;

    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.size() > lMax) {
            lMax = m.size();
        }
    }
    return lMax;
};

/** Ne conserve que les mouvements qui arrivent sur la case indiquée. */
Arbiter._filterEnding = function(moves, endNum) {
    var list = []; // [Move]

    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.endingSquareNum == endNum) {
            list.push(m);
        }
    }
    return list;
};

/**
 * Ne conserve que les mouvements qui passent par les cases intermédiaires
 * indiquées.
 * 
 * @param inters
 *            : REQUIS, non null
 */
Arbiter._filterInter = function(moves, middleSquaresNum) {
    var list = []; // [Move]

    if (moves != null) {
        // Pour chaque mouvement
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];

            var landingSquaresNum = m.landingSquaresNum;
            var allFound = true;
            var nbLanding = landingSquaresNum.length;

            var lastIdxPose = -1;

            // Pour chaque inter spécifié
            for (var j = 0; j < middleSquaresNum.length; j++) {
                var inter = middleSquaresNum[j];

                // On regarde s'il fait partie des cases sur laquelle la pièce s'est posée
                var found = false;
                for (var idxPose = 0; idxPose < nbLanding; idxPose++) {
                    // La case posée existe
                    if (inter == landingSquaresNum[idxPose]) {
                        // ET on ne l'a pas déjà prise en compte
                        if (idxPose > lastIdxPose) {
                            found = true;
                            lastIdxPose = idxPose;
                        }
                    }
                }

                if (!found) {
                    allFound = false;
                    break; // mouvement suivant
                }
            }

            if (allFound) {
                list.push(m);
            }

        }
    }
    return list;
};
