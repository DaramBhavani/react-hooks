import React, { useEffect, useState, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get there!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // initial state for our application
  // const [userIngredients, setUserIngredients] = useState([
  //   { id: 1, title: 'Bhavani', amount: 20 },
  //   { id: 14, title: 'Rakesh', amount: 345 }
  // ]);
  console.log('userING', userIngredients);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


  // useEffect(() => {
  //   fetch('https://react-hooks-376fb.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       console.log(responseData);
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     })
  // }, []);


  const filterIngredientsHandler = useCallback(filteredIngredients => {
    console.log('FI', filteredIngredients);
    //setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, []);


  // this will be executed when child component calls with the title, amount as ingrident object
  const addIngredientHandler = ingredient => {
    console.log('inside parent add ingredient', ingredient);
    setIsLoading(true);
    fetch('https://react-hooks-376fb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients =>
      //   [
      //     ...prevIngredients, // create a new array
      //     { id: responseData.name, ...ingredient } // add the new ingrident
      //   ]
      // );
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    })
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-376fb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(response => {
        setIsLoading(false);
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
        dispatch({ type: 'DELETE', id: ingredientId })
      }).catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  }


  return (
    <div className="App" style={{ "border": "6px solid red" }}>

      {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />

      </section>
    </div >
  );
}

export default Ingredients;
