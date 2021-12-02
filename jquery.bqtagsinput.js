(function ($) {

    $.bqTagsInput = function (element, options) {

        var extraw = 10;
        var cid = 10;
        var tagc = 0;
        var editingdone = false;
        var $txtnewinput;
        var $tagtxt;
        var $inputoutputid;
        var $alltags = [];

        var defaults = {
            foo: 'bar',
            onFoo: function () { }
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element;

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);

            cid = $element.attr('id');

            $element.append('<input class="newinput" id="txtnewinput_' + cid + '" type="text" placeholder="" size="1">')

            if ($('#tagcontainerhidden').length <= 0)
                $(document.body).append('<div id="tagcontainerhidden" style="position: absolute;top:-204px;" class="bootstrap-tagsinput"><div class="newinput" id="tagtxt" style="width:fit-content;"></div></div>')

            $txtnewinput = $('#txtnewinput_' + cid);
            $tagtxt = $('#tagtxt');

            $element.on('click', function (event) {
                $txtnewinput.focus();
            });


            $element.on('keydown', tagcontainer_keydown);

            $txtnewinput.on('keypress', txtnewinput_keypress);
            $txtnewinput.on('keydown', txtnewinput_keydown);
            $txtnewinput.on('keyup', txtnewinput_keyup);

        }
        plugin.refresh = function () {

            $element.find(".tagdiv").each(function () {

                var temp_cid = $(this).data("cid");
                var temp_tagc = $(this).data("tagc");

                $temp_tagdivinput = $('#tagdivinput_' + temp_cid + '_' + temp_tagc);

                $temp_tagdivinput.unbind('keypress');
                $temp_tagdivinput.unbind('keydown');
                $temp_tagdivinput.unbind('keyup');
                $temp_tagdivinput.unbind('dblclick');
                $temp_tagdivinput.unbind('click');


                $temp_tagdivremove = $('#tagdivremove_' + temp_cid + '_' + temp_tagc);
                $temp_tagdivremove.unbind('click');

                $temp_tagdivleft = $('#tagdivleft_' + temp_cid + '_' + temp_tagc);

                $temp_tagdivleft.unbind('click');

                $(this).remove();
            });

            cid = $element.attr('id');
            $inputoutputid = $element.data('inputoutputid');

            var jsonpath = $("#" + $inputoutputid).val();

            var spatparts = [];

            jsonpath = jsonpath.replace(/\./g, '%')
            jsonpath = jsonpath.replace(/'/g, '%')
            jsonpath = jsonpath.replace(/\[/g, '%')
            jsonpath = jsonpath.replace(/\]/g, '%')

            spatparts = jsonpath.split("%");

            $txtnewinput = $('#txtnewinput_' + cid);
            $tagtxt = $('#tagtxt');

            for (var jpp = 0; jpp < spatparts.length; jpp++) {
                if (spatparts[jpp] == '' || spatparts[jpp] == null || spatparts[jpp] == undefined) {
                } else {
                    add_tag(spatparts[jpp]);
                }
            }
        }

        var generate_output = function () {
            if (options !== undefined) {
                if (options.onTagsChanged !== undefined) {

                    var final_tags = [];

                    $element.find('.tagdivinput').each(function (index) {
                        final_tags.push($(this).val());
                    });

                    options.onTagsChanged($element, final_tags);
                }
            }
        }

        var txtnewinput_keypress = function (event) {
            var $input = $(event.target);
            var text = $input.val();
            if (event.which == 13) {
                if (text.length !== 0) {
                    add_tag(text);
                }
                generate_output();
            }

            var $input = $(event.target);
            $tagtxt.text($input.val());
            var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
            var unit = $tagtxt.css('width').replace(/\d+/, '')
            $input.css('width', intwidth + unit);
        }

        var txtnewinput_keydown = function (event) {
            var $input = $(event.target);
            $tagtxt.text($input.val());
            var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
            var unit = $tagtxt.css('width').replace(/\d+/, '')
            $input.css('width', intwidth + unit);
        }

        var txtnewinput_keyup = function (event) {
            var $input = $(event.target);
            $tagtxt.text($input.val());
            var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
            var unit = $tagtxt.css('width').replace(/\d+/, '')
            $input.css('width', intwidth + unit);
        }

        var tagdivinput_keypress = function (event) {
            var $input = $(event.target);
            if (event.which == 13) {

                var tdi = document.querySelector('#' + $input.attr('id'))
                tdi.toggleAttribute('readonly')
                $input.focus();
                if ($input.attr('readonly') === 'readonly') {
                    editingdone = true;
                    $input.removeClass('tagdivinputeditmode');
                    $element.on('keydown', tagcontainer_keydown);
                    var $input = $(event.target);
                    $tagtxt.text($input.val());
                    var intwidth = parseInt($tagtxt.css('width').match(/\d+/));
                    var unit = $tagtxt.css('width').replace(/\d+/, '')
                    $input.css('width', intwidth + unit);
                } else {
                    editingdone = false;
                    $input.addClass('tagdivinputeditmode');
                    $element.unbind('keydown');
                }

                generate_output();
            }
            else {
                var $input = $(event.target);
                $tagtxt.text($input.val());
                var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
                var unit = $tagtxt.css('width').replace(/\d+/, '')
                $input.css('width', intwidth + unit);
            }
        }

        var tagdivinput_keydown = function (event) {
            var $input = $(event.target);
            $tagtxt.text($input.val());
            var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
            var unit = $tagtxt.css('width').replace(/\d+/, '')
            $input.css('width', intwidth + unit);
        }

        var tagdivinput_keyup = function (event) {
            if (editingdone == false) {
                var $input = $(event.target);
                $tagtxt.text($input.val());
                var intwidth = parseInt($tagtxt.css('width').match(/\d+/)) + extraw;
                var unit = $tagtxt.css('width').replace(/\d+/, '')
                $input.css('width', intwidth + unit);
            }
        }

        var tagdivinput_dblclick = function (event) {
            event.stopPropagation();
            var $input = $(event.target);

            var tdi = document.querySelector('#' + $input.attr('id'))
            tdi.toggleAttribute('readonly')
            $input.focus();
            if ($input.attr('readonly') === 'readonly') {
                generate_output();
                $input.removeClass('tagdivinputeditmode');
                $element.on('keydown', tagcontainer_keydown);
            } else {
                $input.addClass('tagdivinputeditmode');
                $element.unbind('keydown');
            }
        }

        var tagdivinput_blur = function (event) {
            var $input = $(event.target);
            generate_output();
            $input.removeClass('tagdivinputeditmode');
            $input.parent().removeClass('selected');
        }

        var tagdivinput_click = function (event) {
            event.stopPropagation();
            var $input = $(event.target);
            $input.focus();
            $input.parent().addClass("selected");

            $element.find('.tagdivinput').each(function (index) {

                if ($input.attr("id") === $element.find('.tagdivinput').eq(index).attr("id")) {
                    $input.parent().addClass("selected");
                } else {
                    $element.find('.tagdivinput').eq(index).parent().removeClass("selected");
                    $element.find('.tagdivinput').eq(index).prop('readonly', true);

                    generate_output();
                }

            });
        }

        var icon_click = function (event) {
            event.stopPropagation();
            var $elm = $(event.target);
            if ($elm.context.nodeName === 'SPAN')
                $elm.parent().parent().remove();
            else
                $elm.parent().remove();

            generate_output();

            $txtnewinput.focus();
        }

        var tagdivleft_click = function (event) {
            event.stopPropagation();
            var $input = $(event.target);
            var cc = $input.data('tagc');

            $txtnewinput.unbind('keypress');
            $txtnewinput.unbind('keydown');
            $txtnewinput.unbind('keyup');

            $txtnewinput.remove();

            $('#tagdiv_' + cid + '_' + cc).before('<input class="newinput" id="txtnewinput_' + cid + '" style="width: 20px;" type="text" placeholder="" size="1">');

            $txtnewinput = $('#txtnewinput_' + cid);

            $txtnewinput.on('keypress', txtnewinput_keypress);
            $txtnewinput.on('keydown', txtnewinput_keydown);
            $txtnewinput.on('keyup', txtnewinput_keyup);

            $txtnewinput.focus();
        }

        plugin.add_tag = function (text) {

            add_tag(text);
        }

        var add_tag = function (text) {

            $tagtxt.text(text);
            var intwidth = parseInt($tagtxt.css('width').match(/\d+/));
            var unit = $tagtxt.css('width').replace(/\d+/, '')
            $txtnewinput.before('<div class="tagdiv" data-cid="' + cid + '" data-tagc="' + tagc + '" id="tagdiv_' + cid + '_' + tagc + '" data-tagc="' + tagc + '" ><div class="tagdivleft" id="tagdivleft_' + cid + '_' + tagc + '" data-tagc="' + tagc + '" ></div><input class="tagdivinput" style="width:' + intwidth + unit + ';" type="text" id="tagdivinput_' + cid + '_' + tagc + '" value="' + text + '" readonly><div class="icon" id="tagdivremove_' + cid + '_' + tagc + '" data-tagc="' + tagc + '" ><span></span><span></span></div></div>');
            $txtnewinput.val('');

            $tagdivinput = $('#tagdivinput_' + cid + '_' + tagc);

            $tagdivinput.on('keypress', tagdivinput_keypress);
            $tagdivinput.on('keydown', tagdivinput_keydown);
            $tagdivinput.on('keyup', tagdivinput_keyup);
            $tagdivinput.on('dblclick', tagdivinput_dblclick);
            $tagdivinput.on('click', tagdivinput_click);
            $tagdivinput.on('blur', tagdivinput_blur);


            $tagdivremove = $('#tagdivremove_' + cid + '_' + tagc);
            $tagdivremove.on('click', icon_click);

            $tagdivleft = $('#tagdivleft_' + cid + '_' + tagc);

            $tagdivleft.on('click', tagdivleft_click);

            tagc++;

            generate_output();

        }

        var tagcontainer_keydown = function (event) {
            var $divc = $(event.target);

            var text = $txtnewinput.val();

            if (text.length === 0) {

                if (event.which == 37) {

                    var cc = 0;

                    for (var allcc = 0; allcc < $element.children().length; allcc++) {
                        if ($element.children().eq(allcc).attr('class') === 'tagdiv') {
                            cc++;
                        } else {
                            break;
                        }
                    }
                    if (cc > 0) {
                        $txtnewinput.unbind('keypress');
                        $txtnewinput.unbind('keydown');
                        $txtnewinput.unbind('keyup');

                        $txtnewinput.remove();

                        $element.children().eq(cc - 1).before('<input class="newinput" id="txtnewinput_' + cid + '" style="width: 20px;" type="text" placeholder="" size="1">');

                        $txtnewinput = $('#txtnewinput_' + cid);

                        $txtnewinput.on('keypress', txtnewinput_keypress);
                        $txtnewinput.on('keydown', txtnewinput_keydown);
                        $txtnewinput.on('keyup', txtnewinput_keyup);
                        $txtnewinput.focus();
                    }
                }

                if (event.which == 39) {

                    var cc = 0;

                    for (var allcc = $element.children().length - 1; allcc >= 0; allcc--) {
                        if ($element.children().eq(allcc).attr('class') === 'tagdiv') {
                            cc = allcc;
                        } else {
                            break;
                        }
                    }
                    if (cc > 0) {
                        $txtnewinput.unbind('keypress');
                        $txtnewinput.unbind('keydown');
                        $txtnewinput.unbind('keyup');

                        $txtnewinput.remove();

                        $element.children().eq(cc - 1).after('<input class="newinput" id="txtnewinput_' + cid + '" style="width: 20px;" type="text" placeholder="" size="1">');

                        $txtnewinput = $('#txtnewinput_' + cid);

                        $txtnewinput.on('keypress', txtnewinput_keypress);
                        $txtnewinput.on('keydown', txtnewinput_keydown);
                        $txtnewinput.on('keyup', txtnewinput_keyup);
                        $txtnewinput.focus();
                    }
                }

            }

        }

        plugin.init();

    }

    $.fn.bqTagsInput = function (options) {

        return this.each(function () {
            if (undefined == $(this).data('bqTagsInput')) {
                var plugin = new $.bqTagsInput(this, options);
                $(this).data('bqTagsInput', plugin);
            }
        });

    }

})(jQuery);