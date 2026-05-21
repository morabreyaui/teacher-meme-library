// The 10 teacher situations from the brief, each with an emoji and a
// rich description used by the caption-generation prompt as context.
export const situations = [
  {
    id: "monday-chaos",
    label: "Monday Chaos",
    emoji: "😩",
    blurb:
      "It's 7:47am Monday. Coffee hasn't kicked in. The copier is jammed. A child has already cried.",
  },
  {
    id: "lesson-planning",
    label: "Lesson Planning",
    emoji: "📓",
    blurb:
      "Sunday night. Pinterest tabs. Half-finished slide deck. The lesson plan is fighting back.",
  },
  {
    id: "grading-pile",
    label: "Grading Pile",
    emoji: "📑",
    blurb:
      "147 papers. Due yesterday. The pile has emotional gravity now.",
  },
  {
    id: "students-not-reading",
    label: "Students Not Reading Directions",
    emoji: "🙃",
    blurb:
      "The directions were in 24-point font, bolded, on the board, on the handout, AND said out loud.",
  },
  {
    id: "admin-observation",
    label: "Admin Observation",
    emoji: "📋",
    blurb:
      "Drop-in observation. Of course it's during the chaotic group activity. Of course.",
  },
  {
    id: "group-work",
    label: "Group Work",
    emoji: "👥",
    blurb:
      "One kid does it all. One kid puts their head down. Two kids argue about who's writing.",
  },
  {
    id: "testing-day",
    label: "Testing Day",
    emoji: "✏️",
    blurb:
      "State testing energy. The room is silent. Somewhere a child sharpens a pencil for 14 minutes.",
  },
  {
    id: "differentiation",
    label: "Differentiation",
    emoji: "🧩",
    blurb:
      "32 kids, 32 IEPs, 32 reading levels, 1 of you. Make every lesson feel personalized. By Tuesday.",
  },
  {
    id: "classroom-management",
    label: "Classroom Management",
    emoji: "🚦",
    blurb:
      "The vibes have shifted. The energy is wrong. You can feel it before you turn around.",
  },
  {
    id: "last-period-energy",
    label: "Last Period Energy",
    emoji: "⏰",
    blurb:
      "It's 2:47pm. They are wild. You are tired. The clock is moving backwards.",
  },
];

export function getSituationById(id) {
  return situations.find((s) => s.id === id) || null;
}

// 5 tones from the brief. Each tone changes the voice the caption
// writer uses without crossing brand-safety lines.
export const tones = [
  {
    id: "relatable",
    label: "Relatable",
    emoji: "🥲",
    instruction:
      "Warm, true-to-life, knowing nod. The kind of caption a teacher screenshots and texts to their group chat saying 'literally me.' Specific over generic.",
  },
  {
    id: "sarcastic",
    label: "Sarcastic but Safe",
    emoji: "😏",
    instruction:
      "Dry, witty, a little pointed. 'The Office' deadpan. Sarcasm aimed at situations and systems, never at students or specific people. School-appropriate at all times.",
  },
  {
    id: "wholesome",
    label: "Wholesome",
    emoji: "🥹",
    instruction:
      "Heartfelt, encouraging, gently funny. The kind of meme a principal could share in a staff newsletter. Make us laugh AND make us feel seen.",
  },
  {
    id: "chaotic",
    label: "Chaotic",
    emoji: "🌀",
    instruction:
      "Unhinged-but-loving, slightly absurd, gallows humor. 'I am holding it together with one hot-glue stick' energy. Still fully school-appropriate.",
  },
  {
    id: "teacher-coded",
    label: "Very Teacher-Coded",
    emoji: "👩‍🏫",
    instruction:
      "Lean ALL the way into teacher-specific vocabulary: standards, IEPs, RTI, exit tickets, anchor charts, walkthroughs, common planning, T-charts, formative assessments. Should feel like an inside joke only educators get.",
  },
];

export function getToneById(id) {
  return tones.find((t) => t.id === id) || null;
}

// Loading copy that rotates while the agentic pipeline runs. The
// prefixes match real workflow steps so users feel the multi-step
// nature of the system.
export const loadingMessages = [
  "Picking the meme format that hits hardest…",
  "Drafting 10 caption options…",
  "Scoring captions for funniness…",
  "Running brand-safety review…",
  "Channeling teacher's lounge energy…",
  "Re-laminating one final thought…",
  "Asking the substitute for help…",
  "Locating a working dry-erase marker…",
  "Grading this joke on a curve…",
  "Consulting the team next door…",
];
