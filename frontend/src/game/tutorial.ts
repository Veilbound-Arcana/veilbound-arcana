export interface TutorialStep {
  step: number;
  id?: string;
  titleKey: string;
  bodyKey: string;
  title?: string;
  description?: string;
  routeTarget?: string;
  actionRequired?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    step: 1,
    id: "step-1",
    titleKey: "The Veil Awaits",
    bodyKey: "Choose your Warden name to bind your spirit signature.",
    title: "The Veil Awaits",
    description: "Reality is a thin Veil. Wardens bind astral spirits into Arcana cards.",
    actionRequired: "name_entry",
  },
  {
    step: 2,
    id: "step-2",
    titleKey: "Misty Boundaries",
    bodyKey: "Reality is a thin Veil. Spirits called Veilborn dwell within Arcana cards.",
    title: "Misty Boundaries",
    description: "Eight Aspects govern the realm: Ember, Tide, Verdant, Volt, Umbra, Lumen, Iron, and Aether.",
    actionRequired: "story_intro",
  },
  {
    step: 3,
    id: "step-3",
    titleKey: "Your First Pack",
    bodyKey: "Draw your thumb across the seal to open your awakening pack.",
    title: "The Sealed Vellum",
    description: "Slice the wax ribbon with your thumb to part the Veil and reveal your first 5 Arcana.",
    routeTarget: "/open",
    actionRequired: "tear_pack",
  },
  {
    step: 4,
    id: "step-4",
    titleKey: "The Archive",
    bodyKey: "All bound cards gather here in your personal collection.",
    title: "Sacred Archive",
    description: "Explore the 3-column collection chronicle to inspect your growing library of spirits.",
    routeTarget: "/archive",
    actionRequired: "view_archive",
  },
  {
    step: 5,
    id: "step-5",
    titleKey: "Spreads Alignment",
    bodyKey: "A 20-card tactical Spread has been harmonized for your trials.",
    title: "Spreads Formation",
    description: "Curate a 20-card duel Spread with at least one Basic spirit to face rival Wardens.",
    routeTarget: "/spreads",
    actionRequired: "view_spread",
  },
  {
    step: 6,
    id: "step-6",
    titleKey: "First Rite of Duel",
    bodyKey: "Face an astral shade in the Battle Sanctuary to prove your bond.",
    title: "Duel Rite Initiation",
    description: "Channel Aether each turn, deploy your Basic spirits, and claim 3 knockouts to triumph.",
    routeTarget: "/battle",
    actionRequired: "battle_trial",
  },
  {
    step: 7,
    id: "step-7",
    titleKey: "Sanctuary Welcomes You",
    bodyKey: "You are now a true Warden. Venture forth into the Veil.",
    title: "Warden's Awakening",
    description: "Your initiation is complete. The Sanctuary doors stand open. Wardens, begin.",
    routeTarget: "/",
    actionRequired: "complete",
  },
];
