

import MessageIcon from "@/assets/icons/message.svg?react";
import WarehouseIcon from "@/assets/icons/warehouse.svg?react";
import PackageIcon from "@/assets/icons/package.svg?react";
import CalculatorIcon from "@/assets/icons/calculator.svg?react";
import Handshake from "@/assets/icons/handshake.svg?react";
import Filecheck from "@/assets/icons/file-check.svg?react";
import Badgecheck from "@/assets/icons/badge-check.svg?react";
import Truck from "@/assets/icons/truck.svg?react";
import Car from "@/assets/icons/car.svg?react";
import searchCheck from "@/assets/icons/searchCheck.svg?react";
import containerHook from "@/assets/icons/containerHook.svg?react"





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

export const officialInstructions = {
  title: "Как мы работаем",

  steps: [
    {
      icon:  Handshake,
      title: "Договариваемся с поставщиком",
      description:
        "Выходим на завод, сверяем условия, подтверждаем цены",
    },
    {
      icon: Filecheck,
      title: "Проверяем документы",
      description:
        "Инвойсы, пакинг-листы, сертификаты — приводим к требованиям таможни",
    },
    {
      icon: CalculatorIcon,
      title: "Считаем логистику & платежи",
      description:
        "Просчитываем маршрут, сроки, все таможенные платежи заранее",
    },
    {
      icon: Badgecheck,
      title: "Получаем разрешения",
      description:
        "Сертификаты, госрегистрация, декларации — подаём заявки и доводим до результата",
    },
    {
      icon: Truck,
      title: "Отправляем груз",
      description:
        "Авиа / контейнер, страхуем, даём трек-код",
    },
    {
      icon: PackageIcon,
      title: "Доставка до вашего склада",
      description:
        "Таможим, доставляем на склад клиента",
    },
  ],

 
};

export const Partnership = {
  title: "Сотрудничая с нами, вы получаете:",

  steps: [
    {
      icon:  Car,
      title: "Полную прозрачность – никаких сюрпризов",
      description:
        "Все условия ясны и понятны.",
    },
    {
      icon: searchCheck,
      title: "Полный контроль загруза",
      description:
        "Вы знаете, как и что загружается в ваш контейнер.",
    },
    {
      icon: containerHook,
      title: "Минимальные риски",
      description:
        "Мы максимально снижаем потенциальные проблемы при экспорте.",
    },
    
  ],

 
};
