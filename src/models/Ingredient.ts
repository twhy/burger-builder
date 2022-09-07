import { IMG_SVR_URL } from '../contants'

export type IngredientAttributes = {
  id: string | number
  src: string
  name: string
}

export default class Ingredient {
  id: string | number;
  name: string;
  src: string;

  constructor({ id, src, name }: IngredientAttributes) {
    this.id = id;
    this.src = src;
    this.name = name;
  }

  get url() {
    return `${IMG_SVR_URL}/${this.src}`
  }

  get isEgg() {
    return this.name.toLowerCase().includes('egg')
  }

  get isBacon() {
    return this.name.toLowerCase().includes('bacon')
  }

  get isPatty() {
    return this.name.toLowerCase().includes('patty')
  }
}