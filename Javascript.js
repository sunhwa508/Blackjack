
//Challenge 5 : Blackjack !!!
let blackjackGame = {
    'you' : {'scoreSpan':'#your-blackjack-result','div': '#your-box','score':0},
  'dealer': {'scoreSpan':'#dealer-blackjack-result','div': '#dealer-box','score':0},
   'Cards': ['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
'cardsMap': {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'J': 10,'K': 10,'Q': 10,'A': [1,11]},
   'wins' :0,
 'losses' :0,
   'draws':0,
 'isStand':false,
 'turnOver':false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('assets/sounds/swish.m4a');
const winSound = new Audio('assets/sounds/cash.mp3');
const lossSound = new Audio('assets/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if (blackjackGame['isStand'] === false ){
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    console.log(YOU['score']);
   }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['Cards'][randomIndex];
}

 function showCard(card, activePlayer){
     if(activePlayer['score']<=21){
     let cardImage = document.createElement('img');
     cardImage.src = `assets/images/${card}.jpg`;
     document.querySelector(activePlayer['div']).appendChild(cardImage);
     hitSound.play();
    }
 }

function blackjackDeal(){
    if(blackjackGame['turnOver'] === true){

        blackjackGame['isStand'] = false;

        let yourImage = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImage = document.querySelector('#dealer-box').querySelectorAll('img');
        for(i=0; i<yourImage.length;i++){
            yourImage[i].remove();
        }
        for(i=0; i<dealerImage.length;i++){
            dealerImage[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = '#ffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffff';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnOver'] = true;
    }
}

function updateScore(card, activePlayer){
    if(card === 'A'){
    //if adding 11 keeps me below 21, add 11, otherwise, add 1
        if(activePlayer['score']+blackjackGame['cardsMap'][card][1]<=21){
        activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else{
       activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
  }
function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = " BUST!!";
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;

    while(DEALER['score']< 16 && blackjackGame['isStand']===true){
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
   
    blackjackGame['turnOver'] = true;
    let winner = computerWinner();
    showResult(winner);
    console.log(blackjackGame['turnOver']);
    
}



//update the wins , draws, and losses
function computerWinner(){
    let winner;
    if(YOU['score']<=21){
        //condition : higher score than dealer or when dealer busts but you're 
        if(YOU['score']>DEALER['score'] || (DEALER['score']>21)) {
            blackjackGame['wins']++;
            console.log('You won!');
            winner = YOU;

        }else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            console.log('you lost!');
            winner = DEALER;

        }else if (YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
            console.log('YOU DREW!');
        }

        //condition : when user busts but dealer doesn't
        }else if (YOU['score']>21 && DEALER['score'] <= 21 ){
            blackjackGame['losses']++;
            console.log('YOU lost!');
            winner = DEALER;

        //consition : when you AND the dealer busts
        }else if (YOU['score'] > 21 && DEALER['score'] > 21 ){
            blackjackGame['draws']++;
            console.log('YOU DREW!');
    }
    console.log(blackjackGame);
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackGame['turnOver'] === true){

        if(winner === YOU){
            document.querySelector('#wins').textContent=blackjackGame['wins'];
            message = 'YOU WON!';
            messageColor = 'green';
            winSound.play();

        }else if (winner === DEALER){
            document.querySelector('#losses').textContent=blackjackGame['losses'];
            message = 'YOU LOST!';
            messageColor = 'red';
            lossSound.play();
            
        }else{
            document.querySelector('#draws').textContent=blackjackGame['draws'];
            message ='YOU DREW!';
            messageColor = 'black';
        }

        document.querySelector('#Blackjack-result').textContent = message;
        document.querySelector('#Blackjack-result').style.color = messageColor;
    }
}



