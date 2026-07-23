


export interface TableRow {
  category: string;
  price: string;
  delivery: string;
  note: string;
  hasCloseIcon?: boolean;
}

export const  containerDelivery= {
  
    container: {
    tariffs: [
      {
        id: "kazakhstan",
        country: "Казахстан",

        columns: [
          "Категория",
          "Тариф, $ / кг",
          "Срок доставки*",
          "Другие регионы",
        ],

        rows: [
          {
            category: "Одежда, обувь, хозтовары, снеки",
            price: "4.5",
            delivery: "12–16 дней",
            note: "+1 $/кг к тарифу\n2–5 дней",
          },
          {
            category: "Косметика",
            price: "от 1.8 (в зависимости от веса)",
            delivery: "12–16 дней",
            note: "+1 $/кг к тарифу\n2–5 дней",
          },
          {
            category: "БАДы, витамины",
            price: "от 3",
            delivery: "12–16 дней",
            note: "+1 $/кг к тарифу\n2–5 дней",
          },
          {
            category: "Автозапчасти",
            price: "от 4",
            delivery: "12–16 дней",
            note: "+1 $/кг к тарифу\n2–5 дней",
          },
          {
            category: "Габаритный груз",
            price: "Объем / 5000",
            delivery: "12–16 дней",
            note: "+1 $/кг к тарифу\n2–5 дней",
          },
        ],

        notes: [
          "Минимальный вес: 10 кг",
          "Сроки указаны с момента выхода судна из Кореи",
          "Погрузки осуществляются еженедельно по четвергам (прием груза за день до отправки)",
        ],
      },

      {
        id: "kyrgyzstan",
        country: "Кыргызстан",
         columns: [
          "Категория",
          "Тариф, $ / кг",
          "Срок доставки*",
          "Минимальный вес партии",
        ],
         rows: [
           {
    category: "Косметика",
    price: "4",
    delivery: "20-25 дней",
    note: "10кг",
    hasCloseIcon: false,
  },
  

          {
            category: "Витамины",
            price: "6",
            delivery: "20-25 дней",
            note: "10кг",
    hasCloseIcon: false,
    },

    {
            category: "Автозапчасти",
            price: "4,5",
            delivery: "20-25 дней",
            note: "10кг",
    hasCloseIcon: false,
    },

     {
            category: "Одежда",
            price: "6",
            delivery: "20-25 дней",
            note: "10кг",
    hasCloseIcon: false,
    },

     {
            category: "Личные вещи",
            price: "7",
            delivery: "20-25 дней",
            note: "10кг",
    hasCloseIcon: false,
    },

     {
            category: "Носки",
            price: "4",
            delivery: "20-25 дней",
            note: "10кг",
    hasCloseIcon: false,
    },
  
        ],
        notes: [
          "Минимальный вес: 10 кг",
          "Сроки указаны с момента выхода судна из Южной Кореи",
        ],
      },

      {
        id: "russia",
        country: "Россия",
        columns: [
          "Категория",
          "Тариф до Москвы, $ / кг",
          "Срок доставки*",
          "Другие регионы",
        ],
        rows: [
          {
            category: "Одежда, обувь, хозтовары, снеки",
            price: "7",
            delivery: "30-35 дней",
            note: "+0.5-1 $/кг к тарифу",
          },
          {
            category: "Косметика",
            price: "от 6 (в зависимости от веса)",
            delivery: "30-35 дней",
            note: "+0.5-1 $/кг к тарифу",
          },
          {
            category: "БАДы, витамины",
            price: "7",
            delivery: "30-35 дней",
            note: "+0.5-1 $/кг к тарифу",
          },
          {
            category: "Автозапчасти",
            price: "от 6",
            delivery: "30-35 дней",
            note: "+0.5-1 $/кг к тарифу",
          },
        ],
        notes: [
          "Минимальный вес: 10 кг",
          "Сроки указаны с момента выхода судна из Южной Кореи",
          "Погрузки осуществляются еженедельно, по четвергам (прием груза за день до отправки)",
        ],
      },
    ],    
  

    comparison: {
      title: "Какой способ доставки выбрать?",

      columns: [
        "",
        "Авиа",
        "Контейнер",
      ],

      rows: [
        {
          title: "Для чего",
          air: "Если груз нужен срочно — выбирайте авиа.",
          container: "Если груз большой и нужно снизить стоимость.",
        },
        {
          title: "Скорость",
          air: "1–21 день",
          container: "14–40 дней",
        },
        {
          title: "Тариф",
          air: "от 7.5 $/кг",
          container: "от 3 $/кг",
        },
        {
          title: "Мин. вес",
          air: "от 5 кг",
          container: "от 10 кг",
        },
        {
          title: "Идеально для",
          air: [
            "Интернет-магазинов",
            "Экспресс-посылок",
            "Одежды и электроники",
          ],
          container: [
            "Мебели",
            "Автозапчастей",
            "Крупных партий",
          ],
        },
      ],
    },
  },
  

  cargo: {
    tariffs: [],
    comparison: null,
  },


};