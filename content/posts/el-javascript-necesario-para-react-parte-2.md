---
title: 'El Javascript necesario para React - Parte 2'
description: 'Hoy continuaremos revisando esas características de JavaScript que no ayudarán al momento de estar desarrollando en 
React. Revisaremos Funciones, Default Parameters, Rest Parameters y Destructuring. Aprendamos juntos lo que JavaScript tiene 
para enseñarnos.'
date: 2021-03-01T13:36:33-03:00
tags: ['introduction', 'javascript', 'react']
hero_image: '/images/articles/el-javascript-necesario-para-react/parte-2/el-javascript-necesario-para-react-parte-2.png'
thumbnail_image: '/images/articles/el-javascript-necesario-para-react/parte-2/thumbnail.png'
with_introduction: true
introduction:
  {
    title: 'Introducción',
    anchor: 'introduccion',
    content: 'Porque no hay deuda que no se cumpla, acá llega la segunda parte del JavaScript necesario para React. Hoy nos 
    enfocaremos en todo lo que JS tiene para ofrecernos en **funciones**, viendo como podemos declararlas, sus argumentos y 
    como trabajar con estos últimos. _¡Ya cada vez falta menos!_',
  }
sections:
  [
    { title: 'Introducción', anchor: 'introduccion' },
    { title: 'Funciones', anchor: 'funciones' },
    { title: 'Default Parameters', anchor: 'default-parameters' },
    { title: 'Rest Parameters', anchor: 'rest-parameters' },
    { title: 'Destructuring', anchor: 'destructuring' },
    { title: 'Última parte', anchor: 'ultima-parte' },
  ]
---

<h2 id="funciones">Funciones</h2>

Actualmente, JavaScript posee dos formas de poder declarar funciones. La primera se le conoce como **Funciones tradicionales** y se
caracterizan por utilizar la palabra reservada `function`. Por otra parte, tenemos las **Funciones flecha** o **Arrow functions** las
cuales se pueden distinguir por utilizar los **paréntesis**, el **signo igual** acompañado de un **mayor que** y **paréntesis** (por lo general).

<h3>Funciones tradicionales</h3>

A continuación veremos un ejemplo de como crear una **función anónima**. Esta es la manera simple de crear una función, pero
tiene un inconveniente, y es que no se puede volver a utilizar, ya que no posee un nombre al cual hacer referencia. 😅

```javascript
function (a, b) {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
}
```

Ahora bien, existen dos maneras de escribir una función y que esta tenga un nombre para así poder llamarla en cualquier otra
parte de nuestro código y las vamos a aprender con los siguientes ejemplos. Cabe mencionar que esto promueve una buena práctica,
ya que escribiremos nuestra función una única vez y la llamaremos cada vez que la necesitemos, evitando así la repetición de código. 💛

```javascript
function pitagoras(a, b) {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
}

console.log(pitagoras(3, 4)); // Output: 5
```

```javascript
const pitagoras = function (a, b) {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
};

console.log(pitagoras(3, 4)); // Output: 5
```

¡Wow! Si nos damos cuenta, las dos formas son muy similares. La primera es asignando un nombre directamente a la función y
la segunda es creando una variable (como lo vimos en la
<a href="https://eduardoalvarez.dev/articulos/el-javascript-necesario-para-react-parte-1" target="_blank" rel="noopener noreferrer">
El JavaScript necesario para React - Parte 1</a>) y asignarle una función anónima... Entonces ¿Cuál utilizamos? Y la respuesta
es: **La que quieras** 😁, ya que no hay una diferencia sustancial entre una y la otra. Aun que con lo que vamos a ver ahora,
vas a querer utilizar las **arrow functions** siempre 😮.

<h3>Funciones flechas</h3>

Esta nueva manera de escribir funciones nace con la nueva implementación de **ECMAScript 6**, la cual hace que las funciones
sea más expresivas e incluso podremos escribir menos código (¡yeeeey!). La sintaxis de las funciones flechas es la siguiente:
**Paréntesis** seguido de un **signo igual que** que es acompañado de un **signo mayor que** y finalizamos con **llaves** (aun que
veremos que podremos obviar las llaves). A continuación transformaremos el primer ejemplo que vimos de las funciones tradicionales,
ahora escrita con flecha.

```javascript
(a, b) => {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
};
```

Si bien ya sabemos cuál es la estructura de una función flecha, ¿Cómo podemos declarar una función con nombre? Y bueno, acá
solo tenemos una opción:

```javascript
const pitagoras = (a, b) => {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
};

console.log(pitagoras(3, 4)); // Output: 5
```

Es en este punto donde la cosa se vuelve interesante 🤩, ya que veremos distintas maneras de escribir una arrow function
dependiendo de que es lo que se necesite hacer con la misma.

<h4>Return implicito 😎</h4>

Esta característica es una de las que más me gusta, ya que si el resultado depende solo del atributo que se le pasa a la función
(sin que tengamos que hacer más cosas dentro del cuerpo), este se puede escribir sin que tengamos que anteponer la palabra reservada `return`
y sin las llaves.

```javascript
const saludo = (nombre) => "Hola 👋 mi nombre es: " + nombre;

console.log(saludo("Logan")); // Output: Hola 👋 mi nombre es: Logan
```

<h4>Fuera paréntesis 😮</h4>

Cuando tengamos una función que recibe solo un parámetro, podemos escribir la función flecha sin los paréntesis, dejando solo el
parámetro y la flecha. (👀 esto solo aplica si la función recibe únicamente un parámetro, fuera de eso, ya es obligación colocar
los paréntesis como siempre lo hemos hecho).

```javascript
const saludo = (nombre) => `Hola 👋 mi nombre es ${nombre}`;

console.log(saludo("Logan")); // Output: Hola 👋 mi nombre es Logan
```

Para que quede un poco más claro, vamos a revisar un ejemplo donde iremos trasnformando una función tradicional a una escrita con
Arrow function.

```javascript
// funcion tradicional
const sumarCien = function (numero) {
  return numero + 100;
};

// funcion flecha
const sumarCien = (numero) => {
  return numero + 100;
};

// eliminamos la palabra return y con esto, las llaves
const sumarCien = (numero) => numero + 100;

// eliminamos los parentesis
const sumarCien = (numero) => numero + 100;
```

> **Nunca olvidar** 👀
>
> A pesar de que la nueva sintaxis de las arrow functions elimina (bajo ciertas reglas) tanto paréntesis, como returns y llaves,
> nunca olvidemos estos puntos los cuales nos van a ayudar mucho para peinarnos con las flechitas.
>
> - Si nuestra función requiere únicamente de un argumento, no necesitamos los paréntesis.
> - Si nuestra función requiere dos o más argumentos, estos se deben encontrar dentro de los paréntesis.
> - Si nuestra función requiere devolver inmediatamente lo que debe retornar, sin agregar más lógica,
>   se puede eliminar el **return** y **las llaves**.
> - Si nuestra función requiere más lógica para su funcionamiento, debemos agregar el **return** y **las llaves**.

Como ya hemos aprendido, la diferencia que existe entre _**Funciones Tradicionales**_ y _**Funciones Flechas**_, en su sintaxis por lo menos,
es muy notable, pero... ¿Esa es toda la diferencia? Y la verdad es que no 😐, ya que ambas manejan de manera distinta la palabra reservada `this`.
Veamos este comportamiento con el siguiente ejemplo: Vamos a crear un objeto donde dentro de sus propiedades tendremos una función tradicional
(encender) y otra con función flecha (apagar).

```javascript
const celular = {
  marca: "Peraphone",
  modelo: "Galactico 20",
  encender: function () {
    console.log(
      "Encendiendo el mejor celular.. el " + this.marca + " - " + this.modelo
    );
  },
  apagar: () => {
    console.log("El " + this.modelo + " se irá a dormir");
  },
};
```

- En la función **encender()**, el `this` hace referencia al contexto/scope/ámbito en el cual se definió la función, dicho de otra manera,
  el `this` puede obtener toda la información que existe dentro del objeto que declaró la función.
- Por otra parte, la función **apagar()** no hace referencia al objeto `celular`, sino que hace referencia al contexto/scope/ámbito donde
  está definido el objeto `celular`, es decir, el contexto padre del objeto, que para efectos de este ejemplo, es el contexto `Window`. (Si
  quieres saber más sobre this, te recomiendo leer el siguiente artículo de
  <a href="https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this" target="_blank" rel="noopener noreferrer">Mozilla.org</a>)

¿Y ahora que? ¿Cuándo es una buena opción utilizar la flechita o la tradicional? Y la respuesta que te puedo recomendar es que para
la mayoría de las funciones utilices `arrow functions` y para los casos donde tenemos que leer propiedades dentro de un mismo objeto, usar
las `tradicionales`.

![Cracks usando flechas](https://media.giphy.com/media/3ornkbfsCdhrvJ6Iuc/giphy.gif)

<h2 id="default-parameters">Default Parameters</h2>

Los `default parameters` o `Parámetros predeterminados` son una nueva característica que nos provee la llegada de ES6 para declarar atributos de
una función que en caso de que su valor sea `undefined`, se inicie con el valor que le designemos.

```javascript
const saludar = (nombre, origen = "por ahí") =>
  "Mi nombre es: " + nombre + " y vengo de " + origen;

console.log(saludar("Morty", "C132")); // Output: Mi nombre es Morty y vengo de C137
console.log(saludar("Evil Morty")); // Output: Mi nombre es Evil Morty y vengo de por ahí
```

<h2 id="rest-parameters">Rest Parameters</h2>

Los `Rest Parameters` o `Parametros Rest` nos permite representar **_"un número indefinido"_** de argumentos de una función como un array. Veamos
esto en un ejemplo.

```javascript
const emojis = (a, b, ...otros) => {
  console.log(a);
  console.log(b);
  console.log(otros);
}

emojis(😎, 🤩, 😁, 😲, 😍, 😂, 🔥, 🙃, 😒);

/* Output:
* 😎
* 🤩
* [😁, 😲, 😍, 😂, 🔥, 🙃, 😒]
*/
```

<h2 id="destructuring">Destructuring</h2>

`Destructuring` o `Desestructuración` nos permite _**"sacar"**_ valores de arreglos o propiedades de un objeto y expresarlas en distintas
variables. (Esta es una característica muy útil para entender como son los hooks de React 👀😬).

<h3>Ejemplos con Arrays</h3>

```javascript
// Ejemplo básico
const [a, b] = [1, 2];
console.log(a, b); // Output: 1 2

// Evitamos valores
const [a, , c] = [1, 2, 3];
console.log(a, c); // Output 1 3

// Asigando un arreglo a una variable
const [a, ...b] = [1, 2, 3];
console.log(a, b); // Output: 1 [2, 3]
```

<h3>Ejemplos con Objetos</h3>

```javascript
const superheroe = {
  nombre: "Ironman",
  poder: "Ser cool",
};

const { poder, nombre } = superheroe;
console.log(poder); // Output: Ser cool
console.log(nombre); // Output: Ironman
```

```javascript
const superheroe = {
  nombre: "Ironman",
  poder: "Ser cool",
  usuario: {
    nombre_real: "Anthony",
    apellido_real: "Stark",
  },
};

const {
  nombre,
  usuario: { nombre_real },
} = superheroe;
console.log(nombre); // Output: Ironman
console.log(nombre_real); // Output: Anthony
```

![Tony Stark](https://media.giphy.com/media/YWjZrW9z2z4VW/giphy.gif)

<h2 id="ultima-parte">Última parte</h2>

Hoy hemos aprendido bastante sobre funciones y esas características de ES6 que definitivamente nos ayudarán en nuestro día a día.
No obstante esto no es todo, ya que aún falta revisar `Literal String`, `Promesas` y `Operaciones con Arrays` (las que encuentro imprescindible)
pero todo esto lo veremos en la _Tercera parte_ y final de **_El JavaScript que necesitas para React_**
