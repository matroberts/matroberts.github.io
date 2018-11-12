/// <reference path="jquery-1.6.1.js"/>
/// <reference path="jquery-ui-1.8.13.custom.js"/>

var LessonText = {
    //newlines with \r - its the javescript way
    'Jolly Words group 1 (satipn)': "sit it spat pan tap pit tip pip sip sat at tin in spin pant ant\rnap tan pat an spit snip pin nip sap its span snap sin stint",
    'Jolly Words group 1&2 (ckehrmd)': "red can am mat ten kept dip ham did end stamp cat sad man pen\rhip sent hand mist stand met spend hid step men kid hat tent\rcap cramp him din hen mad rest ran and pet crept hit had test\rmap desk eat rip tramp act mend set sack damp risk camp send ram\rhint mint sand dent",
    'Jolly Words group 1,2&3 (goulfb)': "get hot fat bat rug best on clap lid bus dug if leg flat hop\rpot us soft bent log milk flag help lump grub bill held fist loft drill\rfun bad cut gap fit lamp bed elf not lip club up sun lot plan dot must got\rplug crab left stop big gift list fill crib pump crust still mug bit loss\rrot tug sell but let drop not huff flap gum puff bell bump\rfrom drum frost belt stick step lit pill lost slim grab mud tell hill",
    'Jolly Words (jzw)': "jam job jog jet jug just jump jazz junk zip zap zebra zigzag buzz fizz\rwin wind wigwam web wag will swim well wept went west wet wig swell swam",
    'Jolly Words (vyx)': "van vicar visit vet vex velvet vest vivid vent yes yak yam yap yet yell\ryelp yank yard six fix mix fox box exit next wax exam",
    'Jolly Words Initial consonant blends': "glad drag flat flag trim plum snip swam crop drum club\rprint trap clap swum trig drop plan from crab slap slug twin trip\rfrog snug plot swim grab bran",
    'Jolly Words Final consonant blends': "must golf lift nest crisp ant lost grand bent pond plump\rmelt wind mint frost lamp tent slept soft gift bend help mend film\rnext best belt went damp held",
    'Jolly Words ng words': "ring king ping sing sung pong bang rang lung song clang strong wing\rswing cling hang ding sang long dong hung sting stung string spring sling\rbelong bring singing fling",
    'Jolly Words nk words': "bank ink rink wink sank plonk sink link drunk pink blank frank honk\rclunk sunk bunk spank drank blink junk tank drink think ankle plank shrunk\rshrink trunk sprinkler drinks",
    'Jolly Words ch words': "chin finch chest chip chill check rich such champ chop chick hunch\rchat munch chess much chicken crunch punch pinch children bench chimp chunk\rbunch trench chug lunch chuff drench",
    'Jolly Words sh words': "fish shock cash shop shin dash dish shut shell wish rash lash ship\rflush shot hush crash flash shed mash bash brush shift splash smash flesh blush\rshelf shunt shack",
    'Jolly Words th words voiced and unvoiced' : "this then slither that them gather with father\rbother thin three cloth moth thick thimble tenth thank think throb pith thorn\rbroth thunder thrill thing thicker thrust",
    'Jolly Words qu & wh': "quin quick queen quilt liquid quite quit quack quiet quiz quest quill\rwhen wheel whisper whip wheat whether which while whisker wham white whimper\rwhoosh why whisk",
    'Jolly Words ai': "rain paid hail sail gain jail pain fail wait tail laid sprain rail vain waist\rnail brain drain train chain grain snail Spain mail paint painter afraid\raim plain strain",
    'Jolly Words ay': "day ray saying hay clay playful lay tray playtime pay away daytime may staying\ryesterday say player today way crayon Sunday play spray Thursday stay\rsway Friday pray stray Saturday",
    'Jolly Words a-e': "ate cake bake game hate date lane safe lake gate rake pale save tale late gave\rplate make made snake same name wave cave grape came brave flame plane shave",
    'Jolly Words ee': "bee heel speed see beef feed seed jeep steep need sheep keen feet indeed bleed\rdeep peep feel queen creep greed sleep street greedy green cheek week\rfree meet cheese",
    'Jolly Words ea': "eat leaf peach meat east seat read beak teach tea heat steam sea peas leak beach\rstream team each mean leap beat clean cheap heap cream weak peanut\rreach steal",
    'Jolly Words ie & igh': "tie pie lie die high sigh midnight night sight lightning light tight might\rright fright thigh bright flight slight",
    'Numbers': "0 1 2 3 4 5 6 7 8 9\r7 4 2 4 9 1 2 6 9 3 2\r5 4 1 9 3 5 2 7 0 8\r2 9 4 5 2 7 5 9 2 8 9",
    'More Numbers': "842927612\r350681820",
    'Sql Keywords': "except all exec alter and exists any as asc procedure begin foreign between\rbrowse from references by function return check group having rollback identity\rrowcount column if commit in index select constraint inner contains insert set\rintersect into is create join key table left like to top tran nocheck transaction\rnot truncate declare null default union delete of unique update\rdesc distinct values drop view when else or where end order outer with",
    'C# Keywords': "abstract event new struct as explicit null switch base extern object this bool\rfalse operator throw break finally out true byte fixed override try case float\rparams typeof catch for private uint char foreach protected ulong checked goto\rpublic unchecked class if readonly unsafe const implicit ref ushort continue in\rreturn using decimal int sbyte virtual default interface sealed\rvolatile delegate internal short void do is sizeof while double lock\rstackalloc else long static enum namespace string",

    'Test1': "j",
    'Test2': "a\rb"
};

var Lesson = function () {

    var pointer;
    var errors;
    var errorList;
    var startTime;
    var endTime;
    var lessonText;
    var checkKey;

    var calculateTime = function () {
        var date = new Date();
        return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    };

    var round1Dp = function (num) {
        return Math.round(num * 10) / 10;
    };

    var calculateScore = function (errors) {
        var seconds = endTime - startTime;

        if (seconds < 0) seconds = seconds + 86400;
        if (seconds == 0) seconds = 1;
        var wpm = round1Dp(lessonText.length * 60 / (seconds * 5));
        var ewpm = round1Dp(wpm - errors * 60 / seconds);
        var perrors = round1Dp(errors * 100 / lessonText.length);
        $('#ewpm').text(ewpm);
        $('#wpm').text(wpm);
        $('#perrors').text(perrors);
        $('#hiddentooltip').attr('title', 'char=' + lessonText.length + ' errors=' + errors + ' seconds=' + seconds);
        $('#results').dialog('open');
    };

    var highLight = function (pos, cssClass, trueText, highlightText) {
        return trueText.substring(0, pos) + '<span class="' + cssClass + '">' + trueText.substring(pos, pos + 1) + '</span>' + highlightText.substring(pos + 1);
    };

    var colorTeacherText = function (cursorPosition, errorList) {
        var coloredText = lessonText;

        if (errorList[errorList.length - 1] == cursorPosition) {
            coloredText = highLight(cursorPosition, "currentlettererror", lessonText, coloredText);
        } else {
            coloredText = highLight(cursorPosition, "currentletter", lessonText, coloredText);
        }

        for (var i = errorList.length - 1; i >= 0; i--) {
            if (errorList[i] == cursorPosition) {
                continue;
            }
            coloredText = highLight(errorList[i], "errorletter", lessonText, coloredText);
        }
        coloredText = coloredText.replace(/\r/g, "<br />");
        $('#teacher_text').html(coloredText);
    };

    var checkKeyAccuracy = function(event) {
        if (String.fromCharCode(event.which) != lessonText.substr(pointer, 1)) {
            errors = errors + 1;
            if (errorList[errorList.length - 1] != pointer) {
                errorList[errorList.length] = pointer;
            }
        } else {
            pointer = pointer + 1;
            $('#student_text').append(String.fromCharCode(event.which));
        }
    };

    return {
        newLesson: function (text) {
            checkKey = checkKeyAccuracy;
            lessonText = text;
            pointer = 0;
            errors = 0;
            errorList = [];
            colorTeacherText(pointer, errorList);
            $('#student_text').html('').focus();
        },
        init: function () {
            for (var prop in LessonText) {
                $('#lesson_dropdown').append('<option>' + prop + '</option>');
            }

            $('#results').dialog({
                autoOpen: false,
                modal: true,
                resizable: false
            });
        },
        key_down: function (event) {
            // prevent non allowed keystrokes from working
            // 8 backspace
            // 20 caps lock
            // 33-40 pageup, pagedowm, end, home, leftarrow, up arrow, rightarrow, downarrow
            // 45 insert
            // 46 delete
            if (event.which == 8 || event.which == 9 || event.which == 20 || (event.which >= 33 && event.which <= 40) || event.which == 45 || event.which == 46) {
                event.preventDefault();
                return false;
            }
        },
        key_press: function (event) {
            // allow non character keys to propagate
            if (event.which == 0) {
                return true;
            }
            event.preventDefault();

            if (pointer == 0) {
                startTime = calculateTime();
            }

            checkKey(event);
            colorTeacherText(pointer, errorList);

            if (pointer == lessonText.length) {
                endTime = calculateTime();
                calculateScore(errors);
            }
        }
    };
} ();

