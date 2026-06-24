import type { Composition } from "@/types/scene";

/** Narrative — registration, party, navigation (ref: screen composi/5) */
export const composition04: Composition = {
  id: "composition-04",
  label: "Narrative",
  zRange: [10400, 12800],
  overlap: 350,
  referenceScreenshot: "/assets/screen composi/5.png",
  objects: [
    {
      id: "narrative-reg-text",
      type: "text",
      content:
        "Регистрация начиналась заранее. Нам было важно собрать участников до старта баттлов, чтобы вечер шёл без пауз и задержек. Чёткий регламент позволил удержать темп события от отборов до финала.",
      position: { x: -348, y: 14, z: -10640 },
      scale: 1,
      displayWidth: 280,
      textAlign: "left",
      lifecycle: { focusZ: -10640, exitDirection: "left" },
      drift: { amplitude: 0.8, speed: 0.1, seed: 0.8 },
    },
    {
      id: "narrative-visual-id",
      type: "svg",
      asset: "/assets/set4/visual1.svg",
      position: { x: 336, y: 128, z: -10880 },
      scale: 1.48,
      displayWidth: 540,
      lifecycle: { focusZ: -10880, exitDirection: "right" },
      svgFilter: true,
    },
    {
      id: "narrative-visual-money",
      type: "svg",
      asset: "/assets/set4/visual2.svg",
      position: { x: -365, y: 128, z: -11120 },
      scale: 0.92,
      displayWidth: 580,
      lifecycle: { focusZ: -11120, exitDirection: "left" },
      svgFilter: true,
    },
    {
      id: "narrative-party-text",
      type: "text",
      content: "после контеста, вечеринка до утра",
      position: { x: 50, y: -20, z: -11320 },
      scale: 1,
      lifecycle: { focusZ: -11320, exitDirection: "right" },
    },
    {
      id: "narrative-visual-dj",
      type: "svg",
      asset: "/assets/set4/visual3.svg",
      position: { x: 0, y: 200, z: -11560 },
      scale: 0.92,
      displayWidth: 600,
      lifecycle: { focusZ: -11560, exitDirection: "none" },
      svgFilter: true,
    },
    {
      id: "narrative-nav-text",
      type: "text",
      content:
        "Отдельное внимание уделили навигации. Мы показывали схему людям, которые ничего не знали о мероприятии, и смотрели, смогут ли они понять маршрут без дополнительных объяснений. После нескольких правок карта стала проще и понятнее.",
      position: { x: 154, y: -106, z: -11800 },
      scale: 1,
      displayWidth: 310,
      textAlign: "left",
      lifecycle: { focusZ: -11800, exitDirection: "down" },
      drift: { amplitude: 0.8, speed: 0.09, seed: 1.4 },
    },
  ],
};
