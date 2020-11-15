---
title: 'Introducción a JAMStack'
description: 'El JAM-Stack es una nueva arquitectura para la creación de aplicaciones web, la cual busca poder hacer proyectos mucho mas rápidos, con alta seguridad y que puedan escalar de una manera muy sencilla. JAM son las siglas de JavaScript, APIs y Markup y su principal características es que la lógica de la aplicación se encuentra en el cliente y no en el servidor.'
date: 2020-04-26T03:00:00-03:00
tags: ['web-development']
hero_image: '/images/introduccion-a-jamstack/introduccion_a_jamstack.png'
introduction:
  {
    title: 'Introducción',
    anchor: 'introduccion',
    content: 'Antes de empezar a hablar de _JAMStack_, es muy necesario desglosar un poco la palabra en dos: **JAM** y **Stack** y así explicarlas por separado',
  }
image_introduction: /images/introduccion-a-jamstack/jam-stack.jpg
sections:
  [
    { title: 'Introducción', anchor: 'introduccion' },
    { title: '¿Qué es un Stack?', anchor: 'que-es-un-stack' },
    { title: '¿Qué es JAM?', anchor: 'que-es-jam' },
    { title: 'Buena idea', anchor: 'buena-idea' },
    { title: 'No tan buena idea', anchor: 'no-tan-buena-idea' },
    { title: 'Consideraciones finales', anchor: 'consideraciones-finales' },
    { title: 'Para seguir investigando', anchor: 'para-seguir-investigando' },
  ]
---

<h2 id="que-es-un-stack">¿Qué es un Stack?</h2>

Un stack en programación a una colección de tecnologías configuradas para trabajar entre si. Creo y sin miedo a equivocarme que el stack más conocido es el de **LAMP**-Stack (Por sus siglas de **L**inux, **A**pache, **M**ySQL y **P**hp). Otro stack muy conocido es el **MEAN**-Stack que viene de las tecnologías **M**ongoDB, **E**xpress, **A**ngular y **N**odejs. Posteriormente, con la aparición de **React**, se crea un nuevo stack ques es básicamente el mismo que el anterior, pero esta vez, cambiamos Angular por React. quedando como **MERN**-Stack. Con la aparición de Vuejs, este último stack sufrió un último cambio, cambiando a React por Vue, y por un momento el stack se llamó **MEVN** hasta que la comunidad re-ordenó las siglas quedando con el nombre de **VEN**o**M**.

![stacks](/images/introduccion-a-jamstack/stacks.png)

<h2 id="que-es-jam">¿Qué es JAM?</h2>

JAM es una palabra que está compuesta por tres palabras. La **J** viene de _JavaScript_, la **A** viene de _API_ y la **M** viene de _Markup compilado_.

Con **JavaScript** se busca que la lógica de la aplicación se ejecute en el **Frontend** y no en el **Backend** como tradicionalmente se trabaja en una aplicación web.

Las **APIs** se refieren a la o a las fuentes de datos que se utilizarán para la aplicación. Tradicionalmente utilizábamos las base de datos como fuentes de información, ahora, con esta forma de desarrollo, tendremos una o muchas APIs haciendo consultas a la información.

Cuando hablamos de **Markup compilado**, nos referimos a las vistas compiladas o generadas una sola vez, en vez de hacerlo con cada respuesta al momento de hacer la consulta al servidor (como tradicionalmente se hace).

![jamstack - siglas](/images/introduccion-a-jamstack/jam.png)

<h2 id="buena-idea">Buena idea</h2>

Como en todas las arquitecturas de desarrollo, el JAM funcionará mejor en algunos proyectos que en otros. No por eso vamos a encasillar a que SOLO en estos tipos de proyectos JAM funcionará , pero si es una información a considerar.

Creo que el escenario más popular para implementar este stack son los **Blog**s o las **páginas web personales de presentación** ya que esta arquitectura va muy bien con aplicaciones que no se actualizan constantemente o páginas donde la actualización de la información corresponde a una nueva vista. También funciona bastante bien con aplicaciones de
ventas en linea, considerando que bajo esta estructura, el tiempo de respuesta al mostrar una vista en el navegador es mucho más rápida (ya que la vista está compilada/creada y el servidor solo tiene que encontrar el archivo y devolverlo al navegador). Otros escenarios donde el stack de JAM puede servir son las **landing pages** y los **sitios de documentación**

![ejemplos](/images/introduccion-a-jamstack/paginas-de-ejemplo.png)

<h2 id="no-tan-buena-idea">No tan buena idea</h2>

A diferencia del punto anterior, este stack no está recomendado para sitio web donde tienen muchas páginas (muchas! - ejemplo **wikipedia**) o donde su información es actualizada constantemente, esto debido a que los proyectos realizados con JAM necesariamente deben pasar por un proceso de compilación lo cual puede ser un proceso que tome bastante tiempo y si son muchas, muchas, **muchas** páginas, mantenerlas puede ser un proceso muy complicado. Una consideración adicional es saber si es que la aplicación depende de variables que no se pueden compilar ya que se desconocen sus valores, ejemplo de estos son _Los datos del usuario que inició sesión_.

<h2 id="consideraciones-finales">Consideraciones finales</h2>

Recuerda que las tecnologías deben de ser tomadas con prudencia y que las "normas" no están escritas en piedra. El que hoy en día algo no sea recomendado, no significa que nunca lo será, ya que las tecnologías avanzan día a día a pasos agigantados. Lo que queda es poder investigar y utilizar las arquitecturas según los requerimientos del negocio.

<h2 id="para-seguir-investigando">Para seguir investigando</h2>

Si te interesó el nuevo stack y quieres seguir investigando por tu cuenta, te recomiendo los siguientes sitios de interés:

- [Sitio web JAMStack](https://jamstack.org/)
- [Netlify](https://www.netlify.com/)
- [Gatsby](https://www.gatsbyjs.org/)
- [NextJS](https://nextjs.org/)
- [Versel](https://vercel.com/)
- [Sitios que utilizan JAMStack](https://www.gatsbyjs.org/showcase/)
