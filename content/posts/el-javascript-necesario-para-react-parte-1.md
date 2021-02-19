---
title: 'El Javascript necesario para React - Parte 1'
description: 'React es una librería desarrollada por Facebook el cual fue creado utilizando el lenguaje de programación JavaScript, por este motivo, mientras más aprendamos del lenguaje, más cosas podremos hacer en React. Es por eso que hoy vamos a revisar algunos conceptos y funciones que, según mi experiencia, son fundamentales para ser un buen desarrollador de React.'
date: 2021-02-14T01:01:47-03:00
tags: ['javascript', 'introduction', 'react']
hero_image: '/images/articles/el-javascript-necesario-para-react/el-javascript-necesario-para-react.png'
thumbnail_image: '/images/articles/el-javascript-necesario-para-react/thumbnail.png'
with_introduction: true
introduction:
  {
    title: 'Introducción',
    anchor: 'introduccion',
    content: 'Hoy aprenderemos lo mínimo de **JavaScript** que necesitamos saber para desarrollar aplicaciones en **React** sin problemas. Aprenderemos que es **ECMAScript** y cuales son esas características (_Variables_, _Funciones_, _Destructuring_, _Promesas_, _Operaciones con arrays_, entre otros) que, según mi experiencia, nos ayudarán en este viaje. Pero antes... **¿Qué es React?**',
  }
sections:
  [
    { title: 'Introducción', anchor: 'introduccion' },
		{ title: '¿Qué es React?', anchor: 'que-es-react' },
    { title: 'ECMAScript', anchor: 'ecmascript' },
    { title: 'Variables', anchor: 'variables' },
		{ title: 'Segunda parte', anchor: 'segunda-parte' },
  ]
---

<h2 id="que-es-react">¿Qué es React?</h2>

**React** (o también conocido como **Reactjs**) es una <a href="https://es.wikipedia.org/wiki/Biblioteca_(inform%C3%A1tica)#:~:text=En%20inform%C3%A1tica%2C%20una%20biblioteca%20o,la%20funcionalidad%20que%20se%20invoca" target="_blank" rel="noopener noreferrer">librería</a> de código abierto (_open source_) desarrollada por un equipo dentro de **Facebook** para crear interfaces de usuario de forma rápida y con buen rendimiento ya que para ese entonces era precisamente el problema que estaban teniendo, dicho de otra manera, estaba leento. Es por eso que se le pidió a un equipo interno que mejorara este problema y por lo visto lo pudieron hacer 😁.

Ahora bien, que es lo que lo hizo ser más eficiente que otras alternativas de ese entonces (como jQuery por ejemplo)?. Y Es que React mantiene una representación del <a href="https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n" target="_blank" rel="noopener noreferrer">DOM</a> (_Document Object Model_) de la página en memoria llamándolo **Virtual DOM** y esto no es más que un algoritmo que está pendiente a algún cambio dentro de sus componentes, lo compara con el DOM original y si es distinto solo aplicaran los cambios para ese componente, con esto evitamos estar renderizando cosas que no cambiaron y solo nos enfocamos en las que sí. Otro gran beneficio de utilizar React es que la forma de trabajar es componiendo pequeños trozos de código (llamados componentes) y son estos los que vamos uniendo a otras piezas, como lo haríamos utilizando piezas de LEGO.

![Componentes como piezas de LEGO](https://media.giphy.com/media/l0JMrPWRQkTeg3jjO/giphy.gif)

Hoy en día el código de React es mantenido por el equipo de Facebook y de Instagram y sobre eso, agreguémosle la inmensa comunidad que hay detrás de personas y empresas que contribuyen para mejorar la librería día a día. También cabe mencionar algunas empresas de nivel mundial que utilizan React en sus productos como por ejemplo: **Netflix**, **Airbnb**, **Atlassian**, **Uber**, **Dropbox** solo por nombrar algunas.

Ya que vimos que es React, quienes mantienen la librería y que empresas la utilizan, ahora es tiempo de hablar del lenguaje de programación en el cual está construido y cuáles son las _"cositas"_ que, según mi opinión, debemos manejar para desarrollar aplicaciones sin miedo alguno. Y para ello partamos entendiendo que es **ECMAScript** y que tiene que ver con **JS**.

<h2 id="ecmascript">ECMAScript</h2>

En simples palabras, **ECMAScript** o **ECMA** solamente, es el encargado de dar el estándar rigiendo como sebe ser interpretado y como debe funcionar el lenguaje **JavaScript**. De hecho, para que JavaScript funcione como debe ser en los navegadores o en Nodejs (por ejemplo), estos deben encargarse de interpretar el código tal como lo dicta el estándar.

El 2015 fue una fecha muy importante para el estándar de JavaScript, ya que desde **1999** que no se hacía una nueva revisión a su sintaxis (acá cabe mencionar que en estricto rigor si hubo revisiones del lenguaje, ya que en *2009* sale **ECMAScript 5** y posteriormente, en *2011*, se le agregan pequeños cambios) dando así el nacimiento de **ECMAScrip 6** o **ES6** (para los amigos). Pero ¿Por qué fue tan importante esta nueva versión del lenguaje? Es porque se agregaron una serie de mejoras a su sintaxis, haciendo que fuese mucho más simple programar en JavaScript. Desde entonces hasta la fecha, han salido mejoras al estándar anualmente. A continuación veremos las que, según mi experiencia, debemos conocer como mínimo para no tener problemas al momento de hacer un proyecto.

![ECMAScript y JavaScript](/images/articles/el-javascript-necesario-para-react/es-js.png)

<h2 id="variables">Variables</h2>

Antes de ES6, nosotros teníamos una única forma de crear variables y era utilizando la palabra recebada `var` pero con la nueva estandarización del lenguaje, hoy aparte de utilizar el ya mencionado, podemos utilizar dos más: `let` y `const`.

```javascript
// Antes de ES6
var texto = 'Soy un texto';
var numero = 1999;
var funcion = function () {
	console.log('Holi');
};

// A partir de ES6
let otroTexto = 'Soy otro texto';
const otroNumero = 2015;
const otraFuncion = function () {
	console.log('Otro Holi');
};
```

<h3>var</h3>

Ahora viendo esto, nos damos cuando que a simple vista, solo han Agregado dos nuevas palabras para hacer exactamente lo mismo, pero la verdad es que es solo eso 😮. La diferencia entre **var** y las dos nuevas **let** y **const** radica en el como se utilizan, te explico: El problema con **var**, es que su valor puede ser modificado sin mayor problema y te lo explico con el siguiente ejemplo:

```javascript
function explicandoVar() {
	var a = 5;
	console.log(a); // Output: 5

	if (true) {
		var a = 10;
		console.log(a); // Output: 10
	}

	console.log(a); // Output: 10
}
```

Espera... ¿Qué fue lo que pasó?. Nos dimos cuenta de que la variable `a` la cual fue declarada e inicializada con un valor 5 dentro del _sope_ de la función **explicandoVar** cambió su valor al final de la ejecución de la misma. Este es el problema con _var_, ya que si tenemos una función en la cual declaramos una variable y después, dentro de su misma función, creamos otra variable con el mismo nombre, se pisará el valor del principio por el nuevo valor asignado. Por si aún no queda claro, vamos con otro ejemplo:

```javascript
var numero = 100;
(function explicandoVar() {
	for (var numero = 0; numero < 5; numero++) {
		console.log(numero); // Output: 0, 1, 2, 3, 4
	}
})();
console.log('Despues del for: ', numero); // Output: 100
```

Pero espera... me habías dicho que una variable declarada con var se puede modificar su valor si se vuelve a declarar, pero acá no sucede eso. La diferencia es que ahora la función _explicandoVar_ está dentro de un **IIFE** (Immediately Invoked Function Expression), lo cual hace que exista otro scope dentro de la función distinta a la de la variable con valor 100, por lo cual, la variable declarada dentro del _for_ que a su vez está dentro de nuestro IIFE vivirá solo dentro de este scope, pero os falta ver un ejemplo más 😁...

```javascript
var numero = 100;
(function explicandoVar() {
	for (numero = 0; numero < 5; numero++) {
		console.log(numero); // Output: 0, 1, 2, 3, 4
	}
})();
console.log('Despues del for: ', numero); // Output: 5
```

¿En serio? Volvemos a tener ese comportamiento raro... pero si lo único que hicimos fue no declarar la variable dentro del for... ¿Qué es lo que pasa entonces?

No te preocupes que te lo explico ahora 😃. Como no declaramos la variable _numero_ dentro del _for_, Javascript la creó de forma global (fuera de la función) pero nosotros ya teniamos una variable _numero_ fuera de la función, y como ya vimos, cuando uno vuelve a declarar una variable con el mismo nombre, JavaScript reemplaza el valor de este con el nuevo valor.

> **Hoisting** 👀
>
> JavaScript es un lenguaje de interpretado, lo que significa que el navegador, cuando está leyendo nuestro código, busca las declaraciones (variables o funciones) y las deja al principio de su scope. A esto de le conoce como <a href="https://developer.mozilla.org/es/docs/Glossary/Hoisting" target="_blank" rel="noopener noreferrer">Hoisting</a>
>
> - Las funciones **siempre se mueven arriba del scope**. Por lo tanto, podemos elegir donde declararlas y usarlas.
> - La declaración de las variables se mueven arriba del scope, pero solo la **declaración**. Antes de usar una variable, habrá que crearla y asignarla.

Por lo tanto nuestro código queda de la siguiente manera:

```javascript
var numero;
numero = 100; // Output: 100

(function () {
	for (numero = 0; numero < 5; numero++) {
		console.log(numero); // Output: 0, 1, 2, 3, 4
	}
})();

console.log(numero); // Output: 5
```

<h3>let</h3>

Ok, ya sabemos cuál es el error que podíamos tener con _var_, pero ¿Cómo funciona **let** entonces?, bueno, veámoslo en un ejemplo:

```javascript
var numero = 100;
(function explicandoVarPeroAhoraConLet() {
	for (let numero = 0; numero < 5; numero++) {
		console.log(numero); // Output: 0, 1, 2, 3, 4
	}
})();
console.log(numero); // Output: 100
```

Yeeeey!! Esta vez si funciona como esperábamos!! 😍 y todo esto es gracias al **Block Scope** (_ámbito de bloque_), ya que las variables declaradas con _let_ solo podrán ser accesible dentro del scope donde se declaró, en este caso, dentro del for. Ahora veamos otro ejemplo y comparémoslo con los ejemplos anteriores con var:

```javascript
function explicandoLet() {
	let numero = 10;
	let numero = 20;
	console.log(a); // Uncaught SyntaxError: Identifier 'numero' has already been declared
}
```

Cuando estudiamos _var_, nos dimos cuenta de que nosotros podíamos volver a declarar una variable con el mismo nombre... Pero ahora con let no se puede 😲 y es más, el mismo intérprete nos dice que el identificador `"a"` ya fue declarado. ¡Esto es perfecto! Ya que de esta manera podemos evitar estar sobreescribiendo una variable en caso de que no recordemos si es que ya habíamos utilizado ese identificador o no. Ahora cabe mencionar de que a pesar de que no podemos declarar una variable con el mismo nombre de otra variable ya declarada, si podemos cambiar el valor de la misma.

```javascript
function explicandoLet() {
	let numero = 10;
	console.log(numero); // Output: 10
	numero = 20;
	console.log(a); // Output: 20
}
```

<h3>const</h3>

Ahora ya estamos listos para hablar sobre _**const**_ 😍 y a pesar de que _const_ es muy parecido a _let_, tiene una pequeña y minúscula diferencia (¡¡mentira!! Gran gran diferencia 💛) y es que no se puede cambiar el valor asignado (1000 puntos para ~~Gryffindor~~ **const**). Veamos esto con unos ejemplos:

```javascript
function explicandoConst() {
	const numero = 10;
	console.log(numero); // Output: 10
	numero = 20; // Uncaught TypeError: Assignment to constant variable
}
```

```javascript
function explicandoConst() {
	const usuario = {
		nombre: 'Eduardo',
		edad: 'todos',
	};
	console.log(usuario); /* Output: {nombre: 'Eduardo', edad: 'todos'} */
	usuario.edad = 27;
	console.log(usuario); /* Output: {nombre: 'Eduardo', edad: 27} */
}
```

Espera un momento... en el segundo ejemplo vemos que cambiaste la edad y no hubo error. ¡¡Nos mentiste!! 😤. Y la verdad es que no les mentí, pasa que en _JavaScript_ tenemos dos maneras de asignar valores a las variable y estas son por **valor** y por **referencia**. Y te lo explico ahora 😎.

Cuando asignamos un valor **primitivo** ([string](https://developer.mozilla.org/es/docs/Glossary/String), [number](https://developer.mozilla.org/es/docs/Glossary/Numero), [bigint](https://developer.mozilla.org/es/docs/Glossary/bigint), [boolean](https://developer.mozilla.org/es/docs/Glossary/Boolean), [undefined](https://developer.mozilla.org/es/docs/Glossary/undefined), [symbol](https://developer.mozilla.org/es/docs/Glossary/Symbol) y [null](https://developer.mozilla.org/es/docs/Glossary/Null)) a una variable, realmente estamos asignando una copia del valor en sí a la variable. A esto le llamamos que es una asignación **por valor**. En su contraparte, cuando asignamos un valor **No Primitivo** ([object](https://developer.mozilla.org/es/docs/Glossary/Objecto), [array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array) o [function](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Function)), lo que significa que no se hace una copia del valor mismo, si no más bien se guarda una referencia mediante la cual accedemos a su valor. Veamos esto en unos ejemplos:

```javascript
function explicandoValorYReferencia() {
	let a = 'Se JavaScript';
	const b = a;

	a = '¡' + a + '!';

	console.log(a); // Output: "¡Se JavaScript!"
	console.log(b); // Output: "Se JavaScript"
}
```

En el primer ejemplo, podemos ver que a la variable **b** se le asigna lo que tenga la variable **a**, pero a pesar de eso, se mantienen independientes, es por este motivo que cuando modificamos el valor de **a**, **b** ni se entera. Esto es porque cada variable guarda su propio valor.

```javascript
function explicandoValorYReferencia() {
	const usuario = {
		nombre: 'Pedro',
		pais: 'Chile',
	};

	const otroUsuario = usuario;

	usuario.nombre = 'Peter';
	otroUsuario.nombre = 'Australia';

	console.log(usuario); /* Output: {nombre: 'Peter', pais: 'Australia'} */
	console.log(otroUsuario); /* Output: {nombre: 'Peter', pais: 'Australia'} */
}
```

En este otro ejemplo, vemos que al asignarle a la variable **otroUsuario** lo que tiene asignado la variable **usuario**, realmente lo que estamos haciendo es asignarle una referencia de lo que contiene **usuario** no su valor, dicho de otra manera, no estamos copiando el valor que tiene en ese momento. Es por eso que cuando modificamos cualquier de las dos variables, las dos se ven afectadas.

<h2 id="segunda-parte">Segunda parte</h2>

¡Wow! Cuanto hemos aprendido hoy, pero esto no termina acá, ya que aún nos falta revisar sobre **Funciones**, **Destructuring**, **Literal Strings**, **Default parameters**, **Rest parameters**, **Promesas** y **Operaciones con Array**. Pero todo esto lo podremos aprender en la `segunda parte` de este artículo

![Yeeey](https://media.giphy.com/media/IxKt9HOM1mI80/giphy.gif)
