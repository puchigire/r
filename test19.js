if (!this[CHANNEL.name]) {
    this[CHANNEL.name] = {};
}
if (!this[CHANNEL.name].favicon) {
    this[CHANNEL.name].favicon = $("<link/>")
        .prop("id", "favicon")
        .attr("rel", "shortcut icon")
        .attr("type", "image/png")
        .attr("sizes", "64x64")
        .attr("href", "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/ogey.png")
        .appendTo("head");
}

const xaeModule = {
    options: {
        playlist: {
            collapse: false,
            hidePlaylist: true,
            inlineBlame: true,
            moveReporting: false,
            quickQuality: false,
            recentMedia: true,
            simpleLeader: true,
            syncCheck: true,
            thumbnails: true,
            timeEstimates: true,
            userlist: { autoHider: true },
            smartScroll: false,
            maxMessages: 120
        },
        various: { notepad: true, emoteToggle: false }
    },
    modules: {
        settings: { active: 1, rank: -1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r/customsettingsmodal.js", done: true },
        playlist: { active: 1, rank: -1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r/playlistenhancement2.js", done: true },
        privmsg: { active: 1, rank: 1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r/pmenhancement.js", done: true },
        notifier: { active: 1, rank: -1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/notifier.js", done: true },
        layout: { active: 1, rank: -1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r/layoutoptions.js", done: true },
        userlist: { active: 1, rank: -1, url: "https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/userlist.js", done: true },
        html2canvas: { active: 1, rank: -1, url: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", done: true }
    },
    getScript(url, success, cache = true) {
        return $.ajax({ url, cache, success, type: "GET", dataType: "script" });
    },
    initialize() {
        if (CLIENT.modules) return;
        CLIENT.modules = this;
        window[CHANNEL.name].modulesOptions = this.options;
        console.info("[XaeModule]", "Begin Loading.");
        this.index = Object.keys(this.modules);
        this.sequencerLoader();
        this.cache = false;
    },
    sequencerLoader() {
        if (this.state.prev) {
            setTimeout(this.modules[this.state.prev].done, 0);
            this.state.prev = "";
        }
        if (this.state.pos >= this.index.length) {
            console.info("[XaeModule]", "Loading Complete.");
            return;
        }
        const currKey = this.index[this.state.pos];
        if (this.state.pos < this.index.length) {
            if (this.modules[currKey].active) {
                if (this.modules[currKey].rank <= CLIENT.rank) {
                    console.info("[XaeModule]", "Loading:", currKey);
                    this.state.prev = currKey;
                    this.state.pos++;
                    const cache = typeof this.modules[currKey].cache === "undefined" ? this.cache : this.modules[currKey].cache;
                    this.getScript(this.modules[currKey].url, this.sequencerLoader.bind(this), cache);
                } else {
                    if (this.modules[currKey].rank === 0 && CLIENT.rank === -1) {
                        socket.once("login", data => {
                            if (data.success) {
                                this.getScript(this.modules[currKey].url, false, this.cache);
                            }
                        });
                    }
                    this.state.pos++;
                    this.sequencerLoader();
                }
            } else {
                this.state.pos++;
                this.sequencerLoader();
            }
        }
    },
    state: { prev: "", pos: 0 }
};

xaeModule.initialize();

$(document).ready(function () {
    const watermark = 'om3tcw is cuter than usual';
    $('#chatwrap').attr('placeholder', watermark);

    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://holodex.net/home'>HoloDex</a></li>");
    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://www.youtube.com/watch?v=JA50uvxvop8'>₿ Debt: -53.11</a></li>");
});

// Tabs
{
    const tabContainer = $('<div id="MainTabContainer"></div>').appendTo('#videowrap');
    const tabList = $('<ul class="nav nav-tabs" role="tablist"></ul>').appendTo(tabContainer);
    const tabContent = $('<div class="tab-content"></div>').appendTo(tabContainer);

    // Playlist Tab
    $('<div role="tabpanel" class="tab-pane active" id="playlistTab"></div>')
        .appendTo(tabContent)
        .append($('#rightcontrols').detach())
        .append($('#playlistrow').detach().removeClass('row'));
    const playlistButton = $('<li class="active" role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#playlistTab">Playlist</a></li>').appendTo(tabList);

    if (getOrDefault(CHANNEL.name + "chinkspy", false)) {
        $('body').append('<span id="pnl_options" style="position:absolute;display:none;left:0;top:30px;padding-top:10px;width:100%;background:rgba(0,0,0,0.5);z-index:2;"></span>');
        $('<li><a id="btn_playList" class="pointer">Playlist</a></li>').insertAfter('#settingsMenu')
            .click(function () {
                if ($('#pnl_options').css('display') === 'none') {
                    $('#rightcontrols').detach().appendTo('#pnl_options');
                    $('#playlistrow').detach().appendTo('#pnl_options');
                    $('#pnl_options').slideDown();
                } else {
                    $('#pnl_options').slideUp();
                }
            });
        playlistButton.on('mousedown', function () {
            $('#rightcontrols').detach().appendTo('#playlistTab');
            $('#playlistrow').detach().appendTo('#playlistTab');
        });
    }

    // Polls Tab
    $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#pollsTab">Polls <span id="pollsbadge" class="badge" style="background-color:#FFF;color:#000;"></span></a></li>')
        .appendTo(tabList).click(function () {
            $('#pollsbadge').text('');
        });
    $('<div role="tabpanel" class="tab-pane" id="pollsTab"><div class="col-lg-12 col-md-12" id="pollhistory"></div></div>')
        .appendTo(tabContent).prepend($('#newpollbtn').detach());

    const redoPollwrap = function () {
        $('#pollwrap').detach().insertBefore('#MainTabContainer');
        $('#pollwrap .well span.label.pull-right').detach().insertBefore('#pollwrap .well h3');
        $('#pollwrap button.close').off("click").click(function () {
            $('#pollwrap').detach().insertBefore('#pollhistory');
            if (!$('#pollsTab').hasClass('active')) {
                const badgeTxt = $('#pollsbadge').text();
                $('#pollsbadge').text((badgeTxt ? parseInt(badgeTxt) : 0) + 1);
            }
        });
    };

    const base_newPoll = Callbacks.newPoll;
    Callbacks.newPoll = function (data) {
        base_newPoll(data);
        if (!$('#pollsTab').hasClass('active') && $('#MainTabContainer #pollwrap').length === 0) {
            const badgeTxt = $('#pollsbadge').text();
            const pollCnt = $('#pollwrap .well.muted').length + (badgeTxt ? parseInt(badgeTxt) : 0);
            $('#pollsbadge').text(pollCnt);
        }

        $('#pollwrap .well.muted').detach().prependTo('#pollhistory');
        redoPollwrap();
    };
    redoPollwrap();

    // Teamup
    $('<div role="tabpanel" class="tab-pane" id="calendarTab"><iframe width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>').appendTo(tabContent);
    $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#calendarTab">Teamup EN</a></li>').appendTo(tabList);
    const baseCalendarUrl = 'https://teamup.com/ksua2ar4zft49pdn7c?view=m&showLogo=0&showSearch=0&showProfileAndInfo=0&showSidepanel=1&disableSidepanel=0&showTitle=0&showViewSelector=1&showMenu=0&weekStartDay=mo&showAgendaHeader=1&showAgendaDetails=0&showYearViewHeader=1';

    $('<div role="tabpanel" class="tab-pane" id="calendarTab2"><iframe width="100%" height="600" frameborder="0" scrolling="auto"></iframe></div>').appendTo(tabContent);
    $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#calendarTab2">Oshi Eyes</a></li>').appendTo(tabList);
    const baseCalendarUrl2 = 'https://docs.google.com/forms/d/1oqO8DIIyxuKVPvhXSAmxNCy5zCkS8XQAhEKi8a9BK1g/viewform?';

    let calendars = getOrDefault(CHANNEL.name + '_CALENDARS', null);
    if (!Array.isArray(calendars)) {
        setOpt(CHANNEL.name + '_CALENDARS', calendars = [{ src: 'd426h89oqa3krrq8cj00kbasgo%40group.calendar.google.com', color: '2952A3' }]);
    }
    window.AddCalendar = function (src, color) {
        setOpt(CHANNEL.name + '_CALENDARS', getOrDefault(CHANNEL.name + '_CALENDARS', []).concat([{ src, color }]));
    };

    $('#calendarTab iframe').attr('src', baseCalendarUrl + '&');
    $('#calendarTab2 iframe').attr('src', baseCalendarUrl2 + '&');
    $('#leftpane').remove();
}

// Keybinds
let keyHeld = false;
$(window).bind('keyup', function () { keyHeld = false; });
$(window).bind('keydown', function (event) {
    const inputBox = document.getElementById("chatline");
    const inputVal = inputBox.value;
    if (event.ctrlKey && !event.shiftKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a':
                event.preventDefault();
                if (!keyHeld) {
                    keyHeld = true;
                    inputBox.focus();
                    inputBox.setSelectionRange(0, inputVal.length);
                }
                break;
            case 's':
                if (!keyHeld) {
                    keyHeld = true;
                    event.preventDefault();
                    const selSt = inputBox.selectionStart;
                    const selEnd = inputBox.selectionEnd;
                    if (inputBox === document.activeElement) {
                        if (inputBox.selectionStart === inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[sp]" + inputVal.substring(selSt, selEnd) + "[/sp]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selSt + 4, selSt + 4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[sp]" + inputVal.substring(selSt, selEnd) + "[/sp]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selEnd + 9, selEnd + 9);
                        }
                    }
                }
                break;
            case 'r':
                if (!keyHeld) {
                    keyHeld = true;
                    event.preventDefault();
                    event.stopPropagation();
                    const selSt = inputBox.selectionStart;
                    const selEnd = inputBox.selectionEnd;
                    if (inputBox === document.activeElement) {
                        if (inputBox.selectionStart === inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[r] " + inputVal.substring(selSt, selEnd) + " [/r]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selSt + 4, selSt + 4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[r] " + inputVal.substring(selSt, selEnd) + " [/r]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selEnd + 9, selEnd + 9);
                        }
                    }
                }
                break;
        }
    }
});

// Replace Video
(function () {
    $('#plcontrol').append('<input type="button" class="btn btn-sm btn-default" value="🐀" id="replacebutton">');
    $('#plcontrol').append('<input type="button" class="btn btn-sm btn-default" value="🔃" id="refreshbutton">');

    $('#replacebutton').click(function () {
        let newId = window.prompt("Replace the current playing stream\nRefresh to undo\n\nSwitching back to YouTube from Twitch is broken, so reloading the player is necessary in that case\n\nYoutube URL/ID:", "");
        let newSource = "YT";

        if (newId == null) {
            newId = "";
        } else if (newId.includes("https://youtube.com/watch?v=")) {
            newId = newId.replace('https://youtube.com/watch?v=', '').substring(0, 11);
        } else if (newId.includes("https://www.youtube.com/watch?v=")) {
            newId = newId.replace('https://www.youtube.com/watch?v=', '').substring(0, 11);
        } else if (newId.includes("https://youtu.be/")) {
            newId = newId.replace('https://youtu.be/', '').substring(0, 11);
        } else if (newId.includes("https://www.twitch.tv/")) {
            newId = newId.replace('https://www.twitch.tv/', '');
            newSource = "TTV";
        } else if (newId.includes("https://twitch.tv/")) {
            newId = newId.replace('https://twitch.tv/', '');
            newSource = "TTV";
        } else if (newId === "om3tcw") {
            newId = "cJtkxZrUicI";
        } else if (newId === "ogey" || newId === "rrat" || newId === "ogey rrat") {
            newId = "JacN1MzyeKo";
        } else if (newId.length !== 11) {
            alert("Invalid input.\nExample input: https://www.youtube.com/watch?v=X9zw0QF12Kc, https://youtu.be/X9zw0QF12Kc, X9zw0QF12Kc, https://www.twitch.tv/holofightz, https://twitch.tv/holofightz");
            newId = "";
        }

        document.body.classList.add('chatOnly');
        socket.emit("removeVideo");
        CLIENT.videoRemoved = true;

        if (newId !== "") {
            const playerSrc = newSource === "YT"
                ? `https://www.youtube.com/embed/${newId}?autohide=1&autoplay=1&controls=1&iv_load_policy=3&rel=0&wmode=opaque&enablejsapi=1&origin=https%3A%2F%2Fom3tcw.com&widgetid=2`
                : `https://player.twitch.tv?channel=${newId}&parent=om3tcw.com&referrer=location.host`;
            document.getElementById("ytapiplayer").src = playerSrc;
        }
    });

    $('#refreshbutton').click(function () {
        document.body.classList.remove('chatOnly');
        document.getElementById("mediarefresh").click();
        socket.emit("restoreVideo");
        CLIENT.videoRemoved = false;
    });
})();

// Image Hover
const ImageHoverEnable = false;

function createHoverImage(jqChatMessage) {
    jqChatMessage.find("a").bind("mouseenter", function () {
        if (ImageHoverEnable) {
            const messageAfter = $(this).parent().next();
            if (!messageAfter.is("img")) {
                const newImg = new Image();
                newImg.style.display = "none";
                newImg.onload = function () {
                    this.classList.add("imageHoverPreview", "imageLoaded");
                };
                newImg.src = $(this).html();
                $(this).parent().after(newImg);
            }
            $("#messagebuffer div:hover .imageHoverPreview").stop(true, false).slideDown(100);
            $("#messagebuffer div:hover").one("mouseout", function () {
                $(this).children(".imageHoverPreview").stop(true, true).slideUp(100).delay(100).removeAttr("style");
            });
        }
    });
}

$("#messagebuffer").bind('DOMNodeInserted', function (event) {
    $(event.target).find("a").parent().parent().each(function () {
        createHoverImage($(this));
    });
});

$("#messagebuffer a").parent().parent().each(function () {
    createHoverImage($(this));
});

// UI Enhancements
(() => {
    'use strict';

    // Move controls around
    $('#videowrap').append("<span id='vidchatcontrols' style='float:right'>");
    $('#emotelistbtn').detach().insertBefore('#chatwrap>form').wrap('<div id="emotebtndiv"></div>').text('Emotes').attr('title', 'Emote List');
    $('#leftcontrols').remove();

    $('.navbar-brand').attr('href', 'https://files.catbox.moe/om3tcw.webm');

    $("#togglemotd").html("X").click(() => $("#motdwrap").hide());



    // Existing Code for Toggles
    $(".nav.navbar-nav").append('<li><a id="videotoggylogg" href="javascript:void(0)">A/O</a></li>');
    $("#videotoggylogg").click(() => {
        if ($("#videowrap:visible").length) {
            $("#videowrap").hide();
            $("#chatwrap").removeClass("col-lg-5 col-md-5").addClass("col-lg-12 col-md-12");
        } else {
            $("#videowrap").show();
            $("#chatwrap").removeClass("col-lg-12 col-md-12").addClass("col-lg-5 col-md-5");
        }
    });

    $(".nav.navbar-nav").append('<li><a id="togglemotd" href="javascript:void(0)">MOTD</a></li>');
    $("#togglemotd").click(() => {
        if ($("#motdwrap:visible").length) {
            $("#motdwrap").hide();
        } else {
            $("#motdwrap").show();
            $("#motd").show();
        }
    });

    $("#main").addClass("flex").children().first().children().first().after('<div id="chatdisplayrow" class="row"></div>').next().append($("#userlist,#messagebuffer").removeAttr("style")).after('<div id="chatinputrow" class="row"></div>').next().append($("#emotebtndiv,#chatwrap>form"));

    // Mikoboat
    const mikoDing = new Audio('https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/soundposts/sounds/om3tcw.ogg');
    mikoDing.loop = true;
    mikoDing.volume = 0.1;
    $('.navbar-brand').on('mouseenter', () => mikoDing.play());
    $('.navbar-brand').on('mouseleave', () => mikoDing.pause());

    // Emote button
    const randomEmotePool = [
        "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyascone.png",
        "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyascone.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasip.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachicken.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatoast.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachocoshroom.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasourdough.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaminecraft.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaclif.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasalman.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaeggsandwich.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyashitpost.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacereal.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatect.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasteak.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyanoodle.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagogurt.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawrappedburger.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapolitan.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagraph.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaoreoshake.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyataco.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacorndog.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaparfait.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasandwich.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasandwich2.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamage.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapirouette.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyafry.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyadonut.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamelonsoda.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaknife.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaahituna.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapumpkinpie.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaseesyourhotpocket.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyart.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamouth.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawithagun.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyan.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachurro.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasugarcookie.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyainahair.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagoslings.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacube.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamami.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyablink.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawarp.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/aranya.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapizza.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamail.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatoast2.png"
    ];

    const drawRandomEmote = () => randomEmotePool[Math.floor(Math.random() * randomEmotePool.length)];

    $("#emotelistbtn").click(function () {
        $(this).css("background-image", "url(" + drawRandomEmote() + ")");
    }).html("");
})();
