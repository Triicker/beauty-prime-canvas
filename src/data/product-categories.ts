export const PRODUCT_CATEGORIES = [
  { value: "shampoos", label: "Shampoos" },
  { value: "mascaras-capilares", label: "Máscaras Capilares" },
  { value: "condicionadores", label: "Condicionadores" },
  { value: "tonicos-capilares", label: "Tónicos Capilares" },
  { value: "cremes-capilares", label: "Cremes Capilares" },
  { value: "oleos-capilares", label: "Óleos Capilares" },
  { value: "protecao-termica", label: "Proteção térmica" },
  { value: "ceras-capilares", label: "Ceras Capilares" },
  { value: "fortalecimento-queda", label: "Fortalecimento & Queda de Cabelo" },
  { value: "problemas-couro-cabeludo", label: "Problemas do Couro Cabeludo" },
  { value: "cabelos-danificados-reparacao", label: "Cabelos Danificados (Reparação)" },
  { value: "cabelos-secos-nutricao", label: "Cabelos Secos (Nutrição)" },
  { value: "caracois-ondas-definicao", label: "Caracóis e Ondas (Definição Capilar)" },
  {
    value: "cabelos-grisalhos-brancos-louros-matizacao",
    label: "Cabelos Grisalhos, Brancos & Louros (Matização)",
  },
  { value: "pontas-quebradicas-danificados", label: "Pontas Quebradiças e Danificados" },
  { value: "cabelos-muito-danificados", label: "Cabelos Muito Danificados" },
  { value: "cabelos-danificados", label: "Cabelos Danificados" },
  { value: "cabelo-aspero-sem-brilho-frizz", label: "Cabelo áspero sem brilho e frizz" },
  { value: "modeladores-capilares", label: "Modeladores Capilares" },
  { value: "caracois-ondas", label: "Caracóis e Ondas" },
] as const;

export const PRODUCT_CATEGORY_LABELS = Object.fromEntries(
  PRODUCT_CATEGORIES.map((category) => [category.value, category.label]),
) as Record<string, string>;
