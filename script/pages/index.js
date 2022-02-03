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
  console.log(mainSection);
  recipes.forEach((recipe) => {
    const card = recipeFactory(recipe);
    const tt = card.getRecipeCard();
    mainSection.appendChild(tt);
  });
}
displayRecipes();
