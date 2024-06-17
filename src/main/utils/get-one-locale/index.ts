export const getOneLocale = (): string => {
  const cities = [
    'São Paulo/SP',
    'Guarulhos/SP',
    'Campinas/SP',
    'São Bernardo do Campo/SP',
    'Osasco/SP',
    'Santo André/SP',
    'São José dos Campos/SP',
    'Ribeirão Preto/SP',
    'Sorocaba/SP',
    'Mauá/SP',
    'São José do Rio Preto/SP',
    'Mogi das Cruzes/SP',
    'Santos/SP',
    'Diadema/SP',
    'Jundiaí/SP',
    'Piracicaba/SP',
    'Carapicuíba/SP',
    'Bauru/SP',
    'Itaquaquecetuba/SP',
    'São Vicente/SP',
    'Franca/SP',
    'Praia Grande/SP',
    'Guarujá/SP',
    'Taubaté/SP',
    'Limeira/SP'
  ];
  const randomIndex = Math.floor(Math.random() * cities.length);

  return cities[randomIndex];
};

export const getOneLocaleRG = (): string => {
  const cities = [
    'São Paulo-SP São Paulo',
    'Guarulhos-SP Guarulhos',
    'Campinas-SP Campinas',
    'São Bernardo do Campo-SP São Bernardo do Campo',
    'Osasco-SP Osasco',
    'Santo André-SP Santo André',
    'São José dos Campos-SP São José dos Campos',
    'Ribeirão Preto-SP Ribeirão Preto',
    'Sorocaba-SP Sorocaba',
    'Mauá-SP Mauá',
    'São José do Rio Preto-SP São José do Rio Preto',
    'Mogi das Cruzes-SP Mogi das Cruzes',
    'Santos-SP Santos',
    'Diadema-SP Diadema',
    'Jundiaí-SP Jundiaí',
    'Piracicaba-SP Piracicaba',
    'Carapicuíba-SP Carapicuíba',
    'Bauru-SP Bauru',
    'Itaquaquecetuba-SP Itaquaquecetuba',
    'São Vicente-SP São Vicente',
    'Franca-SP Franca',
    'Praia Grande-SP Praia Grande',
    'Guarujá-SP Guarujá',
    'Taubaté-SP Taubaté',
    'Limeira-SP Limeira'
  ];
  const randomIndex = Math.floor(Math.random() * cities.length);

  return cities[randomIndex];
};
