-- Remove produtos do seed antigo quando ja existe outro produto com a mesma
-- image_url criado pelo sincronizador da pasta lomaproducts.

delete from products old_product
using products synced_product
where old_product.image_url = synced_product.image_url
  and old_product.id <> synced_product.id
  and old_product.slug <> synced_product.slug
  and (
    old_product.slug ~ '^(shampoo|mascara|condicionador|creme|oleo)-[0-9]+$'
    or old_product.slug ~ '^(protecao-termica|cera-capilar)-[0-9]+$'
    or old_product.slug = 'tonico-capilar'
  );
