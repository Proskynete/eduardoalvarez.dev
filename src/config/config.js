export default {
    appName: 'eduardoalvarez.cl',
    socials: [{
        name: "Linkedin",
        icon: "fab fa-linkedin-in",
        link: "https://www.linkedin.com/in/eduardoalvarezc/"
    }, {
        name: "Twitter",
        icon: "fab fa-twitter",
        link: "https://twitter.com/proskynete"
    }, {
        name: "Github",
        icon: "fab fa-github",
        link: "https://github.com/Proskynete/"
    }, {
        name: "Correo",
        icon: "far fa-envelope",
        link: "mailto:eduardo.a1993@gmail.com"
    }, {
        name: "Curriculum",
        icon: "fas fa-file",
        link: "http://curriculum.eduardoalvarez.cl"
    }],
    createdWith: [
        "fab fa-html5",
        "fab fa-css3-alt",
        "fab fa-js-square",
        "fab fa-node-js",
        "fab fa-linode",
        "fab fa-react",
        "fab fa-sass",
        "fab fa-bootstrap",
    ],
    philosophies: [
        { text: 'Si no estás dispuesto a darlo todo, no tienes derecho a intentarlo' },
        { text: 'No permitas que las cosas tomen más del tiempo que deben tomar' },
        { text: 'Si no lo puedes explicar de forma sencilla, es que no lo has entendido bien' },
        { text: 'No todo lo que puede ser contado cuenta, y no todo lo que cuenta puede ser contado' }
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
