import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "./";
import { delToken, getToken, isTokenValid } from "../utils";
import { BUN_BTM_URL, BUN_TOP_URL, INGREDIENTS_URL } from "../contants";
import { Ingredient } from "../models";

export const MIN_INGREDIENTS_TO_DISPLAY_REBUILD_BUTTON = 8;

export type BunProps = {
  type: "top" | "bottom";
  className: string;
};

export function Bun({ type, className = "" }: BunProps) {
  const BUNS = {
    top: { alt: "bun top", src: BUN_TOP_URL },
    bottom: { alt: "bun bottom", src: BUN_BTM_URL },
  };
  return (
    <img alt={BUNS[type].alt} className={className} src={BUNS[type].src} />
  );
}

export type BurgerProps = {
  ingredients: Ingredient[];
  onRemove: (ingredient: Ingredient, index: number) => void;
};

export function Burger({ ingredients, onRemove }: BurgerProps) {
  return (
    <>
      <Bun
        type="top"
        className={`relative z-10 ${
          ingredients.length > 0 ? "-mb-6 sm:-mb-8" : ""
        }`}
      />
      <ul className="flex flex-col-reverse space-y-reverse -space-y-8 !sm:-space-y-16">
        {ingredients.map((ingredient, index) => (
          <li
            key={ingredient.id}
            className="relative hover:cursor-pointer hover:scale-105 transition"
            onClick={() => onRemove(ingredient, index)}
          >
            <img
              src={ingredient.url}
              className={`w-full ${ingredient.isPatty ? "-my-4" : ""} ${
                ingredient.isBacon ? "my-2.5" : ""
              } ${ingredient.isEgg ? "-my-2" : ""}`}
            />
          </li>
        ))}
      </ul>
      <Bun
        type="bottom"
        className={ingredients.length > 0 ? "-mt-8 sm:-mt-12" : "mt-8"}
      />
    </>
  );
}

type IngredientCounters = {
  [key: string]: number;
};

type IngredientListProps = {
  ingredients: Ingredient[];
  counters: IngredientCounters;
  onClickIngredient: (ingredient: Ingredient) => void;
};

export function IngredientList({
  ingredients,
  counters,
  onClickIngredient,
}: IngredientListProps) {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {ingredients.map((ingredient) => (
        <li
          onClick={() => onClickIngredient(ingredient)}
          key={ingredient.id}
          className="relative flex items-center transition hover:cursor-pointer hover:bg-orange-100 px-4 py-2 border bg-orange-50 shadow-lg shadow-orange-400/50 border-orange-300 rounded-md"
        >
          <img alt={ingredient.name} src={ingredient.url} className="w-full" />
          <p className="absolute w-full left-0 top-full mt-4 text-center font-semibold text-xl text-orange-600">
            x {counters[ingredient.name] || 0}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function BurgerBuilder() {
  const [addedIngredients, setAddedIngredients] = useState([] as Ingredient[]);
  const [addedIngredientsCounters, setAddedIngredientsCounters] = useState(
    {} as IngredientCounters
  );
  const navigate = useNavigate();
  const query = useQuery(
    ["ingredients"],
    async () => {
      const response = await fetch(INGREDIENTS_URL, {
        headers: { Authorization: "Bearer " + getToken().value },
      });
      if (response.ok) return response.json();
      throw new Error("Network response was not ok");
    },
    { enabled: false }
  );

  useEffect(() => {
    const token = getToken();
    if (isTokenValid(token)) {
      query.refetch();
    } else {
      delToken();
      navigate("/login");
    }
  }, []);

  const ingredients = query.data
    ? query.data.map((ingredient: any) => new Ingredient({ ...ingredient }))
    : [];

  function rebuild() {
    setAddedIngredients([]);
    setAddedIngredientsCounters({});
  }

  function addIngredient(ingredient: Ingredient) {
    setAddedIngredients((added) => [
      ...added,
      new Ingredient({ ...ingredient, id: Date.now() }),
    ]);

    setAddedIngredientsCounters((counters) => ({
      ...counters,
      [ingredient.name]: counters[ingredient.name] + 1 || 1,
    }));
  }

  function delIngredient(ingredient: Ingredient, index: number) {
    setAddedIngredients((added) => [
      ...added.slice(0, index),
      ...added.slice(index + 1),
    ]);

    setAddedIngredientsCounters((counters) => ({
      ...counters,
      [ingredient.name]: counters[ingredient.name] - 1,
    }));
  }

  return (
    <main className="lg:flex lg:flex-row-reverse lg:space-x-reverse lg:space-x-20 pt-4 sm:py-12">
      <div className="flex-1 mb-16 lg:mb-0">
        <h2 className="text-xl font-medium text-orange-600">
          Click to add your favorite ingredients,
        </h2>
        <p className="text-2xl sm:text-3xl font-semibold italic text-orange-600 pt-1.5 pb-6">
          AS MANY AS YOU WANT !
        </p>
        <IngredientList
          ingredients={ingredients}
          counters={addedIngredientsCounters}
          onClickIngredient={addIngredient}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <Burger ingredients={addedIngredients} onRemove={delIngredient} />

        {addedIngredients.length >=
        MIN_INGREDIENTS_TO_DISPLAY_REBUILD_BUTTON ? (
          <Button onClick={rebuild} className="mt-10">
            Rebuild
          </Button>
        ) : null}
      </div>
    </main>
  );
}
