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
    ('shampoo-1', 'Shampoo Vitaminado Fortificante Indian Hair 250 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 21.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo1.webp', 1),
    ('shampoo-2', 'Shampoo Vitaminado Fortificante Indian Hair 500 ml | Sem sal', 'Shampoo profissional para cuidado diario dos fios.', 38.39, 'shampoos', 'https://midiasave-5c064.web.app/shampoo2.webp', 2),
    ('shampoo-3', 'Shampoo Purificante Cold Effect 250 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 24.75, 'shampoos', 'https://midiasave-5c064.web.app/shampoo3.jpg', 3),
    ('shampoo-4', 'Shampoo Reconstrutor Indian Hair Rebuild 250ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 26.90, 'shampoos', 'https://midiasave-5c064.web.app/shampoo4.webp', 4),
    ('shampoo-5', 'Shampoo Nutritivo Indian Hair Nutrition 250 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 21.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo5.jpg', 5),
    ('shampoo-6', 'Shampoo fortificante e apaziguador com Açafrão Panchali 250 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 25.19, 'shampoos', 'https://midiasave-5c064.web.app/shampoo6.png', 6),
    ('shampoo-7', 'Shampoo Purificante Cold Effect 500 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 43.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo7.jpg', 7),
    ('shampoo-8', 'Shampoo Nutritivo Indian Hair Nutrition 500 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 38.39, 'shampoos', 'https://midiasave-5c064.web.app/shampoo8.webp', 8),
    ('shampoo-9', 'Shampoo Pouca Espuma Krishna Curls 250 ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 25.19, 'shampoos', 'https://midiasave-5c064.web.app/shampoo9.webp', 9),
    ('shampoo-10', 'Shampoo Reconstrutor Indian Hair Rebuild 500ml | Sem Sal', 'Shampoo profissional para cuidado diario dos fios.', 49.90, 'shampoos', 'https://midiasave-5c064.web.app/shampoo10.webp', 10),
    ('shampoo-11', 'Shampoo fortificante e apaziguador com Açafrão Panchali 500 ml | Vegan', 'Shampoo profissional para cuidado diario dos fios.', 43.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo11.webp', 11),
    ('shampoo-12', 'Shampoo Black Platinum Pro 250 ml | Neutralizante Amarelos e Grisalhos', 'Shampoo profissional para cuidado diario dos fios.', 21.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo12.webp', 12),
    ('shampoo-13', 'Co Wash Krishna Curls | Lavagem Hidratante Sem Espuma | 250 ml', 'Shampoo profissional para cuidado diario dos fios.', 32.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo13.webp', 13),
    ('shampoo-14', 'Shampoo Krishna Curls | Caracóis Naturais | Pouca Espuma 500ml', 'Shampoo profissional para cuidado diario dos fios.', 43.89, 'shampoos', 'https://midiasave-5c064.web.app/shampoo14.webp', 14),
    ('shampoo-15', 'Shampoo Vitaminado Fortificante Indian Hair 5 L | Sem sal', 'Shampoo profissional para cuidado diario dos fios.', 218.90, 'shampoos', 'https://midiasave-5c064.web.app/shampoo15.webp', 15),
    ('shampoo-16', 'Shampoo Black Platinum Pro 500 ml | Neutralizante Amarelos e Grisalhos', 'Shampoo profissional para cuidado diario dos fios.', 39.40, 'shampoos', 'https://midiasave-5c064.web.app/shampoo16.webp', 16),
    ('shampoo-17', 'Co Wash Krishna Curls | Lavagem Hidratante Sem Espuma | 500ml', 'Shampoo profissional para cuidado diario dos fios.', 63.81, 'shampoos', 'https://midiasave-5c064.web.app/shampoo17.webp', 17),
    ('mascara-1', 'Máscara Vitaminada Indian Hair 500 ml | Hidratante', 'Mascara capilar para tratamento e manutencao dos fios.', 32.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara1.webp', 101),
    ('mascara-2', 'Máscara Indian Hair Rebuild 500 ml | Reconstrutora', 'Mascara capilar para tratamento e manutencao dos fios.', 49.90, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara2.webp', 102),
    ('mascara-3', 'Máscara Indian Hair Nutrition 500 ml | Nutritiva', 'Mascara capilar para tratamento e manutencao dos fios.', 38.39, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara3.jpg', 103),
    ('mascara-4', 'Máscara Indian Hair Nutrition Spider Web 500 ml | Nutritiva Leve', 'Mascara capilar para tratamento e manutencao dos fios.', 43.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara4.webp', 104),
    ('mascara-5', 'Máscara Panchali 500 ml | Hidratante & Fortificante | Açafrão Biológico', 'Mascara capilar para tratamento e manutencao dos fios.', 43.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara5.webp', 105),
    ('mascara-6', 'Creme Purificante especial Couro Cabeludo 500 ml | Hamamélis', 'Mascara capilar para tratamento e manutencao dos fios.', 32.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara6.jpg', 106),
    ('mascara-7', 'Máscara Krishna Curls 500 ml | Nutrição Profunda', 'Mascara capilar para tratamento e manutencao dos fios.', 43.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara7.jpg', 107),
    ('mascara-8', 'Máscara Black Platinum Pro 500 ml | Neutralizante Amarelos e Grisalhos', 'Mascara capilar para tratamento e manutencao dos fios.', 43.89, 'mascaras-capilares', 'https://midiasave-5c064.web.app/mascara8.jpg', 108),
    ('condicionador-1', 'Condicionador Fortificante Indian Hair Vitaminado 250 ml | Sem Sal', 'Condicionador profissional para maciez, brilho e desembaraco.', 25.19, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador1.webp', 201),
    ('condicionador-2', 'Condicionador Reconstrutor Indian Hair Rebuild 250 ml | Sem Sal', 'Condicionador profissional para maciez, brilho e desembaraco.', 29.90, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador2.webp', 202),
    ('condicionador-3', 'Condicionador Nutritivo Indian Hair Nutrition 250 ml | Sem Sal', 'Condicionador profissional para maciez, brilho e desembaraco.', 27.39, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador3.jpg', 203),
    ('condicionador-4', 'Condicionador Fortificante Indian Hair Vitaminado 500 ml | Sem Sal', 'Condicionador profissional para maciez, brilho e desembaraco.', 41.69, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador4.jpg', 204),
    ('condicionador-5', 'Condicionador Selante Nutritivo Krishna Curls 250 ml | Sem Sal', 'Condicionador profissional para maciez, brilho e desembaraco.', 32.89, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador5.webp', 205),
    ('condicionador-6', 'Condicionador fortificante e apaziguador com Açafrão Panchali 250 ml | Vegan', 'Condicionador profissional para maciez, brilho e desembaraco.', 27.39, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador6.png', 206),
    ('condicionador-7', 'Condicionador fortificante e apaziguador com Açafrão Panchali 500 ml | Vegan', 'Condicionador profissional para maciez, brilho e desembaraco.', 47.19, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador7.webp', 207),
    ('condicionador-8', 'Condicionador Black Platinum Pro 250 ml | Neutralizante Amarelos e Grisalhos', 'Condicionador profissional para maciez, brilho e desembaraco.', 27.39, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador8.jpg', 208),
    ('condicionador-9', 'Condicionador Indian Hair Rebuild 500 ml | Reconstrutor', 'Condicionador profissional para maciez, brilho e desembaraco.', 56.81, 'condicionadores', 'https://midiasave-5c064.web.app/condicionador9.webp', 209),
    ('tonico-capilar', 'Tónico Capilar Vitaminado Fortificante Indian Hair 100 ml | Amla', 'Tonico capilar para rotina de cuidado do couro cabeludo.', 38.39, 'tonicos-capilares', 'https://midiasave-5c064.web.app/tonico.webp', 301),
    ('creme-1', 'Sérum Selador de Pontas Indian Hair Rebuild | 100ml', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 29.90, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme1.webp', 401),
    ('creme-2', 'Modelador de Caracóis Active Curls | Creme Finalizador 250ml', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 21.89, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme2.webp', 402),
    ('creme-3', 'Casual Waves 250ml | Geleia Texturizante Leave in', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 21.89, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme3.png', 403),
    ('creme-4', 'Modelador de Caracóis Active Curls | Creme Finalizador 500ml', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 32.89, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme4.webp', 404),
    ('creme-5', 'Creme Intenso Krishna Curls | Nutrição Profunda | 250 ml', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 29.59, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme5.jpg', 405),
    ('creme-6', 'Creme Purificante especial Couro Cabeludo 500 ml | Hamamélis', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 32.89, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme6.jpg', 406),
    ('creme-7', 'Creme Intenso Krishna Curls | Nutrição Profunda | 500 ml', 'Creme capilar para finalizacao, nutricao e controlo dos fios.', 43.89, 'cremes-capilares', 'https://midiasave-5c064.web.app/creme7.webp', 407),
    ('oleo-1', 'Prana Oil | Óleo Fortificante para cabelos finos e médios | 115ml', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 32.89, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo1.png', 501),
    ('oleo-2', 'Mudra Oil | Óleo Nutritivo para Cabelos Grossos | 115ml', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 32.89, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo2.webp', 502),
    ('oleo-3', 'Óleo de Rícino Cure 100ml | 100% Biológico', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 27.39, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo3.webp', 503),
    ('oleo-4', 'Óleo Melaleuca Tea Tree 15ml', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 21.89, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo4.webp', 504),
    ('oleo-5', 'Óleo de Rosa Mosqueta Puro | Virgem e Biológico | 30 ml', 'Oleo capilar para brilho, protecao e acabamento sedoso.', 32.89, 'oleos-capilares', 'https://midiasave-5c064.web.app/oleo5.jpg', 505),
    ('protecao-termica-1', 'Protetor térmico e UV Ganesh Thermic | Leite Reparador e Anti-Frizz 240ml', 'Produto de protecao termica para secador, prancha e modeladores.', 29.90, 'protecao-termica', 'https://midiasave-5c064.web.app/termico1.webp', 601),
    ('protecao-termica-2', 'Protetor Térmico & UV Surya Thermic | Spray Bifásico 200ml', 'Produto de protecao termica para secador, prancha e modeladores.', 29.59, 'protecao-termica', 'https://midiasave-5c064.web.app/termico2.webp', 602),
    ('cera-capilar-1', 'Cera Capilar Styling Wax Pro Everlasting | Fixação Extra Forte 150g', 'Cera capilar para modelar, definir e finalizar o penteado.', 29.90, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera1.webp', 701),
    ('cera-capilar-2', 'Cera Capilar Styling Wax Fresh Effect | Fixação Normal 150g', 'Cera capilar para modelar, definir e finalizar o penteado.', 29.90, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera2.webp', 702),
    ('cera-capilar-3', 'Cera Capilar Styling Wax Pro Matte Paste | Matte Fixação Forte 150g', 'Cera capilar para modelar, definir e finalizar o penteado.', 29.90, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera3.webp', 703),
    ('cera-capilar-4', 'Prenda Especial | Cera Capilar Styling Wax Pro Matte Paste', 'Cera capilar para modelar, definir e finalizar o penteado.', 29.90, 'ceras-capilares', 'https://midiasave-5c064.web.app/cera4.webp', 704)
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
