// Product names/photos were updated and detail text was removed, so product-level
// translations no longer apply. Add Tamil names here later if needed: { [id]: { name } }
const productTranslations = { ta: { products: {} } };

export function getTranslatedProduct(product, language) {
  if (language === 'en' || !product) return product;
  const pTrans = productTranslations.ta.products[product.id];
  return pTrans ? { ...product, name: pTrans.name || product.name } : product;
}

export default productTranslations;
