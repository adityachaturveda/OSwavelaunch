export type TimelineStatus = "done" | "in_progress" | "pending";

export type ClientTimelineEntry = {
  month: string;
  focus: string;
  items: {
    title: string;
    status: TimelineStatus;
  }[];
};

export type ClientDeliverable = {
  id: string;
  title: string;
  type: string;
  month: string;
  status: "Complete" | "In Review" | "Pending";
  uploadedOn?: string;
};

export type ClientDocument = {
  id: string;
  name: string;
  uploadedBy: string;
  type: string;
  month: string;
  action: "View" | "Download";
};

export type ClientNote = {
  id: string;
  date: string;
  content: string;
  tags: string[];
};

export type ClientCommunication = {
  pinned: string[];
  feed: {
    id: string;
    author: string;
    role: string;
    date: string;
    message: string;
  }[];
  internal: string[];
};

export type ClientDetail = {
  id: string;
  name: string;
  brand: string;
  industry: string;
  started: string;
  stage: string;
  stageSummary: string;
  stageMonth: string;
  summary: string;
  progress: number;
  currentFocus: string;
  nextMilestone: string;
  activities: {
    id: string;
    description: string;
    date: string;
  }[];
  metrics: {
    label: string;
    value: string;
    hint: string;
  }[];
  timeline: ClientTimelineEntry[];
  deliverables: ClientDeliverable[];
  communication: ClientCommunication;
  documents: ClientDocument[];
  notes: ClientNote[];
};

const CLIENT_DETAILS: Record<string, ClientDetail> = {
  acme: {
    id: "acme",
    name: "Acme Studios",
    brand: "Acme",
    industry: "Hybrid Creative Agency",
    started: "March 2025",
    stage: "Month 3 of 8",
    stageSummary: "Brand Identity & Website Experience",
    stageMonth: "Month 3",
    summary:
      "Acme is a hybrid agency partnering with SaaS founders. Current focus is to ship brand identity assets and the marketing site.",
    progress: 38,
    currentFocus: "Designing brand visual identity and homepage",
    nextMilestone: "Week 14: Website draft presentation",
    activities: [
      { id: "act-1", description: "Logo concept round two approved", date: "2 days ago" },
      { id: "act-2", description: "Brand name trademark filing submitted", date: "Last week" },
      { id: "act-3", description: "Packaging sample order placed", date: "Last week" },
    ],
    metrics: [
      { label: "Active Sprints", value: "2", hint: "Identity build + website" },
      { label: "Upcoming Deliverables", value: "5", hint: "Next 30 days" },
      { label: "Last Client Touchpoint", value: "5 hours ago", hint: "Weekly standup" },
      { label: "Relationship Health", value: "Green", hint: "On schedule" },
    ],
    timeline: [
      {
        month: "Month 1",
        focus: "Brand Discovery",
        items: [
          { title: "Kickoff workshop", status: "done" },
          { title: "Audience research", status: "done" },
          { title: "Competitive audit", status: "done" },
        ],
      },
      {
        month: "Month 2",
        focus: "Brand Strategy",
        items: [
          { title: "Messaging framework", status: "in_progress" },
          { title: "Voice and tone guide", status: "in_progress" },
          { title: "Visual moodboards", status: "done" },
        ],
      },
      {
        month: "Month 3",
        focus: "Visual Identity",
        items: [
          { title: "Logo concepts", status: "in_progress" },
          { title: "Typography selection", status: "pending" },
          { title: "Color palette finalization", status: "pending" },
        ],
      },
      {
        month: "Month 4",
        focus: "Website Design",
        items: [
          { title: "Homepage wireframe", status: "pending" },
          { title: "UI system", status: "pending" },
          { title: "Prototype review", status: "pending" },
        ],
      },
    ],
    deliverables: [
      { id: "del-1", title: "Brand Strategy Deck", type: "PDF", month: "Month 2", status: "Complete", uploadedOn: "Apr 10" },
      { id: "del-2", title: "Logo Variations", type: "ZIP", month: "Month 3", status: "In Review", uploadedOn: "May 02" },
      { id: "del-3", title: "Packaging Mockups", type: "PNG", month: "Month 5", status: "Pending" },
      { id: "del-4", title: "Website Copy Outline", type: "DOC", month: "Month 3", status: "In Review", uploadedOn: "May 05" },
      { id: "del-5", title: "Launch Plan Checklist", type: "DOC", month: "Month 6", status: "Pending" },
    ],
    communication: {
      pinned: [
        "Client asked for lighter typography on homepage",
        "Approved color palette variation 2",
      ],
      feed: [
        {
          id: "msg-1",
          author: "Veronica Lane",
          role: "Client",
          date: "May 04",
          message: "Loving the refined logo mark. Can we preview it on a darker background?",
        },
        {
          id: "msg-2",
          author: "Alex Kim",
          role: "Design Lead",
          date: "May 02",
          message: "Uploaded second pass at packaging dielines. Feedback welcome before Friday.",
        },
        {
          id: "msg-3",
          author: "Jordan Smith",
          role: "Account Partner",
          date: "Apr 29",
          message: "Reminder that legal review on brand name is in progress; expect update Monday.",
        },
      ],
      internal: [
        "Confirm that client is okay with retainer uplift before sprint 4",
        "Collect testimonials for launch microsite",
      ],
    },
    documents: [
      { id: "doc-1", name: "Brand Strategy.pdf", uploadedBy: "Arunav", type: "PDF", month: "2", action: "View" },
      { id: "doc-2", name: "Logo Concepts.zip", uploadedBy: "Design Team", type: "ZIP", month: "3", action: "Download" },
      { id: "doc-3", name: "Persona Interviews.mp3", uploadedBy: "Research", type: "Audio", month: "1", action: "Download" },
      { id: "doc-4", name: "Website Copy Outline.docx", uploadedBy: "Content", type: "DOCX", month: "3", action: "View" },
    ],
    notes: [
      { id: "note-1", date: "Apr 22", content: "Client leaning toward minimalist look with softer neutrals.", tags: ["Creative", "Brand"] },
      { id: "note-2", date: "Apr 25", content: "Website hero to emphasize product ROI for founders.", tags: ["Website", "Pending Approval"] },
      { id: "note-3", date: "May 01", content: "Need to prep investor one-pager as part of launch milestone.", tags: ["Business", "Action"] },
    ],
  },
  "blue-harbor": {
    id: "blue-harbor",
    name: "Blue Harbor AI",
    brand: "Blue Harbor",
    industry: "AI Logistics Platform",
    started: "January 2025",
    stage: "Month 5 of 8",
    stageSummary: "Prototype & Pilot Prep",
    stageMonth: "Month 5",
    summary:
      "Enterprise analytics company aligning ops for pilot launch. Heavy coordination between product, GTM, and creative.",
    progress: 52,
    currentFocus: "Building pilot onboarding flows and rollout communication",
    nextMilestone: "Week 20: Pilot go-live checkpoint",
    activities: [
      { id: "bh-1", description: "Updated onboarding sequence copy", date: "1 day ago" },
      { id: "bh-2", description: "Secured partner testimonial for case study", date: "3 days ago" },
      { id: "bh-3", description: "Published new product metrics dashboard", date: "Last week" },
    ],
    metrics: [
      { label: "Active Sprints", value: "3", hint: "Brand, Product, GTM" },
      { label: "Upcoming Deliverables", value: "8", hint: "Next 30 days" },
      { label: "Last Client Touchpoint", value: "Yesterday", hint: "Pilot ops sync" },
      { label: "Relationship Health", value: "Stable", hint: "Minor scope creep" },
    ],
    timeline: [
      {
        month: "Month 1",
        focus: "Discovery",
        items: [
          { title: "Stakeholder interviews", status: "done" },
          { title: "Logistics audit", status: "done" },
          { title: "Success metrics defined", status: "done" },
        ],
      },
      {
        month: "Month 3",
        focus: "Brand Narrative",
        items: [
          { title: "Messaging architecture", status: "done" },
          { title: "Case study structure", status: "in_progress" },
          { title: "Pilot announcement plan", status: "pending" },
        ],
      },
      {
        month: "Month 4",
        focus: "Design System",
        items: [
          { title: "UI library", status: "in_progress" },
          { title: "Dashboard theming", status: "in_progress" },
          { title: "Pilot onboarding UI", status: "pending" },
        ],
      },
      {
        month: "Month 5",
        focus: "Pilot Prep",
        items: [
          { title: "Success metrics instrumentation", status: "in_progress" },
          { title: "Partner communications", status: "pending" },
          { title: "Launch checklist", status: "pending" },
        ],
      },
    ],
    deliverables: [
      { id: "bh-del-1", title: "Pilot Rollout Plan", type: "DOC", month: "Month 5", status: "In Review", uploadedOn: "May 03" },
      { id: "bh-del-2", title: "Dashboard Theme Kit", type: "FIG", month: "Month 4", status: "In Review", uploadedOn: "Apr 28" },
      { id: "bh-del-3", title: "Messaging Framework", type: "PDF", month: "Month 3", status: "Complete", uploadedOn: "Mar 15" },
      { id: "bh-del-4", title: "Sales Enablement Deck", type: "PDF", month: "Month 6", status: "Pending" },
    ],
    communication: {
      pinned: [
        "Client wants weekly pilot readiness summary",
        "Reminder: highlight compliance certifications in website copy",
      ],
      feed: [
        {
          id: "bh-msg-1",
          author: "Morgan Patel",
          role: "Client",
          date: "May 03",
          message: "Can we include the new partner testimonial in the onboarding drip?",
        },
        {
          id: "bh-msg-2",
          author: "Eli Warren",
          role: "PM",
          date: "May 01",
          message: "Shared latest pilot dashboard mockups for review.",
        },
        {
          id: "bh-msg-3",
          author: "Taylor Brooks",
          role: "Growth",
          date: "Apr 30",
          message: "Lead scoring thresholds updated in CRM. Align messaging in next cadence.",
        },
      ],
      internal: [
        "Scope design QA time for the next sprint",
        "Coordinate with legal on data sharing agreements",
      ],
    },
    documents: [
      { id: "bh-doc-1", name: "Pilot Timeline.xlsx", uploadedBy: "Operations", type: "XLSX", month: "5", action: "Download" },
      { id: "bh-doc-2", name: "Messaging Framework.pdf", uploadedBy: "Brand", type: "PDF", month: "3", action: "View" },
      { id: "bh-doc-3", name: "Compliance Checklist.docx", uploadedBy: "Legal", type: "DOCX", month: "4", action: "View" },
    ],
    notes: [
      { id: "bh-note-1", date: "Apr 18", content: "Pilot partners need white-glove onboarding support.", tags: ["Operations", "Action"] },
      { id: "bh-note-2", date: "Apr 26", content: "Explore co-marketing announcements with supply chain influencers.", tags: ["Growth"] },
      { id: "bh-note-3", date: "May 02", content: "Clarify data residency statements for EU prospects.", tags: ["Compliance"] },
    ],
  },
  lumen: {
    id: "lumen",
    name: "Lumen Ventures",
    brand: "Lumen",
    industry: "Creator Portfolio Advisory",
    started: "February 2025",
    stage: "Month 2 of 8",
    stageSummary: "Market Positioning & Offers",
    stageMonth: "Month 2",
    summary:
      "Advisory collective guiding creators through monetization roadmaps. Currently shaping market positioning and offer ladder.",
    progress: 24,
    currentFocus: "Refining go-to-market narrative and partner outreach assets",
    nextMilestone: "Week 10: Offer stack alignment workshop",
    activities: [
      { id: "lm-1", description: "Published competitor landscape dashboard", date: "3 days ago" },
      { id: "lm-2", description: "Gathered creator testimonials for pitch deck", date: "Last week" },
      { id: "lm-3", description: "Outlined beta community onboarding flow", date: "Last week" },
    ],
    metrics: [
      { label: "Active Sprints", value: "1", hint: "Strategy" },
      { label: "Upcoming Deliverables", value: "3", hint: "Next 30 days" },
      { label: "Last Client Touchpoint", value: "1 week ago", hint: "Quarterly review" },
      { label: "Relationship Health", value: "Watch", hint: "Need to accelerate" },
    ],
    timeline: [
      {
        month: "Month 1",
        focus: "Discovery",
        items: [
          { title: "Kickoff sync", status: "done" },
          { title: "Creator interviews", status: "done" },
          { title: "Competitive analysis", status: "in_progress" },
        ],
      },
      {
        month: "Month 2",
        focus: "Positioning",
        items: [
          { title: "Offer ladder", status: "in_progress" },
          { title: "Messaging pillars", status: "pending" },
          { title: "Community pilot plan", status: "pending" },
        ],
      },
      {
        month: "Month 3",
        focus: "Brand Identity",
        items: [
          { title: "Visual kit", status: "pending" },
          { title: "Landing page", status: "pending" },
          { title: "Outreach assets", status: "pending" },
        ],
      },
    ],
    deliverables: [
      { id: "lm-del-1", title: "Creator Interview Synthesis", type: "PDF", month: "Month 1", status: "Complete", uploadedOn: "Mar 12" },
      { id: "lm-del-2", title: "Positioning Draft", type: "DOC", month: "Month 2", status: "In Review", uploadedOn: "Apr 30" },
      { id: "lm-del-3", title: "Offer Ladder Canvas", type: "FIG", month: "Month 2", status: "Pending" },
    ],
    communication: {
      pinned: [
        "Need clarity on partner revenue targets by next sync",
        "Client prefers weekly digest instead of daily updates",
      ],
      feed: [
        {
          id: "lm-msg-1",
          author: "Jamie Patel",
          role: "Client",
          date: "Apr 28",
          message: "Love the persona insights – let's prioritize the solopreneur cohort first.",
        },
        {
          id: "lm-msg-2",
          author: "Carter Fox",
          role: "Strategist",
          date: "Apr 26",
          message: "Shared offer ladder canvas for feedback. Highlighted pricing scenarios.",
        },
        {
          id: "lm-msg-3",
          author: "Zoey Lin",
          role: "Growth",
          date: "Apr 24",
          message: "Drafted outreach copy for top-tier partners. Awaiting approvals.",
        },
      ],
      internal: [
        "Prep optional creator retreat concept for discussion",
        "Align with finance on revenue share models",
      ],
    },
    documents: [
      { id: "lm-doc-1", name: "Creator Research.pdf", uploadedBy: "Strategy", type: "PDF", month: "1", action: "View" },
      { id: "lm-doc-2", name: "Competitive Landscape.xlsx", uploadedBy: "Research", type: "XLSX", month: "1", action: "Download" },
      { id: "lm-doc-3", name: "Offer Messaging.docx", uploadedBy: "Content", type: "DOCX", month: "2", action: "View" },
    ],
    notes: [
      { id: "lm-note-1", date: "Apr 21", content: "Introduce new community platform options in next deck.", tags: ["Community", "Idea"] },
      { id: "lm-note-2", date: "Apr 27", content: "Need clarity on multi-tier pricing model.", tags: ["Pricing", "Question"] },
    ],
  },
};

const CLIENT_ID_ALIASES: Record<string, keyof typeof CLIENT_DETAILS> = {
  cmhnu685f0001mk3s2vlwnzuk: "acme",
};

export async function getClientDetail(clientId: string) {
  const resolvedId = CLIENT_DETAILS[clientId] ? clientId : CLIENT_ID_ALIASES[clientId];
  if (!resolvedId) {
    return null;
  }

  return CLIENT_DETAILS[resolvedId] ?? null;
}

export async function getClientsSummary() {
  return Object.entries(CLIENT_DETAILS).map(([id, detail]) => {
    const aliasEntry = Object.entries(CLIENT_ID_ALIASES).find(([, target]) => target === id);
    const resolvedId = aliasEntry?.[0] ?? id;

    return {
      id: resolvedId,
      name: detail.name,
      brand: detail.brand,
      industry: detail.industry,
      stage: detail.stage,
      stageSummary: detail.stageSummary,
      progress: detail.progress,
    };
  });
}
