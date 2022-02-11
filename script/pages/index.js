const colBtnIngredient = document.querySelector('#col-btn-ingredients');
const colBtnAppliance = document.querySelector('#col-btn-appliance');
const colBtnUstensil = document.querySelector('#col-btn-ustensil');
const IngredientsArray = [];
const AppliancesArray = [];
const UstensilsArray = [];

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
  const mainSection = document.getElementById('main-section');
  recipes.forEach(async (recipe) => {
    const cardData = recipeFactory(recipe);
    const createCard = cardData.getRecipeCard();
    mainSection.appendChild(createCard);
  });
}

function getInputFilters(type, color) {
  let chevron = document.querySelector(`#chevron-${type.id}`);
  chevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  let input = document.createElement('input');
  input.classList.add('btn', `btn-${color}`);
  const dataName = type.getAttribute('data-name');
  input.setAttribute('placeholder', `Rechercher un ${dataName}`);
  input.classList.add('text-white');
  input.setAttribute('id', `input-${color}`);
  type.innerText = '';
  // let parentCol = type.parentNode.parentNode;
  type.appendChild(input);
}

async function createContainerFilter(parent, type, color) {
  let container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '40vh';
  container.style.overflow = 'scroll';
  container.classList.add(`bg-${color}`);
  let list = document.createElement('ul');
  list.classList.add('main-ul', 'd-flex', 'flex-wrap');
  list.classList.add('list-unstyled');
  const recipes = await getRecipes();

  recipes.forEach(async (recipe) => {
    recipe.ingredients.forEach((element) => {
      IngredientsArray.push(element.ingredient);
    });
    AppliancesArray.push(recipe.appliance);
    recipe.ustensils.forEach((element) => {
      UstensilsArray.push(element);
    });
  });

  const array = createFilteredArray(type);
  array.forEach((element) => {
    let liste = document.createElement('li');
    liste.classList.add('main-list', 'w-33');
    liste.innerText = element;
    list.appendChild(liste);
  });
  parent.appendChild(container);
  container.appendChild(list);
}

// Création de la fonction qui récupère les ingrédients, appareils et ustensils et les classe dans un nouveau tableau sans doublon
function createFilteredArray(type) {
  switch (type) {
    case 'ingredients':
      const filteredIngredientsArray = IngredientsArray.filter(
        (element, pos) => IngredientsArray.indexOf(element) == pos
      );
      return filteredIngredientsArray;
    case 'appliance':
      const filteredAppliancesArray = AppliancesArray.filter(
        (element, pos) => AppliancesArray.indexOf(element) == pos
      );
      return filteredAppliancesArray;
    case 'ustensil':
      const filteredUstensilsArray = UstensilsArray.filter(
        (element, pos) => UstensilsArray.indexOf(element) == pos
      );
      return filteredUstensilsArray;

    default:
      break;
  }
}

// Gestion des évènements de création des filtres au clic sur les boutons de filtres
window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      createContainerFilter(colBtnIngredient, e.target.id, 'primary');
      break;
    case 'chevron-ingredients':
      getInputFilters(e.target.previousElementSibling, 'primary');
      createContainerFilter(
        colBtnIngredient,
        e.target.previousElementSibling.id,
        'primary'
      );
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      createContainerFilter(colBtnAppliance, e.target.id, 'success');
      break;
    case 'chevron-appliance':
      getInputFilters(e.target.previousElementSibling, 'success');
      createContainerFilter(
        colBtnAppliance,
        e.target.previousElementSibling.id,
        'success'
      );
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      createContainerFilter(colBtnUstensil, e.target.id, 'danger');
      break;
    case 'chevron-ustensil':
      getInputFilters(e.target.previousElementSibling, 'danger');
      createContainerFilter(
        colBtnUstensil,
        e.target.previousElementSibling.id,
        'danger'
      );
      break;
    default:
      break;
  }
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'input-primary':
      beginFiltering('ingredients', e);
      break;
    case 'input-success':
      beginFiltering('appliance', e);
      break;
    case 'input-danger':
      beginFiltering('ustensil', e);
      break;

    default:
      break;
  }
});

function beginFiltering(type, e) {
  if (e.target.value.length >= 3) {
    const filteredIngredients = createFilteredArray(type);
    filteredIngredients.forEach((element) => {
      if (e.target.value == element) {
        console.log(element);
      }
    });
  }
}

// Init
displayRecipes();
