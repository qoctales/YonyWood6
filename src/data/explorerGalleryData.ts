import { AffiliationPerson } from '../types';
import { ExplorerCategoryType } from './explorerTopicsData';
import { MATRIX_SERIES_DATA } from './matrixData';

export interface GalleryPosterItem {
  id: string;
  category: ExplorerCategoryType;
  title: string;
  subtitle: string;
  description?: string;
  posterUrl: string;
  tag: string;
  badge?: string;
  price?: string;
  artisanName?: string;
  funding?: {
    collected: number;
    target: number;
    pct: number;
    backers: number;
  };
  territory?: string;
  seriesId?: string;
  stories?: AffiliationPerson[];
}

// Vidéos teasers stock pour les protagonistes générés
const TEASER_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
];

// Générateur déterministe de 16 protagonistes pour chaque proposition
export function generate16StoriesForProposal(
  proposalTitle: string,
  category: ExplorerCategoryType,
  territoryHint: string = 'Bénin'
): AffiliationPerson[] {
  const FIRST_NAMES = [
    { first: 'Dah', last: 'Zounon', country: 'Bénin', flag: '🇧🇯', terr: 'Allada', age: 64, role: 'Gardien de la tradition' },
    { first: 'Sœur Blandine', last: 'Houessou', country: 'Bénin', flag: '🇧🇯', terr: 'Abomey', age: 48, role: 'Herboriste & religieuse' },
    { first: 'Koffi', last: 'Tisserand', country: 'Bénin', flag: '🇧🇯', terr: 'Abomey', age: 52, role: 'Maître tisserand Kanvo' },
    { first: 'Amara', last: 'Dossou', country: 'Bénin', flag: '🇧🇯', terr: 'Grand-Popo', age: 39, role: 'Potière traditionnelle' },
    { first: 'Tobi', last: 'Piroguier', country: 'Bénin', flag: '🇧🇯', terr: 'Ganvié', age: 41, role: 'Piroguier & passeur lacustre' },
    { first: 'Sayri', last: 'Quispe', country: 'Pérou', flag: '🇵🇪', terr: 'Cusco', age: 45, role: 'Tisserand des terrasses andines' },
    { first: 'Malik', last: 'Barou', country: 'Sénégal', flag: '🇸🇳', terr: 'Dakar', age: 34, role: 'Poète & conteur urbain' },
    { first: 'Éléonore', last: 'Koffi', country: 'France', flag: '🇫🇷', terr: 'Marseille', age: 38, role: 'Céramiste d’art' },
    { first: 'Chef Koffi', last: 'Mensah', country: 'Bénin', flag: '🇧🇯', terr: 'Cotonou', age: 47, role: 'Artisan cuisinier de Dantokpa' },
    { first: 'Hélène', last: 'Saint-Amand', country: 'France', flag: '🇫🇷', terr: 'Paris', age: 43, role: 'Scénographe olfactive' },
    { first: 'Sènan', last: 'Gbaguidi', country: 'Bénin', flag: '🇧🇯', terr: 'Toffo', age: 29, role: 'Gardienne des semences' },
    { first: 'Ablaye', last: 'Cissoko', country: 'Sénégal', flag: '🇸🇳', terr: 'Saint-Louis', age: 51, role: 'Maître de kora' },
    { first: 'Mawulolo', last: 'Agossa', country: 'Bénin', flag: '🇧🇯', terr: 'Ouidah', age: 36, role: 'Fondeur de bronze d’art' },
    { first: 'Inès', last: 'Almeida', country: 'Brésil', flag: '🇧🇷', terr: 'Salvador de Bahia', age: 33, role: 'Chorégraphe sacrée' },
    { first: 'Babacar', last: 'Ndiaye', country: 'Sénégal', flag: '🇸🇳', terr: 'Dakar', age: 44, role: 'Luthier d’instruments traditionnels' },
    { first: 'Ayaba', last: 'Gnonhossou', country: 'Bénin', flag: '🇧🇯', terr: 'Porto-Novo', age: 56, role: 'Teinturière à l’indigo naturel' }
  ];

  const PHOTOS = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=600&q=80'
  ];

  return FIRST_NAMES.map((person, idx) => ({
    id: `story-${category}-${idx + 1}`,
    name: `${person.first} ${person.last}`,
    firstName: person.first,
    age: person.age,
    role: person.role,
    territory: person.terr || territoryHint,
    country: person.country,
    flag: person.flag,
    universeTag: proposalTitle,
    photoUrl: PHOTOS[idx % PHOTOS.length],
    isPioneer: idx === 0,
    badge: idx === 0 ? 'Première effigie' : 'Invité(e)',
    invitationStory: `Témoigne de son expérience vivante autour de « ${proposalTitle} ».`,
    teaserVideoUrl: TEASER_VIDEOS[idx % TEASER_VIDEOS.length],
    teaserPitch: `« Lorsque je repense à ${proposalTitle}, je sais que c'est ici que ma trajectoire a basculé. »`,
    generation: 1
  }));
}

// =============================================================================
// LES 16 PROPOSITIONS POUR CHACUNE DES 6 CATÉGORIES (VOLET 1 : 1-8 | VOLET 2 : 9-16)
// =============================================================================

export const GALLERY_ITEMS_BY_CATEGORY: Record<ExplorerCategoryType, GalleryPosterItem[]> = {
  // ===========================================================================
  // 1. SÉRIES DOCUMENTAIRES (Les 5 séries officielles avec leurs vraies affiches 2:3)
  // ===========================================================================
  series: [
    // Volet 1 (1 à 8)
    {
      id: 'ALL',
      category: 'series',
      title: 'Tous les Pionniers',
      subtitle: 'La constellation générale des 16 fondateurs',
      description: 'Découvrez l’ensemble des premiers passeurs de récits issus de toutes nos séries documentaires confondues.',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Constellation globale',
      seriesId: 'ALL'
    },
    {
      id: 'jesus-legba',
      category: 'series',
      title: 'Jésus < > Èṣù',
      subtitle: 'Deux traditions. Une même question de foi.',
      description: 'Face aux épreuves et au pardon, les dévots d’Èṣù et les chrétiens dialoguent d’égal à égal.',
      posterUrl: '/assets/posters/jesus-esu.png',
      tag: 'La foi',
      seriesId: 'jesus-legba'
    },
    {
      id: 'finagnon-qosqorico',
      category: 'series',
      title: 'Finagnon < > Qosqorico',
      subtitle: 'Bénin < > Pérou. Deux territoires reliés par l’eau et la terre.',
      description: 'Des cités lacustres de Ganvié aux cimes de Cusco, pêcheurs et paysans dialoguent sur l’enracinement.',
      posterUrl: '/assets/posters/finagnon-qosqorico.png',
      tag: 'Le territoire',
      seriesId: 'finagnon-qosqorico'
    },
    {
      id: 'blacks-one-beyond-eve',
      category: 'series',
      title: 'Blacks One < > Beyond Eve',
      subtitle: 'Deux expériences collectives. Une exploration de l’identité.',
      description: 'Entre la rue dakaroise et les cercles de femmes créatrices d’Abidjan, forger sa souveraineté intime.',
      posterUrl: '/assets/posters/blacks-one-beyond-eve.png',
      tag: 'L’identité',
      seriesId: 'blacks-one-beyond-eve'
    },
    {
      id: 'dixeat-fiat-luxe',
      category: 'series',
      title: 'Dixeat < > Fiat Luxe',
      subtitle: 'Ceux qui nourrissent < > ceux qui créent l’exception.',
      description: 'Des marmites populaires de Dantokpa aux tables d’exception à Paris et Milan, l’art du don.',
      posterUrl: '/assets/posters/dixeat-fiat-luxe.png',
      tag: 'L’expérience',
      seriesId: 'dixeat-fiat-luxe'
    },
    {
      id: 'investors-builders',
      category: 'series',
      title: 'Investors < > Builders',
      subtitle: 'Ceux qui parient sur l’avenir < > ceux qui façonnent la matière.',
      description: 'Le capital patient rencontre la sueur des bâtisseurs d’infrastructures et de code.',
      posterUrl: '/assets/posters/investors-builders.png',
      tag: 'L’audace',
      seriesId: 'investors-builders'
    },
    {
      id: 'gardiens-semences',
      category: 'series',
      title: 'Gardiens des Semences',
      subtitle: 'Transmission silencieuse de la graine sacrée',
      description: 'Paysans et agronomes préservant la souveraineté alimentaire ancestrale face aux semences stériles.',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Souveraineté',
      seriesId: 'jesus-legba'
    },
    {
      id: 'voix-carrefours',
      category: 'series',
      title: 'Voix des Carrefours',
      subtitle: 'Ouvrir les passages et franchir les seuils',
      description: 'Les sages et médiateurs qui dénouent les conflits dans les villages et les quartiers.',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: 'Médiation',
      seriesId: 'jesus-legba'
    },

    // Volet 2 (9 à 16)
    {
      id: 'terres-rouges',
      category: 'series',
      title: 'Terres Rouges & Lagunes',
      subtitle: 'Mémoire argileuse et cours d’eau nourriciers',
      description: 'Piroguiers et potières racontent la vie au rythme des marées et des crues du fleuve.',
      posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      tag: 'Enracinement',
      seriesId: 'finagnon-qosqorico'
    },
    {
      id: 'sagesse-hauteurs',
      category: 'series',
      title: 'Sagesse des Hauteurs',
      subtitle: 'Les gardiens quechuas des cimes sacrées',
      description: 'Vivre à 3 500 mètres en dialoguant avec les esprits de la cordillère et la Pachamama.',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: 'Pachamama',
      seriesId: 'finagnon-qosqorico'
    },
    {
      id: 'rythmes-resonances',
      category: 'series',
      title: 'Rythmes & Résonances',
      subtitle: 'Quand la ville résonne au pas de ses jeunes',
      description: 'Freestyle, percussions et slam dans les rues de Médina et des faubourgs dakarois.',
      posterUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      tag: 'Fraternité',
      seriesId: 'blacks-one-beyond-eve'
    },
    {
      id: 'matrimoine-sacre',
      category: 'series',
      title: 'Matrimoine Sacré',
      subtitle: 'La lignée des mères et des artisanes d’art',
      description: 'Comment les femmes réinventent l’héritage, le tissage et la souveraineté économique.',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'Émancipation',
      seriesId: 'blacks-one-beyond-eve'
    },
    {
      id: 'marmites-populaires',
      category: 'series',
      title: 'Marmites Populaires',
      subtitle: 'L’artisanat de rue qui nourrit des milliers d’âmes',
      description: 'L’igname pilé dès 4 heures du matin : le don d’un repas chaud comme pacte de dignité.',
      posterUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      tag: 'Générosité',
      seriesId: 'dixeat-fiat-luxe'
    },
    {
      id: 'haute-scenographie',
      category: 'series',
      title: 'Haute Scénographie',
      subtitle: 'La précision du geste et le temps suspendu',
      description: 'L’orfèvrerie des arts de la table et des expériences olfactives d’exception.',
      posterUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      tag: 'Orfèvrerie',
      seriesId: 'dixeat-fiat-luxe'
    },
    {
      id: 'capital-patient',
      category: 'series',
      title: 'Capital Patient',
      subtitle: 'Parier sur 20 ans de transformation locale',
      description: 'Des fonds éthiques qui soutiennent l’énergie solaire, la fibre naturelle et la souveraineté.',
      posterUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      tag: 'Vision',
      seriesId: 'investors-builders'
    },
    {
      id: 'batisseurs-futur',
      category: 'series',
      title: 'Bâtisseurs du Futur',
      subtitle: 'Fonder des cathédrales solaires et numériques',
      description: 'Ceux qui construisent les centres de calcul écologiques et les écoles de demain.',
      posterUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      tag: 'Technologie',
      seriesId: 'investors-builders'
    }
  ],

  // ===========================================================================
  // 2. THÉMATIQUES (16 grands axes de résonance humaine)
  // ===========================================================================
  thematics: [
    // Volet 1 (1 à 8)
    {
      id: 'them-terroirs',
      category: 'thematics',
      title: 'Terroirs & Gastronomie',
      subtitle: 'La mémoire des goûts et de la terre nourricière',
      posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Afrique de l’Ouest & Andes'
    },
    {
      id: 'them-foi',
      category: 'thematics',
      title: 'Foi & Spiritualité',
      subtitle: 'Dialogue entre traditions sacrées et transcendance',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Bénin & Salvador de Bahia'
    },
    {
      id: 'them-artisanat',
      category: 'thematics',
      title: 'Artisanat & Matières Nobles',
      subtitle: 'Le bois d’Iroko, le bronze cire perdue et la terre cuite',
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Abomey & Ouidah'
    },
    {
      id: 'them-technologie',
      category: 'thematics',
      title: 'Technologie & Souveraineté',
      subtitle: 'Le code éthique et l’infrastructure bioclimatique',
      posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Dakar & Casablanca'
    },
    {
      id: 'them-identite',
      category: 'thematics',
      title: 'Identités & Diasporas',
      subtitle: 'Réinventer ses racines au-delà des frontières imposées',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Paris, Marseille & Abidjan'
    },
    {
      id: 'them-ecologie',
      category: 'thematics',
      title: 'Écologie Régénérative',
      subtitle: 'Restaurer les mangroves, les sols et les forêts',
      posterUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Grand-Popo & Ganvié'
    },
    {
      id: 'them-architecture',
      category: 'thematics',
      title: 'Architecture & Terre Crue',
      subtitle: 'Bâtir en symbiose avec le souffle de la terre',
      posterUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Porto-Novo & Ouagadougou'
    },
    {
      id: 'them-don',
      category: 'thematics',
      title: 'Économie du Don',
      subtitle: 'Ce qui se donne ne se perd jamais',
      posterUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Allada & Cotonou'
    },

    // Volet 2 (9 à 16)
    {
      id: 'them-education',
      category: 'thematics',
      title: 'Éducation & Transmission',
      subtitle: 'Apprendre par le geste, l’écoute et l’arbre à palabres',
      posterUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Bamako & Saint-Louis'
    },
    {
      id: 'them-sante',
      category: 'thematics',
      title: 'Santé & Plantes Sacrées',
      subtitle: 'La pharmacopée végétale des tradipraticiens',
      posterUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Toffo & Forêt sacrée'
    },
    {
      id: 'them-musique',
      category: 'thematics',
      title: 'Musique & Fréquences',
      subtitle: 'Le son des tambours initiatiques et des cordes anciennes',
      posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Dakar & Ouidah'
    },
    {
      id: 'them-orale',
      category: 'thematics',
      title: 'Récits Oraux & Mémoires',
      subtitle: 'La parole vivante transmise de bouche à oreille',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Allada & Abomey'
    },
    {
      id: 'them-foncier',
      category: 'thematics',
      title: 'Foncier & Communs',
      subtitle: 'Protéger la terre collective des générations futures',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Bénin rural'
    },
    {
      id: 'them-mode',
      category: 'thematics',
      title: 'Mode Durable & Teintures',
      subtitle: 'L’indigo sauvage, le coton écru et la coupe noble',
      posterUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Sakété & Abidjan'
    },
    {
      id: 'them-cinema',
      category: 'thematics',
      title: 'Cinéma & Archives Réelles',
      subtitle: 'Raconter nos propres histoires avec nos propres caméras',
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Ouidah & Cotonou'
    },
    {
      id: 'them-cooperation',
      category: 'thematics',
      title: 'Coopération Sud-Sud',
      subtitle: 'Des alliances vivantes entre l’Afrique et les Amériques',
      posterUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      tag: '16 récits',
      territory: 'Cotonou & Salvador'
    }
  ],

  // ===========================================================================
  // 3. MOTS-CLÉS / SUJETS (16 défis concrets racontés par 16 voix)
  // ===========================================================================
  topics: [
    // Volet 1 (1 à 8)
    {
      id: 'michael-jackson',
      category: 'topics',
      title: 'Michael Jackson',
      subtitle: '16 regards humains sur l’onde du Roi de la Pop',
      posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      tag: 'Sujet culte',
      territory: 'Monde & Afrique'
    },
    {
      id: 'premiere-piece',
      category: 'topics',
      title: 'La Première Pièce',
      subtitle: 'Le souvenir indélébile du tout premier geste artisanal',
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      tag: 'Récit d’origine',
      territory: 'Ateliers'
    },
    {
      id: 'le-carrefour',
      category: 'topics',
      title: 'Le Carrefour',
      subtitle: 'Le moment où l’on a dû choisir entre deux voies',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Dilemme de vie',
      territory: 'Allada & Ouidah'
    },
    {
      id: 'la-pirogue',
      category: 'topics',
      title: 'La Pirogue',
      subtitle: 'Glisser entre deux rives, apprendre le silence de l’eau',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Voie navigable',
      territory: 'Ganvié'
    },
    {
      id: 'la-graine',
      category: 'topics',
      title: 'La Graine Ancestrale',
      subtitle: 'Conserver la semence reçue des aïeux pour demain',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: 'Semence sacrée',
      territory: 'Toffo'
    },
    {
      id: 'indigo-sauvage',
      category: 'topics',
      title: 'L’Indigo Sauvage',
      subtitle: 'La fermentation de la feuille et le bleu immortel',
      posterUrl: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80',
      tag: 'Alchimie végétale',
      territory: 'Sakété'
    },
    {
      id: 'le-silence',
      category: 'topics',
      title: 'Le Silence Sacré',
      subtitle: 'Ce que l’on entend quand tout le bruit cesse',
      posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      tag: 'Méditation',
      territory: 'Couvent'
    },
    {
      id: 'le-pardon',
      category: 'topics',
      title: 'Le Pardon',
      subtitle: 'La réconciliation difficile avec l’autre ou soi-même',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: 'Paix intérieure',
      territory: 'Abomey'
    },

    // Volet 2 (9 à 16)
    {
      id: 'terre-rouge',
      category: 'topics',
      title: 'L’Odeur de la Terre Rouge',
      subtitle: 'La première pluie sur l’argile brûlée du soleil',
      posterUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      tag: 'Éveil des sens',
      territory: 'Plateau d’Abomey'
    },
    {
      id: 'or-des-anciens',
      category: 'topics',
      title: 'L’Or des Anciens',
      subtitle: 'Le métal incorruptible et la dignité des rois',
      posterUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      tag: 'Joyaux',
      territory: 'Ouidah'
    },
    {
      id: 'nuit-etoilee',
      category: 'topics',
      title: 'La Nuit sans Électricité',
      subtitle: 'Le ciel immense et les veillées autour du feu',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Cosmogonie',
      territory: 'Bénin intérieur'
    },
    {
      id: 'tambour-parlant',
      category: 'topics',
      title: 'Le Tambour Parlant',
      subtitle: 'Les rythmes codés que les initiés comprennent',
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      tag: 'Fréquence',
      territory: 'Allada'
    },
    {
      id: 'arbre-iroko',
      category: 'topics',
      title: 'L’Iroko Millénaire',
      subtitle: 'L’arbre sanctuaire sous lequel reposent les secrets',
      posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      tag: 'Sanctuaire',
      territory: 'Forêt sacrée'
    },
    {
      id: 'epreuve-du-feu',
      category: 'topics',
      title: 'L’Épreuve du Feu',
      subtitle: 'Quand la forge et l’épreuve révèlent la vraie force',
      posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      tag: 'Transformation',
      territory: 'Fonderie d’art'
    },
    {
      id: 'le-masque-sacré',
      category: 'topics',
      title: 'Le Masque Porté',
      subtitle: 'Devenir l’esprit sans perdre son humilité humaine',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Incarnation',
      territory: 'Porto-Novo'
    },
    {
      id: 'rencontre-imprevue',
      category: 'topics',
      title: 'La Rencontre Imprévue',
      subtitle: 'Le jour où un parfait inconnu a changé ma destinée',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'Destin',
      territory: 'Gare & Port'
    }
  ],

  // ===========================================================================
  // 4. OFFRES & CRÉATIONS D'ARTISANS (16 pièces, créations et ateliers nobles)
  // ===========================================================================
  offers: [
    // Volet 1 (1 à 8)
    {
      id: 'off-masque-iroko',
      category: 'offers',
      title: 'Masque sculpté en bois d’Iroko',
      subtitle: 'Sculpture rituelle façonnée à la gouge traditionnelle',
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      tag: 'Pièce unique',
      price: '140 €',
      artisanName: 'Dah Zounon',
      territory: 'Allada'
    },
    {
      id: 'off-etoffe-kanvo',
      category: 'offers',
      title: 'Étoffe tissée Kanvo royale',
      subtitle: 'Tissu traditionnel en coton bio teinté à l’indigo',
      posterUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      tag: 'Textile noble',
      price: '85 €',
      artisanName: 'Koffi Tisserand',
      territory: 'Abomey'
    },
    {
      id: 'off-poterie-argile',
      category: 'offers',
      title: 'Jarre en terre cuite lustrée',
      subtitle: 'Céramique de tradition cuite au feu de bois naturel',
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      tag: 'Céramique',
      price: '45 €',
      artisanName: 'Amara Dossou',
      territory: 'Grand-Popo'
    },
    {
      id: 'off-huiles-sacrees',
      category: 'offers',
      title: 'Élixir de plantes & onguent',
      subtitle: 'Préparation botanique issue du jardin des simples',
      posterUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      tag: 'Apothicairerie',
      price: '35 €',
      artisanName: 'Sœur Blandine',
      territory: 'Toffo'
    },
    {
      id: 'off-siege-royal',
      category: 'offers',
      title: 'Tabouret royal sculpté',
      subtitle: 'Symbole de dignité et d’assise ancestrale',
      posterUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      tag: 'Ébénisterie',
      price: '195 €',
      artisanName: 'Atelier d’Allada',
      territory: 'Allada'
    },
    {
      id: 'off-atelier-tissage',
      category: 'offers',
      title: 'Initiation au tissage Kanvo',
      subtitle: 'Stage immersif de 2 jours auprès des maîtres',
      posterUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
      tag: 'Atelier vivant',
      price: '120 €',
      artisanName: 'Koffi & Coopérative',
      territory: 'Abomey'
    },
    {
      id: 'off-graines-bio',
      category: 'offers',
      title: 'Coffret de semences paysannes',
      subtitle: 'Variétés patrimoniales protégées et reproductibles',
      posterUrl: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80',
      tag: 'Agroécologie',
      price: '28 €',
      artisanName: 'Sènan',
      territory: 'Toffo'
    },
    {
      id: 'off-tambour-sculpte',
      category: 'offers',
      title: 'Tambour initiatique sculpté',
      subtitle: 'Instrument accordé en peau de chèvre sauvage',
      posterUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
      tag: 'Lutherie sacrée',
      price: '160 €',
      artisanName: 'Babacar Ndiaye',
      territory: 'Dakar'
    },

    // Volet 2 (9 à 16)
    {
      id: 'off-echarpe-alpaga',
      category: 'offers',
      title: 'Écharpe en vigogne et alpaga',
      subtitle: 'Tissée main sur les hauteurs de la Vallée Sacrée',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Textile des Andes',
      price: '110 €',
      artisanName: 'Sayri Quispe',
      territory: 'Cusco'
    },
    {
      id: 'off-degustation-dantokpa',
      category: 'offers',
      title: 'Dégustation des mets oubliés',
      subtitle: 'Voyage sensoriel à travers les saveurs de Dantokpa',
      posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      tag: 'Gastronomie',
      price: '50 €',
      artisanName: 'Chef Koffi Mensah',
      territory: 'Cotonou'
    },
    {
      id: 'off-bronze-cire-perdue',
      category: 'offers',
      title: 'Statue de bronze cire perdue',
      subtitle: 'Fonderie artisanale d’inspiration royale d’Ifè',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Sculpture bronze',
      price: '220 €',
      artisanName: 'Mawulolo Agossa',
      territory: 'Ouidah'
    },
    {
      id: 'off-masterclass-herboristerie',
      category: 'offers',
      title: 'Masterclass Herboristerie',
      subtitle: '1 journée de cueillette et d’extraction naturelle',
      posterUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      tag: 'Masterclass',
      price: '75 €',
      artisanName: 'Sœur Blandine',
      territory: 'Toffo'
    },
    {
      id: 'off-livre-art-ganvie',
      category: 'offers',
      title: 'Livre d’art : Mémoires d’Eau',
      subtitle: 'Photographies argentiques et récits des piroguiers',
      posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      tag: 'Édition d’art',
      price: '48 €',
      artisanName: 'Collectif Ganvié',
      territory: 'Ganvié'
    },
    {
      id: 'off-carnet-cuir-naturel',
      category: 'offers',
      title: 'Carnet relié cuir végétal',
      subtitle: 'Papier recyclé artisanal et couture au fil de lin',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: 'Papeterie',
      price: '38 €',
      artisanName: 'Atelier de Bobo',
      territory: 'Porto-Novo'
    },
    {
      id: 'off-residence-lacustre',
      category: 'offers',
      title: 'Immersion lacustre de 3 jours',
      subtitle: 'Séjour en maison sur pilotis et navigation guidée',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: 'Résidence',
      price: '190 €',
      artisanName: 'Tobi Piroguier',
      territory: 'Ganvié'
    },
    {
      id: 'off-pendentif-lave',
      category: 'offers',
      title: 'Pendentif d’argent & obsidienne',
      subtitle: 'Amulette taillée à la main selon les motifs quechuas',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'Joaillerie d’art',
      price: '65 €',
      artisanName: 'Sayri Quispe',
      territory: 'Pisac'
    }
  ],

  // ===========================================================================
  // 5. APPELS & OPPORTUNITÉS (16 projets territoriaux et collectes citoyennes)
  // ===========================================================================
  opportunities: [
    // Volet 1 (1 à 8)
    {
      id: 'opp-embarcadere-ganvie',
      category: 'opportunities',
      title: 'Embarcadère piroguier de Ganvié',
      subtitle: 'Rénovation de la plateforme d’accueil communautaire',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Financement participatif',
      funding: { collected: 14200, target: 25000, pct: 57, backers: 184 },
      territory: 'Ganvié'
    },
    {
      id: 'opp-semences-toffo',
      category: 'opportunities',
      title: 'Conservatoire vivant des semences',
      subtitle: 'Achat de silos en terre cuite et semences rares',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: 'Financement participatif',
      funding: { collected: 18500, target: 20000, pct: 92, backers: 215 },
      territory: 'Toffo'
    },
    {
      id: 'opp-coop-tisserandes',
      category: 'opportunities',
      title: 'Atelier des femmes tisserandes',
      subtitle: 'Acquisition de 12 métiers à tisser traditionnels',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'Financement participatif',
      funding: { collected: 9800, target: 15000, pct: 65, backers: 142 },
      territory: 'Abomey'
    },
    {
      id: 'opp-ecole-arts-oraux',
      category: 'opportunities',
      title: 'École nomade des arts du conte',
      subtitle: 'Caravane itinérante d’initiation des enfants au conte',
      posterUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      tag: 'Projet éducatif',
      funding: { collected: 6400, target: 12000, pct: 53, backers: 98 },
      territory: 'Allada & Ouidah'
    },
    {
      id: 'opp-filtration-solaire',
      category: 'opportunities',
      title: 'Filtration solaire sur la lagune',
      subtitle: 'Installation de pompes solaires d’eau potable',
      posterUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80',
      tag: 'Écologie',
      funding: { collected: 22000, target: 30000, pct: 73, backers: 310 },
      territory: 'Grand-Popo'
    },
    {
      id: 'opp-fresques-allada',
      category: 'opportunities',
      title: 'Restauration des fresques sacrées',
      subtitle: 'Sauvegarde des bas-reliefs polychromes centenaires',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Patrimoine',
      funding: { collected: 8100, target: 10000, pct: 81, backers: 130 },
      territory: 'Allada'
    },
    {
      id: 'opp-recueil-polyglotte',
      category: 'opportunities',
      title: 'Édition du recueil des récits',
      subtitle: 'Impression en fon, yoruba, espagnol et français',
      posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      tag: 'Édition citoyenne',
      funding: { collected: 4500, target: 8000, pct: 56, backers: 76 },
      territory: 'Cotonou'
    },
    {
      id: 'opp-foret-sanctuaire',
      category: 'opportunities',
      title: 'Pépinière d’arbres sanctuaires',
      subtitle: 'Reboisement de 5 000 plants d’Iroko et baobabs',
      posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      tag: 'Régénération',
      funding: { collected: 11200, target: 18000, pct: 62, backers: 190 },
      territory: 'Bénin forestier'
    },

    // Volet 2 (9 à 16)
    {
      id: 'opp-residence-textile-andes',
      category: 'opportunities',
      title: 'Résidence transatlantique textile',
      subtitle: 'Échange d’artisans entre Abomey et Cusco',
      posterUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      tag: 'Coopération Sud-Sud',
      funding: { collected: 15600, target: 20000, pct: 78, backers: 240 },
      territory: 'Bénin & Pérou'
    },
    {
      id: 'opp-fournil-solaire-dantokpa',
      category: 'opportunities',
      title: 'Fournil solaire communautaire',
      subtitle: 'Cuisson collective écologique pour les commerçantes',
      posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      tag: 'Énergie propre',
      funding: { collected: 7900, target: 14000, pct: 56, backers: 115 },
      territory: 'Dantokpa'
    },
    {
      id: 'opp-numerisation-archives-sonores',
      category: 'opportunities',
      title: 'Archives sonores des griots',
      subtitle: 'Numérisation haute fidélité de 300 heures de chants',
      posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      tag: 'Mémoire immatérielle',
      funding: { collected: 13000, target: 16000, pct: 81, backers: 205 },
      territory: 'Bamako & Dakar'
    },
    {
      id: 'opp-centre-sculpture-bois',
      category: 'opportunities',
      title: 'Centre d’apprentissage de sculpture',
      subtitle: 'Transmission aux jeunes apprentis des faubourgs',
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      tag: 'Formation des jeunes',
      funding: { collected: 19400, target: 25000, pct: 77, backers: 280 },
      territory: 'Porto-Novo'
    },
    {
      id: 'opp-caravane-medicale-plantes',
      category: 'opportunities',
      title: 'Caravane des plantes qui soignent',
      subtitle: 'Soins traditionnels gratuits dans les villages isolés',
      posterUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      tag: 'Santé solidaire',
      funding: { collected: 8700, target: 15000, pct: 58, backers: 130 },
      territory: 'Nord Bénin'
    },
    {
      id: 'opp-micro-barrages-ecologiques',
      category: 'opportunities',
      title: 'Réseau de micro-barrages en bambou',
      subtitle: 'Régulation douce des crues pour les villages sur pilotis',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: 'Ingénierie douce',
      funding: { collected: 27000, target: 35000, pct: 77, backers: 390 },
      territory: 'Ganvié'
    },
    {
      id: 'opp-studio-acoustique-communautaire',
      category: 'opportunities',
      title: 'Studio acoustique des voix d’Afrique',
      subtitle: 'Enregistrement des polyphonies traditionnelles',
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      tag: 'Studio libre',
      funding: { collected: 12500, target: 22000, pct: 56, backers: 175 },
      territory: 'Ouidah'
    },
    {
      id: 'opp-tiers-lieu-ouidah',
      category: 'opportunities',
      title: 'Tiers-lieu d’accueil solidaire',
      subtitle: 'Espace partagé pour créateurs, chercheurs et voyageurs',
      posterUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      tag: 'Tiers-lieu',
      funding: { collected: 31000, target: 40000, pct: 77, backers: 430 },
      territory: 'Ouidah'
    }
  ],

  // ===========================================================================
  // 6. ENTREPRISES & MARQUES (16 ateliers, manufactures et maisons de savoir-faire)
  // ===========================================================================
  brands: [
    // Volet 1 (1 à 8)
    {
      id: 'br-coop-kanvo',
      category: 'brands',
      title: 'Coopérative Kanvo d’Abomey',
      subtitle: 'La manufacture royale du tissage d’exception',
      posterUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      tag: 'Manufacture',
      territory: 'Abomey (Bénin)'
    },
    {
      id: 'br-fonderie-ouidah',
      category: 'brands',
      title: 'Ateliers du Bronze d’Ouidah',
      subtitle: 'Fondeurs d’art à la cire perdue depuis 4 générations',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Fonderie d’art',
      territory: 'Ouidah (Bénin)'
    },
    {
      id: 'br-fondation-zinsou',
      category: 'brands',
      title: 'Fondation Zinsou',
      subtitle: 'Pionniers de l’art contemporain et de la mémoire vivante',
      posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: 'Musée & Fondation',
      territory: 'Cotonou (Bénin)'
    },
    {
      id: 'br-menuiserie-ganvie',
      category: 'brands',
      title: 'Maison des Piroguiers',
      subtitle: 'Menuiserie navale traditionnelle en bois imputrescible',
      posterUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      tag: 'Chantier naval',
      territory: 'Ganvié (Bénin)'
    },
    {
      id: 'br-cacao-sao-tome',
      category: 'brands',
      title: 'Cacao & Terres Nobles',
      subtitle: 'Chocolaterie bean-to-bar équitable et biologique',
      posterUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      tag: 'Chocolaterie',
      territory: 'São Tomé'
    },
    {
      id: 'br-teintureries-sakete',
      category: 'brands',
      title: 'Teintureries Royales de Sakété',
      subtitle: 'Maîtres de l’indigo végétal et des mordants naturels',
      posterUrl: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80',
      tag: 'Teintures végétales',
      territory: 'Sakété (Bénin)'
    },
    {
      id: 'br-tissage-pisac',
      category: 'brands',
      title: 'Filatures Andines de Pisac',
      subtitle: 'Laine d’alpaga filée et tissée sur métiers verticaux',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tag: 'Laine d’altitude',
      territory: 'Pisac (Pérou)'
    },
    {
      id: 'br-poterie-se',
      category: 'brands',
      title: 'Poteries d’Argile de Sè',
      subtitle: 'Céramiques rituelles et utilitaires modelées main',
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      tag: 'Argile vivante',
      territory: 'Sè (Bénin)'
    },

    // Volet 2 (9 à 16)
    {
      id: 'br-vannerie-toffinou',
      category: 'brands',
      title: 'Vanneries Lacustres Toffinou',
      subtitle: 'Tressage des joncs et roseaux des berges lacustres',
      posterUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      tag: 'Vannerie fine',
      territory: 'Ganvié (Bénin)'
    },
    {
      id: 'br-distillerie-grand-popo',
      category: 'brands',
      title: 'Distillerie Botanique de Popo',
      subtitle: 'Eaux florales et huiles de citronnelle et vétiver',
      posterUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      tag: 'Distillerie florale',
      territory: 'Grand-Popo (Bénin)'
    },
    {
      id: 'br-ebenisterie-iroko',
      category: 'brands',
      title: 'Ébénisterie de l’Iroko',
      subtitle: 'Mobilier contemporain sculpté en bois éco-certifié',
      posterUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      tag: 'Mobilier d’art',
      territory: 'Porto-Novo (Bénin)'
    },
    {
      id: 'br-cuir-vegetal-bobo',
      category: 'brands',
      title: 'Maroquinerie du Cuir Végétal',
      subtitle: 'Tannage traditionnel aux écorces d’acacia sauvage',
      posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      tag: 'Cuir végétal',
      territory: 'Bobo-Dioulasso'
    },
    {
      id: 'br-cafe-cusco',
      category: 'brands',
      title: 'Café des Brumes de Cusco',
      subtitle: 'Café d’altitude cultivé sous ombrage forestier',
      posterUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      tag: 'Café d’altitude',
      territory: 'Cusco (Pérou)'
    },
    {
      id: 'br-luthiers-dakar',
      category: 'brands',
      title: 'Facture Instrumentale de Dakar',
      subtitle: 'Créateurs de koras contemporaines et balafons d’art',
      posterUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
      tag: 'Lutherie d’art',
      territory: 'Dakar (Sénégal)'
    },
    {
      id: 'br-savonnerie-karite',
      category: 'brands',
      title: 'Savonnerie du Karité Sauvage',
      subtitle: 'Saponification à froid au beurre pur de l’Atacora',
      posterUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      tag: 'Cosmétique naturelle',
      territory: 'Natitingou (Bénin)'
    },
    {
      id: 'br-perlerie-ouidah',
      category: 'brands',
      title: 'Atelier des Perles Sacrées',
      subtitle: 'Verre soufflé et parures perlées de dignitaires',
      posterUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      tag: 'Perlerie royale',
      territory: 'Ouidah (Bénin)'
    }
  ]
};

// Fonction pour récupérer l'élément ou un fallback
export function getGalleryProposalById(id: string): GalleryPosterItem | undefined {
  for (const cat of Object.keys(GALLERY_ITEMS_BY_CATEGORY) as ExplorerCategoryType[]) {
    const found = GALLERY_ITEMS_BY_CATEGORY[cat].find(item => item.id === id);
    if (found) return found;
  }
  return undefined;
}

// Fonction qui génère ou récupère 16 protagonistes riches pour n'importe quelle proposition
export function get16StoriesForGalleryId(id: string, shuffleSeed: number = 0): AffiliationPerson[] {
  const proposal = getGalleryProposalById(id);
  if (!proposal) {
    return generate16StoriesForProposal('Exploration', 'thematics', 'Bénin');
  }

  // Si c'est une série, on s'appuie sur la série dans MATRIX_SERIES_DATA
  if (proposal.category === 'series') {
    const seriesId = proposal.seriesId || id;
    const series = MATRIX_SERIES_DATA.find(s => s.seriesId === seriesId) || MATRIX_SERIES_DATA[0];
    return series.pioneers.slice(0, 16);
  }

  // Sinon, générer 16 personnes avec leur rôle, portrait et vidéo
  const stories = generate16StoriesForProposal(proposal.title, proposal.category, proposal.territory || 'Bénin');
  if (shuffleSeed > 0) {
    const offset = (shuffleSeed * 5) % stories.length;
    return [...stories.slice(offset), ...stories.slice(0, offset)];
  }
  return stories;
}
