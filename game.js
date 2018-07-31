$(document).ready(goGoApp);
function goGoApp(){
    addClickHandlers();
    createBoard(heroes);  
}

//----------------------------------------->
//Click Handlers
function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $("#splashModal").click(closeModal);
    $("#winModal").click(hideModal);
    $("#settingsModal").click(hideModal);
    $('.reset').click(function(){
        stats.games_played++;
        reset_stats();
        cardHandling.match_counter = 0;
        $(".card").replaceWith();
        createBoard(heroes);
    });
}

//----------------------------------------->
//Stat Handling
const stats = {
    matches: 0,
    overallMatches: 0,
    attempts:0,
    overallAttempts: 0,
    accuracy: 0,
    games_played: 0
}
function incrementMatches(){
    cardHandling.match_counter++;
    stats.matches ++;
    stats.overallMatches ++;
}
function incrementAttempts(){
    stats.attempts++;
    stats.overallAttempts++;
}
function display_stats(){
    if (stats.overallAttempts !== 0){
        stats.accuracy = Math.round((stats.overallMatches)/(stats.overallAttempts)*100);
    }      
    $('.playedValue').text(stats.games_played);
    $('.attemptValue').text(stats.attempts);
    $('.accuracyValue').text(stats.accuracy + '%');
}
function reset_stats(){
    stats.matches = 0;
    stats.attempts = 0;
    display_stats();
}

//----------------------------------------->
// Card Handling
const cardHandling = {
    chosenHeroes: [],
    victoryPoses: [],
    firstImageClick: null,
    secondImageClick: null,
    first_card_clicked: null,
    second_card_clicked: null,
    total_possible_matches: 9,
    match_counter: 0,
    currentCard: null
}
function card_clicked() {
    var clickedCard = $(this);
    if(clickedCard.hasClass('matched') || clickedCard.hasClass('reveal') || clickedCard.hasClass('revealMei')) {
        return;
    }
    clickedCard.addClass('reveal'); 
    $(clickedCard.back).addClass('fadeCard animated');    
    if(cardHandling.first_card_clicked === null) {
        cardHandling.first_card_clicked = clickedCard;
        cardHandling.firstImageClick = clickedCard.find('.front img').attr('src');
        $(cardHandling.first_card_clicked).addClass('viewing');
        heroClickSound();
        return;
    }
    cardHandling.second_card_clicked = clickedCard;
    cardHandling.secondImageClick = clickedCard.find('.front img').attr('src');
    $(cardHandling.second_card_clicked).addClass('viewing');
    incrementAttempts();
    display_stats();
    if (cardHandling.firstImageClick === cardHandling.secondImageClick) {
        cardHandling.currentCard = clickedCard.attr('position');
        powerDetection();
        heroMatchSound();
        incrementMatches();
        incrementAttempts(); 
        display_stats();
        $([cardHandling.first_card_clicked[0], cardHandling.second_card_clicked[0]]).addClass('matched').removeClass('flicker revealBastion revealGenji');
        resetCardClick()
        if (cardHandling.match_counter === cardHandling.total_possible_matches) {
            window.setTimeout(function(){
                victoryPose();
            }, 1500);
            
        }
        return
    }
    $('.card').addClass('viewing');
        pauseFlip();     
}
function resetCardClick(){
    cardHandling.first_card_clicked = null;
    cardHandling.second_card_clicked = null;
}
function pauseFlip(){
    window.setTimeout(function(){
        hideCard();
    }, 1500);
}
function hideCard(){
    $([cardHandling.first_card_clicked[0], cardHandling.second_card_clicked[0]]).removeClass('reveal');
    resetCardClick();
    $('.card').removeClass('viewing');
}

//----------------------------------------->
//Modals
function closeModal(){
    $('#splashModal').replaceWith();
    bgMusicPlay();
}
function hideModal(){
    $(this).addClass('hideModal').removeClass('showModal');     
}
function displaySettings(){
    $("#settingsModal").addClass('showModal').removeClass('hideModal');    
}

//----------------------------------------->
//Board Creation
function createBoard(heroList){
    var extractedHeroes = [];
    var selectedHeroes = [];
    var shuffledHeroes = [];
    cardHandling.victoryPoses = [];
    for (var prop in heroList) {
        if (heroList.hasOwnProperty(prop)) {
            extractedHeroes.push(prop);
        }
    }
    for ( var i = 0; i < cardHandling.total_possible_matches; i++ ) {
        selectedHeroes.push(extractedHeroes.splice(Math.floor(Math.random()*extractedHeroes.length),1)[0]);
    }
    console.log(selectedHeroes);
    cardHandling.victoryPoses.push(selectedHeroes);
    selectedHeroes = selectedHeroes.concat(selectedHeroes);
    while ( selectedHeroes.length-1) {
        shuffledHeroes.push(selectedHeroes.splice(Math.floor(Math.random()*selectedHeroes.length),1)[0]);
    }
    shuffledHeroes.push(selectedHeroes[0]);
    cardHandling.chosenHeroes=shuffledHeroes;
    for(i=0; i<cardHandling.chosenHeroes.length; i++){
        var front = $('<div>').addClass('front');
        var back = $('<div>').addClass('back');
        var card = $('<div>').addClass('card').attr({'position': i}).append(front, back);
        $('#game-area').append(card);
    }
    $('.front').each(function(){
        var heroChoice = Math.floor(Math.random() * cardHandling.chosenHeroes.length);
        $(this).append(`<img src= "assets/images/heroes/${cardHandling.chosenHeroes[heroChoice]}.png" alt= "${cardHandling.chosenHeroes[heroChoice]}"/>`); 
        cardHandling.chosenHeroes.splice(heroChoice, 1);
  });
}

//----------------------------------------->
// Heroes
var heroes = {
    ana: {
        power: 'none',
        clickSound: new Audio('assets/sounds/ana-click.wav'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/ana-ult.wav'),
        victoryPose: 'assets/images/heroes/ana-victory.png',
        src: 'assets/images/heroes/ana.png'
    },
    bastion: {
        power: revealRandomCards,
        clickSound: new Audio('assets/sounds/bastion-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/bastion-ult.ogg'),
        victoryPose: 'assets/images/heroes/bastion-victory.png',
        src: 'assets/images/heroes/bastion.png'
    },
    brigitte: {
        power: 'none',
        clickSound: new Audio('assets/sounds/brigitte-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/brigitte-ult.ogg'),
        victoryPose: 'assets/images/heroes/brigitte-victory.png',
        src: 'assets/images/heroes/brigitte.png'
    },
    doomfist: {
        power: 'none',
        clickSound: new Audio('assets/sounds/doomfist-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/doomfist-ult.ogg'),
        victoryPose: 'assets/images/heroes/doomfist-victory.png',
        src: 'assets/images/heroes/doomfist.png'
    },
    dva: {
        power: 'none',
        clickSound: new Audio('assets/sounds/dva-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/dva-ult.ogg'),
        victoryPose: 'assets/images/heroes/dva-victory.png',
        src: 'assets/images/heroes/dva.png'
    },
    genji: {
        power: revealDiagonalCards,
        clickSound: new Audio('assets/sounds/genji-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/genji-ult.ogg'),
        victoryPose: 'assets/images/heroes/genji-victory.png',
        src: 'assets/images/heroes/genji.png'
    },
    hanzo:{
        power: revealEdgeCards,
        clickSound: new Audio('assets/sounds/hanzo-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/hanzo-ult.ogg'),
        victoryPose: 'assets/images/heroes/hanzo-victory.png',
        src: 'assets/images/heroes/hanzo.png' 
    },
    junkrat:{
        power: 'none',
        clickSound: new Audio('assets/sounds/junkrat-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/junkrat-ult.ogg'),
        victoryPose: 'assets/images/heroes/junkrat-victory.png',
        src: 'assets/images/heroes/junkrat.png' 
    },
    lucio:{
        power: 'none',
        clickSound: new Audio('assets/sounds/lucio-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/lucio-ult.ogg'),
        victoryPose: 'assets/images/heroes/lucio-victory.png',
        src: 'assets/images/heroes/lucio.png' 
    },
    mccree:{
        power: 'none',
        clickSound: new Audio('assets/sounds/mccree-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/mccree-ult.ogg'),
        victoryPose: 'assets/images/heroes/mccree-victory.png',
        src: 'assets/images/heroes/mccree.png' 
    },
    mei: {
        power: revealAdjacentCards,
        heroCounter: 0,
        clickSound: new Audio('assets/sounds/mei-click.mp3'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/mei-ult.ogg'),
        victoryPose: 'assets/images/heroes/mei-victory.png',
        src: 'assets/images/heroes/mei.png'
    },
    mercy: {
        power: 'none',
        clickSound: new Audio('assets/sounds/mercy-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/mercy-ult.ogg'),
        victoryPose: 'assets/images/heroes/mercy-victory.png',
        src: 'assets/images/heroes/mercy.png'
    },
    moira: {
        power: 'none',
        clickSound: new Audio('assets/sounds/moira-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/moira-ult.ogg'),
        victoryPose: 'assets/images/heroes/moira-victory.png',
        src: 'assets/images/heroes/moira.png'
    },
    orisa: {
        power: 'none',
        clickSound: new Audio('assets/sounds/orisa-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/orisa-ult.mp3'),
        victoryPose: 'assets/images/heroes/orisa-victory.png',
        src: 'assets/images/heroes/orisa.png'
    },
    pharah: {
        power: 'none',
        clickSound: new Audio('assets/sounds/pharah-click.mp3'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/pharah-ult.ogg'),
        victoryPose: 'assets/images/heroes/pharah-victory.png',
        src: 'assets/images/heroes/pharah.png'
    },
    reaper: {
        power: 'none',
        clickSound: new Audio('assets/sounds/reaper-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/reaper-ult.ogg'),
        victoryPose: 'assets/images/heroes/reaper-victory.png',
        src: 'assets/images/heroes/reaper.png'
    },
    reinhardt: {
        power: 'none',
        clickSound: new Audio('assets/sounds/reinhardt-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/reinhardt-ult.mp3'),
        victoryPose: 'assets/images/heroes/reinhardt-victory.png',
        src: 'assets/images/heroes/reinhardt.png'
    },
    roadhog: {
        power: 'none',
        clickSound: new Audio('assets/sounds/roadhog-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/roadhog-ult.ogg'),
        victoryPose: 'assets/images/heroes/roadhog-victory.png',
        src: 'assets/images/heroes/roadhog.png'
    },
    soldier76: {
        power: 'none',
        clickSound: new Audio('assets/sounds/soldier76-click.wav'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/soldier76-ult.ogg'),
        victoryPose: 'assets/images/heroes/soldier76-victory.png',
        src: 'assets/images/heroes/soldier76.png'
    },
    sombra: {
        power: 'none',
        clickSound: new Audio('assets/sounds/sombra-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/sombra-ult.ogg'),
        victoryPose: 'assets/images/heroes/sombra-victory.png',
        src: 'assets/images/heroes/sombra.png'
    },
    symmetra: {
        power: 'none',
        clickSound: new Audio('assets/sounds/symmetra-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/symmetra-ult.ogg'),
        victoryPose: 'assets/images/heroes/symmetra-victory.png',
        src: 'assets/images/heroes/symmetra.png'
    },
    torbjorn: {
        power: 'none',
        clickSound: new Audio('assets/sounds/torbjorn-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/torbjorn-ult.ogg'),
        victoryPose: 'assets/images/heroes/torbjorn-victory.png',
        src: 'assets/images/heroes/torbjorn.png'
    },
    tracer: {
        power: 'none',
        clickSound: new Audio('assets/sounds/tracer-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/tracer-ult.ogg'),
        victoryPose: 'assets/images/heroes/tracer-victory.png',
        src: 'assets/images/heroes/tracer.png'
    },
    widowmaker: {
        power: 'none',
        clickSound: new Audio('assets/sounds/widowmaker-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/widowmaker-ult.ogg'),
        victoryPose: 'assets/images/heroes/widowmaker-victory.png',
        src: 'assets/images/heroes/widowmaker.png'
    },
    winston: {
        power: 'none',
        clickSound: new Audio('assets/sounds/winston-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/winston-ult.ogg'),
        victoryPose: 'assets/images/heroes/winston-victory.png',
        src: 'assets/images/heroes/winston.png'
    },
    zarya: {
        power: 'none',
        clickSound: new Audio('assets/sounds/zarya-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/zarya-ult.ogg'),
        victoryPose: 'assets/images/heroes/zarya-victory.png',
        src: 'assets/images/heroes/zarya.png'
    },
    zenyatta: {
        power: 'none',
        clickSound: new Audio('assets/sounds/zenyatta-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/zenyatta-ult.ogg'),
        victoryPose: 'assets/images/heroes/zenyatta-victory.png',
        src: 'assets/images/heroes/zenyatta.png'
    },
}

//----------------------------------------->
// Hero Power Invocation
function powerDetection(){
    function removeAbility() {
        $('.abilities').text('Choose a card');
    }
    switch (cardHandling.secondImageClick) {
        case heroes.mei.src:
            $('.abilities').text('You\'ve triggered Mei\'s Ice Wall!');
            setTimeout(removeAbility, 4000);
            revealAdjacentCards();
            break;
        case heroes.genji.src:
            $('.abilities').text('You\'ve triggered Genji\'s Dragon Blade!');
            setTimeout(removeAbility, 4000);
            revealDiagonalCards();
            break;
        case heroes.hanzo.src:
            $('.abilities').text('You\'ve triggered Hanzo\'s Sonic Arrow!');
            setTimeout(removeAbility, 4000);
            revealEdgeCards();
            break;
        case heroes.bastion.src:
            $('.abilities').text('You\'ve triggered Bastion\'s Tank Configuration! Run.');
            setTimeout(removeAbility, 4000);
            revealRandomCards();
            break;
    
        default:
            break;
    }
}
function revealAdjacentCards() {
    var centerCard = cardHandling.currentCard;
    var topPosition = parseInt(centerCard)-6;
    var bottomPosition = parseInt(centerCard)+6;
    var leftPosition = parseInt(centerCard)-1;
    var rightPosition = parseInt(centerCard)+1;
    if ($('#game-area').hasClass('hard')){
        topPosition = parseInt(centerCard)-7;
        bottomPosition = parseInt(centerCard)+7;
    }
    if ($('#game-area').hasClass('ultra')){
        topPosition = parseInt(centerCard)-8;
        bottomPosition = parseInt(centerCard)+8;
    }
    $(`div[position="${topPosition}"], div[position="${bottomPosition}"]`).addClass('revealMei');
    leftRightCheck();
    iceWall();
    function leftRightCheck(){
        if ($('#game-area').hasClass('hard')){
            if(!layouts.hard.rightCol.includes(leftPosition)) {
                $(`div[position="${leftPosition}"]`).addClass('revealMei');
            }  
            if(!layouts.hard.leftCol.includes(rightPosition)) {
                $(`div[position="${rightPosition}"]`).addClass('revealMei');
            }
            return;
        }
        if ($('#game-area').hasClass('ultra')){
            if(!layouts.ultra.rightCol.includes(leftPosition)) {
                $(`div[position="${leftPosition}"]`).addClass('revealMei');
            }  
            if(!layouts.ultra.leftCol.includes(rightPosition)) {
                $(`div[position="${rightPosition}"]`).addClass('revealMei');   
            }
            return;
        }
        if(!layouts.base.rightCol.includes(leftPosition)) {
            $(`div[position="${leftPosition}"]`).addClass('revealMei');
        }  
        if(!layouts.base.leftCol.includes(rightPosition)) {
            $(`div[position="${rightPosition}"]`).addClass('revealMei');
        }
    }
    function iceWall(){
        setTimeout(removeIceElement, 6000);
        function removeIceElement() {
            $('.card').removeClass('revealMei ');
        }
    }
}
function revealDiagonalCards() {
    var centerCard = cardHandling.currentCard;
    console.log(centerCard);
    var position = parseInt(centerCard);
    var topLeft = parseInt(centerCard)-7;
    var topRight = parseInt(centerCard)-5;
    var bottomLeft = parseInt(centerCard)+5;
    var bottomRight = parseInt(centerCard)+7;
    function leftSideSelection(){
        if(!$(`div[position="${topLeft}"]`).hasClass('matched')){
            $(`div[position="${topLeft}"]`).addClass('revealGenji flicker');
        }
        if(!$(`div[position="${bottomLeft}"]`).hasClass('matched')){
            $(`div[position="${bottomLeft}"]`).addClass('revealGenji flicker');
        }
    }
    function rightSideSelection(){
        if(!$(`div[position="${topRight}"]`).hasClass('matched')){
            $(`div[position="${topRight}"]`).addClass('revealGenji flicker');
        }
        if(!$(`div[position="${bottomRight}"]`).hasClass('matched')){
            $(`div[position="${bottomRight}"]`).addClass('revealGenji flicker');
        }
    }
    if ($('#game-area').hasClass('hard')){
        topLeft = parseInt(centerCard)-8;
        topRight = parseInt(centerCard)-6;
        bottomLeft = parseInt(centerCard)+6;
        bottomRight = parseInt(centerCard)+8;
    }
    if ($('#game-area').hasClass('ultra')){
        topLeft = parseInt(centerCard)-9;
        topRight = parseInt(centerCard)-7;
        bottomLeft = parseInt(centerCard)+7;
        bottomRight = parseInt(centerCard)+9;
    }
    leftRightCheck();
    function leftRightCheck(){
        if ($('#game-area').hasClass('hard')){
            if(!layouts.hard.leftCol.includes(position)) {
                leftSideSelection();
            }  
            if(!layouts.hard.rightCol.includes(position)) {
                rightSideSelection();
            }
            return;
        }
        if ($('#game-area').hasClass('ultra')){
            if(!layouts.ultra.leftCol.includes(position)) {
                leftSideSelection();
            }  
            if(!layouts.ultra.rightCol.includes(position)) {
                rightSideSelection();   
            }
            return;
        }
        if(!layouts.base.leftCol.includes(position)) {
            leftSideSelection();
        }  
        if(!layouts.base.rightCol.includes(position)) {
            rightSideSelection();
        }
    }
}
function revealEdgeCards() {
    if ($('#game-area').hasClass('hard')){
        showEdges(layouts.hard.leftCol.concat(layouts.hard.rightCol));
    } else if ($('#game-area').hasClass('ultra')){
        showEdges(layouts.ultra.leftCol.concat(layouts.ultra.rightCol));
    } else {
        showEdges(layouts.base.leftCol.concat(layouts.base.rightCol));
    }
    function showEdges(array) {
        const edgeCards = array.map(i => $(`div[position="${i}"]`).addClass('reveal'))
        window.setTimeout(function(){
            hideEdges(array);
        }, 2000);
        return edgeCards;
    }
    function hideEdges(array) {
        const edgeCards = array.map(i => $(`div[position="${i}"]`).removeClass('reveal'))
        return edgeCards;
    }
}
function revealRandomCards(){
    for(var i=0; i<3; i++){
        var card = `div[position="${Math.floor((Math.random() * cardHandling.victoryPoses[0].length*2))}"]`;
        console.log('bastion card', card);
        $(card).addClass('revealBastion flicker');
    }
}

//----------------------------------------->
//Win Conditions
function victoryPose(){
    var winner = $('<p>').text('YOU WON!');
    var randomPose = cardHandling.victoryPoses[0][Math.floor(Math.random() * cardHandling.victoryPoses.length)];
    stats.games_played++;
    $('#winModal').append(`<img src= "${heroes[randomPose].victoryPose}" alt= "You Won"/>)`, winner).removeClass('hideModal').addClass('showModal'); 
    $('.abilities').text('You won! Reset and play again?').addClass('cursor').click(function(){
        reset_stats();
        cardHandling.match_counter = 0;
        $(".card").replaceWith();
        createBoard(heroes);
    });
}

//----------------------------------------->
//Sound
var bgMusic = new Audio('assets/sounds/owlst17.mp3');
$(window).focus(bgMusicPlay);
$(window).blur(bgMusicPause); 
function heroClickSound(){
    var heroName = cardHandling.firstImageClick.slice(21, -4);
    if(heroes[heroName].clickSoundLimiter == false){
        heroes[heroName].clickSound.play();
        heroes[heroName].clickSoundLimiter = true;
    } else {
        return;
    }
}
function heroMatchSound(){
    var heroName = cardHandling.secondImageClick.slice(21, -4);
    heroes[heroName].matchSound.play();
}
function bgMusicPlay(){
    bgMusic.play();
    bgMusic.loop=true;
}
function bgMusicPause(){
  bgMusic.pause();
}
  
//----------------------------------------->
//Settings
function setDifficulty(setting){
    if(setting === 9){
        $('#game-area, .hardDif, .ultraDif').removeClass('ultra hard selected');
        $('.normalDif').addClass('selected');
    } else if(setting === 14){
        $('#game-area, .normalDif, .ultraDif').addClass('hard').removeClass('ultra selected');
        $('.hardDif').addClass('selected');
    } else if(setting === 20){
        $('#game-area, .normalDif, .hardDif').addClass('ultra').removeClass('hard selected');
        $('.ultraDif').addClass('selected');
    }
    $(".card").replaceWith();
    cardHandling.total_possible_matches = setting;
    createBoard(heroes);
    $('.abilities').text('Choose your hero')
    reset_stats();
}