

import MessageIcon from "@/assets/icons/message.svg?react";
import WarehouseIcon from "@/assets/icons/warehouse.svg?react";
import PackageIcon from "@/assets/icons/package.svg?react";
import CalculatorIcon from "@/assets/icons/calculator.svg?react";

export const containerInstructions = {
  title: "Как оформить отправку",

  steps: [
    {
      icon: MessageIcon,
      title: "Заявка и консультация",
      description:
        "Пишите в WhatsApp / Telegram или оставляете заявку на сайте. Сообщаете категорию груза, вес, объём и пункт назначения.",
    },
    {
      icon: WarehouseIcon,
      title: "Доставка на наш склад",
      description:
        "Самостоятельно или заказываете наш забор.",
    },
    {
      icon: PackageIcon,
      title: "Проверка и переупаковка",
      description:
        "Замеры, взвешивание, фотоотчёт. При необходимости выполняем переупаковку.",
    },
    {
      icon: CalculatorIcon,
      title: "Расчёт итоговой стоимости",
      description:
        "Фиксируем стоимость и выставляем счёт.",
    },
  ],

  notes: [
    "Если упаковку выполняют сотрудники K-Trust по нашим стандартам, за целостность отвечает компания.",
    "Хрупкий или нестандартный груз — предупреждаем о рисках до погрузки. Ответственность в этом случае несёт отправитель или получатель.",
  ],
};
