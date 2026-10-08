/**
 * Centralized Visual Assets Architecture for Underworld: Rise of a Kingpin
 * High-definition scene artwork, authentic firearm profiles, character portraits, vehicle renders,
 * district landscapes, faction heraldry, and business facades.
 */

// Photographic assets imported via ESM to guarantee bundler resolution
import cityBannerImg from '../assets/images/underworld_city_banner_1791441206050.jpg';
import tacticalArmoryImg from '../assets/images/underworld_tactical_armory_1791441220421.jpg';
import syndicateLeaderImg from '../assets/images/underworld_syndicate_leader_1791441234072.jpg';
import crisisStandoffImg from '../assets/images/underworld_crisis_standoff_1791441248561.jpg';
import armoredVanImg from '../assets/images/vehicle_armored_van_1791443918264.jpg';
import bankVaultImg from '../assets/images/location_bank_vault_1791443927196.jpg';
import docksNightImg from '../assets/images/location_docks_night_1791443936390.jpg';
import veteranSoldierImg from '../assets/images/character_veteran_soldier_1791443945112.jpg';
import femmeFataleImg from '../assets/images/character_femme_fatale_1791444742452.jpg';
import nightclubLoungeImg from '../assets/images/location_nightclub_lounge_1791444754053.jpg';
import hitmanEnforcerImg from '../assets/images/character_hitman_enforcer_1791444763601.jpg';
import industrialCompoundImg from '../assets/images/location_industrial_compound_1791445217846.jpg';

// Newly added high-fidelity weapon & munitions assets
import ammoDepotImg from '../assets/images/ammo_depot_crates_1791446292097.jpg';
import weaponM4Img from '../assets/images/weapon_tactical_m4_1791446249440.jpg';
import weaponAKMImg from '../assets/images/weapon_akm_rifle_1791446263128.jpg';
import weaponSniperImg from '../assets/images/weapon_sniper_rifle_1791446279380.jpg';
import weaponShotgunImg from '../assets/images/weapon_shotgun_rem870_1791446307938.jpg';
import weaponPistolImg from '../assets/images/weapon_pistol_tactical_1791446320173.jpg';
import weaponMeleeImg from '../assets/images/weapon_melee_kabar_1791446335033.jpg';
import vehicleSedanImg from '../assets/images/vehicle_luxury_sedan_1791446349135.jpg';

export const PHOTO_ASSETS = {
  cityBanner: cityBannerImg,
  tacticalArmory: tacticalArmoryImg,
  syndicateLeader: syndicateLeaderImg,
  crisisStandoff: crisisStandoffImg,
  armoredVan: armoredVanImg,
  bankVault: bankVaultImg,
  docksNight: docksNightImg,
  veteranSoldier: veteranSoldierImg,
  femmeFatale: femmeFataleImg,
  nightclubLounge: nightclubLoungeImg,
  hitmanEnforcer: hitmanEnforcerImg,
  industrialCompound: industrialCompoundImg,
  ammoDepot: ammoDepotImg,
  weaponM4: weaponM4Img,
  weaponAKM: weaponAKMImg,
  weaponSniper: weaponSniperImg,
  weaponShotgun: weaponShotgunImg,
  weaponPistol: weaponPistolImg,
  weaponMelee: weaponMeleeImg,
  vehicleSedan: vehicleSedanImg
};

/**
 * Universal UTF-8 Safe SVG to Base64 Data URL Converter
 * Solves all browser image preview issues, MIME decoding errors, and invalid character failures.
 */
export function createSvgDataUrl(svg: string): string {
  try {
    const cleanSvg = svg.trim();
    const encoded = btoa(
      encodeURIComponent(cleanSvg).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
    return `data:image/svg+xml;base64,${encoded}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
  }
}

/**
 * Procedural Technical Firearm Profile Renderer
 * Generates technical tactical silhouettes and authentic mechanical receiver art
 * tailored to specific models and platforms (Tarkov & Guns of 93 catalog).
 */
export function getWeaponVisual(category: string, model: string): string {
  const m = (model || '').toLowerCase();
  const c = (category || '').toLowerCase();

  // Route specific flagship platforms to high-res realistic renders when appropriate
  if (m.includes('sopmod') || m.includes('m4a1 block ii') || m.includes('mk18')) {
    return PHOTO_ASSETS.weaponM4;
  }
  if (m.includes('akm custom') || m.includes('akm tactical') || m.includes('ak-103')) {
    return PHOTO_ASSETS.weaponAKM;
  }
  if (m.includes('svd dragunov') || m.includes('dvl-10') || m.includes('remington 700 tactical')) {
    return PHOTO_ASSETS.weaponSniper;
  }
  if (m.includes('remington 870 tactical') || m.includes('mossberg 590a1')) {
    return PHOTO_ASSETS.weaponShotgun;
  }
  if (m.includes('m1911 meu(soc)') || m.includes('glock 17 tactical') || m.includes('beretta 92fs brigadier')) {
    return PHOTO_ASSETS.weaponPistol;
  }
  if (m.includes('ka-bar') || m.includes('m9 bayonet') || m.includes('tactical tomahawk')) {
    return PHOTO_ASSETS.weaponMelee;
  }

  // Tactical HUD Color scheme based on firearm category
  let stroke = '#94a3b8';
  let accent = '#38bdf8';
  let metal = '#1e293b';
  let darkMetal = '#0f172a';
  let woodOrPolymer = '#334155';

  if (c.includes('sniper') || c.includes('marksman')) {
    stroke = '#38bdf8';
    accent = '#0284c7';
  } else if (c.includes('assault') || c.includes('carbine') || c.includes('battle')) {
    stroke = '#f59e0b';
    accent = '#d97706';
  } else if (c.includes('machine') || c.includes('special')) {
    stroke = '#ef4444';
    accent = '#b91c1c';
  } else if (c.includes('shotgun')) {
    stroke = '#eab308';
    accent = '#ca8a04';
  } else if (c.includes('melee')) {
    stroke = '#a855f7';
    accent = '#7e22ce';
  } else if (c.includes('smg')) {
    stroke = '#10b981';
    accent = '#059669';
  } else if (c.includes('revolver')) {
    stroke = '#f97316';
    accent = '#ea580c';
  }

  let paths = '';

  // 1. REVOLVERS: Colt Python, Ruger GP100, SAA, S&W
  if (m.includes('python') || m.includes('ruger') || m.includes('action army') || m.includes('revolver') || c.includes('revolver')) {
    const isSAA = m.includes('action army');
    const isPython = m.includes('python');
    paths = `
      <!-- Barrel -->
      <rect x="180" y="88" width="${isSAA ? '140' : '110'}" height="14" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      ${isPython ? `<rect x="180" y="80" width="110" height="7" fill="none" stroke="${stroke}" stroke-width="1.5"/><line x1="205" y1="80" x2="205" y2="87" stroke="${stroke}" stroke-width="1.5"/><line x1="240" y1="80" x2="240" y2="87" stroke="${stroke}" stroke-width="1.5"/><line x1="270" y1="80" x2="270" y2="87" stroke="${stroke}" stroke-width="1.5"/>` : ''}
      <!-- Underlug / Ejector rod -->
      <rect x="180" y="103" width="${isSAA ? '120' : '75'}" height="7" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.2"/>
      <!-- Cylinder -->
      <rect x="128" y="84" width="48" height="28" rx="3" fill="#334155" stroke="${stroke}" stroke-width="1.8"/>
      <line x1="128" y1="91" x2="176" y2="91" stroke="${stroke}" stroke-width="1" stroke-dasharray="2 3"/>
      <line x1="128" y1="104" x2="176" y2="104" stroke="${stroke}" stroke-width="1" stroke-dasharray="2 3"/>
      <!-- Frame & Hammer -->
      <polygon points="128,84 100,88 95,98 90,95 86,104 100,114 128,114" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      <!-- Grip -->
      <path d="M 100 114 Q 90 145 75 168 L 105 174 Q 120 148 128 114 Z" fill="${isSAA ? '#78350f' : '#1e1b4b'}" stroke="${stroke}" stroke-width="1.8"/>
      <!-- Trigger Guard & Trigger -->
      <path d="M 128 114 Q 145 136 128 138 Q 115 136 115 120" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <path d="M 122 120 Q 126 128 120 132" stroke="${stroke}" stroke-width="2" fill="none"/>
    `;
  }
  // 2. CLASSIC PISTOLS: M1911, Tokarev, Browning Hi-Power, Makarov
  else if (m.includes('1911') || m.includes('tokarev') || m.includes('hi-power') || m.includes('makarov')) {
    paths = `
      <!-- Slide -->
      <rect x="85" y="80" width="135" height="28" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      <line x1="95" y1="83" x2="95" y2="98" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="100" y1="83" x2="100" y2="98" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="105" y1="83" x2="105" y2="98" stroke="${stroke}" stroke-width="1.5"/>
      <!-- Bushing / Muzzle -->
      <rect x="220" y="86" width="10" height="16" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
      <!-- Lower Frame -->
      <path d="M 90 108 L 210 108 L 210 115 L 135 115 L 120 168 L 88 165 L 98 108 Z" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      <!-- Grip Panel -->
      <polygon points="102,118 126,118 114,160 92,157" fill="#78350f" stroke="${stroke}" stroke-width="1.2"/>
      <!-- Trigger guard & Trigger -->
      <path d="M 135 115 Q 155 135 135 138 L 120 138" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="130" y="118" width="8" height="14" rx="2" fill="${stroke}"/>
      <!-- Beavertail -->
      <path d="M 90 108 Q 78 102 75 96 Q 84 105 90 112" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
    `;
  }
  // 3. MODERN PISTOLS & CANNONS: Glock, Desert Eagle, Beretta, Five-seveN, FNX
  else if (c.includes('pistol') || m.includes('glock') || m.includes('desert eagle') || m.includes('beretta') || m.includes('fnx') || m.includes('sig')) {
    const isDeagle = m.includes('desert eagle');
    paths = `
      <!-- Slide -->
      <rect x="${isDeagle ? '70' : '90'}" y="${isDeagle ? '74' : '82'}" width="${isDeagle ? '175' : '125'}" height="${isDeagle ? '36' : '26'}" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      ${isDeagle ? '<polygon points="170,74 245,74 245,86 170,86" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.2"/>' : ''}
      <!-- Muzzle -->
      <rect x="${isDeagle ? '245' : '215'}" y="${isDeagle ? '80' : '87'}" width="16" height="${isDeagle ? '24' : '16'}" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
      <!-- Frame -->
      <path d="M ${isDeagle ? '80' : '95'} ${isDeagle ? '110' : '108'} L ${isDeagle ? '225' : '205'} ${isDeagle ? '110' : '108'} L ${isDeagle ? '215' : '198'} 118 L 142 118 L 122 172 L 86 168 L 98 108 Z" fill="${isDeagle ? metal : darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
      <!-- Trigger Guard -->
      <path d="M 142 118 Q 165 142 138 142 L 122 142" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="135" y1="120" x2="130" y2="134" stroke="${stroke}" stroke-width="2.5"/>
    `;
  }
  // 4. SMGs: MP5, PP-19 Vityaz, Uzi, TEC-9, P90, Kriss Vector, MP7
  else if (c.includes('smg') || m.includes('mp5') || m.includes('uzi') || m.includes('vector') || m.includes('p90') || m.includes('vityaz') || m.includes('mp7') || m.includes('tec-9')) {
    if (m.includes('p90')) {
      // Bullpup FN P90
      paths = `
        <path d="M 60 145 C 50 110, 80 80, 120 80 L 260 80 L 275 110 L 255 145 L 205 145 L 180 125 L 155 145 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <rect x="120" y="74" width="120" height="12" rx="2" fill="#0284c7" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="185" cy="115" r="14" fill="#050811" stroke="${stroke}" stroke-width="1.5"/>
        <rect x="275" y="90" width="28" height="12" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
      `;
    } else if (m.includes('vector')) {
      // Kriss Vector Super V
      paths = `
        <rect x="90" y="80" width="130" height="28" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <path d="M 125 108 L 195 108 L 190 155 L 155 155 L 140 125 L 110 168 L 85 160 L 98 108 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <rect x="175" y="150" width="18" height="38" rx="2" fill="#050811" stroke="${stroke}" stroke-width="1.5"/>
        <rect x="220" y="86" width="55" height="14" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
        <path d="M 90 88 L 30 95 L 30 135 L 60 130 L 90 105" stroke="${stroke}" stroke-width="2" fill="none"/>
      `;
    } else if (m.includes('tec-9')) {
      // TEC-9 with perforated shroud
      paths = `
        <rect x="100" y="85" width="95" height="30" rx="3" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Perforated shroud -->
        <rect x="195" y="87" width="70" height="24" rx="10" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="210" cy="99" r="3" fill="#050811" stroke="${stroke}" stroke-width="1"/>
        <circle cx="225" cy="99" r="3" fill="#050811" stroke="${stroke}" stroke-width="1"/>
        <circle cx="240" cy="99" r="3" fill="#050811" stroke="${stroke}" stroke-width="1"/>
        <rect x="265" y="93" width="18" height="12" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Grip -->
        <path d="M 115 115 L 105 168 L 132 168 L 144 115 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Long Straight Mag -->
        <rect x="155" y="115" width="22" height="68" rx="2" fill="#0f172a" stroke="${stroke}" stroke-width="1.5"/>
      `;
    } else {
      // MP5 / PP-19 / Uzi
      const isUzi = m.includes('uzi');
      paths = `
        <rect x="75" y="80" width="140" height="32" rx="3" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <rect x="215" y="88" width="${isUzi ? '35' : '65'}" height="14" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <path d="M 75 88 L 25 100 L 25 140 L 50 132 L 75 105" stroke="${stroke}" stroke-width="2" fill="none"/>
        <path d="M 105 112 L 95 165 L 122 165 L 135 112 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Curved or straight 9mm mag -->
        ${isUzi ? `<rect x="100" y="130" width="18" height="50" rx="2" fill="#050811" stroke="${stroke}" stroke-width="1.5"/>` : `<path d="M 160 112 Q 170 155 155 178 L 175 180 Q 190 155 180 112 Z" fill="#050811" stroke="${stroke}" stroke-width="1.5"/>`}
      `;
    }
  }
  // 5. ASSAULT RIFLES & CARBINES: AKM, AK-74, M16, M4, HK416, SCAR, AS VAL, FAL, G3
  else if (c.includes('assault') || c.includes('carbine') || c.includes('battle') || m.includes('ak') || m.includes('m4') || m.includes('scar') || m.includes('m16') || m.includes('fal') || m.includes('g3')) {
    const isAK = m.includes('ak') || m.includes('val') || m.includes('galil');
    const isBullpup = m.includes('aug') || m.includes('famas');
    const isM1Carbine = m.includes('m1 carbine');

    if (isBullpup) {
      paths = `
        <path d="M 60 145 L 85 90 L 265 90 L 285 105 L 255 145 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <rect x="285" y="94" width="75" height="14" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
        <rect x="200" y="60" width="55" height="30" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <rect x="75" y="130" width="25" height="50" rx="3" fill="#0f172a" stroke="${stroke}" stroke-width="1.8"/>
      `;
    } else if (isAK) {
      // Classic curved banana magazine, distinctive receiver and gas block
      paths = `
        <!-- AK Receiver -->
        <polygon points="105,80 205,80 205,115 105,115" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Dust cover curved profile -->
        <path d="M 105 80 Q 155 72 205 80" stroke="${stroke}" stroke-width="1.8" fill="${metal}"/>
        <!-- Gas tube & Handguard -->
        <rect x="205" y="80" width="85" height="24" rx="2" fill="${woodOrPolymer}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Barrel & Front Sight Post -->
        <rect x="290" y="86" width="65" height="10" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <polygon points="340,86 345,70 348,70 348,86" fill="${metal}" stroke="${stroke}" stroke-width="1.2"/>
        <!-- Slanted Muzzle Brake -->
        <polygon points="355,85 365,82 365,97 355,96" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Iconic Curved 30-rd Mag -->
        <path d="M 160 115 Q 185 155 145 185 L 168 190 Q 210 155 182 115 Z" fill="#0f172a" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Pistol Grip -->
        <path d="M 125 115 L 110 162 L 132 165 L 142 115 Z" fill="${woodOrPolymer}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Stock -->
        <polygon points="105,85 35,92 25,145 60,140 105,115" fill="${woodOrPolymer}" stroke="${stroke}" stroke-width="1.8"/>
      `;
    } else if (isM1Carbine) {
      // M1 Carbine sleek wooden stock
      paths = `
        <path d="M 35 110 L 35 150 L 75 140 L 120 118 L 290 112 L 290 100 L 105 100 Z" fill="#78350f" stroke="${stroke}" stroke-width="1.8"/>
        <rect x="180" y="92" width="165" height="10" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <rect x="120" y="92" width="65" height="15" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <rect x="175" y="112" width="18" height="40" rx="2" fill="#0f172a" stroke="${stroke}" stroke-width="1.5"/>
      `;
    } else {
      // AR-15 / M4 / M16 Platform
      paths = `
        <!-- Upper & Lower Receiver -->
        <polygon points="110,80 205,80 205,115 110,115" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Carry Handle or Flat Top Picatinny Rail -->
        <rect x="125" y="72" width="95" height="8" rx="1" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Handguard Quad Rail -->
        <rect x="205" y="78" width="95" height="28" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Barrel -->
        <rect x="300" y="86" width="60" height="12" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Birdcage Flash Hider -->
        <rect x="360" y="85" width="16" height="14" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Curved STANAG Mag -->
        <path d="M 168 115 L 168 145 Q 175 175 160 185 L 180 188 Q 195 175 188 145 L 188 115 Z" fill="#0f172a" stroke="${stroke}" stroke-width="1.8"/>
        <!-- A2 Pistol Grip -->
        <path d="M 125 115 L 115 162 L 138 165 L 145 115 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Buffer Tube & Collapsible Stock -->
        <rect x="55" y="85" width="55" height="14" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
        <polygon points="55,80 20,86 18,142 45,138 55,95" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
      `;
    }
  }
  // 6. SHOTGUNS: Remington 870, Mossberg 590, Ithaca 37, SPAS-12, Saiga-12
  else if (c.includes('shotgun') || m.includes('870') || m.includes('590') || m.includes('ithaca') || m.includes('spas') || m.includes('shotgun')) {
    const isTactical = m.includes('spas') || m.includes('saiga');
    if (isTactical) {
      paths = `
        <rect x="90" y="78" width="145" height="36" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <rect x="235" y="84" width="115" height="16" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <rect x="165" y="114" width="30" height="58" rx="3" fill="#0f172a" stroke="${stroke}" stroke-width="2"/>
        <path d="M 120 114 L 105 165 L 130 168 L 138 114 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <polygon points="90,82 25,90 20,145 55,140 90,115" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
      `;
    } else {
      // Classic Pump Action Shotgun
      paths = `
        <!-- Long Receiver -->
        <polygon points="110,85 205,85 205,118 110,118" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Barrel -->
        <rect x="205" y="88" width="150" height="12" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Mag Tube -->
        <rect x="205" y="102" width="135" height="12" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Ribbed Pump Handle Forend -->
        <rect x="225" y="100" width="55" height="18" rx="3" fill="#78350f" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Stock -->
        <polygon points="110,90 25,105 22,155 60,145 110,118" fill="#78350f" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Trigger -->
        <path d="M 135 119 Q 155 139 135 141 L 125 141" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      `;
    }
  }
  // 7. SNIPER & MARKSMAN: Mosin, Remington 700, Winchester 70, SVD, DVL, Barrett M82, SV-98
  else if (c.includes('sniper') || c.includes('marksman') || m.includes('mosin') || m.includes('svd') || m.includes('700') || m.includes('barrett') || m.includes('dvl')) {
    const isBarrett = m.includes('barrett') || m.includes('50 cal') || m.includes('anti-materiel');
    const isClassic = m.includes('mosin') || m.includes('winchester') || m.includes('700');

    if (isBarrett) {
      paths = `
        <!-- Heavy .50 Receiver -->
        <rect x="80" y="75" width="145" height="42" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <!-- Fluted Heavy Barrel -->
        <rect x="225" y="86" width="135" height="18" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <!-- Arrowhead Muzzle Brake -->
        <polygon points="360,80 390,95 360,110 355,95" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <!-- Massive Optic Scope -->
        <rect x="120" y="50" width="110" height="20" rx="3" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <line x1="140" y1="70" x2="140" y2="76" stroke="${stroke}" stroke-width="2"/>
        <line x1="205" y1="70" x2="205" y2="76" stroke="${stroke}" stroke-width="2"/>
        <!-- Heavy Bipod -->
        <line x1="310" y1="104" x2="295" y2="165" stroke="${stroke}" stroke-width="2.5"/>
        <line x1="310" y1="104" x2="325" y2="165" stroke="${stroke}" stroke-width="2.5"/>
        <!-- Stock -->
        <polygon points="80,82 15,95 10,150 45,145 80,115" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
        <!-- Mag Box -->
        <rect x="155" y="117" width="45" height="48" rx="2" fill="#0f172a" stroke="${stroke}" stroke-width="1.8"/>
      `;
    } else {
      // Precision Bolt Action / Marksman
      paths = `
        <!-- Stock Full Length Wood or Polymer Chassis -->
        <path d="M 25 110 L 25 155 L 75 142 L 130 118 L 270 115 L 270 102 L 95 102 Z" fill="${isClassic ? '#78350f' : darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Free-floating Heavy Barrel -->
        <rect x="195" y="92" width="165" height="12" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Receiver & Bolt Handle -->
        <rect x="95" y="88" width="100" height="18" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="145" y1="88" x2="155" y2="76" stroke="${stroke}" stroke-width="2.5"/>
        <circle cx="155" cy="76" r="3.5" fill="${stroke}"/>
        <!-- High-powered Optic Scope -->
        <rect x="110" y="58" width="105" height="20" rx="3" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="130" y1="78" x2="130" y2="88" stroke="${stroke}" stroke-width="2"/>
        <line x1="195" y1="78" x2="195" y2="88" stroke="${stroke}" stroke-width="2"/>
        <!-- Bipod legs -->
        <line x1="300" y1="104" x2="290" y2="160" stroke="${stroke}" stroke-width="2"/>
        <line x1="300" y1="104" x2="310" y2="160" stroke="${stroke}" stroke-width="2"/>
      `;
    }
  }
  // 8. MACHINE GUNS: PKM, M249, RPK, M2 Browning
  else if (c.includes('machine') || m.includes('pkm') || m.includes('m249') || m.includes('rpk') || m.includes('browning')) {
    paths = `
      <rect x="65" y="70" width="170" height="48" rx="3" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
      <rect x="235" y="82" width="135" height="20" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
      <!-- Barrel carrying handle -->
      <path d="M 255 82 L 270 60 L 295 60 L 290 82" stroke="${stroke}" stroke-width="2" fill="none"/>
      <!-- Heavy Stock -->
      <polygon points="65,76 15,90 12,152 45,142 65,115" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
      <!-- Ammo Box Drum -->
      <rect x="135" y="118" width="55" height="55" rx="4" fill="#0f172a" stroke="${stroke}" stroke-width="2"/>
      <!-- Heavy Bipod -->
      <line x1="320" y1="102" x2="305" y2="168" stroke="${stroke}" stroke-width="2.5"/>
      <line x1="320" y1="102" x2="335" y2="168" stroke="${stroke}" stroke-width="2.5"/>
    `;
  }
  // 9. SPECIAL & LAUNCHERS: RPG-7, RG-6, Milkor M320, Flare Gun
  else if (c.includes('special') || m.includes('rpg') || m.includes('grenade') || m.includes('m320') || m.includes('launcher')) {
    paths = `
      <rect x="40" y="85" width="220" height="24" rx="3" fill="#78350f" stroke="${stroke}" stroke-width="2"/>
      <polygon points="260,80 340,65 340,125 260,110" fill="${darkMetal}" stroke="${stroke}" stroke-width="2"/>
      <!-- Conical Warhead Tip -->
      <polygon points="340,75 385,95 340,115" fill="#ef4444" stroke="${stroke}" stroke-width="2"/>
      <!-- Optical Sight -->
      <rect x="120" y="60" width="35" height="25" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
      <!-- Dual Grips -->
      <path d="M 140 109 L 132 155 L 148 155 L 152 109 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
      <path d="M 210 109 L 202 155 L 218 155 L 222 109 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
    `;
  }
  // 10. MELEE WEAPONS: Combat Knife, Tomahawk, Bayonet, Crowbar, Sledgehammer, Katana
  else if (c.includes('melee') || m.includes('knife') || m.includes('tomahawk') || m.includes('axe') || m.includes('crowbar') || m.includes('hammer') || m.includes('katana') || m.includes('bayonet') || m.includes('machete')) {
    if (m.includes('tomahawk') || m.includes('axe')) {
      paths = `
        <rect x="180" y="40" width="16" height="145" rx="3" fill="#334155" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Axe Head & Rear Spike -->
        <path d="M 160 55 L 235 42 Q 245 70 235 90 L 160 78 Z" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <polygon points="160,55 125,66 160,78" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
      `;
    } else if (m.includes('crowbar')) {
      paths = `
        <path d="M 85 160 L 265 65 Q 295 50 310 75 L 298 85 Q 285 70 260 85 L 85 175 Z" fill="#ef4444" stroke="${stroke}" stroke-width="2"/>
        <polygon points="85,160 65,172 85,175" fill="${metal}" stroke="${stroke}" stroke-width="1.5"/>
      `;
    } else if (m.includes('katana') || m.includes('sword')) {
      paths = `
        <!-- Katana Tsuka (Handle) -->
        <rect x="50" y="98" width="85" height="16" rx="2" fill="#1e1b4b" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Tsuba (Guard) -->
        <ellipse cx="138" cy="106" rx="6" ry="18" fill="#d97706" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Curved Blade -->
        <path d="M 142 103 Q 260 95 345 78 Q 365 72 360 86 Q 260 110 142 110 Z" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
      `;
    } else {
      // Tactical Combat Knife / Bayonet / Machete
      paths = `
        <!-- Grip -->
        <rect x="65" y="92" width="75" height="24" rx="4" fill="#334155" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="85" y1="92" x2="85" y2="116" stroke="${stroke}" stroke-width="1.5"/>
        <line x1="105" y1="92" x2="105" y2="116" stroke="${stroke}" stroke-width="1.5"/>
        <line x1="125" y1="92" x2="125" y2="116" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Crossguard -->
        <rect x="140" y="80" width="10" height="48" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Blade with fuller / clip point -->
        <path d="M 150 96 L 310 96 Q 345 96 350 104 Q 325 116 150 116 Z" fill="${metal}" stroke="${stroke}" stroke-width="2"/>
        <line x1="165" y1="102" x2="280" y2="102" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="8 3"/>
      `;
    }
  } else {
    // 11. UNIVERSAL FAILSAFE FIREARM BLUEPRINT (Guarantees no weapon card ever renders blank)
    paths = `
      <rect x="90" y="80" width="135" height="32" rx="2" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      <rect x="225" y="86" width="115" height="16" fill="${metal}" stroke="${stroke}" stroke-width="1.8"/>
      <rect x="340" y="84" width="18" height="20" rx="2" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="160" y="112" width="28" height="60" rx="2" fill="#0f172a" stroke="${stroke}" stroke-width="1.8"/>
      <path d="M 115 112 L 100 162 L 125 165 L 135 112 Z" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
      <polygon points="90,85 25,92 18,146 50,140 90,115" fill="${darkMetal}" stroke="${stroke}" stroke-width="1.8"/>
    `;
  }

  const safeModelName = model ? model.toUpperCase() : 'FIREARM';
  const gradId = `bg_${safeModelName.replace(/[^A-Z0-9]/g, '_')}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 210" width="100%" height="100%">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b0f19"/>
        <stop offset="100%" stop-color="#020408"/>
      </linearGradient>
    </defs>
    <rect width="400" height="210" fill="url(#${gradId})"/>
    
    <!-- Blueprint Measurement HUD -->
    <line x1="15" y1="20" x2="40" y2="20" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="15" y1="20" x2="15" y2="45" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="385" y1="20" x2="360" y2="20" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="385" y1="20" x2="385" y2="45" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="15" y1="190" x2="40" y2="190" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="15" y1="190" x2="15" y2="165" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="385" y1="190" x2="360" y2="190" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="385" y1="190" x2="385" y2="165" stroke="${stroke}" stroke-width="1.5"/>

    <g transform="translate(0, 0)">
      ${paths}
    </g>

    <!-- Calibration Watermark -->
    <text x="25" y="32" font-family="monospace" font-size="8" fill="${stroke}" opacity="0.6">ARSENAL SPEC // MIL-STD</text>
    <text x="375" y="196" font-family="monospace" font-size="10" font-weight="bold" fill="${stroke}" text-anchor="end" opacity="0.85">${safeModelName}</text>
  </svg>`;

  return createSvgDataUrl(svg);
}

/**
 * Procedural Ammunition Package Visual
 */
export function getAmmoVisual(name: string, caliber: string): string {
  const isHeavy = caliber.includes('50') || caliber.includes('40mm');
  const isShotgun = caliber.includes('12');
  const color = isHeavy ? '#ef4444' : isShotgun ? '#eab308' : '#38bdf8';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="100%" height="100%">
    <defs>
      <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
    </defs>
    <rect width="240" height="180" fill="#030712"/>
    <g transform="translate(30, 20)">
      <!-- Ammo Can Body -->
      <polygon points="25,25 145,25 175,55 55,55" fill="#334155" stroke="${color}" stroke-width="1.5"/>
      <polygon points="145,25 175,55 175,125 145,95" fill="#0f172a" stroke="${color}" stroke-width="1.5"/>
      <rect x="25" y="55" width="120" height="70" fill="url(#boxGrad)" stroke="${color}" stroke-width="2"/>
      
      <!-- Label Stencil -->
      <rect x="35" y="65" width="100" height="34" fill="#030712" stroke="${color}" stroke-width="1.2"/>
      <text x="85" y="82" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc" text-anchor="middle">${caliber.toUpperCase()}</text>
      <text x="85" y="93" font-family="monospace" font-size="7" fill="${color}" text-anchor="middle">MIL-SPEC MUNITIONS</text>
      
      <!-- Bullets / Shells sticking out -->
      <polygon points="155,38 165,30 170,35 160,43" fill="#eab308"/>
      <polygon points="163,46 173,38 178,43 168,51" fill="#eab308"/>
    </g>
  </svg>`;
  return createSvgDataUrl(svg);
}

/**
 * Vehicle Profile Visual
 */
export function getVehicleVisual(name: string, category: string): string {
  const n = (name || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (n.includes('armored') || cat.includes('armored')) {
    return PHOTO_ASSETS.armoredVan;
  }
  if (cat.includes('sedan') || n.includes('sedan') || n.includes('shadow') || cat.includes('luxury')) {
    return PHOTO_ASSETS.vehicleSedan;
  }

  let color = '#38bdf8';
  if (cat.includes('suv') || cat.includes('pickup')) color = '#fbbf24';
  if (cat.includes('motorcycle')) color = '#f43f5e';
  if (cat.includes('heavy') || cat.includes('truck')) color = '#a855f7';
  if (cat.includes('coupe') || cat.includes('muscle')) color = '#10b981';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="100%" height="100%">
    <rect width="320" height="180" fill="#090d16"/>
    <line x1="15" y1="145" x2="305" y2="145" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <g transform="translate(30, 42)">
      <!-- Car Body -->
      <path d="M 15 72 L 55 72 L 95 32 L 195 32 L 235 62 L 260 72 L 260 98 L 8 98 Z" fill="#1e293b" stroke="${color}" stroke-width="2"/>
      <!-- Tinted Windows -->
      <polygon points="100,38 145,38 145,66 75,66" fill="#030712" stroke="${color}" stroke-width="1.5"/>
      <polygon points="155,38 195,38 222,66 155,66" fill="#030712" stroke="${color}" stroke-width="1.5"/>
      <!-- Heavy Rims & Tires -->
      <circle cx="65" cy="98" r="22" fill="#050811" stroke="${color}" stroke-width="3"/>
      <circle cx="65" cy="98" r="9" fill="#334155"/>
      <circle cx="210" cy="98" r="22" fill="#050811" stroke="${color}" stroke-width="3"/>
      <circle cx="210" cy="98" r="9" fill="#334155"/>
      <!-- Headlights -->
      <polygon points="255,75 260,75 258,85 253,85" fill="#fde047"/>
    </g>
    <text x="295" y="166" font-family="monospace" font-size="9" fill="${color}" text-anchor="end">${name.toUpperCase()}</text>
  </svg>`;
  return createSvgDataUrl(svg);
}

/**
 * Character Portrait Generator with Distinct Role Visuals
 */
export function getCharacterPortrait(role: string, seed: number = 1, name: string = ''): string {
  const r = (role || '').toLowerCase();
  if (r.includes('veteran') || r.includes('soldier') || r.includes('sniper') || r.includes('heavy')) {
    return seed % 2 === 0 ? PHOTO_ASSETS.veteranSoldier : PHOTO_ASSETS.hitmanEnforcer;
  }
  if (r.includes('enforcer') || r.includes('bodyguard') || r.includes('hitman') || r.includes('muscle')) {
    return PHOTO_ASSETS.hitmanEnforcer;
  }
  if (r.includes('fixer') || r.includes('broker') || r.includes('hacker') || r.includes('negotiat') || r.includes('infiltrat') || r.includes('scout') || r.includes('medic')) {
    return PHOTO_ASSETS.femmeFatale;
  }
  if (r.includes('leader') || r.includes('boss') || r.includes('lieutenant') || r.includes('strategist') || r.includes('manager')) {
    return PHOTO_ASSETS.syndicateLeader;
  }

  // Tactical cyberpunk / syndicate silhouette portrait
  const colors = ['#f59e0b', '#38bdf8', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];
  const accent = colors[seed % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="p_${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#p_${seed})"/>
    <circle cx="100" cy="100" r="85" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 2"/>
    <g transform="translate(50, 38)">
      <!-- Head and Shoulders Silhouette -->
      <ellipse cx="50" cy="45" rx="30" ry="36" fill="#1e293b" stroke="${accent}" stroke-width="2"/>
      <path d="M 0 125 C 15 88, 85 88, 100 125 Z" fill="#0f172a" stroke="${accent}" stroke-width="2"/>
      <!-- Visor or Tactical Mask -->
      <rect x="25" y="38" width="50" height="12" rx="3" fill="#020617" stroke="${accent}" stroke-width="1.8"/>
      <line x1="30" y1="44" x2="70" y2="44" stroke="${accent}" stroke-width="2"/>
    </g>
    <text x="100" y="184" font-family="monospace" font-size="9" font-weight="bold" fill="${accent}" text-anchor="middle">${role.toUpperCase()}</text>
  </svg>`;
  return createSvgDataUrl(svg);
}

/**
 * Faction Emblem Crest Generator
 */
export function getFactionEmblem(factionId: string, color: string): string {
  const f = (factionId || '').toLowerCase();

  let emblemContent = '';
  if (f.includes('harbor') || f.includes('dock')) {
    // Maritime Anchor
    emblemContent = `
      <circle cx="50" cy="30" r="12" fill="none" stroke="${color}" stroke-width="4"/>
      <line x1="50" y1="42" x2="50" y2="82" stroke="${color}" stroke-width="5"/>
      <line x1="32" y1="52" x2="68" y2="52" stroke="${color}" stroke-width="4"/>
      <path d="M 22 68 Q 50 95 78 68" fill="none" stroke="${color}" stroke-width="5"/>
      <polygon points="20,68 15,60 28,64" fill="${color}"/>
      <polygon points="80,68 85,60 72,64" fill="${color}"/>
    `;
  } else if (f.includes('fang') || f.includes('wolf')) {
    // Wolf / Fangs
    emblemContent = `
      <polygon points="50,22 30,50 40,82 50,72 60,82 70,50" fill="none" stroke="${color}" stroke-width="4"/>
      <polygon points="38,48 44,65 42,48" fill="${color}"/>
      <polygon points="62,48 56,65 58,48" fill="${color}"/>
    `;
  } else if (f.includes('dragon') || f.includes('triad')) {
    // Dragon / Jade Blade
    emblemContent = `
      <path d="M 50 18 Q 75 35 60 55 Q 40 75 65 85" fill="none" stroke="${color}" stroke-width="4"/>
      <polygon points="50,18 40,24 52,28" fill="${color}"/>
      <circle cx="60" cy="35" r="3" fill="${color}"/>
    `;
  } else if (f.includes('vanguard') || f.includes('security')) {
    // Tactical Shield & Crosshair
    emblemContent = `
      <polygon points="50,18 80,30 80,65 50,85 20,65 20,30" fill="none" stroke="${color}" stroke-width="4"/>
      <circle cx="50" cy="50" r="14" fill="none" stroke="${color}" stroke-width="3"/>
      <line x1="50" y1="32" x2="50" y2="68" stroke="${color}" stroke-width="2"/>
      <line x1="32" y1="50" x2="68" y2="50" stroke="${color}" stroke-width="2"/>
    `;
  } else {
    // Sovereign Crown & Crossed Blades
    emblemContent = `
      <polygon points="25,40 35,68 65,68 75,40 60,52 50,30 40,52" fill="none" stroke="${color}" stroke-width="4"/>
      <line x1="25" y1="78" x2="75" y2="78" stroke="${color}" stroke-width="4"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" rx="12" fill="#090d16" stroke="${color}" stroke-width="1.5"/>
    <g>
      ${emblemContent}
    </g>
  </svg>`;
  return createSvgDataUrl(svg);
}

/**
 * Territory / District Landscape Visual
 */
export function getTerritoryVisual(territoryId: string = '', type: string = '', regionId: string = ''): string {
  const t = (type + ' ' + territoryId).toLowerCase();

  if (t.includes('port') || t.includes('dock') || t.includes('marina')) {
    return PHOTO_ASSETS.docksNight;
  }
  if (t.includes('industrial') || t.includes('freight') || t.includes('container') || t.includes('warehouse')) {
    return PHOTO_ASSETS.industrialCompound;
  }
  if (t.includes('financial') || t.includes('bank') || t.includes('vault') || t.includes('corporate')) {
    return PHOTO_ASSETS.bankVault;
  }
  if (t.includes('entertainment') || t.includes('club') || t.includes('casino')) {
    return PHOTO_ASSETS.nightclubLounge;
  }

  return PHOTO_ASSETS.cityBanner;
}

/**
 * Business Commercial Front Visual
 */
export function getBusinessVisual(businessId: string = '', type: string = ''): string {
  const b = (businessId + ' ' + type).toLowerCase();

  if (b.includes('lounge') || b.includes('club') || b.includes('casino') || b.includes('diner') || b.includes('tavern')) {
    return PHOTO_ASSETS.nightclubLounge;
  }
  if (b.includes('logistics') || b.includes('freight') || b.includes('scrap') || b.includes('foundry') || b.includes('chop')) {
    return PHOTO_ASSETS.industrialCompound;
  }
  if (b.includes('vault') || b.includes('pawn') || b.includes('holding') || b.includes('trust')) {
    return PHOTO_ASSETS.bankVault;
  }
  if (b.includes('security') || b.includes('clinic')) {
    return PHOTO_ASSETS.tacticalArmory;
  }

  return PHOTO_ASSETS.nightclubLounge;
}

/**
 * Dynamic Scene Art Resolver based on operation context
 */
export function getOperationScene(locationType: string = '', isCrisis: boolean = false, isOutcome: boolean = false, isSuccess: boolean = true): string {
  if (isCrisis) {
    return PHOTO_ASSETS.crisisStandoff;
  }
  const loc = (locationType || '').toLowerCase();
  if (loc.includes('bank') || loc.includes('vault')) {
    return PHOTO_ASSETS.bankVault;
  }
  if (loc.includes('port') || loc.includes('dock')) {
    return PHOTO_ASSETS.docksNight;
  }
  if (loc.includes('industrial') || loc.includes('freight') || loc.includes('warehouse')) {
    return PHOTO_ASSETS.industrialCompound;
  }
  if (loc.includes('club') || loc.includes('casino') || loc.includes('vip')) {
    return PHOTO_ASSETS.nightclubLounge;
  }
  if (loc.includes('assassin') || loc.includes('hit') || loc.includes('extract')) {
    return PHOTO_ASSETS.hitmanEnforcer;
  }
  return PHOTO_ASSETS.cityBanner;
}

/**
 * Dynamic Event Art Resolver based on category
 */
export function getEventVisual(category: string = '', title: string = ''): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('police')) return PHOTO_ASSETS.crisisStandoff;
  if (cat.includes('financial') || cat.includes('bank')) return PHOTO_ASSETS.bankVault;
  if (cat.includes('gang') || cat.includes('territory')) return PHOTO_ASSETS.industrialCompound;
  if (cat.includes('business') || cat.includes('market')) return PHOTO_ASSETS.nightclubLounge;
  if (cat.includes('personnel') || cat.includes('hit')) return PHOTO_ASSETS.hitmanEnforcer;
  if (cat.includes('political') || cat.includes('story')) return PHOTO_ASSETS.syndicateLeader;
  return PHOTO_ASSETS.cityBanner;
}
