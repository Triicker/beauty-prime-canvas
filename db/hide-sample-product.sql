update products
set is_visible = false
where slug = 'shampoo-hidratante'
  and image_url is null;
