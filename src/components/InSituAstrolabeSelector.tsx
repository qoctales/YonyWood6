import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  Compass, 
  Sparkles, 
  ShoppingBag, 
  HeartHandshake, 
  Award,
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  Layers, 
  X,
  ArrowRight,
  Play
} from 'lucide-react';
import { ExplorerCategoryType, EXPLORER_CATEGORIES } from '../data/explorerTopicsData';
import { 
  GALLERY_ITEMS_BY_CATEGORY, 
  GalleryPosterItem 
} from '../data/explorerGalleryData';
import { celestialAudio } from '../utils/celestialAudio';

export interface InSituAstrolabeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: ExplorerCategoryType;
  activeTopicId: string;
  activeSeriesId: string;
  onSelectSeries: (seriesId: string) => void;
  onSelectTopic: (category: ExplorerCategoryType, topicId: string) => void;
}

export const InSituAstrolabeSelector: React.FC<InSituAstrolabeSelectorProps> = ({
  isOpen,
  onClose,
  activeCategory,
  activeTopicId,
  activeSeriesId,
  onSelectSeries,
  onSelectTopic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExplorerCategoryType>(activeCategory);
  // Volet 0 = items 1 à 8, Volet 1 = items 9 à 16
  const [batchIndex, setBatchIndex] = useState<number>(0);
  // Mode d'affichage : 'batch8' (8 affiches cinématographiques) ou 'all16' (panorama complet des 16)
  const [viewMode, setViewMode] = useState<'batch8' | 'all16'>('batch8');
  // Diffusion lumineuse lors de la sélection
  const [diffusingId, setDiffusingId] = useState<string | null>(null);

  // Synchroniser à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(activeCategory);
      setBatchIndex(0);
      setDiffusingId(null);
    }
  }, [isOpen, activeCategory]);

  // Écoute de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 6 médaillons joailliers haut de gamme
  const CATEGORIES = useMemo(() => [
    {
      id: 'series' as ExplorerCategoryType,
      label: 'Séries',
      subtitle: 'Les 5 productions & la lignée des pionniers',
      icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 440
    },
    {
      id: 'thematics' as ExplorerCategoryType,
      label: 'Thématiques',
      subtitle: '16 portes d’entrée humaines universelles',
      icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 500
    },
    {
      id: 'topics' as ExplorerCategoryType,
      label: 'Sujets',
      subtitle: '16 défis & symboles racontés par 16 voix',
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 560
    },
    {
      id: 'offers' as ExplorerCategoryType,
      label: 'Offres',
      subtitle: '16 créations, ateliers & pièces d’artisanat',
      icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 620
    },
    {
      id: 'opportunities' as ExplorerCategoryType,
      label: 'Appels',
      subtitle: '16 projets & collectes citoyennes à soutenir',
      icon: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 680
    },
    {
      id: 'brands' as ExplorerCategoryType,
      label: 'Marques',
      subtitle: '16 manufactures, coopératives & ateliers',
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C16C]" />,
      pitch: 740
    }
  ], []);

  // Liste complète des 16 propositions pour la catégorie sélectionnée
  const allProposals = useMemo<GalleryPosterItem[]>(() => {
    return GALLERY_ITEMS_BY_CATEGORY[selectedCategory] || GALLERY_ITEMS_BY_CATEGORY.thematics;
  }, [selectedCategory]);

  // Les 8 propositions affichées selon le volet actif (0 = 1-8, 1 = 9-16)
  const displayedProposals = useMemo<GalleryPosterItem[]>(() => {
    if (viewMode === 'all16') {
      return allProposals;
    }
    const start = batchIndex * 8;
    return allProposals.slice(start, start + 8);
  }, [allProposals, batchIndex, viewMode]);

  // Clic sur un médaillon joaillier
  const handleSelectCategory = (cat: ExplorerCategoryType, pitch: number) => {
    celestialAudio.playOrbHover(pitch);
    setSelectedCategory(cat);
    setBatchIndex(0);
  };

  // Clic sur une affiche 2:3
  const handleSelectPoster = (item: GalleryPosterItem) => {
    celestialAudio.playOrbSelect();
    setDiffusingId(item.id);

    setTimeout(() => {
      if (item.category === 'series') {
        onSelectSeries(item.seriesId || item.id);
      } else {
        onSelectTopic(item.category, item.id);
      }
      setDiffusingId(null);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div 
      id="insitu-astrolabe-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300 select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* Onde de diffusion rayonnante lors de la sélection */}
      {diffusingId && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="w-[1200px] h-[1200px] rounded-full bg-radial from-[#C89B3C]/50 via-[#C89B3C]/15 to-transparent animate-ping duration-500" />
        </div>
      )}

      {/* PANNEAU PRINCIPAL CINÉMATOGRAPHIQUE */}
      <div 
        id="insitu-cinematic-stage"
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-stone-950/95 border border-[#C89B3C]/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOUTON FERMER DISCRET */}
        <button
          id="btn-close-gallery-hub"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700/60 hover:border-[#C89B3C] text-stone-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30"
          title="Fermer (Échap)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. EN-TÊTE : LES 6 MÉDAILLONS JOAILLIERS HAUT DE GAMME */}
        <div className="pt-6 pb-4 px-4 sm:px-8 border-b border-stone-800/80 bg-gradient-to-b from-stone-900/60 to-transparent">
          <div className="text-center mb-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C89B3C] font-semibold">
              Portails de résonance & d’exploration
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-white tracking-wide mt-0.5">
              Choisissez votre horizon
            </h2>
          </div>

          {/* BARRE DES 6 MÉDAILLONS JOAILLIERS */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  id={`medallion-cat-${cat.id}`}
                  onClick={() => handleSelectCategory(cat.id, cat.pitch)}
                  className={`group relative flex flex-col items-center p-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#2E2419] to-[#17120D] border border-[#E5C16C] shadow-[0_0_20px_rgba(200,155,60,0.35)] scale-105'
                      : 'bg-stone-900/50 hover:bg-stone-900 border border-stone-800 hover:border-[#C89B3C]/50 hover:scale-102'
                  }`}
                >
                  {/* Médaillon circulaire joaillier */}
                  <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-[#3D2E1A] to-[#1F170D] border-2 border-[#E5C16C] shadow-[0_0_15px_rgba(229,193,108,0.5)]' 
                      : 'bg-stone-950/80 border border-stone-700/60 group-hover:border-[#C89B3C]/80 group-hover:scale-105'
                  }`}>
                    {cat.icon}
                  </div>

                  {/* Label sobre & raffiné */}
                  <span className={`text-xs sm:text-sm font-medium tracking-wide mt-1.5 transition-colors ${
                    isSelected ? 'text-[#F5D88C] font-semibold' : 'text-stone-400 group-hover:text-stone-200'
                  }`}>
                    {cat.label}
                  </span>

                  {/* Indicateur actif doré sous le médaillon */}
                  {isSelected && (
                    <div className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#E5C16C] shadow-[0_0_8px_#E5C16C]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BARRE D'ACTIONS : CONTRÔLE DE NAVIGATION PAR LOTS DE 8 VERS 16 */}
        <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-3 bg-stone-900/30 border-b border-stone-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C89B3C] font-semibold">
              {currentCategoryConfig.label} :
            </span>
            <span className="text-xs sm:text-sm text-stone-300 font-normal">
              {currentCategoryConfig.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Indicateur et flèches de navigation de 8 en 8 (uniquement en mode 'batch8') */}
            {viewMode === 'batch8' && (
              <div className="flex items-center gap-1.5 bg-stone-900/90 border border-stone-700/60 rounded-full px-2 py-1 shadow-sm">
                <button
                  id="btn-prev-batch-8"
                  onClick={() => {
                    setBatchIndex(0);
                    celestialAudio.playOrbHover(480);
                  }}
                  disabled={batchIndex === 0}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    batchIndex === 0 
                      ? 'text-stone-600 cursor-not-allowed opacity-40' 
                      : 'text-[#E5C16C] hover:bg-[#C89B3C]/20 cursor-pointer'
                  }`}
                  title="Voir les 8 précédentes (1 à 8)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-2 text-[11px] sm:text-xs font-semibold tracking-wide">
                  <span className={batchIndex === 0 ? 'text-[#F5D88C]' : 'text-stone-500'}>
                    1-8
                  </span>
                  <span className="text-stone-600">/</span>
                  <span className={batchIndex === 1 ? 'text-[#F5D88C]' : 'text-stone-500'}>
                    9-16
                  </span>
                </div>

                <button
                  id="btn-next-batch-8"
                  onClick={() => {
                    setBatchIndex(1);
                    celestialAudio.playOrbHover(520);
                  }}
                  disabled={batchIndex === 1}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    batchIndex === 1 
                      ? 'text-stone-600 cursor-not-allowed opacity-40' 
                      : 'text-[#E5C16C] hover:bg-[#C89B3C]/20 cursor-pointer'
                  }`}
                  title="Voir les 8 suivantes (9 à 16)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bouton de bascule : Vue 8 par 8 < > Déplier les 16 */}
            <button
              id="btn-toggle-view-16"
              onClick={() => {
                setViewMode(prev => prev === 'batch8' ? 'all16' : 'batch8');
                celestialAudio.playOrbHover(580);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-[#C89B3C]/40 hover:border-[#C89B3C] text-xs font-medium text-[#F5D88C] transition-all cursor-pointer shadow-sm"
              title={viewMode === 'batch8' ? "Voir les 16 d'un seul coup d'œil" : "Revenir à la navigation par 8"}
            >
              {viewMode === 'batch8' ? (
                <>
                  <Grid className="w-3.5 h-3.5 text-[#E5C16C]" />
                  <span>Déplier les 16</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#E5C16C]" />
                  <span>Vue 8 par 8</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. GALERIE D'AFFICHES VERTICALES FORMAT CINÉMA (2:3) */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'batch8' 
              ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4' 
              : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4'
          }`}>
            {displayedProposals.map((item, idx) => {
              const isDiffusingThis = diffusingId === item.id;
              const isCurrentlyActive = 
                (item.category === 'series' && (item.seriesId === activeSeriesId || (item.id === 'ALL' && activeSeriesId === 'ALL'))) ||
                (item.category !== 'series' && item.id === activeTopicId);

              return (
                <div
                  key={item.id}
                  id={`poster-card-${item.id}`}
                  onClick={() => handleSelectPoster(item)}
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-end aspect-[2/3] bg-stone-900 select-none ${
                    isDiffusingThis 
                      ? 'ring-4 ring-[#E5C16C] scale-105 shadow-[0_0_35px_rgba(200,155,60,0.8)]' 
                      : isCurrentlyActive
                        ? 'border-[#E5C16C] shadow-[0_0_20px_rgba(200,155,60,0.4)] ring-1 ring-[#C89B3C]'
                        : 'border-stone-800 hover:border-[#C89B3C]/80 hover:shadow-[0_0_25px_rgba(200,155,60,0.25)] hover:scale-[1.02]'
                  }`}
                >
                  {/* Visuel d'affiche plein cadre format vertical 2:3 */}
                  <img 
                    src={item.posterUrl} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Voile cinématographique dégradé sombre pour lisibilité absolue */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15 group-hover:via-black/35 transition-colors" />

                  {/* BADGE SUPÉRIEUR : Question centrale / Tag thématique / Prix / Financement */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#C89B3C]/60 text-[10px] sm:text-xs font-semibold text-[#F5D88C] shadow-sm tracking-wide">
                      {item.tag}
                    </span>

                    {/* Prix éventuel (Offres) */}
                    {item.price && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C89B3C] text-stone-950 text-[11px] sm:text-xs font-bold shadow-md">
                        {item.price}
                      </span>
                    )}

                    {/* Badge pionnier actif */}
                    {isCurrentlyActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E5C16C] shadow-[0_0_8px_#E5C16C]" title="Actif sur l'astrolabe" />
                    )}
                  </div>

                  {/* JAUGE DE FINANCEMENT PROGRESSIVE (POUR LES APPELS & PROJETS) */}
                  {item.funding && (
                    <div className="absolute top-11 left-3 right-3 z-10">
                      <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                        <div 
                          className="bg-gradient-to-r from-[#C89B3C] to-[#E5C16C] h-full rounded-full"
                          style={{ width: `${Math.min(100, item.funding.pct)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-300 font-medium mt-1">
                        <span>{item.funding.pct}% financé</span>
                        <span>{item.funding.collected.toLocaleString()} €</span>
                      </div>
                    </div>
                  )}

                  {/* CONTENU INFÉRIEUR DE L'AFFICHE */}
                  <div className="relative z-10 p-3 sm:p-4 text-left flex flex-col justify-end">
                    {/* Artisan créateur ou Territoire */}
                    {(item.artisanName || item.territory) && (
                      <span className="text-[10px] sm:text-[11px] text-[#E5C16C] uppercase tracking-wider font-semibold line-clamp-1 mb-0.5">
                        {item.artisanName ? `${item.artisanName} • ${item.territory || ''}` : item.territory}
                      </span>
                    )}

                    {/* Titre principal */}
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide group-hover:text-[#F5D88C] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Sous-titre évocateur */}
                    <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* Bouton d'action au survol */}
                    <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-semibold text-[#F5D88C] opacity-90 group-hover:opacity-100">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3 fill-[#F5D88C]" />
                        <span>Explorer la lignée</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FLÈCHES RAPIDES INFÉRIEURES SI VUE 8 PAR 8 */}
          {viewMode === 'batch8' && (
            <div className="mt-6 sm:mt-8 pt-4 border-t border-stone-800/80 flex items-center justify-center gap-4">
              <button
                id="btn-bottom-prev"
                onClick={() => {
                  setBatchIndex(0);
                  celestialAudio.playOrbHover(480);
                }}
                disabled={batchIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                  batchIndex === 0
                    ? 'border-stone-800 text-stone-600 opacity-40 cursor-not-allowed'
                    : 'border-[#C89B3C]/50 bg-stone-900 text-[#F5D88C] hover:bg-stone-800 hover:border-[#C89B3C] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>8 premières propositions (1 à 8)</span>
              </button>

              <button
                id="btn-bottom-next"
                onClick={() => {
                  setBatchIndex(1);
                  celestialAudio.playOrbHover(520);
                }}
                disabled={batchIndex === 1}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                  batchIndex === 1
                    ? 'border-stone-800 text-stone-600 opacity-40 cursor-not-allowed'
                    : 'border-[#C89B3C]/50 bg-stone-900 text-[#F5D88C] hover:bg-stone-800 hover:border-[#C89B3C] cursor-pointer'
                }`}
              >
                <span>8 suivantes (9 à 16)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
