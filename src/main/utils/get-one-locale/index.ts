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
