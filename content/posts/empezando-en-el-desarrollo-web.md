---
title: 'Empezando en el desarrollo web'
description: 'Si estás leyendo esto es por que te interesa o quieres aprender sobre desarrollo web. Este artículo te ayudará a clarificar todas tus dudas (espero), mostrando lo básico necesario que debes manejar, dando un recorrido por los tecnisismos, lenguajes/tecnologías necesarias,
entre otros.'
date: 2021-01-28T20:00:00-03:00
tags: ['introduction', 'web-development']
hero_image: '/images/articles/introduccion-a-jamstack/introduccion-a-jamstack.png'
thumbnail_image: '/images/articles/introduccion-a-jamstack/thumbnail.png'
with_introduction: true
image_introduction: '/images/articles/introduccion-a-jamstack/jam-stack.png'
introduction:
  {
    title: 'Introducción',
    anchor: 'introduccion',
    content: 'A continuación aprenderemos los conociminetos mínimos necesarios para iniciarnos en el mundo del desarrollo web. **¡Comenzemos!**',
  }
sections:
  [
    { title: 'Introducción', anchor: 'introduccion', childrens: [
      { title: "FrontEnd", anchor: "front" },
      { title: "Backend", anchor: "back" },
      { title: "API", anchor: "api" },
      { title: "EndPoint", anchor: "endpoint" },
      { title: "Verbos HTTP", anchor: "verbos-http" },
      { title: "Local y Producción", anchor: "local-producción" },
      { title: "Cloud Computing", anchor: "cloud-computing" }
    ]},
    { title: 'Términos utilizados', anchor: 'terminos-utilizados' },
    { title: 'HTML', anchor: 'html' },
    { title: 'CSS', anchor: 'css' },
    { title: 'Javascript', anchor: 'js' },
    { title: 'Git/Github', anchor: 'git-github' },
    { title: '¿Qué sigue?', anchor: "que-sigue" }
  ]
---

<h2 id="terminos-utilizados">Términos utilizados</h2>

Antes de aprender cualquier cosa, es muy necesario dar un recorrido por algúnos términos que nos encontraremos en toda esta travesía. Es por eso que esta sección aprenderemos esos conceptos que pueden parecer un poco difíciles en un comienzo, pero a medida que vayamos aprendiendo, nos iremos familiarizando cada vez mas.

_**FrontEnd:**_ El Frontend o _front_ (para los amigos) es todo lo visíble dentro de un sitio web. Con ésto nos referimos a textos, colores, botones, imágenes, formularios, etc.
Ejemplo de ésto son los títulos que ves dentro de este mismo artículo, el texto que estas leyendo, el índice que está arriba (si estás leyendo esto desde un celular) o en la parte izquierda de la pantalla (si estás en dispositivos mas grandes). Las técnologías necesarias para manejar el front son: **HTML**, **CSS** y **Javascript**.

_**Backend:**_ El Backend o _Back_, en su contraparte con el front, es la lógica que hay detrás de todo el sitio web. Es acá donde accedemos a la base de datos y manejamos todo el **core** (núcleo) que existe. Ejemplo de esto es la sección de _suscribirse_ que está en éste mismo artículo, donde luego de llenar un formulario muy pequeño (tu nombre y tu correo) y hacer click en el botón **Suscribirse**, te llegará un correo agradeciendote y con esto, quedas en un lista donde te llegará un mail avisandote cuando suba nuevo contenido en éste sitio. Algunos de los lenguajes que se utilizan en el Backend son: **Java**, **PHP**, **Javascript**, **Go**, **Python**, **Ruby**, por nombrar algunos.

_**API:**_ _**A**pplication **P**rogramming **I**nterface_ o en español **Interfaz de Programación de Aplicaciones** es un nexo, una interconección en la que dos aplicaciones o servicios se comunican mediante procesos. Una API es básicamente, en nuestro contexto, un conjunto de funciones que hacen operaciones repetitivas, así en vez de estar haciendo siempre lo mismo, lo hacemos solo una vez y luego lo exponemos para que otro sistema pueda utilizarlo.

_**EndPoint:**_ Este concepto va muy de la mano con el anterior ya que éste es el punto de entrada hacia una operación en específico de nuestra API. En simples palabras, un endpoint es una url donde dependiendo del verbo http que le pasemos, hará una acción. Ejemplo: Si queremos acceder a toda la información que tiene Belén en un sitio web cualqueira, tendríamos que hacerlo consultando al endpoint `http://misuperaplicacion.com/usuario/belen` con el verbo **GET**, de esta manera podríamos conocer su fecha de nacimiento, nombre completo y toda la información que Belén haya guardado en esa aplicación.

_**Verbos HTTP:**_ Son un conjunto de, como dice su nombre, verbos que nos permiten realizar acciones específicas a nuestra API ya que para un mismo Endpoint se pueden hacer distintas operaciones diferenciandolas mediante el protocolo o verbo. Los más conocidos (y los que probablemente más utilicemos en nuestro día a día) son **GET**, **POST**, **PUT**, **DELETE** (existen más), donde _GET_ lo utilizamos solo para obtener información, _POST_ siempre lo utilizaremos para la creación de nueva información, el método _PUT_ nos permite actualizar información (y en caso de que no exista, la crea) y _DELETE_ para eliminar: Ejemplo: Concideremos el mismo endpoint anterior `http://misuperaplicacion.com/usuario/belen`. Si quiero acceder a la información de Belén, lo hacemos con GET, pero si queremos modificar su información, lo tenemos que hacer con PUT. Así también en caso de que queramos eliminar su información, lo haremos utilizando el método DELETE, todo esto utilizando el mismo endpoint.

_**Local y Producción:**_ Otros términos que también vamos a encontrar en nuestro día a día, serán _**local**_ y _**producción**_ (pueden existir muchos más, estos van a depender del equipo con el que se trabaje) y hacen referencia al lugar donde está funcionando o donde está corriendo el sitio web o aplicación que estemos desarrollando. Si hablamos de _Local_ nos estamos refiriendo a nuestra propia máquina/equipo donde estaremos desarrollando la mayor parte del tiempo (digo mayor porque hoy en día existen alternativas donde podems escribir código directamente en el servidor donde tengamos nuestro sitio web o aplicaciión)

_**Cloud Computing:**_ O también llamado como Cloud solamente, es y de manera muy simple, una tecnología que permite el acceso remoto a software, almacenamiento de archivos y poder procesar datos utilizando internet, de esta manera podemos prescindir de su ejecución en un computado personal o servidor local. Algunos servicios Cloud son: <a href="https://aws.amazon.com/es/" target="_blank">Amazon Web Services</a> (AWS), <a href="https://cloud.google.com/?hl=es" target="_blank">GCP</a> (GCP) y <a href="https://azure.microsoft.com/es-es/" target="_blank">Azure</a>.

<h2 id="html">HTML</h2>

**H**yper**T**ext **M**arkup **L**anguage _(lenguaje de marcado de hipertexto)_ o simplemente **HTML** es el lenguaje que utilizamos para la creación de una página web, definiendo la estructura base mediante etiquetas y escribiendo el texto que posteriormente aparecerá en nuetro sitio. (te dejo un link para que puedas revisar más <a href="https://developer.mozilla.org/es/docs/HTML/HTML5/HTML5_lista_elementos" target="_blank">etiquetas de html</a>). También es importante mencionar que hoy en día existen pre-procesadores de html como: **Pug** (antes llamado **Jade**), **Slim**, **Haml**, entre otros.

A continuación veremos el mínimo código que necesitamos para tener una página web funcionando correctamente:

```html
<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Nuevo documento</title>
	</head>
	<body>
		<p>Acá va todo el contenido de una página web</p>
	</body>
</html>
```

<h2 id="css">CSS</h2>

**C**ascading **S**tyle**S**heets _(Hojas de estilo en cascada)_ es el lenguaje que nos permite dar el diseño visual de nuestra página web, esto significa dar colores, tipos de fuentes, cambiar el formato del texto, cambiar el tamaño de la fuente, y mucha sotras cosas más. Cabe mencionar que esto no es un curso de lenguajes, si no que solo una guía de introducción al desarrollo web. En css tambien existen pre-procesadores que nos ayudan al momento de escribir nuestro código, alguno de ellos son: **SASS**, **Stylus**, **LESS** y **PostCSS**.

```css
.soy-una-clase {
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	color: #0a3f66;
	background-color: #247f86;
}
```

<h2 id="js">Javascript</h2>

Javascript, o solo **JS**, es un lenguaje de programación (a diferencia de los dos anteriores), el cual nos permite implementar funciones complejas a nuestra página, esto significa que cada que que el usuario quiera hacer alguna interacción con nuestro sitio, más allá de solo leer información, necesitaremos de su poder para llevarlos a cabo. Acá podemos pensar desde validaciones a formulario (cada vez que el usuario escriba algo en una página revisar que esté bien escrito o que cumpla con cierto criterio) como cosas mas complejas como animar graficos 2D o 3D. También es el encargado de hacer consultas a una o muchas APIs, ordenar la información obtenida y trabajar con ella pero en el front. A continuación veremos un trozo de código el cual obtiene lo que un usuario escribió en un input (concidere `Google` como referencia, donde tenemos una caja de texto con un ID _input_ y el botón _"Buscar en Google"_ con un ID _buscar_).

```js
const _boton = document.querySelector('#buscar');

boton.addEventListener('click', () => {
	const _texto = document.querySelector('#input').value;

	irABuscarInformacion(cajaDeTexto);
});
```

El ejemplo anterior describe lo siguiente:

- Hacemos una referencia del botón y lo llamamos **\_boton**
- Luego le decimos que cuando el usuario haga click en el botón, ejecute una función que hace lo siguiente:
- 1. Obtiene el valor de la caja de texto y lo guarda en una variable llamada **\_texto**
- 2. Llama una función llamada **irABuscarInformacion** la cual se encarga de ir a buscar lo que el usuario esta buscando, pasandole como argumento (lo que está entre parentesis) el texto que el usuario escribió previamente.

<h2 id="git-github">Git/Github</h2>

De manera resumida, <a href="https://git-scm.com/" target="_blank">Git</a> es una forma de poder llevar una versión del código que vamos desarrollando de forma distribuida. Si trabajamos solos, es un poco dificil ver el caso de uso de esta herramienta, pero cuando trabajamos colaborativamente con mas programadores (la cual debería ser en su mayoria), se vuelve una necesidad ya que podremos ir generando un historial del código que vamos creando, compartiendola con las personas con las que trabajemos.

Por otro lado, <a href="https://github.com/" target="_blank">Github</a> es un sitio web el cual nos permite guardar este código versionado tanto públicos como privados. Es acá donde distintos desarrolladores y desarrolladoras pueden observar nuestro código y contribur con el mismo si así lo quisieran.

<h2 id="que-sigue">¿Qué sigue?</h2>

A pesar de que hemos hablado de muchas cosas, aún no hemos aprendido nada. Lo que sigue es empezar a estudiar todo lo que hablamos anteriormente pero wait, no tiene que ser todo de una vez (ya que para comenzar es bastante), definamos primero que es lo que queremos hacer primero, si irnos por el camino de Front, o seguir el camino del Back, luego aprender los lenguajes con los que se trabajan dentro de esas dos ramas e ir poco a poco aprendiendo más y más.

Si te gustaría que hiciera un articulo hablando más en profundidad alguno de los puntos que mencioné anteriormente, me puedes dejar un mensaje en la sección de comentarios 😊. También puedes suscribirte, así te podré informar cada vez que publique un nuevo artículo 😎.
