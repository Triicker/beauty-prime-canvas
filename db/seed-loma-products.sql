-- Seed inicial dos produtos hospedados em:
-- https://midiasave-5c064.web.app/<arquivo>
--
-- Rode depois de db/schema.sql. Pode rodar novamente: os produtos sao
-- atualizados pelo slug.

with input (
  slug,
  name_pt,
  description_pt,
  price,
  category,
  image_url,
  sort_order
) as (
  values
    ('shampoo-1', 'Shampoo 1', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo1.webp', 1),
    ('shampoo-2', 'Shampoo 2', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo2.webp', 2),
    ('shampoo-3', 'Shampoo 3', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo3.jpg', 3),
    ('shampoo-4', 'Shampoo 4', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo4.webp', 4),
    ('shampoo-5', 'Shampoo 5', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo5.jpg', 5),
    ('shampoo-6', 'Shampoo 6', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo6.png', 6),
    ('shampoo-7', 'Shampoo 7', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo7.jpg', 7),
    ('shampoo-8', 'Shampoo 8', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo8.webp', 8),
    ('shampoo-9', 'Shampoo 9', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo9.webp', 9),
    ('shampoo-10', 'Shampoo 10', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo10.webp', 10),
    ('shampoo-11', 'Shampoo 11', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo11.webp', 11),
    ('shampoo-12', 'Shampoo 12', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo12.webp', 12),
    ('shampoo-13', 'Shampoo 13', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo13.webp', 13),
    ('shampoo-14', 'Shampoo 14', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo14.webp', 14),
    ('shampoo-15', 'Shampoo 15', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo15.webp', 15),
    ('shampoo-16', 'Shampoo 16', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo16.webp', 16),
    ('shampoo-17', 'Shampoo 17', 'Shampoo profissional para cuidado diario dos fios.', 28.00, 'shampoos', 'https://midiasave-5c064.web.app/shampoo17.webp', 17),
    ('mascara-1', 'Mascara Capilar 1', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara1.webp', 101),
    ('mascara-2', 'Mascara Capilar 2', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara2.webp', 102),
    ('mascara-3', 'Mascara Capilar 3', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara3.jpg', 103),
    ('mascara-4', 'Mascara Capilar 4', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara4.webp', 104),
    ('mascara-5', 'Mascara Capilar 5', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara5.webp', 105),
    ('mascara-6', 'Mascara Capilar 6', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara6.jpg', 106),
    ('mascara-7', 'Mascara Capilar 7', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara7.jpg', 107),
    ('mascara-8', 'Mascara Capilar 8', 'Mascara capilar para tratamento e manutencao dos fios.', 42.00, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara8.jpg', 108),
    ('condicionador-1', 'Condicionador 1', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador1.webp', 201),
    ('condicionador-2', 'Condicionador 2', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador2.webp', 202),
    ('condicionador-3', 'Condicionador 3', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador3.jpg', 203),
    ('condicionador-4', 'Condicionador 4', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador4.jpg', 204),
    ('condicionador-5', 'Condicionador 5', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador5.webp', 205),
    ('condicionador-6', 'Condicionador 6', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador6.png', 206),
    ('condicionador-7', 'Condicionador 7', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador7.webp', 207),
    ('condicionador-8', 'Condicionador 8', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador8.jpg', 208),
    ('condicionador-9', 'Condicionador 9', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.00, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador9.webp', 209),
    ('tonico-capilar', 'Tonico Capilar', 'Tonico capilar para rotina de cuidado do couro cabeludo.', 35.00, 'tonicos-capilares', 'https://midiasave-5c064.web.app/tonico.webp', 301),
    ('creme-1', 'Creme Capilar 1', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme1.webp', 401),
    ('creme-2', 'Creme Capilar 2', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme2.webp', 402),
    ('creme-3', 'Creme Capilar 3', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme3.png', 403),
    ('creme-4', 'Creme Capilar 4', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme4.webp', 404),
    ('creme-5', 'Creme Capilar 5', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme5.jpg', 405),
    ('creme-6', 'Creme Capilar 6', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme6.jpg', 406),
    ('creme-7', 'Creme Capilar 7', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 31.00, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme7.webp', 407),
    ('oleo-1', 'Oleo Capilar 1', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 38.00, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo1.png', 501),
    ('oleo-2', 'Oleo Capilar 2', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 38.00, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo2.webp', 502),
    ('oleo-3', 'Oleo Capilar 3', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 38.00, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo3.webp', 503),
    ('oleo-4', 'Oleo Capilar 4', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 38.00, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo4.webp', 504),
    ('oleo-5', 'Oleo Capilar 5', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 38.00, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo5.jpg', 505),
    ('protecao-termica-1', 'Protecao Termica 1', 'Produto de protecao termica para secador, prancha e modeladores.', 29.00, 'protecao-termica', 'https://midiasave-5c064.web.app/termico1.webp', 601),
    ('protecao-termica-2', 'Protecao Termica 2', 'Produto de protecao termica para secador, prancha e modeladores.', 29.00, 'protecao-termica', 'https://midiasave-5c064.web.app/termico2.webp', 602),
    ('cera-capilar-1', 'Cera Capilar 1', 'Cera capilar para modelar, definir e finalizar o penteado.', 24.00, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera1.webp', 701),
    ('cera-capilar-2', 'Cera Capilar 2', 'Cera capilar para modelar, definir e finalizar o penteado.', 24.00, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera2.webp', 702),
    ('cera-capilar-3', 'Cera Capilar 3', 'Cera capilar para modelar, definir e finalizar o penteado.', 24.00, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera3.webp', 703),
    ('cera-capilar-4', 'Cera Capilar 4', 'Cera capilar para modelar, definir e finalizar o penteado.', 24.00, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera4.webp', 704)
)
insert into products (
  slug,
  name_pt,
  description_pt,
  price,
  category,
  image_url,
  is_visible,
  sort_order
)
select
  slug,
  name_pt,
  description_pt,
  price,
  category,
  image_url,
  true,
  sort_order
from input
on conflict (slug) do update
set
  name_pt = excluded.name_pt,
  description_pt = excluded.description_pt,
  price = excluded.price,
  category = excluded.category,
  image_url = excluded.image_url,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;
