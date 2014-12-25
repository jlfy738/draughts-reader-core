(function($) {

    function generateUUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    function getUniqueId(element){
        var id = $(element).attr('id');
        if (typeof id === typeof undefined || id === false) {
            id = generateUUID();
            $(element).attr("id", id);
        }
        return id;
    };

    $.player = function(element, options) {

        // Default options
        var defaults = {
            type:'canvas',
            cvSquareSize:40,
            cvSquareDarkColor:'#B4814E',
            cvSquareLightColor:'#FFFFFF'
        };

        // avoid $(this) confusion
        // plugin instance
        var plugin = this;

        plugin.options = {}

        // Jquery item reference
        var $element = $(element);
        // HTML item reference
        var element = element;

        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            
            var id = getUniqueId(element);
            var position = $element.data('position');
            var notation = $element.data('notation');
            var game = DamWeb.getGame(position, notation);
            game.start(); 
            refresh(game);

            $("#" + id).on("click", ".notation span",function(){
                var pos = $(this).data('pos');
                game.setCursor(pos);
                refresh(game);
            });

            $("#" + id).on("click", ".control-bar .start",function(){
                game.start();
                refresh(game);
            });

            $("#" + id).on("click", ".control-bar .prev",function(){
                game.prev();
                refresh(game);
            });

            $("#" + id).on("click", ".control-bar .next",function(){
                game.next();
                refresh(game);
            });

            $("#" + id).on("click", ".control-bar .end",function(){
                game.end();
                refresh(game);
            });
        };

        var refresh = function(game){
            var notation = drawNotation(game.getNotation());
            var ctrlBar = drawControlBar();

            var layout = '';
            layout += '<table>';
            layout += '<tr>';
            layout += '<td>';
            if (plugin.options['type'] == "canvas"){
                layout += getCanvas();
            } else if (plugin.options['type'] == "ascii"){
                layout += drawBoard(game.board);
            }
            layout += '</td>';
            layout += '<td>';
            layout += notation;
            layout += '</td>';
            layout += '</tr>';
            layout += '<tr>';
            layout += '<td>';
            layout += ctrlBar;
            layout += '</td>';
            layout += '<td></td>';
            layout += '</tr>';
            layout += '</table>';


            $(element).html(layout);

            if (plugin.options['type'] == "canvas"){
                var fgColor = plugin.options['cvSquareDarkColor'];
                var bgColor = plugin.options['cvSquareLightColor'];
                drawCanvasContent("canvas", game.board, fgColor, bgColor);
            }
        };

        var drawNotation = function(notation){


            var ht = '<div class="notation">';
            for (var k = 0; k < notation.length; k++){
                var line = notation[k];
                

                var bn = '';
                if (line.number < 10) {
                    bn += '&nbsp;';
                }
                bn += line.number;
                                

                var currentWhite = false;
                var posWhite = '';
                var bw = '';
                if (line.white !== undefined){
                    currentWhite = line.white.current;
                    posWhite = line.white.position;
                    var nsWhite = getNotationStyle(line.white.move);
                    if (nsWhite.before) {
                        bw += '&nbsp;';
                    }
                    bw += nsWhite.notation;
                    if (nsWhite.after) {
                        bw += '&nbsp;';
                    }
                }
                    
                var currentBlack = false;
                var posBlack = '';
                var bm = '';
                if (line.black !== undefined){
                    currentBlack = line.black.current;
                    posBlack = line.black.position;
                    var nsBlack = getNotationStyle(line.black.move);
                    if (nsBlack.before) {
                        bm += '&nbsp;';
                    }
                    bm += nsBlack.notation;
                    if (nsBlack.after) {
                        bm += '&nbsp;';
                    }
                }


                var s = '';
                s += bn + '. ';


                s += '<span';
                if (!isNaN(posWhite)){
                    s += ' data-pos="' + posWhite + '"';
                }
                if (currentWhite){
                    s += ' class="active"';
                }
                s += '>';
                s += bw + '</span>';
                s += " &nbsp;";


                s += '<span';
                if (!isNaN(posBlack)){
                    s += ' data-pos="' + posBlack + '"';
                }
                if (currentBlack){
                    s += ' class="active"';
                }
                s += '>';
                s += bm + '</span>';


                ht += s + "<br />";
            }
            ht += '</div>';

            return ht;
        };

        var drawControlBar = function(){
            var ht = '';

            ht += '<div class="control-bar">';
            ht += '<button class="start">&laquo;</button>';
            ht += '<button class="prev">&lsaquo;</button>';
            ht += '<button class="next">&rsaquo;</button>';
            ht += '<button class="end">&raquo;</button>';
            ht += '</div>';

            return ht;
        };

        var drawBoard = function(board){
            var ht = '';

            ht += '<div class="ascii-view">';
            ht += getASCIIBoard(board);
            ht += '</div>';
            
            return ht;
        };

        var getCanvas = function(board){
            var ht = '';
            ht += '<canvas id="canvas">';
            ht += '</canvas>';
            return ht;
        };

        var getNotationStyle = function(notation){
            var idxSep = notation.indexOf("-");
            if (idxSep == -1) {
                idxSep = notation.indexOf("x");
                notation = notation.replace("x", "&times;");
            } else {
                notation = notation.replace("-", "&minus;");
            }
            var s = notation.substring(idxSep + 1);

            var before = (idxSep == 1);
            var after = (s.length == 1);

            var map = { 'notation':notation, 'before':before, 'after':after };
            return map;
        };

        var getASCIIBoard = function(board) {
            var s = "";
            
            var cr = "<br />";
            var sp = "&nbsp;";
            var row = "";

            s += "================================" + cr;
            for (var k = 0; k < 10; k++) {
                row += "|";
                for (var l = 1; l <= 5; l++) {

                    var num = 5 * k + l;
                    var p = board.getSquare(num).piece;

                    if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                        row += sp + sp + sp;
                    }

                    switch (p) {
                    case Piece.PAWN_WHITE:
                        row += sp + "o" + sp;
                        break;
                    case Piece.PAWN_BLACK:
                        row += sp + "x" + sp;
                        break;
                    case Piece.DAME_WHITE:
                        row += sp + "O" + sp;
                        break;
                    case Piece.DAME_BLACK:
                        row += sp + "X" + sp;
                        break;
                    default:
                        row += sp + "." + sp;
                    }

                    if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                        row += sp + sp + sp;
                    }
                }
                row += "|";

                s += row + cr;
                row = "";
            }
            s += "================================";

            return s;
        };

        var drawPiece = function(ctx, piece, x, y, r){
            var sqWidth = plugin.options['cvSquareSize'];
            var shift = ((~~(sqWidth / 10)) + 1) / 2;

            switch (piece) {
            case Piece.PAWN_WHITE:
                ctx.beginPath();
                ctx.arc(x, y, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.PAWN_BLACK:
                ctx.beginPath();
                ctx.arc(x, y, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.DAME_WHITE:
                ctx.beginPath();
                ctx.arc(x, y + shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(x, y - shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.DAME_BLACK:
                ctx.beginPath();
                ctx.arc(x, y + shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(x, y - shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();
                break;
            default:
            }
        };

        var drawSquare = function(ctx, num, piece){
            var nRow = ~~((num - 1) / 5) + 1; // [1..10]
            var nCol = ((num - 1) % 5) + 1; // [1..5]

            var sqWidth = plugin.options['cvSquareSize'];

            if (nRow == 1 || nRow == 3 || nRow == 5 || nRow == 7 || nRow == 9) {
                
                var x = 2 * sqWidth * (nCol - 1) + sqWidth;
                var y = sqWidth * (nRow - 1);

                ctx.fillStyle = plugin.options['cvSquareDarkColor'];
                ctx.fillRect(x, y, sqWidth, sqWidth);

                var x = x + (sqWidth / 2);
                var y = y + (sqWidth / 2);
                var r = sqWidth / 2 - (sqWidth / 10 * 2);

                drawPiece(ctx, piece, x, y, r);
            }

            if (nRow == 2 || nRow == 4 || nRow == 6 || nRow == 8 || nRow == 10) {
                var x = 2 * sqWidth * (nCol - 1);
                var y = sqWidth * (nRow - 1);

                ctx.fillStyle = plugin.options['cvSquareDarkColor'];
                ctx.fillRect(x, y, sqWidth, sqWidth);

                var x = x + (sqWidth / 2);
                var y = y + (sqWidth / 2);
                var r = sqWidth / 2 - (sqWidth / 10 * 2);

                drawPiece(ctx, piece, x, y, r);
            }
        };

        var drawCanvasContent = function(idCanvas, board){
            var c = document.getElementById(idCanvas);
            var ctx = c.getContext("2d");

            var sqWidth = plugin.options['cvSquareSize'];
            c.width = 10*sqWidth;
            c.height = 10*sqWidth;

            c.style.border = "1px dotted #000";
            
            // background-color
            ctx.fillStyle = plugin.options['cvSquareLightColor'];
            ctx.fillRect(0, 0, 10*sqWidth, 10*sqWidth);

            for (var num = 1; num <= 50; num++){
                var p = board.getSquare(num).piece;
                drawSquare(ctx, num, p);
            }
        };



        plugin.init();
    };


    



    $.fn.player = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('player')) {
                var plugin = new $.player(this, options);
                $(this).data('player', plugin);
            }
        });
    };

})(jQuery);

