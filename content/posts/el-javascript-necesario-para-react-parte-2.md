---
title: 'El Javascript necesario para React - Parte 2'
description: 'Hoy continuaremos revisando esas características de JavaScript que no ayudarán al momento de estar desarrollando en React. Revisaremos Funciones, Default Parameters, Rest Parameters y Destructuring. Aprendamos juntos lo que JavaScript tiene para enseñarnos.'
date: 2021-02-22T20:34:16-03:00
tags: ['introduction', 'javascript', 'react']
hero_image: '/images/articles/el-javascript-necesario-para-react/parte-2/el-javascript-necesario-para-react-parte-2.png'
thumbnail_image: '/images/articles/el-javascript-necesario-para-react/parte-2/thumbnail.png'
with_introduction: true
introduction:
  {
    title: 'Introducción',
    anchor: 'introduccion',
    content: 'Porque no hay deuda que no se cumpla, acá llega la segunda parte del JavaScript necesario para React. Hoy nos enfocaremos en todo lo que JS tiene para ofrecernos en **funciones**, viendo como podemos declararlas, sus argumentos y como trabajar con estos últimos. _¡Ya cada vez falta menos!_',
  }
sections:
  [
    { title: 'Introducción', anchor: 'introduccion' },
    { title: 'Funciones', anchor: 'funciones' },
    { title: 'Default Parameters', anchor: 'default-parameters' },
    { title: 'Rest Parameters', anchor: 'rest-parameters' },
    { title: 'Destructuring', anchor: 'destructuring' },
  ]
---

<h2 id="funciones">Funciones</h2>

Actualmente, JavaScript posee dos formas de poder declarar funciones. La primera se le conoce como **Funciones tradicionales** y se caracterizan por utilizar la palabra reservada `function`. Por otra parte, tenemos las **Funciones flecha** o **Arrow functions** las cuales se pueden distinguir por utilizar los **paréntesis**, el **signo igual** acompañado de un **mayor que** y **paréntesis** (por lo general).

<h3>Funciones tradicionales</h3>

A continuación veremos un ejemplo de como crear una **función anónima**. Esta es la manera simple de crear una función, pero tiene un inconveniente, y es que no se puede volver a utilizar, ya que no posee un nombre al cual hacer referencia. 😅

```javascript
function (a, b) {
  const catetos = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.sqrt(catetos);
}
```

Ahora bien, existen dos maneras de escribir una función y que esta tenga un nombre para así poder llamarla en cualquier otra parte de nuestro código y las vamos a aprender con los siguientes ejemplos. Cabe mencionar que esto promueve una buena práctica, ya que escribiremos nuestra función una única vez y la llamaremos cada vez que la necesitemos, evitando así la repetición de código. 💛

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

¡Wow! Si nos damos cuenta, las dos formas son muy similares. La primera es asignando un nombre directamente a la función y la segunda es creando una variable (como lo vimos en la <a href="https://eduardoalvarez.dev/articulos/el-javascript-necesario-para-react-parte-1" target="_blank" rel="noopener noreferrer">El JavaScript necesario para React - Parte 1</a>) y asignarle una función anónima... Entonces ¿Cuál utilizamos? Y la respuesta es: **La que quieras** 😁, ya que no hay una diferencia sustancial entre una y la otra. Aun que con lo que vamos a ver ahora, vas a querer utilizar las **arrow functions** siempre 😮.

<h3>Funciones flechas</h3>

Esta nueva manera de escribir funciones nace con la nueva implementación de **ECMAScript 6**, la cual hace que las funciones sea más expresivas e incluso podremos escribir menos código (¡yeeeey!). La sintaxis de las funciones flechas es la siguiente: **Paréntesis** seguido de un **signo igual que** que es acompañado de un **signo mayor que** y finalizamos con **llaves** (aun que veremos que podremos obviar las llaves). A continuación transformaremos el primer ejemplo que vimos de las funciones tradicionales, ahora escrita con flecha.

```javascript
(a, b) => {
 const catetos = Math.pow(a, 2) + Math.pow(b, 2);
 return Math.sqrt(catetos);
};
```

Si bien ya sabemos cual es la estructura de una función flecha, ¿Cómo podemos declarar una función con nombre? Y bueno, acá solo tenemos una opción:

```javascript
const pitagoras = (a, b) => {
 const catetos = Math.pow(a, 2) + Math.pow(b, 2);
 return Math.sqrt(catetos);
};

console.log(pitagoras(3, 4)); // Output: 5
```

Es en este punto donde la cosa se vuelve interesante 🤩 y aque veremos distintas maneras de escribír una arrow function dependiendo de que es lo que se necesite hacer con la misma.

<h4>Return implicito</h4>

```javascript
const saludo = (nombre) => `Hola 👋 mi nombre es ${nombre}`;

console.log(saludo('Logan')); // Output: Hola 👋 mi nombre es Logan
```

<h4>Un solo parámetro</h4>

```javascript
const saludo = nombre => `Hola 👋 mi nombre es ${nombre}`;

console.log(saludo('Logan')); // Output: Hola 👋 mi nombre es Logan
```

![Yeeey](https://media.giphy.com/media/3ornkbfsCdhrvJ6Iuc/giphy.gif)

<h2 id="default-parameters">Default Parameters</h2>

<h2 id="rest-parameters">Rest Parameters</h2>

<h2 id="destructuring">Destructuring</h2>
```
