import { initHome, initAllRecipes, initRecipeDetails } from './src/js/cards.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const recipeTitle = document.getElementById('recipe-title');

    if (recipeTitle) {
        initRecipeDetails();
    }
    else if (document.getElementById('all-recipes-container')) {
        initAllRecipes();
    } 
    else {
        const homeContainers = document.querySelectorAll('.recipe-cards');
        if (homeContainers.length > 0) {
            initHome();
        }
    }
});