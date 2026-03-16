-- ============================================================
-- CATEGORIES
-- ============================================================
insert into categories (name) values
  ('Hambúrguer'),
  ('Bebida'),
  ('Frutos do mar'),
  ('Pizza'),
  ('Padaria'),
  ('Sorvete'),
  ('Vegana');
-- ============================================================
-- SECTIONS
-- ============================================================
insert into sections (name) values
  ('Hambúrgueres'),
  ('Bebidas'),
  ('Acompanhamentos'),
  ('Pizzas'),
  ('Frutos do Mar'),
  ('Sobremesas'),
  ('Saudável');
-- ============================================================
-- STORES
-- ============================================================
insert into stores (name, stripe_account_id, phone_number, address, neighborhood, description, image_url, coordinates) values
(
  'O mercador do porto',
  'acct_test_0C1d2E3F4G5H6I7J',
  '1199999010',
  'Rua Uirapuru 1771, Jaguaré - Espírito Santo, Brazil',
  'Jaguaré',
  'Entregando um pouco do gosto marinho para você, desfrute de nossas receitas!',
  'https://images.unsplash.com/photo-1562158079-e4b9ed06b62d?auto=format&fit=crop&w=1470&q=80',
  '(-18.918546488413682, -40.076999315352445)'
),
(
  'Central do hambúrguer',
  'acct_test_1P2k3L4M5N6O7P8Q',
  '11999990001',
  'Rua Maximiniano Laquin, Jaguaré - Espírito Santo, 29950, Brazil',
  'Jaguaré',
  'Os melhores hambúrgueres artesanais do centro.',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=765&q=80',
  '(-18.910109586305925, -40.07093400307956)'
),
(
  'Pizzaria forneria 1970',
  'acct_test_2Q3r4S5T6U7V8W9X',
  '11999990002',
  'Rua Uirapuru 9, Jaguaré - Espírito Santo, 29950, Brazil',
  'Jaguaré',
  'Pizza italiana legítima com forno a lenha. Nossas azeitonas são diferenciadas e deixam as pizzas deliciosas 🍕',
  'https://images.unsplash.com/photo-1587085416963-22efba033dd5?auto=format&fit=crop&w=1074&q=80',
  '(-18.90149967855578, -40.07541135622722)'
),
(
  'Padaria casca crocante',
  'acct_test_8M9n0O1P2Q3R4S5T',
  '11999990008',
  'Rodovia BR-381, São Mateus - Espírito Santo, Brazil',
  'São Mateus',
  'Cafés especiais e pães artesanais.',
  'https://images.unsplash.com/photo-1609590981063-d495e2914ce4?auto=format&fit=crop&w=764&q=80',
  '(-18.701530197738077, -39.887549999846435)'
);
-- ============================================================
-- OPERATING HOURS
-- ============================================================
-- O mercador do porto: dom (0), qui (3) e sáb (6) — almoço e jantar
insert into operating_hours (store_id, weekday, start_hour, end_hour)
select s.id, t.weekday, t.start_h, t.end_h
from stores s
cross join (values
  (0, '11:00'::time, '14:00'::time),
  (0, '19:00'::time, '22:00'::time),
  (3, '11:00'::time, '14:00'::time),
  (3, '19:00'::time, '22:00'::time),
  (6, '11:00'::time, '14:00'::time),
  (6, '19:00'::time, '22:00'::time)
) as t(weekday, start_h, end_h)
where s.name = 'O mercador do porto';
-- Padaria casca crocante: todos os dias
insert into operating_hours (store_id, weekday, start_hour, end_hour)
select s.id, g.weekday, '05:30', '17:30'
from stores s, generate_series(0, 6) as g(weekday)
where s.name = 'Padaria casca crocante';
-- Central do hambúrguer: todos os dias
insert into operating_hours (store_id, weekday, start_hour, end_hour)
select s.id, g.weekday, '18:30', '23:30'
from stores s, generate_series(0, 6) as g(weekday)
where s.name = 'Central do hambúrguer';
-- Pizzaria forneria 1970: todos os dias
insert into operating_hours (store_id, weekday, start_hour, end_hour)
select s.id, g.weekday, '17:30', '23:30'
from stores s, generate_series(0, 6) as g(weekday)
where s.name = 'Pizzaria forneria 1970';
-- ============================================================
-- STORE CATEGORIES
-- ============================================================
insert into store_categories (store_id, category_id)
select s.id, c.id from stores s, categories c
where s.name = 'Central do hambúrguer' and c.name = 'Hambúrguer';

insert into store_categories (store_id, category_id)
select s.id, c.id from stores s, categories c
where s.name = 'Pizzaria forneria 1970' and c.name = 'Pizza';

insert into store_categories (store_id, category_id)
select s.id, c.id from stores s, categories c
where s.name = 'Padaria casca crocante' and c.name = 'Padaria';

insert into store_categories (store_id, category_id)
select s.id, c.id from stores s, categories c
where s.name = 'O mercador do porto' and c.name = 'Frutos do mar';
-- ============================================================
-- PRODUCTS
-- ============================================================
insert into products (name, description, price_cents, image_url) values
(
  'Burger Vegetariano',
  'Hambúrguer de grão-de-bico, alface, tomate e molho de ervas.',
  3200,
  'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1290&q=80'
),
(
  'X-Burger Clássico',
  'Pão brioche, carne 150g e queijo cheddar.',
  2500,
  'https://images.unsplash.com/photo-1700835880369-a8e1eb918474?auto=format&fit=crop&w=687&q=80'
),
(
  'Coca-Cola Lata 350ml',
  'Gelada e refrescante.',
  700,
  'https://images.unsplash.com/photo-1771425732867-2a2f9ad34f34?auto=format&fit=crop&w=1171&q=80'
),
(
  'Batata Doce Frita Grande',
  'Batata doce rústica frita, acompanha maionese de ervas finas.',
  2300,
  'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&w=1471&q=80'
),
(
  'Batata Frita Grande',
  'Crocante por fora e macia por dentro.',
  1500,
  'https://images.unsplash.com/photo-1630431343545-e9d2e0880487?auto=format&fit=crop&w=1374&q=80'
),
(
  'Pizza de Calabresa G',
  'Molho de tomate artesanal, muçarela, calabresa fatiada, cebola e orégano.',
  4500,
  'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&w=1170&q=80'
),
(
  'Pizza de Frango com Catupiry G',
  'Frango desfiado temperado, muçarela, o legítimo Catupiry e milho.',
  4800,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=781&q=80'
),
(
  'Suco de Laranja 500ml',
  '100% natural, sem açúcar.',
  1200,
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=687&q=80'
),
(
  'Camarão na Moranga Individual',
  'Camarões médios refogados no creme de leite e catupiry, servidos na mini moranga.',
  8990,
  'https://images.unsplash.com/photo-1692106914571-427a2126b2e0?auto=format&fit=crop&w=686&q=80'
),
(
  'Salmão Grelhado com Ervas',
  'Filé de salmão grelhado na manteiga de ervas, acompanha risoto de limão siciliano.',
  6500,
  'https://images.unsplash.com/photo-1601314212732-047d4bdffd22?auto=format&fit=crop&w=736&q=80'
),
(
  'Donut de Nutella',
  'Donut artesanal recheado com creme de avelã e cobertura de chocolate belga.',
  1200,
  'https://images.unsplash.com/photo-1642942000413-d967010dea4b?auto=format&fit=crop&w=1170&q=80'
),
(
  'Açaí Especial 500ml',
  'Açaí orgânico com granola, banana fatiada, leite em pó e mel.',
  2800,
  'https://images.unsplash.com/photo-1562166453-2783119c313a?auto=format&fit=crop&w=880&q=80'
),
(
  'Sanduíche Natural de Frango',
  'Pão integral, frango desfiado, creme de ricota, cenoura ralada e alface.',
  2400,
  'https://images.unsplash.com/photo-1634632071708-68d98ca65f04?auto=format&fit=crop&w=687&q=80'
);
-- ============================================================
-- PRODUCT SECTIONS
-- ============================================================
insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Burger Vegetariano', 'X-Burger Clássico')
  and s.name = 'Hambúrgueres';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Coca-Cola Lata 350ml', 'Suco de Laranja 500ml')
  and s.name = 'Bebidas';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Batata Doce Frita Grande', 'Batata Frita Grande')
  and s.name = 'Acompanhamentos';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Pizza de Calabresa G', 'Pizza de Frango com Catupiry G')
  and s.name = 'Pizzas';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Camarão na Moranga Individual', 'Salmão Grelhado com Ervas')
  and s.name = 'Frutos do Mar';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Donut de Nutella', 'Açaí Especial 500ml')
  and s.name = 'Sobremesas';

insert into product_sections (product_id, section_id)
select p.id, s.id from products p, sections s
where p.name in ('Sanduíche Natural de Frango')
  and s.name = 'Saudável';
-- ============================================================
-- STORE PRODUCTS (STOCK)
-- ============================================================
-- Central do hambúrguer
insert into store_products (store_id, product_id, stock_quantity)
select
  (select id from stores where name = 'Central do hambúrguer'),
  p.id,
  case
    when p.name like '%Burger%' then 80
    when p.name like '%Batata%' then 150
    when p.name = 'Coca-Cola Lata 350ml' then 100
  end
from products p
where p.name in ('Burger Vegetariano', 'X-Burger Clássico', 'Coca-Cola Lata 350ml', 'Batata Doce Frita Grande', 'Batata Frita Grande');
-- Pizzaria forneria 1970
insert into store_products (store_id, product_id, stock_quantity)
select
  (select id from stores where name = 'Pizzaria forneria 1970'),
  p.id,
  case
    when p.name like 'Pizza%' then 60
    when p.name = 'Coca-Cola Lata 350ml' then 80
    when p.name = 'Suco de Laranja 500ml' then 40
  end
from products p
where p.name in ('Pizza de Calabresa G', 'Pizza de Frango com Catupiry G', 'Coca-Cola Lata 350ml', 'Suco de Laranja 500ml');
-- O mercador do porto
insert into store_products (store_id, product_id, stock_quantity)
select
  (select id from stores where name = 'O mercador do porto'),
  p.id,
  case
    when p.name = 'Camarão na Moranga Individual' then 20
    when p.name = 'Salmão Grelhado com Ervas'     then 25
    when p.name = 'Suco de Laranja 500ml'         then 50
  end
from products p
where p.name in ('Camarão na Moranga Individual', 'Salmão Grelhado com Ervas', 'Suco de Laranja 500ml');
-- Padaria casca crocante
insert into store_products (store_id, product_id, stock_quantity)
select
  (select id from stores where name = 'Padaria casca crocante'),
  p.id,
  case
    when p.name = 'Donut de Nutella'            then 40
    when p.name = 'Sanduíche Natural de Frango' then 35
    when p.name = 'Suco de Laranja 500ml'       then 60
    when p.name = 'Açaí Especial 500ml'         then 60
  end
from products p
where p.name in ('Donut de Nutella', 'Sanduíche Natural de Frango', 'Suco de Laranja 500ml', 'Açaí Especial 500ml');