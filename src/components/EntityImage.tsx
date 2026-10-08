import React, { useState, useEffect } from 'react';
import { getWeaponVisual, getAmmoVisual, getCharacterPortrait, getVehicleVisual, getTerritoryVisual, PHOTO_ASSETS } from '../game/visuals';

interface EntityImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  type?: 'weapon' | 'ammo' | 'portrait' | 'vehicle' | 'location' | 'faction' | 'event' | 'business';
  category?: string;
  model?: string;
  caliber?: string;
  role?: string;
  seed?: number;
  id?: string;
  fallbackSrc?: string;
}

export const EntityImage: React.FC<EntityImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  type,
  category,
  model,
  caliber,
  role,
  seed = 1,
  id = '',
  fallbackSrc
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Compute a reliable fallback URL based on entity type and properties
  const getComputedFallback = (): string => {
    if (fallbackSrc) return fallbackSrc;

    if (type === 'weapon' || (!type && (category || model))) {
      return getWeaponVisual(category || 'Pistols', model || alt || 'Firearm');
    }
    if (type === 'ammo' || caliber) {
      return getAmmoVisual(alt || 'Munitions', caliber || '9mm');
    }
    if (type === 'portrait' || role) {
      return getCharacterPortrait(role || 'Enforcer', seed, alt);
    }
    if (type === 'vehicle') {
      return getVehicleVisual(alt, category || 'Sedan');
    }
    if (type === 'location') {
      return getTerritoryVisual(id, category || 'District', 'eastern_port');
    }
    if (type === 'event') {
      return PHOTO_ASSETS.crisisStandoff;
    }
    return PHOTO_ASSETS.cityBanner;
  };

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    if (src && src.trim().length > 0) {
      // If src is a valid data URL or path, use it directly
      setCurrentSrc(src);
    } else {
      // Immediately fallback
      setCurrentSrc(getComputedFallback());
    }
  }, [src, category, model, caliber, role, seed, id]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = getComputedFallback();
      if (fallback && fallback !== currentSrc) {
        setCurrentSrc(fallback);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-900/60 animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full border-2 border-neutral-700 border-t-amber-500 animate-spin" />
        </div>
      )}
      <img
        src={currentSrc || getComputedFallback()}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
