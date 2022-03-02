const colBtnIngredient = document.querySelector('#col-btn-ingredients');
const containerIngredients = document.querySelector('#container-ingredients');
const colBtnAppliance = document.querySelector('#col-btn-appliance');
const containerAppliances = document.querySelector('#container-appliances');
const colBtnUstensil = document.querySelector('#col-btn-ustensil');
const containerUstensils = document.querySelector('#container-ustensils');
const tagsContainer = document.querySelector('#tags-container');
const filterButtons = document.getElementsByClassName('advanced-filters');
const totalContainerFilter = [
  containerIngredients,
  containerAppliances,
  containerUstensils,
];
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const mainContainer = document.querySelector('#main-container');
const invalidSearchInput = document.querySelector('#invalid-search');
const inputAdvancedFilters = document.getElementsByClassName(
  'input-advanced-filters'
);
let IngredientsArray = [];
let AppliancesArray = [];
let UstensilsArray = [];
let onLoadIngredientsArray = [];
let onLoadAppliancesArray = [];
let onLoadUstensilsArray = [];
let allRecipes = [];

async function getRecipes() {
  let url = '../data/recipes.json';
  try {
    let res = await fetch(url);
    let json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function displayRecipes() {
  const recipes = await getRecipes();
  recipes.forEach(async (recipe) => {
    const cardData = recipeFactory(recipe);
    const createCard = cardData.getRecipeCard();
    mainSection.appendChild(createCard);
  });
}

// Création d'un input à l'intérieur du span
function getInputFilters(type, color) {
  let input = document.createElement('input');
  input.classList.add('btn', `btn-${color}`);
  const dataName = type.getAttribute('data-name');
  input.setAttribute('placeholder', `Rechercher un ${dataName}`);
  input.classList.add('text-white', 'p-0', 'input-advanced-filters');
  input.setAttribute('id', `input-${color}`);
  type.innerText = '';
  type.appendChild(input);
  let spanParent = input.parentElement;
  let btnParent = spanParent.parentElement;
  btnParent.classList.remove('px-4');
  input.focus();
}

function checkInputFilters(e) {
  // if (inputAdvancedFilters.length == 0) return;
  let itemsContainer;
  let nb;
  switch (e.target.id) {
    case 'input-primary':
      itemsContainer = document.getElementById(
        'container-ingredients'
      ).firstChild;
      break;
    case 'input-success':
      itemsContainer = document.getElementById(
        'container-appliances'
      ).firstChild;
      break;
    case 'input-danger':
      itemsContainer = document.getElementById(
        'container-ustensils'
      ).firstChild;
      break;

    default:
      break;
  }

  if (itemsContainer && itemsContainer.children.length != 0) {
    let value = e.target.value;
    let items = itemsContainer.childNodes;
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      let txtValue = element.innerText;
      let txtValueAlt = lowerCaseFirstLetter(txtValue);
      if (txtValue.indexOf(value) > -1 || txtValueAlt.indexOf(value) > -1) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    }
  }
}

// Création et injection des items de filtres avancés
async function injectAllAdvancedFilters(array, parent) {
  let i = 0;
  parent.forEach((childContainer) => {
    childContainer.firstChild.innerHTML = '';
    const type = childContainer.className.substr(20);
    const correctType = type.split(' ')[0];
    for (let index = 0; index < array[i].length; index++) {
      const element = array[i][index];
      let liste = document.createElement('li');
      liste.classList.add('main-list', 'w-33');
      liste.setAttribute('data-color', correctType);
      liste.innerText = element;
      childContainer.firstChild.appendChild(liste);
    }
    i++;
  });
}

// Gestion des évènements de création des filtres au clic sur les boutons de filtres avancés
window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      break;
    case 'chevron-ingredients':
      changeDisplay(containerIngredients);
      getAllDataFilter();
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      break;
    case 'chevron-appliance':
      changeDisplay(containerAppliances);
      getAllDataFilter();
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      break;
    case 'chevron-ustensil':
      changeDisplay(containerUstensils);
      getAllDataFilter();
      break;
    default:
      break;
  }
  switch (e.target.classList.value) {
    case 'bi bi-x-circle':
      tagsContainer.removeChild(e.target.parentNode);
      break;

    default:
      break;
  }
  advancedFiltering(e);
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'searchbar':
      // Fonction qui déclenche le filtre sur la barre principale et qui affiche les résultats correspondant sur la page
      mainFilter();
      // Fonction qui appelle les tableaux d'ingrédients, d'appareils et d'ustensils dans les filtres avancés
      injectAllAdvancedFilters(
        [IngredientsArray, AppliancesArray, UstensilsArray],
        [containerIngredients, containerAppliances, containerUstensils]
      );
      break;
  }
  checkInputFilters(e);
});

function checkTags() {
  let allTags = document.getElementsByClassName('tag');
  console.log(allTags);
  [...allTags].forEach((tag) => {
    // Je dois filtrer les cartes en cherchant le texte du tag dans un des 3 tableaux selon la couleur du tag
    let tagColor = tag.getAttribute('data-color');
    let targetSearch;
    // Avant d'être injecté les recipe sont des objets donc il faut que je les récupère pour ensuite chercher dans les ingrédients etc en fonction de la couleur donc il me faut un tableau des objets des cartes actuellement affichées sur la page
    switch (tagColor) {
      case 'primary':
        console.log('ok');
        console.log();
        break;
      case 'success':
        console.log('2');
        break;
      case 'danger':
        break;

      default:
        break;
    }
  });
}

// Fonction pour la recherche principale
async function mainFilter() {
  let inputLength = searchbar.value.length;
  let input = searchbar.value;
  let recipes = await getRecipes();
  if (inputLength >= 3) {
    // On efface les recettes avant de lancer la boucle pour que les informations soient actualisées
    clearContent();
    recipes.forEach(async (recipe) => {
      // Compteur pour itérer sur chaque ingrédient d'une recette
      let i = 0;
      capitalizedFirstLetterInput = capitalizeFirstLetter(input);
      if (
        // Si l'input est retrouvé parmi le titre, la description ou les ingrédients d'une recette
        recipe.name.indexOf(input) != -1 ||
        recipe.name.indexOf(capitalizedFirstLetterInput) != -1 ||
        recipe.description.includes(capitalizedFirstLetterInput) ||
        recipe.description.includes(input) ||
        recipe.ingredients[i].ingredient.includes(
          capitalizedFirstLetterInput
        ) ||
        recipe.ingredients[i].ingredient.includes(input)
      ) {
        // Si la carte n'est pas déjà injectée dans le DOM, je l'injecte dans le DOM
        if (mainSection.children.length == 0) {
          injectCard(recipe);
          populateRecipeArray(recipe);
        } else {
          // Si il y a déjà des cartes de recettes dans le DOM
          // Utilisation d'un compteur pour vérifier si la recette a déjà été injectée dans le DOM
          let score = 0;
          for (let index = 0; index < mainSection.children.length; index++) {
            // Boucle sur chacune des cartes de recettes déjà ajoutées et incrémentation du score pour détecter les doublons
            const child = mainSection.children[index];
            if (child.getAttribute('data-id') == recipe.id) {
              score++;
            }
          }
          if (score == 0) {
            // Si il n'y a pas de doublons et que le score est toujours à 0, j'injecte la carte de la recette et j'ajoute les données aux filtres avancés avant de remettre à zéro le score
            injectCard(recipe);
            populateArray(recipe);
            populateRecipeArray(recipe);
            score = 0;
          }
        }
      } else {
        invalidSearch();
      }
      i++;
    });
  } else {
    clearContent();
    if (inputLength == 0) {
      displayRecipes();
    }
  }
}

// Fonction pour injecter une carte de recette dans le DOM
function injectCard(recipe) {
  const cardData = recipeFactory(recipe);
  const createCard = cardData.getRecipeCard();
  mainSection.appendChild(createCard);
}

// Fonction qui affiche un message d'erreur à l'utilisateur en cas de critères de recherche invalides
function invalidSearch() {
  if (mainSection.children.length == 0) {
    invalidSearchInput.classList.replace('d-none', 'd-inline');
  } else if (
    invalidSearchInput.classList.contains('d-inline') &&
    mainSection.children.length != 0
  ) {
    invalidSearchInput.classList.replace('d-inline', 'd-none');
  }
}

// Fonction pour remplir les tableaux d'ingrédients, ustensils et appareils
function populateArray(recipe) {
  recipe.ingredients.forEach((ingredient) => {
    if (IngredientsArray.indexOf(ingredient.ingredient) == -1) {
      IngredientsArray.push(ingredient.ingredient);
    }
  });
  recipe.ustensils.forEach((ustensil) => {
    if (UstensilsArray.indexOf(ustensil) == -1) {
      UstensilsArray.push(ustensil);
    }
  });
  if (AppliancesArray.indexOf(recipe.appliance) == -1) {
    AppliancesArray.push(recipe.appliance);
  }
}

// Fonction pour récupérer les objets des recettes injectées dans le DOM
function populateRecipeArray(recipe) {
  let score = 0;
  if (allRecipes.length == 0) {
    allRecipes.push(recipe);
  }
  if (allRecipes.length >= 1) {
    allRecipes.forEach((element) => {
      if (element.id == recipe.id) {
        score++;
      }
    });
  }
  if (score == 0) {
    allRecipes.push(recipe);
  }
}

// Fonction pour obtenir tous les ingrédients, ustensils et appareils dès le chargement de la page
async function populateOnLoad() {
  let recipes = await getRecipes();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (onLoadIngredientsArray.indexOf(ingredient.ingredient) == -1) {
        onLoadIngredientsArray.push(ingredient.ingredient);
      }
    });
    recipe.ustensils.forEach((ustensil) => {
      if (onLoadUstensilsArray.indexOf(ustensil) == -1) {
        onLoadUstensilsArray.push(ustensil);
      }
    });
    if (onLoadAppliancesArray.indexOf(recipe.appliance) == -1) {
      onLoadAppliancesArray.push(recipe.appliance);
    }
  });
}

async function getAllDataFilter() {
  let data = await populateOnLoad();
  if (searchbar.value.length == 0) {
    injectAllAdvancedFilters(
      [onLoadIngredientsArray, onLoadAppliancesArray, onLoadUstensilsArray],
      [containerIngredients, containerAppliances, containerUstensils]
    );
  }
}

// Fonction pour sélectionner les tags sur les filtres
async function advancedFiltering(e) {
  // Je récupère l'attribut data-color pour obtenir le style correct du tag si c'est un ingrédient, appareil ou un ustensil
  if (e.target.classList.contains('main-list')) {
    // Si il n'y a aucun tag sélectionné je créé un tag
    if (tagsContainer.children.length == 0) {
      createTag(e);
    } else {
      // Sinon, pour chaque tag sélectionné, je vérifie si le le tag sur lequel j'ai cliqué est déjà affiché
      let scoreTag = 0;
      for (let index = 0; index < tagsContainer.children.length; index++) {
        const element = tagsContainer.children[index];
        if (e.target.innerText == element.firstChild.innerText) {
          scoreTag++;
        }
      }
      // Si le score est à 0 et donc que le tag n'a pas été sélectionné avant, je créé le tag
      if (scoreTag == 0) {
        createTag(e);
      }
    }
  }
}

// Fonction qui créé le tag du filtre
function createTag(e) {
  switch (e.target.getAttribute('data-color')) {
    case 'primary':
      color = 'primary';
      break;
    case 'success':
      color = 'success';
      break;
    case 'danger':
      color = 'danger';
      break;

    default:
      break;
  }
  let tagWrapper = document.createElement('div');
  tagWrapper.classList.add(
    'tag-wrapper',
    'd-inline-flex',
    'me-4',
    `bg-${color}`,
    'p-2',
    'rounded',
    'text-white',
    'mb-3'
  );
  let tag = document.createElement('span');
  tag.classList.add('me-3', 'tag');
  tag.setAttribute('data-color', color);
  tag.innerText = e.target.innerText;
  let deleteTag = document.createElement('i');
  deleteTag.classList.add('bi', 'bi-x-circle');
  tagWrapper.appendChild(tag);
  tagWrapper.appendChild(deleteTag);
  tagsContainer.appendChild(tagWrapper);
}

// Fonction qui filtre l'input de l'utilisateur et renvoie les données correspondantes
function filtreTexte(arr, requete) {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(requete.toLowerCase()) !== -1
  );
}

// Fonction pour mettre en majuscule la première lettre d'une chaine de caractère
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fonction pour mettre en minuscule la première lettre d'une chaine de caractère
function lowerCaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// Fonction pour permettre d'ajouter ou de supprimer l'input des filtres au clic sur le chevron du bouton
function getTargetGenealogy(e) {
  let displayedContainer = document.querySelector(
    `#container-${e.target.previousElementSibling.id}`
  );
  e.target.parentNode.parentNode.removeChild(displayedContainer);
  e.target.previousElementSibling.removeChild(
    e.target.previousElementSibling.firstChild
  );
  e.target.previousElementSibling.innerText = capitalizeFirstLetter(
    e.target.previousElementSibling.id
  );
}

// Fonction pour faire apparaître les filtres avancés
function changeDisplay(target) {
  let activeFilter = document.querySelector('.active-filter');
  let newChevron = target.previousElementSibling.children[1];
  let btnParent = target.previousElementSibling;
  // if (target.firstChild.children.length == 0) {
  //   alert('Veuillez effectuer une recherche correcte au préalable');
  //   return;
  // }
  if (target.classList.contains('active-filter') && target == activeFilter) {
    target.classList.remove('active-filter');
    btnParent.classList.remove('border-fix');
    newChevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
  } else if (
    totalContainerFilter.some((element) =>
      element.classList.contains('active-filter')
    )
  ) {
    let oldChevron = activeFilter.previousElementSibling.children[1];
    oldChevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
    activeFilter.previousElementSibling.classList.remove(
      'border-fix',
      'active-width'
    );
    activeFilter.parentNode.classList.remove('active-width');
    activeFilter.classList.remove('active-filter');
    target.classList.add('active-filter');
    btnParent.classList.add('border-fix');
    newChevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  } else {
    target.classList.add('active-filter');
    btnParent.classList.add('border-fix');
    newChevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  }
}

// Fonction pour effacer le contenu des recettes sur la page
function clearContent() {
  mainSection.innerText = '';
  IngredientsArray = [];
  UstensilsArray = [];
  AppliancesArray = [];
  allRecipes = [];
}

// Initialisation de la page
displayRecipes();
