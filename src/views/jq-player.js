(function($) {

    $.player = function(element, options) {

        // Default options
        var defaults = {
            position:'',
            notation:''
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
            
            var param1 = plugin.options['param1'];
            var id = $element.attr("id");
            var position = $element.data('position');
            var notation = $element.data('notation');

            var game = DamWeb.getGame(position, notation);
            game.start(); 
            plugin.refresh(game);

            

            $("body").on("click","span",function(){
                var pos = $(this).data('pos');
                game.setCursor(pos);
                plugin.refresh(game);
            });

            $("body").on("click",".start",function(){
                game.start();
                plugin.refresh(game);
            });

            $("body").on("click",".prev",function(){
                game.prev();
                plugin.refresh(game);
            });

            $("body").on("click",".next",function(){
                game.next();
                plugin.refresh(game);
            });

            $("body").on("click",".end",function(){
                game.end();
                plugin.refresh(game);
            });
        }


        plugin.refresh = function(game){
            var notation = plugin.drawNotation(game.getNotation());
            var board = plugin.drawBoard(game.board);
            var ctrlBar = plugin.drawControlBar();


            var layout = '';
            layout += '<table>';
            layout += '<tr>';
            layout += '<td>';
            layout += board;
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
        }


        plugin.drawNotation = function(notation){


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
        }


        plugin.drawControlBar = function(){
            var ht = '';

            ht += '<div class="control-bar">';
            ht += '<button class="start">&laquo;</button>';
            ht += '<button class="prev">&lsaquo;</button>';
            ht += '<button class="next">&rsaquo;</button>';
            ht += '<button class="end">&raquo;</button>';
            ht += '</div>';

            return ht;
        }

        plugin.drawBoard = function(board){
            var ht = '';

            ht += '<div class="ascii-view">';
            ht += getASCIIBoard(board);
            ht += '</div>';
            
            return ht;
        }


        plugin.init();
    }


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
    }

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



    $.fn.player = function(options) {
        return this.each(function() {

            if (undefined == $(this).data('player')) {
                var plugin = new $.player(this, options);
                $(this).data('player', plugin);
            }
        });
    }

})(jQuery);

