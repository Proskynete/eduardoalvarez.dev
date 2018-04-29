export default {
  appName: 'eduardoalvarez.cl',
  links: {
    linkedin: 'https://www.linkedin.com/in/proskynete/',
    github: 'https://github.com/Proskynete',
    curriculum: 'http://curriculum.eduardoalvarez.cl',
  },
  philosophies: [
    { text: 'Si no estás dispuesto a darlo todo, no tienes derecho a intentarlo' },
    { text: 'No permitas que las cosas tomen más del tiempo que deben tomar' },
    { text: 'Si no lo puedes explicar de forma sencilla, es que no lo has entendido bien' },
  ],
  description: {
    logoName: 'EDUARDOALVAREZ',
    name: 'Eduardo Álvarez Castañeda',
    parragraph: [
      { text: 'Holaaa!! Mi nombre es Eduardo Álvarez... Que genial el que hayas venido.' },
      { text: 'Me gusta el desarrollo web en su amplio espectro, jugar LOL o algún partido de fútbol, ' },
      { text: 'pero sobre todo, compartir una cerveza con mis amigos los fines de semana.' },
    ],
  },
  getUrl() {
    const url = {
      development: 'http://localhost:8882',
    };
    return url[this.getEnvironment()];
  },
  getEnvironment() {
    return (window.LAN && window.LAN.Environment.env) || 'development';
  },
  getEntryPointApi() {
    return '/node/api/blog/';
  },
};
