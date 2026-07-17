import "@/components/sections/FAQ.css";
import { FiPlus, FiX } from "react-icons/fi";

const faq = [
  {
    question: "Как рассчитать стоимость доставки?",
    answer:
      "Стоимость зависит от веса, объема, страны назначения и способа доставки. Оставьте заявку — менеджер рассчитает стоимость бесплатно.",
  },
  {
    question: "В какие страны вы отправляете?",
    answer:
      "Казахстан, Кыргызстан, Россия, Узбекистан — список постепенно расширяется.",
  },
  {
    question: "Сколько длится доставка?",
    answer:
      "Авиа — от 1 дня. Контейнер — от 14 дней. Срок зависит от направления.",
  },
  {
    question: "Какие есть способы оплаты?",
    answer:
      "Банковский перевод, наличные в офисе, возможна оплата по реквизитам.",
  },
  {
    question: "Нужно ли оформлять документы на товар?",
    answer:
      "Если отправка официальная — да. Для личных вещей и посылок — нет.",
  },
  {
    question: "Что делать, если груз задерживается?",
    answer:
      "Свяжитесь с менеджером. Мы оперативно уточним статус и сообщим информацию.",
  },
];

export default function FAQ() {
  return (
    <section className="faq">
      <div className="faq-left">
        <h2>Часто задаваемые вопросы и ответы</h2>

        <p>
          Мы собрали самые частые вопросы, которые помогают быстрее
          разобраться в процессе доставки. Если не нашли нужного ответа —
          свяжитесь с менеджером.
        </p>
      </div>

      <div className="faq-right">
        {faq.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>
              <span className="question">{item.question}</span>

              <span className="faq-icon">
                <FiPlus className="plus" />
                <FiX className="close" />
              </span>
            </summary>

            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}