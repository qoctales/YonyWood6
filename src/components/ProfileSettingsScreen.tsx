import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  ShoppingBag,
  Coins,
  HeartHandshake,
  X,
  Share2,
  Camera,
  MapPin,
  MessageSquare,
  Play,
  Pause,
  Film,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Lock,
  Mail,
  Key,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  Video,
  LogOut,
  Check,
  BookOpen,
  Megaphone,
  ArrowLeft,
  DollarSign,
  Send,
  Sparkles,
  Info,
  Copy,
  Users,
  User,
  Gem,
  Volume2,
  VolumeX,
  Clapperboard,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ViewScreen, AffiliationPerson, Protagonist } from '../types';
import { PROTAGONISTS, DOCUMENTARIES } from '../data/mockData';
import { MATRIX_SERIES_DATA } from '../data/matrixData';
import { ResonanceModal } from './ResonanceModal';

export type ProfilePillar = 'recits_episodes' | 'productions' | 'offres' | 'appels';
export type DimensionTab = 'recit' | 'episodes' | 'productions' | 'creations' | 'initiatives' | 'appels' | ProfilePillar;

export interface ProfileSettingsScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  selectedDocFilter?: string[];
  onUpdateDocFilter?: (docIds: string[]) => void;
  language?: string;
  onUpdateLanguage?: (lang: string) => void;
  hideQuestionByDefault?: boolean;
  onToggleHideQuestion?: (val: boolean) => void;
  protagonistId?: string; // Si fourni = mode Visiteur
  initialTab?: DimensionTab;
}

// 1. Récit : Vidéo personnelle / histoire personnelle
export interface UserRecitItem {
  id: string;
  title: string;
  chapter?: string;
  subtitle?: string;
  description: string;
  duration: string;
  viewsCount?: number;
  videoUrl: string;
  posterUrl: string;
  year?: string;
  quote?: string;
}

// 2. Épisodes : Vidéos dans les séries documentaires
export interface UserEpisodeVideo {
  id: string;
  title: string;
  seriesId: string;
  seriesTitle: string;
  status?: string;
  submissionDate?: string;
  viewsCount: number;
  duration: string;
  videoUrl: string;
  posterUrl: string;
}

// 3. Productions : Parts de coproduction
export interface UserProductionShare {
  id: string;
  seriesId: string;
  seriesTitle: string;
  sharesCount: number; // Total parts
  sharesOnSale: number; // Mises en vente
  startPrice?: number; // Prix de départ unitaire par part
  salePrice: number; // Prix actuel unitaire
  purchasePrice: number;
  recommendedPrice: number;
  rsiPercent?: number; // Retour sur investissement en %
  returnForecastPercent: number;
  returnForecastAmount: number;
  videoUrl: string;
  posterUrl: string;
  status: string;
}

// 4. Créations : Artisanat, pièces & ateliers
export interface UserCreationItem {
  id: string;
  title: string;
  seriesTitle?: string;
  categoryLabel: string;
  type: 'produit' | 'service' | 'atelier' | 'consultation' | 'artisanat';
  price: string;
  priceNumeric: number;
  stock?: string;
  description: string;
  specs?: string;
  videoUrl: string;
  posterUrl: string;
}

// 5. Initiatives : Financement participatif
export interface UserInitiativeItem {
  id: string;
  title: string;
  seriesTitle?: string;
  category: string;
  collectedAmount: number;
  targetAmount: number;
  backersCount: number;
  daysRemaining: number;
  description: string;
  videoUrl: string;
  posterUrl: string;
}

// 6. Appels : Besoins & collaborations
export interface UserAppelItem {
  id: string;
  title: string;
  category: string;
  urgency: string;
  description: string;
  impact?: string;
  videoUrl: string;
  posterUrl: string;
}

// Presets multimédias pour l'ajout rapide
const MEDIA_POSTER_PRESETS = [
  { name: 'Lagune & Ciel', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' },
  { name: 'Forêt & Végétal', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Indigo & Tissage', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Terre & Poterie', url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80' },
];

const MEDIA_VIDEO_PRESETS = [
  { name: 'Extrait Lagune', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
  { name: 'Bande-annonce Cinéma', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
  { name: 'Court Documentaire', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
];

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onNavigate,
  selectedDocFilter = [],
  onUpdateDocFilter = (_docIds: string[]) => {},
  language = 'fr',
  onUpdateLanguage = (_lang: string) => {},
  hideQuestionByDefault = false,
  onToggleHideQuestion = (_val: boolean) => {},
  protagonistId,
  initialTab = 'recit'
}) => {
  // Déterminer le mode : Propriétaire ou Visiteur
  const isOwner = !protagonistId || protagonistId === 'me';

  // Résolution du protagoniste cible (depuis MATRIX_SERIES_DATA ou PROTAGONISTS)
  const targetProtagonist = React.useMemo<Protagonist | null>(() => {
    if (isOwner) return null;

    // 1. Chercher d'abord dans MATRIX_SERIES_DATA par l'identifiant exact cliqué dans l'explorateur
    for (const series of MATRIX_SERIES_DATA) {
      const search = (list: AffiliationPerson[]): AffiliationPerson | null => {
        for (const p of list) {
          if (p.id === protagonistId) return p;
          if (p.invitedPeople && p.invitedPeople.length > 0) {
            const res = search(p.invitedPeople);
            if (res) return res;
          }
        }
        return null;
      };
      const foundInMatrix = search(series.pioneers);
      if (foundInMatrix) {
        return {
          id: foundInMatrix.id,
          slug: foundInMatrix.id,
          name: foundInMatrix.name,
          role: foundInMatrix.role,
          age: foundInMatrix.age,
          territory: foundInMatrix.territory || 'Ganvié',
          country: foundInMatrix.country || 'Bénin',
          flag: foundInMatrix.flag || '🇧🇯',
          photoUrl: foundInMatrix.photoUrl,
          teaserVideoUrl: foundInMatrix.teaserVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          quote: foundInMatrix.teaserPitch,
          bio: foundInMatrix.teaserPitch ? foundInMatrix.teaserPitch.replace(/«|»/g, '').trim() : `Passeur de savoirs et créateur dans la transmission ${foundInMatrix.universeTag || series.seriesTitle}.`,
          universeTag: foundInMatrix.universeTag,
          documentaryId: series.seriesId,
          stories: []
        } as unknown as Protagonist;
      }
    }

    // 2. Si non trouvé dans MATRIX_SERIES_DATA, chercher dans les protagonistes globaux PROTAGONISTS
    const found = PROTAGONISTS.find(p => p.id === protagonistId || p.slug === protagonistId);
    if (found) return found;

    // 3. Fallback de secours
    return {
      id: protagonistId,
      slug: protagonistId,
      name: 'Artisan Passeur',
      role: 'Passeur de savoirs traditionnels',
      territory: 'Ganvié',
      country: 'Bénin',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Artisan et passeur de savoirs dans la transmission des savoirs ancestraux.',
      teaserVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      stories: []
    } as unknown as Protagonist;
  }, [protagonistId, isOwner]);

  // Helper pour initialiser le pilier
  const getInitialPillar = (tab?: DimensionTab): ProfilePillar => {
    if (!tab) return 'recits_episodes';
    if (tab === 'recit' || tab === 'episodes' || tab === 'recits_episodes') return 'recits_episodes';
    if (tab === 'productions') return 'productions';
    if (tab === 'creations' || tab === 'offres') return 'offres';
    if (tab === 'initiatives' || tab === 'appels') return 'appels';
    return 'recits_episodes';
  };

  // 4 Piliers vidéo sur le profil
  const [activePillar, setActivePillar] = useState<ProfilePillar>(() => getInitialPillar(initialTab));
  const [pillarItemIndex, setPillarItemIndex] = useState<number>(0);

  // États de la vidéo (Tap central Play/Pause, son, timeline dorée, diamant)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlayPauseFeedback, setShowPlayPauseFeedback] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(84); // 01:24
  const [duration, setDuration] = useState<number>(225); // 03:45
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [isResonanceModalOpen, setIsResonanceModalOpen] = useState<boolean>(false);

  // Rétrocompatibilité activeTab pour les modales d'édition existantes
  const activeTab: DimensionTab = 
    activePillar === 'recits_episodes' ? 'recit' :
    activePillar === 'productions' ? 'productions' :
    activePillar === 'offres' ? 'creations' : 'appels';
  const setActiveTab = (tab: DimensionTab) => {
    setActivePillar(getInitialPillar(tab));
  };

  // État d'ouverture de la modale Paramètres (accessible uniquement par l'icône dans l'en-tête)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Identité du profil affiché
  const [userName, setUserName] = useState<string>(
    targetProtagonist ? targetProtagonist.name : 'Amina'
  );
  const [userFullName, setUserFullName] = useState<string>(
    targetProtagonist ? targetProtagonist.name : 'Amina Traoré'
  );
  const [userRole, setUserRole] = useState<string>(
    targetProtagonist ? targetProtagonist.role : 'Passeuse de mémoires sonores & artisane'
  );
  const [userTerritory, setUserTerritory] = useState<string>(
    targetProtagonist ? `${targetProtagonist.territory}, ${targetProtagonist.country}` : 'Ganvié & Cotonou, Bénin'
  );
  const [userBio, setUserBio] = useState<string>(
    targetProtagonist ? targetProtagonist.bio : 'Passeuse de mémoires sonores et artisane du tissage traditionnel. Entre la lagune de Ganvié et la terre rouge d’Allada, je recueille les chants du fleuve et les gestes millénaires.'
  );
  const [userPhoto, setUserPhoto] = useState<string>(
    targetProtagonist ? targetProtagonist.photoUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );

  useEffect(() => {
    if (targetProtagonist) {
      setUserName(targetProtagonist.name);
      setUserFullName(targetProtagonist.name);
      setUserRole(targetProtagonist.role);
      setUserTerritory(`${targetProtagonist.territory || 'Ganvié'}, ${targetProtagonist.country || 'Bénin'}`);
      setUserBio(targetProtagonist.bio);
      setUserPhoto(targetProtagonist.photoUrl);
      setProfileEditName(targetProtagonist.name);
      setProfileEditRole(targetProtagonist.role);
      setProfileEditTerritory(`${targetProtagonist.territory || 'Ganvié'}, ${targetProtagonist.country || 'Bénin'}`);
      setProfileEditBio(targetProtagonist.bio);
      setProfileEditPhoto(targetProtagonist.photoUrl);

      const vUrl = targetProtagonist.teaserVideoUrl || (targetProtagonist.stories && targetProtagonist.stories[0]?.videoUrl) || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      const pUrl = targetProtagonist.photoUrl || '/assets/protagonists/amara-tisserande.jpg';

      setRecits([
        {
          id: `recit-${targetProtagonist.id}-1`,
          title: `Mon chemin - ${targetProtagonist.name}`,
          chapter: 'Chapitre 1',
          subtitle: 'L’éveil du regard & la transmission',
          description: `Dans ce récit personnel, ${targetProtagonist.name} raconte ses premières années, l'héritage reçu et ce qui l'a mené à sa vocation.`,
          quote: targetProtagonist.quote || '« Le tissu n’est pas fait par les yeux, mais par la pulsation du corps. »',
          duration: '06:15',
          viewsCount: 1420,
          videoUrl: vUrl,
          posterUrl: pUrl
        },
        {
          id: `recit-${targetProtagonist.id}-2`,
          title: 'L’apprentissage',
          chapter: 'Chapitre 2',
          subtitle: 'Le temps de l’apprentissage',
          description: 'Récit intime sur les années de formation, les doutes traversés et le secret de la persévérance.',
          quote: '« Pour comprendre la matière, il faut accepter de ralentir et d’écouter. »',
          duration: '08:40',
          viewsCount: 890,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
          posterUrl: pUrl
        }
      ]);
      setRecitIndex(0);
      setIsPlaying(false);
    }
  }, [targetProtagonist]);

  // Édition de profil (propriétaire)
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileEditName, setProfileEditName] = useState<string>(userFullName);
  const [profileEditRole, setProfileEditRole] = useState<string>(userRole);
  const [profileEditTerritory, setProfileEditTerritory] = useState<string>(userTerritory);
  const [profileEditBio, setProfileEditBio] = useState<string>(userBio);
  const [profileEditPhoto, setProfileEditPhoto] = useState<string>(userPhoto);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Indices de navigation par piste (chariot)
  const [recitIndex, setRecitIndex] = useState<number>(0);
  const [episodeIndex, setEpisodeIndex] = useState<number>(0);
  const [shareIndex, setShareIndex] = useState<number>(0);
  const [creationIndex, setCreationIndex] = useState<number>(0);
  const [initiativeIndex, setInitiativeIndex] = useState<number>(0);
  const [appelIndex, setAppelIndex] = useState<number>(0);

  // Swiping state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // Video playback reference
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // =========================================================================
  // 1. DATA DIMENSION 1 : RÉCIT (Histoires personnelles de vie, études, etc.)
  // =========================================================================
  const [recits, setRecits] = useState<UserRecitItem[]>(() => {
    if (targetProtagonist) {
      const vUrl = targetProtagonist.teaserVideoUrl || (targetProtagonist.stories && targetProtagonist.stories[0]?.videoUrl) || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      const pUrl = targetProtagonist.photoUrl || '/assets/protagonists/amara-tisserande.jpg';
      return [
        {
          id: `recit-${targetProtagonist.id}-1`,
          title: `Mon chemin - ${targetProtagonist.name}`,
          chapter: 'Chapitre 1',
          subtitle: 'L’éveil du regard & la transmission',
          description: `Dans ce récit personnel, ${targetProtagonist.name} raconte ses premières années, l'héritage reçu et ce qui l'a mené à sa vocation.`,
          quote: targetProtagonist.quote || '« Le tissu n’est pas fait par les yeux, mais par la pulsation du corps. »',
          duration: '06:15',
          viewsCount: 1420,
          videoUrl: vUrl,
          posterUrl: pUrl
        },
        {
          id: `recit-${targetProtagonist.id}-2`,
          title: 'L’apprentissage',
          chapter: 'Chapitre 2',
          subtitle: 'Le temps de l’apprentissage',
          description: 'Récit intime sur les années de formation, les doutes traversés et le secret de la persévérance.',
          quote: '« Pour comprendre la matière, il faut accepter de ralentir et d’écouter. »',
          duration: '08:40',
          viewsCount: 890,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
          posterUrl: pUrl
        }
      ];
    }
    return [
      {
        id: 'recit-1',
        title: 'Le chant de la lagune',
        chapter: 'Récit personnel',
        subtitle: 'Origines & Mémoire',
        description: 'Je raconte mon enfance sur l’eau, mes premières années d’études et la façon dont ma grand-mère m’a transmis la voix des femmes piroguières.',
        quote: '« L’eau retient tout ce que les hommes oublient de nommer. »',
        duration: '05:30',
        viewsCount: 1840,
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        posterUrl: '/assets/protagonists/amara-tisserande.jpg'
      },
      {
        id: 'recit-2',
        title: 'Les métiers du fil',
        chapter: 'Parcours de formation',
        subtitle: 'Transmission & Métier',
        description: 'Après ma formation en sociologie, j’ai choisi de réapprendre le geste du tissage auprès des aînées d’Allada pour en faire un pont entre générations.',
        quote: '« Savoir d’où l’on vient donne à la navette son équilibre parfait. »',
        duration: '07:15',
        viewsCount: 920,
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        posterUrl: '/assets/protagonists/koffi-tisserand.jpg'
      }
    ];
  });

  // =========================================================================
  // 2. DATA DIMENSION 2 : ÉPISODES (Vidéos dans les séries documentaires)
  // =========================================================================
  const [episodes, setEpisodes] = useState<UserEpisodeVideo[]>(() => {
    if (targetProtagonist && targetProtagonist.stories && targetProtagonist.stories.length > 0) {
      return targetProtagonist.stories.map((st, idx) => ({
        id: st.id,
        title: st.title,
        seriesId: targetProtagonist.documentaryId || 'finagnon-qosqorico',
        seriesTitle: 'Finagnon < > Qosqorico',
        status: 'Validée',
        submissionDate: '15 Fév 2026',
        viewsCount: 1200 + idx * 300,
        duration: st.duration || '07:30',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        posterUrl: st.videoCoverUrl || '/assets/posters/finagnon-qosqorico.png'
      }));
    }
    return [
      {
        id: 'ep-1',
        title: 'Le chant des piroguiers sous la brume de Ganvié',
        seriesId: 'finagnon-qosqorico',
        seriesTitle: 'Finagnon < > Qosqorico',
        status: 'Validée',
        submissionDate: '12 Fév 2026',
        viewsCount: 1420,
        duration: '4:18',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        posterUrl: '/assets/posters/finagnon-qosqorico.png'
      },
      {
        id: 'ep-2',
        title: 'Ce que murmurent les feuilles de karité avant l’aurore',
        seriesId: 'jesus-legba',
        seriesTitle: 'Jésus < > Èṣù',
        status: 'Tournage planifié',
        submissionDate: '28 Fév 2026',
        viewsCount: 680,
        duration: '3:45',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        posterUrl: '/assets/posters/jesus-esu.png'
      },
      {
        id: 'ep-3',
        title: 'Le verbe et l’écho des carrefours à la nuit tombée',
        seriesId: 'blacks-one-beyond-eve',
        seriesTitle: 'Blacks One < > Beyond Eve',
        status: 'En cours de montage',
        submissionDate: '05 Mar 2026',
        viewsCount: 230,
        duration: '5:10',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        posterUrl: '/assets/posters/blacks-one-beyond-eve.png'
      }
    ];
  });

  // =========================================================================
  // 3. DATA DIMENSION 3 : PRODUCTIONS (Parts de coproduction avec Prix départ & RSI)
  // =========================================================================
  const [productions, setProductions] = useState<UserProductionShare[]>([
    {
      id: 'prod-1',
      seriesId: 'finagnon-qosqorico',
      seriesTitle: 'Finagnon < > Qosqorico',
      sharesCount: 10,
      sharesOnSale: isOwner ? 2 : 2, // Pour visiteur : parts disponibles à l'achat
      startPrice: 35,
      salePrice: 55,
      purchasePrice: 350,
      recommendedPrice: 55,
      rsiPercent: 57.1,
      returnForecastPercent: 18.5,
      returnForecastAmount: 64.75,
      status: 'Diffusion internationale',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      posterUrl: '/assets/posters/finagnon-qosqorico.png'
    },
    {
      id: 'prod-2',
      seriesId: 'jesus-legba',
      seriesTitle: 'Jésus < > Èṣù',
      sharesCount: 5,
      sharesOnSale: 2,
      startPrice: 40,
      salePrice: 50,
      purchasePrice: 200,
      recommendedPrice: 48,
      rsiPercent: 25.0,
      returnForecastPercent: 12.0,
      returnForecastAmount: 24.00,
      status: 'Post-production active',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      posterUrl: '/assets/posters/jesus-esu.png'
    },
    {
      id: 'prod-3',
      seriesId: 'blacks-one-beyond-eve',
      seriesTitle: 'Blacks One < > Beyond Eve',
      sharesCount: 8,
      sharesOnSale: 1,
      startPrice: 42,
      salePrice: 52,
      purchasePrice: 380,
      recommendedPrice: 50,
      rsiPercent: 23.8,
      returnForecastPercent: 15.0,
      returnForecastAmount: 41.60,
      status: 'En diffusion',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      posterUrl: '/assets/posters/blacks-one-beyond-eve.png'
    }
  ]);

  // =========================================================================
  // 4. DATA DIMENSION 4 : CRÉATIONS (Artisanat, Pièces, Ateliers)
  // =========================================================================
  const [creations, setCreations] = useState<UserCreationItem[]>(() => {
    if (targetProtagonist) {
      return [
        {
          id: `cr-${targetProtagonist.id}-1`,
          title: 'Étoffe rituelle tissée au fil de coton',
          seriesTitle: 'Finagnon < > Qosqorico',
          categoryLabel: 'Artisanat d’art traditionnel',
          type: 'artisanat',
          price: '120 €',
          priceNumeric: 120,
          stock: '3 pièces numérotées',
          description: 'Pièce tissée sur métier traditionnel en fil de coton biologique cultivé localement et teinté à l’indigo naturel.',
          specs: '180 x 60 cm • 100% Coton brut biologique',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
          posterUrl: '/assets/protagonists/amara-tisserande.jpg'
        },
        {
          id: `cr-${targetProtagonist.id}-2`,
          title: 'Atelier d’écoute et d’initiation aux savoirs',
          seriesTitle: 'Finagnon < > Qosqorico',
          categoryLabel: 'Atelier immersif',
          type: 'atelier',
          price: '45 € / pers.',
          priceNumeric: 45,
          stock: '6 places disponibles',
          description: 'Une marche de 3 heures pour déceler les polyrythmies du vivant et la mémoire des gestes.',
          specs: 'Durée : 3h00 • Matériel fourni',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: '/assets/protagonists/koffi-tisserand.jpg'
        }
      ];
    }
    return [
      {
        id: 'cr-1',
        title: 'Étoffe rituelle tissée au fil de coton',
        seriesTitle: 'Finagnon < > Qosqorico',
        categoryLabel: 'Artisanat d’art traditionnel',
        type: 'artisanat',
        price: '120 €',
        priceNumeric: 120,
        stock: '3 pièces numérotées',
        description: 'Pièce tissée sur métier traditionnel en fil de coton biologique cultivé localement et teinté à l’indigo naturel.',
        specs: '180 x 60 cm • 100% Coton brut biologique',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        posterUrl: '/assets/protagonists/amara-tisserande.jpg'
      },
      {
        id: 'cr-2',
        title: 'Atelier d’écoute des chants de la lagune',
        seriesTitle: 'Finagnon < > Qosqorico',
        categoryLabel: 'Transmission orale & Ateliers',
        type: 'atelier',
        price: '45 € / pers.',
        priceNumeric: 45,
        stock: '8 places par session',
        description: 'Session de 2h30 en pirogue à Ganvié pour apprendre à enregistrer et capter les sons sacrés de l’eau.',
        specs: 'Durée : 2h30 • Pirogue incluse • Casque audio fourni',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        posterUrl: '/assets/protagonists/koffi-tisserand.jpg'
      },
      {
        id: 'cr-3',
        title: 'Navette sculptée en bois d’iroko patiné',
        seriesTitle: 'Jésus < > Èṣù',
        categoryLabel: 'Objet de collection & Outils',
        type: 'produit',
        price: '65 €',
        priceNumeric: 65,
        stock: '2 exemplaires disponibles',
        description: 'Navette sculptée à la main par les menuisiers de Porto-Novo dans des chutes de charpentes centenaires.',
        specs: 'Longueur : 28 cm • Bois d’iroko poli à la cire d’abeille',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        posterUrl: '/assets/protagonists/chef-koffi.jpg'
      }
    ];
  });

  // =========================================================================
  // 5. DATA DIMENSION 5 : INITIATIVES (Projets participatifs)
  // =========================================================================
  const [initiatives, setInitiatives] = useState<UserInitiativeItem[]>([
    {
      id: 'init-1',
      title: 'L’Atelier solidaire des voix',
      seriesTitle: 'Finagnon < > Qosqorico',
      category: 'Préservation du Patrimoine Vivant',
      collectedAmount: 3450,
      targetAmount: 5000,
      backersCount: 42,
      daysRemaining: 18,
      description: 'Financement d’un studio d’enregistrement flottant à Ganvié pour sauvegarder les oraisons et contes aquatiques.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      posterUrl: '/assets/posters/finagnon-qosqorico.png'
    },
    {
      id: 'init-2',
      title: 'Le Métier à tisser d’Allada',
      seriesTitle: 'Finagnon < > Qosqorico',
      category: 'Équipement d’Atelier Collectif',
      collectedAmount: 1820,
      targetAmount: 2800,
      backersCount: 29,
      daysRemaining: 34,
      description: 'Reconstruction d’un métier à tisser en bois d’iroko pour former 8 jeunes apprenties.',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      posterUrl: '/assets/posters/jesus-esu.png'
    }
  ]);

  // =========================================================================
  // 6. DATA DIMENSION 6 : APPELS (Besoins, Collaborations, Compétences)
  // =========================================================================
  const [appels, setAppels] = useState<UserAppelItem[]>([
    {
      id: 'app-1',
      title: 'Fil de coton biologique',
      category: 'Matières premières & Éco-filière',
      urgency: 'Prioritaire',
      description: 'Recherche de coopératives agricoles féminines produisant 50 kg de fil écru sans intrants chimiques pour notre atelier de formation.',
      impact: 'Garantit 6 mois d’apprentissage continu pour 12 apprentis sans recours aux matières synthétiques.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      posterUrl: '/assets/protagonists/amara-tisserande.jpg'
    },
    {
      id: 'app-2',
      title: 'Enregistreur audio portable',
      category: 'Matériel technique & Enregistrement',
      urgency: 'D’ici fin avril',
      description: 'Pour capturer les voix des anciens sur les berges sans distorsion avec microphone stéréo XY.',
      impact: 'Permettra d’archiver 25 entretiens avant la saison des pluies.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      posterUrl: '/assets/posters/blacks-one-beyond-eve.png'
    }
  ]);

  // Modales d'actions pour le Propriétaire
  const [isSellingShares, setIsSellingShares] = useState<boolean>(false);
  const [sellPriceInput, setSellPriceInput] = useState<number>(55);
  const [sellCountInput, setSellCountInput] = useState<number>(1);

  // Modification Récit
  const [editingRecit, setEditingRecit] = useState<UserRecitItem | null>(null);
  const [recitFormTitle, setRecitFormTitle] = useState<string>('');
  const [recitFormSubtitle, setRecitFormSubtitle] = useState<string>('');
  const [isDeletingRecit, setIsDeletingRecit] = useState<boolean>(false);

  // Modification Épisode
  const [editingEpisode, setEditingEpisode] = useState<UserEpisodeVideo | null>(null);
  const [episodeFormDuration, setEpisodeFormDuration] = useState<string>('');
  const [episodeFormViews, setEpisodeFormViews] = useState<number>(0);
  const [isDeletingEpisode, setIsDeletingEpisode] = useState<boolean>(false);

  // Modification Production
  const [editingProduction, setEditingProduction] = useState<UserProductionShare | null>(null);
  const [prodFormStartPrice, setProdFormStartPrice] = useState<number>(35);
  const [prodFormSalePrice, setProdFormSalePrice] = useState<number>(55);
  const [prodFormRsi, setProdFormRsi] = useState<number>(57.1);
  const [prodFormSharesCount, setProdFormSharesCount] = useState<number>(10);
  const [prodFormSharesOnSale, setProdFormSharesOnSale] = useState<number>(2);

  // Modification Création
  const [editingCreation, setEditingCreation] = useState<UserCreationItem | null>(null);
  const [creationFormTitle, setCreationFormTitle] = useState<string>('');
  const [creationFormPrice, setCreationFormPrice] = useState<string>('');
  const [creationFormCategory, setCreationFormCategory] = useState<string>('');
  const [creationFormDescription, setCreationFormDescription] = useState<string>('');
  const [creationFormPoster, setCreationFormPoster] = useState<string>('');
  const [creationFormVideo, setCreationFormVideo] = useState<string>('');
  const [isDeletingCreation, setIsDeletingCreation] = useState<boolean>(false);

  // Modification Initiative
  const [editingInitiative, setEditingInitiative] = useState<UserInitiativeItem | null>(null);
  const [initiativeFormTitle, setInitiativeFormTitle] = useState<string>('');
  const [initiativeFormTarget, setInitiativeFormTarget] = useState<number>(5000);
  const [initiativeFormDescription, setInitiativeFormDescription] = useState<string>('');
  const [initiativeFormPoster, setInitiativeFormPoster] = useState<string>('');
  const [initiativeFormVideo, setInitiativeFormVideo] = useState<string>('');
  const [isDeletingInitiative, setIsDeletingInitiative] = useState<boolean>(false);

  // Modification Appel
  const [editingAppel, setEditingAppel] = useState<UserAppelItem | null>(null);
  const [appelFormTitle, setAppelFormTitle] = useState<string>('');
  const [appelFormUrgency, setAppelFormUrgency] = useState<string>('');
  const [appelFormDescription, setAppelFormDescription] = useState<string>('');
  const [appelFormImpact, setAppelFormImpact] = useState<string>('');
  const [isDeletingAppel, setIsDeletingAppel] = useState<boolean>(false);

  // Modale de Partage Réseaux Sociaux
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Modales d'actions interactives pour le Visiteur
  const [isBuyingSharesModalOpen, setIsBuyingSharesModalOpen] = useState<boolean>(false);
  const [buySharesCount, setBuySharesCount] = useState<number>(1);

  const [isOrderingCreationModalOpen, setIsOrderingCreationModalOpen] = useState<boolean>(false);
  const [orderActionType, setOrderActionType] = useState<'commander' | 'reserver' | 'acheter'>('commander');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderContact, setOrderContact] = useState<string>('');

  const [isContributingModalOpen, setIsContributingModalOpen] = useState<boolean>(false);
  const [initiativeActionType, setInitiativeActionType] = useState<'contribuer' | 'participer'>('contribuer');
  const [contributionAmount, setContributionAmount] = useState<number>(50);
  const [volunteerMessage, setVolunteerMessage] = useState<string>('');

  const [isOfferingHelpModalOpen, setIsOfferingHelpModalOpen] = useState<boolean>(false);
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [helpContact, setHelpContact] = useState<string>('');

  // Paramètres & Sécurité du compte (modal paramètres)
  const [userEmail, setUserEmail] = useState<string>('amina.traore@yonywood.org');
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [tempEmail, setTempEmail] = useState<string>('amina.traore@yonywood.org');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Accesseurs stables pour les éléments courants des collections
  const currentRecit = recits[recitIndex] || recits[0];
  const currentEpisode = episodes[episodeIndex] || episodes[0];
  const currentProduction = productions[shareIndex] || productions[0];
  const currentCreation = creations[creationIndex] || creations[0];
  const currentInitiative = initiatives[initiativeIndex] || initiatives[0];
  const currentAppel = appels[appelIndex] || appels[0];

  // Actions d'ajout pour le propriétaire
  const handleAddRecit = () => {
    const newRecit: UserRecitItem = {
      id: `recit-${Date.now()}`,
      title: 'Nouveau récit',
      chapter: `Chapitre ${recits.length + 1}`,
      subtitle: 'Récit personnel & mémoire',
      description: 'Partagez un fragment précieux de votre parcours.',
      duration: '05:00',
      viewsCount: 0,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: userPhoto
    };
    setRecits(prev => [newRecit, ...prev]);
    setRecitIndex(0);
    setPillarItemIndex(0);
    setRecitFormTitle(newRecit.title);
    setRecitFormSubtitle(newRecit.subtitle || '');
    setEditingRecit(newRecit);
    setShareToast("Nouveau récit ajouté.");
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleAddCreation = () => {
    const newCreation: UserCreationItem = {
      id: `cr-${Date.now()}`,
      title: 'Nouvelle création / offre',
      seriesTitle: 'Finagnon < > Qosqorico',
      categoryLabel: 'Artisanat & Savoir-faire',
      type: 'produit',
      price: '40 €',
      priceNumeric: 40,
      stock: '1 disponible',
      description: 'Description de la pièce ou de l’atelier proposé.',
      specs: 'Fait main à partir de matériaux nobles',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      posterUrl: userPhoto
    };
    setCreations(prev => [newCreation, ...prev]);
    setCreationIndex(0);
    setPillarItemIndex(0);
    setCreationFormTitle(newCreation.title);
    setCreationFormPrice(newCreation.price);
    setCreationFormCategory(newCreation.categoryLabel);
    setCreationFormDescription(newCreation.description);
    setEditingCreation(newCreation);
    setShareToast("Nouvelle offre ajoutée.");
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleAddAppel = () => {
    const newAppel: UserAppelItem = {
      id: `app-${Date.now()}`,
      title: 'Nouvel appel',
      category: 'Entraide & Collaboration',
      urgency: 'En cours',
      description: 'Décrivez votre besoin en compétences, matériel ou partenariat.',
      impact: 'Permettra d’accélérer le projet territorial.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      posterUrl: userPhoto
    };
    setAppels(prev => [newAppel, ...prev]);
    setAppelIndex(0);
    setPillarItemIndex(0);
    setAppelFormTitle(newAppel.title);
    setAppelFormUrgency(newAppel.urgency);
    setAppelFormDescription(newAppel.description);
    setEditingAppel(newAppel);
    setShareToast("Nouvel appel ajouté.");
    setTimeout(() => setShareToast(null), 3000);
  };

  // Helper pour formater les secondes en MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper pour trouver l'affiche de la série
  const getSeriesPoster = (seriesId?: string): string => {
    if (!seriesId) return '/assets/posters/finagnon-qosqorico.png';
    if (seriesId.includes('finagnon') || seriesId.includes('qosqorico')) return '/assets/posters/finagnon-qosqorico.png';
    if (seriesId.includes('jesus') || seriesId.includes('esu') || seriesId.includes('legba')) return '/assets/posters/jesus-esu.png';
    if (seriesId.includes('blacks') || seriesId.includes('eve')) return '/assets/posters/blacks-one-beyond-eve.png';
    if (seriesId.includes('dixeat') || seriesId.includes('fiat')) return '/assets/posters/dixeat-fiat-luxe.png';
    if (seriesId.includes('investor') || seriesId.includes('builder')) return '/assets/posters/investors-builders.png';
    return '/assets/posters/finagnon-qosqorico.png';
  };

  // 4 Piliers demandés par l'utilisateur :
  // 1. Récits & Épisodes reliés ensemble (Clap de vidéo)
  // 2. Productions (Pièces de monnaie)
  // 3. Offres (Sac d'artisanat / création)
  // 4. Appels & Initiatives regroupant besoins et projets (Mégaphone)
  const PILLARS_ORDER: ProfilePillar[] = ['recits_episodes', 'productions', 'offres', 'appels'];

  const PILLARS_CONFIG: { key: ProfilePillar; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'recits_episodes', label: 'Récits', icon: Clapperboard },
    { key: 'productions', label: 'Coproductions', icon: Coins },
    { key: 'offres', label: 'Offres', icon: ShoppingBag },
    { key: 'appels', label: 'Appels', icon: Megaphone },
  ];

  // 1. Récits & Épisodes combinés
  const recitsEpisodesItems = [
    ...recits.map(r => ({
      id: r.id,
      pillar: 'recits_episodes' as const,
      categoryLabel: 'Récit personnel',
      title: r.title,
      subtitle: r.subtitle || r.chapter || 'Histoire personnelle',
      description: r.description,
      quote: r.quote,
      duration: r.duration || '05:30',
      viewsCount: r.viewsCount || 1420,
      videoUrl: r.videoUrl,
      posterUrl: r.posterUrl || userPhoto,
      isEpisode: false,
      seriesId: undefined,
      seriesTitle: undefined,
      seriesPosterUrl: undefined,
      rawRecit: r,
      rawEpisode: undefined,
      rawProduction: undefined,
      rawCreation: undefined,
      rawInitiative: undefined,
      rawAppel: undefined,
    })),
    ...episodes.map(ep => ({
      id: ep.id,
      pillar: 'recits_episodes' as const,
      categoryLabel: `Série • ${ep.seriesTitle}`,
      title: ep.title,
      subtitle: ep.seriesTitle,
      description: `Participation officielle à la série documentaire « ${ep.seriesTitle} ».`,
      quote: undefined,
      duration: ep.duration || '04:20',
      viewsCount: ep.viewsCount || 3890,
      videoUrl: ep.videoUrl,
      posterUrl: userPhoto || ep.posterUrl,
      isEpisode: true,
      seriesId: ep.seriesId,
      seriesTitle: ep.seriesTitle,
      seriesPosterUrl: getSeriesPoster(ep.seriesId),
      rawRecit: undefined,
      rawEpisode: ep,
      rawProduction: undefined,
      rawCreation: undefined,
      rawInitiative: undefined,
      rawAppel: undefined,
    }))
  ];

  // 2. Productions
  const productionsItems = productions.map(prod => ({
    id: prod.id,
    pillar: 'productions' as const,
    categoryLabel: `Coproduction • ${prod.status}`,
    title: prod.seriesTitle,
    subtitle: `${prod.sharesCount} parts disponibles • Prévision +${prod.returnForecastPercent || 15}%`,
    description: `Participez à la coproduction de la série « ${prod.seriesTitle} ». Investissement de proximité éthique et partagé.`,
    quote: undefined,
    duration: '03:15',
    viewsCount: 2150,
    videoUrl: prod.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: userPhoto || prod.posterUrl,
    isEpisode: false,
    seriesId: prod.seriesId,
    seriesTitle: prod.seriesTitle,
    seriesPosterUrl: getSeriesPoster(prod.seriesId),
    rawRecit: undefined,
    rawEpisode: undefined,
    rawProduction: prod,
    rawCreation: undefined,
    rawInitiative: undefined,
    rawAppel: undefined,
  }));

  // 3. Offres (Créations d'atelier / artisanat)
  const offresItems = creations.map(cr => ({
    id: cr.id,
    pillar: 'offres' as const,
    categoryLabel: `Offre • ${cr.categoryLabel || cr.type || 'Artisanat'}`,
    title: cr.title,
    subtitle: `${cr.price} • ${cr.stock ? `${cr.stock} dispo` : 'Sur commande'}`,
    description: cr.description,
    quote: undefined,
    duration: '02:45',
    viewsCount: 980,
    videoUrl: cr.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterUrl: cr.posterUrl || userPhoto,
    isEpisode: false,
    seriesId: undefined,
    seriesTitle: undefined,
    seriesPosterUrl: undefined,
    rawRecit: undefined,
    rawEpisode: undefined,
    rawProduction: undefined,
    rawCreation: cr,
    rawInitiative: undefined,
    rawAppel: undefined,
  }));

  // 4. Appels & Initiatives (Besoins et projets de la personne)
  const appelsItems = [
    ...initiatives.map(init => ({
      id: init.id,
      pillar: 'appels' as const,
      categoryLabel: `Projet • ${init.category || 'Initiative'}`,
      title: init.title,
      subtitle: `${init.collectedAmount.toLocaleString()} € récoltés sur ${init.targetAmount.toLocaleString()} € (${Math.round((init.collectedAmount / init.targetAmount) * 100)}%)`,
      description: init.description,
      quote: undefined,
      duration: '03:30',
      viewsCount: 1640,
      videoUrl: init.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      posterUrl: userPhoto || init.posterUrl,
      isEpisode: false,
      seriesId: undefined,
      seriesTitle: undefined,
      seriesPosterUrl: undefined,
      rawRecit: undefined,
      rawEpisode: undefined,
      rawProduction: undefined,
      rawCreation: undefined,
      rawInitiative: init,
      rawAppel: undefined,
    })),
    ...appels.map(ap => ({
      id: ap.id,
      pillar: 'appels' as const,
      categoryLabel: `Appel • ${ap.category || 'Besoin solidaire'}`,
      title: ap.title,
      subtitle: `${ap.urgency || 'Besoin'} • ${ap.impact || 'Entraide'}`,
      description: ap.description,
      quote: undefined,
      duration: '02:15',
      viewsCount: 820,
      videoUrl: ap.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      posterUrl: userPhoto || ap.posterUrl,
      isEpisode: false,
      seriesId: undefined,
      seriesTitle: undefined,
      seriesPosterUrl: undefined,
      rawRecit: undefined,
      rawEpisode: undefined,
      rawProduction: undefined,
      rawCreation: undefined,
      rawInitiative: undefined,
      rawAppel: ap,
    }))
  ];

  // Liste actuelle selon le pilier actif
  const currentPillarItems = 
    activePillar === 'recits_episodes' ? recitsEpisodesItems :
    activePillar === 'productions' ? productionsItems :
    activePillar === 'offres' ? offresItems : appelsItems;

  const safeIndex = Math.min(pillarItemIndex, Math.max(0, currentPillarItems.length - 1));
  const currentItem = currentPillarItems[safeIndex] || currentPillarItems[0];

  // Prénom de la personne affichée (très allégé sur la vidéo)
  const personFirstName = (userName || userFullName || 'Amina').trim().split(' ')[0];

  // Synchroniser la vidéo et la note de résonance lors du changement de vidéo ou de pilier
  useEffect(() => {
    setIsPlaying(false);
    setShowPlayPauseFeedback(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    if (currentItem?.id) {
      try {
        const stored = localStorage.getItem(`yonywood_resonance_${currentItem.id}`);
        if (stored) {
          const val = parseInt(stored, 10);
          setResonancePct(isNaN(val) ? null : val);
        } else {
          setResonancePct(null);
        }
      } catch {
        setResonancePct(null);
      }
    } else {
      setResonancePct(null);
    }
  }, [activePillar, pillarItemIndex, currentItem?.id]);

  // Gérer la lecture vidéo (Tap au centre)
  const toggleVideoPlayback = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setShowPlayPauseFeedback(true);
    setTimeout(() => setShowPlayPauseFeedback(false), 900);
  };

  // Mise à jour de la timeline
  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Clic sur la timeline dorée
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * (duration || 100);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  // Navigation par catégorie (Icône ou Swipe vertical)
  const handleSelectPillar = (pillar: ProfilePillar) => {
    setActivePillar(pillar);
    setPillarItemIndex(0);
  };

  const handlePillarChange = (direction: 'next' | 'prev') => {
    const currentIndex = PILLARS_ORDER.indexOf(activePillar);
    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PILLARS_ORDER.length;
    } else {
      nextIndex = (currentIndex - 1 + PILLARS_ORDER.length) % PILLARS_ORDER.length;
    }
    handleSelectPillar(PILLARS_ORDER[nextIndex]);
  };

  // Navigation entre les vidéos d'une catégorie (Swipe horizontal)
  const handleItemChange = (direction: 'next' | 'prev') => {
    const total = currentPillarItems.length;
    if (total <= 1) return;
    if (direction === 'next') {
      setPillarItemIndex(prev => (prev + 1) % total);
    } else {
      setPillarItemIndex(prev => (prev - 1 + total) % total);
    }
  };

  // Gestion des gestes 2D : Swipe vertical (catégorie) & horizontal (vidéos)
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [mouseStartPos, setMouseStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isMouseDown2D, setIsMouseDown2D] = useState<boolean>(false);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setSwipeOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos) return;
    const diffX = e.touches[0].clientX - touchStartPos.x;
    if (Math.abs(diffX) < 120) {
      setSwipeOffset(diffX);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos) return;
    const deltaX = e.changedTouches[0].clientX - touchStartPos.x;
    const deltaY = e.changedTouches[0].clientY - touchStartPos.y;
    setTouchStartPos(null);
    setSwipeOffset(0);

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > 35) {
      // Swipe horizontal -> vidéos de la catégorie
      if (deltaX < 0) handleItemChange('next');
      else handleItemChange('prev');
    } else if (absY > absX && absY > 35) {
      // Swipe vertical -> changement de catégorie
      if (deltaY < 0) handlePillarChange('next');
      else handlePillarChange('prev');
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown2D(true);
    setMouseStartPos({ x: e.clientX, y: e.clientY });
    setSwipeOffset(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown2D || !mouseStartPos) return;
    const diffX = e.clientX - mouseStartPos.x;
    if (Math.abs(diffX) < 120) {
      setSwipeOffset(diffX);
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown2D || !mouseStartPos) return;
    const deltaX = e.clientX - mouseStartPos.x;
    const deltaY = e.clientY - mouseStartPos.y;
    setIsMouseDown2D(false);
    setMouseStartPos(null);
    setSwipeOffset(0);

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > 35) {
      if (deltaX < 0) handleItemChange('next');
      else handleItemChange('prev');
    } else if (absY > absX && absY > 35) {
      if (deltaY < 0) handlePillarChange('next');
      else handlePillarChange('prev');
    }
  };

  // Clavier : Flèches haut/bas (catégories) & gauche/droite (vidéos) & Espace (Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') handleItemChange('next');
      else if (e.key === 'ArrowLeft') handleItemChange('prev');
      else if (e.key === 'ArrowDown') handlePillarChange('next');
      else if (e.key === 'ArrowUp') handlePillarChange('prev');
      else if (e.key === ' ') {
        e.preventDefault();
        toggleVideoPlayback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePillar, pillarItemIndex, currentPillarItems.length, isPlaying]);

  // Nom complet affiché pour garantir une stricte cohérence avec l'explorateur
  const profileDisplayName = targetProtagonist 
    ? targetProtagonist.name 
    : (userFullName || userName || 'Amina Traoré');

  // Partager le profil
  const handleShareProfile = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-36 space-y-6 text-[#1C1917]">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE D'IDENTITÉ ÉPURÉ : PHOTO, NOM, ENVOYER UN MESSAGE, PARTAGE      */}
      {/* Sans menu d'onglets (suppression totale demandée par l'utilisateur)        */}
      {/* ========================================================================= */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Bouton retour si visiteur */}
            {!isOwner && (
              <button
                onClick={() => onNavigate({ type: 'home' })}
                className="p-2 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors shadow-xs cursor-pointer mr-1"
                title="Retour à l'explorateur"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full p-0.5 border-2 border-[#C89B3C] shadow-sm overflow-hidden bg-white">
                <img
                  src={userPhoto}
                  alt={userFullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {isOwner && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1C1917] hover:bg-[#C89B3C] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors border-2 border-white"
                  title="Modifier mon profil"
                  id="btn-edit-profile-avatar"
                >
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-lg sm:text-xl font-bold text-[#1C1917] leading-tight">
                  {profileDisplayName}
                </h1>
                {targetProtagonist?.flag && <span className="text-sm">{targetProtagonist.flag}</span>}
              </div>
              <p className="text-xs text-[#8B6845] font-medium mt-0.5 line-clamp-1">{userRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                {/* Propriétaire : Bouton Messagerie */}
                <button
                  onClick={() => onNavigate({ type: 'messaging' })}
                  id="btn-profile-messages"
                  className="h-9 px-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-[#1C1917] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer relative"
                  title="Ouvrir la messagerie"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                  <span>Messages</span>
                  <span className="w-4 h-4 rounded-full bg-[#C89B3C] text-white text-[9px] font-bold flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* Propriétaire : Bouton Partager */}
                <button
                  onClick={handleShareProfile}
                  id="btn-share-profile"
                  className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title="Partager mon profil"
                >
                  <Share2 className="w-4 h-4 text-[#C89B3C]" />
                </button>

                {/* Propriétaire : Paramètres du compte */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  id="btn-profile-settings-gear"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title="Paramètres du compte"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Visiteur : Bouton Envoyer un message */}
                <button
                  onClick={() => onNavigate({ type: 'messaging' })}
                  id="btn-visitor-message"
                  className="h-9 px-4 rounded-full bg-[#1C1917] hover:bg-stone-800 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                  title={`Envoyer un message à ${userName}`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Envoyer un message</span>
                </button>

                {/* Visiteur : Bouton Partager */}
                <button
                  onClick={handleShareProfile}
                  id="btn-share-visitor-profile"
                  className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title={`Partager le profil de ${userName}`}
                >
                  <Share2 className="w-4 h-4 text-[#C89B3C]" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TOAST SUCCÈS */}
      {shareToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 py-2.5 rounded-2xl bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXPÉRIENCE VIDÉO IMMERSIVE 9:16 AVEC NAVIGATION 2D                     */}
      {/* - ICÔNES DES 4 CATÉGORIES DIRECTEMENT SUR LA VIDÉO À DROITE               */}
      {/* - TAP AU CENTRE POUR PLAY/PAUSE                                           */}
      {/* - SWIPE VERTICAL POUR CHANGER DE CATÉGORIE                                */}
      {/* - SWIPE HORIZONTAL POUR NAVIGUER DANS LES VIDÉOS DE LA CATÉGORIE         */}
      {/* ========================================================================= */}
      <div className="space-y-4 animate-in fade-in duration-200">

        <div className="relative flex flex-col items-center justify-center py-1">
          {/* Conteneur principal centré */}
          <div className="relative flex items-center justify-center gap-3 sm:gap-6 w-full max-w-xl">
            
            {/* Flèche Gauche (Desktop : vidéo précédente dans la catégorie) */}
            <button
              onClick={() => handleItemChange('prev')}
              className="hidden sm:flex p-3.5 rounded-full bg-white hover:bg-[#FAFAF9] border border-[#E7E5E4] text-[#8B6845] hover:text-[#1C1917] transition-all shadow-sm cursor-pointer hover:scale-105 outline-none focus:outline-none ring-0 shrink-0"
              title="Vidéo précédente dans cette catégorie"
              id="prev-studio-card-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* CARTE FORMAT 9:16 SANS CADRE NI REPERES AVEC ICÔNES DIRECTES */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button, a, input, textarea, select, [data-interactive="true"]')) return;
                toggleVideoPlayback();
              }}
              className="w-full max-w-[340px] sm:max-w-[370px] aspect-[9/16] transition-transform duration-150 ease-out select-none cursor-pointer relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 outline-none focus:outline-none ring-0"
              style={{ transform: `translateX(${swipeOffset}px)` }}
            >
              {/* VRAIE VIDÉO HTML5 */}
              <video
                ref={videoRef}
                src={currentItem.videoUrl}
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={onTimeUpdate}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                  isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* POSTER DE REMPLACEMENT */}
              <img
                src={currentItem.posterUrl || userPhoto}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* GRADIENTS CINÉMATOGRAPHIQUES */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/85 pointer-events-none" />

              {/* ================================================================= */}
              {/* ICÔNE CENTRALE PLAY/PAUSE (Comme sur la capture fournie)           */}
              {/* ================================================================= */}
              <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 ${
                  showPlayPauseFeedback ? 'opacity-100 scale-100' : (!isPlaying ? 'opacity-70 scale-95' : 'opacity-0 scale-90')
                }`}
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white translate-x-0.5" />
                  )}
                </div>
              </div>

              {/* ================================================================= */}
              {/* RAIL VERTICAL FLOTTANT DES 4 CATÉGORIES (SUR LA VIDÉO À DROITE)     */}
              {/* ================================================================= */}
              <div 
                data-interactive="true"
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 py-2"
              >
                {PILLARS_CONFIG.map(({ key, label, icon: IconComp }) => {
                  const isActive = activePillar === key;
                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPillar(key);
                      }}
                      className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md ${
                        isActive
                          ? 'bg-black/80 border border-[#C89B3C] text-[#E5C16C] shadow-[0_0_10px_rgba(200,155,60,0.4)]'
                          : 'bg-black/45 hover:bg-black/60 border border-white/20 text-white/75 hover:text-white backdrop-blur-md'
                      }`}
                      title={label}
                      id={`pillar-btn-${key}`}
                    >
                      <IconComp className={`w-4 h-4 transition-transform ${
                        isActive ? 'stroke-[#E5C16C]' : ''
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* ================================================================= */}
              {/* CONTENU SUPERPOSÉ : HAUT (Capsule 1 mot, Diamant, Son, Partage)  */}
              {/* ================================================================= */}
              <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-between h-full pointer-events-none">
                
                {/* HAUT */}
                <div className="space-y-2 pointer-events-auto">
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Capsule catégorie (un seul mot : Récits, Coproductions, Offres, Appels) */}
                    <div className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] shrink-0" />
                      <span>
                        {activePillar === 'recits_episodes' ? 'Récits' :
                         activePillar === 'productions' ? 'Coproductions' :
                         activePillar === 'offres' ? 'Offres' : 'Appels'}
                      </span>
                    </div>

                    {/* Actions : Diamant (Évaluer la vidéo), Audio (mute/unmute), Partage */}
                    <div className="flex items-center gap-1.5">
                      {/* Petit Diamant : Évaluer la vidéo */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsResonanceModalOpen(true);
                        }}
                        className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md ${
                          resonancePct !== null
                            ? 'bg-black/80 border-[#C89B3C] text-[#E5C16C] shadow-[0_0_10px_rgba(200,155,60,0.4)]'
                            : 'bg-black/45 hover:bg-black/60 border-white/20 text-[#E5C16C]'
                        }`}
                        title="Évaluer la vidéo"
                        id="diamond-resonance-profile-btn"
                      >
                        <Gem className="w-4 h-4" />
                      </button>

                      {/* Mute / Unmute */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                        title={isMuted ? "Activer le son" : "Couper le son"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Partage */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareProfile();
                        }}
                        className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                        title="Partager cette vidéo"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* BAS : PRÉNOM + FINANCEMENT PARTICIPATIF + ACTIONS ALLÉGÉES + TIMELINE DORÉE */}
                <div className="space-y-2.5 pointer-events-auto pr-12">
                  
                  {/* Prénom uniquement */}
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                      {personFirstName}
                    </h2>
                  </div>

                  {/* Financement participatif pour les projets / appels */}
                  {activePillar === 'appels' && (
                    <div className="space-y-1 pt-0.5">
                      {(() => {
                        const init = currentItem.rawInitiative;
                        const collected = init?.collectedAmount ?? 14200;
                        const target = init?.targetAmount ?? 25000;
                        const pct = Math.min(100, Math.round((collected / (target || 1)) * 100));
                        const backers = init?.backersCount ?? 184;

                        return (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-white/90 font-medium">
                              <span>{collected.toLocaleString()} € / {target.toLocaleString()} €</span>
                              <span className="text-[#E5C16C] font-semibold">{pct}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] rounded-full" 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-white/70">
                              {backers} contributeurs
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* BOUTONS D'ACTIONS CONTEXTUELS ALLÉGÉS */}
                  <div>
                    {activePillar === 'productions' && (
                      <div>
                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduction(currentItem.rawProduction || productions[0]);
                              }}
                              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold cursor-pointer"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsSellingShares(true);
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#C89B3C] hover:bg-[#b08732] text-white text-xs font-bold shadow-md cursor-pointer"
                            >
                              Vendre des parts
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsBuyingSharesModalOpen(true);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] text-[#1C1917] font-bold text-xs shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Acheter des parts</span>
                          </button>
                        )}
                      </div>
                    )}

                    {activePillar === 'offres' && (
                      <div>
                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCreation(currentItem.rawCreation || creations[0]);
                              }}
                              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold cursor-pointer"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddCreation();
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#C89B3C] hover:bg-[#b08732] text-white text-xs font-bold shadow-md cursor-pointer"
                            >
                              Ajouter une offre
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOrderingCreationModalOpen(true);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] text-[#1C1917] font-bold text-xs shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Commander</span>
                          </button>
                        )}
                      </div>
                    )}

                    {activePillar === 'appels' && (
                      <div>
                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentItem.rawInitiative) setEditingInitiative(currentItem.rawInitiative);
                                else if (currentItem.rawAppel) setEditingAppel(currentItem.rawAppel);
                              }}
                              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold cursor-pointer"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddAppel();
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#C89B3C] hover:bg-[#b08732] text-white text-xs font-bold shadow-md cursor-pointer"
                            >
                              Ajouter un appel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentItem.rawInitiative) setIsContributingModalOpen(true);
                              else setIsOfferingHelpModalOpen(true);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] text-[#1C1917] font-bold text-xs shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>Contribuer</span>
                          </button>
                        )}
                      </div>
                    )}

                    {activePillar === 'recits_episodes' && isOwner && (
                      <div className="flex items-center gap-2">
                        {currentItem.rawRecit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRecit(currentItem.rawRecit);
                            }}
                            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold cursor-pointer"
                          >
                            Modifier ce récit
                          </button>
                        )}
                        {currentItem.rawEpisode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEpisode(currentItem.rawEpisode);
                            }}
                            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold cursor-pointer"
                          >
                            Modifier cet épisode
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRecit();
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#C89B3C] hover:bg-[#b08732] text-white text-xs font-bold cursor-pointer"
                        >
                          Ajouter une vidéo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TIMELINE DORÉE */}
                  <div className="pt-1 select-none">
                    <div className="flex items-center gap-2 text-[11px] font-mono font-medium text-white/90">
                      <span className="shrink-0">{formatTime(currentTime)}</span>
                      
                      <div 
                        onClick={handleTimelineClick}
                        className="flex-1 h-1.5 bg-white/25 hover:bg-white/40 rounded-full relative cursor-pointer group transition-all"
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] rounded-full relative"
                          style={{ width: `${Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100))}%` }}
                        >
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#E5C16C] border-2 border-white rounded-full shadow-md transition-transform group-hover:scale-125" />
                        </div>
                      </div>

                      <span className="shrink-0 text-white/70">{formatTime(duration)}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Flèche Droite (Desktop : vidéo suivante dans la catégorie) */}
            <button
              onClick={() => handleItemChange('next')}
              className="hidden sm:flex p-3.5 rounded-full bg-white hover:bg-[#FAFAF9] border border-[#E7E5E4] text-[#8B6845] hover:text-[#1C1917] transition-all shadow-sm cursor-pointer hover:scale-105 outline-none focus:outline-none ring-0 shrink-0"
              title="Vidéo suivante dans cette catégorie"
              id="next-studio-card-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* 3. MODALE DES PARAMÈTRES DU COMPTE (Accessible par l'icône dans l'en-tête)  */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-stone-100 text-[#1C1917] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                    Paramètres du compte
                  </h3>
                  <p className="text-xs text-[#8B6845]">
                    Sécurité, préférences de lecture et identifiants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email de connexion */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B6845]" />
                <span>Adresse email</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                />
                <button
                  onClick={() => {
                    setShareToast("Adresse email enregistrée.");
                    setTimeout(() => setShareToast(null), 2500);
                  }}
                  className="h-10 px-4 bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  Valider
                </button>
              </div>
            </div>

            {/* Mot de passe */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShareToast("Mot de passe mis à jour !");
                setTimeout(() => setShareToast(null), 2500);
              }} 
              className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200"
            >
              <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8B6845]" />
                <span>Modifier le mot de passe</span>
              </label>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#C89B3C]"
              />
              <button
                type="submit"
                className="w-full h-10 bg-white hover:bg-stone-100 text-[#1C1917] border border-stone-300 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                Mettre à jour le mot de passe
              </button>
            </form>

            {/* Préférences */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                Préférences de l'application
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <p className="text-xs font-semibold text-[#1C1917]">Langue des sous-titres</p>
                  <p className="text-[11px] text-stone-500">Français, Fon, Quechua...</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => onUpdateLanguage(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium"
                >
                  <option value="fr">Français</option>
                  <option value="fon">Fongbe</option>
                  <option value="quz">Quechua</option>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <p className="text-xs font-semibold text-[#1C1917]">Masquer la question par défaut</p>
                  <p className="text-[11px] text-stone-500">Privilégie une immersion totale</p>
                </div>
                <input
                  type="checkbox"
                  checked={hideQuestionByDefault}
                  onChange={(e) => onToggleHideQuestion(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C89B3C] accent-[#C89B3C]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onNavigate({ type: 'duo_feed' });
                }}
                className="w-full h-11 px-4 rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALES D'ACTIONS POUR LE VISITEUR                                      */}
      {/* ========================================================================= */}

      {/* A. Modale Acheter des parts */}
      {isBuyingSharesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Acquérir des parts</h3>
              </div>
              <button onClick={() => setIsBuyingSharesModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-stone-600">
                Vous investissez dans la série <span className="font-bold text-[#1C1917]">{currentProduction.seriesTitle}</span> auprès de {userName}.
              </p>
              
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 font-medium">Prix unitaire de la part :</span>
                  <span className="font-mono font-bold text-[#C89B3C] text-sm">{currentProduction.salePrice || currentProduction.startPrice || 55} €</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                  <span className="font-semibold text-stone-700">Nombre de parts :</span>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setBuySharesCount(Math.max(1, buySharesCount - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-stone-100"
                    >-</button>
                    <span className="font-mono font-bold text-sm">{buySharesCount}</span>
                    <button 
                      onClick={() => setBuySharesCount(Math.min(currentProduction.sharesOnSale || 5, buySharesCount + 1))}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-stone-100"
                    >+</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-[#8B6845]">
                <span className="font-semibold">Montant total à régler :</span>
                <span className="font-mono font-black text-base text-[#1C1917]">
                  {buySharesCount * (currentProduction.salePrice || currentProduction.startPrice || 55)} €
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBuyingSharesModalOpen(false);
                setShareToast(`Félicitations ! Vous avez acquis vos parts de coproduction auprès de ${userName}.`);
                setTimeout(() => setShareToast(null), 3500);
              }}
              className="w-full h-11 px-4 rounded-xl bg-[#C89B3C] hover:bg-[#B78A2E] text-[#1C1917] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              Confirmer l’achat des parts
            </button>
          </div>
        </div>
      )}

      {/* B. Modale Commander / Réserver / Acheter une création */}
      {isOrderingCreationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">
                  {orderActionType === 'reserver' 
                    ? 'Réserver' 
                    : orderActionType === 'acheter' 
                    ? 'Acheter' 
                    : 'Commander'}
                </h3>
              </div>
              <button onClick={() => setIsOrderingCreationModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Onglets d'action rapide */}
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setOrderActionType('commander')}
                className={`py-1.5 px-2 rounded-lg transition-all ${orderActionType === 'commander' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Commander
              </button>
              <button
                type="button"
                onClick={() => setOrderActionType('reserver')}
                className={`py-1.5 px-2 rounded-lg transition-all ${orderActionType === 'reserver' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Réserver
              </button>
              <button
                type="button"
                onClick={() => setOrderActionType('acheter')}
                className={`py-1.5 px-2 rounded-lg transition-all ${orderActionType === 'acheter' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Acheter
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-bold text-[#1C1917]">{currentCreation.title}</p>
                <p className="text-stone-500">{currentCreation.categoryLabel}</p>
                <p className="font-mono text-[#C89B3C] font-bold text-sm pt-0.5">{currentCreation.price}</p>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-semibold block">Vos coordonnées (email ou téléphone) :</label>
                <input
                  type="text"
                  placeholder="contact@exemple.com"
                  value={orderContact}
                  onChange={(e) => setOrderContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsOrderingCreationModalOpen(false);
                const actionLabel = orderActionType === 'reserver' 
                  ? 'réservation' 
                  : orderActionType === 'acheter' 
                  ? 'achat' 
                  : 'commande';
                setShareToast(`Votre demande de ${actionLabel} a été transmise à ${userName}.`);
                setTimeout(() => setShareToast(null), 3500);
              }}
              className="w-full h-11 px-4 rounded-xl bg-[#C89B3C] hover:bg-[#B78A2E] text-[#1C1917] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              {orderActionType === 'reserver' 
                ? 'Confirmer la réservation' 
                : orderActionType === 'acheter' 
                ? 'Confirmer l’achat' 
                : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      )}

      {/* C. Modale Contribuer / Participer à l'initiative */}
      {isContributingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">
                  {initiativeActionType === 'contribuer' ? 'Soutenir l’initiative' : 'Participer au projet'}
                </h3>
              </div>
              <button onClick={() => setIsContributingModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Onglets Contribuer vs Participer */}
            <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setInitiativeActionType('contribuer')}
                className={`py-1.5 px-2 rounded-lg transition-all ${initiativeActionType === 'contribuer' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Contribuer (€)
              </button>
              <button
                type="button"
                onClick={() => setInitiativeActionType('participer')}
                className={`py-1.5 px-2 rounded-lg transition-all ${initiativeActionType === 'participer' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              >
                Participer (Aide / Bénévolat)
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-[#1C1917]">{currentInitiative.title}</p>
              
              {initiativeActionType === 'contribuer' ? (
                <>
                  <p className="text-stone-600">Choisissez votre montant de contribution :</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setContributionAmount(amt)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          contributionAmount === amt 
                            ? 'bg-[#1C1917] text-white border-[#1C1917]' 
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                        }`}
                      >
                        {amt} €
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-stone-600">Comment souhaitez-vous vous impliquer ?</p>
                  <textarea
                    rows={3}
                    value={volunteerMessage}
                    onChange={(e) => setVolunteerMessage(e.target.value)}
                    placeholder="Compétences, aide sur le terrain, mise en relation..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 resize-none"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsContributingModalOpen(false);
                if (initiativeActionType === 'contribuer') {
                  setShareToast(`Merci pour votre contribution de ${contributionAmount} € !`);
                } else {
                  setShareToast(`Merci ! Votre proposition de participation a été envoyée à ${userName}.`);
                }
                setTimeout(() => setShareToast(null), 3500);
              }}
              className="w-full h-11 px-4 rounded-xl bg-[#C89B3C] hover:bg-[#B78A2E] text-[#1C1917] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              {initiativeActionType === 'contribuer' ? 'Valider mon soutien' : 'Rejoindre le projet'}
            </button>
          </div>
        </div>
      )}

      {/* D. Modale Répondre à l'appel (Formulaire ou Messagerie privée) */}
      {isOfferingHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Répondre à l’appel</h3>
              </div>
              <button onClick={() => setIsOfferingHelpModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-[#C89B3C] tracking-wider block mb-0.5">
                  {currentAppel.urgency}
                </span>
                <p className="font-bold text-[#1C1917] leading-tight">{currentAppel.title}</p>
              </div>

              {/* Formulaire de réponse directe */}
              <div className="space-y-2">
                <label className="text-stone-700 font-semibold block">Votre proposition de solution / aide :</label>
                <textarea
                  rows={3}
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  placeholder="Je dispose de matériel / de compétences et je peux vous aider..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-semibold block">Vos coordonnées :</label>
                <input
                  type="text"
                  placeholder="Email ou téléphone"
                  value={helpContact}
                  onChange={(e) => setHelpContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsOfferingHelpModalOpen(false);
                  setShareToast(`Votre réponse a été transmise à ${userName} !`);
                  setTimeout(() => setShareToast(null), 3500);
                }}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>Envoyer ma réponse</span>
              </button>

              {/* Alternative : Messagerie privée directe */}
              <div className="pt-2 border-t border-stone-200 text-center">
                <p className="text-[11px] text-stone-500 mb-1.5">Ou échanger directement :</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOfferingHelpModalOpen(false);
                    onNavigate({ type: 'messaging' });
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1917] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-stone-200/60"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Contacter en messagerie privée</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALES DE GESTION DU PROPRIÉTAIRE (Mise en vente, Suppression, etc.)    */}
      {/* ========================================================================= */}

      {/* Gérer la mise en vente de parts */}
      {isOwner && isSellingShares && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-editorial text-base font-bold text-[#1C1917]">Mise en vente de parts</h3>
              <button onClick={() => setIsSellingShares(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Nombre de parts à mettre en vente :</label>
                <input
                  type="number"
                  min={1}
                  max={currentProduction.sharesCount}
                  value={sellCountInput}
                  onChange={(e) => setSellCountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Prix de vente unitaire (€) :</label>
                <input
                  type="number"
                  value={sellPriceInput}
                  onChange={(e) => setSellPriceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
                <span className="text-[11px] text-stone-500 pt-0.5 block">Prix conseillé : {currentProduction.recommendedPrice} €</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setProductions(prev => prev.map((p, idx) => idx === shareIndex ? { ...p, sharesOnSale: sellCountInput, salePrice: sellPriceInput } : p));
                  setIsSellingShares(false);
                  setShareToast(`${sellCountInput} part(s) mises en vente sur le Marché.`);
                  setTimeout(() => setShareToast(null), 3000);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Mettre en vente
              </button>
              <button
                onClick={() => {
                  setProductions(prev => prev.map((p, idx) => idx === shareIndex ? { ...p, sharesOnSale: 0 } : p));
                  setIsSellingShares(false);
                  setShareToast("Parts remises en réserve.");
                  setTimeout(() => setShareToast(null), 3000);
                }}
                className="px-4 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression récit */}
      {isOwner && isDeletingRecit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">Retirer ce récit ?</h3>
            <p className="text-xs text-stone-600">Cette vidéo de récit personnel ne sera plus visible sur votre profil.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setRecits(prev => prev.filter((_, idx) => idx !== recitIndex));
                  setRecitIndex(0);
                  setIsDeletingRecit(false);
                  setShareToast("Récit retiré.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Confirmer
              </button>
              <button 
                onClick={() => setIsDeletingRecit(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression épisode */}
      {isOwner && isDeletingEpisode && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">Retirer cet épisode ?</h3>
            <p className="text-xs text-stone-600">Cet épisode ne sera plus mis en avant sur votre profil.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setEpisodes(prev => prev.filter((_, idx) => idx !== episodeIndex));
                  setEpisodeIndex(0);
                  setIsDeletingEpisode(false);
                  setShareToast("Épisode retiré.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Confirmer
              </button>
              <button 
                onClick={() => setIsDeletingEpisode(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression création */}
      {isOwner && isDeletingCreation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">Supprimer cette création ?</h3>
            <p className="text-xs text-stone-600">L'article ou l'atelier sera retiré de vos créations.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setCreations(prev => prev.filter((_, idx) => idx !== creationIndex));
                  setCreationIndex(0);
                  setIsDeletingCreation(false);
                  setShareToast("Création supprimée.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Supprimer
              </button>
              <button 
                onClick={() => setIsDeletingCreation(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression initiative */}
      {isOwner && isDeletingInitiative && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">Supprimer cette initiative ?</h3>
            <p className="text-xs text-stone-600">La campagne ne sera plus visible sur votre profil.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setInitiatives(prev => prev.filter((_, idx) => idx !== initiativeIndex));
                  setInitiativeIndex(0);
                  setIsDeletingInitiative(false);
                  setShareToast("Initiative supprimée.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Supprimer
              </button>
              <button 
                onClick={() => setIsDeletingInitiative(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression appel */}
      {isOwner && isDeletingAppel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">Supprimer cet appel ?</h3>
            <p className="text-xs text-stone-600">L'appel à compétences ou matériel sera retiré.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setAppels(prev => prev.filter((_, idx) => idx !== appelIndex));
                  setAppelIndex(0);
                  setIsDeletingAppel(false);
                  setShareToast("Appel supprimé.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Supprimer
              </button>
              <button 
                onClick={() => setIsDeletingAppel(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALES D'ÉDITION POUR LE PROPRIÉTAIRE                                 */}
      {/* ========================================================================= */}

      {/* Modifier Récit */}
      {isOwner && editingRecit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier le récit</h3>
              </div>
              <button onClick={() => setEditingRecit(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Titre (en haut à gauche) :</label>
                <input
                  type="text"
                  value={recitFormTitle}
                  onChange={(e) => setRecitFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Sous-titre (en bas) :</label>
                <input
                  type="text"
                  value={recitFormSubtitle}
                  onChange={(e) => setRecitFormSubtitle(e.target.value)}
                  placeholder="Ex: Parcours & transmission"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setRecits(prev => prev.map((r, idx) => idx === recitIndex ? { ...r, title: recitFormTitle, subtitle: recitFormSubtitle } : r));
                  setEditingRecit(null);
                  setShareToast("Récit mis à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingRecit(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Épisode */}
      {isOwner && editingEpisode && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier l'épisode</h3>
              </div>
              <button onClick={() => setEditingEpisode(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Durée affichée :</label>
                <input
                  type="text"
                  value={episodeFormDuration}
                  onChange={(e) => setEpisodeFormDuration(e.target.value)}
                  placeholder="Ex: 8 min"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Nombre de vues :</label>
                <input
                  type="number"
                  value={episodeFormViews}
                  onChange={(e) => setEpisodeFormViews(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setEpisodes(prev => prev.map((ep, idx) => idx === episodeIndex ? { ...ep, duration: episodeFormDuration, viewsCount: episodeFormViews } : ep));
                  setEditingEpisode(null);
                  setShareToast("Épisode mis à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingEpisode(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Production (Coproduction / Parts) */}
      {isOwner && editingProduction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier les parts de production</h3>
              </div>
              <button onClick={() => setEditingProduction(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 font-semibold block">Prix de départ (€) :</label>
                  <input
                    type="number"
                    value={prodFormStartPrice}
                    onChange={(e) => setProdFormStartPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block">Prix de vente (€) :</label>
                  <input
                    type="number"
                    value={prodFormSalePrice}
                    onChange={(e) => setProdFormSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Indicateur RSI (%) :</label>
                <input
                  type="number"
                  step="0.1"
                  value={prodFormRsi}
                  onChange={(e) => setProdFormRsi(Number(e.target.value))}
                  placeholder="Ex: 57.1"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 font-semibold block">Total parts :</label>
                  <input
                    type="number"
                    min={1}
                    value={prodFormSharesCount}
                    onChange={(e) => setProdFormSharesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block">En vente :</label>
                  <input
                    type="number"
                    min={0}
                    max={prodFormSharesCount}
                    value={prodFormSharesOnSale}
                    onChange={(e) => setProdFormSharesOnSale(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setProductions(prev => prev.map((prod, idx) => idx === shareIndex ? { 
                    ...prod, 
                    startPrice: prodFormStartPrice,
                    salePrice: prodFormSalePrice,
                    rsiPercent: prodFormRsi,
                    sharesCount: prodFormSharesCount,
                    sharesOnSale: prodFormSharesOnSale
                  } : prod));
                  setEditingProduction(null);
                  setShareToast("Parts de production mises à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingProduction(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Création */}
      {isOwner && editingCreation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier la création</h3>
              </div>
              <button onClick={() => setEditingCreation(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Titre :</label>
                <input
                  type="text"
                  value={creationFormTitle}
                  onChange={(e) => setCreationFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 font-semibold block">Prix :</label>
                  <input
                    type="text"
                    value={creationFormPrice}
                    onChange={(e) => setCreationFormPrice(e.target.value)}
                    placeholder="Ex: 85 €"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block">Catégorie / Type :</label>
                  <input
                    type="text"
                    value={creationFormCategory}
                    onChange={(e) => setCreationFormCategory(e.target.value)}
                    placeholder="Ex: Tissage d'Art"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Description :</label>
                <textarea
                  rows={3}
                  value={creationFormDescription}
                  onChange={(e) => setCreationFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setCreations(prev => prev.map((cr, idx) => idx === creationIndex ? {
                    ...cr,
                    title: creationFormTitle,
                    price: creationFormPrice,
                    categoryLabel: creationFormCategory,
                    description: creationFormDescription
                  } : cr));
                  setEditingCreation(null);
                  setShareToast("Création mise à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingCreation(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Initiative */}
      {isOwner && editingInitiative && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier l'initiative</h3>
              </div>
              <button onClick={() => setEditingInitiative(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Titre de l'initiative :</label>
                <input
                  type="text"
                  value={initiativeFormTitle}
                  onChange={(e) => setInitiativeFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Objectif (€) :</label>
                <input
                  type="number"
                  value={initiativeFormTarget}
                  onChange={(e) => setInitiativeFormTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Description :</label>
                <textarea
                  rows={3}
                  value={initiativeFormDescription}
                  onChange={(e) => setInitiativeFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setInitiatives(prev => prev.map((init, idx) => idx === initiativeIndex ? {
                    ...init,
                    title: initiativeFormTitle,
                    targetAmount: initiativeFormTarget,
                    description: initiativeFormDescription
                  } : init));
                  setEditingInitiative(null);
                  setShareToast("Initiative mise à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingInitiative(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Appel */}
      {isOwner && editingAppel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier l'appel</h3>
              </div>
              <button onClick={() => setEditingAppel(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Titre de l'appel :</label>
                <input
                  type="text"
                  value={appelFormTitle}
                  onChange={(e) => setAppelFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Degré d'urgence :</label>
                <input
                  type="text"
                  value={appelFormUrgency}
                  onChange={(e) => setAppelFormUrgency(e.target.value)}
                  placeholder="Ex: Urgent, Prioritaire"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Description :</label>
                <textarea
                  rows={3}
                  value={appelFormDescription}
                  onChange={(e) => setAppelFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1 resize-none"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Impact visé :</label>
                <input
                  type="text"
                  value={appelFormImpact}
                  onChange={(e) => setAppelFormImpact(e.target.value)}
                  placeholder="Ex: Archiver 25 entretiens"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setAppels(prev => prev.map((app, idx) => idx === appelIndex ? {
                    ...app,
                    title: appelFormTitle,
                    urgency: appelFormUrgency,
                    description: appelFormDescription,
                    impact: appelFormImpact
                  } : app));
                  setEditingAppel(null);
                  setShareToast("Appel mis à jour.");
                  setTimeout(() => setShareToast(null), 2500);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setEditingAppel(null)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODALE DE PARTAGE RÉSEAUX SOCIAUX                                      */}
      {/* ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Partager le profil</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Faites rayonner le profil de <span className="font-bold text-[#1C1917]">{profileDisplayName}</span> sur vos réseaux :
            </p>

            {/* Réseaux sociaux */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Découvrez le profil de ${profileDisplayName} sur Racines & Horizons : ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">W</span>
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez le profil de ${profileDisplayName} sur Racines & Horizons`)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">𝕏</span>
                <span>Twitter / X</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">f</span>
                <span>Facebook</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Découvrez le profil de ${profileDisplayName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-black">✈</span>
                <span>Telegram</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center text-xs font-black">in</span>
                <span>Partager sur LinkedIn</span>
              </a>
            </div>

            {/* Bouton Copier le lien */}
            <div className="pt-1">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setIsShareModalOpen(false);
                  setShareToast("Lien du profil copié dans le presse-papiers !");
                  setTimeout(() => setShareToast(null), 3000);
                }}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.98]"
              >
                <Copy className="w-4 h-4 text-[#C89B3C]" />
                <span>Copier le lien direct</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODALE D'ÉDITION DU PROFIL (Identité & Présentation)                   */}
      {/* ========================================================================= */}
      {isOwner && isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="font-editorial text-base font-bold text-[#1C1917]">Modifier mon profil</h3>
              </div>
              <button 
                onClick={() => setIsEditingProfile(false)} 
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block">Nom affiché :</label>
                <input
                  type="text"
                  value={profileEditName}
                  onChange={(e) => setProfileEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Titre / Rôle :</label>
                <input
                  type="text"
                  value={profileEditRole}
                  onChange={(e) => setProfileEditRole(e.target.value)}
                  placeholder="Ex: Tisserande & Passeuse de mémoires"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Territoire / Ville, Pays :</label>
                <input
                  type="text"
                  value={profileEditTerritory}
                  onChange={(e) => setProfileEditTerritory(e.target.value)}
                  placeholder="Ex: Ganvié, Bénin"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block">Biographie / Présentation :</label>
                <textarea
                  rows={3}
                  value={profileEditBio}
                  onChange={(e) => setProfileEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setUserName(profileEditName);
                  setUserFullName(profileEditName);
                  setUserRole(profileEditRole);
                  setUserTerritory(profileEditTerritory);
                  setUserBio(profileEditBio);
                  setIsEditingProfile(false);
                  setShareToast("Profil mis à jour avec succès.");
                  setTimeout(() => setShareToast(null), 3000);
                }}
                className="flex-1 h-11 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setIsEditingProfile(false)} 
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODALE D'ÉVALUATION DE LA VIDÉO (DIAMANT DE RÉSONANCE)                 */}
      {/* ========================================================================= */}
      <ResonanceModal
        isOpen={isResonanceModalOpen}
        onClose={() => setIsResonanceModalOpen(false)}
        storyId={currentItem?.id || (targetProtagonist ? `story-${targetProtagonist.id}` : 'user-profile-video')}
        topicId={activePillar}
        personName={personFirstName}
        initialPercentage={resonancePct}
        onRatingSubmitted={(percentage) => {
          setResonancePct(percentage);
          try {
            if (currentItem?.id) {
              localStorage.setItem(`yonywood_resonance_${currentItem.id}`, percentage.toString());
            }
          } catch {
            // ignore
          }
          setShareToast(`Évaluation enregistrée : ${percentage}% de résonance.`);
          setTimeout(() => setShareToast(null), 3000);
        }}
      />

    </div>
  );
};
