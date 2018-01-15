var numeros = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
var cartes = document.getElementsByClassName('carte');
var premiereCarte = null;
var deuxiemeCarte = null;
var clickInterdit = false;
var nbCoups = 0;
var dateDebut = null;
var timerInterval;

// Creation de la première partie (au chargement de la page)
creerPartie();


function creerPartie() {

  // On mélange les cartes
  melangerCartes(numeros);

  // On retourne toutes les cartes et on ajout l'action du click
  for(i = 0; i < cartes.length; i++) {
    cartes[i].classList.remove('open');
    cartes[i].innerHTML = '';
    cartes[i].carteIndex = i;
    cartes[i].addEventListener('click', clickCarte);
  }

  // On initialise le timer
  dateDebut = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);

  // On initialise le nombre de coups
  nbCoups = 0;
  mettreAJourScore(nbCoups)
  
  // On attache les actions aux boutons
  document.getElementById('newgame').addEventListener('click', creerPartie);
  document.getElementById('solution').addEventListener('click', voirSolution);
}

// @copier/coller d'une fonction trouvé sur le google 
function melangerCartes(tableau) {
  var currentIndex = tableau.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = tableau[currentIndex];
    tableau[currentIndex] = tableau[randomIndex];
    tableau[randomIndex] = temporaryValue;
  }

  return tableau;
}

function clickCarte() {
  var carte = this;

  // Si le clic est bloqué, on ne fait rien
  if(clickInterdit) {
    return;
  }

  // On affiche la carte cliquée
  afficherCarte(carte);

  // Si c'est la première, on la stocke
  if(premiereCarte === null) {
    premiereCarte = carte;
  }
  // Sinon, on stock la deuxième, on bloque le clic et on met à jour le nombre
  // de coups et on compare les cartes retournées
  else {
    deuxiemeCarte = carte;
    clickInterdit = true;
    mettreAJourScore(++nbCoups);
    
    if(!comparerCarte(premiereCarte, deuxiemeCarte)) {
      
      // Les cartes sont différentes, on met en place un timeOut qui masquera
      // les cartes 1 seconde plus tard
      setTimeout(masquerCartes, 1000, premiereCarte, deuxiemeCarte);
    }
    else {
      
      // Les cartes sont les mêmes, on réactive le clic et on laisse ces cartes
      // affichées mais non cliquables
      clickInterdit = false;
      premiereCarte.removeEventListener('click', clickCarte);
      deuxiemeCarte.removeEventListener('click', clickCarte);

      // On regarde si il reste des cartes à retourner ou si le jeu est fini
      var gagne = true;
      for(i = 0; i < cartes.length; i++) {
        if(cartes[i].classList.length === 1) {
          gagne = false;
        }
      }
      
      // Si c'est fini, c'est gagné
      if(gagne) {
        clearInterval(timerInterval);
        alert('Bravo ! ');
      }
    }

    // On remets les cartes retournées à null
    premiereCarte = null;
    deuxiemeCarte = null;
  }
}

function masquerCartes(carteA, carteB) {
  // On masque les 2 cartes
  masquerCarte(carteA);
  masquerCarte(carteB);

  // On autorise le clic à nouveau
  clickInterdit = false;
}

function afficherCarte(carte) {
  // On affecte la valeur de la carte
  carte.innerHTML = numeros[carte.carteIndex];
  // On rajoute un classe open sur la carte pour le style
  carte.classList.add('open');
}

function masquerCarte(carte) {
  // On retire la valeur de la carte
  carte.innerHTML = '';
  // On retire la class open sur la carte
  carte.classList.remove('open');
}

function voirSolution() {
  // On affiche toutes les cartes
  for(i = 0; i < cartes.length; i++) {
    afficherCarte(cartes[i]);
  }
  // On stoppe le timer
  clearInterval(timerInterval);
}

function comparerCarte(carteA, carteB) {
  // On retourne "true" si les cartes sont les mêmes sinon "false"
  return carteA.innerHTML == carteB.innerHTML;
}

function mettreAJourScore(nbCoups) {
  // On met à jour le nombre de coups sur dans le DOM
  document.getElementById('score').innerHTML = nbCoups;
}

function updateTimer() {
  // On récupère la date du jour
  var now = new Date().getTime();
  
  // On prend la différence avec "dateDebut"
  var diff = now - dateDebut;
  
  // On met à jour le nombre de coups sur dans le DOM
  document.getElementById('timer').innerHTML = formatTimer(diff);
}

// @copier/coller d'une fonction trouvé sur le google 
function formatTimer(mill) {
    sec_num = Math.round(mill / 1000);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
