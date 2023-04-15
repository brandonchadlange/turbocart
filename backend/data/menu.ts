import * as products from "./products";
import type { Product } from "./products";

class MenuCategory {
  name: string;
  items: Product[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addProduct(product: Product) {
    this.items.push(product);
  }
}

class Menu {
  id: string;
  name: string;
  slug: string;
  categories: MenuCategory[] = [];

  constructor(id: string, name: string, slug: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }

  addCategory(category: MenuCategory) {
    this.categories.push(category);
  }
}

const breakfast_menu = new Menu("breakfast", "Breakfast", "breakfast");
const first_break_menu = new Menu("first-break", "First Break", "first-break");
const aftercare_menu = new Menu("aftercare", "Aftercare", "after-care");

const breakfast_category = new MenuCategory("Breakfast");
breakfast_category.addProduct(products.egg_bun);
breakfast_category.addProduct(products.bacon_egg_bun);
breakfast_category.addProduct(products.breakfast_wrap);

const sandwich_category = new MenuCategory("Sandwich");
sandwich_category.addProduct(products.cheese_sandwich);
sandwich_category.addProduct(products.cheese_tomato_sandwich);
sandwich_category.addProduct(products.chicken_mayo_sandwich);
sandwich_category.addProduct(products.bacon_cheese_sandwich);
sandwich_category.addProduct(products.bacon_egg_cheese_sandwich);

const rolls_category = new MenuCategory("Rolls");
rolls_category.addProduct(products.ham_cheese_roll);
rolls_category.addProduct(products.chicken_mayo_roll);

const wraps_category = new MenuCategory("Wraps");
wraps_category.addProduct(products.chicken_mayo_wrap);
wraps_category.addProduct(products.sweet_chilli_chickent_wrap);
wraps_category.addProduct(products.blt_cheese_wrap);

const grill_category = new MenuCategory("Grill");
grill_category.addProduct(products.boerewors_roll);
grill_category.addProduct(products.boerewors_roll_chips);
grill_category.addProduct(products.burger);
grill_category.addProduct(products.burger_chips);

const salad_category = new MenuCategory("Salad");
salad_category.addProduct(products.chicken_honey_mustard_salad);
salad_category.addProduct(products.bacon_feta_salad);

const lunch_box_category = new MenuCategory("Lunch Box");
lunch_box_category.addProduct(products.cheese_box);
lunch_box_category.addProduct(products.meat_box);
lunch_box_category.addProduct(products.chicken_box);

const cold_drinks_category = new MenuCategory("Cold Drinks");
cold_drinks_category.addProduct(products.water);
cold_drinks_category.addProduct(products.water_flavoured_500);
cold_drinks_category.addProduct(products.water_flavoured_750);
cold_drinks_category.addProduct(products.tizer);
cold_drinks_category.addProduct(products.soft_drinks);
cold_drinks_category.addProduct(products.iced_tea);
cold_drinks_category.addProduct(products.fruit_juice);
cold_drinks_category.addProduct(products.juice_box);
cold_drinks_category.addProduct(products.sports_drink);

const snacks_category = new MenuCategory("Snacks");
snacks_category.addProduct(products.crisps);
snacks_category.addProduct(products.doritos);
snacks_category.addProduct(products.energy_bar);
snacks_category.addProduct(products.wine_gums);
snacks_category.addProduct(products.popcorn);
snacks_category.addProduct(products.chocolate);
// snacks_category.addProduct(products.muffin);

// ASSIGN CATEGORIES TO MENUS

breakfast_menu.addCategory(breakfast_category);
breakfast_menu.addCategory(snacks_category);
breakfast_menu.addCategory(cold_drinks_category);

first_break_menu.addCategory(sandwich_category);
first_break_menu.addCategory(rolls_category);
first_break_menu.addCategory(wraps_category);
first_break_menu.addCategory(grill_category);
first_break_menu.addCategory(salad_category);
first_break_menu.addCategory(lunch_box_category);
first_break_menu.addCategory(snacks_category);
first_break_menu.addCategory(cold_drinks_category);

aftercare_menu.addCategory(sandwich_category);
aftercare_menu.addCategory(rolls_category);
aftercare_menu.addCategory(wraps_category);
aftercare_menu.addCategory(grill_category);
aftercare_menu.addCategory(salad_category);
aftercare_menu.addCategory(lunch_box_category);
aftercare_menu.addCategory(snacks_category);
aftercare_menu.addCategory(cold_drinks_category);

export default [breakfast_menu, first_break_menu, aftercare_menu];
