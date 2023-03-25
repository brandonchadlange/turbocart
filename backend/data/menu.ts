export default [
  {
    id: "first-break",
    name: "First Break",
    slug: "first-break",
    categories: [
      {
        name: "Breakfast",
        items: [
          {
            id: "1",
            name: "Yoghurt Cup (150ml)",
            priceInCents: 1500,
            options: [
              {
                value: "extras",
                label: "Extras",
                type: "multiple",
                values: [
                  {
                    label: "Muesli",
                    value: "muesli",
                  },
                  {
                    label: "Fruit",
                    value: "fruit",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            name: "Bacon & Egg Bun",
            priceInCents: 2700,
          },
          {
            id: "3",
            name: "Breakfast Wrap",
            priceInCents: 3000,
          },
        ],
      },
      {
        name: "Sandwiches",
        items: [
          {
            id: "4",
            name: "Cheese & Tomato",
            priceInCents: 2200,
            options: [
              {
                value: "sauce",
                label: "Sauce",
                type: "single",
                values: [
                  {
                    label: "None",
                    value: "none",
                  },
                  {
                    label: "Tomato Sauce",
                    value: "tomato sauce",
                  },
                ],
              },
            ],
          },
          {
            id: "5",
            name: "Chicken Mayo",
            priceInCents: 2800,
          },
          {
            id: "6",
            name: "Bacon, Egg & Cheese",
            priceInCents: 3000,
          },
        ],
      },
    ],
  },
  {
    id: "aftercare",
    name: "Aftercare",
    slug: "aftercare",
    categories: [
      {
        name: "Sandwiches",
        items: [
          {
            id: "4",
            name: "Cheese & Tomato",
            priceInCents: 2200,
          },
          {
            id: "5",
            name: "Chicken Mayo",
            priceInCents: 2800,
          },
          {
            id: "6",
            name: "Bacon, Egg & Cheese",
            priceInCents: 3000,
          },
        ],
      },
    ],
  },
];
