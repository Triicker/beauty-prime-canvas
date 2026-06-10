alter table products
add column if not exists categories text[] not null default '{}';

update products
set categories = array[category]
where cardinality(categories) = 0
  and category is not null
  and category <> '';
