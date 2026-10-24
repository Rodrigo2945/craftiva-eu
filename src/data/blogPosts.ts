export type Lang = 'pt' | 'en' | 'es';

export interface BlogPost {
  id: string;
  category: 'tips' | 'stories' | 'news' | 'guides';
  author: string;
  date: string;
  image: string;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  body: Record<Lang, string[]>;
}

export function langOf(code: string | undefined): Lang {
  if (code?.startsWith('en')) return 'en';
  if (code?.startsWith('es')) return 'es';
  return 'pt';
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    category: 'guides',
    author: 'Maria Silva',
    date: '2026-03-25',
    image: '/demo/mug.jpg',
    title: {
      pt: 'Vender cerâmica a lojas: o que muda face à venda ao público',
      en: 'Selling ceramics to shops: what changes from retail',
      es: 'Vender cerámica a tiendas: qué cambia frente al público',
    },
    excerpt: {
      pt: 'MOQ, preço desde e prazos de fornada. Um guia curto para oficinas que querem falar com lojas sem transformar a banca num armazém.',
      en: 'MOQ, from-prices and kiln schedules. A short guide for studios that want to talk to shops without becoming a warehouse.',
      es: 'MOQ, precio desde y plazos de horno. Una guía breve para talleres que quieren hablar con tiendas.',
    },
    body: {
      pt: [
        'Uma loja não compra uma caneca. Compra um lote que caiba numa prateleira e que se reponha sem telefonemas todas as semanas. Por isso o anúncio na Craftiva começa pelo MOQ e por um preço «desde», não por um botão de checkout.',
        'O preço «desde» é uma referência grossista para a peça base. Se o vidrado, o diâmetro ou a marca da loja mudam o trabalho, isso discute-se no pedido. Escreve na ficha o que está incluído e o que fica de fora, para a primeira mensagem não ser uma renegociação.',
        'O prazo deve caber numa fornada real. Três semanas que na prática são seis estragam a relação mais depressa do que um preço alto. Se a oficina só aceita um lote de cada vez, diz isso. As lojas boas preferem um não claro a uma data imaginada.',
      ],
      en: [
        'A shop does not buy one mug. It buys a run that fits a shelf and can be reordered without a weekly phone call. That is why a Craftiva listing starts with an MOQ and a from-price, not a checkout button.',
        'The from-price is a wholesale reference for the base piece. If glaze, size or the shop’s mark changes the work, that belongs in the order request. Write down what is included so the first message is not a renegotiation.',
        'Lead time has to fit a real kiln schedule. Three weeks that become six will end the relationship faster than a high price. If the studio can only fire one batch at a time, say so.',
      ],
      es: [
        'Una tienda no compra una taza. Compra un lote que quepa en un estante y se pueda reponer sin llamadas cada semana. Por eso el anuncio en Craftiva empieza por el MOQ y un precio «desde», no por un botón de pago.',
        'El precio «desde» es una referencia al por mayor de la pieza base. Si el esmalte, el diámetro o la marca de la tienda cambian el trabajo, eso se habla en el pedido. Escribe qué está incluido.',
        'El plazo tiene que caber en una hornada real. Tres semanas que en la práctica son seis rompen la relación antes que un precio alto. Si el taller solo acepta un lote cada vez, dilo.',
      ],
    },
  },
  {
    id: '2',
    category: 'stories',
    author: 'Ana Costa',
    date: '2026-03-20',
    image: '/demo/scarf.jpg',
    title: {
      pt: 'Um tear, um MOQ de quinze e uma loja em Antuérpia',
      en: 'One loom, an MOQ of fifteen, and a shop in Antwerp',
      es: 'Un telar, un MOQ de quince y una tienda en Amberes',
    },
    excerpt: {
      pt: 'Como um lenço tecido em Lisboa chegou a uma loja belga sem catálogo de duzentas referências.',
      en: 'How a scarf woven in Lisbon reached a Belgian shop without a catalogue of two hundred styles.',
      es: 'Cómo un pañuelo tejido en Lisboa llegó a una tienda belga sin un catálogo de doscientas referencias.',
    },
    body: {
      pt: [
        'A oficina tem um tear. Não tem um departamento comercial. Durante anos vendeu lenços um a um, em feiras, e recusou lojas porque «não dava para produzir tanto». O que faltava não era capacidade. Era um número.',
        'Quinze lenços por cor, quatro semanas, preço desde trinta euros. Com isso uma loja em Antuérpia percebeu o risco e fez o primeiro pedido. O segundo veio no fim da estação, pela mesma ficha, sem renegociar o desenho.',
        'A história não é um conselho para crescer. É um exemplo de que uma coleção curta, com MOQ escrito, chega mais longe do que uma página cheia de peças únicas sem condição de encomenda.',
      ],
      en: [
        'The studio has one loom and no sales department. For years it sold scarves one by one at fairs and turned shops away because “we could not make that many”. What was missing was a number, not capacity.',
        'Fifteen scarves per colour, four weeks, from thirty euros. A shop in Antwerp could see the risk and placed a first order. The second came at the end of the season, on the same sheet, without redrawing the pattern.',
        'This is not advice to scale. A short collection with a written MOQ travels further than a page of one-off pieces with no order terms.',
      ],
      es: [
        'El taller tiene un telar y ningún departamento comercial. Durante años vendió pañuelos de uno en uno y rechazó tiendas porque «no daba para tanto». Lo que faltaba era un número, no capacidad.',
        'Quince pañuelos por color, cuatro semanas, precio desde treinta euros. Una tienda de Amberes entendió el riesgo e hizo el primer pedido. El segundo llegó al final de la temporada, con la misma ficha.',
        'No es un consejo para crecer. Una colección corta, con el MOQ escrito, llega más lejos que una página de piezas únicas sin condición de pedido.',
      ],
    },
  },
  {
    id: '3',
    category: 'tips',
    author: 'Elena Volkov',
    date: '2026-03-15',
    image: '/demo/bowl.jpg',
    title: {
      pt: 'O que uma loja lê nos primeiros dez segundos da ficha',
      en: 'What a buyer reads in the first ten seconds',
      es: 'Qué lee una tienda en los primeros diez segundos',
    },
    excerpt: {
      pt: 'Foto, cidade, MOQ e preço desde. O resto da descrição só é lido se estes quatro estiverem claros.',
      en: 'Photo, city, MOQ and from-price. The rest of the description is read only if those four are clear.',
      es: 'Foto, ciudad, MOQ y precio desde. El resto solo se lee si esos cuatro están claros.',
    },
    body: {
      pt: [
        'O comprador de uma loja pequena abre dezenas de fichas. Fica na que mostra a peça inteira, o nome de quem a faz, a cidade, a quantidade mínima e um preço de partida. Se falta um destes, a ficha parece um anúncio de classificados e é fechada.',
        'A descrição serve para o que a foto não diz: o que está incluído no preço, o que muda o prazo, como a peça é embalada. «Feito com amor» não ajuda a calcular uma encomenda. «Vidrado incluído, diâmetro maior sob consulta» ajuda.',
        'A verificação da Craftiva confirma origem europeia e produção artesanal. Não substitui a ficha. Uma oficina verificada com MOQ por escrever continua a ser difícil de encomendar.',
      ],
      en: [
        'A buyer at a small shop opens dozens of listings. They stay on the one that shows the whole piece, who made it, the city, the minimum quantity and a starting price. Miss one of those and the page feels like a classified ad.',
        'The description is for what the photo cannot say: what the price includes, what changes the lead time, how the piece is packed. “Made with love” does not help anyone place an order. “Glaze included, larger diameter on request” does.',
        'Craftiva’s verified mark confirms European origin and handmade production. It does not replace the sheet. A verified studio with no MOQ is still hard to order from.',
      ],
      es: [
        'Quien compra para una tienda pequeña abre decenas de fichas. Se queda en la que muestra la pieza entera, quién la hace, la ciudad, la cantidad mínima y un precio de partida. Si falta uno de esos datos, la ficha parece un clasificado.',
        'La descripción sirve para lo que la foto no dice: qué incluye el precio, qué cambia el plazo, cómo se embala. «Hecho con amor» no ayuda a calcular un pedido. «Esmalte incluido, diámetro mayor bajo consulta» sí.',
        'La verificación de Craftiva confirma origen europeo y producción artesanal. No sustituye la ficha. Un taller verificado sin MOQ sigue siendo difícil de encargar.',
      ],
    },
  },
  {
    id: '4',
    category: 'guides',
    author: 'Luca Rossi',
    date: '2026-03-10',
    image: '/demo/pendant.jpg',
    title: {
      pt: 'Preço desde: como o calcular sem te arrependeres do lote',
      en: 'From-prices: how to set one you can live with',
      es: 'Precio desde: cómo calcularlo sin arrepentirte del lote',
    },
    excerpt: {
      pt: 'O preço de feira não é o preço de quinze peças iguais. Uma conta simples para joalharia e outras oficinas pequenas.',
      en: 'A fair price is not the price of fifteen identical pieces. A simple sum for jewellery and other small studios.',
      es: 'El precio de feria no es el precio de quince piezas iguales. Una cuenta sencilla para joyería y talleres pequeños.',
    },
    body: {
      pt: [
        'O preço de uma peça única na feira inclui o tempo de contar a história. Num lote, esse tempo desaparece e aparece outro: repetir, controlar medidas, embalar, escrever a factura. O preço «desde» tem de pagar os dois mundos, não só o primeiro.',
        'Uma forma prática: tempo de uma peça isolada, tempo de a repetir dentro do MOQ, materiais, uma margem para a peça que sai torta, e o custo de chegar à loja. Divide pelo número de peças do lote mínimo. Esse número é o chão. O preço publicado pode estar acima. Não deve estar abaixo.',
        'Se a loja pedir gravação ou outra corrente, isso não cabe no «desde». Diz a diferença na resposta ao pedido, antes de aceitares a encomenda.',
      ],
      en: [
        'A one-off fair price includes the time spent telling the story. In a batch that time goes away and another appears: repeating, checking measurements, packing, invoicing. The from-price has to pay for both, not only the first.',
        'A practical sum: time for a single piece, time to repeat it inside the MOQ, materials, a margin for the piece that comes out wrong, and the cost of reaching the shop. Divide by the minimum batch. That number is the floor.',
        'If the shop asks for an engraving or a different chain, it is not inside the from-price. Say the difference when you answer the request, before you accept the order.',
      ],
      es: [
        'El precio de una pieza única en la feria incluye el tiempo de contar la historia. En un lote ese tiempo desaparece y aparece otro: repetir, controlar medidas, embalar, facturar. El precio «desde» tiene que pagar los dos, no solo el primero.',
        'Una cuenta práctica: tiempo de una pieza, tiempo de repetirla dentro del MOQ, materiales, un margen para la pieza que sale mal y el coste de llegar a la tienda. Divide por el lote mínimo. Ese número es el suelo.',
        'Si la tienda pide un grabado u otra cadena, eso no entra en el «desde». Di la diferencia al responder al pedido, antes de aceptar.',
      ],
    },
  },
  {
    id: '5',
    category: 'tips',
    author: 'Inês Duarte',
    date: '2026-03-05',
    image: '/demo/tile.jpg',
    title: {
      pt: 'Fotografar uma peça para quem compra vinte',
      en: 'Photographing a piece for someone buying twenty',
      es: 'Fotografiar una pieza para quien compra veinte',
    },
    excerpt: {
      pt: 'A foto de montra mostra o objecto. A foto de encomenda mostra a escala, o verso e o lote.',
      en: 'A window photo shows the object. An order photo shows scale, the back and the batch.',
      es: 'La foto de escaparate muestra el objeto. La foto de pedido muestra la escala, el reverso y el lote.',
    },
    body: {
      pt: [
        'Uma loja precisa de perceber o tamanho sem uma régua na imagem, mas com uma referência: a peça na mão, ao lado de um prato, ou um conjunto de quatro. O recorte muito fechado esconde a escala e gera devoluções de expectativa, mesmo quando não há devolução física.',
        'Mostra o verso, a marca, o vidrado por dentro. Se cada peça do lote varia, fotografa três juntas. Essa variação é um argumento, não um defeito, desde que a loja a veja antes de pedir.',
        'Luz de janela chega. O que não chega é um filtro que muda o verde do vidrado. A cor da foto deve ser a cor da caixa.',
      ],
      en: [
        'A shop needs to understand size. A tight crop hides scale. Show the piece in a hand, next to a plate, or as a set of four.',
        'Show the back, the mark, the glaze inside. If each piece in the batch varies, photograph three together. That variation is a selling point only if the buyer sees it before ordering.',
        'Window light is enough. A filter that changes the green of the glaze is not. The colour in the photo should be the colour in the box.',
      ],
      es: [
        'Una tienda necesita entender el tamaño. Un recorte muy cerrado esconde la escala. Muestra la pieza en una mano, junto a un plato o en un conjunto de cuatro.',
        'Muestra el reverso, la marca, el esmalte por dentro. Si cada pieza del lote varía, fotografía tres juntas. Esa variación es un argumento solo si la tienda la ve antes de pedir.',
        'La luz de una ventana basta. Un filtro que cambia el verde del esmalte, no. El color de la foto tiene que ser el color de la caja.',
      ],
    },
  },
  {
    id: '6',
    category: 'guides',
    author: 'Tiago Almeida',
    date: '2026-03-01',
    image: '/demo/spoons.jpg',
    title: {
      pt: 'Madeira europeia, dita com o nome certo',
      en: 'European wood, named properly',
      es: 'Madera europea, dicha con el nombre correcto',
    },
    excerpt: {
      pt: 'Oliveira, carvalho, faia. O que uma loja pergunta antes de aceitar um lote de cozinha.',
      en: 'Olive, oak, beech. What a shop asks before accepting a kitchen batch.',
      es: 'Olivo, roble, haya. Lo que una tienda pregunta antes de aceptar un lote de cocina.',
    },
    body: {
      pt: [
        '«Madeira natural» não chega. A loja quer o nome da espécie, a origem e o acabamento. Óleo alimentar não é o mesmo que verniz. Um utensílio de cozinha com o acabamento errado não entra na prateleira, por muito bem talhado que esteja.',
        'Se a madeira é de poda de olival europeu, escreve isso. Se é sobra de marcenaria de móvel, escreve isso também. A origem faz parte da verificação e faz parte da confiança de quem revende.',
        'O MOQ de um conjunto deve contar conjuntos. Doze colheres soltas e doze conjuntos de três não são a mesma encomenda, nem o mesmo porte.',
      ],
      en: [
        '“Natural wood” is not enough. The shop wants the species, the origin and the finish. Food-safe oil is not varnish. A kitchen tool with the wrong finish does not reach the shelf.',
        'If the wood is prunings from a European olive grove, write that. If it is offcuts from furniture making, write that too. Origin is part of verification and part of what a reseller can say.',
        'The MOQ of a set should count sets. Twelve loose spoons and twelve sets of three are not the same order, or the same freight.',
      ],
      es: [
        '«Madera natural» no basta. La tienda quiere la especie, el origen y el acabado. El aceite alimentario no es barniz. Un utensilio de cocina con el acabado equivocado no entra en la estantería.',
        'Si la madera es de poda de olivar europeo, escríbelo. Si es resto de ebanistería, escríbelo también. El origen forma parte de la verificación y de lo que puede decir quien revende.',
        'El MOQ de un conjunto debe contar conjuntos. Doce cucharas sueltas y doce juegos de tres no son el mismo pedido ni el mismo porte.',
      ],
    },
  },
  {
    id: '7',
    category: 'tips',
    author: 'Klara Berg',
    date: '2026-02-25',
    image: '/demo/soap.jpg',
    title: {
      pt: 'Cosmética em lote: ingredientes, cura e caixa de vinte e quatro',
      en: 'Cosmetics in a batch: ingredients, cure and a box of twenty-four',
      es: 'Cosmética en lote: ingredientes, curado y una caja de veinticuatro',
    },
    excerpt: {
      pt: 'O que enviar junto com o primeiro pedido para uma loja não ter de adivinhar o rótulo.',
      en: 'What to send with the first order so a shop does not have to guess the label.',
      es: 'Qué enviar con el primer pedido para que la tienda no tenga que adivinar la etiqueta.',
    },
    body: {
      pt: [
        'Uma loja de cosmética pergunta pelos ingredientes antes de perguntar pelo cheiro. Envia a lista completa, o alergénio se existir, e o tempo de cura. «Natural» não é uma ficha técnica.',
        'O MOQ de vinte e quatro existe porque é uma caixa que a loja abre e põe na prateleira. Se o sabonete precisa de mais quatro semanas de cura, o prazo da ficha tem de o dizer. A data de produção viaja com a caixa.',
        'A Craftiva não vende o sabonete ao consumidor final e não verifica alegações de pele. Quem publica a ficha é responsável pelo que a loja vai repetir ao cliente.',
      ],
      en: [
        'A cosmetics shop asks for ingredients before it asks about the scent. Send the full list, any allergen, and the cure time. “Natural” is not a specification.',
        'An MOQ of twenty-four exists because that is a box the shop can open onto a shelf. If the soap needs four more weeks of cure, the listing has to say so. The make date travels with the box.',
        'Craftiva does not sell the soap to the end customer and does not check skin claims. Whoever publishes the sheet is responsible for what the shop will repeat.',
      ],
      es: [
        'Una tienda de cosmética pregunta por los ingredientes antes que por el olor. Envía la lista completa, el alérgeno si existe y el tiempo de curado. «Natural» no es una ficha técnica.',
        'El MOQ de veinticuatro existe porque es una caja que la tienda abre y pone en la estantería. Si el jabón necesita cuatro semanas más de curado, el plazo de la ficha tiene que decirlo.',
        'Craftiva no vende el jabón al consumidor final ni comprueba alegaciones sobre la piel. Quien publica la ficha responde por lo que la tienda va a repetir.',
      ],
    },
  },
  {
    id: '8',
    category: 'news',
    author: 'Equipa Craftiva',
    date: '2026-02-20',
    image: '/demo/rug.jpg',
    title: {
      pt: 'Sem dropshipping, com encomenda',
      en: 'No dropshipping. Orders instead',
      es: 'Sin dropshipping, con pedido',
    },
    excerpt: {
      pt: 'O que a Craftiva está a construir: um catálogo curto de oficinas europeias, não um mercado de revenda anónima.',
      en: 'What Craftiva is building: a short catalogue of European studios, not an anonymous resale market.',
      es: 'Lo que Craftiva está construyendo: un catálogo corto de talleres europeos, no un mercado de reventa anónima.',
    },
    body: {
      pt: [
        'Há mercado de sobra para quem reenvia uma peça que não fez. Não é este. A Craftiva lista oficinas europeias que produzem o que anunciam, com quantidade mínima e um preço de partida.',
        'Hoje o pedido de encomenda abre uma conversa. O pagamento e a factura fazem-se entre a loja e a oficina. A plataforma não cobra comissão nesta fase. Se isso mudar, será dito antes, nos termos e a quem já tem conta.',
        'O catálogo que vês quando a base de dados ainda não responde é uma coleção de demonstração, marcada como tal. Serve para perceber a forma do site. Não é stock.',
      ],
      en: [
        'There is already a market for resending a piece you did not make. This is not it. Craftiva lists European studios that produce what they advertise, with a minimum quantity and a starting price.',
        'Today an order request opens a conversation. Payment and the invoice happen between the shop and the studio. The platform does not take a commission at this stage. If that changes, it will be said first, in the terms and to people who already have an account.',
        'The catalogue you see when the database does not answer is a demonstration collection, labelled as such. It shows the shape of the site. It is not stock.',
      ],
      es: [
        'Ya hay mercado para reenviar una pieza que no hiciste. Este no es. Craftiva lista talleres europeos que producen lo que anuncian, con cantidad mínima y un precio de partida.',
        'Hoy el pedido abre una conversación. El pago y la factura se hacen entre la tienda y el taller. La plataforma no cobra comisión en esta fase. Si eso cambia, se dirá antes, en los términos y a quien ya tiene cuenta.',
        'El catálogo que ves cuando la base de datos no responde es una colección de demostración. Sirve para entender la forma del sitio. No es stock.',
      ],
    },
  },
  {
    id: '9',
    category: 'stories',
    author: 'Nuria Soler',
    date: '2026-02-15',
    image: '/demo/basket.jpg',
    title: {
      pt: 'Seis bolsas, não seiscentas',
      en: 'Six bags, not six hundred',
      es: 'Seis bolsos, no seiscientos',
    },
    excerpt: {
      pt: 'Porque um MOQ baixo e honesto vale mais do que um número grande copiado de um catálogo industrial.',
      en: 'Why a low, honest MOQ is worth more than a big number copied from an industrial catalogue.',
      es: 'Por qué un MOQ bajo y honesto vale más que un número grande copiado de un catálogo industrial.',
    },
    body: {
      pt: [
        'Seis bolsas é o que a banca consegue coser sem atrasar as encomendas que já tem. Publicar um MOQ de cinquenta, porque «fica mais profissional», seria mentir. A loja que precisa de cinquenta vai a outro sítio. A loja que precisa de seis encontra aqui uma resposta que se cumpre.',
        'O preço desde cobre a pele, o forro, a linha e o tempo. A cor que não está na foto não está no preço. Diz-se no pedido.',
        'Verificada, nesta ficha, quer dizer que a peça é feita na oficina de Valência e não comprada para revenda. Não quer dizer que todas as peles do lote sejam iguais. A variação vê-se na fotografia de três peças, quando a loja a pede.',
      ],
      en: [
        'Six bags is what the bench can sew without delaying orders it already has. Publishing an MOQ of fifty because it “looks more professional” would be a lie. The shop that needs fifty will go elsewhere. The shop that needs six gets an answer that can be kept.',
        'The from-price covers the leather, the lining, the thread and the time. A colour that is not in the photo is not in the price. It is said in the request.',
        'Verified, on this sheet, means the piece is made in the Valencia studio and not bought in for resale. It does not mean every hide in the batch matches. The variation is in a photograph of three pieces, when the shop asks for it.',
      ],
      es: [
        'Seis bolsos es lo que el banco puede coser sin retrasar los pedidos que ya tiene. Publicar un MOQ de cincuenta porque «queda más profesional» sería mentir. La tienda que necesita cincuenta irá a otro sitio. La que necesita seis encuentra aquí una respuesta que se cumple.',
        'El precio desde cubre la piel, el forro, el hilo y el tiempo. El color que no está en la foto no está en el precio. Se dice en el pedido.',
        'Verificada, en esta ficha, quiere decir que la pieza se hace en el taller de Valencia y no se compra para revender. No quiere decir que todas las pieles del lote sean iguales.',
      ],
    },
  },
];

export function findBlogPost(id: string | undefined): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}
