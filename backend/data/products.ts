type OptionType = "single" | "multiple";

type Option = {
  value: string;
  label: string;
  type: OptionType;
  values: OptionValue[];
};

type OptionValue = {
  label: string;
  value: string;
};

export class Product {
  id: string;
  name: string;
  priceInCents: number;
  options: Option[] = [];
  variants: Product[] = [];
  recipe: Product[] = [];

  constructor(id: string, name: string, priceInCents: number) {
    this.id = id;
    this.name = name;
    this.priceInCents = priceInCents;
  }

  addOption(
    value: string,
    label: string,
    type: OptionType,
    values: OptionValue[]
  ) {
    this.options.push({
      value,
      label,
      type,
      values,
    });
  }

  addVariants(variants: Product[]) {
    this.variants.push(...variants);
  }

  addRecipe(products: Product[]) {
    this.recipe.push(...products);
  }
}

class ProductFactory {
  private id: number = 0;
  private variantId: number = 0;

  constructor() {}

  createProduct(name: string, priceInCents: number) {
    this.id++;
    return new Product(this.id.toString(), name, priceInCents);
  }

  createProductVariant(name: string, priceInCents: number) {
    this.variantId++;
    return new Product("var-" + this.variantId.toString(), name, priceInCents);
  }
}

const productFactory = new ProductFactory();

// BREAKFAST
export const egg_bun = productFactory.createProduct("Egg Bun", 1500);
export const bacon_egg_bun = productFactory.createProduct(
  "Bacon & Egg Bun",
  2800
);
export const breakfast_wrap = productFactory.createProduct(
  "Breakfast Wrap",
  3500
);

// SANDWICHES
export const cheese_sandwich = productFactory.createProduct("Cheese", 2400);
export const cheese_tomato_sandwich = productFactory.createProduct(
  "Cheese & Tomato",
  2600
);
export const chicken_mayo_sandwich = productFactory.createProduct(
  "Chicken Mayo",
  3000
);
export const bacon_cheese_sandwich = productFactory.createProduct(
  "Bacon & Cheese",
  3200
);
export const bacon_egg_cheese_sandwich = productFactory.createProduct(
  "Bacon, Egg & Cheese",
  3400
);

// ROLLS
export const ham_cheese_roll = productFactory.createProduct(
  "Ham & Cheese",
  3000
);
export const chicken_mayo_roll = productFactory.createProduct(
  "Chicken Mayo",
  3000
);

// WRAPS
export const chicken_mayo_wrap = productFactory.createProduct(
  "Chicken Mayo",
  3600
);
export const sweet_chilli_chickent_wrap = productFactory.createProduct(
  "Sweet Chilli Chicken",
  3600
);
export const blt_cheese_wrap = productFactory.createProduct("BLT Cheese", 3600);

// GRILL
export const small_chips = productFactory.createProductVariant(
  "Small Chips",
  1000
);

export const medium_chips = productFactory.createProductVariant(
  "Medium Chips",
  1500
);

export const large_chips = productFactory.createProductVariant(
  "Large Chips",
  2500
);

export const boerewors_roll = productFactory.createProduct(
  "Boerewors Roll",
  3000
);
export const boerewors_roll_chips = productFactory.createProduct(
  "Boerewors Roll & Chips",
  4000
);

boerewors_roll_chips.addRecipe([boerewors_roll, small_chips]);

const beef_burger = productFactory.createProductVariant("Beef Burger", 3800);
const chicken_burger = productFactory.createProductVariant(
  "Chicken Burger",
  3800
);

export const burger = productFactory.createProduct("Burger", 3800);
burger.addVariants([beef_burger, chicken_burger]);

export const beef_burger_chips = productFactory.createProductVariant(
  "Beef Burger & Chips",
  5300
);
beef_burger_chips.addRecipe([beef_burger, small_chips]);

export const chicken_burger_chips = productFactory.createProductVariant(
  "Chicken Burger & Chips",
  4800
);
chicken_burger_chips.addRecipe([chicken_burger, small_chips]);

export const burger_chips = productFactory.createProduct(
  "Burger & Chips",
  4800
);

burger_chips.addVariants([beef_burger_chips, chicken_burger_chips]);

export const chicken_strips = productFactory.createProduct(
  "Chicken Strips",
  3400
);
export const chicken_strips_chips = productFactory.createProduct(
  "Chicken Strips & Chips",
  4400
);
chicken_strips_chips.addRecipe([chicken_strips, small_chips]);

export const chicken_wings = productFactory.createProduct(
  "Chicken Wings",
  3400
);
export const chicken_wings_chips = productFactory.createProduct(
  "Chicken Wings & Chips",
  4400
);
chicken_wings_chips.addRecipe([chicken_wings, small_chips]);

export const chips = productFactory.createProduct("Chips", 2000);

chips.addVariants([small_chips, medium_chips, large_chips]);

// SALAD
export const chicken_honey_mustard_salad = productFactory.createProduct(
  "Chicken Honey Mustard",
  3200
);
export const bacon_feta_salad = productFactory.createProduct(
  "Bacon & Feta",
  3400
);

// COLD DRINKS
export const water = productFactory.createProduct("Water", 1200);
export const water_flavoured_500 = productFactory.createProduct(
  "Water Flavoured 500ml",
  1400
);
export const water_flavoured_750 = productFactory.createProduct(
  "Water Flavoured 750ml",
  1600
);

export const apple_tizer = productFactory.createProductVariant(
  "Apple Tizer",
  1600
);
export const grape_tizer = productFactory.createProductVariant(
  "Grape Tizer",
  1600
);
export const tizer = productFactory.createProduct("Tizer", 1600);
tizer.addVariants([apple_tizer, grape_tizer]);

const coke = productFactory.createProductVariant("Coke", 1600);
const fanta = productFactory.createProductVariant("Fanta", 1600);
const sprite = productFactory.createProductVariant("Sprite", 1600);

export const soft_drinks = productFactory.createProduct("Soft Drinks", 1600);
soft_drinks.addVariants([coke, fanta, sprite]);

export const iced_tea = productFactory.createProduct("Iced Tea", 1600);
export const fruit_juice = productFactory.createProduct("Fruit Juice", 1600);
export const juice_box = productFactory.createProduct("Juice Box", 1200);
export const sports_drink = productFactory.createProduct("Sports Drink", 1600);

// SNACKS
export const crisps = productFactory.createProduct("Crisps", 1000);
export const doritos = productFactory.createProduct("Doritos", 1200);
export const energy_bar = productFactory.createProduct("Energy Bar", 1800);
export const wine_gums = productFactory.createProduct("Wine Gums", 1400);
export const popcorn = productFactory.createProduct("Popcorn", 1200);
export const chocolate = productFactory.createProduct("Chocolate", 1500);
// export const muffin = productFactory.createProduct("Muffin Giant Filled", 2500);

// LUNCH BOX
const cheese_wedge = productFactory.createProductVariant("Cheese Wedge", 0);
const dry_wors = productFactory.createProductVariant("Dry Wors", 0);
const fresh_fruit = productFactory.createProductVariant("Fresh Fruit", 0);

export const cheese_box = productFactory.createProduct("Cheese Box", 4800);
cheese_box.addRecipe([cheese_tomato_sandwich, cheese_wedge, fruit_juice]);

export const meat_box = productFactory.createProduct("Meat Box", 5500);
meat_box.addRecipe([boerewors_roll, dry_wors, fruit_juice]);

export const chicken_box = productFactory.createProduct("Chicken Box", 5800);
chicken_box.addRecipe([chicken_burger, fresh_fruit, fruit_juice]);

export default [
  egg_bun,
  bacon_egg_bun,
  breakfast_wrap,
  cheese_sandwich,
  cheese_tomato_sandwich,
  chicken_mayo_sandwich,
  bacon_cheese_sandwich,
  bacon_egg_cheese_sandwich,
  ham_cheese_roll,
  chicken_mayo_roll,
  chicken_mayo_wrap,
  sweet_chilli_chickent_wrap,
  blt_cheese_wrap,
  boerewors_roll,
  boerewors_roll_chips,
  beef_burger,
  chicken_burger,
  burger,
  beef_burger_chips,
  chicken_burger_chips,
  burger_chips,
  chicken_strips,
  chicken_strips_chips,
  chicken_wings,
  chicken_wings_chips,
  small_chips,
  medium_chips,
  large_chips,
  chips,
  chicken_honey_mustard_salad,
  bacon_feta_salad,
  cheese_box,
  meat_box,
  chicken_box,
  water,
  water_flavoured_500,
  water_flavoured_750,
  apple_tizer,
  grape_tizer,
  tizer,
  coke,
  fanta,
  sprite,
  soft_drinks,
  iced_tea,
  fruit_juice,
  juice_box,
  sports_drink,
  crisps,
  doritos,
  energy_bar,
  wine_gums,
  popcorn,
  chocolate,
  // muffin,
];
