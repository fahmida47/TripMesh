import bichanakandiImage from "./assets/bichanakandi.jpg";
import coxsbazarImage from "./assets/coxsbazar.jpg";
import dhakaCityImage from "./assets/dhaka-city.jpg";
import dhakaImage from "./assets/dhaka.jpg";
import dublarchorImage from "./assets/dublarchor.jpg";
import hironpointImage from "./assets/hironpoint.jpg";
import jaflongImage from "./assets/jaflong.jpg";
import karamjolImage from "./assets/karamjol.jpg";
import khagrachoriImage from "./assets/khagrachori.jpg";
import lalkhalImage from "./assets/lalkhal.jpg";
import rangamatiImage from "./assets/rangamati.jpg";
import ratargulImage from "./assets/ratargul.jpg";
import shadapathorImage from "./assets/shadapathor.jpg";
import sundarbansImage from "./assets/sundarbans.jpg";

import foysLakeImage from "./assets/Foy'z lake.jpg";
import patengaImage from "./assets/Potenga.jpg";
import sitakunduImage from "./assets/Sitakundu.jpg";
import sunViewImage from "./assets/SunView.jpg";
import bhatiariHillTowerImage from "./assets/bhatiari hill tower.jpg";
import ctgTowerImage from "./assets/ctg tower.jpg";

export function getExperienceAsset(title = "") {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("sundarban")) return sundarbansImage;
  if (normalizedTitle.includes("karamjol")) return karamjolImage;
  if (normalizedTitle.includes("hiron point")) return hironpointImage;
  if (normalizedTitle.includes("dublar char")) return dublarchorImage;

  if (normalizedTitle.includes("old dhaka")) return dhakaImage;
  if (normalizedTitle.includes("dhaka city")) return dhakaCityImage;
  if (normalizedTitle.includes("cox")) return coxsbazarImage;

  if (normalizedTitle.includes("rangamati")) return rangamatiImage;
  if (normalizedTitle.includes("khagrachari")) return khagrachoriImage;
  if (normalizedTitle.includes("ratargul")) return ratargulImage;
  if (normalizedTitle.includes("jaflong")) return jaflongImage;
  if (normalizedTitle.includes("lalakhal")) return lalkhalImage;
  if (normalizedTitle.includes("bichanakandi")) return bichanakandiImage;
  if (normalizedTitle.includes("sada pathor")) return shadapathorImage;

  // Chittagong experiences
  if (
    normalizedTitle.includes("foy's lake") ||
    normalizedTitle.includes("foys lake") ||
    normalizedTitle.includes("fouz lake")
  ) {
    return foysLakeImage;
  }

  if (
    normalizedTitle.includes("patenga") ||
    normalizedTitle.includes("potenga")
  ) {
    return patengaImage;
  }

  if (
    normalizedTitle.includes("sitakundu") ||
    normalizedTitle.includes("sitakunda")
  ) {
    return sitakunduImage;
  }

  if (
    normalizedTitle.includes("sunview") ||
    normalizedTitle.includes("sun view")
  ) {
    return sunViewImage;
  }

  if (
    normalizedTitle.includes("bhatiari") ||
    normalizedTitle.includes("bhatiary")
  ) {
    return bhatiariHillTowerImage;
  }

  if (
    normalizedTitle.includes("ctg tower") ||
    normalizedTitle.includes("chittagong tower") ||
    normalizedTitle.includes("chattogram tower")
  ) {
    return ctgTowerImage;
  }

  return null;
}