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
displayRecipes();

function getInputFilters(type, color) {
  let chevron = document.querySelector(`#chevron-${type.id}`);
  chevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  let input = document.createElement('input');
  input.classList.add('btn', `btn-${color}`);
  input.style.width = '100px';
  type.innerText = '';
  type.appendChild(input);
}

async function createContainerFilter(parent, type) {
  let container = document.createElement('div');
  let firstRow = document.createElement('div');
  firstRow.classList.add('row');
  let inputCol = document.createElement('div');
  inputCol.classList.add('col');
  let input = document.createElement('input');
  let secondRow = document.createElement('div');
  secondRow.classList.add('row');
  let itemCol = document.createElement('div');
  itemCol.classList.add('col');
  let list = document.createElement('ul');
  const recipes = await getRecipes();
  recipes.forEach(async (recipe) => {
    const cardData = recipeFactory(recipe);
    console.log(type);
    console.log(cardData);
  });
  // cardData.forEach(async (element) => {
  //   let listItem = document.createElement('li');
  //   listItem.innerText = element.ingredients;
  //   list.appendChild(listItem);
  // });

  parent.appendChild(container);
  container.appendChild(firstRow);
  firstRow.appendChild(inputCol);
  inputCol.appendChild(input);
  container.appendChild(secondRow);
  secondRow.appendChild(itemCol);
  itemCol.appendChild(list);
}

window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      createContainerFilter(e.target, 'ingredients');
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      break;

    default:
      break;
  }
});

async function test() {
  const recipes = await getRecipes();
  recipes.forEach(async (recipe) => {
    const cardData = recipeFactory(recipe);
    return cardData;
  });
}
