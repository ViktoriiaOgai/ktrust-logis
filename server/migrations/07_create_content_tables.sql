-- Таблица для услуг
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ko VARCHAR(255),
  description TEXT,
  icon VARCHAR(50),
  hero_title VARCHAR(255),
  hero_description TEXT,
  hero_button_text VARCHAR(100),
  hero_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для стран доставки
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  name_ru VARCHAR(100) NOT NULL,
  name_ko VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для тарифов
CREATE TABLE IF NOT EXISTS tariffs (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  tariff_type VARCHAR(50) NOT NULL, -- 'air', 'container', 'cargo'
  columns JSONB NOT NULL, -- заголовки таблицы
  notes TEXT[], -- примечания
  min_weight DECIMAL(10, 2),
  delivery_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для строк тарифов
CREATE TABLE IF NOT EXISTS tariff_rows (
  id SERIAL PRIMARY KEY,
  tariff_id INTEGER REFERENCES tariffs(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  delivery VARCHAR(100) NOT NULL,
  note TEXT,
  has_close_icon BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для сравнения услуг
CREATE TABLE IF NOT EXISTS service_comparisons (
  id SERIAL PRIMARY KEY,
  service_slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  columns JSONB NOT NULL,
  rows JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для информации о компании
CREATE TABLE IF NOT EXISTS company_info (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100) UNIQUE NOT NULL, -- 'about', 'contacts', etc.
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(500),
  contact_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_tariffs_service_country ON tariffs(service_id, country_id);
CREATE INDEX IF NOT EXISTS idx_tariff_rows_tariff ON tariff_rows(tariff_id);
CREATE INDEX IF NOT EXISTS idx_service_comparisons_slug ON service_comparisons(service_slug);
CREATE INDEX IF NOT EXISTS idx_company_info_section ON company_info(section);

-- Seed данные для услуг
INSERT INTO services (slug, title, title_ko, description, icon, hero_title, hero_description, hero_button_text, hero_info) VALUES
(
  'air-delivery',
  'Авиадоставка',
  '항공 배송',
  'Быстрая авиадоставка грузов из Южной Кореи в страны СНГ',
  '✈️',
  'Авиа перевозки из Южной Кореи',
  '',
  'Тарифы',
  '[
    {"title": "Скорость доставки", "description": "От 1 до 21 дня в зависимости от страны"},
    {"title": "Стоимость", "description": "Дороже, чем контейнером"},
    {"title": "Товар", "description": "Идеально для небольших партий"}
  ]'::jsonb
),
(
  'container-delivery',
  'Контейнерные перевозки',
  '컨테이너 운송',
  'Морские контейнерные перевозки из Южной Кореи в страны СНГ',
  '🚢',
  'Контейнерные перевозки из Южной Кореи',
  '',
  'Тарифы',
  '[
    {"title": "Скорость доставки", "description": "14-40 дней"},
    {"title": "Стоимость", "description": "Экономичнее авиа"},
    {"title": "Товар", "description": "Идеально для крупных партий"}
  ]'::jsonb
),
(
  'personal-delivery',
  'Личные посылки',
  '개인 택배',
  'Доставка личных посылок и документов',
  '📦',
  'Личные посылки из Южной Кореи',
  '',
  'Тарифы',
  '[
    {"title": "Скорость доставки", "description": "5-9 дней"},
    {"title": "Стоимость", "description": "Выгодно для небольших посылок"},
    {"title": "Товар", "description": "Идеально для личных покупок"}
  ]'::jsonb
),
(
  'car-delivery',
  'Автомобильные перевозки',
  '자동차 운송',
  'Перевозка автомобилей и запчастей',
  '🚗',
  'Автомобильные перевозки из Южной Кореи',
  '',
  'Тарифы',
  '[
    {"title": "Скорость доставки", "description": "10-20 дней"},
    {"title": "Стоимость", "description": "Зависит от типа авто"},
    {"title": "Товар", "description": "Автомобили и запчасти"}
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_ko = EXCLUDED.title_ko,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  hero_title = EXCLUDED.hero_title,
  hero_description = EXCLUDED.hero_description,
  hero_button_text = EXCLUDED.hero_button_text,
  hero_info = EXCLUDED.hero_info,
  updated_at = CURRENT_TIMESTAMP;

-- Seed данные для стран
INSERT INTO countries (code, name, name_ru, name_ko) VALUES
('KZ', 'Kazakhstan', 'Казахстан', '카자흐스탄'),
('KG', 'Kyrgyzstan', 'Кыргызстан', '키르기스스탄'),
('UZ', 'Uzbekistan', 'Узбекистан', '우즈베키스탄'),
('RU', 'Russia', 'Россия', '러시아')
ON CONFLICT (code) DO NOTHING;

-- Seed данные для тарифов (Авиа - Казахстан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'air-delivery'),
  (SELECT id FROM countries WHERE code = 'KZ'),
  'air',
  '["Категория", "Тариф, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 10 кг', 'Сроки указаны с момента выхода судна из Кореи', 'Погрузки осуществляются еженедельно по четвергам.'],
  10,
  '12-16 дней'
);

-- Seed данные для строк тарифов (Авиа - Казахстан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Одежда, обувь, хозтовары, снеки',
  '4.5',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Косметика',
  'от 1.8 (в зависимости от веса)',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  2
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'БАДы, витамины',
  'от 3',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  3
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Автозапчасти',
  'от 4',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  4
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Габаритный груз',
  'Объем / 5000',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  5
);

-- Seed данные для тарифов (Авиа - Кыргызстан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'air-delivery'),
  (SELECT id FROM countries WHERE code = 'KG'),
  'air',
  '["Категория", "Тариф до Бишкека, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 5 кг', 'Доставка осуществляется до склада в Бишкеке', 'Сроки указаны с момента вылета из Южной Кореи'],
  5,
  '5-9 дней'
);

-- Seed данные для строк тарифов (Авиа - Кыргызстан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, has_close_icon, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KG') LIMIT 1),
  'Одежда, косметика, обувь, хозтовары, снеки, витамины, автозапчасти',
  '12',
  '5–9 дней',
  '',
  true,
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KG') LIMIT 1),
  'Электроника (включая Dyson и другое)',
  '13',
  '5-9 дней',
  '',
  true,
  2
);

-- Seed данные для тарифов (Авиа - Узбекистан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'air-delivery'),
  (SELECT id FROM countries WHERE code = 'UZ'),
  'air',
  '["Категория", "Тариф до Ташкента, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 7 кг', 'Доставка по Ташкенту - бесплатно', 'Сроки указаны с момента вылета из Южной Кореи'],
  7,
  '1-2 дня'
);

-- Seed данные для строк тарифов (Авиа - Узбекистан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'UZ') LIMIT 1),
  'Личные посылки (не более 3 одинаковых позицый одного наименования)',
  '9',
  '1-2 дня',
  '+1 $/кг',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'UZ') LIMIT 1),
  'Коммерческие грузы',
  'по запросу',
  'по запросу',
  'по запросу',
  2
);

-- Seed данные для тарифов (Авиа - Россия)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'air-delivery'),
  (SELECT id FROM countries WHERE code = 'RU'),
  'air',
  '["Категория", "Тариф до Москвы, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 5 кг', 'Доставка до любого удобного пункта выдачи СДЭК', 'Сроки указаны с момента вылета из Южной Кореи'],
  5,
  '1-3 недели'
);

-- Seed данные для строк тарифов (Авиа - Россия)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'RU') LIMIT 1),
  'Одежда, косметика, обувь, хозтовары, снеки, БАДы, витамины, автозапчасти',
  '16',
  '1-3 недели',
  '+2 $/кг к тарифу',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'air-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'RU') LIMIT 1),
  'Медикаменты и косметология',
  '20',
  '2-3 недели',
  '+2 $/кг к тарифу',
  2
);

-- Seed данные для сравнения услуг
INSERT INTO service_comparisons (service_slug, title, columns, rows) VALUES
(
  'air-delivery',
  'Какой способ доставки выбрать?',
  '["", "Авиа", "Контейнер"]'::jsonb,
  '[
    {"title": "Для чего", "air": "Если груз нужен срочно — выбирайте авиа.", "container": "Если груз большой и нужно снизить стоимость."},
    {"title": "Скорость", "air": "1–21 день", "container": "14–40 дней"},
    {"title": "Тариф", "air": "от 7.5 $/кг", "container": "от 3 $/кг"},
    {"title": "Мин. вес", "air": "от 5 кг", "container": "от 10 кг"},
    {"title": "Идеально для", "air": ["Интернет-магазинов", "Экспресс-посылок", "Одежды и электроники"], "container": ["Мебели", "Автозапчастей", "Крупных партий"]}
  ]'::jsonb
);

-- Seed данные для информации о компании
INSERT INTO company_info (section, title, content, contact_info) VALUES
(
  'about',
  'О компании',
  'KTrust Logistics - надежный логистический партнер для доставки грузов из Южной Кореи в страны СНГ. Мы работаем с 2015 года и обеспечиваем безопасную и своевременную доставку.',
  '{
    "phone": "+7 777 123 4567",
    "email": "info@ktrust-logis.com",
    "address": "Сеул, Южная Корея"
  }'::jsonb
),
(
  'contacts',
  'Контакты',
  'Свяжитесь с нами для получения консультации и оформления заказа.',
  '{
    "phone": "+7 777 123 4567",
    "email": "info@ktrust-logis.com",
    "address": "Сеул, Южная Корея",
    "working_hours": "Пн-Пт: 9:00-18:00"
  }'::jsonb
) ON CONFLICT (section) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  contact_info = EXCLUDED.contact_info,
  updated_at = CURRENT_TIMESTAMP;

-- Seed данные для тарифов (Контейнер - Казахстан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'container-delivery'),
  (SELECT id FROM countries WHERE code = 'KZ'),
  'container',
  '["Категория", "Тариф, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 10 кг', 'Сроки указаны с момента выхода судна из Кореи', 'Погрузки осуществляются еженедельно по четвергам (прием груза за день до отправки)'],
  10,
  '12-16 дней'
);

-- Seed данные для строк тарифов (Контейнер - Казахстан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Одежда, обувь, хозтовары, снеки',
  '4.5',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Косметика',
  'от 1.8 (в зависимости от веса)',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  2
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'БАДы, витамины',
  'от 3',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  3
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Автозапчасти',
  'от 4',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  4
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KZ') LIMIT 1),
  'Габаритный груз',
  'Объем / 5000',
  '12–16 дней',
  '+1 $/кг к тарифу\n2–5 дней',
  5
);

-- Seed данные для тарифов (Контейнер - Кыргызстан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'container-delivery'),
  (SELECT id FROM countries WHERE code = 'KG'),
  'container',
  '["Категория", "Тариф, $ / кг", "Срок доставки*", "Минимальный вес партии"]'::jsonb,
  ARRAY['Минимальный вес: 5 кг', 'Доставка осуществляется до склада в Бишкеке', 'Сроки указаны с момента вылета из Южной Кореи'],
  5,
  '20-25 дней'
);

-- Seed данные для строк тарифов (Контейнер - Кыргызстан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KG') LIMIT 1),
  'Косметика',
  '4',
  '20-25 дней',
  '10кг',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'KG') LIMIT 1),
  'Электроника (включая Dyson и другое)',
  '13',
  '5-9 дней',
  '',
  2
);

-- Seed данные для тарифов (Контейнер - Узбекистан)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'container-delivery'),
  (SELECT id FROM countries WHERE code = 'UZ'),
  'container',
  '["Категория", "Тариф до Ташкента, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 7 кг', 'Доставка по Ташкенту - бесплатно', 'Сроки указаны с момента вылета из Южной Кореи'],
  7,
  '1-2 дня'
);

-- Seed данные для строк тарифов (Контейнер - Узбекистан)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'UZ') LIMIT 1),
  'Личные посылки (не более 3 одинаковых позицый одного наименования)',
  '9',
  '1-2 дня',
  '+1 $/кг',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'UZ') LIMIT 1),
  'Коммерческие грузы',
  'по запросу',
  'по запросу',
  'по запросу',
  2
);

-- Seed данные для тарифов (Контейнер - Россия)
INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info) VALUES
(
  (SELECT id FROM services WHERE slug = 'container-delivery'),
  (SELECT id FROM countries WHERE code = 'RU'),
  'container',
  '["Категория", "Тариф до Москвы, $ / кг", "Срок доставки*", "Другие регионы"]'::jsonb,
  ARRAY['Минимальный вес: 5 кг', 'Доставка до любого удобного пункта выдачи СДЭК', 'Сроки указаны с момента вылета из Южной Кореи'],
  5,
  '1-3 недели'
);

-- Seed данные для строк тарифов (Контейнер - Россия)
INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, sort_order) VALUES
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'RU') LIMIT 1),
  'Одежда, косметика, обувь, хозтовары, снеки, БАДы, витамины, автозапчасти',
  '16',
  '1-3 недели',
  '+2 $/кг к тарифу',
  1
),
(
  (SELECT id FROM tariffs WHERE service_id = (SELECT id FROM services WHERE slug = 'container-delivery') AND country_id = (SELECT id FROM countries WHERE code = 'RU') LIMIT 1),
  'Медикаменты и косметология',
  '20',
  '2-3 недели',
  '+2 $/кг к тарифу',
  2
);
