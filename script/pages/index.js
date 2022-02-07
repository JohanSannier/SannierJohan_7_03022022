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
  input.style.width = '100px';
  input.setAttribute('placeholder', `Rechercher un ${type.id}`);
  type.innerText = '';
  type.appendChild(input);
}

async function createContainerFilter(parent, type) {
  let container = document.createElement('div');
  let list = document.createElement('ul');
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
  console.log(array);
  parent.appendChild(container);
  container.appendChild(list);
  createListItem(type);
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
      createContainerFilter(colBtnIngredient, e.target.id);
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      createContainerFilter(colBtnAppliance, e.target.id);
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      createContainerFilter(colBtnUstensil, e.target.id);
      break;

    default:
      break;
  }
});

function createListItem(type) {}

// Init
displayRecipes();
