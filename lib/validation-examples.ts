import type { DefectClass } from "./defect-taxonomy";
import type { RiskLevel } from "./priority-engine";

export type ValidationExample = {
  description: string;
  address?: string;
  district?: string;
  expectedClass: DefectClass;
  expectedRisk: RiskLevel;
};

export const validationExamples: ValidationExample[] = [
  {
    description: "Открытый люк возле школы, дети обходят по дороге",
    address: "рядом со школой N12",
    district: "auezov",
    expectedClass: "open_manhole",
    expectedRisk: "critical"
  },
  {
    description: "Deep pothole on the main road near bus stop",
    address: "Al-Farabi bus stop",
    district: "bostandyk",
    expectedClass: "pothole",
    expectedRisk: "critical"
  },
  {
    description: "Большая яма на проспекте, машины резко объезжают",
    address: "проспект Абая",
    district: "almaly",
    expectedClass: "pothole",
    expectedRisk: "critical"
  },
  {
    description: "Асфальт треснул вдоль полосы движения",
    address: "магистральная дорога",
    district: "turksib",
    expectedClass: "road_crack",
    expectedRisk: "high"
  },
  {
    description: "Road crack near crosswalk is getting wider",
    address: "crosswalk near school",
    district: "medeu",
    expectedClass: "road_crack",
    expectedRisk: "high"
  },
  {
    description: "Сломанная плитка на тротуаре, пожилые люди спотыкаются",
    address: "около поликлиники",
    district: "bostandyk",
    expectedClass: "broken_sidewalk",
    expectedRisk: "high"
  },
  {
    description: "Broken sidewalk blocks stroller access",
    address: "near kindergarten",
    district: "auezov",
    expectedClass: "broken_sidewalk",
    expectedRisk: "high"
  },
  {
    description: "Фонарь не работает, вечером очень темно",
    address: "остановка рядом с парком",
    district: "medeu",
    expectedClass: "broken_streetlight",
    expectedRisk: "high"
  },
  {
    description: "Streetlight outage near bus stop",
    address: "bus stop",
    district: "turksib",
    expectedClass: "broken_streetlight",
    expectedRisk: "high"
  },
  {
    description: "Дорожный знак поврежден и плохо виден",
    address: "возле перехода",
    district: "almaly",
    expectedClass: "damaged_sign",
    expectedRisk: "high"
  },
  {
    description: "Traffic sign is bent after accident",
    address: "crosswalk",
    district: "zhetysu",
    expectedClass: "damaged_sign",
    expectedRisk: "high"
  },
  {
    description: "Скопление мусора возле контейнеров и детской площадки",
    address: "жилой двор",
    district: "alatau",
    expectedClass: "trash",
    expectedRisk: "medium"
  },
  {
    description: "Garbage dump near apartment bins",
    address: "residential block",
    district: "nauryzbay",
    expectedClass: "trash",
    expectedRisk: "medium"
  },
  {
    description: "Подтопление после дождя, вода перекрыла дорогу",
    address: "проспект Райымбека",
    district: "zhetysu",
    expectedClass: "flooding",
    expectedRisk: "critical"
  },
  {
    description: "Flooding blocks hospital access road",
    address: "hospital access road",
    district: "bostandyk",
    expectedClass: "flooding",
    expectedRisk: "critical"
  },
  {
    description: "Нет крышки люка на дороге",
    address: "магистраль",
    district: "turksib",
    expectedClass: "open_manhole",
    expectedRisk: "critical"
  },
  {
    description: "Опасная зона без ограждения после ремонта",
    address: "возле остановки",
    district: "almaly",
    expectedClass: "unsafe_zone",
    expectedRisk: "high"
  },
  {
    description: "Unsafe hazard zone near pedestrian route",
    address: "school crossing",
    district: "auezov",
    expectedClass: "unsafe_zone",
    expectedRisk: "high"
  }
];
