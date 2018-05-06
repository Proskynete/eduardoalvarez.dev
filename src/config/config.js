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
      { text: 'pero sobre todo, compartir con mis amigos cada vez que se puede.' },
    ],
  },
  handleGetUrl() {
    const url = {
      development: 'http://localhost:8882',
      integration: 'http://localhost:3000',
    };
    return url[this.handleGetEnvironment()];
  },
  handleGetEnvironment() {
    return 'development';
  },
  handleGetEntryPointApi() {
    return '/node/api/blog/';
  },
};
