function NTree(item) {
    this.item = item ? item : null; // E
    this.left = null;  // NTree<E>
    this.right = null; // NTree<E>
}

NTree.prototype.getItem = function() {
    return this.item;
};

NTree.prototype.setItem = function(item) {
    this.item = item;
};

NTree.prototype.hasLeft = function() {
    return (this.left != null);
};

NTree.prototype.hasRight = function() {
    return (this.right != null);
};

NTree.prototype.isLeaf = function() {
    return !(this.hasRight());
};

// Ajoute une liste de fils dans un noeud binaire
// (fils à droite, frère à gauche)
NTree.prototype.setChildren = function(list) {
    var nb = list.length;
    if (nb > 0) {
        var val = list[0];

        // 1er element en fils droit
        var currentTree = new NTree(val);
        this.right = currentTree;

        // les autres : en frère à gauche
        if (nb > 1) {
            for (var k = 1; k < nb; k++) {
                var ntLeft = new NTree();
                ntLeft.setItem(list[k]);
                currentTree.left = ntLeft;
                currentTree = ntLeft;
            }
        }
    }
};

// Retourne tous les fils
NTree.prototype.getChildren = function() {
    var list = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var ntRight = this.right;
        list.push(ntRight.getItem());

        // Et des fils gauche successifs
        var currentTree = ntRight;
        while (currentTree.hasLeft()) {
            list.push(currentTree.left.getItem());
            currentTree = currentTree.left;
        }
    }
    return list;
};

// Retourne tous les noeuds fils
NTree.prototype.getChildrenNodes = function() {
    var list = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var ntRight = this.right;
        list.push(ntRight);

        // Et des fils gauches successifs
        var currentTree = ntRight;
        while (currentTree.hasLeft()) {
            list.push(currentTree.left);
            currentTree = currentTree.left;
        }
    }
    return list;
};

NTree.prototype.traverse = function() {
    var lists = []; // [[E]]
    this._traverse(this, [], lists);
    return lists;
};

/**
* lle : resultat (liste des chemins = liste de "liste d'éléments" [[E]])
*/
NTree.prototype._traverse = function(node, path, lle) {
    path.push(node);
    if (node.isLeaf()) {
        var res = [];
        for (var k = 0; k < path.length; k++) {
            var e = path[k].getItem();
            res.push(e);
        }
        lle.push(res);
    } else {
        var fils = node.getChildrenNodes();

        for (var i = 0; i < fils.length; i++) {
            var newPath = path.slice(0);
            this._traverse(fils[i], newPath, lle);
        }
    }
};
