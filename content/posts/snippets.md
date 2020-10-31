---
title: 'Snippets'
description: 'Ejemplo de snippets y su visualización'
date: 2020-10-23T15:47:00-03:00
read_time: 3
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
    { title: 'JavaScript', anchor: 'javascript' },
    { title: 'React', anchor: 'react' },
    { title: 'TypeScript', anchor: 'typescript' },
    { title: 'Node', anchor: 'node' },
    { title: 'HTML', anchor: 'html' },
    { title: 'CSS', anchor: 'css' },
    { title: 'SCSS', anchor: 'scss' },
    { title: 'Terminal', anchor: 'terminal' },
    { title: 'Markdown', anchor: 'markdown' },
    { title: 'Yaml', anchor: 'yaml' },
  ]
---

<h2 id="javascript">Javascript</h2>

```js
/*
 * comment of
 * more than one line
 */
let a = 'a';
var b = 'b';
const functionName = (attributes) => {
	return <div>Heeelloooo</div>;
};
```

<h2 id="react">React</h2>

```react
const component = () => {
  return(
    <h1>component with recat</h1>
  )
}

export default component;
```

<h2 id="typescript">TypeScript</h2>

```ts
/*
 * comment of
 * more than one line
 */
interface NameInterface {
	faa: string;
	foo: number;
}

let a = 'a';
var b = 'b';
const functionName: String = (attributes: number) => {
	return attributes.toString();
};
```

<h2 id="node">Node</h2>

```node
let a = 'a'; // a simple comment
var b = 'b';
const functionName = (attributes) => {
	const responseFunction = 'response of a function';
	return responseFunction;
};
```

<h2 id="html">HTML</h2>

```html
<!-- comment in html -->
<section>
	<p class="style">a section of <span>any</span> html page</p>
</section>
```

<h2 id="css">CSS</h2>

```css
.selector {
	font-size: 16px;
}

.selector:after {
	content: '';
	width: 100%;
}
```

<h2 id="scss">SCSS</h2>

```scss
.selector {
	font-size: 16px;

	/* This is a single-line comment */

	&:after {
		content: '';
		width: 100%;
	}
}
```

<h2 id="terminal">Terminal</h2>

```bash
npm install react react-router react-dom
```

<h2 id="markdown">Markdown</h2>

```md
# title

---

- item
- item
```

<h2 id="yaml">Yaml</h2>

```yaml
homeassistant:
  auth_providers:
    - type: homeassistant
    - type: legacy_api_password
  name: !secret name
  temperature_unit: C
  time_zone: !secret timezone
  latitude: !secret latitude
  longitude: !secret longitude
  unit_system: metric
  elevation: 47
  customize: !include customize.yaml
  customize_glob: !include customize_glob.yaml
  packages: !include_dir_named packages
```
