var
    symbols = require('./symbols'),
    RafleItem = require('./RafleItem'),
    Move = require('./Move'),
    NTree = require('./NTree'),
    Piece = symbols.Piece
;


function PathFinder() {
}

PathFinder.prototype.getSimpleMovements = function(board, startingSquareNum) {
    var moves = []; // [Move]

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonalGD(startingSquareNum);
    var diagoTT = board.getDiagonalTT(startingSquareNum);

    // Déplacements simples (observés sur chacune des 2 diagonales)
    var list = diagoGD.getSimpleMovements(startingSquareNum);
    list = list.concat(diagoTT.getSimpleMovements(startingSquareNum));

    for (var k = 0; k < list.length; k++) {
        var endingSquareNum = list[k];
        var move = new Move(startingSquareNum, endingSquareNum);
        moves.push(move);
    }

    return moves;
};

PathFinder.prototype.getRafleMovements = function(board, startingSquareNum) {
    var tree = this.getTreeRafles(board, startingSquareNum); // NTree<RafleItem>
    return this._treeToMovements(board, tree);
};

PathFinder.prototype._treeToMovements = function(board, tree) {
    var lists = tree.traverse(); // [[RafleItem]]

    var moves = []; // [Move]

    for (var k = 0; k < lists.length; k++) {
        var list = lists[k];

        // le 1er element n'est pas une prise mais le point de départ.
        // Toujours présents même s'il n'existe aucune prise.
        if (list.length > 1) {
            var riStart = list[0];
            var riEnd = list[list.length - 1];

            var nStart = riStart.endingSquareNum;
            var nEnd = riEnd.endingSquareNum;
            var move = new Move(nStart, nEnd);

            for (var j = 0; j < list.length; j++) {
                var ri = list[j];
                move.addLandingSquareNum(ri.endingSquareNum);
                if (ri.capturedSquareNum != null) {
                    move.addCapturedSquareNum(ri.capturedSquareNum, board.getPiece(ri.capturedSquareNum));
                }
            }
            moves.push(move);
        }
    }
    return moves;
};

PathFinder.prototype.getTreeRafles = function(board, startingSquareNum) {
    var ri = new RafleItem(startingSquareNum);

    var ntreeRoot = new NTree();
    ntreeRoot.setItem(ri);

    this.buildRafles(board.cloneDraughtBoard(), ntreeRoot, []);

    return ntreeRoot;
};

PathFinder.prototype.buildRafles = function(board, node, numSquaresPrevCaptured) {
    // board.debugDraughtBoard();

    var ri = node.getItem();
    var numSquareNewStart = ri.getNumber();
    // console.log("");
    // console.log("buildRafles(" + numSquareNewStart + ", [" + numSquaresPrevCaptured + "])");

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonalGD(numSquareNewStart);
    var diagoTT = board.getDiagonalTT(numSquareNewStart);

    // debug
    // console.log(diagoGD);
    // console.log(diagoTT);
    // ---

    // Liste des prises unitaires (observées sur chacune des 2 diagonales)
    var list = diagoGD.getRaflesItem(numSquareNewStart, numSquaresPrevCaptured);
    list = list.concat(diagoTT.getRaflesItem(numSquareNewStart, numSquaresPrevCaptured));

    // debug
    // var sri = "";
    // for (var k = 0; k < list.length; k++) {
    //     var riTmp = list[k];
    //     sri += riTmp.toString() + "-";
    // }
    // console.log("Arrivées possibles : " + sri);
    // ---

    // Ajout de ces rafles simples dans l'arbre.
    node.setChildren(list);

    // Recommencer recursivement sur les rafles filles.
    var childrenNodes = node.getChildrenNodes();
    for (var k = 0; k < childrenNodes.length; k++) {
        var nf = childrenNodes[k];
        var r = nf.getItem();

        // On met à jour la liste des cases déjà prises.
        var lcdp = numSquaresPrevCaptured.slice(0);
        lcdp.push(r.capturedSquareNum);
        // ---

        // On deplace le pion avant de poursuivre
        // (sans retirer la pièce prise).
        var diag = board.cloneDraughtBoard();
        var numStart = ri.getNumber();
        var numEnd = r.endingSquareNum;
        var startSq = diag.getSquare(numStart);
        var piece = startSq.piece;
        diag.getSquare(numStart).piece = Piece.EMPTY;
        diag.getSquare(numEnd).piece = piece;

        // ---
        this.buildRafles(diag, nf, lcdp);
    }
};

PathFinder.prototype.displayTreePaths = function(tree) {
    var lists = tree.traverse(); // [[RafleItem]]

    console.log("Nombre de mouvements : " + lists.length);
    for (var k = 0; k < lists.length; k++) {
        var list = lists[k];
        var s = "";
        for (var j = 0; j < list.length; j++) {
            var ri = list[j];
            s += " > " + ri.endingSquareNum + "[" + ri.capturedSquareNum + "]";
        }
        console.log(s);
    }
};

module.exports = PathFinder;
