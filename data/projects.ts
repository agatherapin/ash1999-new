export interface Project {
    title: string;
    subtitle: string;
    description: string;
    fullDescription?: string;
    tags: string[];
    image: string;
    video?: string;
    gallery: string[];
    width: number;
    aspectRatio: number;
    top: number;
    left: number;
}

export const projects: Project[] = [
    {
        title: 'Internship with PMF music label',
        subtitle: 'Jan to March 2025',
        description: 'I worked on the logo and mockups for ThaHomey brand: Rare.',
        tags: ['Branding'],
        image: '/img/rare-stage/back-cover.webp',
        gallery: [
            '/img/rare-stage/front-cover.webp', '/img/rare-stage/rapport-front-back.webp',
            '/img/rare-stage/planche-logo-finale.webp', '/img/rare-stage/mockup-tee-stretch.webp',
            '/img/rare-stage/mockup-tee-outline.webp', '/img/rare-stage/planche-logo-test.webp',
            '/img/rare-stage/rapport-moodboard.webp', '/img/rare-stage/rapport-problematique.webp',
            '/img/rare-stage/rapport-1.webp', '/img/rare-stage/rapport-2.webp',
            '/img/rare-stage/rapport-3.webp', '/img/rare-stage/rapport-4.webp',
            '/img/rare-stage/rapport-5.webp', '/img/rare-stage/rapport-6.webp',
            '/img/rare-stage/rapport-7.webp', '/img/rare-stage/rapport-8.webp',
            '/img/rare-stage/rapport-9.webp'
        ],
        width: 240,
        aspectRatio: 0.7,
        top: 45,
        left: 60
    },
    {
        title: 'Suburban',
        subtitle: 'Jan 2024',
        description: 'Trifold brochure to promote a fictional festival around rap music. Suburban is the name of a fictitious organization about urban culture, streetwear & rap music.',
        tags: ['Branding', 'Print', 'Typography'],
        image: '/img/suburban/titre-motion.mp4',
        video: '/img/suburban/titre-motion.mp4',
        gallery: ['/img/suburban/exterieur-mockup-suburban.webp', '/img/suburban/interieur-mockup-suburban.webp', '/img/suburban/logo.webp'],
        width: 240,
        aspectRatio: 0.8,
        top: 8,
        left: 50
    },
    {
        title: 'Happy Birthday lettering',
        subtitle: 'Jan 2024',
        description: 'Inspired by Copperlate alphabet',
        tags: ['Typography'],
        image: '/img/typographie/hbd-procreate.webp',
        gallery: ['/img/typographie/hbd-manual.webp', '/img/typographie/hbd-procreate.webp'],
        width: 280,
        aspectRatio: 1,
        top: 80,
        left: 55
    },
    {
        title: 'Wandanlage',
        subtitle: 'June 2024',
        description: 'As a great fan of Dieter Rams work, I decided to dedicate this webdesign project to the wall unit he designed for Braun in the 60s.',
        tags: ['Web Design'],
        image: '/img/wandanlage/cover-landing-page.webp',
        gallery: ['vimeo:1166411109', '/img/wandanlage/page-close-up-platine.webp', '/img/wandanlage/page-previsualisation.webp', '/img/wandanlage/page-404.webp', '/img/wandanlage/scroll-horizontal.webp', '/img/wandanlage/footer.webp'],
        width: 340,
        aspectRatio: 1.7,
        top: 65,
        left: 74
    },
    {
        title: 'Skyjo',
        subtitle: 'April 2025',
        description: 'The aim of this workshop was to create a brand new, fun and attractive design for this extraordinary game!',
        tags: ['Packaging', 'Branding', 'Print'],
        image: '/img/skyjo/jeu-complet-cover.webp',
        gallery: ['/img/skyjo/jeu-entier.webp', '/img/skyjo/packaging.webp', '/img/skyjo/mise-en-scene.webp', '/img/skyjo/cartes.webp', '/img/skyjo/jeu-complet-range.webp', '/img/skyjo/detail-packaging.webp'],
        width: 240,
        aspectRatio: 0.8,
        top: 55,
        left: 92
    },
    {
        title: 'Interférences exhibition',
        subtitle: 'November 2024',
        description: 'The Interférences exhibition revolves around mapping and motion design, and showcases the work of third-year motion design students at E-artsup.',
        tags: ['Branding', 'Print', 'Motion Design'],
        image: '/img/interferences/motion-interferences.mp4',
        video: '/img/interferences/motion-interferences.mp4',
        gallery: ['/img/interferences/affiche-la-cale.webp', '/img/interferences/affiche-interferences.webp', '/img/interferences/flyer-face.webp', '/img/interferences/flyer-verso.webp', 'video:/img/interferences/motion-interferences.mp4'],
        width: 240,
        aspectRatio: 0.7,
        top: 17,
        left: 20
    },
    {
        title: 'Typographic Lexicon',
        subtitle: 'October 2023',
        description: 'This lexicon is designed to help students learn about typography. It covers the essentials of typographic vocabulary and technical terms, and traces the history of typefaces.',
        tags: ['Typography', 'Print'],
        image: '/img/lexique-typographique/cover.webp',
        gallery: [
            '/img/lexique-typographique/cover.webp', '/img/lexique-typographique/sommaire.webp',
            '/img/lexique-typographique/lexique-typo-1.webp', '/img/lexique-typographique/lexique-typo-2.webp',
            '/img/lexique-typographique/lexique-typo-3.webp', '/img/lexique-typographique/lexique-typo-4.webp',
            '/img/lexique-typographique/lexique-typo-5.webp', '/img/lexique-typographique/lexique-typo-6.webp',
            '/img/lexique-typographique/lexique-typo-7.webp', '/img/lexique-typographique/lexique-typo-8.webp',
            '/img/lexique-typographique/lexique-typo-9.webp', '/img/lexique-typographique/lexique-typo-10.webp',
            '/img/lexique-typographique/lexique-typo-12.webp', '/img/lexique-typographique/lexique-typo-15.webp',
        ],
        width: 340,
        aspectRatio: 1.3,
        top: 70,
        left: 33
    },
    {
        title: 'Pick your poison, Art cover',
        subtitle: 'December 2025',
        description: 'Fictional cover made with playdough for the amazing song pick your poison, by Killowen.',
        tags: ['Music', 'Mix media', 'Typography'],
        image: '/img/pick-your-poison/cover.webp',
        gallery: ['/img/pick-your-poison/cover.webp', '/img/pick-your-poison/head-dead.webp', '/img/pick-your-poison/head-heart.webp', '/img/pick-your-poison/mockup-cover.webp'],
        width: 330,
        aspectRatio: 1.0,
        top: 87,
        left: 1
    },
    {
        title: 'Poster Bushi - Batman',
        subtitle: '2024',
        description: 'Using Carta Nueva font from Sharp Type',
        tags: ['Music'],
        image: '/img/music-visuals/poster-bushi-batman.webp',
        gallery: ['/img/music-visuals/poster-bushi-batman.webp', '/img/music-visuals/cd-mockup-bushi-batman.webp', '/img/music-visuals/jolagreen-poster.webp'],
        width: 240,
        aspectRatio: 0.707,
        top: 32,
        left: 5
    },
    {
        title: 'Drawing gallery',
        subtitle: '2024',
        description: 'Collection of various drawings and artworks.',
        tags: ['Illustration'],
        image: '/img/dessins/astronaute.webp',
        gallery: [
            '/img/dessins/jardin-des-plantes.webp', '/img/dessins/japan_street.webp',
            '/img/dessins/astronaute.webp', '/img/dessins/metropolitan.webp',
            '/img/dessins/samourai.webp', '/img/dessins/profil-encre-de-chine.webp',
            '/img/dessins/tombeau-des-lucioles.webp'
        ],
        width: 240,
        aspectRatio: 0.707,
        top: 32,
        left: 36
    },
    {
        title: 'Homemade books',
        subtitle: 'November 2025',
        description: 'I crafted this paper myself from scratch and painted the cover with acrylic paint. Everything is made by hand.',
        tags: ['Mix media', 'Illustration'],
        image: '/img/early-dinner-front.webp',
        gallery: ['/img/early-dinner-front.webp', '/img/early-dinner-back.webp'],
        width: 290,
        aspectRatio: 1.3,
        top: 20,
        left: 85
    },
    {
        title: 'Motion for Muji',
        subtitle: 'December 2025',
        description: 'Short video to promote the Wall Mounted CD Player from Muji.',
        tags: ['Motion Design'],
        image: '/img/cover-motion.mp4',
        video: '/img/cover-motion.mp4',
        gallery: ['vimeo:1169377028'],
        width: 290,
        aspectRatio: 1.5,
        top: 90,
        left: 78
    }
];
