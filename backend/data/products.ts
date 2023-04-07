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
}

// BREAKFAST
export const egg_bun = new Product("1", "Egg Bun", 1500);
export const bacon_egg_bun = new Product("2", "Bacon & Egg Bun", 2800);
export const breakfast_wrap = new Product("3", "Breakfast Wrap", 3500);

// SANDWICHES
export const cheese_sandwich = new Product("4", "Cheese", 2400);
export const cheese_tomato_sandwich = new Product("5", "Cheese & Tomato", 2600);
export const chicken_mayo_sandwich = new Product("6", "Chicken Mayo", 3000);
export const bacon_cheese_sandwich = new Product("7", "Bacon & Cheese", 3200);
export const bacon_egg_cheese_sandwich = new Product(
  "8",
  "Bacon, Egg & Cheese",
  3400
);

// ROLLS
export const ham_cheese_roll = new Product("9", "Ham & Cheese", 3600);
export const chicken_mayo_roll = new Product("10", "Chicken Mayo", 3000);

// WRAPS
export const chicken_mayo_wrap = new Product("11", "Chicken Mayo", 3600);
export const sweet_chilli_chickent_wrap = new Product(
  "12",
  "Sweet Chilli Chicken",
  3600
);
export const blt_cheese_wrap = new Product("13", "BLT Cheese", 3600);

// GRILL
export const boerewors_roll = new Product("14", "Boerewors Roll", 3000);
export const boerewors_roll_chips = new Product(
  "15",
  "Boerewors Roll & Chips",
  30
);
export const burger = new Product("16", "Burger", 3000);

burger.addOption("type", "Type", "single", [
  {
    label: "Beef",
    value: "beef",
  },
  {
    label: "Chicken",
    value: "chicken",
  },
]);

export const burger_chips = new Product("17", "Burger & Chips", 5300);

burger_chips.addOption("type", "Type", "single", [
  {
    label: "Beef",
    value: "beef",
  },
  {
    label: "Chicken",
    value: "chicken",
  },
]);

burger_chips.addOption("extras", "Extras", "multiple", [
  {
    label: "Cheese",
    value: "cheese",
  },
  {
    label: "Bacon",
    value: "bacon",
  },
]);

export const chicken_strips = new Product("18", "Chicken Strips", 3400);
export const chicken_strips_chips = new Product(
  "19",
  "Chicken Strips & Chips",
  4800
);
export const chicken_wings = new Product("20", "Chicken Wings", 3400);
export const chicken_wings_chips = new Product(
  "21",
  "Chicken Wings & Chips",
  4800
);

export const chips = new Product("22", "Boerewors Roll & Chips", 3000);

chips.addOption("size", "Size", "single", [
  {
    label: "Large",
    value: "large",
  },
  {
    label: "Small",
    value: "small",
  },
]);

// SALAD
export const chicken_honey_mustard_salad = new Product(
  "23",
  "Chicken Honey Mustard",
  3000
);
export const bacon_feta_salad = new Product("24", "Bacon & Feta", 3200);

// LUNCH BOX
export const cheese_box = new Product("25", "Cheese Box", 4800);
export const meat_box = new Product("26", "Meat Box", 5500);
export const chicken_box = new Product("27", "Chicken Box", 5800);

// COLD DRINKS
export const water = new Product("28", "Water", 1200);
export const water_flavoured_500 = new Product(
  "29",
  "Water Flavoured 500ml",
  1400
);
export const water_flavoured_750 = new Product(
  "30",
  "Water Flavoured 750ml",
  1600
);
export const tizer = new Product("31", "Tizer", 1600);
export const assorted_cans = new Product("32", "Assorted Cans", 1600);
export const iced_tea = new Product("33", "Iced Tea", 1600);
export const fruit_juice = new Product("34", "Fruit Juice", 1600);
export const juice_box = new Product("35", "Juice Box", 1200);
export const sports_drink = new Product("36", "Juice Box", 1200);

// SNACKS
export const crisps = new Product("37", "Crisps", 1000);
export const doritos = new Product("38", "Doritos", 1200);
export const energy_bar = new Product("39", "Energy Bar", 1800);
export const wine_gums = new Product("40", "Wine Gums", 1200);
export const popcorn = new Product("41", "Popcorn", 1200);
export const chocolate = new Product("42", "Chocolate", 1500);
export const muffin = new Product("43", "Muffin Giant Filled", 2500);

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
  burger,
  burger_chips,
  chicken_strips,
  chicken_strips_chips,
  chicken_wings,
  chicken_wings_chips,
  chips,
  chicken_honey_mustard_salad,
  bacon_feta_salad,
  cheese_box,
  meat_box,
  chicken_box,
  water,
  water_flavoured_500,
  water_flavoured_750,
  tizer,
  assorted_cans,
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
  muffin,
];

// export default [
//   {
//     id: "1",
//     name: "Yoghurt Cup (150ml)",
//     priceInCents: 1500,
//   },
//   {
//     id: "2",
//     name: "Bacon & Egg Bun",
//     priceInCents: 2800,
//   },
//   {
//     id: "3",
//     name: "Breakfast Wrap",
//     priceInCents: 3500,
//   },
//   {
//     id: "4",
//     name: "Cheese & Tomato",
//     priceInCents: 2200,
//   },
//   {
//     id: "4",
//     name: "Cheese & Tomato",
//     priceInCents: 2200,
//   },
//   {
//     id: "5",
//     name: "Chicken Mayo",
//     priceInCents: 2800,
//   },
//   {
//     id: "6",
//     name: "Bacon, Egg & Cheese",
//     priceInCents: 3000,
//   },
// ];
