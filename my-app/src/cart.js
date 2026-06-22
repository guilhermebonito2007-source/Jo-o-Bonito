// Chave usada para armazenar o carrinho no localStorage do navegador.
const CART_STORAGE_KEY = 'lojaSendeCart';

// Dicionário de detalhes de produto usados no popup "Ver detalhes".
// Cada produto tem título, descrição, especificações e opções selecionáveis.
const PRODUCT_DETAILS = {


  'limpeza-lixivia-kiriko': {
    title: 'Lixívia Kiriko',
   description: 'Lixívia com ação desinfetante e branqueadora, ideal para sanitizar sanitários, chão e superfícies duras.',
    specs: {
      'Volume': '2 L',
      'Tipo': 'Liquido',
      'Aplicação': 'Pisos, azulejos e superfícies laváveis'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Neutra', 'Com Detergente', 'Perfumada', 'Limpa e Branqueia'] }
    ]

  },
  'limpeza-limpa-frigorifico': {
    title: 'Limpa Frigorífico',
    description: 'Limpa e refresca o interior do frigorífico, removendo odores e gorduras sem agredir as superfícies.',
    specs: {
      'Volume': '500 ml',
      'Ação': 'Limpeza e proteção',
      'Uso': 'Frigoríficos e congeladores'
    },
    options: [
      { name: 'Volume', label: 'Volume', values: ['500 ml'] }
    ]
  },


  'limpeza-limpa-vidros': {
    title: 'Limpa Vidros',
    description: 'Spray para vidros e espelhos com secagem rápida e acabamento sem manchas.',
    specs: {
      'Volume': '1 L',
      'Indicado para': 'Vidros, espelhos e superfícies transparentes'
    },
    options: [
      { name: 'Volume', label: 'Volume', values: ['1 L'] },
      { name: 'Tipo', label: 'Tipo', values: [ 'Limpa Vidros In', 'Limpa Cristales', 'Multiusos'] }
    ]
  },

  'limpeza-limpa-alumínio': {
    title: 'Limpa Alumínio',
    description: 'Limpa alumínio e inox, restaurando o brilho sem riscar e removendo marcas de dedos.',
    specs: {
      'Indicado para': 'Panelas, jantes, objetos de alumínio e inox',
      'Precauções': 'Testar numa área pequena antes de usar'
    },
    options: [
      { name: 'Volume', label: 'Volume', values: ['250 ml - Limpa Inox', '500 ml - Luminox', '750 ml - Alumin', '1 L - LimpaAluminios'] },
      { name: 'Formato', label: 'Formato', values: ['Spray', 'Liquído'] }
    ]
  },

  'limpeza-lixivia-lagarto': {
    title: 'Lixívia Lagarto',
    description: 'Lixívia de alta potência para limpeza e desinfeção de superfícies muito sujas e sanitárias.',
    specs: {
      'Acabamento': 'Brilhante',
      'Volume': '2 L'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: [ 'Pinho 2L', 'Al Jabon 2L', 'Limão 2L' ] }
    ]

  },

  'limpeza-gel-de-casa-de-banho': {
    title: 'Gel de Casa de Banho',
    description: 'Gel de casa-de-banho que dissolve calcário e elimina sujidade de sanitas e azulejos.',
    specs: {
      'Benefício': 'Limpeza profunda e proteção contra germes',
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Gel WC Limón Com Cor', 'Gel WC Oceano', 'Limpador WC Eucalipto', 'Gel WC Pinho', 'Limpador WC Limón Sem cor'] },
    ]
  },
  'limpeza-amaciador-da-san': {
    title: 'Amaciador da San',
    description: 'Amaciador perfumado que protege as fibras e deixa as roupas soltas e sedosas.',
    specs: {
      'Volume': '1,5 L',
      'Ação': 'Limpeza eficaz e frescor',
      'Aplicação': 'Roupas brancas e coloridas'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Talco:60 Lavagens ', 'Radiante:60 Lavagens', 'Velvet:60 Lavagens'] },
  
    ]

 },
  'limpeza-amaciador-da-Fun': {
    title: 'Amaciador da Fun',
    description: 'Amaciador perfumado para roupas delicadas, com ação antiestática e toque aveludado.',
    specs: {
      'Volume': '1,5 L',
      'Ação': 'Limpeza eficaz e frescor',
      'Aplicação': 'Roupas brancas e coloridas'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Sofl Jasmim e Maça Verde ', 'Soft:Talco'] },
    ]


},
  'limpeza-detergente-da-In 45 dosses ': {
    title: 'Detergente para a Roupa da In 45 dosses',
    description: 'Detergente de alta capacidade para 45 lavagens, indicado para roupas muito sujas e coloridas.',
    specs: {
      'Volume': '3 L',
      'Ação': 'Limpeza eficaz e frescor',
      'Aplicação': 'Roupas brancas e coloridas'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Clássico:45 dosses ', 'Marselha:45 dosses'] },
    ]

  },
  'limpeza-detergente-para-a-roupa': {
    title: 'Detergente Para a Roupa',
    description: 'Detergente para a roupa com fórmula suave e eficaz para a limpeza diária.',
    specs: {
      'Volume': '1 L',
      'Ação': 'Remove manchas e odores',
      'Aplicação': 'Roupas brancas e coloridas'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Neutro', 'Fresco', 'Lavanda'] },
    ]

  },
  'limpeza-detergente': {
    title: 'Detergente',
    description: 'Detergente para roupa com ação potente que remove manchas e mantém o tecido fresco.',
    specs: {
      'Ação': 'Limpeza eficaz e frescor',
      'Aplicação': 'Roupas brancas e coloridas'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Romar 1L: 21 dosses', 'Kiriko 3L: 42 dosses', 'Alin 750ml: 23 dosses'] },
    ]

  },
  'limpeza-Lava-Tudo': {
    title: 'Lava Tudo',
    description: 'Limpa-tudo versátil para pavimentos e superfícies, com ação desengordurante e aroma duradouro.',
    specs: { 'Volume': '5 L', 'Uso': 'Chão' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Oceano 5L', 'Lavanda 5L', 'Floral 5L'] } ]
  },

  'limpeza- Lava Loica Maquina': {
    title: 'Lava Loiça Máquina',
    description: 'Detergente para máquina de loiça com ação profunda e brilho impecável em cada lavagem.',
    specs: { 'Volume': '5 L' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Limão/Maquina', 'Secante/Loiça','Lava Loiça Manual/Limão'] } ]
  },

  'limpeza-limpeza-profunda': {
    title: 'Limpeza Profunda',
    description: 'Produto para limpeza pesada, ideal para cozinhas, banheiros e superfícies engorduradas.',
    specs: { 'Volume': '5 L', 'Uso': 'Superfícies difíceis' },
    options: [ { name: 'Aroma', label: 'Aroma', values: [' Desengordurante', 'Gel Lixivia '] } ]
  },

  'limpeza-acido-5l': {
    title: 'Acido De 5L',
    description: 'Ácido potente para remoção de incrustações em piscinas, pisos e áreas externas resistentes.',
    specs: { 'Volume': '5 L', 'Uso': 'Superfícies e Piscinas' },
    options: [ { name: 'Formato', label: 'Formato', values: ['Ácido Clorídrico 33% -5L'] } ]
  },

  'limpeza-acido-1l': {
    title: 'Acido De 1L',
    description: 'Ácido de uso pontual para manchas difíceis e limpeza de superfícies resistentes.',
    specs: { 'Volume': '1 L', 'Uso': 'Superfícies e Piscinas' },
    options: [ { name: 'Formato', label: 'Formato', values: ['Ácido Muriático 70% -1L'] } ]
  },


  'limpeza-cera-liquida': {
    title: 'Cera Líquida',
    description: 'Cera líquida para proteção e brilho de móveis e pisos, oferecendo acabamento anti-derrapante.',
    specs: { 'Volume': '500 ml', 'Uso': 'Madeira/Verniz Antiderrapante' },
    options: [ { name: 'Cor', label: 'Cor', values: ['Incolor'] } ]
  },

  'limpeza-Limpador da KIRIKO ': {
    title: 'Limpa KIRIKO',
    description: 'Limpador multiusos que elimina sujeira e deixa o ambiente fresco sem resíduos pegajosos.',
    specs: { 'Uso':'Limpeza eficaz e frescor' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Limpidor Sanitario 1L', 'Limpidorjuntas 1L','Limpidor Total 750ml'] } ]
  },

  'limpeza-Esfergona Tiras': {
    title: 'Esfergona Tiras',
    description: 'Esfregona em tiras com alta absorção, perfeita para limpar e secar pisos rapidamente.',
    specs: { 'Volume': 'Caixa:12', 'Uso': 'Chão' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Esfergona Tiras/ Amarelas'] } ]
  },

  'limpeza-detergente class': {
    title: 'Detergente Class',
    description: 'Detergente premium para roupa com fórmula suave que protege as fibras e realça as cores.',
    specs: { 'Volume': '22 dosses', 'Uso': 'Roupas' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Talcum', 'Marseille','Bluesoap','Alde Vera'] } ]
  },


  'limpeza-detergente lagarto': {
    title: 'Detergente Lagarto',
    description: 'Detergente intenso para manchas difíceis, ideal para roupas de trabalho e tecidos pesados.',
    specs: { 'Volume': '40 dosses', 'Uso': 'Roupas' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Color', 'Con Jabón','GEl'] } ]
  },

  'limpeza-detergentes': {
    title: 'Detergente Roupa Delicada',
    description: 'Detergente suave para roupas delicadas, cuidando das fibras com limpeza eficiente.',
    specs: { 'Uso': 'Roupas delicadas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['KIRIKO Basico Roupa Limpia-42 Dosses','Skip-85 Dosses','KIRIKO Quita Manchas Colores Intensos-42 Dosses'] } ]
  },

  'limpeza-flota': {
    title: 'Detergente Flota',
    description: 'Detergente concentrado com toque suave e aroma agradável, indicado para o dia a dia.',
    specs: { 'Volume': '5 L', 'Uso': 'Amaciar roupa' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Marselha', 'Oceano','Esencia'] } ]
  },

  'limpeza-gel-kirkico': {
    title: 'Gel KiRIKO',
    description: 'Gel multiuso para cozinha e casa de banho que remove gordura e manchas difíceis com facilidade.',
    specs: { 'Uso': 'Roupas' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['KIRIKO Color-1L', 'IN Oxycolores 2L'] } ]
  },

  'limpeza-Vassora Nº6': {
    title: 'Vassoura Nº6',
    description: 'Vassoura robusta para varrer poeira e detritos em grandes áreas internas e externas.',
    specs: { 'Uso': 'Limpeza de áreas externas e superfícies ásperas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Verde-Canario', 'Azul-RIJA'] } ]
  },

  'limpeza-Vasorões': {
    title: 'Vasorões',
    description: 'Vassourões largos e resistentes para limpeza rápida de pátios, garagens e áreas externas.',
    specs: { 'Volume': '300 ml', 'Uso': 'Móveis' },
    options: [ { name: 'Acabamento', label: 'Acabamento', values: ['Direito', 'Cruvo'] } ]
  },

  'limpeza-Escovas': {
    title: 'Escovas',
    description: 'Escovas duráveis para esfregar superfícies difíceis e manter a limpeza profunda.',
    specs: { 'Volume': '1/caixa', 'Uso': 'Limpeza geral' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Roupa', 'Fato','Unhas'] } ]
  },

  'limpeza-Esfregão Salva Unhas': {
    title: 'Esfregão Salva Unhas',
    description: 'Esfregão ergonómico que protege as unhas enquanto esfrega e remove sujeira intensa.',
    specs: { 'Volume': '1 L', 'Uso': 'Loiça' },
    options: [ { name: 'Concentração', label: 'Concentração', values: ['Rosa:2', 'Amarelo:1/2', 'Azul:3'] } ]
  },



  'limpeza-Lavavajillas': {
    title: 'Lavavajillas',
    description: 'Lavavajillas para limpeza eficaz de louças e utensílios de cozinha.',
    specs: { 'Volume': '750 ml', 'Uso': 'Loiça' },
    options: [ { name: 'Concentração', label: 'Concentração', values: ['Limon', 'Concentrado Mão', 'Concentrado Ultra'] } ]
  },
  

  'limpeza-Lava Loica': {
    title: 'Lava Loiça da In',
    description: 'Detergente para lavar loiça, proporcionando limpeza eficaz e frescor.',
    specs: { 'Volume': '750 ml', 'Uso': 'Loiça' },
    options: [ { name: 'Concentração', label: 'Concentração', values: ['Limon', 'Concentrado'] } ]
  },

  'limpeza-Panos': {
    title: 'Panos de Limpeza',
    description: 'Panos para limpeza eficaz de superfícies sem deixar fiapos.',
    specs: { 'Uso': 'Limpeza geral' },
    options: [ { name: 'Formato', label: 'Formato', values: ['Pano do pó', 'Pano de microfibra'] } ]
  },

  'limpeza-Lava Tudo Da In': {
    title: 'Lava Tudo da In',
    description: 'Lava tudo para limpeza de superfícies, proporcionando limpeza eficaz e frescor.',
    specs: { 'Volume': '2 L', 'Uso': 'Casa' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Lavanda','Montanha','Floral','Pinho'] } ]
  },

  'limpeza-Vassora Nº3': {
    title: 'Vassoura Nº3',
    description: 'Vassoura de cerdas duras para limpeza de áreas externas e superfícies ásperas.',
    specs: { 'Uso': 'Limpeza de áreas externas e superfícies ásperas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Vermelho-Canario', 'Preto-RIJA'] } ]
  },

  'limpeza-Vassora Atlântico': {
    title: 'Vassora Atlântico',
    description: 'Vassora de cerdas duras para limpeza de áreas externas e superfícies ásperas.',
    specs: { 'Uso': 'Limpeza de áreas externas e superfícies ásperas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Verde', 'Azul','Roxo'] } ]
  },

  'limpeza-Vassora De Criança': {
    title: 'Vassoura de Criança',
    description: 'Vassoura de cerdas macias para crianças, ideal para limpeza de áreas internas e superfícies delicadas.',
    specs: {  'Uso': 'Superfícies delicadas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Azul','Cinzento','Laranja','Verde'] } ]
  },

  'limpeza-Limpa Móveis': {
    title: 'Limpa Móveis',
    description: 'Produto para limpeza eficaz de móveis e superfícies internas.',
    specs: {  'Uso': 'Móveis' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Rosa-Toca Plastica', 'Azul-Limpa Móveis Espalmados'] } ]
  },

  'limpeza-Pinsel Especial Direito/Cruvo-Madeira': {
    title: 'Pinsel Especial Direito/Cruvo-Madeira',
    description: 'Pinsel para caiar.',
    specs: { 'Uso': 'Pintura' },
    options: [ { name: 'PH', label: 'pH', values: ['Direito', 'Cruvo'] } ]
  },

  'limpeza-Pinsel Especial Direito/Cruvo-Plastico': {
    title: 'Pinsel Especial Direito/Cruvo-Plastico',
    description: 'Pinsel para caiar.',
    specs: { 'Uso': 'Pintura' },
    options: [ { name: 'PH', label: 'pH', values: ['Direito', 'Cruvo'] } ]
  },

  'limpeza-Pinsel Especial De Madeira/Plastico': {
    title: 'Pinsel Especial De Madeira/Plastico',
    description: 'Pinsel para caiar.',
    specs: {  'Uso': 'Pintura' },
    options: [ { name: 'Aroma', label: 'Aroma', values: ['Azul-Redondo','Roxo-Oval Direito','Verde-Oval Curvo'] } ]
  },

  'limpeza-Espanadores': {
    title: 'Espanadores',
    description: 'Espanadores para limpeza eficaz de superfícies.',
    specs: { 'Uso': 'Limpeza geral' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Verde-Espanador Alto Curvo Nº11 ', ' Azul-Espanador Alto Direito','Verde-Espanador Lava Carros'] } ]
  },

  'limpeza-Esfergonas De Algodão Da Sibina ': {
    title: 'Esfergonas De Algodão Da Sibina ',
    description: 'Esfergonas de algodão para limpeza eficaz de superfícies.',
    specs: { 'Uso': 'Limpeza geral' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Grade', 'Media','Pequena'] } ]
  },

  'limpeza-Sacos Do Lixo De 130L': {
    title: 'Sacos Do Lixo De 130L',
    description: 'Sacos para lixo de 130 litros, ideais para uso doméstico e comercial.',
    specs: { 'Volume': '130 L', 'Uso': 'Lixo' },
    options: [ { name: 'Cor', label: 'Cor', values: ['Amarelo-Quantidade 10 sacos','Verde-Quantidade 10 sacos','Preto-Quantidade 10 sacos'] } ]
  },

  'limpeza-Mopa 45 Cm': {
    title: 'Mopa De Algodão De 45 Cm',
    description: 'Mopa para limpeza eficaz de pisos.',
    specs: { 'Uso': 'Pisos' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Mopa Algodão 45 Cm Recarga','Mopa Algodão 45 Cm com Recarga'] } ]
  },

  'limpeza-Limpa Teto': {
    title: 'Limpa Teto',
    description: 'Produto para limpeza eficaz de tetos e superfícies altas.',
    specs: { 'Uso': 'Tetos' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Azul-Oval', ' Verde-Redondo'] } ]
  },









  'fert-terra': {
    title: 'Terra Vegetal 25kg',
    description: 'Terra vegetal de alta qualidade para plantio e enriquecimento do solo.',
    specs: { 'Peso': '25 kg', 'Uso': 'Vasos e horta' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['25kg'] } ]
  },

  'fert-adubo': {
    title: 'Esturme de Cavalo 50L',
    description: 'Adubo orgânico de origem animal para solos férteis e plantas saudáveis.',
    specs: { 'Volume': '50 L', 'Uso': 'Solo e plantações' },
    options: [ { name: 'Formato', label: 'Formato', values: ['50L'] } ]
  },

  'fert-composto': {
    title: 'Cloreto de potássio',
    description: 'Fertilizante mineral rico em potássio para maior resistência das plantas.',
    specs: { 'Peso': '227g', 'Uso': 'Adubação de plantas' },
    options: [ { name: 'Tipo', label: 'Tipo', values: [ '227g' ] } ]
  },

  'fert-corretivo': {
    title: 'Corretivo Agrícola Orgânico',
    description: 'Corretivo para ajustar o pH do solo e melhorar a saúde das culturas.',
    specs: { 'Volume': '50 L', 'Uso': 'Solo acidificado' },
    options: [ { name: 'Aplicação', label: 'Aplicação', values: ['50L'] } ]
  },

  'fert-esterco-curtido': {
    title: 'Esterco Curtido',
    description: 'Esterco curtido de alta qualidade para enriquecer o solo lentamente.',
    specs: { 'Peso': '1 kg', 'Uso': 'Solo orgânico' },
    options: [ { name: 'Propriedade', label: 'Propriedade', values: ['1kg'] } ]
  },

  'fert-esterco-vaca-25kg': {
    title: 'Esterco de Vaca Granulado 25kg',
    description: 'Esterco de vaca granulado pronto para uso no jardim e horta.',
    specs: { 'Peso': '25 kg', 'Uso': 'Horta e canteiros' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['25kg'] } ]
  },

  'fert-farinha': {
    title: 'Farinha de Osso',
    description: 'Fonte de fósforo natural para raízes fortes e floração abundante.',
    specs: { 'Peso': 'Em caixa', 'Uso': 'Plantas floridas' },
    options: [ { name: 'Dosagem', label: 'Dosagem', values: ['Em caixa'] } ]
  },

  'fert-hummus': {
    title: 'Hummus de Minhoca',
    description: 'Húmus orgânico que melhora a textura do solo e a capacidade de retenção de água.',
    specs: { 'Peso': '3L', 'Uso': 'Horta e vasos' },
    options: [ { name: 'Aplicação', label: 'Aplicação', values: ['3L'] } ]
  },

  'fert-nitrofoska': {
    title: 'Nitrofoska 25kg',
    description: 'Fertilizante NPK completo para crescimento equilibrado das plantas.',
    specs: { 'Peso': '25 kg', 'Uso': 'Adubo geral' },
    options: [ { name: 'Concentração', label: 'Concentração', values: ['25kg'] } ]
  },

  'fert-peters': {
    title: 'Peters Professional Plant Starter',
    description: 'Fertilizante profissional para estimular o crescimento inicial das plantas.',
    specs: { 'Volume': '20 L', 'Uso': 'Plantas jovens' },
    options: [ { name: 'Formato', label: 'Formato', values: ['20L'] } ]
  },

  'fert-organico': {
    title: 'Adubo Osmocote 1kg',
    description: 'Adubo de liberação controlada para nutrição prolongada de plantas.',
    specs: { 'Peso': '1 kg', 'Uso': 'Plantas em vaso' },
    options: [ { name: 'Duração', label: 'Duração', values: ['1kg'] } ]
  },

  'fert-sulfato': {
    title: 'Sulfato de amônio',
    description: 'Fonte rápida de nitrogênio para vegetação verde e vigorosa.',
    specs: { 'Peso': '1 kg', 'Uso': 'Adubação nitrogenada' },
    options: [ { name: 'Aplicação', label: 'Aplicação', values: ['1kg'] } ]
  },

  'fert-superfosfato': {
    title: 'Superfosfato simples',
    description: 'Fertilizante fosfatado para desenvolvimento de raízes e flores.',
    specs: { 'Peso': '2 kg', 'Uso': 'Floração e frutificação' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['2kg'] } ]
  },

  'fert-terra-10l': {
    title: 'Terra 10L',
    description: 'Terra de qualidade em saco de 10 litros para vasos e jardineiras.',
    specs: { 'Volume': '10 L', 'Uso': 'Vasos' },
    options: [ { name: 'Quantidade', label: 'Quantidade', values: ['10L'] } ]
  },

  'fert-terra-25l': {
    title: 'Terra 25L',
    description: 'Terra de alta qualidade em saco de 25 litros para jardinagem.',
    specs: { 'Volume': '25 L', 'Uso': 'Jardim' },
    options: [ { name: 'Quantidade', label: 'Quantidade', values: ['25L'] } ]
  },

  'fert-ureia': {
    title: 'Ureia',
    description: 'Fertilizante nitrogenado concentrado para promoção da folhagem.',
    specs: { 'Peso': '4 kg', 'Uso': 'Solo' },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['4kg'] } ]
  },

  'fert-yara-kristalon': {
    title: 'Yara Kristalon 25kg',
    description: 'Fertilizante solúvel premium para nutrição equilibrada de plantas.',
    specs: { 'Peso': '25 kg', 'Uso': 'Fertirrigação' },
    options: [ { name: 'Concentração', label: 'Concentração', values: ['25kg'] } ]
  },

  'fert-yaramila-cafe': {
    title: 'YaraMila café',
    description: 'Fertilizante especial para culturas de café e plantas frutíferas.',
    specs: { 'Peso': '25 kg', 'Uso': 'Culturas específicas' },
    options: [ { name: 'Cultura', label: 'Cultura', values: ['25kg'] } ]
  },

  'fert-yaramila-complex': {
    title: 'YaraMila complex',
    description: 'Mistura complexa para nutrição equilibrada de culturas diversas.',
    specs: { 'Peso': '25 kg', 'Uso': 'Culturas diversas' },
    options: [ { name: 'Aplicação', label: 'Aplicação', values: ['25kg'] } ]
  },

  'fert-yaramila-faster': {
    title: 'YaraMila Faster',
    description: 'Fertilizante de ação rápida para estímulo de crescimento imediato.',
    specs: { 'Peso': '25 kg', 'Uso': 'Crescimento rápido' },
    options: [ { name: 'Velocidade', label: 'Velocidade', values: ['25kg'] } ]
  },

  'fert-yaramila-olivo': {
    title: 'YaraMila Olivo',
    description: 'Fertilizante formulado para oliveiras e culturas mediterrâneas.',
    specs: { 'Peso': '25 kg', 'Uso': 'Oliveiras' },
    options: [ { name: 'Cultura', label: 'Cultura', values: ['25kg'] } ]
  },

  'fert-yaramila-maizestar': {
    title: 'YaraMila maizestar',
    description: 'Fertilizante específico para milho e culturas de cereais.',
    specs: { 'Peso': '25 kg', 'Uso': 'Milho' },
    options: [ { name: 'Cultura', label: 'Cultura', values: ['25kg'] } ]
  },

  'fert-yaramila-saco-50kg': {
    title: 'Saco 50kg de Fertilizantes YARAMILA',
    description: 'Saco de 50 kg com fertilizante YaraMila para grandes áreas agrícolas.',
    specs: { 'Peso': '50 kg', 'Uso': 'Agricultura' },
    options: [ { name: 'Formato', label: 'Formato', values: ['50kg'] } ]
  },

  'fert-nitrato-calcio': {
    title: 'Nitrato de cálcio',
    description: 'Fertilizante solúvel para fortalecer raízes e melhorar a resistência.',
    specs: { 'Peso': '1 kg', 'Uso': 'Horticultura' },
    options: [ { name: 'Nutrição', label: 'Nutrição', values: ['1kg'] } ]
  },









'plastico-alguidares': {
    title: 'Alguidares de Plástico',
    description: 'Alguidares de plástico para proteção de plantas e jardineiras.',
    specs: {
      'Volume': 'Vários tamanhos disponíveis',
      'Material': 'Plástico resistente',
    },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['0', '1', '2', '3'] } ]
  },


  'plastico-balde-construcao': {
    title: 'Balde de Construção',
    description: 'Balde de construção de plástico para uso em obras.',
    specs: {
      'Capacidade': 'Vários tamanhos',
      'Material': 'Plástico resistente',
      'Uso': 'Obras e construção'
    },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['10L', '15L'] } ]
  },

  'plastico-balde-redondo': {
    title: 'Balde Redondo de Plástico',
    description: 'Balde redondo de plástico para uso doméstico.',
    specs: {
      'Capacidade': '12L',
      'Material': 'Plástico resistente',
      'Uso': 'Limpeza e armazenamento'
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Verde', 'Azul', 'Vermelho', 'Rosa', 'Cinza'] } ]
  },

  'plastico-baldes-ovais': {
    title: 'Baldes Ovais de Plástico',
    description: 'Balde de forma oval em plástico resistente para diversos usos.',
    specs: {
      'Capacidade': '15L',
      'Material': 'Plástico reforçado',
      'Uso': 'Limpeza e armazenamento'
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Verde', 'Azul', 'Vermelho', 'Rosa', 'Cinza'] } ]
  },

  'plastico-cesta-armazenamento': {
    title: 'Cesta de Armazenamento de Plástico',
    description: 'Cesta plástica versátil para organização em casa ou obra.',
    specs: {
      'Dimensões': 'Médio (35x25x20 cm)',
      'Material': 'Plástico resistente',
      'Ventilação': 'Com furos laterais'
    },
    options: [ { name: 'Tipo', label: 'Tipo', values: [ 'Grande'] } ]
  },

  'plastico-acafate': {
    title: 'Açafate Plástico',
    description: 'Cesta para a roupa seca.',
    specs: {
      'Dimensões': '60 x 40 x 10 cm',
      'Material': 'Polietileno de alta densidade',
      'Uso': 'Armazenamento'
    },
    options: [ { name: 'Capacidade', label: 'Capacidade', values: ['Azul', 'Verde', 'Vermelho', 'Rosa', 'Cinza'] } ]
  },

  'plastico-funil': {
    title: 'Funil Plástico',
    description: 'Funil de plástico para oleos e líquidos, ideal para uso doméstico e automotivo.',
    specs: {
      'Capacidade': '2L',
      'Material': 'Plástico resistente a químicos',
      'Tipo': 'Com filtro para líquidos'
    },
    options: [ { name: 'Volume', label: 'Volume', values: ['2L'] } ]
  },

  'plastico-conjunto-pa-lixo': {
    title: 'Conjunto Pá Do Lixo com Espanador',
    description: 'Conjunto prático para limpeza, com pá do lixo e espanador de plástico resistente.',
    specs: {
      'Material': 'Plástico reforçado',
    },
    options: [ { name: 'Tipo', label: 'Tipo', values: ['Azul', 'Verde', 'Preto', 'Rosa', 'Cinza'] } ]
  },

  'plastico-escova-sanitaria': {
    title: 'Escova Sanitária com Suporte de Plástico',
    description: 'Escova sanitária com suporte de plástico resistente para limpeza eficaz do banheiro.',
    specs: {
      'Material': 'Plástico resistente',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Azul', 'Branco', 'Preto','Rosa'] } ]
  },

  'plastico-escova-sem-suporte': {
    title: 'Escova Sanitária sem Suporte',
    description: 'Escova sanitária sem suporte de plástico resistente para limpeza eficaz do banheiro.',
    specs: {
      'Material': 'Plástico resistente',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Branco'] } ]
  },




  'higiene-guardanapo': {
    title: 'Guardanapo',
    description: 'Guardanapo de qualidade para uso doméstico.',
    specs: {
      'Material': 'Papel macio',
      'Uso': 'Refeições e limpeza leve',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Branco'] } ]
  },

  'higiene-algodao': {
    title: 'Algodão',
    description: 'Algodão de qualidade para uso doméstico.',
    specs: {
      'Material': 'Papel macio',
      'Uso': 'Cuidados pessoais e limpeza leve',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Branco'] } ]
  },
  'higiene-esponja': {
    title: 'Esponja Redonda',
    description: 'Esponja de lavagem do corpo.',
    specs: {
      'Uso': 'Lavagem Corporal',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Verde'] } ]
  },


  'higiene-esponja-massagem': {
    title: 'Esponja de Banho para Massagem',
    description: 'Esponja de banho com textura suave para massagens.',
    specs: {
      'Uso': 'Massagem',
    },
    options: [ { name: 'Cor', label: 'Cor', values: ['Rosa', 'Azul'] } ]
  },

  'higiene-gel-banho': {
    title: 'Gel de Banho',
    description: 'Gel cremoso para banho diário com suavidade e perfume.',
    specs: {
      'Volume': '750 ml',
      'Tipo': 'Cremoso',
      'Indicação': 'Pele normal e seca'
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Dermo', 'Rosa', 'Baunilha', 'Frutos Vermelhos', 'Coco'] },
    ]
  },

  'higiene-pasta-dentes': {
    title: 'Pasta de Dentes',
    description: 'Pasta de dentes com flúor para uma limpeza eficaz.',
    specs: {
      'Volume': '60 g',
      'Benefício': 'Proteção contra cáries',
      'Uso': 'Higiene bucal diária'
    },
    options: [
      { name: 'Tipo', label: 'Tipo', values: ['Couto'] }
    ]
  },
  'higiene-rolo-cozinha': {
    title: 'Rolo de Cozinha',
    description: 'Rolo de papel higiénico macio e resistente.',
    specs: {
      'Folhas': '2 camadas',
      'Uso': 'Uso doméstico'
    },
    options: [
      { name: 'Pacote', label: 'Pacote', values: ['2 rolos'] },
    ]
  },
  'higiene-sabonete-liquido': {
    title: 'Sabonete Líquido',
    description: 'Sabonete líquido para uso diário com ação limpeza e hidratação.',
    specs: {
      'Volume': '500 ml',
      'Tipo': 'Líquido',
      'Uso': 'Uso diário',
    },
    options: [
      { name: 'Aroma', label: 'Aroma', values: ['Pêssego', 'Kiwi', 'Manga', 'Cereja', 'Gelado', 'Maçã', 'Aveia', 'Glicerina'] },
    ]
  },
  'higiene-sabonete': {
    title: 'Sabonete',
    description: 'Sabonete sólido natural para uso diário.',
    specs: {
      'Peso': '100 g',
      'Tipo': 'Sólido',
      'Uso': 'Uso diário',
    },
    options: [
      { name: 'Tipo', label: 'Tipo', values: ['Moisture Care', 'Refreshing Moisture', 'Balanced & Mild', 'Nourishing Sensation', 'Delicate Care', 'Irresistible Touch', 'Radiant Softness', 'Sabonete Leite de Cabra'] },
    ]
  },

  'droga-cal-5kg': {
    title: 'Cal Hidratada 5kg',
    description: 'Cal hidratada de alta qualidade para construção e jardinagem.',
    specs: {
      'Peso': '5 kg',
      'Uso': 'Construção e jardinagem'
    },
    options: [ { name: 'Peso', label: 'Peso', values: ['5kg'] } ]
  },

  'droga-cal-em-pasta': {
  title: 'Cal Hidratada 5L',
  description: 'Cal hidratada de alta qualidade para construção.',
  specs: {
    'Peso': '5 L',
    'Uso': 'Construção'
  },
  options: [ { name: 'Volume', label: 'Volume', values: ['5L'] } ]
  },
  
  'droga-carvao-vegetal-2kg': {
  title: 'Carvão Vegetal 2Kg',
  description: 'Carvão vegetal de alta qualidade para churrasco.',
  specs: {
    'Peso': '2 kg',
    'Uso': 'Churrasco'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['2kg'] } ]
  },  
  'droga-carvao-vegetal-3kg': {
  title: 'Carvão Vegetal 3Kg',
  description: 'Carvão vegetal de alta qualidade para churrasco.',
  specs: {
    'Peso': '3 kg',
    'Uso': 'Churrasco'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['3kg'] } ]
  },  
  'droga-carvao-vegetal-5kg': {
  title: 'Carvão Vegetal 5Kg',
  description: 'Carvão vegetal de alta qualidade para churrasco.',
  specs: {
    'Peso': '5 kg',
    'Uso': 'Churrasco'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['5kg'] } ]
  },  
  'droga-shampoo': {
  title: 'Shampoo para Cães',
  description: 'Shampoo de alta qualidade para cães.',
  specs: {
    'Peso': '5 kg',
    'Uso': 'Higiene'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['5kg'] } ]
  },  
  'droga-cola-para-madeira': {
  title: 'Cola para Madeira',
  description: 'Cola de alta qualidade para colagem de madeira.',
  specs: {
    'Peso': '250g',
    'Uso': 'Construção'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['250g'] } ]
  },  
  'droga-creolina': {
  title: 'Creolina em Garrafa',
  description: 'Creolina de alta qualidade para uso em construção.',
  specs: {
    'Peso': '1 L',
    'Uso': 'Construção'
  },
  options: [ { name: 'Volume', label: 'Volume', values: ['1 L'] } ]
  },  
  'droga-creolina-lata': {
  title: 'Creolina em Lata',
  description: 'Creolina de alta qualidade para uso em construção.',
  specs: {
    'Peso': '1 L',
    'Uso': 'Construção'
  },
  options: [ { name: 'Volume', label: 'Volume', values: ['1 L'] } ]
  },
  'droga-petroleo': {
  title: 'Petroleo 1 Litro',
  description: 'Petroleo de alta qualidade para uso em construção.',
  specs: {
    'Peso': '1 L',
    'Uso': 'Construção'
  },
  options: [ { name: 'Volume', label: 'Volume', values: ['1 L'] } ]
  },
  'droga-petroleo-5l': {
  title: 'Petroleo 5 Litros',
  description: 'Petroleo de alta qualidade para uso em construção.',
  specs: {
    'Peso': '5 L',
    'Uso': 'Construção'
  },
  options: [ { name: 'Volume', label: 'Volume', values: ['5 L'] } ]
  },
  'droga-sebo-calçado': {
  title: 'Sebo para Calçado',
  description: 'Sebo de alta qualidade para uso em calçado.',
  specs: {
    'Peso': '250g',
    'Uso': 'Calçado'
  },
  options: [ { name: 'Peso', label: 'Peso', values: ['250g'] } ]
  }

};

// Lê o carrinho do localStorage. Retorna um objeto vazio se não existir.
function getCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) || {};
  } catch (error) {
    console.error('Erro ao ler o carrinho do armazenamento:', error);
    return {};
  }
}

// Salva o carrinho atualizado no localStorage.
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Calcula o total de itens do carrinho.
function getCartTotalItems(cart) {
  return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
}

// Atualiza o contador visível do carrinho em todas as páginas.
function updateCartCount() {
  const cart = getCart();
  const total = getCartTotalItems(cart);
  const countElements = document.querySelectorAll('.cart-count');
  countElements.forEach((el) => {
    el.textContent = total;
  });
}

// Cria uma chave única para o item de carrinho, incluindo opções escolhidas.
function createCartItemKey(productId, options) {
  if (!options || Object.keys(options).length === 0) {
    return productId;
  }
  const sortedKeys = Object.keys(options).sort();
  const optionString = sortedKeys.map((key) => `${key}=${options[key]}`).join('|');
  return `${productId}|${optionString}`;
}

// Formata as opções escolhidas em texto para exibição no carrinho.
function formatOptionDescription(options) {
  if (!options || Object.keys(options).length === 0) {
    return '';
  }
  return Object.entries(options)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

// Mostra uma mensagem temporária de confirmação ao adicionar um produto.
function showCartMessage(productName) {
  const message = document.getElementById('cartMessage');
  if (!message) return;
  message.textContent = `${productName} adicionado ao carrinho.`;
  setTimeout(() => {
    message.textContent = '';
  }, 2000);
}

// Adiciona o produto ao carrinho, criando ou atualizando a quantidade.
function addToCart(productId, productName, productPrice, options = {}) {
  const cart = getCart();
  const itemKey = createCartItemKey(productId, options);

  if (!cart[itemKey]) {
    cart[itemKey] = {
      id: itemKey,
      productId,
      name: productName,
      price: productPrice,
      quantity: 0,
      options,
      description: formatOptionDescription(options)
    };
  }

  cart[itemKey].quantity += 1;
  saveCart(cart);
  updateCartCount();
  showCartMessage(productName);
}

// Ajusta a quantidade de um item no carrinho e remove se ficar a zero.
function changeCartQuantity(productId, delta) {
  const cart = getCart();
  if (!cart[productId]) return;

  cart[productId].quantity += delta;
  if (cart[productId].quantity <= 0) {
    delete cart[productId];
  }

  saveCart(cart);
  updateCartCount();
  renderCartItems('cartSummary');
}

// Remove completamente um item do carrinho.
function removeCartItem(productId) {
  const cart = getCart();
  if (!cart[productId]) return;

  delete cart[productId];
  saveCart(cart);
  updateCartCount();
  renderCartItems('cartSummary');
}

// Limpa todo o carrinho e atualiza a interface.
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartCount();
  renderCartItems('cartSummary');
}

// Renderiza a lista de itens no carrinho, incluindo opções escolhidas.
function renderCartItems(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cart = getCart();
  const products = Object.values(cart);

  if (products.length === 0) {
    container.innerHTML = '<p>O carrinho está vazio.</p>';
    return;
  }

  let html = '<table class="cart-table"><thead><tr><th>Produto</th><th class="price-cell">Preço</th><th class="quantity-cell">Quantidade</th><th class="actions-cell">Ações</th></tr></thead><tbody>';

  let totalValue = 0;
  products.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalValue += itemTotal;
    html += `<tr>
      <td>
        <strong>${item.name}</strong>
        ${item.description ? `<div class="item-options">${item.description}</div>` : ''}
      </td>
      <td class="price-cell">${item.price.toFixed(2)}€</td>
      <td class="quantity-cell">${item.quantity}</td>
      <td class="actions-cell">
        <button type="button" onclick="changeCartQuantity('${item.id}', -1)">-</button>
        <button type="button" onclick="changeCartQuantity('${item.id}', 1)">+</button>
        <button type="button" onclick="removeCartItem('${item.id}')">Remover</button>
      </td>
    </tr>`;
  });

  html += `</tbody></table>
    <p class="cart-total">Total: ${totalValue.toFixed(2)}€</p>
    <div class="cart-finalize">
      <button type="button" class="checkout-button" onclick="finalizePurchase()">Finalizar compra</button>
    </div>`;
  container.innerHTML = html;
}

// Renderiza o resumo do carrinho na página de checkout.
function renderCheckoutSummary(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cart = getCart();
  const products = Object.values(cart);

  if (products.length === 0) {
    container.innerHTML = '<p>O carrinho está vazio.</p>';
    return;
  }

  let totalValue = 0;
  let html = '<table class="cart-table"><thead><tr><th>Produto</th><th class="price-cell">Preço</th><th class="quantity-cell">Quantidade</th><th class="price-cell">Total</th></tr></thead><tbody>';

  products.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalValue += itemTotal;
    html += `<tr>
      <td>
        <strong>${item.name}</strong>
        ${item.description ? `<div class="item-options">${item.description}</div>` : ''}
      </td>
      <td class="price-cell">${item.price.toFixed(2)}€</td>
      <td class="quantity-cell">${item.quantity}</td>
      <td class="price-cell">${itemTotal.toFixed(2)}€</td>
    </tr>`;
  });

  html += `</tbody></table>
    <p class="cart-total">Total: ${totalValue.toFixed(2)}€</p>`;
  container.innerHTML = html;
}

// Define a URL de checkout correta dependendo da página atual.
function getCheckoutPageUrl() {
  const path = window.location.pathname;
  if (path.includes('/carrinho/')) {
    return 'checkout.html';
  }
  return 'carrinho/checkout.html';
}

// Inicia a compra, redirecionando para a página de checkout se o carrinho não estiver vazio.
function finalizePurchase() {
  const cart = getCart();
  if (Object.keys(cart).length === 0) {
    alert('O carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    return;
  }
  window.location.href = getCheckoutPageUrl();
}

// Cria um conjunto de detalhes genéricos para produtos que não têm definição específica.
function defaultProductDetails(productName, productPrice) {
  return {
    title: productName,
    description: 'Escolha as características desejadas antes de adicionar ao carrinho.',
    specs: {
      'Preço base': `${productPrice.toFixed(2)}€`,
      'Medidas': 'Ver especificações abaixo'
    },
    options: [
      { name: 'Variante', label: 'Variante', values: ['Padrão'] }
    ]
  };
}

// Retorna os detalhes do produto por ID, ou um padrão se não existir.
function getProductDetails(productId, productName, productPrice) {
  return PRODUCT_DETAILS[productId] || defaultProductDetails(productName, productPrice);
}

// Cria o modal de detalhes do produto uma única vez no DOM.
function createProductDetailsModal() {
  if (document.getElementById('productDetailsModal')) return;

  const modal = document.createElement('div');
  modal.id = 'productDetailsModal';
  modal.className = 'product-details-modal hidden';
  modal.innerHTML = `
    <div class="modal-backdrop" id="productDetailsBackdrop"></div>
    <div class="modal-box">
      <button type="button" class="modal-close" id="closeDetailsModal">×</button>
      <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
        <img id="productDetailsImage" src="" alt="" style="width:160px;height:auto;border-radius:8px;object-fit:cover;display:none;margin-right:12px" />
        <div style="flex:1;min-width:200px">
          <h2 id="productDetailsTitle"></h2>
          <p id="productDetailsDescription"></p>
        </div>
      </div>
      <div id="productDetailsSpecs" class="product-specs"></div>
      <form id="productDetailsForm" class="product-details-form"></form>
      <div class="modal-actions">
        <button type="button" class="checkout-button" id="addDetailsToCart">Adicionar ao carrinho</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Fechar modal quando o utilizador clica no X ou no fundo escuro.
  document.getElementById('closeDetailsModal').addEventListener('click', closeProductDetailsPopup);
  document.getElementById('productDetailsBackdrop').addEventListener('click', closeProductDetailsPopup);
  document.getElementById('addDetailsToCart').addEventListener('click', onProductDetailsAdd);
}

let activeProductDetails = null;

function setupPageButtonToggle(buttonId, targetId) {
  const button = document.getElementById(buttonId);
  const target = document.getElementById(targetId);
  if (!button || !target) return;

  button.addEventListener('click', () => {
    const isShown = target.style.display === 'block';
    if (isShown) {
      target.style.display = 'none';
      return;
    }

    // Ao abrir esta secção, fechar as outras secções do menu para melhor UX.
    const otherIds = ['menuList', 'contatosTable', 'historyBox', 'infoBox'];
    otherIds.forEach(id => {
      if (id === targetId) return;
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    target.style.display = 'block';
  });
}

function setupPageButtons() {
  setupPageButtonToggle('menuButton', 'menuList');
  setupPageButtonToggle('contatosButton', 'contatosTable');
  setupPageButtonToggle('historiaButton', 'historyBox');
  setupPageButtonToggle('informacaoButton', 'infoBox');
}

// Abre o popup de detalhes do produto e preenche as informações dinâmicas.
function openProductDetailsPopup(productId, productName, productPrice) {
  const details = getProductDetails(productId, productName, productPrice);
  activeProductDetails = { productId, productName, productPrice, details };
  createProductDetailsModal();

  // Preencher título e descrição
  document.getElementById('productDetailsTitle').textContent = details.title;
  document.getElementById('productDetailsDescription').textContent = details.description;

  // Tentar inserir imagem do card correspondente (procura por h3 igual ao nome)
  const cards = Array.from(document.querySelectorAll('.product-card'));
  let imgSrc = '';
  for (const c of cards) {
    const h = c.querySelector('h3');
    if (!h) continue;
    if (h.textContent.trim() === productName || h.textContent.trim().includes(productName)) {
      const img = c.querySelector('img');
      if (img && img.getAttribute('src')) { imgSrc = img.getAttribute('src'); break; }
    }
  }

  const imgEl = document.getElementById('productDetailsImage');
  if (imgSrc) {
    imgEl.src = imgSrc;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
    imgEl.src = '';
  }

  const specsContainer = document.getElementById('productDetailsSpecs');
  specsContainer.innerHTML = Object.entries(details.specs)
    .map(([key, value]) => `<div class="spec-row"><strong>${key}:</strong> ${value}</div>`)
    .join('');

  const form = document.getElementById('productDetailsForm');
  const options = Array.isArray(details.options) ? details.options : [];
  const optionsHtml = options
    .map((option) => {
      return `<label class="option-field">
        <span>${option.label}</span>
        <select name="${option.name}">
          ${Array.isArray(option.values) ? option.values.map((value) => `<option value="${value}">${value}</option>`).join('') : ''}
        </select>
      </label>`;
    })
    .join('');

  form.innerHTML = optionsHtml || '<p class="no-options">Nenhuma opção adicional disponível.</p>';

  document.getElementById('productDetailsModal').classList.remove('hidden');
}

// Fecha o modal de detalhes do produto.
function closeProductDetailsPopup() {
  const modal = document.getElementById('productDetailsModal');
  if (!modal) return;
  modal.classList.add('hidden');
  activeProductDetails = null;
}

// Adiciona o produto com as opções selecionadas ao carrinho.
function onProductDetailsAdd() {
  if (!activeProductDetails) return;

  const form = document.getElementById('productDetailsForm');
  const formData = new FormData(form);
  const options = {};
  formData.forEach((value, key) => {
    if (value) options[key] = value;
  });

  addToCart(activeProductDetails.productId, activeProductDetails.productName, activeProductDetails.productPrice, options);
  closeProductDetailsPopup();
}

// Extrai productId, name e preço do atributo onclick do botão + Adicionar.
function parseAddButton(button) {
  const onclick = button.getAttribute('onclick') || '';
  const match = onclick.match(/addToCart\('([^']+)',\s*'([^']+)',\s*([0-9]+(?:\.[0-9]+)?)\)/);
  if (!match) return null;
  return {
    productId: match[1],
    productName: match[2],
    productPrice: parseFloat(match[3])
  };
}

// Cria e insere um botão "Ver mais" em cada card de produto.
function setupProductDetailsButtons() {
  const cards = document.querySelectorAll('.product-card');
  function slugify(text) {
    return (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[ -\u007F]/g, function(c){return c;})
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  cards.forEach((card) => {
    if (card.querySelector('.details-button')) return;

    // Tenta obter dados a partir do botão de adicionar
    const addButton = card.querySelector('button[onclick^="addToCart"]');
    let productInfo = null;
    if (addButton) productInfo = parseAddButton(addButton);

    // Se parse falhar, extrai do DOM (h3 e p)
    if (!productInfo) {
      const nameEl = card.querySelector('h3');
      const priceEl = card.querySelector('p');
      const productName = nameEl ? nameEl.textContent.trim() : 'Produto';
      let productPrice = 0;
      if (priceEl) {
        const m = priceEl.textContent.match(/([0-9]+(?:\.[0-9]+)?)/);
        if (m) productPrice = parseFloat(m[1]);
      }
      const productId = card.dataset.productId || slugify(productName) || 'produto-unknown';
      productInfo = { productId, productName, productPrice };
    }

    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'details-button';
    detailsButton.textContent = 'Ver mais';
    detailsButton.addEventListener('click', () => {
      openProductDetailsPopup(productInfo.productId, productInfo.productName, productInfo.productPrice);
    });

    // Inserir após o botão de adicionar se existir, caso contrário no final do card
    if (addButton) addButton.insertAdjacentElement('afterend', detailsButton);
    else card.appendChild(detailsButton);
  });
}

// Inicializa as funcionalidades de carrinho e detalhes ao carregar a página.
function initializeCartFeatures() {
  updateCartCount();
  setupPageButtons();
  setupProductDetailsButtons();
  createProductDetailsModal();
}

window.addEventListener('load', initializeCartFeatures);