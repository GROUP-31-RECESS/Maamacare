import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {authApi, profileApi, symptomsApi, vitalsApi, wellnessApi, appointmentsApi, medicationsApi, babyMovementApi, emergencyPlanApi, healthRecordApi, postnatalCareApi, supportPeopleApi, syncApi, apiTools, aiApi} from "./services/api";
import {
  Activity,
  Apple,
  ArrowRight,
  Baby,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Droplets,
  Frown,
  FileText,
  Gauge,
  Heart,
  HeartPulse,
  Home,
  ListTodo,
  Target,
  Search,
  Command,
  MessageSquareText,
  Copy,
  Printer,
  HelpCircle,
  IdCard,
  QrCode,
  BadgeCheck,
  Lock,
  LogOut,
  MessageCircle,
  Pill,
  MapPin,
  MapPinned,
  Meh,
  Moon,
  Phone,
  Plus,
  RefreshCw,
  ShieldAlert,
  Siren,
  Smile,
  Smartphone,
  Sparkles,
  Send,
  Settings,
  Thermometer,
  Timeline,
  Trash2,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";

const COLORS = {
  primary: "#1E3A8A",
  secondary: "#38BDF8",
  accent: "#14B8A6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#111827",
};

const defaultMother = {
  name: "Amina",
  phone: "+256 700 000 000",
  week: 24,
  dueDate: "2026-09-18",
  location: "Mukono, Uganda",
  nextANC: "2026-06-12",
  emergencyContact: "+256 700 000 000",
};

function mapApiProfileToMother(profile, fallback = defaultMother) {
  if (!profile) return fallback;

  return {
    ...fallback,
    name: profile.name || profile.full_name || fallback.name,
    phone: profile.phone || fallback.phone,
    week: Number(profile.pregnancyWeek || profile.pregnancy_week || fallback.week),
    dueDate: profile.dueDate || profile.due_date || fallback.dueDate,
    location: profile.location || fallback.location,
    nextANC: profile.nextANC || profile.next_anc_date || fallback.nextANC,
    emergencyContact:
      profile.emergencyContact || profile.emergency_contact || fallback.emergencyContact,
  };
}

function mapMotherToApiProfile({
  name,
  phone,
  week,
  dueDate,
  location,
  nextANC,
  emergencyContact,
}) {
  return {
    name,
    phone,
    pregnancyWeek: Number(week) || 24,
    dueDate,
    location,
    nextANC,
    emergencyContact,
  };
}

function mapSymptomLogToApi(log) {
  return {
    symptoms: log.symptoms || [],
    customSymptoms: log.customAnalyses || [],
    riskLevel: log.risk || "normal",
    analysisNotes: log.customAnalyses || [],
  };
}

function mapVitalsLogToApi(entry) {
  return {
    systolic: entry.systolic === "—" ? null : Number(entry.systolic),
    diastolic: entry.diastolic === "—" ? null : Number(entry.diastolic),
    temperature: entry.temperature === "—" ? null : Number(entry.temperature),
    weightKg: entry.weightKg === "—" ? null : Number(entry.weightKg),
    facility: entry.facility || "",
    babyMovementStatus: entry.movementLabel || entry.movement || null,
    riskLevel: entry.analysis?.level || "normal",
    analysisNotes: entry.analysis?.notes || [],
  };
}

function mapWellnessLogToApi(entry) {
  return {
    mood: entry.moodLabel || entry.mood || null,
    energy: entry.energy || null,
    sleep: entry.sleep || null,
    stress: entry.stress || null,
    note: entry.note || "",
    riskLevel: entry.analysis?.level || "normal",
    analysisNotes: entry.analysis?.notes || [],
  };
}

const babySizes = {
  1: "not yet visible",
  2: "not yet visible",
  3: "smaller than a grain of salt",
  4: "about the size of a poppy seed",
  5: "about the size of a sesame seed",
  6: "about the size of a lentil",
  7: "about the size of a blueberry",
  8: "about the size of a kidney bean",
  9: "about the size of a grape",
  10: "about the size of a strawberry",
  11: "about the size of a fig",
  12: "about the size of a lime",
  13: "about the size of a lemon",
  14: "about the size of a peach",
  15: "about the size of an orange",
  16: "about the size of an avocado",
  17: "about the size of a pear",
  18: "about the size of a sweet potato",
  19: "about the size of a mango",
  20: "about the size of a banana",
  21: "about the size of a carrot",
  22: "about the size of a papaya",
  23: "about the size of a large mango",
  24: "about the size of a maize cob",
  25: "about the size of a cauliflower",
  26: "about the size of a lettuce head",
  27: "about the size of a cabbage",
  28: "about the size of an eggplant",
  29: "about the size of a butternut squash",
  30: "about the size of a large cabbage",
  31: "about the size of a coconut",
  32: "about the size of a squash",
  33: "about the size of a pineapple",
  34: "about the size of a melon",
  35: "about the size of a honeydew melon",
  36: "about the size of a bunch of matooke fingers",
  37: "about the size of a watermelon slice",
  38: "about the size of a small pumpkin",
  39: "about the size of a watermelon",
  40: "about the size of a full-term newborn",
};

const symptoms = [
  { id: "headache", label: "Severe headache", level: "watch" },
  { id: "bleeding", label: "Bleeding", level: "urgent" },
  { id: "swelling", label: "Swollen face or feet", level: "watch" },
  { id: "fever", label: "Fever", level: "watch" },
  { id: "dizzy", label: "Dizziness", level: "watch" },
  { id: "pain", label: "Severe abdominal pain", level: "urgent" },
  { id: "movement", label: "Reduced baby movement", level: "urgent" },
  { id: "vomiting", label: "Repeated vomiting", level: "watch" },
];

const learnCards = [
  {
    title: "Danger signs",
    icon: ShieldAlert,
    text: "Bleeding, convulsions, severe headache, blurred vision, fever, and reduced baby movement need urgent care.",
  },
  {
    title: "ANC visits",
    icon: CalendarDays,
    text: "Regular ANC helps detect problems early and prepares you for safe delivery.",
  },
  {
    title: "Nutrition",
    icon: Apple,
    text: "Eat balanced meals with fruits, vegetables, proteins, iron-rich foods, and enough clean water.",
  },
  {
    title: "Rest and mental health",
    icon: Moon,
    text: "Rest when tired, talk to someone you trust, and seek support when feeling overwhelmed.",
  },
];

const ancChecklist = [
  {
    id: "anc-card",
    title: "Carry your ANC card",
    text: "Your ANC card helps the health worker follow your pregnancy history.",
  },
  {
    id: "questions",
    title: "Write down questions",
    text: "List any symptoms, worries, or changes you want to ask about.",
  },
  {
    id: "transport",
    title: "Plan transport early",
    text: "Arrange how you will reach the health facility before the appointment day.",
  },
  {
    id: "medicine",
    title: "Carry current medicines",
    text: "Carry any medicine or supplements you are currently using.",
  },
  {
    id: "support-person",
    title: "Inform your support person",
    text: "Tell your partner, family member, or friend about the ANC visit.",
  },
];

const birthChecklist = [
  {
    id: "anc-card",
    title: "ANC card and medical notes",
    text: "Keep your ANC card, test results, and any medical notes ready.",
  },
  {
    id: "mother-clothes",
    title: "Comfortable clothes for mother",
    text: "Pack loose clean clothes, wrapper, sweater, and comfortable footwear.",
  },
  {
    id: "baby-clothes",
    title: "Baby clothes",
    text: "Pack baby clothes, baby blanket, socks, cap, and receiving cloth.",
  },
  {
    id: "hygiene",
    title: "Hygiene items",
    text: "Pack sanitary pads, soap, towel, tissue, toothbrush, and clean underwear.",
  },
  {
    id: "transport",
    title: "Transport plan",
    text: "Confirm who will take you to the health facility and keep transport money ready.",
  },
  {
    id: "emergency-contact",
    title: "Emergency contact informed",
    text: "Tell your support person and emergency contact what to do when labor starts.",
  },
  {
    id: "phone",
    title: "Phone and charging",
    text: "Keep your phone charged and save important numbers.",
  },
];

const urgentKeywords = [
  "bleeding",
  "blood",
  "heavy blood",
  "severe pain",
  "sharp pain",
  "abdominal pain",
  "stomach pain",
  "severe stomach",
  "reduced movement",
  "baby not moving",
  "baby stopped moving",
  "no movement",
  "convulsion",
  "convulsions",
  "fits",
  "seizure",
  "blurred vision",
  "cannot see",
  "faint",
  "fainted",
  "unconscious",
  "water broke",
  "water breaking",
  "water has broken",
  "chest pain",
  "difficulty breathing",
  "can't breathe",
  "cannot breathe",
];

const watchKeywords = [
  "headache",
  "swelling",
  "swollen",
  "fever",
  "hot body",
  "dizzy",
  "dizziness",
  "vomiting",
  "nausea",
  "weak",
  "weakness",
  "tired",
  "back pain",
  "leg pain",
  "malaria",
  "cough",
  "diarrhea",
  "heartburn",
  "itching",
  "pain",
  "cramps",
];

const moodOptions = [
  { id: "happy", label: "Happy", icon: Smile },
  { id: "okay", label: "Okay", icon: Meh },
  { id: "sad", label: "Sad", icon: Frown },
  { id: "anxious", label: "Anxious", icon: Brain },
];

const levelOptions = ["Low", "Medium", "High"];


const LANGUAGE_LABELS = {
  English: "English",
  Luganda: "Luganda",
  Swahili: "Swahili",
};

const UI_TRANSLATIONS = {
  Luganda: {
    "Good morning": "Wasuze otya",
    "Home": "Awaka",
    "Tracker": "Okulondoola",
    "Log": "Wandiika",
    "Learn": "Yiga",
    "SOS": "Obuyambi",
    "More": "Ebirala",
    "Settings": "Enteekateeka",
    "Notifications": "Okumanyisa",
    "Notifications & reminders": "Okumanyisa n'okujjukiza",
    "Accessibility and preferences": "Obwangu bw'okukozesa n'ebyo by'oyagala",
    "Font size": "Obunene bw'ebigambo",
    "Drag the slider to increase or decrease text size across the app.": "Sika akabonero okwongeza oba okukendeeza obunene bw'ebigambo mu app.",
    "Preview text": "Ekyokulabirako ky'ebigambo",
    "Appearance": "Endabika",
    "Choose light mode, dark mode, or follow the device system setting.": "Londa light mode, dark mode, oba okugoberera enteekateeka y'essimu/kompyuta.",
    "Light": "Ekitangaala",
    "Dark": "Ekizikiza",
    "System default": "Eky'ebyuma",
    "Contrast and simplified view": "Okulabika obulungi n'endaba ennyangu",
    "High contrast On": "Okulabika okungi Kuliiko",
    "High contrast Off": "Okulabika okungi Kuvuddeko",
    "Simple mode On": "Endaba ennyangu Eriiko",
    "Simple mode Off": "Endaba ennyangu Evuddeko",
    "Notification preference": "Okulonda okumanyisibwa",
    "All reminders": "Okujjukiza kwonna",
    "Important only": "Ebikulu byokka",
    "Emergency only": "Eby'obuyambi bwokka",
    "Language preference": "Olulimi lw'oyagala",
    "Choose the language MamaCare should use across the app.": "Londa olulimi MamaCare lw'eneekozesa mu app yonna.",
    "Emergency display": "Endaga y'obuyambi",
    "Detailed": "Mu bujjuvu",
    "Simple": "Ennyangu",
    "Current settings summary": "Obufunze bw'enteekateeka",
    "Text size": "Obunene bw'ebigambo",
    "Language": "Olulimi",
    "Open notification center": "Ggulawo okumanyisa",
    "Reset settings": "Zzaawo enteekateeka",
    "Profile": "Ebikwata ku ggwe",
    "Logout": "Fuluma",
    "View profile information": "Laba ebikwata ku ggwe",
    "Pregnancy week": "Wiiki y'olubuto",
    "Risk status": "Embeera y'obulabe",
    "Next ANC": "ANC eddako",
    "Today’s maternal tip": "Amagezi ga leero eri maama",
    "Log symptoms": "Wandiika obubonero",
    "Log vitals": "Wandiika ebipimo",
    "Wellness": "Obulamu bw'omutima",
    "Emergency": "Obuyambi obw'amangu",
    "Risk awareness": "Okumanya obulabe",
    "Prepare for ANC": "Weetegekere ANC",
    "Birth preparation": "Okuteekateeka okuzaala",
    "Mother progress dashboard": "Endaga y'enkulaakulana ya maama",
    "Medication reminders": "Okujjukiza eddagala",
    "Daily pregnancy feed": "Amagezi g'olubuto buli lunaku",
    "Baby movement": "Entambula y'omwana",
    "Emergency plan": "Enteekateeka y'obuyambi",
    "Health records": "Ebiwandiiko by'obulamu",
    "Postnatal care": "Okulabirira oluvannyuma lw'okuzaala",
    "Normal": "Bulungi",
    "Watch": "Kuuma amaaso",
    "Urgent": "Ky'amangu",
    "Save Changes": "Tereka enkyukakyuka",
    "Mark read": "Kiteekeko nti kisomeddwa",
    "Mark all as read": "Byonna biteekeko nti bisomeddwa",
    "Open Settings": "Ggulawo enteekateeka",
    "Open Notifications": "Ggulawo okumanyisa"
  },
  Swahili: {
    "Good morning": "Habari za asubuhi",
    "Home": "Nyumbani",
    "Tracker": "Ufuatiliaji",
    "Log": "Rekodi",
    "Learn": "Jifunze",
    "SOS": "Msaada",
    "More": "Zaidi",
    "Settings": "Mipangilio",
    "Notifications": "Arifa",
    "Notifications & reminders": "Arifa na vikumbusho",
    "Accessibility and preferences": "Ufikivu na mapendeleo",
    "Font size": "Ukubwa wa maandishi",
    "Drag the slider to increase or decrease text size across the app.": "Vuta kitelezi kuongeza au kupunguza ukubwa wa maandishi kwenye programu.",
    "Preview text": "Maandishi ya mfano",
    "Appearance": "Mwonekano",
    "Choose light mode, dark mode, or follow the device system setting.": "Chagua mwonekano wa mwanga, giza, au fuata mpangilio wa kifaa.",
    "Light": "Mwanga",
    "Dark": "Giza",
    "System default": "Chaguo la mfumo",
    "Contrast and simplified view": "Kontrasti na mwonekano rahisi",
    "High contrast On": "Kontrasti kubwa Imewashwa",
    "High contrast Off": "Kontrasti kubwa Imezimwa",
    "Simple mode On": "Hali rahisi Imewashwa",
    "Simple mode Off": "Hali rahisi Imezimwa",
    "Notification preference": "Mapendeleo ya arifa",
    "All reminders": "Vikumbusho vyote",
    "Important only": "Muhimu pekee",
    "Emergency only": "Dharura pekee",
    "Language preference": "Lugha unayopendelea",
    "Choose the language MamaCare should use across the app.": "Chagua lugha ambayo MamaCare itatumia kwenye programu yote.",
    "Emergency display": "Mwonekano wa dharura",
    "Detailed": "Kwa kina",
    "Simple": "Rahisi",
    "Current settings summary": "Muhtasari wa mipangilio",
    "Text size": "Ukubwa wa maandishi",
    "Language": "Lugha",
    "Open notification center": "Fungua kituo cha arifa",
    "Reset settings": "Rudisha mipangilio",
    "Profile": "Wasifu",
    "Logout": "Toka",
    "View profile information": "Tazama taarifa za wasifu",
    "Pregnancy week": "Wiki ya ujauzito",
    "Risk status": "Hali ya hatari",
    "Next ANC": "ANC inayofuata",
    "Today’s maternal tip": "Ushauri wa leo kwa mama",
    "Log symptoms": "Rekodi dalili",
    "Log vitals": "Rekodi vipimo",
    "Wellness": "Ustawi",
    "Emergency": "Dharura",
    "Risk awareness": "Ufahamu wa hatari",
    "Prepare for ANC": "Jiandae kwa ANC",
    "Birth preparation": "Maandalizi ya kujifungua",
    "Mother progress dashboard": "Dashibodi ya maendeleo ya mama",
    "Medication reminders": "Vikumbusho vya dawa",
    "Daily pregnancy feed": "Vidokezo vya kila siku vya ujauzito",
    "Baby movement": "Mwendo wa mtoto",
    "Emergency plan": "Mpango wa dharura",
    "Health records": "Rekodi za afya",
    "Postnatal care": "Huduma baada ya kujifungua",
    "Normal": "Kawaida",
    "Watch": "Fuatilia",
    "Urgent": "Haraka",
    "Save Changes": "Hifadhi mabadiliko",
    "Mark read": "Weka kama imesomwa",
    "Mark all as read": "Weka zote kama zimesomwa",
    "Open Settings": "Fungua mipangilio",
    "Open Notifications": "Fungua arifa"
  }
};

function getUILabel(text, language) {
  if (!text || language === "English") return text;
  return UI_TRANSLATIONS[language]?.[text] || text;
}

function applyLanguageToDocument(language) {
  if (typeof document === "undefined") return;

  const code = language === "Luganda" ? "lg" : language === "Swahili" ? "sw" : "en";
  document.documentElement.lang = code;

  const reverseMap = {};
  Object.entries(UI_TRANSLATIONS).forEach(([, entries]) => {
    Object.entries(entries).forEach(([english, translated]) => {
      reverseMap[translated] = english;
    });
  });

  const translateValue = (value) => {
    const english = reverseMap[value] || value;
    return getUILabel(english, language);
  };

  const skipTags = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue.trim();
      if (!text) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const original = node.nodeValue;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const trimmed = original.trim();
    const translated = translateValue(trimmed);
    if (translated !== trimmed) node.nodeValue = `${leading}${translated}${trailing}`;
  });

  document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((element) => {
    ["placeholder", "title", "aria-label"].forEach((attr) => {
      const value = element.getAttribute(attr);
      if (value) element.setAttribute(attr, translateValue(value));
    });
  });
}

const defaultAccessibilitySettings = {
  textSize: 16,
  appearance: "Light",
  contrastMode: false,
  simplifiedMode: false,
  notificationPreference: "Important only",
  reminderMethod: "In-app",
  reminderLeadDays: 7,
  language: "English",
  emergencyDisplay: "Detailed",
};

const defaultSyncSettings = {
  syncMode: "Local only",
  apiBaseUrl: "",
  lastSync: "Never synced",
  deviceLabel: "MamaCare web app",
  autoSyncWhenOnline: false,
};

const defaultEmergencyPlan = {
  nearestFacility: "",
  facilityPhone: "",
  transportName: "",
  transportPhone: "",
  supportPerson: "",
  supportPhone: "",
  emergencyCash: "",
  bloodGroup: "",
  notes: "",
  checklist: [],
};

const defaultSupportPeople = [];

const supportRoles = [
  "Partner",
  "Mother",
  "Sister",
  "Brother",
  "Friend",
  "Transport person",
  "Village health worker",
  "Other",
];

const supportPermissions = [
  "Emergency contact only",
  "Can view clinic summary",
  "Can help with appointments",
  "Can support transport and emergency care",
];

const defaultHealthRecords = {
  ancNumber: "",
  bloodGroup: "",
  allergies: "",
  chronicConditions: "",
  previousPregnancies: "",
  currentFacility: "",
  midwifeDoctor: "",
  scanNotes: "",
  labNotes: "",
  vaccinationNotes: "",
  generalNotes: "",
  updatedAt: "",
};

const defaultPostnatalCare = {
  deliveryDate: "",
  babyName: "",
  deliveryFacility: "",
  birthWeight: "",
  feedingMethod: "Breastfeeding",
  motherBleeding: "Normal",
  motherPain: "Mild",
  motherMood: "Okay",
  babyTemperature: "",
  babyDangerSigns: "",
  nextCheckup: "",
  notes: "",
  checklist: [],
  recoveryLogs: [],
  updatedAt: "",
};

const postnatalChecklist = [
  {
    id: "mother-bleeding",
    title: "Monitor bleeding",
    text: "Heavy bleeding, large clots, dizziness, or weakness after birth needs urgent care.",
  },
  {
    id: "baby-feeding",
    title: "Check baby feeding",
    text: "Track whether the baby is breastfeeding or feeding well and report poor feeding early.",
  },
  {
    id: "baby-temperature",
    title: "Watch baby temperature",
    text: "Fever, very cold body, difficulty breathing, or yellow eyes should be checked urgently.",
  },
  {
    id: "mother-mood",
    title: "Track mother’s mood",
    text: "Persistent sadness, anxiety, hopelessness, or thoughts of self-harm need immediate support.",
  },
  {
    id: "postnatal-checkup",
    title: "Plan postnatal checkup",
    text: "Save the next checkup date for both mother and baby.",
  },
];

const emergencyChecklist = [
  {
    id: "facility",
    title: "Know the nearest health facility",
    text: "Save the facility name and phone number before an emergency happens.",
  },
  {
    id: "transport",
    title: "Confirm transport contact",
    text: "Have a boda, taxi, ambulance, or trusted driver ready for night or day movement.",
  },
  {
    id: "support",
    title: "Inform support person",
    text: "Make sure your partner, relative, or trusted person knows what to do.",
  },
  {
    id: "money",
    title: "Keep emergency cash or mobile money ready",
    text: "Transport delays are common when money is not planned early.",
  },
  {
    id: "documents",
    title: "Keep ANC card and medicines nearby",
    text: "Carry your ANC card, test results, and current medicines when going for care.",
  },
];

const medicationSuggestions = [
  "Iron tablets",
  "Folic acid",
  "Malaria prevention",
  "Calcium supplement",
  "Vitamin supplement",
  "Other medicine",
];

const frequencyOptions = ["Daily", "Twice daily", "Weekly", "As prescribed"];


function mapAppointmentToApi(item) {
  return {
    type: item.type || "ANC",
    date: item.date || "",
    time: item.time || "",
    facility: item.facility || "",
    notes: item.notes || item.note || "",
    status: item.status || "scheduled",
  };
}

function mapMedicationToApi(item) {
  return {
    name: item.name || item.title || "Medication",
    dosage: item.dosage || "",
    frequency: item.frequency || "",
    time: item.time || "",
    notes: item.notes || item.note || "",
    isActive: item.isActive !== false,
    lastTakenAt: item.lastTakenAt || null,
  };
}

function mapBabyMovementToApi(item) {
  return {
    movementCount: Number(item.count || item.movementCount || item.movements || 0),
    movementStatus: item.feeling || item.status || item.movementStatus || item.movementLabel || "",
    riskLevel: item.risk || item.riskLevel || item.analysis?.level || "normal",
    notes: item.notes || item.note || "",
  };
}

function mapEmergencyPlanToApi(plan) {
  return {
    nearestFacility: plan.nearestFacility || plan.facility || "",
    facilityPhone: plan.facilityPhone || "",
    transportPerson: plan.transportPerson || "",
    transportPhone: plan.transportPhone || "",
    supportPerson: plan.supportPerson || "",
    supportPhone: plan.supportPhone || "",
    bloodGroup: plan.bloodGroup || "",
    cashPlan: plan.cashPlan || "",
    medicalNote: plan.medicalNote || plan.note || "",
    checklist: plan.checklist || plan.completedItems || [],
  };
}

function mapHealthRecordToApi(record) {
  return {
    ancNumber: record.ancNumber || record.ancCardNumber || "",
    bloodGroup: record.bloodGroup || "",
    allergies: record.allergies || "",
    knownConditions: record.knownConditions || record.chronicConditions || "",
    previousPregnancyHistory: record.previousPregnancyHistory || record.previousPregnancies || "",
    currentFacility: record.currentFacility || "",
    mainHealthWorker: record.mainHealthWorker || record.midwifeDoctor || "",
    scanNotes: record.scanNotes || "",
    labNotes: record.labNotes || "",
    vaccinationNotes: record.vaccinationNotes || "",
    generalNotes: record.generalNotes || "",
  };
}

function mapPostnatalCareToApi(postnatal) {
  return {
    afterBirthMode: Boolean(postnatal.afterBirthMode),
    deliveryDate: postnatal.deliveryDate || "",
    babyName: postnatal.babyName || "",
    deliveryFacility: postnatal.deliveryFacility || "",
    birthWeight: postnatal.birthWeight || "",
    feedingMethod: postnatal.feedingMethod || "",
    nextCheckup: postnatal.nextCheckup || "",
    latestCheck: postnatal.latestCheck || postnatal.history?.[0] || {},
  };
}

function mapSupportPersonToApi(person) {
  return {
    name: person.name || "",
    relationship: person.relationship || "",
    phone: person.phone || "",
    role: person.role || "",
    allowedSupport: person.allowedSupport || [],
    notes: person.notes || person.note || "",
    isPrimary: Boolean(person.isPrimary),
  };
}

async function safeBackendSync(syncFunction) {
  try {
    const result = await syncFunction();
    return { ok: true, result };
  } catch (error) {
    return { ok: false, error };
  }
}


function mapBackendSymptomToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    date: item.loggedAt ? new Date(item.loggedAt).toLocaleString("en-UG") : formatDateTime(),
    risk: item.riskLevel || "normal",
    symptoms: item.symptoms || [],
    customAnalyses: item.customSymptoms || item.analysisNotes || [],
    syncStatus: "synced",
  };
}

function mapBackendVitalsToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    date: item.loggedAt ? new Date(item.loggedAt).toLocaleString("en-UG") : formatDateTime(),
    systolic: item.systolic ?? "—",
    diastolic: item.diastolic ?? "—",
    temperature: item.temperature ?? "—",
    weightKg: item.weightKg ?? "—",
    facility: item.facility || "",
    movement: item.babyMovementStatus || "normal",
    movementLabel: item.babyMovementStatus || "Normal",
    analysis: {
      level: item.riskLevel || "normal",
      notes: item.analysisNotes || [],
    },
    syncStatus: "synced",
  };
}

function mapBackendWellnessToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    date: item.loggedAt ? new Date(item.loggedAt).toLocaleString("en-UG") : formatDateTime(),
    mood: item.mood || "okay",
    moodLabel: item.mood || "Okay",
    energy: item.energy || "Medium",
    sleep: item.sleep || "Medium",
    stress: item.stress || "Medium",
    note: item.note || "",
    analysis: {
      level: item.riskLevel || "normal",
      notes: item.analysisNotes || [],
    },
    syncStatus: "synced",
  };
}

function mapBackendAppointmentToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    title: item.type || "ANC visit",
    type: item.type || "ANC visit",
    date: item.date || "",
    time: item.time || "08:00",
    facility: item.facility || "",
    notes: item.notes || "",
    status: item.status || "scheduled",
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString("en-UG") : formatDateTime(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

function mapBackendMedicationToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    name: item.name || "Medication",
    dosage: item.dosage || "As prescribed",
    time: item.time || "08:00",
    frequency: item.frequency || "Daily",
    notes: item.notes || "",
    takenHistory: item.lastTakenAt
      ? [new Date(item.lastTakenAt).toLocaleString("en-UG")]
      : [],
    lastTakenAt: item.lastTakenAt || null,
    isActive: item.isActive !== false,
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString("en-UG") : formatDateTime(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

function mapBackendMovementToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    date: item.loggedAt ? new Date(item.loggedAt).toLocaleString("en-UG") : formatDateTime(),
    count: item.movementCount || 0,
    feeling: item.movementStatus || "normal",
    feelingLabel: item.movementStatus || "Normal",
    note: item.notes || "",
    analysis: {
      level: item.riskLevel || "normal",
      notes: item.notes ? [item.notes] : [],
    },
    syncStatus: "synced",
  };
}

function mapBackendEmergencyPlanToLocal(item) {
  if (!item) return null;

  return {
    backendId: item.id,
    nearestFacility: item.nearestFacility || "",
    facilityPhone: item.facilityPhone || "",
    transportName: item.transportPerson || "",
    transportPerson: item.transportPerson || "",
    transportPhone: item.transportPhone || "",
    supportPerson: item.supportPerson || "",
    supportPhone: item.supportPhone || "",
    emergencyCash: item.cashPlan || "",
    bloodGroup: item.bloodGroup || "",
    notes: item.medicalNote || "",
    checklist: item.checklist || [],
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

function mapBackendHealthRecordToLocal(item) {
  if (!item) return null;

  return {
    backendId: item.id,
    ancNumber: item.ancNumber || "",
    bloodGroup: item.bloodGroup || "",
    allergies: item.allergies || "",
    chronicConditions: item.knownConditions || "",
    knownConditions: item.knownConditions || "",
    previousPregnancies: item.previousPregnancyHistory || "",
    previousPregnancyHistory: item.previousPregnancyHistory || "",
    currentFacility: item.currentFacility || "",
    midwifeDoctor: item.mainHealthWorker || "",
    mainHealthWorker: item.mainHealthWorker || "",
    scanNotes: item.scanNotes || "",
    labNotes: item.labNotes || "",
    vaccinationNotes: item.vaccinationNotes || "",
    generalNotes: item.generalNotes || "",
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

function mapBackendPostnatalToLocal(item) {
  if (!item) return null;

  return {
    backendId: item.id,
    afterBirthMode: Boolean(item.afterBirthMode),
    deliveryDate: item.deliveryDate || "",
    babyName: item.babyName || "",
    deliveryFacility: item.deliveryFacility || "",
    birthWeight: item.birthWeight || "",
    feedingMethod: item.feedingMethod || "",
    nextCheckup: item.nextCheckup || "",
    latestCheck: item.latestCheck || {},
    recoveryLogs: item.latestCheck ? [item.latestCheck] : [],
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

function mapBackendSupportPersonToLocal(item) {
  return {
    id: item.id || Date.now(),
    backendId: item.id,
    name: item.name || "Support person",
    relationship: item.relationship || "",
    role: item.role || "",
    phone: item.phone || "",
    permission: Array.isArray(item.allowedSupport)
      ? item.allowedSupport[0] || ""
      : "",
    allowedSupport: item.allowedSupport || [],
    notes: item.notes || "",
    isPrimary: Boolean(item.isPrimary),
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-UG") : formatDateTime(),
    syncStatus: "synced",
  };
}

async function loadBackendDataAfterLogin(profileFromLogin, fallbackMother = defaultMother) {
  const loadedMother = mapApiProfileToMother(profileFromLogin, fallbackMother);

  const results = await Promise.allSettled([
    profileApi.get(),
    symptomsApi.list(),
    vitalsApi.list(),
    wellnessApi.list(),
    appointmentsApi.list(),
    medicationsApi.list(),
    babyMovementApi.list(),
    emergencyPlanApi.get(),
    healthRecordApi.get(),
    postnatalCareApi.get(),
    supportPeopleApi.list(),
  ]);

  const [
    profileResult,
    symptomsResult,
    vitalsResult,
    wellnessResult,
    appointmentsResult,
    medicationsResult,
    movementResult,
    emergencyResult,
    healthRecordResult,
    postnatalResult,
    supportPeopleResult,
  ] = results;

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : profileFromLogin;

  const mother = mapApiProfileToMother(profile, loadedMother);

  localStorage.setItem("mamacare_mother", JSON.stringify(mother));

  if (symptomsResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_symptom_history",
      JSON.stringify((symptomsResult.value || []).map(mapBackendSymptomToLocal))
    );
  }

  if (vitalsResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_vitals_history",
      JSON.stringify((vitalsResult.value || []).map(mapBackendVitalsToLocal))
    );
  }

  if (wellnessResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_wellness_history",
      JSON.stringify((wellnessResult.value || []).map(mapBackendWellnessToLocal))
    );
  }

  if (appointmentsResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_appointments",
      JSON.stringify((appointmentsResult.value || []).map(mapBackendAppointmentToLocal))
    );
  }

  if (medicationsResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_medications",
      JSON.stringify((medicationsResult.value || []).map(mapBackendMedicationToLocal))
    );
  }

  if (movementResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_movement_history",
      JSON.stringify((movementResult.value || []).map(mapBackendMovementToLocal))
    );
  }

  if (emergencyResult.status === "fulfilled" && emergencyResult.value) {
    const plan = mapBackendEmergencyPlanToLocal(emergencyResult.value);
    if (plan) {
      localStorage.setItem("mamacare_emergency_plan", JSON.stringify(plan));
    }
  }

  if (healthRecordResult.status === "fulfilled" && healthRecordResult.value) {
    const record = mapBackendHealthRecordToLocal(healthRecordResult.value);
    if (record) {
      localStorage.setItem("mamacare_health_records", JSON.stringify(record));
    }
  }

  if (postnatalResult.status === "fulfilled" && postnatalResult.value) {
    const postnatal = mapBackendPostnatalToLocal(postnatalResult.value);
    if (postnatal) {
      localStorage.setItem("mamacare_postnatal_care", JSON.stringify(postnatal));
    }
  }

  if (supportPeopleResult.status === "fulfilled") {
    localStorage.setItem(
      "mamacare_support_people",
      JSON.stringify((supportPeopleResult.value || []).map(mapBackendSupportPersonToLocal))
    );
  }

  return mother;
}


function getPendingSyncSummary() {
  const collections = [
    { key: "mamacare_symptom_history", label: "Symptoms" },
    { key: "mamacare_vitals_history", label: "Vitals" },
    { key: "mamacare_wellness_history", label: "Wellness" },
    { key: "mamacare_appointments", label: "Appointments" },
    { key: "mamacare_medications", label: "Medication reminders" },
    { key: "mamacare_movement_history", label: "Baby movement" },
    { key: "mamacare_support_people", label: "Support people" },
  ];

  const rows = collections.map((collection) => {
    const items = JSON.parse(localStorage.getItem(collection.key) || "[]");
    const pendingItems = Array.isArray(items)
      ? items.filter((item) => item.syncStatus === "pending" || !item.backendId)
      : [];

    return {
      ...collection,
      count: pendingItems.length,
    };
  });

  const singleRecords = [
    { key: "mamacare_emergency_plan", label: "Emergency plan" },
    { key: "mamacare_health_records", label: "Health records" },
    { key: "mamacare_postnatal_care", label: "Postnatal care" },
  ].map((collection) => {
    const item = JSON.parse(localStorage.getItem(collection.key) || "null");
    return {
      ...collection,
      count: item && (item.syncStatus === "pending" || !item.backendId) ? 1 : 0,
    };
  });

  return [...rows, ...singleRecords];
}

function getTotalPendingSyncCount() {
  return getPendingSyncSummary().reduce((sum, item) => sum + Number(item.count || 0), 0);
}

async function syncPendingLocalData() {
  const results = [];

  async function syncArrayCollection(storageKey, api, mapper, label) {
    const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(items)) return;

    const nextItems = [];

    for (const item of items) {
      if (item.syncStatus === "synced" && item.backendId) {
        nextItems.push(item);
        continue;
      }

      const sync = await safeBackendSync(() =>
        item.backendId ? api.update(item.backendId, mapper(item)) : api.create(mapper(item))
      );

      if (sync.ok) {
        nextItems.push({
          ...item,
          backendId: sync.result.id,
          syncStatus: "synced",
        });
        results.push({ label, ok: true });
      } else {
        nextItems.push({
          ...item,
          syncStatus: "pending",
        });
        results.push({ label, ok: false });
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(nextItems));
  }

  async function syncSingleRecord(storageKey, api, mapper, label) {
    const item = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!item) return;

    if (item.syncStatus === "synced" && item.backendId) return;

    const sync = await safeBackendSync(() => api.update(mapper(item)));

    if (sync.ok) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...item,
          backendId: sync.result.id,
          syncStatus: "synced",
        })
      );
      results.push({ label, ok: true });
    } else {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...item,
          syncStatus: "pending",
        })
      );
      results.push({ label, ok: false });
    }
  }

  await syncArrayCollection("mamacare_symptom_history", symptomsApi, mapSymptomLogToApi, "Symptoms");
  await syncArrayCollection("mamacare_vitals_history", vitalsApi, mapVitalsLogToApi, "Vitals");
  await syncArrayCollection("mamacare_wellness_history", wellnessApi, mapWellnessLogToApi, "Wellness");
  await syncArrayCollection("mamacare_appointments", appointmentsApi, mapAppointmentToApi, "Appointments");
  await syncArrayCollection("mamacare_medications", medicationsApi, mapMedicationToApi, "Medication reminders");
  await syncArrayCollection("mamacare_movement_history", babyMovementApi, mapBabyMovementToApi, "Baby movement");
  await syncArrayCollection("mamacare_support_people", supportPeopleApi, mapSupportPersonToApi, "Support people");

  await syncSingleRecord("mamacare_emergency_plan", emergencyPlanApi, mapEmergencyPlanToApi, "Emergency plan");
  await syncSingleRecord("mamacare_health_records", healthRecordApi, mapHealthRecordToApi, "Health records");
  await syncSingleRecord("mamacare_postnatal_care", postnatalCareApi, mapPostnatalCareToApi, "Postnatal care");

  return results;
}

function getWeeklyGuide(week) {
  const safeWeek = Math.min(Math.max(Number(week) || 24, 1), 40);

  if (safeWeek <= 4) {
    return {
      baby:
        "Pregnancy is still very early. The body is preparing for implantation and early development.",
      mother:
        "You may not feel pregnant yet, or you may notice a missed period, tiredness, or breast tenderness.",
      tip:
        "Start healthy habits early. Take folic acid if available and avoid alcohol, smoking, and unsafe medicines.",
      warning:
        "Seek care urgently if you have heavy bleeding, severe one-sided pain, fainting, or severe abdominal pain.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 8) {
    return {
      baby:
        "The baby’s early brain, spinal cord, heart, and major organs are starting to form.",
      mother:
        "You may feel nausea, tiredness, smell sensitivity, mood changes, or breast tenderness.",
      tip:
        "Book your first ANC visit early, eat small meals, drink clean water, and discuss medicines with a health worker.",
      warning:
        "Persistent vomiting, bleeding, high fever, severe abdominal pain, or fainting needs urgent care.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 12) {
    return {
      baby:
        "The baby is becoming more formed, with organs, fingers, toes, and early movement developing.",
      mother:
        "Nausea may continue, but some mothers begin feeling slightly better toward the end of this stage.",
      tip:
        "Attend ANC and ask about blood pressure, supplements, blood tests, and your next appointment date.",
      warning:
        "Bleeding, severe pain, dizziness, fever, or fainting should be checked by a health worker.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 16) {
    return {
      baby:
        "The baby is growing quickly, bones are strengthening, and small movements are becoming more developed.",
      mother:
        "You may feel more energetic, and your belly may become more noticeable.",
      tip:
        "Continue ANC, eat iron-rich foods, walk gently if allowed, and keep tracking unusual symptoms.",
      warning:
        "Swelling of the face, severe headache, blurred vision, bleeding, or severe pain needs medical attention.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 20) {
    return {
      baby:
        "The baby’s hearing and movement are improving. Around this stage, you may begin feeling movements more clearly.",
      mother:
        "You may feel stretching, back pain, bloating, or early baby movements.",
      tip:
        "Start noticing your baby’s movement pattern and keep your ANC appointment dates.",
      warning:
        "Reduced movement, bleeding, fever, severe pain, or severe headache should be reported.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 24) {
    return {
      baby:
        "Your baby is growing stronger, becoming more active, and may respond to sound.",
      mother:
        "You may notice stronger kicks, back pain, leg cramps, mild swelling, or more belly pressure.",
      tip:
        "Drink enough clean water, eat balanced meals, and continue attending ANC visits.",
      warning:
        "Seek care urgently for bleeding, severe headache, blurred vision, swelling of face/hands, fever, or reduced baby movement.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 28) {
    return {
      baby:
        "The baby’s brain, lungs, eyes, and body strength are developing quickly as you approach the third trimester.",
      mother:
        "You may feel stronger movement, tiredness, mild shortness of breath, or more body pressure.",
      tip:
        "ANC visits become very important now. Ask about blood pressure, baby growth, and danger signs.",
      warning:
        "Reduced movement, bleeding, severe headache, blurred vision, swelling, chest pain, or severe abdominal pain needs urgent care.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 32) {
    return {
      baby:
        "The baby continues gaining weight and movements may feel stronger and more regular.",
      mother:
        "You may feel tired, have heartburn, leg cramps, back pain, or Braxton Hicks contractions.",
      tip:
        "Prepare questions for ANC, sleep on your side, rest often, and begin planning your hospital bag.",
      warning:
        "Regular painful contractions, bleeding, water breaking, reduced movement, severe headache, or blurred vision needs urgent care.",
      babySize: babySizes[safeWeek],
    };
  }

  if (safeWeek <= 36) {
    return {
      baby:
        "The baby is gaining final weight and may begin moving lower into the pelvis.",
      mother:
        "You may feel pelvic pressure, tiredness, discomfort when sleeping, or more frequent practice contractions.",
      tip:
        "Confirm your delivery facility, emergency transport plan, support person, ANC card, and hospital bag.",
      warning:
        "Bleeding, water breaking, severe pain, severe headache, convulsions, or reduced baby movement is urgent.",
      babySize: babySizes[safeWeek],
    };
  }

  return {
    baby:
      "The baby is close to birth size and may arrive soon. Some pregnancies reach or pass 40 weeks.",
    mother:
      "You may notice labor signs such as regular contractions, pressure, back pain, or water breaking.",
    tip:
      "Keep your phone charged, hospital bag ready, ANC card nearby, and emergency contact informed.",
    warning:
      "Go to a health facility urgently for bleeding, water breaking, reduced baby movement, severe headache, convulsions, or strong regular contractions.",
    babySize: babySizes[safeWeek],
  };
}


function getDailyTips(week) {
  const safeWeek = Math.min(Math.max(Number(week) || 24, 1), 40);
  const trimester = safeWeek <= 13 ? "first" : safeWeek <= 27 ? "second" : "third";

  const baseTips = [
    {
      id: "hydration",
      category: "Daily care",
      title: "Drink clean water regularly",
      icon: Droplets,
      text: "Pregnancy increases your body’s need for fluids. Try to drink clean safe water throughout the day, especially when it is hot or when you feel tired.",
      action: "Keep a bottle nearby and sip often.",
    },
    {
      id: "danger-signs",
      category: "Safety",
      title: "Know the danger signs",
      icon: ShieldAlert,
      text: "Bleeding, severe headache, blurred vision, reduced baby movement, convulsions, high fever, severe abdominal pain, or difficulty breathing should be treated as urgent.",
      action: "Use Emergency Help or go to a health facility if any danger sign appears.",
    },
    {
      id: "balanced-meal",
      category: "Nutrition",
      title: "Build a balanced plate",
      icon: Apple,
      text: "Include energy foods, proteins, vegetables, fruits, and iron-rich foods where possible. Balanced meals support both the mother and the growing baby.",
      action: "Add one protein and one fruit or vegetable to your next meal.",
    },
    {
      id: "anc-preparation",
      category: "ANC",
      title: "Prepare before your ANC visit",
      icon: ClipboardList,
      text: "Carry your ANC card, write down questions, note any symptoms, and plan transport early so you do not miss important checks.",
      action: "Open your ANC checklist and tick what is ready.",
    },
    {
      id: "mental-wellness",
      category: "Wellness",
      title: "Your mood also matters",
      icon: Smile,
      text: "Pregnancy can affect mood, sleep, and stress. Feeling low or anxious repeatedly is worth discussing with someone you trust or a health worker.",
      action: "Log your wellness today.",
    },
  ];

  const stageTips = {
    first: [
      {
        id: "early-anc",
        category: "First trimester",
        title: "Book ANC early",
        icon: CalendarDays,
        text: "Early ANC helps confirm pregnancy progress, check blood pressure, discuss supplements, and identify risks early.",
        action: "Set your first or next ANC appointment.",
      },
      {
        id: "nausea-care",
        category: "First trimester",
        title: "Manage nausea gently",
        icon: Heart,
        text: "Small frequent meals, enough fluids, and avoiding strong smells may help with nausea. Seek care if vomiting becomes persistent.",
        action: "Log vomiting or weakness if it happens.",
      },
    ],
    second: [
      {
        id: "movement-awareness",
        category: "Second trimester",
        title: "Start noticing baby movement",
        icon: Baby,
        text: "Around the middle of pregnancy, many mothers begin feeling baby movements more clearly. Learning your baby’s pattern helps you notice changes.",
        action: "Log baby movement under Vitals.",
      },
      {
        id: "blood-pressure-check",
        category: "Second trimester",
        title: "Keep checking blood pressure",
        icon: HeartPulse,
        text: "High blood pressure can become dangerous in pregnancy. Regular checks during ANC or at home help detect warning signs early.",
        action: "Record your latest blood pressure if you have it.",
      },
    ],
    third: [
      {
        id: "birth-plan",
        category: "Third trimester",
        title: "Prepare your birth plan early",
        icon: Baby,
        text: "Plan your delivery facility, emergency contact, transport, hospital bag, and support person before labor starts.",
        action: "Open Birth preparation and tick your ready items.",
      },
      {
        id: "movement-urgent",
        category: "Third trimester",
        title: "Reduced baby movement is urgent",
        icon: ShieldAlert,
        text: "If the baby moves much less than usual or stops moving, do not wait. This can be a danger sign and needs immediate care.",
        action: "Use Emergency Help if movement is reduced.",
      },
    ],
  };

  return [...stageTips[trimester], ...baseTips];
}

function getTodayTip(week) {
  const tips = getDailyTips(week);
  const dayIndex = new Date().getDate() % tips.length;
  return tips[dayIndex];
}

function analyzeCustomSymptom(text) {
  const symptomText = text.toLowerCase().trim();

  if (!symptomText) {
    return {
      level: "normal",
      reason: "No custom symptom entered.",
    };
  }

  const urgentMatch = urgentKeywords.find((keyword) =>
    symptomText.includes(keyword)
  );

  if (urgentMatch) {
    return {
      level: "urgent",
      reason:
        "Your typed symptom includes a possible danger sign. Please seek medical care urgently or use Emergency Help.",
    };
  }

  const watchMatch = watchKeywords.find((keyword) =>
    symptomText.includes(keyword)
  );

  if (watchMatch) {
    return {
      level: "watch",
      reason:
        "Your typed symptom may need monitoring. Contact a health worker if it continues, worsens, or comes with other danger signs.",
    };
  }

  return {
    level: "normal",
    reason:
      "MamaCare did not detect a major danger keyword, but continue monitoring and seek care if you feel unsafe.",
  };
}

function analyzeVitals({ systolic, diastolic, temperature, movement }) {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  const temp = Number(temperature);
  const notes = [];
  let level = "normal";

  if (sys >= 160 || dia >= 110) {
    level = "urgent";
    notes.push(
      "Very high blood pressure was entered. This may be dangerous in pregnancy and needs urgent medical attention."
    );
  } else if (sys >= 140 || dia >= 90) {
    level = "watch";
    notes.push(
      "Blood pressure is above the common normal range. It should be checked by a health worker."
    );
  }

  if (temp >= 39) {
    level = "urgent";
    notes.push(
      "Very high temperature was entered. Fever in pregnancy should be checked urgently."
    );
  } else if (temp >= 38 && level !== "urgent") {
    level = level === "normal" ? "watch" : level;
    notes.push(
      "Temperature is high. Monitor it and contact a health worker if it continues."
    );
  }

  if (movement === "reduced") {
    level = "urgent";
    notes.push(
      "Reduced baby movement can be a danger sign. Seek medical care urgently."
    );
  } else if (movement === "less" && level !== "urgent") {
    level = level === "normal" ? "watch" : level;
    notes.push(
      "Baby movement is less than usual. Keep monitoring and contact a health worker if it continues."
    );
  }

  if (notes.length === 0) {
    notes.push(
      "No major danger sign was detected from the entered vitals, but continue monitoring and attend ANC."
    );
  }

  return { level, notes };
}

function analyzeWellness({ mood, energy, sleep, stress, note }) {
  let level = "normal";
  const notes = [];
  const noteText = note.toLowerCase();

  if (mood === "sad" || mood === "anxious") {
    level = "watch";
    notes.push(
      "Your mood may need attention. Pregnancy can affect emotions, and support is important."
    );
  }

  if (stress === "High") {
    level = "watch";
    notes.push(
      "High stress was recorded. Try to rest, talk to someone you trust, and seek support if it continues."
    );
  }

  if (sleep === "Low") {
    level = level === "normal" ? "watch" : level;
    notes.push(
      "Low sleep can affect your wellbeing. Rest when possible and mention it during ANC if it continues."
    );
  }

  if (energy === "Low") {
    level = level === "normal" ? "watch" : level;
    notes.push(
      "Low energy was recorded. Continued weakness should be discussed with a health worker."
    );
  }

  if (
    noteText.includes("hopeless") ||
    noteText.includes("harm myself") ||
    noteText.includes("suicide") ||
    noteText.includes("want to die")
  ) {
    level = "urgent";
    notes.push(
      "Your note suggests serious emotional distress. Please seek immediate help from a trusted person, health worker, or emergency support."
    );
  }

  if (notes.length === 0) {
    notes.push(
      "Your wellness check looks stable. Keep resting, eating well, and tracking your wellbeing."
    );
  }

  return { level, notes };
}

function analyzeMovementSession({ count, feeling }) {
  const movementCount = Number(count) || 0;
  const notes = [];
  let level = "normal";

  if (feeling === "none") {
    level = "urgent";
    notes.push(
      "No baby movement was reported. This can be a danger sign and should be checked urgently."
    );
  } else if (feeling === "less") {
    level = "watch";
    notes.push(
      "Baby movement feels less than usual. Continue counting and contact a health worker if it remains reduced."
    );
  }

  if (movementCount >= 10) {
    notes.push(
      "You reached 10 movements. This is a reassuring movement check for this counting session."
    );
  } else if (movementCount > 0 && level !== "urgent") {
    level = level === "normal" ? "watch" : level;
    notes.push(
      "Fewer than 10 movements were counted in this session. Keep monitoring and seek care if movement remains low."
    );
  } else if (movementCount === 0 && feeling === "normal") {
    notes.push(
      "Start counting baby movements. Tap Count Movement each time you feel a kick, roll, or movement."
    );
  }

  if (notes.length === 0) {
    notes.push(
      "Movement check saved. Continue learning your baby’s normal movement pattern."
    );
  }

  return { level, notes };
}

function getCombinedRisk(
  selectedSymptomIds,
  customSymptomTexts,
  latestVitals,
  latestWellness,
  latestMovement
) {
  const selectedPredefined = symptoms.filter((s) =>
    selectedSymptomIds.includes(s.id)
  );

  const customAnalyses = customSymptomTexts.map((item) =>
    analyzeCustomSymptom(item)
  );

  const hasUrgentPredefined = selectedPredefined.some(
    (item) => item.level === "urgent"
  );

  const hasWatchPredefined = selectedPredefined.some(
    (item) => item.level === "watch"
  );

  const hasUrgentCustom = customAnalyses.some(
    (item) => item.level === "urgent"
  );

  const hasWatchCustom = customAnalyses.some((item) => item.level === "watch");

  if (
    hasUrgentPredefined ||
    hasUrgentCustom ||
    latestVitals?.analysis?.level === "urgent" ||
    latestWellness?.analysis?.level === "urgent" ||
    latestMovement?.analysis?.level === "urgent"
  ) {
    return "urgent";
  }

  if (
    hasWatchPredefined ||
    hasWatchCustom ||
    latestVitals?.analysis?.level === "watch" ||
    latestWellness?.analysis?.level === "watch" ||
    latestMovement?.analysis?.level === "watch"
  ) {
    return "watch";
  }

  return "normal";
}

function generateAIInsight({
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory = [],
  risk,
  mother,
}) {
  const predefinedLabels = selectedSymptoms.map(
    (id) => symptoms.find((item) => item.id === id)?.label || id
  );

  const customLabels = customSymptoms.map((item) => item.text);
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];

  const parts = [];

  if (predefinedLabels.length > 0 || customLabels.length > 0) {
    parts.push(`Symptoms: ${[...predefinedLabels, ...customLabels].join(", ")}`);
  }

  if (latestVitals) {
    parts.push(
      `Latest vitals: BP ${latestVitals.systolic}/${latestVitals.diastolic}, temperature ${latestVitals.temperature}°C, baby movement: ${latestVitals.movementLabel}`
    );
  }

  if (latestMovement) {
    parts.push(
      `Movement counter: ${latestMovement.count} movements, feeling: ${latestMovement.feelingLabel}`
    );
  }

  if (latestWellness) {
    parts.push(
      `Wellness: mood ${latestWellness.moodLabel}, energy ${latestWellness.energy}, sleep ${latestWellness.sleep}, stress ${latestWellness.stress}`
    );
  }

  const summary =
    parts.length > 0
      ? `${parts.join(". ")}.`
      : "Log symptoms, vitals, baby movement, or wellness and MamaCare will generate a simple AI-style insight.";

  let whyItMatters =
    "This insight uses pregnancy week, symptoms, vitals, baby movement, and wellness history.";

  let action =
    "Keep tracking how you feel and attend your ANC visits as planned.";

  if (risk === "urgent") {
    whyItMatters =
      "One or more symptoms, vitals, baby movement signs, or wellness notes may need urgent attention. Bleeding, reduced baby movement, very high blood pressure, high fever, severe pain, breathing difficulty, or serious emotional distress should not be delayed.";
    action =
      "Use Emergency Help, contact a trusted person, or go to the nearest health facility immediately.";
  } else if (risk === "watch") {
    whyItMatters =
      "Some symptoms, vitals, or wellness patterns may need monitoring, especially if they continue, worsen, or appear together.";
    action =
      "Monitor closely and contact a health worker if the issue continues or worsens.";
  } else {
    whyItMatters =
      "No major danger sign has been detected from the current data, but pregnancy conditions can change.";
    action =
      "Continue logging symptoms, vitals, baby movement, and wellness so patterns can be noticed early.";
  }

  if (mother.week >= 28 && risk !== "normal") {
    whyItMatters +=
      " Since you are in the third trimester, reduced baby movement, bleeding, severe headache, blurred vision, high blood pressure, or severe pain should be treated with extra caution.";
  }

  const recentSymptoms = symptomHistory
    .slice(0, 5)
    .flatMap((log) => log.symptoms || []);

  const frequency = recentSymptoms.reduce((acc, symptom) => {
    acc[symptom] = (acc[symptom] || 0) + 1;
    return acc;
  }, {});

  const repeatedSymptoms = Object.entries(frequency)
    .filter(([, count]) => count >= 2)
    .map(([symptom, count]) => `${symptom} (${count} times)`);

  const repeatedStress =
    wellnessHistory.filter((item) => item.stress === "High").length >= 2;

  let pattern =
    repeatedSymptoms.length > 0
      ? `Pattern noticed: ${repeatedSymptoms.join(", ")} appeared repeatedly in recent symptom history.`
      : "No repeated symptom pattern has been detected from recent saved logs yet.";

  if (repeatedStress) {
    pattern +=
      " MamaCare also noticed repeated high stress in your wellness history.";
  }

  return {
    summary,
    whyItMatters,
    pattern,
    action,
  };
}


function generateMamaCareChatReply({ question, mother, risk, vitalsHistory, wellnessHistory, movementHistory, symptomHistory, healthRecords, emergencyPlan, postnatalCare }) {
  const text = question.toLowerCase().trim();
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];
  const latestSymptoms = symptomHistory[0];
  const postnatalSummary = getPostnatalSummary(postnatalCare);

  const dangerWords = [
    "bleeding",
    "blood",
    "severe pain",
    "reduced movement",
    "baby not moving",
    "no movement",
    "convulsion",
    "fits",
    "blurred vision",
    "can't breathe",
    "cannot breathe",
    "chest pain",
    "fainted",
    "water broke",
    "suicide",
    "harm myself",
  ];

  const hasDangerWord = dangerWords.some((word) => text.includes(word));

  if (hasDangerWord || risk === "urgent") {
    return {
      level: "urgent",
      title: "Please treat this as urgent",
      message:
        "Your question or latest saved data mentions a possible danger sign. Please use Emergency Help, contact your emergency contact or support person, or go to the nearest health facility immediately. MamaCare cannot diagnose you, but danger signs should not be delayed.",
      action: emergencyPlan?.nearestFacility
        ? `Nearest saved facility: ${emergencyPlan.nearestFacility}. Transport/contact plan: ${emergencyPlan.transportPhone || emergencyPlan.supportPhone || mother.emergencyContact}.`
        : `Call your emergency contact: ${mother.emergencyContact}.`,
    };
  }

  if (text.includes("blood pressure") || text.includes("bp") || text.includes("pressure")) {
    return {
      level: latestVitals?.analysis?.level || "normal",
      title: "Blood pressure guidance",
      message:
        latestVitals
          ? `Your latest saved BP is ${latestVitals.systolic}/${latestVitals.diastolic}. MamaCare marks it as ${latestVitals.analysis.level}. In pregnancy, high blood pressure should be checked by a health worker, especially if it comes with headache, blurred vision, swelling, chest pain, or pain under the ribs.`
          : "You have not saved a BP reading yet. Use Log Vitals to record systolic and diastolic pressure. If you feel severe headache, blurred vision, swelling, chest pain, or faintness, seek care urgently.",
      action: "Open Log Vitals and keep your readings for ANC review.",
    };
  }

  if (text.includes("movement") || text.includes("kick") || text.includes("baby moving")) {
    return {
      level: latestMovement?.analysis?.level || "normal",
      title: "Baby movement guidance",
      message:
        latestMovement
          ? `Your latest movement check recorded ${latestMovement.count} movement(s), feeling: ${latestMovement.feelingLabel}. If baby movement is reduced or stops, go for care urgently.`
          : "Use Baby Movement Counter to count kicks, rolls, and stretches. If the baby is moving much less than usual or not moving, seek care urgently.",
      action: "Open Baby Movement Counter and save a movement check.",
    };
  }

  if (text.includes("medicine") || text.includes("tablet") || text.includes("folic") || text.includes("iron")) {
    return {
      level: "normal",
      title: "Medication reminder guidance",
      message:
        "For pregnancy medicines and supplements like iron or folic acid, follow the dosage given by your health worker. MamaCare can help you save reminders, but it should not replace medical instructions.",
      action: "Open Medication reminders to add dosage, time, and frequency.",
    };
  }

  if (text.includes("stress") || text.includes("sad") || text.includes("anxious") || text.includes("mood") || text.includes("sleep")) {
    return {
      level: latestWellness?.analysis?.level || "watch",
      title: "Mother wellness guidance",
      message:
        latestWellness
          ? `Your latest wellness log shows mood: ${latestWellness.moodLabel}, sleep: ${latestWellness.sleep}, stress: ${latestWellness.stress}. Continued sadness, anxiety, poor sleep, or high stress should be shared with someone you trust or a health worker.`
          : "Pregnancy can affect mood, energy, and sleep. Log your wellness so patterns can be noticed early. If you feel unsafe or emotionally overwhelmed, talk to a trusted person or health worker immediately.",
      action: "Open Wellness and save today’s mood, sleep, energy, and stress level.",
    };
  }

  if (text.includes("anc") || text.includes("appointment") || text.includes("clinic")) {
    return {
      level: "normal",
      title: "ANC visit guidance",
      message:
        `You are currently around Week ${mother.week}. ANC visits help check blood pressure, baby growth, danger signs, nutrition, and birth readiness. Carry your ANC card and write down questions before you go.`,
      action: "Open Prepare for ANC to add or review appointments and checklist items.",
    };
  }

  if (text.includes("birth") || text.includes("delivery") || text.includes("labor") || text.includes("labour")) {
    return {
      level: "watch",
      title: "Birth preparation guidance",
      message:
        "Prepare your ANC card, hospital bag, transport plan, support person, and emergency cash or mobile money plan before labor starts. Go to the facility if contractions are strong and regular, water breaks, bleeding starts, or baby movement reduces.",
      action: "Open Birth preparation and Emergency plan to confirm readiness.",
    };
  }

  if (text.includes("after birth") || text.includes("postnatal") || text.includes("newborn") || text.includes("breastfeed")) {
    return {
      level: postnatalSummary.badge || "normal",
      title: "Postnatal care guidance",
      message:
        "After birth, track mother bleeding, pain, mood, baby temperature, feeding, and newborn danger signs. Seek urgent care if the baby has fever, poor feeding, difficulty breathing, yellow eyes, convulsions, or if the mother has heavy bleeding or severe pain.",
      action: "Open Postnatal care to save a recovery and newborn check.",
    };
  }

  if (text.includes("record") || text.includes("blood group") || text.includes("allergy") || text.includes("scan") || text.includes("lab")) {
    return {
      level: "normal",
      title: "Health records guidance",
      message:
        healthRecords?.ancNumber || healthRecords?.bloodGroup
          ? `Your saved records include ANC No: ${healthRecords.ancNumber || "not added"}, blood group: ${healthRecords.bloodGroup || "not added"}, allergies: ${healthRecords.allergies || "not added"}. Keep these updated for emergency and ANC use.`
          : "You can save ANC number, blood group, allergies, conditions, scan notes, lab notes, and facility details in Health records.",
      action: "Open Health records and update any missing information.",
    };
  }

  return {
    level: risk || "normal",
    title: "MamaCare guidance",
    message:
      `I can guide you using your saved pregnancy data. You are around Week ${mother.week}. Ask about symptoms, BP, baby movement, ANC, medicine, birth preparation, emergency plan, records, wellness, or postnatal care. For severe symptoms, do not wait for the app; seek medical care immediately.`,
    action:
      latestSymptoms
        ? `Your latest symptom log: ${latestSymptoms.symptoms.join(", ")}. Current risk status: ${risk}.`
        : `Current risk status: ${risk}. Start by logging symptoms, vitals, or baby movement if you feel unwell.`,
  };
}

function getRiskExplanation(risk) {
  if (risk === "urgent") {
    return {
      title: "Urgent risk",
      meaning:
        "MamaCare has detected one or more possible danger signs from symptoms, vitals, baby movement, or wellness notes.",
      action:
        "Use Emergency Help, call your emergency contact, talk to a trusted person, or go to the nearest health facility immediately.",
    };
  }

  if (risk === "watch") {
    return {
      title: "Watch risk",
      meaning:
        "MamaCare has detected symptoms, vitals, baby movement, or wellness patterns that may need monitoring.",
      action:
        "Monitor the issue and contact a health worker if it continues or worsens.",
    };
  }

  return {
    title: "Normal risk",
    meaning:
      "MamaCare has not detected a major danger sign from the current symptoms, latest vitals, or latest wellness log.",
    action:
      "Continue tracking how you feel, attend ANC visits, and seek care if you feel unsafe.",
  };
}

function analyzePostnatalCare({ motherBleeding, motherPain, motherMood, babyTemperature, babyDangerSigns }) {
  const notes = [];
  let level = "normal";
  const dangerText = (babyDangerSigns || "").toLowerCase();
  const temp = Number(babyTemperature);

  if (motherBleeding === "Heavy") {
    level = "urgent";
    notes.push("Heavy bleeding after birth can be dangerous. Seek urgent care immediately.");
  } else if (motherBleeding === "More than usual") {
    level = "watch";
    notes.push("Bleeding is more than usual. Monitor closely and contact a health worker if it increases.");
  }

  if (motherPain === "Severe") {
    level = "urgent";
    notes.push("Severe pain after birth should be checked urgently.");
  } else if (motherPain === "Moderate" && level !== "urgent") {
    level = level === "normal" ? "watch" : level;
    notes.push("Moderate pain was recorded. Rest and mention it during postnatal care if it continues.");
  }

  if (motherMood === "Sad" || motherMood === "Anxious") {
    if (level !== "urgent") level = level === "normal" ? "watch" : level;
    notes.push("Low mood or anxiety after birth should be taken seriously, especially if it continues.");
  }

  if (temp >= 38 || temp > 0 && temp < 36) {
    level = "urgent";
    notes.push("Baby temperature looks unsafe. A newborn with fever or very low temperature needs urgent care.");
  }

  if (
    dangerText.includes("not feeding") ||
    dangerText.includes("poor feeding") ||
    dangerText.includes("difficulty breathing") ||
    dangerText.includes("yellow") ||
    dangerText.includes("convulsion") ||
    dangerText.includes("fits") ||
    dangerText.includes("fever") ||
    dangerText.includes("cold") ||
    dangerText.includes("blue")
  ) {
    level = "urgent";
    notes.push("A possible newborn danger sign was typed. Please seek care urgently.");
  }

  if (notes.length === 0) {
    notes.push("Postnatal check looks stable. Continue monitoring mother and baby and attend checkups.");
  }

  return { level, notes };
}

function getPrimarySupportPerson(supportPeople = []) {
  if (!Array.isArray(supportPeople) || supportPeople.length === 0) return null;
  return supportPeople.find((person) => person.isPrimary) || supportPeople[0];
}

function getSupportSummary(supportPeople = []) {
  const people = Array.isArray(supportPeople) ? supportPeople : [];
  const primary = getPrimarySupportPerson(people);

  return {
    count: people.length,
    primary,
    hasEmergencyContact: people.some((person) => person.phone?.trim()),
    roles: [...new Set(people.map((person) => person.role).filter(Boolean))],
  };
}

function getPostnatalSummary(postnatalCare) {
  if (!postnatalCare?.updatedAt) {
    return {
      ready: false,
      title: "Postnatal care",
      date: "Not set up yet",
      items: ["Add delivery and newborn care details"],
      badge: "normal",
    };
  }

  const latestLog = postnatalCare.recoveryLogs?.[0];
  return {
    ready: true,
    title: "Postnatal care",
    date: postnatalCare.deliveryDate ? `Delivered: ${postnatalCare.deliveryDate}` : "After birth mode active",
    items: [
      postnatalCare.babyName ? `Baby: ${postnatalCare.babyName}` : "Baby name pending",
      postnatalCare.feedingMethod ? `Feeding: ${postnatalCare.feedingMethod}` : "Feeding method pending",
      postnatalCare.nextCheckup ? `Next checkup: ${postnatalCare.nextCheckup}` : "Next checkup pending",
      ...(latestLog ? [`Latest check: ${latestLog.analysis.level}`] : []),
    ],
    badge: latestLog?.analysis?.level || "normal",
  };
}


function formatDisplayDate(value) {
  if (!value) return "Not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime() {
  return new Date().toLocaleString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

function formatAppointmentDate(date, time) {
  if (!date) return "Date not set";

  const dateTime = new Date(`${date}T${time || "08:00"}`);

  if (Number.isNaN(dateTime.getTime())) {
    return `${date}${time ? ` at ${time}` : ""}`;
  }

  const formattedDate = dateTime.toLocaleDateString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return time ? `${formattedDate}, ${time}` : formattedDate;
}

function getAppointmentTiming(appointment) {
  if (!appointment?.date) {
    return {
      level: "normal",
      label: "No date set",
      message: "Add a date so MamaCare can remind you before the visit.",
      daysUntil: null,
    };
  }

  const dateObject = new Date(`${appointment.date}T${appointment.time || "08:00"}`);

  if (Number.isNaN(dateObject.getTime())) {
    return {
      level: "normal",
      label: "Date needs checking",
      message: "The saved appointment date could not be read correctly.",
      daysUntil: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDay = new Date(dateObject);
  appointmentDay.setHours(0, 0, 0, 0);
  const daysUntil = Math.round((appointmentDay - today) / 86400000);

  if (daysUntil < 0) {
    return {
      level: "watch",
      label: "Overdue",
      message: `This appointment date passed ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"} ago. Update it if you already attended.`,
      daysUntil,
    };
  }

  if (daysUntil === 0) {
    return {
      level: "watch",
      label: "Today",
      message: "This appointment is today. Prepare your ANC card, questions, and transport early.",
      daysUntil,
    };
  }

  if (daysUntil === 1) {
    return {
      level: "watch",
      label: "Tomorrow",
      message: "This appointment is tomorrow. Confirm the time, location, and items to carry.",
      daysUntil,
    };
  }

  if (daysUntil <= 7) {
    return {
      level: "normal",
      label: `In ${daysUntil} days`,
      message: "This appointment is within the next week. MamaCare will keep it visible in reminders.",
      daysUntil,
    };
  }

  return {
    level: "normal",
    label: `In ${daysUntil} days`,
    message: "Appointment saved. MamaCare will remind you as the date gets closer.",
    daysUntil,
  };
}

function getAppointmentReminderText(appointment, mother) {
  const timing = getAppointmentTiming(appointment);
  const when = appointment?.date
    ? formatAppointmentDate(appointment.date, appointment.time)
    : mother?.nextANC || "Date not set";
  const where = appointment?.facility || mother?.location || "Location not set";
  return `${timing.label} • ${when} • ${where}`;
}

function getNextAppointment(appointments, mother) {
  const now = new Date();

  const validAppointments = appointments
    .filter((item) => item.date)
    .map((item) => ({
      ...item,
      dateObject: new Date(`${item.date}T${item.time || "08:00"}`),
    }))
    .filter((item) => !Number.isNaN(item.dateObject.getTime()))
    .sort((a, b) => a.dateObject - b.dateObject);

  const upcoming = validAppointments.find((item) => item.dateObject >= now);
  const fallback = [...validAppointments].reverse()[0];

  if (upcoming || fallback) {
    const selected = upcoming || fallback;
    const timing = getAppointmentTiming(selected);
    return {
      ...selected,
      title: selected.title || "ANC appointment",
      dateText: formatAppointmentDate(selected.date, selected.time),
      location: selected.facility || mother.location,
      notes: selected.notes || "Prepare your ANC card and questions before the visit.",
      reminderStatus: timing.label,
      reminderLevel: timing.level,
      reminderMessage: timing.message,
      daysUntil: timing.daysUntil,
    };
  }

  return {
    id: "profile-next-anc",
    title: "ANC appointment reminder",
    date: mother.nextANC || "",
    time: "",
    facility: mother.location || "",
    dateText: mother.nextANC || "No appointment reminder saved",
    location: mother.location || "Location not set",
    notes: "Add your next ANC appointment date so MamaCare can remind you before the visit.",
    reminderStatus: mother.nextANC ? "Saved in profile" : "Missing",
    reminderLevel: mother.nextANC ? "normal" : "watch",
    reminderMessage: mother.nextANC
      ? "This reminder came from your profile. Add a detailed appointment for stronger reminders."
      : "No appointment reminder is saved yet.",
    daysUntil: null,
  };
}

function formatMedicationTime(time) {
  if (!time) return "Time not set";
  return time;
}

function getNextMedication(medications) {
  if (!medications || medications.length === 0) return null;

  const sorted = [...medications].sort((a, b) => {
    const timeA = a.time || "23:59";
    const timeB = b.time || "23:59";
    return timeA.localeCompare(timeB);
  });

  return sorted[0];
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white p-5 shadow-sm border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}

function Input({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        {Icon && <Icon className="h-5 w-5 text-slate-400" />}

        <input
          type={type}
          value={value}
          min={type === "number" ? "1" : undefined}
          max={type === "number" ? "40" : undefined}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}


function DateInput({ icon: Icon = CalendarDays, label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        {Icon && <Icon className="h-5 w-5 text-slate-400" />}

        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 outline-none"
        />
      </div>
    </label>
  );
}

function RiskPill({ risk }) {
  const styles = {
    normal: "bg-green-100 text-green-700 border-green-200",
    watch: "bg-orange-100 text-orange-700 border-orange-200",
    urgent: "bg-red-100 text-red-700 border-red-200",
  };

  const labels = {
    normal: "Normal",
    watch: "Watch",
    urgent: "Urgent",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[risk]}`}
    >
      {labels[risk]}
    </span>
  );
}

function AIInsightCard({
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory = [],
  risk,
  mother,
}) {
  const insight = generateAIInsight({
    selectedSymptoms,
    customSymptoms,
    symptomHistory,
    vitalsHistory,
    wellnessHistory,
    movementHistory,
    risk,
    mother,
  });

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-900 p-3 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              MamaCare AI Insight
            </p>
            <p className="text-xs text-slate-500">
              Symptoms, vitals and wellness analytics
            </p>
          </div>
        </div>

        <RiskPill risk={risk} />
      </div>

      <div className="mt-5 space-y-4">
        <InfoBlock title="Summary" text={insight.summary} />
        <InfoBlock title="Why this matters" text={insight.whyItMatters} />
        <InfoBlock title="Pattern check" text={insight.pattern} />

        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Suggested action
          </p>
          <p className="mt-1 text-sm leading-6 font-semibold text-slate-800">
            {insight.action}
          </p>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          This is not a medical diagnosis. It is a safety-focused digital
          assistant that highlights possible warning signs and encourages timely
          care.
        </p>
      </div>
    </Card>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function AnalysisBox({ analysis }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-900">Current analysis</p>
        <RiskPill risk={analysis.level} />
      </div>

      <div className="mt-3 space-y-2">
        {analysis.notes.map((note) => (
          <p key={note} className="text-sm leading-6 text-slate-600">
            • {note}
          </p>
        ))}
      </div>
    </div>
  );
}

function OptionGroup({ title, options, active, setActive }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className="grid grid-cols-1 gap-3">
        {options.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`rounded-2xl border p-4 text-left text-sm font-bold ${
              active === item.id
                ? "border-teal-400 bg-teal-50 text-teal-700"
                : "border-slate-100 bg-white text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ title, badge, date, items }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <RiskPill risk={badge} />
      </div>

      <p className="mt-2 text-xs text-slate-500">{date}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}

function HistoryCard({ title, emptyText, items, render }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {items.length} logs
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">{items.map(render)}</div>
      )}
    </Card>
  );
}

function HistoryItem({ badge, date, items, notes = [], onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-4 w-4" />
            <span>{date}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>

          {notes.length > 0 && (
            <div className="mt-3 space-y-1">
              {notes.map((note) => (
                <p key={note} className="text-xs leading-5 text-slate-500">
                  • {note}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <RiskPill risk={badge} />
          <button
            onClick={onDelete}
            className="rounded-full bg-white p-2 text-slate-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionTile({ title, subtitle, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl ${color} p-5 text-left text-white shadow-sm`}
    >
      <Icon className="mb-5 h-6 w-6" />
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs text-white/80">{subtitle}</p>
    </button>
  );
}

function Shortcut({ icon: Icon, title, subtitle, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-3xl bg-white p-5 text-left shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-slate-400" />
    </button>
  );
}

function WelcomePage({ go }) {
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-900 p-3 text-white">
              <Baby className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                MamaCare
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Smart pregnancy companion
              </p>
            </div>
          </div>

          <div
            className="rounded-[2.2rem] p-7 text-white shadow-xl"
            style={{
              background: `linear-gradient(145deg, ${COLORS.primary}, ${COLORS.accent})`,
            }}
          >
            <div className="mb-8 flex justify-end">
              <div className="rounded-full bg-white/20 p-5">
                <Heart className="h-12 w-12" />
              </div>
            </div>

            <p className="text-sm font-semibold text-sky-100">
              Mother-first care
            </p>

            <h2 className="mt-3 text-4xl font-extrabold leading-tight">
              Your pregnancy journey, safer and simpler.
            </h2>

            <p className="mt-4 text-sm leading-6 text-blue-50">
              Track pregnancy, symptoms, vitals, baby movement, mood, ANC visits,
              and emergency support.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <Baby className="mx-auto h-6 w-6 text-blue-900" />
              <p className="mt-2 text-xs font-bold text-slate-700">Track</p>
            </Card>

            <Card className="p-4 text-center">
              <HeartPulse className="mx-auto h-6 w-6 text-red-500" />
              <p className="mt-2 text-xs font-bold text-slate-700">Check</p>
            </Card>

            <Card className="p-4 text-center">
              <Siren className="mx-auto h-6 w-6 text-orange-500" />
              <p className="mt-2 text-xs font-bold text-slate-700">SOS</p>
            </Card>
          </div>
        </motion.div>

        <div className="space-y-3">
          <button
            onClick={() => go("register")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-4 font-bold text-white shadow-lg"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => go("login")}
            className="w-full rounded-2xl bg-white py-4 font-bold text-blue-900 shadow-sm border border-slate-100"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerAction,
  onFooter,
  go,
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-xl"
      >
        <button
          onClick={() => go("welcome")}
          className="mb-8 flex items-center gap-3"
        >
          <div className="rounded-2xl bg-blue-900 p-3 text-white">
            <Baby className="h-6 w-6" />
          </div>

          <span className="text-xl font-extrabold text-slate-900">
            MamaCare
          </span>
        </button>

        <Card>
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>

          <div className="mt-6 space-y-4">{children}</div>

          <p className="mt-6 text-center text-sm text-slate-500">
            {footerText}{" "}
            <button onClick={onFooter} className="font-bold text-blue-900">
              {footerAction}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

function RegisterPage({ go, mother, setMother }) {
  const [name, setName] = useState(mother.name);
  const [phone, setPhone] = useState(mother.phone);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  const submit = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanPhone || !password) {
      setStatus({ loading: false, error: "Please enter your name, phone number, and password." });
      return;
    }

    try {
      setStatus({ loading: true, error: "" });

      const data = await authApi.register({
        name: cleanName,
        phone: cleanPhone,
        password,
      });

      const apiMother = mapApiProfileToMother(data.profile, {
        ...mother,
        name: cleanName,
        phone: cleanPhone,
      });

      setMother(apiMother);
      localStorage.setItem("mamacare_mother", JSON.stringify(apiMother));

      setStatus({ loading: false, error: "" });
      go("setup");
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error.message ||
          "Registration failed. Check that the backend is running on http://localhost:5000.",
      });
    }
  };

  return (
    <AuthShell
      go={go}
      title="Create your MamaCare account"
      subtitle="Start with your basic details. Pregnancy setup comes next."
      footerText="Already registered?"
      footerAction="Login"
      onFooter={() => go("login")}
    >
      <Input
        icon={UserRound}
        label="Full name"
        value={name}
        onChange={setName}
        placeholder="Enter your name"
      />

      <Input
        icon={Smartphone}
        label="Phone number"
        value={phone}
        onChange={setPhone}
        placeholder="+256..."
      />

      <Input
        icon={Lock}
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Create password"
        type="password"
      />

      {status.error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
          {status.error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={status.loading}
        className={`mt-2 w-full rounded-2xl py-4 font-bold text-white shadow-lg ${
          status.loading ? "bg-slate-400" : "bg-blue-900"
        }`}
      >
        {status.loading ? "Creating account..." : "Continue"}
      </button>
    </AuthShell>
  );
}

function LoginPage({ go, setMother }) {
  const [phone, setPhone] = useState(defaultMother.phone);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  const submit = async () => {
    const cleanPhone = phone.trim();

    if (!cleanPhone || !password) {
      setStatus({ loading: false, error: "Please enter your phone number and password." });
      return;
    }

    try {
      setStatus({ loading: true, error: "" });

      const data = await authApi.login({
        phone: cleanPhone,
        password,
      });

      const apiMother = await loadBackendDataAfterLogin(data.profile, {
        ...defaultMother,
        name: data.user?.name || defaultMother.name,
        phone: data.user?.phone || cleanPhone,
      });

      setMother(apiMother);
      localStorage.setItem("mamacare_screen", "app");
      localStorage.setItem("mamacare_active_tab", "home");

      setStatus({ loading: false, error: "" });
      window.location.reload();
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error.message ||
          "Login failed. Check your details and confirm the backend is running.",
      });
    }
  };

  return (
    <AuthShell
      go={go}
      title="Welcome back"
      subtitle="Login to continue your pregnancy journey."
      footerText="New to MamaCare?"
      footerAction="Create account"
      onFooter={() => go("register")}
    >
      <Input
        icon={Smartphone}
        label="Phone number"
        value={phone}
        onChange={setPhone}
        placeholder="+256..."
      />

      <Input
        icon={Lock}
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter password"
        type="password"
      />

      {status.error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
          {status.error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={status.loading}
        className={`mt-2 w-full rounded-2xl py-4 font-bold text-white shadow-lg ${
          status.loading ? "bg-slate-400" : "bg-blue-900"
        }`}
      >
        {status.loading ? "Logging in..." : "Login"}
      </button>
    </AuthShell>
  );
}

function PregnancySetupPage({ go, mother, setMother }) {
  const [week, setWeek] = useState(String(mother.week));
  const [dueDate, setDueDate] = useState(mother.dueDate);
  const [location, setLocation] = useState(mother.location);
  const [nextANC, setNextANC] = useState(mother.nextANC);
  const [emergencyContact, setEmergencyContact] = useState(
    mother.emergencyContact
  );

  const submit = () => {
    const safeWeek = Math.min(Math.max(Number(week) || 24, 1), 40);

    setMother((prev) => ({
      ...prev,
      week: safeWeek,
      dueDate: dueDate || prev.dueDate,
      location: location || prev.location,
      nextANC: nextANC || prev.nextANC,
      emergencyContact: emergencyContact || prev.emergencyContact,
    }));

    go("app");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-3xl space-y-5"
      >
        <div>
          <p className="text-sm font-semibold text-teal-600">
            Pregnancy setup
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Personalize MamaCare for you
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            These details help MamaCare show your week, reminders, and emergency
            information.
          </p>
        </div>

        <Card className="space-y-4">
          <Input
            icon={Baby}
            label="Current pregnancy week"
            value={week}
            onChange={setWeek}
            placeholder="Example: 24"
            type="number"
          />

          <DateInput
            icon={CalendarDays}
            label="Expected due date"
            value={dueDate}
            onChange={setDueDate}
          />

          <Input
            icon={MapPinned}
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="Example: Mukono, Uganda"
          />

          <DateInput
            icon={ClipboardList}
            label="Next ANC appointment"
            value={nextANC}
            onChange={setNextANC}
          />

          <Input
            icon={Phone}
            label="Emergency contact"
            value={emergencyContact}
            onChange={setEmergencyContact}
            placeholder="+256..."
          />

          <button
            onClick={submit}
            className="w-full rounded-2xl bg-blue-900 py-4 font-bold text-white shadow-lg"
          >
            Finish Setup
          </button>
        </Card>
      </motion.div>
    </div>
  );
}

function Header({ mother, go, onLogout, unreadNotificationCount = 0, onSearch }) {
  const [showMenu, setShowMenu] = useState(false);
  const isOnline = useOnlineStatus();

  return (
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">Good morning</p>
        <h1 className="text-2xl font-bold text-slate-900">{mother.name}</h1>
        <button
          onClick={() => go("offline")}
          className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
            isOnline
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {isOnline ? "Online" : "Offline mode"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open quick search"
          onClick={onSearch}
          className="relative rounded-2xl bg-white p-3 text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50"
          title="Search MamaCare"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          onClick={() => go("notifications")}
          className="relative rounded-2xl bg-white p-3 shadow-sm border border-slate-100"
        >
          <Bell className="h-5 w-5 text-slate-700" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => go("settings")}
          className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100"
          title="Open settings"
        >
          <Settings className="h-5 w-5 text-slate-700" />
        </button>

        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100"
        >
          <UserRound className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-14 z-50 w-60 rounded-3xl border border-slate-100 bg-white p-3 shadow-xl">
          <button
            onClick={() => {
              setShowMenu(false);
              go("profile");
            }}
            className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-slate-50"
          >
            <div className="rounded-2xl bg-blue-50 p-3">
              <UserRound className="h-5 w-5 text-blue-900" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">{mother.name}</p>
              <p className="text-xs text-slate-500">View profile information</p>
            </div>
          </button>

          <div className="my-2 h-px bg-slate-100" />

          <button
            onClick={() => {
              setShowMenu(false);
              go("profile");
            }}
            className="flex w-full items-center justify-between rounded-2xl p-3 text-left hover:bg-slate-50"
          >
            <span className="text-sm font-semibold text-slate-700">
              Profile
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              setShowMenu(false);
              onLogout();
            }}
            className="mt-1 flex w-full items-center justify-between rounded-2xl p-3 text-left hover:bg-red-50"
          >
            <span className="text-sm font-semibold text-red-600">Logout</span>
            <LogOut className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}

function HomePage({
  risk,
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  appointments,
  medications,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  go,
  mother,
  onLogout,
  unreadNotificationCount = 0,
  setQuickOpen,
}) {
  const guide = getWeeklyGuide(mother.week);
  const latestLog = symptomHistory[0];
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];
  const nextAppointment = getNextAppointment(appointments, mother);
  const nextMedication = getNextMedication(medications);
  const emergencyPlanReady = emergencyPlan?.nearestFacility || emergencyPlan?.transportPhone || emergencyPlan?.supportPerson;
  const supportSummary = getSupportSummary(supportPeople);
  const healthRecordsReady = healthRecords?.ancNumber || healthRecords?.bloodGroup || healthRecords?.allergies || healthRecords?.currentFacility;
  const postnatalSummary = getPostnatalSummary(postnatalCare);
  const todayFeedTip = getTodayTip(mother.week);

  return (
    <Page>
      <Header
        mother={mother}
        go={go}
        onLogout={onLogout}
        unreadNotificationCount={unreadNotificationCount}
        onSearch={() => setQuickOpen(true)}
      />

      <div
        className="rounded-[2rem] p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm opacity-90">Pregnancy week</p>

            <h2 className="mt-1 text-4xl font-extrabold">
              Week {mother.week}
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 opacity-95">
              Your baby is {guide.babySize}. {guide.baby}
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-4">
            <Baby className="h-10 w-10" />
          </div>
        </div>

        <div className="mt-6 h-3 rounded-full bg-white/20">
          <div
            className="h-3 rounded-full bg-white"
            style={{ width: `${Math.min((mother.week / 40) * 100, 100)}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs opacity-90">
          <span>0 weeks</span>
          <span>Due: {formatDisplayDate(mother.dueDate)}</span>
          <span>40 weeks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => go("risk")} className="text-left">
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Risk status</p>
                <div className="mt-2">
                  <RiskPill risk={risk} />
                </div>
              </div>

              <HeartPulse className="h-7 w-7 text-red-500" />
            </div>
          </Card>
        </button>

        <button onClick={() => go("anc")} className="text-left">
          <Card className="h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Next ANC</p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {nextAppointment.dateText}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {nextAppointment.location}
                </p>
              </div>

              <CalendarDays className="h-7 w-7 shrink-0 text-sky-500" />
            </div>
          </Card>
        </button>
      </div>

      <Shortcut
        icon={Activity}
        title="Track health workspace"
        subtitle="Symptoms, vitals, movement, wellness, and medication"
        onClick={() => go("healthHub")}
        color="bg-teal-50 text-teal-700"
      />

      <Shortcut
        icon={CalendarDays}
        title="Appointments & care workspace"
        subtitle="ANC, birth prep, pregnancy feed, learning, and postnatal care"
        onClick={() => go("careHub")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={IdCard}
        title="Digital health cards"
        subtitle="View ANC, hospital results, emergency, and postnatal cards"
        onClick={() => go("digitalCards")}
        color="bg-teal-50 text-teal-700"
      />

      <Shortcut
        icon={MessageSquareText}
        title="ANC questions builder"
        subtitle="Prepare what to ask at your clinic visit"
        onClick={() => go("ancQuestions")}
        color="bg-indigo-50 text-indigo-700"
      />

      <Shortcut
        icon={ListTodo}
        title="Smart care plan"
        subtitle="See personalized next steps for the mother"
        onClick={() => go("carePlan")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={Timeline}
        title="Mother journey timeline"
        subtitle="View all pregnancy activities in one place"
        onClick={() => go("timeline")}
        color="bg-teal-50 text-teal-700"
      />

      <AIInsightCard
        selectedSymptoms={selectedSymptoms}
        customSymptoms={customSymptoms}
        symptomHistory={symptomHistory}
        vitalsHistory={vitalsHistory}
        wellnessHistory={wellnessHistory}
        movementHistory={movementHistory}
        risk={risk}
        mother={mother}
      />

      <button onClick={() => go("insights")} className="w-full text-left">
        <Card className="bg-gradient-to-br from-blue-900 to-teal-600 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
                Mother progress dashboard
              </p>
              <p className="mt-1 text-lg font-extrabold">
                View your full pregnancy insights
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-50">
                See risk patterns, ANC readiness, medications, wellness, movement, emergency plan, and records in one place.
              </p>
            </div>
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </Card>
      </button>

      <button onClick={() => go("tips")} className="w-full text-left">
        <Card className="bg-gradient-to-br from-white to-sky-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-600">
                Daily pregnancy feed
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {todayFeedTip.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {todayFeedTip.text}
              </p>
            </div>

            <BookOpen className="h-6 w-6 text-blue-900" />
          </div>
        </Card>
      </button>

      <div className="grid grid-cols-2 gap-4">
        <ActionTile
          title="Log symptoms"
          subtitle="Select or type how you feel"
          icon={Plus}
          color="bg-slate-900"
          onClick={() => go("log")}
        />

        <ActionTile
          title="Log vitals"
          subtitle="BP, temperature, movement"
          icon={Gauge}
          color="bg-blue-900"
          onClick={() => go("vitals")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActionTile
          title="Baby movement"
          subtitle="Count kicks and rolls"
          icon={Baby}
          color="bg-indigo-600"
          onClick={() => go("movement")}
        />

        <ActionTile
          title="Wellness"
          subtitle="Mood, stress, sleep"
          icon={Smile}
          color="bg-teal-600"
          onClick={() => go("wellness")}
        />

        <ActionTile
          title="Emergency"
          subtitle="Get help quickly"
          icon={Siren}
          color="bg-red-500"
          onClick={() => go("emergency")}
        />
      </div>

      <Shortcut
        icon={Baby}
        title="Baby movement counter"
        subtitle="Count kicks, rolls, and movement sessions"
        onClick={() => go("movement")}
        color="bg-indigo-50 text-indigo-700"
      />

      <Shortcut
        icon={Sparkles}
        title="Mother progress dashboard"
        subtitle="View risk, ANC, wellness, movement, records, and readiness insights"
        onClick={() => go("insights")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={BookOpen}
        title="Daily pregnancy feed"
        subtitle="Personalized tips for your week"
        onClick={() => go("tips")}
        color="bg-sky-50 text-blue-900"
      />


      <Shortcut
        icon={ShieldAlert}
        title="Risk awareness"
        subtitle="Understand your current risk level"
        onClick={() => go("risk")}
        color="bg-orange-50 text-orange-600"
      />

      <Shortcut
        icon={MapPinned}
        title="Emergency plan"
        subtitle="Facility, transport, support person, and cash plan"
        onClick={() => go("emergencyPlan")}
        color="bg-red-50 text-red-600"
      />

      <Shortcut
        icon={UserRound}
        title="Support people"
        subtitle="Partner, family, transport contact, or village health worker"
        onClick={() => go("support")}
        color="bg-violet-50 text-violet-700"
      />

      <Shortcut
        icon={Wifi}
        title="Offline mode"
        subtitle="Check connection status and local saved data"
        onClick={() => go("offline")}
        color="bg-cyan-50 text-cyan-700"
      />

      <Shortcut
        icon={FileText}
        title="Health records"
        subtitle="ANC number, blood group, allergies, scans, and tests"
        onClick={() => go("records")}
        color="bg-emerald-50 text-emerald-700"
      />

      <Shortcut
        icon={HeartPulse}
        title="Postnatal care"
        subtitle="After birth recovery, feeding, checkups, and newborn danger signs"
        onClick={() => go("postnatal")}
        color="bg-pink-50 text-pink-700"
      />

      <Shortcut
        icon={ClipboardList}
        title="Prepare for ANC"
        subtitle="View reminder and checklist"
        onClick={() => go("anc")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={Pill}
        title="Medication reminders"
        subtitle="Track iron, folic acid, and other medicines"
        onClick={() => go("medications")}
        color="bg-purple-50 text-purple-700"
      />

      <Shortcut
        icon={Baby}
        title="Birth preparation"
        subtitle="Hospital bag and labor readiness"
        onClick={() => go("birth")}
        color="bg-teal-50 text-teal-700"
      />

      {emergencyPlanReady && (
        <SummaryCard
          title="Emergency plan"
          badge="normal"
          date={emergencyPlan.nearestFacility || "Facility not added yet"}
          items={[
            emergencyPlan.transportPhone ? `Transport: ${emergencyPlan.transportPhone}` : "Transport contact pending",
            emergencyPlan.supportPerson ? `Support: ${emergencyPlan.supportPerson}` : "Support person pending",
          ]}
        />
      )}

      {supportSummary.count > 0 && (
        <SummaryCard
          title="Support people"
          badge="normal"
          date={supportSummary.primary ? `Primary: ${supportSummary.primary.name}` : "Support saved"}
          items={[
            `${supportSummary.count} saved contact${supportSummary.count === 1 ? "" : "s"}`,
            supportSummary.hasEmergencyContact ? "Emergency phone available" : "Phone number pending",
            supportSummary.roles.length ? `Roles: ${supportSummary.roles.slice(0, 2).join(", ")}` : "Roles pending",
          ]}
        />
      )}

      {healthRecordsReady && (
        <SummaryCard
          title="Health records"
          badge="normal"
          date={healthRecords.ancNumber ? `ANC No: ${healthRecords.ancNumber}` : "Records saved"}
          items={[
            healthRecords.bloodGroup ? `Blood group: ${healthRecords.bloodGroup}` : "Blood group pending",
            healthRecords.allergies ? `Allergies: ${healthRecords.allergies}` : "Allergies not added",
            healthRecords.currentFacility ? `Facility: ${healthRecords.currentFacility}` : "Facility not added",
          ]}
        />
      )}

      {postnatalSummary.ready && (
        <SummaryCard
          title={postnatalSummary.title}
          badge={postnatalSummary.badge}
          date={postnatalSummary.date}
          items={postnatalSummary.items}
        />
      )}

      {nextMedication && (
        <SummaryCard
          title="Next medication"
          badge="normal"
          date={`${formatMedicationTime(nextMedication.time)} • ${nextMedication.frequency}`}
          items={[
            nextMedication.name,
            `Dosage: ${nextMedication.dosage || "As prescribed"}`,
            ...(nextMedication.notes ? [`Note: ${nextMedication.notes}`] : []),
          ]}
        />
      )}

      {latestMovement && (
        <SummaryCard
          title="Latest movement check"
          badge={latestMovement.analysis.level}
          date={latestMovement.date}
          items={[
            `${latestMovement.count} movements counted`,
            `Feeling: ${latestMovement.feelingLabel}`,
            ...(latestMovement.note ? [`Note: ${latestMovement.note}`] : []),
          ]}
        />
      )}

      {latestWellness && (
        <SummaryCard
          title="Latest wellness"
          badge={latestWellness.analysis.level}
          date={latestWellness.date}
          items={[
            `Mood: ${latestWellness.moodLabel}`,
            `Energy: ${latestWellness.energy}`,
            `Sleep: ${latestWellness.sleep}`,
            `Stress: ${latestWellness.stress}`,
          ]}
        />
      )}

      {latestVitals && (
        <SummaryCard
          title="Latest vitals"
          badge={latestVitals.analysis.level}
          date={latestVitals.date}
          items={[
            `BP: ${latestVitals.systolic}/${latestVitals.diastolic}`,
            `Temp: ${latestVitals.temperature}°C`,
            `Movement: ${latestVitals.movementLabel}`,
          ]}
        />
      )}

      {latestLog && (
        <SummaryCard
          title="Latest symptom log"
          badge={latestLog.risk}
          date={latestLog.date}
          items={latestLog.symptoms}
        />
      )}
    </Page>
  );
}

function TrackerPage({ mother, go }) {
  const guide = getWeeklyGuide(mother.week);

  return (
    <Page>
      <h1 className="text-2xl font-bold text-slate-900">
        Your pregnancy tracker
      </h1>

      <Card className="bg-gradient-to-br from-sky-50 to-teal-50">
        <p className="text-sm text-slate-500">Current stage</p>

        <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
          Week {mother.week}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your baby is {guide.babySize}. This tracker gives week-by-week
          guidance like Flo-style pregnancy tracking, but focused on safer
          motherhood.
        </p>
      </Card>

      <InfoCard title="Baby this week" text={guide.baby} />
      <InfoCard title="Mother’s body" text={guide.mother} />
      <InfoCard title="Signs to watch" text={guide.warning} />

      <Card>
        <h3 className="font-bold text-slate-900">ANC reminder</h3>

        <div className="mt-3 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Next visit: {formatDisplayDate(mother.nextANC)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            MamaCare will remind you before your appointment.
          </p>
        </div>

        <button
          onClick={() => go("anc")}
          className="mt-4 w-full rounded-2xl bg-blue-900 py-3 font-bold text-white"
        >
          Open ANC Checklist
        </button>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Vitals monitoring</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Track blood pressure, temperature, and baby movement to support safer
          pregnancy monitoring.
        </p>

        <button
          onClick={() => go("vitals")}
          className="mt-4 w-full rounded-2xl bg-blue-900 py-3 font-bold text-white"
        >
          Log Vitals
        </button>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Mother wellness</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Track your mood, stress, sleep, and energy so MamaCare can support your
          overall wellbeing.
        </p>

        <button
          onClick={() => go("wellness")}
          className="mt-4 w-full rounded-2xl bg-teal-600 py-3 font-bold text-white"
        >
          Log Wellness
        </button>
      </Card>

      {mother.week >= 28 && (
        <Card>
          <h3 className="font-bold text-slate-900">Getting ready for birth</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Since you are in the later stage of pregnancy, start preparing your
            hospital bag, transport plan, support person, and emergency contact.
          </p>

          <button
            onClick={() => go("birth")}
            className="mt-4 w-full rounded-2xl bg-teal-600 py-3 font-bold text-white"
          >
            Open Birth Checklist
          </button>
        </Card>
      )}
    </Page>
  );
}

function InfoCard({ title, text }) {
  return (
    <Card>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </Card>
  );
}

function LogPage({
  selectedSymptoms,
  setSelectedSymptoms,
  customSymptoms,
  setCustomSymptoms,
  risk,
  symptomHistory,
  setSymptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  mother,
  go,
}) {
  const [customText, setCustomText] = useState("");
  const [syncStatus, setSyncStatus] = useState({ loading: false, message: "", error: "" });

  const toggle = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addCustomSymptom = () => {
    const cleanText = customText.trim();

    if (!cleanText) return;

    const newCustomSymptom = {
      id: Date.now(),
      text: cleanText,
      analysis: analyzeCustomSymptom(cleanText),
    };

    setCustomSymptoms((prev) => [newCustomSymptom, ...prev]);
    setCustomText("");
  };

  const removeCustomSymptom = (id) => {
    setCustomSymptoms((prev) => prev.filter((item) => item.id !== id));
  };

  const selectedLabels = selectedSymptoms.map(
    (id) => symptoms.find((item) => item.id === id)?.label || id
  );

  const customLabels = customSymptoms.map((item) => item.text);

  const customAnalyses = customSymptoms.map((item) => ({
    text: item.text,
    ...item.analysis,
  }));

  const message =
    risk === "urgent"
      ? "MamaCare has detected a possible danger sign from your selected symptoms, typed symptoms, latest vitals, or wellness. Please seek medical care immediately or use Emergency Help."
      : risk === "watch"
      ? "MamaCare has detected symptoms, vitals, or wellness patterns that may need monitoring. Contact a health worker if they continue or worsen."
      : "No major danger sign detected from the current inputs. Keep tracking how you feel each day.";

  const saveLog = async () => {
    if (selectedSymptoms.length === 0 && customSymptoms.length === 0) return;

    const newLog = {
      id: Date.now(),
      date: formatDateTime(),
      risk,
      symptoms: [...selectedLabels, ...customLabels],
      customAnalyses,
      syncStatus: "pending",
    };

    setSymptomHistory((prev) => [newLog, ...prev]);
    setSelectedSymptoms([]);
    setCustomSymptoms([]);

    try {
      setSyncStatus({ loading: true, message: "", error: "" });

      const saved = await symptomsApi.create(mapSymptomLogToApi(newLog));

      setSymptomHistory((prev) =>
        prev.map((item) =>
          item.id === newLog.id
            ? { ...item, backendId: saved.id, syncStatus: "synced" }
            : item
        )
      );

      setSyncStatus({
        loading: false,
        message: "Symptom log saved locally and synced to backend.",
        error: "",
      });
    } catch (error) {
      setSyncStatus({
        loading: false,
        message: "",
        error:
          "Symptom log saved locally, but backend sync failed. Check backend/login and try later.",
      });
    }
  };

  const deleteLog = (id) => {
    setSymptomHistory((prev) => prev.filter((log) => log.id !== id));
  };

  const clearCurrent = () => {
    setSelectedSymptoms([]);
    setCustomSymptoms([]);
    setCustomText("");
  };

  return (
    <Page>
      <h1 className="text-2xl font-bold text-slate-900">
        How are you feeling?
      </h1>

      <AIInsightCard
        selectedSymptoms={selectedSymptoms}
        customSymptoms={customSymptoms}
        symptomHistory={symptomHistory}
        vitalsHistory={vitalsHistory}
        wellnessHistory={wellnessHistory}
        movementHistory={movementHistory}
        risk={risk}
        mother={mother}
      />

      <Shortcut
        icon={ShieldAlert}
        title="View risk awareness"
        subtitle="Understand why MamaCare gave this risk level"
        onClick={() => go("risk")}
        color="bg-orange-50 text-orange-600"
      />

      <Card>
        <p className="text-sm font-bold text-slate-900">Choose common symptoms</p>

        <p className="mt-2 text-sm text-slate-600">
          Select from the common symptoms below, or type your own symptom in the
          next section.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {symptoms.map((item) => {
            const active = selectedSymptoms.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-teal-400 bg-teal-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <span className="text-sm font-semibold text-slate-800">
                  {item.label}
                </span>

                {active ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                ) : (
                  <Plus className="h-5 w-5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-slate-900">Type your own symptom</p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Example: “I feel sharp pain on one side”, “my baby is not moving”, or
          “I feel very weak and dizzy”.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type what you are feeling..."
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={addCustomSymptom}
          className="mt-4 w-full rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white"
        >
          Add Custom Symptom
        </button>

        {customSymptoms.length > 0 && (
          <div className="mt-5 space-y-3">
            {customSymptoms.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {item.text}
                    </p>

                    <div className="mt-2">
                      <RiskPill risk={item.analysis.level} />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.analysis.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => removeCustomSymptom(item.id)}
                    className="rounded-full bg-white p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">MamaCare feedback</h3>
          <RiskPill risk={risk} />
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          This is not a diagnosis. It is a simple risk-awareness check based on
          common maternal danger signs, keywords, latest vitals, and wellness.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={saveLog}
            disabled={selectedSymptoms.length === 0 && customSymptoms.length === 0}
            className={`rounded-2xl py-3 text-sm font-bold text-white ${
              selectedSymptoms.length === 0 && customSymptoms.length === 0
                ? "bg-slate-300"
                : "bg-blue-900"
            }`}
          >
            Save Log
          </button>

          <button
            onClick={clearCurrent}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            Clear
          </button>
        </div>
      </Card>

      {(syncStatus.loading || syncStatus.message || syncStatus.error) && (
        <Card>
          {syncStatus.loading && (
            <p className="text-sm font-semibold text-slate-600">
              Syncing symptom log to backend...
            </p>
          )}

          {syncStatus.message && (
            <p className="text-sm font-semibold text-green-700">
              {syncStatus.message}
            </p>
          )}

          {syncStatus.error && (
            <p className="text-sm font-semibold text-orange-700">
              {syncStatus.error}
            </p>
          )}
        </Card>
      )}

      <HistoryCard
        title="Symptom history"
        emptyText="No saved symptom logs yet."
        items={symptomHistory}
        render={(log) => (
          <HistoryItem
            key={log.id}
            badge={log.risk}
            date={log.date}
            items={log.symptoms}
            notes={
              log.customAnalyses
                ? log.customAnalyses.map((item) => `${item.text}: ${item.reason}`)
                : []
            }
            onDelete={() => deleteLog(log.id)}
          />
        )}
      />
    </Page>
  );
}

function VitalsPage({ vitalsHistory, setVitalsHistory, mother, go }) {
  const [weightKg, setWeightKg] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [temperature, setTemperature] = useState("");
  const [facility, setFacility] = useState(mother?.location || "");
  const [movement, setMovement] = useState("normal");
  const [syncStatus, setSyncStatus] = useState({ loading: false, message: "", error: "" });

  const movementLabels = {
    normal: "Normal",
    less: "Less than usual",
    reduced: "Reduced / not moving",
  };

  const currentAnalysis = analyzeVitals({
    systolic,
    diastolic,
    temperature,
    movement,
  });

  const saveVitals = async () => {
    if (!weightKg && !systolic && !diastolic && !temperature && movement === "normal" && !facility) return;

    const newEntry = {
      id: Date.now(),
      date: formatDateTime(),
      weightKg: weightKg || "—",
      systolic: systolic || "—",
      diastolic: diastolic || "—",
      temperature: temperature || "—",
      facility: facility.trim(),
      movement,
      movementLabel: movementLabels[movement],
      analysis: currentAnalysis,
      syncStatus: "pending",
    };

    setVitalsHistory((prev) => [newEntry, ...prev]);

    setWeightKg("");
    setSystolic("");
    setDiastolic("");
    setTemperature("");
    setFacility(mother?.location || "");
    setMovement("normal");

    try {
      setSyncStatus({ loading: true, message: "", error: "" });

      const saved = await vitalsApi.create(mapVitalsLogToApi(newEntry));

      setVitalsHistory((prev) =>
        prev.map((item) =>
          item.id === newEntry.id
            ? { ...item, backendId: saved.id, syncStatus: "synced" }
            : item
        )
      );

      setSyncStatus({
        loading: false,
        message: "Vitals saved locally and synced to backend.",
        error: "",
      });
    } catch (error) {
      setSyncStatus({
        loading: false,
        message: "",
        error:
          "Vitals saved locally, but backend sync failed. Check backend/login and try later.",
      });
    }
  };

  const deleteVitals = (id) => {
    setVitalsHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-blue-700">Vitals monitoring</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Log vitals and baby movement
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Record hospital or home results such as weight, blood pressure,
          temperature, and baby movement. MamaCare analyzes risky readings and
          keeps the latest checkup information visible.
        </p>
      </div>

      <Card className="space-y-4">
        <Input
          icon={Gauge}
          label="Weight in kg"
          value={weightKg}
          onChange={setWeightKg}
          placeholder="Example: 72.5"
          type="number"
        />

        <Input
          icon={MapPinned}
          label="Facility / source of results"
          value={facility}
          onChange={setFacility}
          placeholder="Example: Mukono Health Centre IV or home check"
        />

        <Input
          icon={HeartPulse}
          label="Systolic BP"
          value={systolic}
          onChange={setSystolic}
          placeholder="Example: 120"
          type="number"
        />

        <Input
          icon={Gauge}
          label="Diastolic BP"
          value={diastolic}
          onChange={setDiastolic}
          placeholder="Example: 80"
          type="number"
        />

        <Input
          icon={Thermometer}
          label="Temperature in °C"
          value={temperature}
          onChange={setTemperature}
          placeholder="Example: 36.8"
          type="number"
        />

        <OptionGroup
          title="Baby movement"
          options={Object.entries(movementLabels).map(([id, label]) => ({
            id,
            label,
          }))}
          active={movement}
          setActive={setMovement}
        />

        <AnalysisBox analysis={currentAnalysis} />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={saveVitals}
            className="rounded-2xl bg-blue-900 py-3 text-sm font-bold text-white"
          >
            Save Vitals
          </button>

          <button
            onClick={() => go("risk")}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            View Risk
          </button>
        </div>
      </Card>

      {(syncStatus.loading || syncStatus.message || syncStatus.error) && (
        <Card>
          {syncStatus.loading && (
            <p className="text-sm font-semibold text-slate-600">
              Syncing vitals to backend...
            </p>
          )}

          {syncStatus.message && (
            <p className="text-sm font-semibold text-green-700">
              {syncStatus.message}
            </p>
          )}

          {syncStatus.error && (
            <p className="text-sm font-semibold text-orange-700">
              {syncStatus.error}
            </p>
          )}
        </Card>
      )}

      <HistoryCard
        title="Vitals history"
        emptyText="No vitals have been saved yet."
        items={vitalsHistory}
        render={(entry) => (
          <HistoryItem
            key={entry.id}
            badge={entry.analysis.level}
            date={entry.date}
            items={[
              `Weight: ${entry.weightKg || "—"} kg`,
              `BP: ${entry.systolic}/${entry.diastolic}`,
              `Temp: ${entry.temperature}°C`,
              `Source: ${entry.facility || "Not specified"}`,
              `Movement: ${entry.movementLabel}`,
            ]}
            notes={entry.analysis.notes}
            onDelete={() => deleteVitals(entry.id)}
          />
        )}
      />
    </Page>
  );
}

function WellnessPage({ wellnessHistory, setWellnessHistory, go }) {
  const [mood, setMood] = useState("okay");
  const [energy, setEnergy] = useState("Medium");
  const [sleep, setSleep] = useState("Medium");
  const [stress, setStress] = useState("Medium");
  const [note, setNote] = useState("");
  const [syncStatus, setSyncStatus] = useState({ loading: false, message: "", error: "" });

  const moodLabel = moodOptions.find((item) => item.id === mood)?.label || mood;

  const currentAnalysis = analyzeWellness({
    mood,
    energy,
    sleep,
    stress,
    note,
  });

  const saveWellness = async () => {
    const newEntry = {
      id: Date.now(),
      date: formatDateTime(),
      mood,
      moodLabel,
      energy,
      sleep,
      stress,
      note: note.trim(),
      analysis: currentAnalysis,
      syncStatus: "pending",
    };

    setWellnessHistory((prev) => [newEntry, ...prev]);

    setMood("okay");
    setEnergy("Medium");
    setSleep("Medium");
    setStress("Medium");
    setNote("");

    try {
      setSyncStatus({ loading: true, message: "", error: "" });

      const saved = await wellnessApi.create(mapWellnessLogToApi(newEntry));

      setWellnessHistory((prev) =>
        prev.map((item) =>
          item.id === newEntry.id
            ? { ...item, backendId: saved.id, syncStatus: "synced" }
            : item
        )
      );

      setSyncStatus({
        loading: false,
        message: "Wellness log saved locally and synced to backend.",
        error: "",
      });
    } catch (error) {
      setSyncStatus({
        loading: false,
        message: "",
        error:
          "Wellness log saved locally, but backend sync failed. Check backend/login and try later.",
      });
    }
  };

  const deleteWellness = (id) => {
    setWellnessHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const repeatedHighStress =
    wellnessHistory.filter((item) => item.stress === "High").length >= 2;

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-teal-700">Mother wellness</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Track your mood and wellbeing
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Pregnancy is not only physical. MamaCare also helps the mother track
          mood, stress, sleep, and energy.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">
            How is your mood today?
          </p>

          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((item) => {
              const Icon = item.icon;
              const active = mood === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setMood(item.id)}
                  className={`rounded-2xl border p-4 text-left ${
                    active
                      ? "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <p className="mt-2 text-sm font-bold">{item.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <OptionGroup
          title="Energy level"
          options={levelOptions.map((item) => ({ id: item, label: item }))}
          active={energy}
          setActive={setEnergy}
        />

        <OptionGroup
          title="Sleep quality"
          options={levelOptions.map((item) => ({ id: item, label: item }))}
          active={sleep}
          setActive={setSleep}
        />

        <OptionGroup
          title="Stress level"
          options={levelOptions.map((item) => ({ id: item, label: item }))}
          active={stress}
          setActive={setStress}
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Optional note
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write anything affecting your mood today..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <AnalysisBox analysis={currentAnalysis} />

        {repeatedHighStress && (
          <div className="rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-orange-700">
            MamaCare noticed repeated high stress in your history. Consider
            talking to someone you trust or mentioning it during ANC.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={saveWellness}
            className="rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white"
          >
            Save Wellness
          </button>

          <button
            onClick={() => go("risk")}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            View Risk
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Wellness insight</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Emotional wellbeing matters during pregnancy. Low mood, anxiety, poor
          sleep, and high stress should be taken seriously, especially if they
          continue for many days.
        </p>
      </Card>

      {(syncStatus.loading || syncStatus.message || syncStatus.error) && (
        <Card>
          {syncStatus.loading && (
            <p className="text-sm font-semibold text-slate-600">
              Syncing wellness log to backend...
            </p>
          )}

          {syncStatus.message && (
            <p className="text-sm font-semibold text-green-700">
              {syncStatus.message}
            </p>
          )}

          {syncStatus.error && (
            <p className="text-sm font-semibold text-orange-700">
              {syncStatus.error}
            </p>
          )}
        </Card>
      )}

      <HistoryCard
        title="Wellness history"
        emptyText="No wellness logs have been saved yet."
        items={wellnessHistory}
        render={(entry) => (
          <HistoryItem
            key={entry.id}
            badge={entry.analysis.level}
            date={entry.date}
            items={[
              `Mood: ${entry.moodLabel}`,
              `Energy: ${entry.energy}`,
              `Sleep: ${entry.sleep}`,
              `Stress: ${entry.stress}`,
            ]}
            notes={[
              ...entry.analysis.notes,
              ...(entry.note ? [`Note: ${entry.note}`] : []),
            ]}
            onDelete={() => deleteWellness(entry.id)}
          />
        )}
      />
    </Page>
  );
}

function MovementPage({ movementHistory, setMovementHistory, go }) {
  const [count, setCount] = useState(0);
  const [feeling, setFeeling] = useState("normal");
  const [note, setNote] = useState("");

  const feelingLabels = {
    normal: "Normal movement",
    less: "Less than usual",
    none: "No movement felt",
  };

  const currentAnalysis = analyzeMovementSession({ count, feeling });

  const saveMovement = async () => {
    const newEntry = {
      id: Date.now(),
      date: formatDateTime(),
      count,
      feeling,
      feelingLabel: feelingLabels[feeling],
      note: note.trim(),
      analysis: currentAnalysis,
      syncStatus: "pending",
    };

    setMovementHistory((prev) => [newEntry, ...prev]);
    setCount(0);
    setFeeling("normal");
    setNote("");

    const sync = await safeBackendSync(() =>
      babyMovementApi.create(mapBabyMovementToApi(newEntry))
    );

    if (sync.ok) {
      setMovementHistory((prev) =>
        prev.map((entry) =>
          entry.id === newEntry.id
            ? { ...entry, backendId: sync.result.id, syncStatus: "synced" }
            : entry
        )
      );
    }
  };

  const deleteMovement = (id) => {
    setMovementHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-indigo-700">Baby movement</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Count baby movements
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tap the counter whenever you feel a kick, roll, stretch, or movement.
          This helps the mother notice reduced movement early.
        </p>
      </div>

      <Card className="space-y-4 bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">Movements counted</p>
          <p className="mt-2 text-6xl font-extrabold text-indigo-700">{count}</p>
          <p className="mt-2 text-xs text-slate-500">Target: 10 movements in a counting session</p>
        </div>

        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="w-full rounded-3xl bg-indigo-600 py-5 text-lg font-extrabold text-white shadow-lg"
        >
          Count Movement
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
            className="rounded-2xl bg-white py-3 text-sm font-bold text-slate-700 shadow-sm"
          >
            Undo
          </button>

          <button
            onClick={() => setCount(0)}
            className="rounded-2xl bg-white py-3 text-sm font-bold text-slate-700 shadow-sm"
          >
            Reset
          </button>
        </div>

        <OptionGroup
          title="How does movement feel today?"
          options={Object.entries(feelingLabels).map(([id, label]) => ({
            id,
            label,
          }))}
          active={feeling}
          setActive={setFeeling}
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Optional note</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Example: movements were weaker than usual, baby active after eating..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <AnalysisBox analysis={currentAnalysis} />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={saveMovement}
            className="rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white"
          >
            Save Check
          </button>

          <button
            onClick={() => go("risk")}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            View Risk
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Movement safety note</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Every baby has a normal pattern. If movement is clearly reduced, absent,
          or worrying to the mother, she should seek medical care urgently instead
          of waiting for the app.
        </p>
      </Card>

      <HistoryCard
        title="Movement history"
        emptyText="No movement checks have been saved yet."
        items={movementHistory}
        render={(entry) => (
          <HistoryItem
            key={entry.id}
            badge={entry.analysis.level}
            date={entry.date}
            items={[
              `${entry.count} movements counted`,
              `Feeling: ${entry.feelingLabel}`,
            ]}
            notes={[
              ...entry.analysis.notes,
              ...(entry.note ? [`Note: ${entry.note}`] : []),
            ]}
            onDelete={() => deleteMovement(entry.id)}
          />
        )}
      />
    </Page>
  );
}

function RiskAwarenessPage({
  risk,
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  mother,
  go,
}) {
  const explanation = getRiskExplanation(risk);
  const guide = getWeeklyGuide(mother.week);
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];

  const predefinedLabels = selectedSymptoms.map(
    (id) => symptoms.find((item) => item.id === id)?.label || id
  );

  const customLabels = customSymptoms.map((item) => item.text);
  const currentSymptoms = [...predefinedLabels, ...customLabels];

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-orange-600">
          Risk awareness
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Understand your risk level
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          MamaCare explains why your symptoms, vitals, baby movement, or wellness
          were marked as Normal, Watch, or Urgent.
        </p>
      </div>

      <div
        className={`rounded-[2rem] p-6 text-white shadow-lg ${
          risk === "urgent"
            ? "bg-red-500"
            : risk === "watch"
            ? "bg-orange-500"
            : "bg-green-500"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">Current risk level</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              {explanation.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/90">
              {explanation.meaning}
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-4">
            <ShieldAlert className="h-9 w-9" />
          </div>
        </div>
      </div>

      <AIInsightCard
        selectedSymptoms={selectedSymptoms}
        customSymptoms={customSymptoms}
        symptomHistory={symptomHistory}
        vitalsHistory={vitalsHistory}
        wellnessHistory={wellnessHistory}
        movementHistory={movementHistory}
        risk={risk}
        mother={mother}
      />

      <Shortcut
        icon={Bell}
        title="Notifications & reminders"
        subtitle="ANC, medication, movement, wellness, records, and emergency readiness"
        onClick={() => go("notifications")}
        color="bg-blue-50 text-blue-900"
      />

      <Card>
        <h3 className="font-bold text-slate-900">Current symptoms checked</h3>

        {currentSymptoms.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            No current symptoms have been selected or typed.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {currentSymptoms.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </Card>

      {latestVitals && (
        <SummaryCard
          title="Latest vitals checked"
          badge={latestVitals.analysis.level}
          date={latestVitals.date}
          items={[
            `BP: ${latestVitals.systolic}/${latestVitals.diastolic}`,
            `Temp: ${latestVitals.temperature}°C`,
            `Movement: ${latestVitals.movementLabel}`,
          ]}
        />
      )}

      {latestMovement && (
        <SummaryCard
          title="Latest movement checked"
          badge={latestMovement.analysis.level}
          date={latestMovement.date}
          items={[
            `${latestMovement.count} movements counted`,
            `Feeling: ${latestMovement.feelingLabel}`,
            ...(latestMovement.note ? [`Note: ${latestMovement.note}`] : []),
          ]}
        />
      )}

      {latestWellness && (
        <SummaryCard
          title="Latest wellness checked"
          badge={latestWellness.analysis.level}
          date={latestWellness.date}
          items={[
            `Mood: ${latestWellness.moodLabel}`,
            `Energy: ${latestWellness.energy}`,
            `Sleep: ${latestWellness.sleep}`,
            `Stress: ${latestWellness.stress}`,
          ]}
        />
      )}

      <Card>
        <h3 className="font-bold text-slate-900">Pregnancy week context</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          You are currently in Week {mother.week}. {guide.warning}
        </p>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Recommended action</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {explanation.action}
        </p>

        <div className="mt-5 grid grid-cols-5 gap-2">
          <button
            onClick={() => go("log")}
            className="rounded-2xl bg-blue-900 py-3 text-xs font-bold text-white"
          >
            Symptoms
          </button>

          <button
            onClick={() => go("vitals")}
            className="rounded-2xl bg-teal-600 py-3 text-xs font-bold text-white"
          >
            Vitals
          </button>

          <button
            onClick={() => go("movement")}
            className="rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white"
          >
            Move
          </button>

          <button
            onClick={() => go("wellness")}
            className="rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white"
          >
            Wellness
          </button>

          <button
            onClick={() => go("emergency")}
            className="rounded-2xl bg-red-500 py-3 text-xs font-bold text-white"
          >
            SOS
          </button>
        </div>
      </Card>
    </Page>
  );
}


function DailyTipsPage({ mother, savedTipIds, setSavedTipIds, readTipIds, setReadTipIds, go }) {
  const [filter, setFilter] = useState("All");
  const tips = getDailyTips(mother.week);
  const categories = ["All", ...Array.from(new Set(tips.map((tip) => tip.category)))];
  const filteredTips = filter === "All" ? tips : tips.filter((tip) => tip.category === filter);

  const toggleSaved = (id) => {
    setSavedTipIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
    );
  };

  const markRead = (id) => {
    setReadTipIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  };

  const readCount = tips.filter((tip) => readTipIds.includes(tip.id)).length;
  const progress = Math.round((readCount / tips.length) * 100);

  return (
    <Page>
      <div
        className="rounded-[2rem] p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-blue-100">Daily pregnancy feed</p>
            <h1 className="mt-2 text-2xl font-extrabold">
              Guidance for Week {mother.week}
            </h1>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              Flo-style daily cards adapted for safer pregnancy care, ANC readiness,
              nutrition, danger signs, baby growth, and mother wellbeing.
            </p>
          </div>
          <div className="rounded-full bg-white/20 p-4">
            <BookOpen className="h-9 w-9" />
          </div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Reading progress</h3>
            <p className="mt-1 text-xs text-slate-500">
              {readCount} of {tips.length} cards read
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-blue-900" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
              filter === category
                ? "bg-blue-900 text-white"
                : "bg-white text-slate-600 border border-slate-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTips.map((tip) => {
          const Icon = tip.icon;
          const saved = savedTipIds.includes(tip.id);
          const read = readTipIds.includes(tip.id);

          return (
            <Card key={tip.id} className={read ? "bg-white" : "bg-gradient-to-br from-white to-teal-50"}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-sky-50 p-3">
                  <Icon className="h-6 w-6 text-blue-900" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {tip.category}
                    </span>
                    {read && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Read
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tip.text}</p>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Suggested action
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                      {tip.action}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => markRead(tip.id)}
                      className="rounded-2xl bg-blue-900 py-3 text-xs font-bold text-white"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => toggleSaved(tip.id)}
                      className={`rounded-2xl py-3 text-xs font-bold ${
                        saved
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {savedTipIds.length > 0 && (
        <Card>
          <h3 className="font-bold text-slate-900">Saved cards</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            You have saved {savedTipIds.length} card{savedTipIds.length === 1 ? "" : "s"} for later review.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => go("log")}
          className="rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white"
        >
          Log Symptoms
        </button>
        <button
          onClick={() => go("anc")}
          className="rounded-2xl bg-teal-600 py-3 text-xs font-bold text-white"
        >
          ANC Checklist
        </button>
      </div>
    </Page>
  );
}



function FloatingMamaCareChat({
  mother,
  risk,
  chatHistory,
  setChatHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  symptomHistory,
  healthRecords,
  emergencyPlan,
  postnatalCare,
  go,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiStatus, setAiStatus] = useState({ loading: false, error: "" });

  const quickQuestions = [
    "What should I do if my baby is not moving?",
    "How do I understand my blood pressure?",
    "What should I carry for ANC?",
    "How do I prepare for delivery?",
  ];

  const askQuestion = async (text = question) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion || aiStatus.loading) return;

    setQuestion("");
    setIsOpen(true);
    setAiStatus({ loading: true, error: "" });

    try {
      const data = await aiApi.ask({
        question: cleanQuestion,
        context: {
          mother,
          risk,
          latestVitals: vitalsHistory[0] || null,
          latestWellness: wellnessHistory[0] || null,
          latestMovement: movementHistory[0] || null,
          latestSymptoms: symptomHistory[0] || null,
          healthRecords,
          emergencyPlan,
          postnatalCare,
        },
      });

      const reply = data.reply || generateMamaCareChatReply({
        question: cleanQuestion,
        mother,
        risk,
        vitalsHistory,
        wellnessHistory,
        movementHistory,
        symptomHistory,
        healthRecords,
        emergencyPlan,
        postnatalCare,
      });

      const newEntry = {
        id: Date.now(),
        date: formatDateTime(),
        question: cleanQuestion,
        reply,
        aiSource: data.source || "backend-ai",
      };

      setChatHistory((prev) => [newEntry, ...prev]);
      setAiStatus({ loading: false, error: "" });
    } catch (error) {
      const fallbackReply = generateMamaCareChatReply({
        question: cleanQuestion,
        mother,
        risk,
        vitalsHistory,
        wellnessHistory,
        movementHistory,
        symptomHistory,
        healthRecords,
        emergencyPlan,
        postnatalCare,
      });

      const newEntry = {
        id: Date.now(),
        date: formatDateTime(),
        question: cleanQuestion,
        reply: fallbackReply,
        aiSource: "local-fallback",
      };

      setChatHistory((prev) => [newEntry, ...prev]);
      setAiStatus({
        loading: false,
        error:
          "Real AI is unavailable, so MamaCare used the local safety assistant. Check backend AI setup if this continues.",
      });
    }
  };

  const clearChat = () => setChatHistory([]);
  const latestMessage = chatHistory[0];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[70] w-[calc(100vw-2rem)] max-w-sm lg:bottom-6 lg:right-6 rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
          <div
            className="rounded-t-[2rem] p-4 text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/20 p-3">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold">Ask MamaCare</p>
                  <p className="text-xs text-blue-50">Safety-first pregnancy assistant</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="max-h-[58vh] space-y-4 overflow-y-auto p-4">
            <div className="rounded-2xl bg-blue-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-900">
                MamaCare AI note
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-900">
                I use real backend AI when available, together with your saved symptoms,
                vitals, movement, records, emergency plan, and postnatal data. I do not replace a health worker.
              </p>
            </div>

            {aiStatus.loading && (
              <div className="rounded-2xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">
                MamaCare AI is thinking...
              </div>
            )}

            {aiStatus.error && (
              <div className="rounded-2xl bg-orange-50 p-3 text-xs font-semibold leading-5 text-orange-700">
                {aiStatus.error}
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Quick questions
              </p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {quickQuestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => askQuestion(item)}
                    className="min-w-[190px] rounded-2xl bg-slate-100 px-3 py-2 text-left text-xs font-semibold leading-5 text-slate-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {latestMessage ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">{latestMessage.date}</p>
                    <RiskPill risk={latestMessage.reply.level} />
                  </div>

                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    You asked
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-800">
                    {latestMessage.question}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">
                      {latestMessage.reply.title}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                      {latestMessage.aiSource === "local-fallback" ? "Local" : "AI"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {latestMessage.reply.message}
                  </p>
                  <p className="mt-3 rounded-2xl bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-900">
                    {latestMessage.reply.action}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  Hi {mother.name || "Mama"}, what would you like to ask?
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  You can ask about symptoms, ANC, medication, baby movement,
                  delivery, or postnatal care.
                </p>
              </div>
            )}

            {chatHistory.length > 1 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Previous questions
                  </p>
                  <button onClick={clearChat} className="text-xs font-bold text-red-500">
                    Clear
                  </button>
                </div>

                <div className="space-y-2">
                  {chatHistory.slice(1, 4).map((item) => (
                    <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-700">
                        {item.question}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.reply.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {latestMessage?.reply?.level === "urgent" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  go("emergency");
                }}
                className="w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white"
              >
                Open Emergency Help
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask MamaCare..."
                rows={2}
                className="max-h-24 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => askQuestion()}
                disabled={aiStatus.loading}
                className={`rounded-2xl p-3 text-white ${
                  aiStatus.loading ? "bg-slate-400" : "bg-blue-900"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 right-4 z-[80] lg:bottom-6 lg:right-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white shadow-2xl ring-4 ring-white"
        aria-label="Open Ask MamaCare chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </>
  );
}

function ChatPage({
  mother,
  risk,
  chatHistory,
  setChatHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  symptomHistory,
  healthRecords,
  emergencyPlan,
  postnatalCare,
  go,
}) {
  const [question, setQuestion] = useState("");

  const quickQuestions = [
    "What should I do if my baby is not moving?",
    "How do I understand my blood pressure?",
    "What should I carry for ANC?",
    "How do I prepare for delivery?",
    "What newborn danger signs should I watch?",
  ];

  const askQuestion = (text = question) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion) return;

    const reply = generateMamaCareChatReply({
      question: cleanQuestion,
      mother,
      risk,
      vitalsHistory,
      wellnessHistory,
      movementHistory,
      symptomHistory,
      healthRecords,
      emergencyPlan,
      postnatalCare,
    });

    const newEntry = {
      id: Date.now(),
      date: formatDateTime(),
      question: cleanQuestion,
      reply,
    };

    setChatHistory((prev) => [newEntry, ...prev]);
    setQuestion("");
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-blue-700">Ask MamaCare</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          AI pregnancy assistant
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ask simple pregnancy questions. MamaCare answers using your saved
          symptoms, vitals, movement, records, emergency plan, and postnatal data.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-900 p-3 text-white">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Safety-first assistant</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              MamaCare can guide and organize information, but it does not
              diagnose. For bleeding, severe pain, reduced baby movement,
              convulsions, breathing difficulty, or serious distress, seek care
              urgently.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-slate-900">Ask a question</p>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: I have a headache and my feet are swollen, what should I do?"
          rows={4}
          className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={() => askQuestion()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3 text-sm font-bold text-white"
        >
          Ask MamaCare
          <Send className="h-4 w-4" />
        </button>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Quick questions</h3>
        <div className="mt-4 space-y-3">
          {quickQuestions.map((item) => (
            <button
              key={item}
              onClick={() => askQuestion(item)}
              className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-left text-sm font-semibold text-slate-700"
            >
              {item}
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Chat history</h3>
          {chatHistory.length > 0 && (
            <button onClick={clearChat} className="text-xs font-bold text-red-500">
              Clear
            </button>
          )}
        </div>

        {chatHistory.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            No questions yet. Ask MamaCare something about symptoms, ANC,
            medicine, baby movement, delivery, or postnatal care.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {chatHistory.map((item) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{item.date}</p>
                  <RiskPill risk={item.reply.level} />
                </div>

                <div className="mt-3 rounded-2xl bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    You asked
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-800">
                    {item.question}
                  </p>
                </div>

                <div className="mt-3 rounded-2xl bg-white p-3">
                  <p className="text-sm font-bold text-slate-900">
                    {item.reply.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.reply.message}
                  </p>
                  <p className="mt-3 rounded-2xl bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-900">
                    {item.reply.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Shortcut
        icon={Siren}
        title="Open Emergency Help"
        subtitle="Use this immediately for serious danger signs"
        onClick={() => go("emergency")}
        color="bg-red-50 text-red-600"
      />
    </Page>
  );
}


function InsightsDashboardPage({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  appointments,
  medications,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  completedANC,
  completedBirth,
  go,
}) {
  const pregnancyProgress = Math.min(Math.round((Number(mother.week || 1) / 40) * 100), 100);
  const nextAppointment = getNextAppointment(appointments, mother);
  const nextMedication = getNextMedication(medications);
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];
  const latestSymptom = symptomHistory[0];
  const postnatalSummary = getPostnatalSummary(postnatalCare);

  const emergencyFields = [
    emergencyPlan?.nearestFacility,
    emergencyPlan?.facilityPhone,
    emergencyPlan?.transportName,
    emergencyPlan?.transportPhone,
    emergencyPlan?.supportPerson,
    emergencyPlan?.supportPhone,
    emergencyPlan?.cashPlan,
  ];
  const emergencyReady = Math.round((emergencyFields.filter(Boolean).length / emergencyFields.length) * 100);

  const recordFields = [
    healthRecords?.ancNumber,
    healthRecords?.bloodGroup,
    healthRecords?.allergies,
    healthRecords?.knownConditions,
    healthRecords?.currentFacility,
    healthRecords?.scanNotes,
    healthRecords?.labNotes,
  ];
  const recordsReady = Math.round((recordFields.filter(Boolean).length / recordFields.length) * 100);

  const ancProgress = Math.round((completedANC.length / Math.max(ancChecklist.length, 1)) * 100);
  const birthProgress = Math.round((completedBirth.length / Math.max(birthChecklist.length, 1)) * 100);
  const takenMeds = medications.filter((item) => item.taken).length;
  const medicationProgress = medications.length
    ? Math.round((takenMeds / medications.length) * 100)
    : 0;

  const urgentCount = [
    ...symptomHistory.map((item) => item.risk),
    ...vitalsHistory.map((item) => item.analysis?.level),
    ...wellnessHistory.map((item) => item.analysis?.level),
    ...movementHistory.map((item) => item.analysis?.level),
  ].filter((item) => item === "urgent").length;

  const watchCount = [
    ...symptomHistory.map((item) => item.risk),
    ...vitalsHistory.map((item) => item.analysis?.level),
    ...wellnessHistory.map((item) => item.analysis?.level),
    ...movementHistory.map((item) => item.analysis?.level),
  ].filter((item) => item === "watch").length;

  const insightActions = [];

  if (risk === "urgent") {
    insightActions.push("Current data shows an urgent risk signal. Open Emergency Help or contact care immediately.");
  }
  if (!appointments.length) {
    insightActions.push("Add your next ANC appointment so MamaCare can keep it visible on the dashboard.");
  }
  if (emergencyReady < 70) {
    insightActions.push("Complete the emergency plan with facility, transport, support person, and cash/mobile money plan.");
  }
  if (!medications.length) {
    insightActions.push("Add medication or supplement reminders for iron, folic acid, or prescribed medicine.");
  }
  if (!movementHistory.length && Number(mother.week) >= 20) {
    insightActions.push("Start logging baby movement checks so reduced movement can be noticed earlier.");
  }
  if (recordsReady < 50) {
    insightActions.push("Add health records such as ANC number, blood group, allergies, scans, and lab notes.");
  }
  if (insightActions.length === 0) {
    insightActions.push("Your dashboard looks well maintained. Keep logging symptoms, vitals, wellness, movement, and appointments regularly.");
  }

  return (
    <Page>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          className="rounded-[2rem] p-6 text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          }}
        >
          <p className="text-sm font-semibold text-blue-100">Mother progress dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold">Your pregnancy insights</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50">
            A full overview of pregnancy progress, risk patterns, ANC readiness, medicines, baby movement, wellness, health records, and emergency preparedness.
          </p>

          <div className="mt-6 h-3 rounded-full bg-white/20">
            <div className="h-3 rounded-full bg-white" style={{ width: `${pregnancyProgress}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-blue-50">
            <span>Week {mother.week}</span>
            <span>{pregnancyProgress}% of 40 weeks</span>
            <span>Due: {formatDisplayDate(mother.dueDate)}</span>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Current safety status</p>
              <p className="mt-1 text-xs text-slate-500">Based on symptoms, vitals, wellness, and movement.</p>
            </div>
            <RiskPill risk={risk} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <InsightMini label="Urgent logs" value={urgentCount} />
            <InsightMini label="Watch logs" value={watchCount} />
          </div>

          <button
            onClick={() => go("risk")}
            className="mt-4 w-full rounded-2xl bg-blue-900 py-3 text-sm font-bold text-white"
          >
            Open Risk Awareness
          </button>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="ANC readiness"
          value={`${ancProgress}%`}
          subtitle={`${completedANC.length} of ${ancChecklist.length} checklist items done`}
          onClick={() => go("anc")}
        />
        <InsightCard
          title="Birth preparation"
          value={`${birthProgress}%`}
          subtitle={`${completedBirth.length} of ${birthChecklist.length} checklist items done`}
          onClick={() => go("birth")}
        />
        <InsightCard
          title="Emergency plan"
          value={`${emergencyReady}%`}
          subtitle={emergencyPlan?.nearestFacility || "Facility not fully added"}
          onClick={() => go("emergencyPlan")}
        />
        <InsightCard
          title="Health records"
          value={`${recordsReady}%`}
          subtitle={healthRecords?.ancNumber ? `ANC No: ${healthRecords.ancNumber}` : "Records still incomplete"}
          onClick={() => go("records")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-bold text-slate-900">Next care actions</h3>
          <div className="mt-4 space-y-3">
            <InsightRow label="Next ANC" value={`${nextAppointment.dateText} • ${nextAppointment.location}`} onClick={() => go("anc")} />
            <InsightRow label="Next medication" value={nextMedication ? `${nextMedication.name} • ${formatMedicationTime(nextMedication.time)}` : "No medication reminder added"} onClick={() => go("medications")} />
            <InsightRow label="Postnatal status" value={postnatalSummary.ready ? postnatalSummary.date : "Not set yet"} onClick={() => go("postnatal")} />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-900">Latest monitoring logs</h3>
          <div className="mt-4 space-y-3">
            <InsightRow label="Symptoms" value={latestSymptom ? `${latestSymptom.risk} • ${latestSymptom.date}` : "No symptom log yet"} onClick={() => go("log")} />
            <InsightRow label="Vitals" value={latestVitals ? `${latestVitals.systolic}/${latestVitals.diastolic} BP • ${latestVitals.date}` : "No vitals logged yet"} onClick={() => go("vitals")} />
            <InsightRow label="Movement" value={latestMovement ? `${latestMovement.count} movements • ${latestMovement.feelingLabel}` : "No movement check yet"} onClick={() => go("movement")} />
            <InsightRow label="Wellness" value={latestWellness ? `${latestWellness.moodLabel} mood • Stress ${latestWellness.stress}` : "No wellness log yet"} onClick={() => go("wellness")} />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-900">MamaCare recommendations</h3>
          <div className="mt-4 space-y-3">
            {insightActions.slice(0, 5).map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button onClick={() => go("log")} className="rounded-3xl bg-slate-900 p-5 text-left text-white">
          <Plus className="h-6 w-6" />
          <p className="mt-4 font-bold">Log symptoms</p>
          <p className="mt-1 text-xs text-slate-300">Update today’s condition</p>
        </button>
        <button onClick={() => go("vitals")} className="rounded-3xl bg-blue-900 p-5 text-left text-white">
          <Gauge className="h-6 w-6" />
          <p className="mt-4 font-bold">Log vitals</p>
          <p className="mt-1 text-xs text-blue-100">BP, temperature, movement status</p>
        </button>
        <button onClick={() => go("movement")} className="rounded-3xl bg-indigo-600 p-5 text-left text-white">
          <Baby className="h-6 w-6" />
          <p className="mt-4 font-bold">Count movement</p>
          <p className="mt-1 text-xs text-indigo-100">Track baby kicks and rolls</p>
        </button>
        <button onClick={() => go("emergency")} className="rounded-3xl bg-red-500 p-5 text-left text-white">
          <Siren className="h-6 w-6" />
          <p className="mt-4 font-bold">Emergency help</p>
          <p className="mt-1 text-xs text-red-100">Open SOS support</p>
        </button>
      </div>
    </Page>
  );
}

function InsightMini({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function InsightCard({ title, value, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className="h-full hover:bg-slate-50">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-3 text-3xl font-extrabold text-blue-900">{value}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
      </Card>
    </button>
  );
}

function InsightRow({ label, value, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3 text-left hover:bg-slate-100">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{value}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

function LearnPage({ go }) {
  return (
    <Page>
      <h1 className="text-2xl font-bold text-slate-900">Learn</h1>

      <p className="text-sm leading-6 text-slate-600">
        Simple pregnancy guidance for safer motherhood, written in a friendly way
        for mothers.
      </p>

      <div className="space-y-4">
        {learnCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-sky-50 p-3">
                  <Icon className="h-6 w-6 text-sky-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{card.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.text}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            </Card>
          );
        })}
      </div>

      <Shortcut
        icon={BookOpen}
        title="Daily pregnancy feed"
        subtitle="Week-by-week safety, nutrition, and ANC tips"
        onClick={() => go("tips")}
        color="bg-sky-50 text-blue-900"
      />

      <Shortcut
        icon={ListTodo}
        title="Smart care plan"
        subtitle="View personalized pregnancy next steps"
        onClick={() => go("carePlan")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={IdCard}
        title="Digital health cards"
        subtitle="View printable ANC and emergency cards"
        onClick={() => go("digitalCards")}
        color="bg-teal-50 text-teal-700"
      />

      <Shortcut
        icon={MessageSquareText}
        title="ANC questions builder"
        subtitle="Prepare what to ask before ANC"
        onClick={() => go("ancQuestions")}
        color="bg-indigo-50 text-indigo-700"
      />

      <Shortcut
        icon={Timeline}
        title="Journey timeline"
        subtitle="See a full timeline of saved pregnancy activities"
        onClick={() => go("timeline")}
        color="bg-teal-50 text-teal-700"
      />

      <Shortcut
        icon={ShieldAlert}
        title="Risk awareness guide"
        subtitle="Learn what Normal, Watch, and Urgent mean"
        onClick={() => go("risk")}
        color="bg-orange-50 text-orange-600"
      />

      <Shortcut
        icon={MapPinned}
        title="Emergency plan"
        subtitle="Prepare facility, transport, support, and cash details"
        onClick={() => go("emergencyPlan")}
        color="bg-red-50 text-red-600"
      />

      <Shortcut
        icon={FileText}
        title="Health records"
        subtitle="Save ANC number, allergies, blood group, scans, and lab notes"
        onClick={() => go("records")}
        color="bg-emerald-50 text-emerald-700"
      />

      <Shortcut
        icon={HeartPulse}
        title="Postnatal care"
        subtitle="Track recovery, feeding, bleeding, mood, and baby danger signs"
        onClick={() => go("postnatal")}
        color="bg-pink-50 text-pink-700"
      />

      <Shortcut
        icon={Gauge}
        title="Vitals monitoring"
        subtitle="Track BP, temperature, and movement"
        onClick={() => go("vitals")}
        color="bg-blue-50 text-blue-900"
      />

      <Shortcut
        icon={Baby}
        title="Baby movement counter"
        subtitle="Count kicks, rolls, and movement changes"
        onClick={() => go("movement")}
        color="bg-indigo-50 text-indigo-700"
      />

      <Shortcut
        icon={Smile}
        title="Mother wellness"
        subtitle="Track mood, sleep, energy, and stress"
        onClick={() => go("wellness")}
        color="bg-teal-50 text-teal-700"
      />

      <Shortcut
        icon={Pill}
        title="Medication reminders"
        subtitle="Track supplements and pregnancy medicines"
        onClick={() => go("medications")}
        color="bg-purple-50 text-purple-700"
      />

      <Shortcut
        icon={ClipboardList}
        title="Birth preparation checklist"
        subtitle="Prepare hospital items and emergency plan"
        onClick={() => go("birth")}
        color="bg-teal-50 text-teal-700"
      />
    </Page>
  );
}

function EmergencyPage({ mother, go, emergencyPlan, supportPeople = [] }) {
  const supportSummary = getSupportSummary(supportPeople);
  return (
    <Page>
      <div className="rounded-[2rem] bg-red-500 p-6 text-white shadow-lg">
        <Siren className="h-10 w-10" />

        <h1 className="mt-4 text-2xl font-extrabold">Emergency Help</h1>

        <p className="mt-2 text-sm leading-6 text-red-50">
          Use this page if you have bleeding, severe pain, convulsions, severe
          headache, blurred vision, fever, reduced baby movement, very high blood
          pressure, difficulty breathing, or serious emotional distress.
        </p>
      </div>

      {supportSummary.primary && (
        <button
          onClick={() => go("support")}
          className="flex w-full items-center justify-between rounded-3xl bg-white p-5 text-left shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <UserRound className="h-6 w-6 text-violet-600" />
            <div>
              <p className="font-bold text-slate-900">Primary support person</p>
              <p className="text-xs text-slate-500">
                {supportSummary.primary.name} {supportSummary.primary.phone ? `• ${supportSummary.primary.phone}` : ""}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </button>
      )}

      <button className="flex w-full items-center justify-between rounded-3xl bg-slate-900 p-5 text-left text-white shadow-sm">
        <div className="flex items-center gap-4">
          <Phone className="h-6 w-6" />

          <div>
            <p className="font-bold">Call emergency contact</p>
            <p className="text-xs text-slate-300">{mother.emergencyContact}</p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5" />
      </button>

      <button className="flex w-full items-center justify-between rounded-3xl bg-white p-5 text-left shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <MapPin className="h-6 w-6 text-teal-600" />

          <div>
            <p className="font-bold text-slate-900">Share my location</p>
            <p className="text-xs text-slate-500">{mother.location}</p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400" />
      </button>

      <button
        onClick={() => go("emergencyPlan")}
        className="flex w-full items-center justify-between rounded-3xl bg-white p-5 text-left shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4">
          <MapPinned className="h-6 w-6 text-red-500" />

          <div>
            <p className="font-bold text-slate-900">Open emergency plan</p>
            <p className="text-xs text-slate-500">
              {emergencyPlan?.nearestFacility || "Add facility and transport plan"}
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400" />
      </button>

      <InfoCard
        title="Before help arrives"
        text="Do not stay alone if symptoms are serious. Call your emergency contact immediately. Go to the nearest health facility as soon as possible. Carry your ANC card and current medicines if available."
      />
    </Page>
  );
}

function EmergencyPlanPage({ emergencyPlan, setEmergencyPlan, mother, go }) {
  const [nearestFacility, setNearestFacility] = useState(
    emergencyPlan.nearestFacility || ""
  );
  const [facilityPhone, setFacilityPhone] = useState(
    emergencyPlan.facilityPhone || ""
  );
  const [transportName, setTransportName] = useState(
    emergencyPlan.transportName || ""
  );
  const [transportPhone, setTransportPhone] = useState(
    emergencyPlan.transportPhone || ""
  );
  const [supportPerson, setSupportPerson] = useState(
    emergencyPlan.supportPerson || ""
  );
  const [supportPhone, setSupportPhone] = useState(
    emergencyPlan.supportPhone || ""
  );
  const [emergencyCash, setEmergencyCash] = useState(
    emergencyPlan.emergencyCash || ""
  );
  const [bloodGroup, setBloodGroup] = useState(emergencyPlan.bloodGroup || "");
  const [notes, setNotes] = useState(emergencyPlan.notes || "");
  const [checklist, setChecklist] = useState(emergencyPlan.checklist || []);

  const completedCount = checklist.length;
  const progress = Math.round((completedCount / emergencyChecklist.length) * 100);

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const savePlan = async () => {
    const plan = {
      nearestFacility,
      facilityPhone,
      transportName,
      transportPhone,
      supportPerson,
      supportPhone,
      emergencyCash,
      bloodGroup,
      notes,
      checklist,
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    setEmergencyPlan(plan);

    const sync = await safeBackendSync(() =>
      emergencyPlanApi.update(mapEmergencyPlanToApi(plan))
    );

    if (sync.ok) {
      setEmergencyPlan((prev) => ({
        ...prev,
        backendId: sync.result.id,
        syncStatus: "synced",
      }));
    }
  };

  const clearPlan = () => {
    setNearestFacility("");
    setFacilityPhone("");
    setTransportName("");
    setTransportPhone("");
    setSupportPerson("");
    setSupportPhone("");
    setEmergencyCash("");
    setBloodGroup("");
    setNotes("");
    setChecklist([]);
    setEmergencyPlan(defaultEmergencyPlan);
  };

  return (
    <Page>
      <div
        className="rounded-[2rem] p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.danger}, ${COLORS.primary})`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-red-50">Emergency readiness</p>
            <h1 className="mt-2 text-2xl font-extrabold">
              Birth transport and emergency plan
            </h1>
            <p className="mt-3 text-sm leading-6 text-red-50">
              Save the people, place, transport, and money plan needed when danger signs appear.
            </p>
          </div>
          <div className="rounded-full bg-white/20 p-4">
            <MapPinned className="h-9 w-9" />
          </div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Plan readiness</h3>
            <p className="mt-1 text-xs text-slate-500">
              {completedCount} of {emergencyChecklist.length} checklist items completed
            </p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-red-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <Input
          icon={MapPinned}
          label="Nearest health facility"
          value={nearestFacility}
          onChange={setNearestFacility}
          placeholder="Example: Mukono Health Centre IV"
        />

        <Input
          icon={Phone}
          label="Facility phone number"
          value={facilityPhone}
          onChange={setFacilityPhone}
          placeholder="Example: +256..."
        />

        <Input
          icon={MapPin}
          label="Transport person or service"
          value={transportName}
          onChange={setTransportName}
          placeholder="Example: boda/taxi/ambulance contact name"
        />

        <Input
          icon={Phone}
          label="Transport phone number"
          value={transportPhone}
          onChange={setTransportPhone}
          placeholder="Example: +256..."
        />

        <Input
          icon={UserRound}
          label="Support person"
          value={supportPerson}
          onChange={setSupportPerson}
          placeholder="Example: partner, mother, sister, friend"
        />

        <Input
          icon={Phone}
          label="Support person phone"
          value={supportPhone}
          onChange={setSupportPhone}
          placeholder="Example: +256..."
        />

        <Input
          icon={Droplets}
          label="Blood group or important medical note"
          value={bloodGroup}
          onChange={setBloodGroup}
          placeholder="Example: O+, allergy, previous C-section"
        />

        <Input
          icon={ClipboardList}
          label="Emergency cash / mobile money plan"
          value={emergencyCash}
          onChange={setEmergencyCash}
          placeholder="Example: 50,000 UGX saved on MoMo"
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Extra notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write anything important for emergency care..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={savePlan}
            className="rounded-2xl bg-red-500 py-3 text-sm font-bold text-white"
          >
            Save Plan
          </button>
          <button
            onClick={() => go("emergency")}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            Emergency
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Emergency checklist</h3>
        <div className="mt-4 space-y-3">
          {emergencyChecklist.map((item) => {
            const done = checklist.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left shadow-sm transition ${
                  done ? "border-red-200 bg-red-50" : "border-slate-100 bg-white"
                }`}
              >
                <div
                  className={`mt-1 rounded-full p-1 ${
                    done ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Saved plan summary</h3>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <p>• Mother location: {mother.location}</p>
          <p>• Facility: {nearestFacility || "Not added yet"}</p>
          <p>• Transport: {transportName || "Not added yet"} {transportPhone ? `(${transportPhone})` : ""}</p>
          <p>• Support person: {supportPerson || "Not added yet"} {supportPhone ? `(${supportPhone})` : ""}</p>
          <p>• Cash plan: {emergencyCash || "Not added yet"}</p>
          <p>• Medical note: {bloodGroup || "Not added yet"}</p>
        </div>
        {emergencyPlan.updatedAt && (
          <p className="mt-3 text-xs text-slate-500">
            Last saved: {emergencyPlan.updatedAt}
          </p>
        )}
        <button
          onClick={clearPlan}
          className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
        >
          Clear Plan
        </button>
      </Card>
    </Page>
  );
}

function ChecklistPage({
  title,
  subtitle,
  badge,
  items,
  completedItems,
  setCompletedItems,
  color = "teal",
}) {
  const completedCount = completedItems.length;
  const progress = Math.round((completedCount / items.length) * 100);

  const toggleTask = (id) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progressColor = color === "blue" ? "bg-blue-900" : "bg-teal-500";
  const badgeColor =
    color === "blue"
      ? "bg-blue-50 text-blue-900"
      : "bg-teal-50 text-teal-700";

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-teal-600">{badge}</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Preparation progress</h3>
            <p className="mt-1 text-xs text-slate-500">
              {completedCount} of {items.length} items completed
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
          >
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div
            className={`h-3 rounded-full ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((item) => {
          const done = completedItems.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left shadow-sm transition ${
                done
                  ? "border-teal-200 bg-teal-50"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div
                className={`mt-1 rounded-full p-1 ${
                  done ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Page>
  );
}


function MedicationPage({ medications, setMedications, go }) {
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("Iron tablets");
  const [customName, setCustomName] = useState("");
  const [dosage, setDosage] = useState("1 tablet");
  const [time, setTime] = useState("08:00");
  const [frequency, setFrequency] = useState("Daily");
  const [notes, setNotes] = useState("");

  const selectedName = name === "Other medicine" ? customName.trim() : name;

  const clearForm = () => {
    setEditId(null);
    setName("Iron tablets");
    setCustomName("");
    setDosage("1 tablet");
    setTime("08:00");
    setFrequency("Daily");
    setNotes("");
  };

  const saveMedication = async () => {
    if (!selectedName) return;

    const existingMedication = editId
      ? medications.find((item) => item.id === editId)
      : null;

    const medication = {
      id: editId || Date.now(),
      backendId: existingMedication?.backendId,
      name: selectedName,
      dosage: dosage || "As prescribed",
      time,
      frequency,
      notes: notes.trim(),
      takenHistory: editId ? existingMedication?.takenHistory || [] : [],
      createdAt: editId ? existingMedication?.createdAt || formatDateTime() : formatDateTime(),
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    if (editId) {
      setMedications((prev) =>
        prev.map((item) => (item.id === editId ? medication : item))
      );
    } else {
      setMedications((prev) => [medication, ...prev]);
    }

    clearForm();

    const sync = await safeBackendSync(() =>
      medication.backendId
        ? medicationsApi.update(medication.backendId, mapMedicationToApi(medication))
        : medicationsApi.create(mapMedicationToApi(medication))
    );

    if (sync.ok) {
      setMedications((prev) =>
        prev.map((item) =>
          item.id === medication.id
            ? { ...item, backendId: sync.result.id, syncStatus: "synced" }
            : item
        )
      );
    }
  };

  const editMedication = (medication) => {
    setEditId(medication.id);
    if (medicationSuggestions.includes(medication.name)) {
      setName(medication.name);
      setCustomName("");
    } else {
      setName("Other medicine");
      setCustomName(medication.name);
    }
    setDosage(medication.dosage || "1 tablet");
    setTime(medication.time || "08:00");
    setFrequency(medication.frequency || "Daily");
    setNotes(medication.notes || "");
  };

  const deleteMedication = async (id) => {
    const medication = medications.find((item) => item.id === id);
    setMedications((prev) => prev.filter((item) => item.id !== id));

    if (medication?.backendId) {
      await safeBackendSync(() => medicationsApi.remove(medication.backendId));
    }
  };

  const markTaken = async (id) => {
    const takenAt = formatDateTime();
    const medication = medications.find((item) => item.id === id);

    const updatedMedication = medication
      ? {
          ...medication,
          takenHistory: [takenAt, ...(medication.takenHistory || [])].slice(0, 7),
          lastTakenAt: new Date().toISOString(),
          updatedAt: takenAt,
          syncStatus: "pending",
        }
      : null;

    setMedications((prev) =>
      prev.map((item) => (item.id === id && updatedMedication ? updatedMedication : item))
    );

    if (updatedMedication?.backendId) {
      const sync = await safeBackendSync(() =>
        medicationsApi.update(updatedMedication.backendId, mapMedicationToApi(updatedMedication))
      );

      if (sync.ok) {
        setMedications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, syncStatus: "synced" } : item
          )
        );
      }
    }
  };

  const sortedMedications = [...medications].sort((a, b) => {
    const timeA = a.time || "23:59";
    const timeB = b.time || "23:59";
    return timeA.localeCompare(timeB);
  });

  const nextMedication = getNextMedication(sortedMedications);

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-purple-700">
          Medication reminders
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Track supplements and medicines
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add pregnancy supplements or medicines such as iron tablets, folic
          acid, malaria prevention, or medicines prescribed by a health worker.
        </p>
      </div>

      {nextMedication && (
        <div className="rounded-[2rem] bg-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-purple-100">Next reminder</p>
              <h2 className="mt-2 text-2xl font-extrabold">
                {nextMedication.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-purple-50">
                {formatMedicationTime(nextMedication.time)} •{" "}
                {nextMedication.frequency} • {nextMedication.dosage}
              </p>
            </div>

            <div className="rounded-full bg-white/20 p-4">
              <Pill className="h-9 w-9" />
            </div>
          </div>
        </div>
      )}

      <Card className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Medicine or supplement
          </p>

          <div className="grid grid-cols-1 gap-3">
            {medicationSuggestions.map((item) => (
              <button
                key={item}
                onClick={() => setName(item)}
                className={`rounded-2xl border p-4 text-left text-sm font-bold ${
                  name === item
                    ? "border-purple-400 bg-purple-50 text-purple-700"
                    : "border-slate-100 bg-white text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {name === "Other medicine" && (
          <Input
            icon={Pill}
            label="Custom medicine name"
            value={customName}
            onChange={setCustomName}
            placeholder="Example: Medicine name"
          />
        )}

        <Input
          icon={Pill}
          label="Dosage"
          value={dosage}
          onChange={setDosage}
          placeholder="Example: 1 tablet"
        />

        <Input
          icon={Clock3}
          label="Reminder time"
          value={time}
          onChange={setTime}
          placeholder="08:00"
          type="time"
        />

        <OptionGroup
          title="Frequency"
          options={frequencyOptions.map((item) => ({ id: item, label: item }))}
          active={frequency}
          setActive={setFrequency}
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Optional note
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: Take after breakfast..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={saveMedication}
            className="rounded-2xl bg-purple-600 py-3 text-sm font-bold text-white"
          >
            {editId ? "Update Reminder" : "Save Reminder"}
          </button>

          <button
            onClick={editId ? clearForm : () => go("learn")}
            className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            {editId ? "Cancel Edit" : "Learn"}
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Safety note</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          MamaCare helps with reminders only. The mother should take medicines
          and supplements according to health-worker guidance and should not
          start or stop prescribed medicine without medical advice.
        </p>
      </Card>

      <HistoryCard
        title="Saved medication reminders"
        emptyText="No medication reminders have been added yet."
        items={sortedMedications}
        render={(item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-purple-50 p-3">
                    <Pill className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatMedicationTime(item.time)} • {item.frequency}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                    {item.dosage}
                  </span>
                  {item.notes && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                      {item.notes}
                    </span>
                  )}
                </div>

                {item.takenHistory && item.takenHistory.length > 0 && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Last taken: {item.takenHistory[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => markTaken(item.id)}
                  className="rounded-2xl bg-green-100 px-3 py-2 text-xs font-bold text-green-700"
                >
                  Taken
                </button>

                <button
                  onClick={() => editMedication(item)}
                  className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-blue-900"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMedication(item.id)}
                  className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </Page>
  );
}

function ANCPage({ mother, completedANC, setCompletedANC, appointments, setAppointments }) {
  const nextAppointment = getNextAppointment(appointments, mother);
  const [title, setTitle] = useState("ANC visit");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [facility, setFacility] = useState(mother.location);
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aDate = new Date(`${a.date || "9999-12-31"}T${a.time || "08:00"}`);
    const bDate = new Date(`${b.date || "9999-12-31"}T${b.time || "08:00"}`);
    return aDate - bDate;
  });

  const resetForm = () => {
    setTitle("ANC visit");
    setDate("");
    setTime("08:00");
    setFacility(mother.location);
    setNotes("");
    setEditId(null);
  };

  const saveAppointment = async () => {
    if (!date) return;

    const existingAppointment = editId
      ? appointments.find((item) => item.id === editId)
      : null;

    const appointment = {
      id: editId || Date.now(),
      backendId: existingAppointment?.backendId,
      title: title || "ANC visit",
      type: title || "ANC visit",
      date,
      time: time || "08:00",
      facility: facility || mother.location,
      notes: notes.trim(),
      createdAt: editId ? existingAppointment?.createdAt : formatDateTime(),
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    if (editId) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...appointment } : item
        )
      );
    } else {
      setAppointments((prev) => [appointment, ...prev]);
    }

    resetForm();

    const sync = await safeBackendSync(() =>
      appointment.backendId
        ? appointmentsApi.update(appointment.backendId, mapAppointmentToApi(appointment))
        : appointmentsApi.create(mapAppointmentToApi(appointment))
    );

    if (sync.ok) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointment.id
            ? { ...item, backendId: sync.result.id, syncStatus: "synced" }
            : item
        )
      );
    }
  };

  const editAppointment = (appointment) => {
    setEditId(appointment.id);
    setTitle(appointment.title || "ANC visit");
    setDate(appointment.date || "");
    setTime(appointment.time || "08:00");
    setFacility(appointment.facility || mother.location);
    setNotes(appointment.notes || "");
  };

  const deleteAppointment = async (id) => {
    const appointment = appointments.find((item) => item.id === id);
    setAppointments((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) resetForm();

    if (appointment?.backendId) {
      await safeBackendSync(() => appointmentsApi.remove(appointment.backendId));
    }
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-teal-600">ANC care</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Appointments & Reminders
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add ANC appointment dates that the mother already received from the
          hospital or clinic. MamaCare does not book appointments; it only keeps
          reminders visible before and after the saved date.
        </p>
      </div>

      <div
        className="rounded-[2rem] p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-blue-100">Next appointment</p>

            <h2 className="mt-2 text-2xl font-extrabold">
              {nextAppointment.dateText}
            </h2>

            <p className="mt-2 text-sm font-semibold text-blue-50">
              {nextAppointment.title}
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-50">
              Location: {nextAppointment.location}
            </p>

            <p className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
              {nextAppointment.reminderStatus}: {nextAppointment.reminderMessage}
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-4">
            <CalendarDays className="h-9 w-9" />
          </div>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">
              {editId ? "Edit appointment" : "Add new appointment"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Save ANC visit dates, facility, time, and preparation notes.
            </p>
          </div>

          {editId && (
            <button
              onClick={resetForm}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>

        <Input
          icon={ClipboardList}
          label="Appointment title"
          value={title}
          onChange={setTitle}
          placeholder="Example: ANC visit"
        />

        <Input
          icon={CalendarDays}
          label="Appointment date"
          value={date}
          onChange={setDate}
          placeholder="Select date"
          type="date"
        />

        <Input
          icon={Clock3}
          label="Appointment time"
          value={time}
          onChange={setTime}
          placeholder="Select time"
          type="time"
        />

        <Input
          icon={MapPinned}
          label="Facility / location"
          value={facility}
          onChange={setFacility}
          placeholder="Example: Mukono Health Centre"
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Reminder note
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: Carry ANC card, ask about blood pressure, prepare transport..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <button
          onClick={saveAppointment}
          disabled={!date}
          className={`w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg ${
            !date ? "bg-slate-300" : "bg-blue-900"
          }`}
        >
          {editId ? "Update Appointment" : "Save Appointment"}
        </button>
      </Card>

      <HistoryCard
        title="Saved appointments"
        emptyText="No appointments have been added yet. Add your next ANC appointment above."
        items={sortedAppointments}
        render={(appointment) => (
          <div
            key={appointment.id}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">
                  {appointment.title || "ANC visit"}
                </p>
                <p className="mt-1 text-sm font-semibold text-blue-900">
                  {formatAppointmentDate(appointment.date, appointment.time)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {appointment.facility || mother.location}
                </p>

                <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getAppointmentTiming(appointment).level === "watch" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-800"}`}>
                  {getAppointmentReminderText(appointment, mother)}
                </p>

                {appointment.notes && (
                  <p className="mt-3 rounded-2xl bg-white p-3 text-xs leading-5 text-slate-600">
                    {appointment.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => editAppointment(appointment)}
                  className="rounded-full bg-white px-3 py-2 text-xs font-bold text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="rounded-full bg-white p-2 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      />

      <ChecklistPage
        title="ANC Preparation Checklist"
        subtitle="Tick off what you have prepared before going for your antenatal care visit."
        badge="ANC checklist"
        items={ancChecklist}
        completedItems={completedANC}
        setCompletedItems={setCompletedANC}
        color="blue"
      />

      <InfoCard
        title="Why ANC matters"
        text="ANC visits help check the mother’s health, baby’s growth, blood pressure, danger signs, nutrition, and birth preparation."
      />
    </Page>
  );
}

function BirthPrepPage({ completedBirth, setCompletedBirth, mother }) {
  return (
    <Page>
      <div
        className="rounded-[2rem] p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.primary})`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-teal-50">Birth preparation</p>

            <h1 className="mt-2 text-2xl font-extrabold">
              Get ready for delivery
            </h1>

            <p className="mt-3 text-sm leading-6 text-teal-50">
              Week {mother.week}. Prepare early so that you are not delayed when
              labor starts.
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-4">
            <Baby className="h-9 w-9" />
          </div>
        </div>
      </div>

      <ChecklistPage
        title="Hospital Bag Checklist"
        subtitle="Tick the items you have prepared for delivery day."
        badge="Labor readiness"
        items={birthChecklist}
        completedItems={completedBirth}
        setCompletedItems={setCompletedBirth}
        color="teal"
      />

      <InfoCard
        title="When to go to the facility"
        text="Go when contractions become strong and regular, water breaks, bleeding starts, baby movement reduces, or severe headache, blurred vision, or convulsions occur."
      />
    </Page>
  );
}


function HealthRecordsPage({ healthRecords, setHealthRecords, mother, go }) {
  const [ancNumber, setAncNumber] = useState(healthRecords.ancNumber || "");
  const [bloodGroup, setBloodGroup] = useState(healthRecords.bloodGroup || "");
  const [allergies, setAllergies] = useState(healthRecords.allergies || "");
  const [chronicConditions, setChronicConditions] = useState(
    healthRecords.chronicConditions || ""
  );
  const [previousPregnancies, setPreviousPregnancies] = useState(
    healthRecords.previousPregnancies || ""
  );
  const [currentFacility, setCurrentFacility] = useState(
    healthRecords.currentFacility || mother.location || ""
  );
  const [midwifeDoctor, setMidwifeDoctor] = useState(
    healthRecords.midwifeDoctor || ""
  );
  const [scanNotes, setScanNotes] = useState(healthRecords.scanNotes || "");
  const [labNotes, setLabNotes] = useState(healthRecords.labNotes || "");
  const [vaccinationNotes, setVaccinationNotes] = useState(
    healthRecords.vaccinationNotes || ""
  );
  const [generalNotes, setGeneralNotes] = useState(
    healthRecords.generalNotes || ""
  );

  const saveRecords = async () => {
    const records = {
      ancNumber: ancNumber.trim(),
      bloodGroup: bloodGroup.trim(),
      allergies: allergies.trim(),
      chronicConditions: chronicConditions.trim(),
      previousPregnancies: previousPregnancies.trim(),
      currentFacility: currentFacility.trim(),
      midwifeDoctor: midwifeDoctor.trim(),
      scanNotes: scanNotes.trim(),
      labNotes: labNotes.trim(),
      vaccinationNotes: vaccinationNotes.trim(),
      generalNotes: generalNotes.trim(),
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    setHealthRecords(records);

    const sync = await safeBackendSync(() =>
      healthRecordApi.update(mapHealthRecordToApi(records))
    );

    if (sync.ok) {
      setHealthRecords((prev) => ({
        ...prev,
        backendId: sync.result.id,
        syncStatus: "synced",
      }));
    }
  };

  const clearRecords = () => {
    setAncNumber("");
    setBloodGroup("");
    setAllergies("");
    setChronicConditions("");
    setPreviousPregnancies("");
    setCurrentFacility("");
    setMidwifeDoctor("");
    setScanNotes("");
    setLabNotes("");
    setVaccinationNotes("");
    setGeneralNotes("");
    setHealthRecords(defaultHealthRecords);
  };

  const hasKeyRecords = ancNumber || bloodGroup || allergies || currentFacility;

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-emerald-700">
          Personal health records
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Save your pregnancy records
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Keep important ANC and hospital-result details in one place so they are
          easy to check during antenatal care, emergency care, or delivery.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-emerald-50 to-sky-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Quick record summary
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {hasKeyRecords
                ? "Some key records have been added. Keep them updated after ANC visits, scans, or lab tests."
                : "No key records have been added yet. Start with your ANC number, blood group, allergies, and facility."}
            </p>
          </div>
          <FileText className="h-7 w-7 text-emerald-700" />
        </div>

        {healthRecords.updatedAt && (
          <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-semibold text-slate-500">
            Last updated: {healthRecords.updatedAt}
          </p>
        )}
      </Card>

      <Card className="space-y-4">
        <Input
          icon={ClipboardList}
          label="ANC card / clinic number"
          value={ancNumber}
          onChange={setAncNumber}
          placeholder="Example: ANC-2026-001"
        />

        <Input
          icon={Droplets}
          label="Blood group"
          value={bloodGroup}
          onChange={setBloodGroup}
          placeholder="Example: O+, A-, B+"
        />

        <Input
          icon={ShieldAlert}
          label="Allergies"
          value={allergies}
          onChange={setAllergies}
          placeholder="Example: Penicillin, none known"
        />

        <Input
          icon={HeartPulse}
          label="Known conditions"
          value={chronicConditions}
          onChange={setChronicConditions}
          placeholder="Example: Hypertension, asthma, diabetes, none"
        />

        <Input
          icon={Baby}
          label="Previous pregnancies / birth history"
          value={previousPregnancies}
          onChange={setPreviousPregnancies}
          placeholder="Example: First pregnancy, previous C-section, miscarriage history"
        />

        <Input
          icon={MapPinned}
          label="Current ANC facility"
          value={currentFacility}
          onChange={setCurrentFacility}
          placeholder="Example: Mukono Health Centre IV"
        />

        <Input
          icon={UserRound}
          label="Main midwife / doctor"
          value={midwifeDoctor}
          onChange={setMidwifeDoctor}
          placeholder="Example: Midwife Sarah"
        />
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Ultrasound / scan notes
          </p>
          <textarea
            value={scanNotes}
            onChange={(e) => setScanNotes(e.target.value)}
            placeholder="Example: Baby position, placenta notes, scan date, expected due date confirmation..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Lab test notes
          </p>
          <textarea
            value={labNotes}
            onChange={(e) => setLabNotes(e.target.value)}
            placeholder="Example: Hb level, malaria test, urine test, HIV/syphilis results discussed by health worker..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Injection / supplement notes
          </p>
          <textarea
            value={vaccinationNotes}
            onChange={(e) => setVaccinationNotes(e.target.value)}
            placeholder="Example: Tetanus injection, supplements given, next dose date if provided..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            General medical notes
          </p>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Any important instruction given by the health worker..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={saveRecords}
          className="rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white"
        >
          Save Records
        </button>
        <button
          onClick={clearRecords}
          className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
        >
          Clear
        </button>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900">Where this helps</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>• During ANC visits when the mother is asked for history.</li>
          <li>• When updating hospital results such as BP, weight, scans, or lab notes.</li>
          <li>• During emergencies when blood group, allergies, or conditions matter.</li>
          <li>• During delivery preparation when the ANC card is not nearby.</li>
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          This prototype stores records locally in the browser using localStorage.
          A production version should use secure authentication, encryption, and
          controlled sharing.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => go("anc")}
          className="rounded-2xl bg-blue-900 py-3 text-xs font-bold text-white"
        >
          ANC Page
        </button>
        <button
          onClick={() => go("emergencyPlan")}
          className="rounded-2xl bg-red-500 py-3 text-xs font-bold text-white"
        >
          Emergency Plan
        </button>
      </div>
    </Page>
  );
}

function PostnatalCarePage({ postnatalCare, setPostnatalCare, mother, go }) {
  const [deliveryDate, setDeliveryDate] = useState(postnatalCare.deliveryDate || "");
  const [babyName, setBabyName] = useState(postnatalCare.babyName || "");
  const [deliveryFacility, setDeliveryFacility] = useState(postnatalCare.deliveryFacility || mother.location || "");
  const [birthWeight, setBirthWeight] = useState(postnatalCare.birthWeight || "");
  const [feedingMethod, setFeedingMethod] = useState(postnatalCare.feedingMethod || "Breastfeeding");
  const [motherBleeding, setMotherBleeding] = useState(postnatalCare.motherBleeding || "Normal");
  const [motherPain, setMotherPain] = useState(postnatalCare.motherPain || "Mild");
  const [motherMood, setMotherMood] = useState(postnatalCare.motherMood || "Okay");
  const [babyTemperature, setBabyTemperature] = useState(postnatalCare.babyTemperature || "");
  const [babyDangerSigns, setBabyDangerSigns] = useState(postnatalCare.babyDangerSigns || "");
  const [nextCheckup, setNextCheckup] = useState(postnatalCare.nextCheckup || "");
  const [notes, setNotes] = useState(postnatalCare.notes || "");
  const [checklist, setChecklist] = useState(postnatalCare.checklist || []);

  const currentAnalysis = analyzePostnatalCare({
    motherBleeding,
    motherPain,
    motherMood,
    babyTemperature,
    babyDangerSigns,
  });

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const savePostnatalCare = async () => {
    const log = {
      id: Date.now(),
      date: formatDateTime(),
      motherBleeding,
      motherPain,
      motherMood,
      babyTemperature: babyTemperature || "Not recorded",
      babyDangerSigns: babyDangerSigns.trim(),
      analysis: currentAnalysis,
    };

    const updatedPostnatal = {
      ...postnatalCare,
      deliveryDate,
      babyName,
      deliveryFacility,
      birthWeight,
      feedingMethod,
      motherBleeding,
      motherPain,
      motherMood,
      babyTemperature,
      babyDangerSigns: babyDangerSigns.trim(),
      nextCheckup,
      notes: notes.trim(),
      checklist,
      latestCheck: log,
      recoveryLogs: [log, ...(postnatalCare.recoveryLogs || [])],
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    setPostnatalCare(updatedPostnatal);

    const sync = await safeBackendSync(() =>
      postnatalCareApi.update(mapPostnatalCareToApi(updatedPostnatal))
    );

    if (sync.ok) {
      setPostnatalCare((prev) => ({
        ...prev,
        backendId: sync.result.id,
        syncStatus: "synced",
      }));
    }
  };

  const deleteRecoveryLog = (id) => {
    setPostnatalCare((prev) => ({
      ...prev,
      recoveryLogs: (prev.recoveryLogs || []).filter((item) => item.id !== id),
    }));
  };

  const resetPostnatalCare = () => {
    setPostnatalCare(defaultPostnatalCare);
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-pink-700">After birth mode</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Postnatal care
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Track mother recovery, baby feeding, bleeding, mood, baby temperature,
          newborn danger signs, and postnatal checkups after delivery.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-pink-50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-pink-700">
              Mother and baby follow-up
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Postnatal care helps detect bleeding, infection, feeding problems,
              jaundice, breathing difficulty, and emotional distress early.
            </p>
          </div>
          <HeartPulse className="h-7 w-7 text-pink-700" />
        </div>
      </Card>

      <Card className="space-y-4">
        <DateInput
          icon={CalendarDays}
          label="Delivery date"
          value={deliveryDate}
          onChange={setDeliveryDate}
        />

        <Input
          icon={Baby}
          label="Baby name"
          value={babyName}
          onChange={setBabyName}
          placeholder="Example: Baby Amina"
        />

        <Input
          icon={MapPinned}
          label="Delivery facility"
          value={deliveryFacility}
          onChange={setDeliveryFacility}
          placeholder="Example: Mukono Health Centre"
        />

        <Input
          icon={Gauge}
          label="Birth weight"
          value={birthWeight}
          onChange={setBirthWeight}
          placeholder="Example: 3.2 kg"
        />

        <OptionGroup
          title="Feeding method"
          options={[
            { id: "Breastfeeding", label: "Breastfeeding" },
            { id: "Formula", label: "Formula" },
            { id: "Mixed feeding", label: "Mixed feeding" },
            { id: "Feeding problem", label: "Feeding problem" },
          ]}
          active={feedingMethod}
          setActive={setFeedingMethod}
        />

        <OptionGroup
          title="Mother bleeding"
          options={[
            { id: "Normal", label: "Normal" },
            { id: "More than usual", label: "More than usual" },
            { id: "Heavy", label: "Heavy bleeding" },
          ]}
          active={motherBleeding}
          setActive={setMotherBleeding}
        />

        <OptionGroup
          title="Mother pain level"
          options={[
            { id: "Mild", label: "Mild" },
            { id: "Moderate", label: "Moderate" },
            { id: "Severe", label: "Severe" },
          ]}
          active={motherPain}
          setActive={setMotherPain}
        />

        <OptionGroup
          title="Mother mood"
          options={[
            { id: "Okay", label: "Okay" },
            { id: "Happy", label: "Happy" },
            { id: "Sad", label: "Sad" },
            { id: "Anxious", label: "Anxious" },
          ]}
          active={motherMood}
          setActive={setMotherMood}
        />

        <Input
          icon={Thermometer}
          label="Baby temperature in °C"
          value={babyTemperature}
          onChange={setBabyTemperature}
          placeholder="Example: 36.8"
          type="number"
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Baby danger signs or concerns
          </p>
          <textarea
            value={babyDangerSigns}
            onChange={(e) => setBabyDangerSigns(e.target.value)}
            placeholder="Example: poor feeding, yellow eyes, fever, difficulty breathing..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <Input
          icon={CalendarDays}
          label="Next postnatal / baby checkup"
          value={nextCheckup}
          onChange={setNextCheckup}
          placeholder="Example: Friday, 25 September 2026"
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            General notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add recovery notes, feeding notes, baby checkup notes, or health worker advice..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <AnalysisBox analysis={currentAnalysis} />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={savePostnatalCare}
            className="rounded-2xl bg-pink-700 py-3 text-sm font-bold text-white"
          >
            Save Postnatal Check
          </button>

          <button
            onClick={() => go("emergency")}
            className="rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-700"
          >
            Emergency Help
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Postnatal readiness</h3>
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">
            {checklist.length}/{postnatalChecklist.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {postnatalChecklist.map((item) => {
            const done = checklist.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left shadow-sm transition ${
                  done ? "border-pink-200 bg-pink-50" : "border-slate-100 bg-white"
                }`}
              >
                <div
                  className={`mt-1 rounded-full p-1 ${
                    done ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Newborn danger signs</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <li>• Poor feeding or refusing to feed.</li>
          <li>• Difficulty breathing, blue lips, or fast breathing.</li>
          <li>• Fever, very cold body, convulsions, or unusual sleepiness.</li>
          <li>• Yellow eyes/skin, bleeding cord, pus, or swelling.</li>
        </ul>
      </Card>

      <HistoryCard
        title="Postnatal recovery history"
        emptyText="No postnatal checks have been saved yet."
        items={postnatalCare.recoveryLogs || []}
        render={(entry) => (
          <HistoryItem
            key={entry.id}
            badge={entry.analysis.level}
            date={entry.date}
            items={[
              `Bleeding: ${entry.motherBleeding}`,
              `Pain: ${entry.motherPain}`,
              `Mood: ${entry.motherMood}`,
              `Baby temp: ${entry.babyTemperature}`,
            ]}
            notes={[
              ...entry.analysis.notes,
              ...(entry.babyDangerSigns ? [`Concern: ${entry.babyDangerSigns}`] : []),
            ]}
            onDelete={() => deleteRecoveryLog(entry.id)}
          />
        )}
      />

      <Card>
        <h3 className="font-bold text-slate-900">Reset postnatal data</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use this only if you want to clear after-birth mode and start this section again.
        </p>
        <button
          onClick={resetPostnatalCare}
          className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
        >
          Clear Postnatal Care Data
        </button>
      </Card>
    </Page>
  );
}


function SupportPeoplePage({ supportPeople, setSupportPeople, go }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    relationship: "",
    role: "Partner",
    phone: "",
    permission: "Emergency contact only",
    notes: "",
    isPrimary: false,
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      relationship: "",
      role: "Partner",
      phone: "",
      permission: "Emergency contact only",
      notes: "",
      isPrimary: false,
    });
  };

  const saveSupportPerson = async () => {
    if (!form.name.trim() && !form.phone.trim()) return;

    const existingPerson = editingId
      ? supportPeople.find((person) => person.id === editingId)
      : null;

    const cleanPerson = {
      id: editingId || Date.now(),
      backendId: existingPerson?.backendId,
      name: form.name.trim() || "Unnamed support person",
      relationship: form.relationship.trim(),
      role: form.role,
      phone: form.phone.trim(),
      permission: form.permission,
      allowedSupport: form.permission ? [form.permission] : [],
      notes: form.notes.trim(),
      isPrimary: form.isPrimary || supportPeople.length === 0,
      updatedAt: formatDateTime(),
      syncStatus: "pending",
    };

    setSupportPeople((prev) => {
      const withoutEdited = prev.filter((person) => person.id !== editingId);
      const next = [cleanPerson, ...withoutEdited];

      if (cleanPerson.isPrimary) {
        return next.map((person) => ({
          ...person,
          isPrimary: person.id === cleanPerson.id,
        }));
      }

      if (!next.some((person) => person.isPrimary)) {
        return next.map((person, index) => ({ ...person, isPrimary: index === 0 }));
      }

      return next;
    });

    resetForm();

    const sync = await safeBackendSync(() =>
      cleanPerson.backendId
        ? supportPeopleApi.update(cleanPerson.backendId, mapSupportPersonToApi(cleanPerson))
        : supportPeopleApi.create(mapSupportPersonToApi(cleanPerson))
    );

    if (sync.ok) {
      setSupportPeople((prev) =>
        prev.map((person) =>
          person.id === cleanPerson.id
            ? { ...person, backendId: sync.result.id, syncStatus: "synced" }
            : person
        )
      );
    }
  };

  const editSupportPerson = (person) => {
    setEditingId(person.id);
    setForm({
      name: person.name || "",
      relationship: person.relationship || "",
      role: person.role || "Partner",
      phone: person.phone || "",
      permission: person.permission || "Emergency contact only",
      notes: person.notes || "",
      isPrimary: Boolean(person.isPrimary),
    });
  };

  const deleteSupportPerson = async (id) => {
    const person = supportPeople.find((item) => item.id === id);

    setSupportPeople((prev) => {
      const next = prev.filter((person) => person.id !== id);
      if (next.length > 0 && !next.some((person) => person.isPrimary)) {
        return next.map((person, index) => ({ ...person, isPrimary: index === 0 }));
      }
      return next;
    });

    if (person?.backendId) {
      await safeBackendSync(() => supportPeopleApi.remove(person.backendId));
    }
  };

  const setPrimary = async (id) => {
    const selectedPerson = supportPeople.find((person) => person.id === id);

    setSupportPeople((prev) =>
      prev.map((person) => ({ ...person, isPrimary: person.id === id }))
    );

    if (selectedPerson?.backendId) {
      await safeBackendSync(() =>
        supportPeopleApi.update(selectedPerson.backendId, {
          ...mapSupportPersonToApi(selectedPerson),
          isPrimary: true,
        })
      );
    }
  };

  const supportSummary = getSupportSummary(supportPeople);

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-violet-700">Family and support access</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Support people</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Save trusted people who can support the mother during ANC visits, transport, emergencies, and postnatal care.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">
                {editingId ? "Edit support person" : "Add support person"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add people the mother trusts, not random contacts.
              </p>
            </div>
            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              icon={UserRound}
              label="Full name"
              value={form.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              placeholder="Example: Sarah Nakato"
            />
            <Input
              icon={Phone}
              label="Phone number"
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              placeholder="+256..."
            />
            <Input
              icon={Heart}
              label="Relationship"
              value={form.relationship}
              onChange={(value) => setForm((prev) => ({ ...prev, relationship: value }))}
              placeholder="Example: Sister, husband, mother"
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Role</span>
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
              >
                {supportRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Allowed support</span>
              <select
                value={form.permission}
                onChange={(event) => setForm((prev) => ({ ...prev, permission: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
              >
                {supportPermissions.map((permission) => (
                  <option key={permission} value={permission}>{permission}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Example: Can accompany me to ANC visits and help call transport."
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <button
            onClick={() => setForm((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-bold ${
              form.isPrimary ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-100 bg-slate-50 text-slate-700"
            }`}
          >
            <span>Make this the primary support person</span>
            {form.isPrimary && <CheckCircle2 className="h-5 w-5" />}
          </button>

          <button
            onClick={saveSupportPerson}
            className="w-full rounded-2xl bg-violet-700 py-4 font-bold text-white shadow-lg"
          >
            {editingId ? "Save Changes" : "Save Support Person"}
          </button>
        </Card>

        <div className="space-y-5">
          <Card className="bg-gradient-to-br from-violet-50 to-blue-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Support summary</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{supportSummary.count}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {supportSummary.count === 1 ? "trusted contact saved" : "trusted contacts saved"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-3">
                <UserRound className="h-7 w-7 text-violet-700" />
              </div>
            </div>

            {supportSummary.primary && (
              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Primary support</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{supportSummary.primary.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {supportSummary.primary.role} {supportSummary.primary.phone ? `• ${supportSummary.primary.phone}` : ""}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900">Why this matters</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Maternal care is safer when the mother has reliable people who know what to do during emergencies, ANC visits, transport delays, and after delivery.
            </p>
          </Card>
        </div>
      </div>

      <HistoryCard
        title="Saved support people"
        emptyText="No support people saved yet. Add at least one trusted contact."
        items={supportPeople}
        render={(person) => (
          <div key={person.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-900">{person.name}</p>
                  {person.isPrimary && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">Primary</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">{person.role || "Role pending"}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">{person.relationship || "Relationship pending"}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">{person.phone || "Phone pending"}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">{person.permission}</p>
                {person.notes && <p className="mt-2 text-xs leading-5 text-slate-500">Note: {person.notes}</p>}
                {person.updatedAt && <p className="mt-2 text-xs text-slate-400">Updated: {person.updatedAt}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {!person.isPrimary && (
                  <button
                    onClick={() => setPrimary(person.id)}
                    className="rounded-2xl bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => editSupportPerson(person)}
                  className="rounded-2xl bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSupportPerson(person.id)}
                  className="rounded-2xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </Page>
  );
}

function ProfilePage({ mother, setMother, resetApp }) {
  const [name, setName] = useState(mother.name);
  const [phone, setPhone] = useState(mother.phone);
  const [week, setWeek] = useState(String(mother.week));
  const [dueDate, setDueDate] = useState(mother.dueDate);
  const [location, setLocation] = useState(mother.location);
  const [nextANC, setNextANC] = useState(mother.nextANC);
  const [emergencyContact, setEmergencyContact] = useState(
    mother.emergencyContact
  );
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const saveProfile = async () => {
    const safeWeek = Math.min(Math.max(Number(week) || mother.week, 1), 40);

    const updatedMother = {
      ...mother,
      name: name || mother.name,
      phone: phone || mother.phone,
      week: safeWeek,
      dueDate: dueDate || mother.dueDate,
      location: location || mother.location,
      nextANC: nextANC || mother.nextANC,
      emergencyContact: emergencyContact || mother.emergencyContact,
    };

    setMother(updatedMother);
    localStorage.setItem("mamacare_mother", JSON.stringify(updatedMother));

    try {
      setStatus({ loading: true, error: "", success: "" });

      await profileApi.update(
        mapMotherToApiProfile({
          name: updatedMother.name,
          phone: updatedMother.phone,
          week: updatedMother.week,
          dueDate: updatedMother.dueDate,
          location: updatedMother.location,
          nextANC: updatedMother.nextANC,
          emergencyContact: updatedMother.emergencyContact,
        })
      );

      setStatus({
        loading: false,
        error: "",
        success: "Profile saved locally and synced to backend.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          "Profile saved locally, but backend sync failed. Login again or check that the backend is running.",
        success: "",
      });
    }
  };

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-teal-600">My details</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">Profile</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update your pregnancy details, ANC reminder, and emergency contact.
        </p>
      </div>

      <Card className="space-y-4">
        <Input
          icon={UserRound}
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Enter your name"
        />

        <Input
          icon={Smartphone}
          label="Phone number"
          value={phone}
          onChange={setPhone}
          placeholder="+256..."
        />

        <Input
          icon={Baby}
          label="Current pregnancy week"
          value={week}
          onChange={setWeek}
          placeholder="Example: 24"
          type="number"
        />

        <DateInput
          icon={CalendarDays}
          label="Expected due date"
          value={dueDate}
          onChange={setDueDate}
        />

        <Input
          icon={MapPinned}
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="Example: Mukono, Uganda"
        />

        <DateInput
          icon={ClipboardList}
          label="Next ANC appointment"
          value={nextANC}
          onChange={setNextANC}
        />

        <Input
          icon={Phone}
          label="Emergency contact"
          value={emergencyContact}
          onChange={setEmergencyContact}
          placeholder="+256..."
        />

        {status.error && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-sm font-semibold text-orange-700">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-3 text-sm font-semibold text-green-700">
            {status.success}
          </div>
        )}

        <button
          onClick={saveProfile}
          disabled={status.loading}
          className={`w-full rounded-2xl py-4 font-bold text-white shadow-lg ${
            status.loading ? "bg-slate-400" : "bg-blue-900"
          }`}
        >
          {status.loading ? "Saving..." : "Save Changes"}
        </button>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Demo controls</h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use this only when you want to clear all saved prototype data and start
          again.
        </p>

        <button
          onClick={resetApp}
          className="mt-4 w-full rounded-2xl bg-red-500 py-4 font-bold text-white shadow-lg"
        >
          Reset Demo
        </button>
      </Card>
    </Page>
  );
}


function buildNotificationItems({
  mother,
  risk,
  appointments,
  medications,
  movementHistory,
  wellnessHistory,
  emergencyPlan,
  healthRecords,
  completedANC,
  completedBirth,
}) {
  const items = [];
  const latestMovement = movementHistory[0];
  const latestWellness = wellnessHistory[0];
  const nextAppointment = getNextAppointment(appointments || [], mother || defaultMother);
  const nextMedication = getNextMedication(medications);

  if (risk === "urgent") {
    items.push({
      id: "urgent-risk-alert",
      type: "Urgent",
      title: "Urgent safety alert",
      text: "MamaCare has detected a possible danger sign. Open Risk Awareness or Emergency Help immediately.",
      icon: ShieldAlert,
      level: "urgent",
      action: "Open emergency help",
      target: "emergency",
    });
  } else if (risk === "watch") {
    items.push({
      id: "watch-risk-alert",
      type: "Watch",
      title: "Health check needs attention",
      text: "Some saved symptoms, vitals, baby movement, or wellness data may need monitoring.",
      icon: HeartPulse,
      level: "watch",
      action: "View risk awareness",
      target: "risk",
    });
  }

  if (nextAppointment?.id && nextAppointment.id !== "profile-next-anc") {
    items.push({
      id: `appointment-${nextAppointment.id}`,
      type: "ANC",
      title: nextAppointment.reminderLevel === "watch" ? "Appointment reminder needs attention" : "Upcoming ANC appointment reminder",
      text: getAppointmentReminderText(nextAppointment, mother),
      icon: CalendarDays,
      level: nextAppointment.reminderLevel || "normal",
      action: "Open appointment reminders",
      target: "anc",
    });
  } else {
    items.push({
      id: "missing-appointment",
      type: "ANC",
      title: "No ANC appointment reminder saved",
      text: "Add the next appointment date you received from the hospital or clinic so MamaCare can remind you.",
      icon: CalendarDays,
      level: "watch",
      action: "Add appointment",
      target: "anc",
    });
  }

  if (nextMedication) {
    items.push({
      id: `medication-${nextMedication.id}`,
      type: "Medication",
      title: "Next medication reminder",
      text: `${nextMedication.name} • ${nextMedication.dosage || "As prescribed"} • ${formatMedicationTime(nextMedication.time)}`,
      icon: Pill,
      level: "normal",
      action: "Open medication",
      target: "medications",
    });
  } else {
    items.push({
      id: "missing-medication",
      type: "Medication",
      title: "No supplement reminder saved",
      text: "Add iron, folic acid, or prescribed medicine reminders if applicable.",
      icon: Pill,
      level: "normal",
      action: "Add reminder",
      target: "medications",
    });
  }

  if (Number(mother.week) >= 20 && !latestMovement) {
    items.push({
      id: "movement-needed",
      type: "Baby movement",
      title: "Log baby movement",
      text: "You are past Week 20. Start saving baby movement checks to notice changes early.",
      icon: Baby,
      level: "watch",
      action: "Open movement counter",
      target: "movement",
    });
  } else if (latestMovement) {
    items.push({
      id: `movement-${latestMovement.id}`,
      type: "Baby movement",
      title: "Latest movement check",
      text: `${latestMovement.count || 0} movements • ${latestMovement.feelingLabel || "Movement status saved"}`,
      icon: Baby,
      level: latestMovement.analysis?.level || "normal",
      action: "Open movement counter",
      target: "movement",
    });
  }

  if (!latestWellness) {
    items.push({
      id: "wellness-needed",
      type: "Wellness",
      title: "Check your wellness today",
      text: "Track mood, sleep, energy, and stress so MamaCare can notice patterns.",
      icon: Smile,
      level: "normal",
      action: "Open wellness",
      target: "wellness",
    });
  } else if (latestWellness.analysis?.level !== "normal") {
    items.push({
      id: `wellness-${latestWellness.id}`,
      type: "Wellness",
      title: "Wellness needs attention",
      text: `Mood: ${latestWellness.moodLabel}, stress: ${latestWellness.stress}, sleep: ${latestWellness.sleep}`,
      icon: Smile,
      level: latestWellness.analysis?.level || "watch",
      action: "Open wellness",
      target: "wellness",
    });
  }

  const emergencyReady = Boolean(
    emergencyPlan?.facilityName && emergencyPlan?.transportName && emergencyPlan?.supportPerson
  );
  if (!emergencyReady) {
    items.push({
      id: "emergency-plan-needed",
      type: "Safety",
      title: "Emergency plan incomplete",
      text: "Save your nearest facility, transport contact, and support person before an emergency happens.",
      icon: MapPinned,
      level: "watch",
      action: "Complete plan",
      target: "emergencyPlan",
    });
  }

  const hasKeyRecords = Boolean(
    healthRecords?.ancNumber || healthRecords?.bloodGroup || healthRecords?.currentFacility
  );
  if (!hasKeyRecords) {
    items.push({
      id: "health-records-needed",
      type: "Records",
      title: "Health records are empty",
      text: "Add ANC number, blood group, allergies, facility, and medical notes for quick reference.",
      icon: FileText,
      level: "normal",
      action: "Open records",
      target: "records",
    });
  }

  const ancProgress = Math.round(((completedANC?.length || 0) / ancChecklist.length) * 100);
  if (ancProgress < 100) {
    items.push({
      id: "anc-checklist-progress",
      type: "Checklist",
      title: "ANC checklist not complete",
      text: `${ancProgress}% completed. Prepare your ANC card, questions, transport, and support person.`,
      icon: ClipboardList,
      level: "normal",
      action: "Open ANC checklist",
      target: "anc",
    });
  }

  const birthProgress = Math.round(((completedBirth?.length || 0) / birthChecklist.length) * 100);
  if (Number(mother.week) >= 28 && birthProgress < 100) {
    items.push({
      id: "birth-checklist-progress",
      type: "Birth prep",
      title: "Birth checklist not complete",
      text: `${birthProgress}% completed. Prepare hospital bag, transport plan, and emergency contact.`,
      icon: ClipboardList,
      level: "watch",
      action: "Open birth preparation",
      target: "birth",
    });
  }

  return items;
}


function OfflineModePage({ go }) {
  const isOnline = useOnlineStatus();
  const savedKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("mamacare_")
  );
  const savedDataCount = savedKeys.length;

  const offlineAvailable = [
    "Mother profile and pregnancy week",
    "Symptoms, vitals, baby movement, and wellness logs",
    "Appointments, medication reminders, and checklists",
    "Emergency plan, support people, and health records",
    "Reports, clinic visit mode, and local backup tools",
  ];

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-700">Offline mode</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Connection status
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            MamaCare saves prototype data locally in this browser. Many features
            remain visible even when internet is unavailable.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
            isOnline
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          {isOnline ? "You are online" : "You are offline"}
        </div>
      </div>

      <div
        className={`rounded-[2rem] p-6 shadow-sm ${
          isOnline
            ? "bg-gradient-to-br from-green-50 to-teal-50"
            : "bg-gradient-to-br from-orange-50 to-red-50"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">
              {isOnline ? "Online connection active" : "Offline mode active"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {isOnline
                ? "The app can run normally. In a future backend version, this is where syncing to a secure cloud account would happen."
                : "Saved local records can still be opened on this device. New entries can still be saved locally, but cloud sync or online services would wait until connection returns."}
            </p>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Saved data groups
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {savedDataCount}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold text-slate-900">Works while offline</h3>
          <div className="mt-4 space-y-3">
            {offlineAvailable.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-900">Important note</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This current prototype uses browser localStorage. That means saved
            data belongs to this browser/device only. Clearing browser data,
            changing browsers, or reinstalling the app can remove local data.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => go("backup")}
              className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"
            >
              Open data backup
            </button>
            <button
              onClick={() => go("reports")}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"
            >
              Open reports
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900">Future production behavior</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          When MamaCare gets a backend, offline mode can save entries locally
          first, then sync them securely when internet returns. This will help
          mothers continue using the system in areas with weak or unstable
          connectivity.
        </p>
      </Card>
    </Page>
  );
}


function NotificationsPage({
  mother,
  risk,
  appointments,
  medications,
  movementHistory,
  wellnessHistory,
  emergencyPlan,
  healthRecords,
  completedANC,
  completedBirth,
  readNotificationIds,
  setReadNotificationIds,
  go,
}) {
  const notifications = buildNotificationItems({
    mother,
    risk,
    appointments,
    medications,
    movementHistory,
    wellnessHistory,
    emergencyPlan,
    healthRecords,
    completedANC,
    completedBirth,
  });

  const safeReadNotificationIds = Array.isArray(readNotificationIds)
    ? readNotificationIds
    : [];

  const unreadCount = notifications.filter(
    (item) => !safeReadNotificationIds.includes(item.id)
  ).length;

  const markRead = (id) => {
    setReadNotificationIds((prev) =>
      prev.includes(id) ? prev : [id, ...prev]
    );
  };

  const openTarget = (item) => {
    markRead(item.id);
    go(item.target);
  };

  const levelClasses = {
    urgent: "border-red-100 bg-red-50 text-red-700",
    watch: "border-orange-100 bg-orange-50 text-orange-700",
    normal: "border-slate-100 bg-white text-slate-700",
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Notifications</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Reminder center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            See important reminders from ANC appointments, medication,
            movement checks, wellness, emergency planning, records, and
            pregnancy preparation.
          </p>
        </div>

        <button
          onClick={() => setReadNotificationIds(notifications.map((item) => item.id))}
          className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-sm"
        >
          Mark all as read
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-50">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            Active reminders
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {notifications.length}
          </p>
        </Card>
        <Card className="bg-orange-50">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
            Unread
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {unreadCount}
          </p>
        </Card>
        <Card className="bg-teal-50">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
            Safety status
          </p>
          <div className="mt-2">
            <RiskPill risk={risk} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {notifications.map((item) => {
          const Icon = item.icon;
          const isRead = safeReadNotificationIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-3xl border p-5 shadow-sm ${levelClasses[item.level || "normal"]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                        {item.type}
                      </p>
                      {!isRead && (
                        <span className="rounded-full bg-blue-900 px-2 py-1 text-[10px] font-bold text-white">
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => openTarget(item)}
                  className="rounded-2xl bg-blue-900 px-4 py-3 text-xs font-bold text-white"
                >
                  {item.action}
                </button>
                <button
                  onClick={() => markRead(item.id)}
                  className="rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm"
                >
                  Mark read
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}





function ClinicVisitModePage({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  appointments,
  medications,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  completedANC,
  completedBirth,
  go,
}) {
  const nextAppointment = getNextAppointment(appointments || [], mother || defaultMother);
  const nextMedication = getNextMedication(medications || []);
  const latestSymptom = symptomHistory?.[0];
  const latestVitals = vitalsHistory?.[0];
  const latestWellness = wellnessHistory?.[0];
  const latestMovement = movementHistory?.[0];
  const postnatalSummary = getPostnatalSummary(postnatalCare);
  const ancProgress = Math.round(((completedANC?.length || 0) / Math.max(ancChecklist.length, 1)) * 100);
  const birthProgress = Math.round(((completedBirth?.length || 0) / Math.max(birthChecklist.length, 1)) * 100);

  const emergencyReady = Boolean(
    emergencyPlan?.nearestFacility &&
      emergencyPlan?.transportPhone &&
      emergencyPlan?.supportPhone
  );

  const clinicSummary = [
    "MAMACARE CLINIC VISIT MODE",
    "--------------------------",
    `Generated: ${formatDateTime()}`,
    "",
    `Mother: ${mother.name || "Not added"}`,
    `Phone: ${mother.phone || "Not added"}`,
    `Pregnancy week: ${mother.week || "Not added"}`,
    `Due date: ${mother.dueDate || "Not added"}`,
    `Current risk: ${risk}`,
    "",
    "KEY RECORDS",
    `ANC number: ${healthRecords?.ancNumber || "Not added"}`,
    `Blood group: ${healthRecords?.bloodGroup || "Not added"}`,
    `Allergies: ${healthRecords?.allergies || "Not added"}`,
    `Known conditions: ${healthRecords?.knownConditions || "Not added"}`,
    `Current facility: ${healthRecords?.currentFacility || "Not added"}`,
    "",
    "LATEST MONITORING",
    `Symptoms: ${latestSymptom ? `${latestSymptom.risk} - ${latestSymptom.symptoms?.join(", ")}` : "No symptom log"}`,
    `Vitals: ${latestVitals ? `BP ${latestVitals.systolic}/${latestVitals.diastolic}, Temp ${latestVitals.temperature}°C, Movement ${latestVitals.movementLabel}` : "No vitals log"}`,
    `Baby movement: ${latestMovement ? `${latestMovement.count} movements - ${latestMovement.feelingLabel}` : "No movement check"}`,
    `Wellness: ${latestWellness ? `${latestWellness.moodLabel}, stress ${latestWellness.stress}` : "No wellness log"}`,
    "",
    "CARE PLAN",
    `Next ANC: ${nextAppointment.dateText} at ${nextAppointment.location}`,
    `Medication: ${nextMedication ? `${nextMedication.name} - ${nextMedication.dosage || "dose not set"} at ${formatMedicationTime(nextMedication.time)}` : "No medication reminder"}`,
    `ANC checklist: ${ancProgress}% complete`,
    `Birth checklist: ${birthProgress}% complete`,
    "",
    "EMERGENCY CONTACTS",
    `Nearest facility: ${emergencyPlan?.nearestFacility || "Not added"}`,
    `Transport: ${emergencyPlan?.transportName || "Not added"} - ${emergencyPlan?.transportPhone || "Not added"}`,
    `Support person: ${emergencyPlan?.supportPerson || "Not added"} - ${emergencyPlan?.supportPhone || "Not added"}`,
    "",
    "POSTNATAL",
    `Status: ${postnatalSummary.ready ? postnatalSummary.date : "Not set"}`,
  ].join("\n");

  const copyClinicSummary = async () => {
    try {
      await navigator.clipboard.writeText(clinicSummary);
      alert("Clinic visit summary copied.");
    } catch {
      alert("Copy failed. You can select and copy the summary manually.");
    }
  };

  return (
    <Page>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
        <div
          className="rounded-[2rem] p-6 text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.danger})`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-50">Clinic visit mode</p>
              <h1 className="mt-2 text-3xl font-extrabold">Focused health summary for ANC or hospital visits</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50">
                This mode hides distractions and brings the most important mother, pregnancy, records, monitoring, medication, and emergency information into one clinic-ready screen.
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-4">
              <FileText className="h-9 w-9" />
            </div>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Current safety status</p>
              <p className="mt-1 text-xs text-slate-500">Show this first if you are being attended to.</p>
            </div>
            <RiskPill risk={risk} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InsightMini label="ANC ready" value={`${ancProgress}%`} />
            <InsightMini label="Emergency plan" value={emergencyReady ? "Ready" : "Incomplete"} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="Mother"
          value={mother.name || "Mother"}
          subtitle={`Week ${mother.week || "—"} • Due ${mother.dueDate || "not set"}`}
          onClick={() => go("profile")}
        />
        <InsightCard
          title="ANC / clinic number"
          value={healthRecords?.ancNumber || "Not added"}
          subtitle={healthRecords?.currentFacility || "Add current facility"}
          onClick={() => go("records")}
        />
        <InsightCard
          title="Blood group"
          value={healthRecords?.bloodGroup || "Not added"}
          subtitle={healthRecords?.allergies ? `Allergies: ${healthRecords.allergies}` : "Add allergies if any"}
          onClick={() => go("records")}
        />
        <InsightCard
          title="Next ANC"
          value={nextAppointment.dateText}
          subtitle={nextAppointment.location}
          onClick={() => go("anc")}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Latest monitoring</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  These are the latest saved logs the mother can show during a clinic visit.
                </p>
              </div>
              <button
                onClick={() => go("reports")}
                className="rounded-2xl bg-blue-900 px-4 py-3 text-xs font-bold text-white"
              >
                Open full report
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ClinicVisitTile
                title="Symptoms"
                value={latestSymptom ? latestSymptom.symptoms?.join(", ") : "No symptom log"}
                badge={latestSymptom?.risk || "normal"}
                action="Update symptoms"
                onClick={() => go("log")}
              />
              <ClinicVisitTile
                title="Vitals"
                value={latestVitals ? `BP ${latestVitals.systolic}/${latestVitals.diastolic}, Temp ${latestVitals.temperature}°C` : "No vitals logged"}
                badge={latestVitals?.analysis?.level || "normal"}
                action="Update vitals"
                onClick={() => go("vitals")}
              />
              <ClinicVisitTile
                title="Baby movement"
                value={latestMovement ? `${latestMovement.count} movements • ${latestMovement.feelingLabel}` : "No movement check"}
                badge={latestMovement?.analysis?.level || "normal"}
                action="Update movement"
                onClick={() => go("movement")}
              />
              <ClinicVisitTile
                title="Wellness"
                value={latestWellness ? `${latestWellness.moodLabel} mood • Stress ${latestWellness.stress}` : "No wellness log"}
                badge={latestWellness?.analysis?.level || "normal"}
                action="Update wellness"
                onClick={() => go("wellness")}
              />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900">Health records to show</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <InfoBlock title="Known conditions" text={healthRecords?.knownConditions || "Not added"} />
              <InfoBlock title="Previous pregnancy history" text={healthRecords?.previousPregnancyHistory || "Not added"} />
              <InfoBlock title="Scan notes" text={healthRecords?.scanNotes || "Not added"} />
              <InfoBlock title="Lab notes" text={healthRecords?.labNotes || "Not added"} />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-slate-900">Medication and care plan</h3>
            <div className="mt-4 space-y-3">
              <InsightRow
                label="Next medication"
                value={nextMedication ? `${nextMedication.name} • ${nextMedication.dosage || "Dose not set"} • ${formatMedicationTime(nextMedication.time)}` : "No medication reminder"}
                onClick={() => go("medications")}
              />
              <InsightRow
                label="Next ANC"
                value={`${nextAppointment.dateText} • ${nextAppointment.location}`}
                onClick={() => go("anc")}
              />
              <InsightRow
                label="Postnatal"
                value={postnatalSummary.ready ? postnatalSummary.date : "Not set"}
                onClick={() => go("postnatal")}
              />
            </div>
          </Card>

          <Card className="bg-red-50">
            <h3 className="font-bold text-red-700">Emergency contacts</h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-red-700">
              <p><strong>Nearest facility:</strong> {emergencyPlan?.nearestFacility || "Not added"}</p>
              <p><strong>Facility phone:</strong> {emergencyPlan?.facilityPhone || "Not added"}</p>
              <p><strong>Transport:</strong> {emergencyPlan?.transportName || "Not added"} {emergencyPlan?.transportPhone ? `• ${emergencyPlan.transportPhone}` : ""}</p>
              <p><strong>Support person:</strong> {emergencyPlan?.supportPerson || "Not added"} {emergencyPlan?.supportPhone ? `• ${emergencyPlan.supportPhone}` : ""}</p>
            </div>
            <button
              onClick={() => go("emergency")}
              className="mt-5 w-full rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white"
            >
              Open SOS help
            </button>
          </Card>

          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Clinic summary text</h3>
                <p className="mt-1 text-xs text-slate-500">Copy this if a nurse or doctor needs a quick summary.</p>
              </div>
              <button
                onClick={copyClinicSummary}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white"
              >
                Copy summary
              </button>
            </div>
            <pre className="mt-4 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-3xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
{clinicSummary}
            </pre>
          </Card>
        </div>
      </div>
    </Page>
  );
}

function ClinicVisitTile({ title, value, badge, action, onClick }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <RiskPill risk={badge} />
      </div>
      <p className="mt-3 min-h-[44px] text-sm leading-6 text-slate-600">{value}</p>
      <button
        onClick={onClick}
        className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm"
      >
        {action}
      </button>
    </div>
  );
}

function ReportsPage({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  appointments,
  medications,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  completedANC,
  completedBirth,
  go,
}) {
  const nextAppointment = getNextAppointment(appointments, mother);
  const nextMedication = getNextMedication(medications);
  const latestSymptom = symptomHistory[0];
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];
  const postnatalSummary = getPostnatalSummary(postnatalCare);
  const ancProgress = Math.round((completedANC.length / Math.max(ancChecklist.length, 1)) * 100);
  const birthProgress = Math.round((completedBirth.length / Math.max(birthChecklist.length, 1)) * 100);

  const emergencyReadyFields = [
    emergencyPlan?.nearestFacility,
    emergencyPlan?.facilityPhone,
    emergencyPlan?.transportName,
    emergencyPlan?.transportPhone,
    emergencyPlan?.supportPerson,
    emergencyPlan?.supportPhone,
  ];
  const emergencyReadiness = Math.round(
    (emergencyReadyFields.filter(Boolean).length / emergencyReadyFields.length) * 100
  );

  const reportText = [
    "MAMACARE PREGNANCY SUMMARY REPORT",
    "---------------------------------",
    `Generated: ${formatDateTime()}`,
    "",
    "MOTHER DETAILS",
    `Name: ${mother.name || "Not added"}`,
    `Phone: ${mother.phone || "Not added"}`,
    `Pregnancy week: ${mother.week || "Not added"}`,
    `Expected due date: ${mother.dueDate || "Not added"}`,
    `Location: ${mother.location || "Not added"}`,
    "",
    "CURRENT SAFETY STATUS",
    `Risk level: ${risk}`,
    `Latest symptom log: ${latestSymptom ? `${latestSymptom.risk} - ${latestSymptom.symptoms?.join(", ")}` : "No symptom log"}`,
    `Latest vitals: ${latestVitals ? `BP ${latestVitals.systolic}/${latestVitals.diastolic}, Temp ${latestVitals.temperature}°C, Movement ${latestVitals.movementLabel}` : "No vitals log"}`,
    `Latest movement: ${latestMovement ? `${latestMovement.count} movements - ${latestMovement.feelingLabel}` : "No movement check"}`,
    `Latest wellness: ${latestWellness ? `${latestWellness.moodLabel}, stress ${latestWellness.stress}` : "No wellness log"}`,
    "",
    "ANC AND CARE PLANNING",
    `Next ANC: ${nextAppointment.dateText} at ${nextAppointment.location}`,
    `ANC checklist: ${ancProgress}% complete`,
    `Birth preparation: ${birthProgress}% complete`,
    `Next medication: ${nextMedication ? `${nextMedication.name} at ${formatMedicationTime(nextMedication.time)}` : "No medication reminder"}`,
    "",
    "HEALTH RECORDS",
    `ANC number: ${healthRecords?.ancNumber || "Not added"}`,
    `Blood group: ${healthRecords?.bloodGroup || "Not added"}`,
    `Allergies: ${healthRecords?.allergies || "Not added"}`,
    `Known conditions: ${healthRecords?.knownConditions || "Not added"}`,
    `Current facility: ${healthRecords?.currentFacility || "Not added"}`,
    `Scan notes: ${healthRecords?.scanNotes || "Not added"}`,
    `Lab notes: ${healthRecords?.labNotes || "Not added"}`,
    "",
    "EMERGENCY PLAN",
    `Nearest facility: ${emergencyPlan?.nearestFacility || "Not added"}`,
    `Facility phone: ${emergencyPlan?.facilityPhone || "Not added"}`,
    `Transport: ${emergencyPlan?.transportName || "Not added"} - ${emergencyPlan?.transportPhone || "Not added"}`,
    `Support person: ${emergencyPlan?.supportPerson || "Not added"} - ${emergencyPlan?.supportPhone || "Not added"}`,
    `Emergency readiness: ${emergencyReadiness}%`,
    "",
    "POSTNATAL / AFTER BIRTH",
    `Status: ${postnatalSummary.ready ? postnatalSummary.date : "Not set"}`,
    `Baby name: ${postnatalCare?.babyName || "Not added"}`,
    `Delivery facility: ${postnatalCare?.deliveryFacility || "Not added"}`,
    `Birth weight: ${postnatalCare?.birthWeight || "Not added"}`,
    "",
    "NOTE",
    "This report is generated from saved MamaCare data. It supports care communication but is not a medical diagnosis.",
  ].join("\n");

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamacare-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      alert("Report copied to clipboard.");
    } catch {
      alert("Copy failed. You can select and copy the report manually.");
    }
  };

  return (
    <Page>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div
          className="rounded-[2rem] p-6 text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-100">Reports & printable summary</p>
              <h1 className="mt-2 text-3xl font-extrabold">Clinic-ready pregnancy summary</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50">
                Generate a clean summary of the mother’s profile, pregnancy progress, risk status, ANC planning, records, emergency plan, and recent monitoring logs.
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-4">
              <FileText className="h-9 w-9" />
            </div>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Current report status</p>
              <p className="mt-1 text-xs text-slate-500">Based on the latest saved MamaCare data.</p>
            </div>
            <RiskPill risk={risk} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InsightMini label="ANC ready" value={`${ancProgress}%`} />
            <InsightMini label="Emergency ready" value={`${emergencyReadiness}%`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="Mother"
          value={mother.name || "Mother"}
          subtitle={`Week ${mother.week || "—"} • Due ${mother.dueDate || "not set"}`}
          onClick={() => go("profile")}
        />
        <InsightCard
          title="Next ANC"
          value={nextAppointment.dateText}
          subtitle={nextAppointment.location}
          onClick={() => go("anc")}
        />
        <InsightCard
          title="Health records"
          value={healthRecords?.ancNumber || "Not added"}
          subtitle={healthRecords?.bloodGroup ? `Blood group: ${healthRecords.bloodGroup}` : "Add ANC number and blood group"}
          onClick={() => go("records")}
        />
        <InsightCard
          title="Medication"
          value={nextMedication ? nextMedication.name : "Not added"}
          subtitle={nextMedication ? `${formatMedicationTime(nextMedication.time)} • ${nextMedication.dosage}` : "Add supplement reminders"}
          onClick={() => go("medications")}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Printable summary preview</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This is the plain-text version you can copy, download, or print before a clinic visit.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={copyReport} className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700">
                Copy
              </button>
              <button onClick={downloadReport} className="rounded-2xl bg-blue-900 px-4 py-3 text-xs font-bold text-white">
                Download
              </button>
              <button onClick={() => window.print()} className="rounded-2xl bg-teal-600 px-4 py-3 text-xs font-bold text-white">
                Print
              </button>
            </div>
          </div>

          <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
{reportText}
          </pre>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-slate-900">Latest monitoring included</h3>
            <div className="mt-4 space-y-3">
              <InsightRow label="Symptoms" value={latestSymptom ? `${latestSymptom.risk} • ${latestSymptom.date}` : "No symptom log yet"} onClick={() => go("log")} />
              <InsightRow label="Vitals" value={latestVitals ? `${latestVitals.systolic}/${latestVitals.diastolic} BP • ${latestVitals.date}` : "No vitals logged yet"} onClick={() => go("vitals")} />
              <InsightRow label="Movement" value={latestMovement ? `${latestMovement.count} movements • ${latestMovement.feelingLabel}` : "No movement check yet"} onClick={() => go("movement")} />
              <InsightRow label="Wellness" value={latestWellness ? `${latestWellness.moodLabel} mood • Stress ${latestWellness.stress}` : "No wellness log yet"} onClick={() => go("wellness")} />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900">Before printing</h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>• Update your profile, ANC appointment, health records, and emergency plan.</p>
              <p>• Log recent symptoms, vitals, baby movement, and wellness before your clinic visit.</p>
              <p>• Carry your official ANC card. This report supports communication but does not replace clinical records.</p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

function DataBackupPage({ resetApp }) {
  const [backupText, setBackupText] = useState("");
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");

  const backupKeys = [
    "mamacare_screen",
    "mamacare_mother",
    "mamacare_symptoms",
    "mamacare_custom_symptoms",
    "mamacare_symptom_history",
    "mamacare_vitals_history",
    "mamacare_wellness_history",
    "mamacare_appointments",
    "mamacare_medications",
    "mamacare_movement_history",
    "mamacare_emergency_plan",
    "mamacare_health_records",
    "mamacare_postnatal_care",
    "mamacare_chat_history",
    "mamacare_read_notifications",
    "mamacare_accessibility_settings",
    "mamacare_saved_tips",
    "mamacare_read_tips",
    "mamacare_active_tab",
    "mamacare_sidebar_collapsed",
    "mamacare_anc_checklist",
    "mamacare_birth_checklist",
  ];

  const collectBackup = () => {
    const data = {
      app: "MamaCare",
      version: "phase-37-backup-export",
      exportedAt: new Date().toISOString(),
      records: {},
    };

    backupKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          data.records[key] = JSON.parse(value);
        } catch {
          data.records[key] = value;
        }
      }
    });

    return data;
  };

  const generateBackup = () => {
    const data = collectBackup();
    const json = JSON.stringify(data, null, 2);
    setBackupText(json);
    setStatus("Backup generated. You can copy it or download it as a file.");
  };

  const downloadBackup = () => {
    const data = collectBackup();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamacare-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBackupText(json);
    setStatus("Backup downloaded successfully.");
  };

  const copyBackup = async () => {
    const json = backupText || JSON.stringify(collectBackup(), null, 2);
    setBackupText(json);

    try {
      await navigator.clipboard.writeText(json);
      setStatus("Backup copied to clipboard.");
    } catch {
      setStatus("Could not copy automatically. Select the backup text and copy it manually.");
    }
  };

  const importBackup = () => {
    try {
      const parsed = JSON.parse(importText);
      const records = parsed.records || parsed;

      Object.entries(records).forEach(([key, value]) => {
        if (key.startsWith("mamacare_")) {
          localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value)
          );
        }
      });

      setStatus("Backup imported successfully. Reloading MamaCare now.");
      window.location.reload();
    } catch {
      setStatus("Import failed. Please paste a valid MamaCare JSON backup file.");
    }
  };

  const backupCount = backupKeys.filter((key) => localStorage.getItem(key) !== null).length;

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Data backup</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Backup and export center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Export the mother’s saved MamaCare data, keep a safe copy, or import it later on the same browser or another device.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
          {backupCount} saved data groups found
        </div>
      </div>

      {status && (
        <Card className="bg-teal-50">
          <p className="text-sm font-semibold text-teal-700">{status}</p>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <FileText className="h-7 w-7 text-blue-900" />
          <h3 className="mt-3 font-bold text-slate-900">Generate backup</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create a readable JSON backup from all saved MamaCare modules.
          </p>
          <button
            onClick={generateBackup}
            className="mt-4 w-full rounded-2xl bg-blue-900 py-3 text-sm font-bold text-white"
          >
            Generate Backup
          </button>
        </Card>

        <Card>
          <ClipboardList className="h-7 w-7 text-teal-600" />
          <h3 className="mt-3 font-bold text-slate-900">Download or copy</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Download a backup file or copy the backup text for safe keeping.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={downloadBackup}
              className="rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white"
            >
              Download
            </button>
            <button
              onClick={copyBackup}
              className="rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
            >
              Copy
            </button>
          </div>
        </Card>

        <Card>
          <ShieldAlert className="h-7 w-7 text-red-500" />
          <h3 className="mt-3 font-bold text-slate-900">Reset local data</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Clear this browser’s saved prototype data and start again.
          </p>
          <button
            onClick={resetApp}
            className="mt-4 w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white"
          >
            Reset MamaCare Data
          </button>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900">Backup text</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          This text contains the mother’s local app data. Keep it private and only share it with someone trusted.
        </p>
        <textarea
          value={backupText}
          onChange={(e) => setBackupText(e.target.value)}
          placeholder="Click Generate Backup to see the export here."
          rows={12}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs text-slate-800 outline-none"
        />
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900">Import backup</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Paste a MamaCare JSON backup below, then import it. The app will reload after a successful import.
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste MamaCare backup JSON here..."
          rows={8}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs text-slate-800 outline-none"
        />
        <button
          onClick={importBackup}
          className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          Import Backup
        </button>
      </Card>
    </Page>
  );
}

function SettingsPage({ accessibilitySettings, setAccessibilitySettings, go }) {
  const updateSetting = (key, value) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setAccessibilitySettings(defaultAccessibilitySettings);
  };

  const currentFontSize =
    typeof accessibilitySettings.textSize === "number"
      ? accessibilitySettings.textSize
      : accessibilitySettings.textSize === "Large"
      ? 18
      : accessibilitySettings.textSize === "Small"
      ? 14
      : 16;

  const fontSizeLabel =
    currentFontSize <= 14
      ? "Small"
      : currentFontSize >= 18
      ? "Large"
      : "Normal";

  const appearanceOptions = ["Light", "Dark", "System default"];
  const notificationOptions = ["All reminders", "Important only", "Emergency only"];
  const reminderMethodOptions = ["In-app", "SMS later", "WhatsApp later"];
  const languageOptions = ["English", "Luganda", "Swahili"];
  const emergencyDisplayOptions = ["Detailed", "Simple"];

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Settings</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Accessibility and preferences
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Adjust MamaCare so the mother can read information comfortably,
            control reminders, and make emergency information easier to use.
          </p>
        </div>

        <button
          onClick={resetSettings}
          className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
        >
          Reset settings
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-3">
              <BookOpen className="h-6 w-6 text-blue-900" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Font size</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Drag the slider to increase or decrease text size across the app.
                  </p>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
                  {fontSizeLabel} · {currentFontSize}px
                </span>
              </div>

              <div className="mt-5">
                <input
                  type="range"
                  min="13"
                  max="20"
                  step="1"
                  value={currentFontSize}
                  onChange={(e) => updateSetting("textSize", Number(e.target.value))}
                  className="w-full accent-blue-900"
                />
                <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                  <span>Small</span>
                  <span>Normal</span>
                  <span>Large</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">Preview text</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  MamaCare will use this reading size for pregnancy tips, reminders,
                  records, and emergency guidance.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-50 p-3">
              <Moon className="h-6 w-6 text-indigo-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Appearance</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose light mode, dark mode, or follow the device system setting.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {appearanceOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("appearance", option)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      accessibilitySettings.appearance === option
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-100 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3">
              <ShieldAlert className="h-6 w-6 text-slate-800" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Contrast and simplified view</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Use stronger contrast or simpler card styling for mothers who prefer clearer screens.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => updateSetting("contrastMode", !accessibilitySettings.contrastMode)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                    accessibilitySettings.contrastMode
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  High contrast {accessibilitySettings.contrastMode ? "On" : "Off"}
                </button>
                <button
                  onClick={() => updateSetting("simplifiedMode", !accessibilitySettings.simplifiedMode)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                    accessibilitySettings.simplifiedMode
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  Simple mode {accessibilitySettings.simplifiedMode ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-orange-50 p-3">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Notification preference</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose how much reminder information should be emphasized.
              </p>
              <div className="mt-4 grid gap-3">
                {notificationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("notificationPreference", option)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                      accessibilitySettings.notificationPreference === option
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-100 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-sky-50 p-3">
              <Smartphone className="h-6 w-6 text-sky-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Reminder method</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose where MamaCare should prioritize appointment and medicine reminders. SMS and WhatsApp are marked for future integration.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {reminderMethodOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("reminderMethod", option)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      accessibilitySettings.reminderMethod === option
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-100 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3">
              <MessageCircle className="h-6 w-6 text-teal-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Language preference</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose the language MamaCare should use across the app.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {languageOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("language", option)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      accessibilitySettings.language === option
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-100 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-50 p-3">
                <Siren className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Emergency display preference</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Choose whether Emergency Help should show detailed guidance or a shorter emergency-first view.
                </p>
              </div>
            </div>

            <div className="grid min-w-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {emergencyDisplayOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => updateSetting("emergencyDisplay", option)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                    accessibilitySettings.emergencyDisplay === option
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
        <h3 className="font-bold text-slate-900">Current settings summary</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-slate-500">Text size</p>
            <p className="mt-1 font-bold text-slate-900">{fontSizeLabel} · {currentFontSize}px</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-slate-500">Appearance</p>
            <p className="mt-1 font-bold text-slate-900">{accessibilitySettings.appearance}</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-slate-500">Notifications</p>
            <p className="mt-1 font-bold text-slate-900">{accessibilitySettings.notificationPreference}</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-slate-500">Language</p>
            <p className="mt-1 font-bold text-slate-900">{accessibilitySettings.language}</p>
          </div>
        </div>
        <button
          onClick={() => go("notifications")}
          className="mt-5 rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white"
        >
          Open notification center
        </button>
      </Card>
    </Page>
  );
}


function getSyncCollections({
  mother,
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  chatHistory,
  readNotificationIds,
  savedTipIds,
  readTipIds,
  completedANC,
  completedBirth,
}) {
  return [
    { key: "mother", label: "Mother profile", count: mother?.name ? 1 : 0, status: mother?.name ? "Ready" : "Missing" },
    { key: "symptoms", label: "Current symptom selections", count: (selectedSymptoms?.length || 0) + (customSymptoms?.length || 0), status: "Ready" },
    { key: "symptomHistory", label: "Symptom history", count: symptomHistory?.length || 0, status: "Ready" },
    { key: "vitals", label: "Vitals history", count: vitalsHistory?.length || 0, status: "Ready" },
    { key: "wellness", label: "Wellness history", count: wellnessHistory?.length || 0, status: "Ready" },
    { key: "movement", label: "Baby movement checks", count: movementHistory?.length || 0, status: "Ready" },
    { key: "appointments", label: "ANC appointments", count: appointments?.length || 0, status: "Ready" },
    { key: "medications", label: "Medication reminders", count: medications?.length || 0, status: "Ready" },
    { key: "emergencyPlan", label: "Emergency plan", count: emergencyPlan?.nearestFacility || emergencyPlan?.transportPhone ? 1 : 0, status: emergencyPlan?.nearestFacility || emergencyPlan?.transportPhone ? "Ready" : "Incomplete" },
    { key: "healthRecords", label: "Health records", count: healthRecords?.ancNumber || healthRecords?.bloodGroup ? 1 : 0, status: healthRecords?.ancNumber || healthRecords?.bloodGroup ? "Ready" : "Incomplete" },
    { key: "postnatal", label: "Postnatal care", count: postnatalCare?.history?.length || 0, status: "Ready" },
    { key: "support", label: "Support people", count: supportPeople?.length || 0, status: "Ready" },
    { key: "chat", label: "MamaCare chat history", count: chatHistory?.length || 0, status: "Ready" },
    { key: "notifications", label: "Notification read states", count: readNotificationIds?.length || 0, status: "Ready" },
    { key: "tips", label: "Saved/read health tips", count: (savedTipIds?.length || 0) + (readTipIds?.length || 0), status: "Ready" },
    { key: "checklists", label: "ANC and birth checklists", count: (completedANC?.length || 0) + (completedBirth?.length || 0), status: "Ready" },
  ];
}



function AccountSecurityPage({ go, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  const hasToken = Boolean(apiTools.getToken());

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({
        loading: false,
        message: "",
        error: "Please fill in current password, new password, and confirmation.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        loading: false,
        message: "",
        error: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        loading: false,
        message: "",
        error: "New password and confirmation do not match.",
      });
      return;
    }

    try {
      setStatus({ loading: true, message: "", error: "" });

      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setStatus({
        loading: false,
        message: "Password changed successfully. Use the new password next time you log in.",
        error: "",
      });
    } catch (error) {
      setStatus({
        loading: false,
        message: "",
        error:
          error.message ||
          "Password change failed. Confirm your current password and backend connection.",
      });
    }
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Account security</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Password and session
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the mother’s account password and confirm whether this app session is connected to the backend account.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Backend session
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${hasToken ? "bg-green-500" : "bg-orange-500"}`}
            />
            <span className="text-sm font-bold text-slate-800">
              {hasToken ? "Logged in with token" : "No backend token found"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h3 className="font-bold text-slate-900">Change password</h3>

          <Input
            icon={Lock}
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            type="password"
          />

          <Input
            icon={Lock}
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
            type="password"
          />

          <Input
            icon={Lock}
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat new password"
            type="password"
          />

          {status.error && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
              {status.error}
            </div>
          )}

          {status.message && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {status.message}
            </div>
          )}

          <button
            onClick={changePassword}
            disabled={status.loading || !hasToken}
            className={`w-full rounded-2xl py-4 font-bold text-white shadow-lg ${
              status.loading || !hasToken ? "bg-slate-400" : "bg-blue-900"
            }`}
          >
            {status.loading ? "Updating password..." : "Update Password"}
          </button>

          {!hasToken && (
            <p className="text-sm leading-6 text-slate-500">
              Login again to reconnect this browser session to the backend before changing password.
            </p>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-slate-900">Security notes</h3>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <p>• Use a password that is not easy to guess.</p>
              <p>• Do not share your MamaCare password with anyone.</p>
              <p>• Logout when using a shared computer.</p>
              <p>• If you forget your password, a reset flow can be added later.</p>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900">Session actions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Logout clears the local backend token from this browser. Your saved records remain in the backend database.
            </p>

            <button
              onClick={onLogout}
              className="mt-4 w-full rounded-2xl bg-red-500 py-4 font-bold text-white shadow-lg"
            >
              Logout
            </button>

            <button
              onClick={() => go("pending-sync")}
              className="mt-3 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg"
            >
              Check pending sync
            </button>
          </Card>
        </div>
      </div>
    </Page>
  );
}



function safeTimelineDate(value) {
  if (!value) return new Date(0);

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const fallback = Date.parse(String(value).replace(",", ""));
  return Number.isNaN(fallback) ? new Date(0) : new Date(fallback);
}

function buildMotherTimeline({
  mother,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
}) {
  const items = [];

  items.push({
    id: "profile-start",
    type: "Profile",
    title: "Pregnancy profile active",
    date: "Current",
    rawDate: new Date(),
    description: `Week ${mother.week}. Due date: ${formatDisplayDate(mother.dueDate)}.`,
    level: "normal",
    icon: UserRound,
    target: "profile",
  });

  symptomHistory.forEach((log) => {
    items.push({
      id: `symptom-${log.id}`,
      type: "Symptoms",
      title: `${log.risk || "normal"} symptom log`,
      date: log.date || "Saved symptom log",
      rawDate: safeTimelineDate(log.date),
      description: (log.symptoms || []).join(", ") || "Symptoms were logged.",
      level: log.risk || "normal",
      icon: Activity,
      target: "log",
    });
  });

  vitalsHistory.forEach((entry) => {
    items.push({
      id: `vitals-${entry.id}`,
      type: "Vitals",
      title: "Vitals recorded",
      date: entry.date || "Saved vitals",
      rawDate: safeTimelineDate(entry.date),
      description: `BP ${entry.systolic}/${entry.diastolic}, temperature ${entry.temperature}°C, movement: ${entry.movementLabel || entry.movement || "not recorded"}.`,
      level: entry.analysis?.level || "normal",
      icon: Gauge,
      target: "vitals",
    });
  });

  wellnessHistory.forEach((entry) => {
    items.push({
      id: `wellness-${entry.id}`,
      type: "Wellness",
      title: "Wellness check saved",
      date: entry.date || "Saved wellness check",
      rawDate: safeTimelineDate(entry.date),
      description: `Mood: ${entry.moodLabel || entry.mood}, energy: ${entry.energy}, sleep: ${entry.sleep}, stress: ${entry.stress}.`,
      level: entry.analysis?.level || "normal",
      icon: Smile,
      target: "wellness",
    });
  });

  appointments.forEach((appointment) => {
    items.push({
      id: `appointment-${appointment.id}`,
      type: "Appointment",
      title: appointment.title || appointment.type || "ANC appointment",
      date: appointment.date ? formatDisplayDate(appointment.date) : "Appointment date not set",
      rawDate: safeTimelineDate(appointment.date || appointment.createdAt),
      description: `${appointment.time || ""} ${appointment.facility || ""}`.trim() || "Appointment saved.",
      level: "normal",
      icon: CalendarDays,
      target: "anc",
    });
  });

  medications.forEach((medication) => {
    items.push({
      id: `medication-${medication.id}`,
      type: "Medication",
      title: medication.name || "Medication reminder",
      date: medication.updatedAt || medication.createdAt || "Medication reminder",
      rawDate: safeTimelineDate(medication.updatedAt || medication.createdAt),
      description: `${medication.dosage || "As prescribed"} • ${medication.frequency || "Frequency not set"} • ${medication.time || "Time not set"}`,
      level: "normal",
      icon: Pill,
      target: "medications",
    });
  });

  movementHistory.forEach((entry) => {
    items.push({
      id: `movement-${entry.id}`,
      type: "Baby movement",
      title: "Baby movement check",
      date: entry.date || "Saved movement check",
      rawDate: safeTimelineDate(entry.date),
      description: `${entry.count || 0} movement(s), feeling: ${entry.feelingLabel || entry.feeling || "not recorded"}.`,
      level: entry.analysis?.level || entry.risk || "normal",
      icon: Baby,
      target: "movement",
    });
  });

  if (emergencyPlan?.updatedAt || emergencyPlan?.nearestFacility || emergencyPlan?.supportPerson) {
    items.push({
      id: "emergency-plan",
      type: "Emergency plan",
      title: "Emergency plan updated",
      date: emergencyPlan.updatedAt || "Saved emergency plan",
      rawDate: safeTimelineDate(emergencyPlan.updatedAt),
      description: `Facility: ${emergencyPlan.nearestFacility || "not set"}. Support: ${emergencyPlan.supportPerson || "not set"}.`,
      level: emergencyPlan.nearestFacility && emergencyPlan.supportPerson ? "normal" : "watch",
      icon: MapPinned,
      target: "emergencyPlan",
    });
  }

  if (healthRecords?.updatedAt || healthRecords?.ancNumber || healthRecords?.bloodGroup) {
    items.push({
      id: "health-records",
      type: "Health records",
      title: "Health records updated",
      date: healthRecords.updatedAt || "Saved health records",
      rawDate: safeTimelineDate(healthRecords.updatedAt),
      description: `ANC: ${healthRecords.ancNumber || "not set"}. Blood group: ${healthRecords.bloodGroup || "not set"}.`,
      level: healthRecords.ancNumber || healthRecords.bloodGroup ? "normal" : "watch",
      icon: FileText,
      target: "records",
    });
  }

  if (postnatalCare?.updatedAt || postnatalCare?.afterBirthMode) {
    items.push({
      id: "postnatal-care",
      type: "Postnatal",
      title: postnatalCare.afterBirthMode ? "After birth mode active" : "Postnatal care updated",
      date: postnatalCare.updatedAt || postnatalCare.deliveryDate || "Postnatal care",
      rawDate: safeTimelineDate(postnatalCare.updatedAt || postnatalCare.deliveryDate),
      description: `Baby: ${postnatalCare.babyName || "not set"}. Delivery facility: ${postnatalCare.deliveryFacility || "not set"}.`,
      level: "normal",
      icon: Heart,
      target: "postnatal",
    });
  }

  supportPeople.forEach((person) => {
    items.push({
      id: `support-${person.id}`,
      type: "Support",
      title: person.isPrimary ? "Primary support person saved" : "Support person saved",
      date: person.updatedAt || "Saved support person",
      rawDate: safeTimelineDate(person.updatedAt),
      description: `${person.name || "Support person"} • ${person.relationship || person.role || "support"}`,
      level: person.phone ? "normal" : "watch",
      icon: UserRound,
      target: "support",
    });
  });

  return items.sort((a, b) => b.rawDate - a.rawDate);
}


function getCarePlanTasks({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  completedANC,
  completedBirth,
}) {
  const tasks = [];
  const latestSymptom = symptomHistory[0];
  const latestVitals = vitalsHistory[0];
  const latestWellness = wellnessHistory[0];
  const latestMovement = movementHistory[0];
  const nextAppointment = getNextAppointment(appointments, mother);
  const nextMedication = getNextMedication(medications);
  const ancProgress = Math.round(((completedANC?.length || 0) / ancChecklist.length) * 100);
  const birthProgress = Math.round(((completedBirth?.length || 0) / birthChecklist.length) * 100);

  if (risk === "urgent" || latestSymptom?.risk === "urgent" || latestVitals?.analysis?.level === "urgent") {
    tasks.push({
      id: "urgent-risk",
      priority: "urgent",
      title: "Respond to urgent health warning",
      text: "MamaCare has detected an urgent risk from symptoms, vitals, movement, or wellness. Do not delay care.",
      action: "Open Emergency Help",
      target: "emergency",
      icon: Siren,
    });
  }

  if (!latestSymptom) {
    tasks.push({
      id: "log-symptoms",
      priority: "normal",
      title: "Log today’s symptoms",
      text: "Record how you feel today so MamaCare can keep your risk awareness updated.",
      action: "Log symptoms",
      target: "log",
      icon: Activity,
    });
  }

  if (!latestVitals) {
    tasks.push({
      id: "log-vitals",
      priority: "watch",
      title: "Record pregnancy vitals",
      text: "Add blood pressure, temperature, and baby movement status for safer monitoring.",
      action: "Log vitals",
      target: "vitals",
      icon: Gauge,
    });
  }

  if (Number(mother.week) >= 20 && !latestMovement) {
    tasks.push({
      id: "movement-check",
      priority: "watch",
      title: "Check baby movement",
      text: "Since baby movement is important later in pregnancy, record a movement check today.",
      action: "Open movement counter",
      target: "movement",
      icon: Baby,
    });
  }

  if (!latestWellness) {
    tasks.push({
      id: "wellness-check",
      priority: "normal",
      title: "Complete wellness check",
      text: "Track mood, sleep, stress, and energy to support the mother’s mental wellbeing.",
      action: "Log wellness",
      target: "wellness",
      icon: Smile,
    });
  }

  if (!nextAppointment) {
    tasks.push({
      id: "add-appointment",
      priority: "watch",
      title: "Add next ANC appointment",
      text: "Save your next antenatal care visit so MamaCare can remind you and help you prepare.",
      action: "Add appointment",
      target: "anc",
      icon: CalendarDays,
    });
  }

  if (ancProgress < 100) {
    tasks.push({
      id: "anc-checklist",
      priority: ancProgress < 50 ? "watch" : "normal",
      title: "Prepare for ANC visit",
      text: `${ancProgress}% of your ANC preparation checklist is complete.`,
      action: "Open ANC checklist",
      target: "anc",
      icon: ClipboardList,
    });
  }

  if (Number(mother.week) >= 28 && birthProgress < 100) {
    tasks.push({
      id: "birth-checklist",
      priority: birthProgress < 50 ? "watch" : "normal",
      title: "Prepare birth checklist",
      text: `${birthProgress}% of your birth preparation checklist is complete.`,
      action: "Open birth checklist",
      target: "birth",
      icon: ListTodo,
    });
  }

  if (!nextMedication) {
    tasks.push({
      id: "add-medication",
      priority: "normal",
      title: "Add medication reminder",
      text: "Save supplements or pregnancy medicines such as iron, folic acid, or prescribed medication.",
      action: "Open medication",
      target: "medications",
      icon: Pill,
    });
  }

  if (!emergencyPlan?.nearestFacility || !emergencyPlan?.supportPerson) {
    tasks.push({
      id: "emergency-plan",
      priority: "watch",
      title: "Complete emergency plan",
      text: "Add nearest facility, transport contact, and support person for safer emergency response.",
      action: "Open emergency plan",
      target: "emergencyPlan",
      icon: MapPinned,
    });
  }

  if (!healthRecords?.ancNumber && !healthRecords?.bloodGroup) {
    tasks.push({
      id: "health-records",
      priority: "normal",
      title: "Fill health records",
      text: "Add ANC number, blood group, allergies, and important medical notes.",
      action: "Open health records",
      target: "records",
      icon: FileText,
    });
  }

  if (!supportPeople || supportPeople.length === 0) {
    tasks.push({
      id: "support-person",
      priority: "watch",
      title: "Add trusted support person",
      text: "Save someone who can support you during ANC visits, transport, or emergencies.",
      action: "Add support person",
      target: "support",
      icon: UserRound,
    });
  }

  if (postnatalCare?.afterBirthMode && !postnatalCare?.nextCheckup) {
    tasks.push({
      id: "postnatal-checkup",
      priority: "watch",
      title: "Add postnatal checkup",
      text: "Save the next mother or baby checkup after delivery.",
      action: "Open postnatal care",
      target: "postnatal",
      icon: Heart,
    });
  }

  if (tasks.length === 0) {
    tasks.push({
      id: "keep-monitoring",
      priority: "normal",
      title: "Keep monitoring your pregnancy",
      text: "Your care plan looks organized. Continue logging symptoms, vitals, movement, and wellness.",
      action: "Open tracker",
      target: "tracker",
      icon: CheckCircle2,
    });
  }

  const priorityOrder = { urgent: 0, watch: 1, normal: 2 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}


function buildANCQuestions({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  medications,
  healthRecords,
  emergencyPlan,
}) {
  const questions = [];
  const latestSymptoms = symptomHistory?.[0];
  const latestVitals = vitalsHistory?.[0];
  const latestWellness = wellnessHistory?.[0];
  const latestMovement = movementHistory?.[0];

  const add = (category, question, priority = "normal") => {
    questions.push({
      id: `${category}-${questions.length + 1}`,
      category,
      question,
      priority,
    });
  };

  add("Pregnancy progress", `I am around week ${mother.week}. Is my pregnancy progressing normally for this stage?`);

  if (mother.dueDate) {
    add("Pregnancy progress", `My expected due date is ${formatDisplayDate(mother.dueDate)}. What should I prepare now?`);
  }

  if (risk === "urgent") {
    add("Urgent warning", "MamaCare has flagged an urgent warning. What should be checked immediately today?", "urgent");
  }

  if (latestSymptoms?.symptoms?.length) {
    add(
      "Symptoms",
      `I recently logged these symptoms: ${latestSymptoms.symptoms.join(", ")}. What could they mean and what should I do next?`,
      latestSymptoms.risk === "urgent" ? "urgent" : latestSymptoms.risk === "watch" ? "watch" : "normal"
    );
  } else {
    add("Symptoms", "Which danger signs should I watch for before my next ANC visit?");
  }

  if (latestVitals) {
    add(
      "Vitals",
      `My recent vitals were BP ${latestVitals.systolic}/${latestVitals.diastolic}, temperature ${latestVitals.temperature}°C, and movement status ${latestVitals.movementLabel || latestVitals.movement || "not recorded"}. Are these safe?`,
      latestVitals.analysis?.level === "urgent" ? "urgent" : latestVitals.analysis?.level === "watch" ? "watch" : "normal"
    );
  } else {
    add("Vitals", "Should I check my blood pressure, temperature, or other vitals during this ANC visit?", "watch");
  }

  if (Number(mother.week) >= 20) {
    if (latestMovement) {
      add(
        "Baby movement",
        `I recently counted ${latestMovement.count || 0} baby movement(s), and the feeling was ${latestMovement.feelingLabel || latestMovement.feeling || "not recorded"}. Is this normal?`,
        latestMovement.analysis?.level === "urgent" ? "urgent" : latestMovement.analysis?.level === "watch" ? "watch" : "normal"
      );
    } else {
      add("Baby movement", "At my current pregnancy stage, how often should I monitor baby movement?", "watch");
    }
  }

  if (latestWellness) {
    add(
      "Mother wellness",
      `My recent wellness check showed mood: ${latestWellness.moodLabel || latestWellness.mood}, sleep: ${latestWellness.sleep}, stress: ${latestWellness.stress}, and energy: ${latestWellness.energy}. What can I improve?`,
      latestWellness.analysis?.level === "watch" ? "watch" : "normal"
    );
  } else {
    add("Mother wellness", "What should I do if I feel stressed, tired, or emotionally overwhelmed during pregnancy?");
  }

  if (medications?.length) {
    const names = medications.slice(0, 4).map((item) => item.name).join(", ");
    add("Medication", `I am tracking these medicines or supplements: ${names}. Are they still appropriate and how should I take them safely?`);
  } else {
    add("Medication", "Do I need iron, folic acid, malaria prevention, tetanus injection, or other pregnancy supplements?");
  }

  if (healthRecords?.bloodGroup || healthRecords?.allergies || healthRecords?.chronicConditions) {
    add(
      "Health records",
      `My records show blood group ${healthRecords.bloodGroup || "not recorded"}, allergies ${healthRecords.allergies || "not recorded"}, and conditions ${healthRecords.chronicConditions || healthRecords.knownConditions || "not recorded"}. Is there anything important to note?`
    );
  } else {
    add("Health records", "Which tests or records should I update today, such as blood group, urine test, scan notes, or lab results?");
  }

  if (!emergencyPlan?.nearestFacility || !emergencyPlan?.supportPerson) {
    add("Emergency plan", "Can you help me confirm the nearest facility, transport plan, and support contact for emergencies?", "watch");
  } else {
    add("Emergency plan", `My emergency plan uses ${emergencyPlan.nearestFacility} and support person ${emergencyPlan.supportPerson}. Is this plan enough?`);
  }

  add("Next visit", "When should I come back for my next ANC visit, and what should I bring?");

  const order = { urgent: 0, watch: 1, normal: 2 };
  return questions.sort((a, b) => order[a.priority] - order[b.priority]);
}


function getDigitalCardData({
  mother,
  risk,
  appointments,
  medications,
  healthRecords,
  emergencyPlan,
  postnatalCare,
  supportPeople,
  symptomHistory,
  vitalsHistory,
  movementHistory,
}) {
  const nextAppointment = getNextAppointment(appointments, mother);
  const nextMedication = getNextMedication(medications);
  const primarySupport = getPrimarySupportPerson(supportPeople);
  const latestSymptom = symptomHistory?.[0];
  const latestVitals = vitalsHistory?.[0];
  const latestMovement = movementHistory?.[0];

  return {
    motherName: mother.name || "Mother",
    phone: mother.phone || "Not set",
    location: mother.location || "Not set",
    pregnancyWeek: mother.week || "Not set",
    dueDate: formatDisplayDate(mother.dueDate),
    risk: risk || "normal",
    ancNumber: healthRecords?.ancNumber || "Not set",
    bloodGroup: healthRecords?.bloodGroup || emergencyPlan?.bloodGroup || "Not set",
    allergies: healthRecords?.allergies || "Not recorded",
    facility: healthRecords?.currentFacility || emergencyPlan?.nearestFacility || "Not set",
    midwifeDoctor: healthRecords?.midwifeDoctor || healthRecords?.mainHealthWorker || "Not set",
    nextANC: nextAppointment
      ? `${formatDisplayDate(nextAppointment.date)} ${nextAppointment.time || ""}`.trim()
      : "Not scheduled",
    nextMedication: nextMedication
      ? `${nextMedication.name} at ${formatMedicationTime(nextMedication.time)}`
      : "Not set",
    emergencyFacility: emergencyPlan?.nearestFacility || "Not set",
    emergencyTransport: emergencyPlan?.transportName || emergencyPlan?.transportPerson || "Not set",
    emergencySupport: emergencyPlan?.supportPerson || primarySupport?.name || "Not set",
    emergencyPhone: emergencyPlan?.supportPhone || primarySupport?.phone || "Not set",
    latestSymptoms: latestSymptom?.symptoms?.join(", ") || "No recent symptoms",
    latestVitals: latestVitals
      ? `BP ${latestVitals.systolic}/${latestVitals.diastolic}, Temp ${latestVitals.temperature}°C`
      : "No recent vitals",
    latestMovement: latestMovement
      ? `${latestMovement.count || 0} movement(s), ${latestMovement.feelingLabel || latestMovement.feeling || "not recorded"}`
      : "No movement check",
    postnatalMode: postnatalCare?.afterBirthMode ? "Active" : "Not active",
    babyName: postnatalCare?.babyName || "Not set",
    deliveryDate: postnatalCare?.deliveryDate
      ? formatDisplayDate(postnatalCare.deliveryDate)
      : "Not set",
  };
}

function PrintableDigitalCard({ title, subtitle, children, footer }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <div
        className="p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-50">
              MamaCare digital card
            </p>
            <h3 className="mt-2 text-xl font-extrabold">{title}</h3>
            <p className="mt-1 text-sm text-blue-50">{subtitle}</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-3">
            <IdCard className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">{children}</div>

      {footer && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs leading-5 text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}

function CardRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">{value || "Not set"}</span>
    </div>
  );
}

function DigitalCardsPage({
  mother,
  risk,
  appointments,
  medications,
  healthRecords,
  emergencyPlan,
  postnatalCare,
  supportPeople,
  symptomHistory,
  vitalsHistory,
  movementHistory,
  go,
}) {
  const [copied, setCopied] = useState("");

  const cardData = getDigitalCardData({
    mother,
    risk,
    appointments,
    medications,
    healthRecords,
    emergencyPlan,
    postnatalCare,
    supportPeople,
    symptomHistory,
    vitalsHistory,
    movementHistory,
  });

  const cardText = {
    anc: `MamaCare ANC Card
Mother: ${cardData.motherName}
Phone: ${cardData.phone}
Location: ${cardData.location}
Pregnancy week: ${cardData.pregnancyWeek}
Due date: ${cardData.dueDate}
ANC number: ${cardData.ancNumber}
Blood group: ${cardData.bloodGroup}
Facility: ${cardData.facility}
Next ANC: ${cardData.nextANC}`,

    vaccination: `MamaCare Injections / Supplements Card
Mother: ${cardData.motherName}
ANC number: ${cardData.ancNumber}
Blood group: ${cardData.bloodGroup}
Injection / supplement notes: ${healthRecords?.vaccinationNotes || "Not recorded"}
Allergies: ${cardData.allergies}
Facility: ${cardData.facility}`,

    emergency: `MamaCare Emergency Card
Mother: ${cardData.motherName}
Risk status: ${cardData.risk}
Blood group: ${cardData.bloodGroup}
Allergies: ${cardData.allergies}
Emergency facility: ${cardData.emergencyFacility}
Transport: ${cardData.emergencyTransport}
Support person: ${cardData.emergencySupport}
Support phone: ${cardData.emergencyPhone}`,

    postnatal: `MamaCare Postnatal Card
Mother: ${cardData.motherName}
Postnatal mode: ${cardData.postnatalMode}
Baby name: ${cardData.babyName}
Delivery date: ${cardData.deliveryDate}
Facility: ${postnatalCare?.deliveryFacility || "Not set"}
Feeding: ${postnatalCare?.feedingMethod || "Not set"}`,
  };

  const copyCard = async (key) => {
    await navigator.clipboard.writeText(cardText[key]);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const printCards = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MamaCare Digital Cards</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            .card { border: 1px solid #E5E7EB; border-radius: 18px; padding: 20px; margin-bottom: 18px; page-break-inside: avoid; }
            h1 { color: #1E3A8A; }
            h2 { color: #1E3A8A; margin-bottom: 8px; }
            p { margin: 6px 0; line-height: 1.5; }
            .muted { color: #6B7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>MamaCare Digital Cards</h1>
          <p class="muted">Generated from saved MamaCare records.</p>

          ${Object.entries(cardText)
            .map(
              ([key, value]) => `
                <div class="card">
                  <h2>${key.toUpperCase()} CARD</h2>
                  ${value
                    .split("\n")
                    .map((line) => `<p>${line}</p>`)
                    .join("")}
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Digital cards</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Mother health cards
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            View clinic-ready digital cards for pregnancy, hospital results,
            emergency response, and postnatal care.
          </p>
        </div>

        <button
          onClick={printCards}
          className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-lg"
        >
          <Printer className="mr-2 inline h-4 w-4" />
          Print all cards
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <PrintableDigitalCard
          title="ANC card"
          subtitle="Pregnancy visit summary"
          footer="Use this as a quick clinic summary. It does not replace the official hospital ANC card."
        >
          <CardRow label="Mother" value={cardData.motherName} />
          <CardRow label="Pregnancy week" value={cardData.pregnancyWeek} />
          <CardRow label="Due date" value={cardData.dueDate} />
          <CardRow label="ANC number" value={cardData.ancNumber} />
          <CardRow label="Blood group" value={cardData.bloodGroup} />
          <CardRow label="Facility" value={cardData.facility} />
          <CardRow label="Next ANC" value={cardData.nextANC} />

          <button
            onClick={() => copyCard("anc")}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            <Copy className="mr-2 inline h-4 w-4" />
            {copied === "anc" ? "Copied" : "Copy ANC card"}
          </button>
        </PrintableDigitalCard>

        <PrintableDigitalCard
          title="Injection notes card"
          subtitle="Mother injections and notes"
          footer="Keep this updated after each ANC or clinic visit."
        >
          <CardRow label="ANC number" value={cardData.ancNumber} />
          <CardRow label="Blood group" value={cardData.bloodGroup} />
          <CardRow label="Allergies" value={cardData.allergies} />
          <CardRow label="Injection / supplement notes" value={healthRecords?.vaccinationNotes || "Not recorded"} />
          <CardRow label="Facility" value={cardData.facility} />

          <button
            onClick={() => copyCard("vaccination")}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            <Copy className="mr-2 inline h-4 w-4" />
            {copied === "vaccination" ? "Copied" : "Copy injection notes card"}
          </button>
        </PrintableDigitalCard>

        <PrintableDigitalCard
          title="Emergency card"
          subtitle="Quick danger response details"
          footer="Show this during an emergency or when contacting a support person."
        >
          <CardRow label="Risk status" value={cardData.risk} />
          <CardRow label="Blood group" value={cardData.bloodGroup} />
          <CardRow label="Allergies" value={cardData.allergies} />
          <CardRow label="Facility" value={cardData.emergencyFacility} />
          <CardRow label="Transport" value={cardData.emergencyTransport} />
          <CardRow label="Support person" value={cardData.emergencySupport} />
          <CardRow label="Support phone" value={cardData.emergencyPhone} />

          <button
            onClick={() => copyCard("emergency")}
            className="w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white"
          >
            <Copy className="mr-2 inline h-4 w-4" />
            {copied === "emergency" ? "Copied" : "Copy emergency card"}
          </button>
        </PrintableDigitalCard>

        <PrintableDigitalCard
          title="Postnatal card"
          subtitle="After birth summary"
          footer="This becomes more useful after delivery or when after-birth mode is active."
        >
          <CardRow label="Postnatal mode" value={cardData.postnatalMode} />
          <CardRow label="Baby name" value={cardData.babyName} />
          <CardRow label="Delivery date" value={cardData.deliveryDate} />
          <CardRow label="Delivery facility" value={postnatalCare?.deliveryFacility || "Not set"} />
          <CardRow label="Feeding method" value={postnatalCare?.feedingMethod || "Not set"} />

          <button
            onClick={() => copyCard("postnatal")}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700"
          >
            <Copy className="mr-2 inline h-4 w-4" />
            {copied === "postnatal" ? "Copied" : "Copy postnatal card"}
          </button>
        </PrintableDigitalCard>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Keep cards accurate</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These cards are generated from the information saved in Health Records,
              Emergency Plan, Appointments, Medication, and Postnatal Care.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => go("records")}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              >
                Update health records
              </button>
              <button
                onClick={() => go("emergencyPlan")}
                className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"
              >
                Update emergency plan
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Page>
  );
}


function ANCQuestionsPage({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  movementHistory,
  medications,
  healthRecords,
  emergencyPlan,
  go,
}) {
  const [checkedQuestions, setCheckedQuestions] = useState([]);
  const [copied, setCopied] = useState(false);

  const questions = buildANCQuestions({
    mother,
    risk,
    symptomHistory,
    vitalsHistory,
    wellnessHistory,
    movementHistory,
    medications,
    healthRecords,
    emergencyPlan,
  });

  const grouped = questions.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {});

  const toggle = (id) => {
    setCheckedQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copyQuestions = async () => {
    const text = questions
      .map((item, index) => `${index + 1}. [${item.category}] ${item.question}`)
      .join("\\n");

    await navigator.clipboard.writeText(`MamaCare ANC Visit Questions\\n\\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const printQuestions = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MamaCare ANC Questions</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; line-height: 1.6; color: #111827; }
            h1 { color: #1E3A8A; }
            .meta { background: #F3F4F6; padding: 12px; border-radius: 12px; margin-bottom: 18px; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>MamaCare ANC Visit Questions</h1>
          <div class="meta">
            <strong>Mother:</strong> ${mother.name}<br/>
            <strong>Pregnancy week:</strong> ${mother.week}<br/>
            <strong>Due date:</strong> ${formatDisplayDate(mother.dueDate)}
          </div>
          <ol>
            ${questions.map((item) => `<li><strong>${item.category}:</strong> ${item.question}</li>`).join("")}
          </ol>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const urgentCount = questions.filter((item) => item.priority === "urgent").length;
  const watchCount = questions.filter((item) => item.priority === "watch").length;

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">ANC preparation</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Visit questions builder
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            MamaCare prepares clinic questions from symptoms, vitals, baby movement,
            medication, records, emergency plan, and current risk.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-slate-900">{questions.length}</p>
            <p className="text-xs font-semibold text-slate-500">Questions</p>
          </div>
          <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-red-700">{urgentCount}</p>
            <p className="text-xs font-semibold text-red-700">Urgent</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-orange-700">{watchCount}</p>
            <p className="text-xs font-semibold text-orange-700">Watch</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Clinic-ready questions</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Tick questions after asking them during the ANC visit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyQuestions}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"
            >
              <Copy className="mr-2 inline h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </button>

            <button
              onClick={printQuestions}
              className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"
            >
              <Printer className="mr-2 inline h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        {Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900">{category}</h3>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left"
                >
                  <span
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      checkedQuestions.includes(item.id)
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checkedQuestions.includes(item.id) && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold leading-6 text-slate-800">
                      {item.question}
                    </span>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        item.priority === "urgent"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "watch"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">After the ANC visit</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Update your health records, next appointment, medication reminders,
              and any new instructions from the health worker.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => go("records")}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              >
                Update records
              </button>

              <button
                onClick={() => go("anc")}
                className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"
              >
                Add next ANC
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Page>
  );
}


function CarePlanPage({
  mother,
  risk,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  completedANC,
  completedBirth,
  go,
}) {
  const [filter, setFilter] = useState("All");

  const tasks = getCarePlanTasks({
    mother,
    risk,
    symptomHistory,
    vitalsHistory,
    wellnessHistory,
    appointments,
    medications,
    movementHistory,
    emergencyPlan,
    healthRecords,
    postnatalCare,
    supportPeople,
    completedANC,
    completedBirth,
  });

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((task) => task.priority === filter);

  const urgentCount = tasks.filter((task) => task.priority === "urgent").length;
  const watchCount = tasks.filter((task) => task.priority === "watch").length;
  const normalCount = tasks.filter((task) => task.priority === "normal").length;

  const priorityStyle = {
    urgent: "border-red-100 bg-red-50 text-red-700",
    watch: "border-orange-100 bg-orange-50 text-orange-700",
    normal: "border-teal-100 bg-teal-50 text-teal-700",
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Personalized care</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Smart care plan
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            MamaCare turns the mother’s saved pregnancy data into clear next steps.
            This is a practical to-do list for safer pregnancy tracking.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-red-700">{urgentCount}</p>
            <p className="text-xs font-semibold text-red-700">Urgent</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-orange-700">{watchCount}</p>
            <p className="text-xs font-semibold text-orange-700">Watch</p>
          </div>
          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-teal-700">{normalCount}</p>
            <p className="text-xs font-semibold text-teal-700">Normal</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {["All", "urgent", "watch", "normal"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                filter === item
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {item === "All" ? "All tasks" : item}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredTasks.map((task) => {
          const Icon = task.icon;

          return (
            <Card key={task.id}>
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl border p-3 ${priorityStyle[task.priority]}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityStyle[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900">{task.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.text}</p>

                  <button
                    onClick={() => go(task.target)}
                    className="mt-4 rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"
                  >
                    {task.action}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">How MamaCare creates this plan</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The plan is generated from the mother’s pregnancy week, risk level,
              symptoms, vitals, baby movement, wellness, ANC readiness, medication,
              emergency plan, health records, postnatal mode, and support people.
            </p>
          </div>
        </div>
      </Card>
    </Page>
  );
}


function TimelinePage({
  mother,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  go,
}) {
  const [filter, setFilter] = useState("All");

  const timeline = buildMotherTimeline({
    mother,
    symptomHistory,
    vitalsHistory,
    wellnessHistory,
    appointments,
    medications,
    movementHistory,
    emergencyPlan,
    healthRecords,
    postnatalCare,
    supportPeople,
  });

  const categories = ["All", ...Array.from(new Set(timeline.map((item) => item.type)))];

  const filteredTimeline =
    filter === "All" ? timeline : timeline.filter((item) => item.type === filter);

  const urgentCount = timeline.filter((item) => item.level === "urgent").length;
  const watchCount = timeline.filter((item) => item.level === "watch").length;

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Mother journey</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Pregnancy timeline
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            A clear timeline of the mother’s saved pregnancy activity, health logs,
            appointments, support plan, and postnatal updates.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-slate-900">{timeline.length}</p>
            <p className="text-xs font-semibold text-slate-500">Events</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-orange-700">{watchCount}</p>
            <p className="text-xs font-semibold text-orange-700">Watch</p>
          </div>
          <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-red-700">{urgentCount}</p>
            <p className="text-xs font-semibold text-red-700">Urgent</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                filter === category
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {filteredTimeline.length === 0 ? (
          <Card>
            <p className="text-sm leading-6 text-slate-500">
              No timeline events found for this category yet.
            </p>
          </Card>
        ) : (
          filteredTimeline.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.id}>
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-2xl p-3 ${
                      item.level === "urgent"
                        ? "bg-red-50 text-red-600"
                        : item.level === "watch"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {item.type}
                      </span>
                      <RiskPill risk={item.level} />
                    </div>

                    <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{item.date}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => go(item.target)}
                    className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700"
                  >
                    Open
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Page>
  );
}


function PendingSyncPage({ go }) {
  const [summary, setSummary] = useState(() => getPendingSyncSummary());
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  const totalPending = summary.reduce((sum, item) => sum + Number(item.count || 0), 0);

  const refresh = () => {
    setSummary(getPendingSyncSummary());
  };

  const syncNow = async () => {
    try {
      setStatus({ loading: true, message: "", error: "" });

      const results = await syncPendingLocalData();
      const failed = results.filter((item) => !item.ok).length;
      const synced = results.filter((item) => item.ok).length;

      refresh();

      setStatus({
        loading: false,
        message:
          failed === 0
            ? `${synced} pending item(s) synced successfully.`
            : `${synced} item(s) synced. ${failed} item(s) still pending.`,
        error: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (error) {
      setStatus({
        loading: false,
        message: "",
        error: "Sync failed. Check backend connection and try again.",
      });
    }
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Offline queue</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Pending sync
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Records saved while the backend or internet was unavailable stay safely in the browser.
            This page shows what still needs to be pushed to the backend.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Pending items
          </p>
          <p className="mt-2 text-4xl font-extrabold text-slate-900">{totalPending}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Sync status</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              The app always saves locally first. Backend sync can be retried from here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={refresh}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"
            >
              Refresh
            </button>

            <button
              onClick={syncNow}
              disabled={status.loading || totalPending === 0}
              className={`rounded-2xl px-4 py-3 text-sm font-bold text-white ${
                status.loading || totalPending === 0 ? "bg-slate-400" : "bg-blue-900"
              }`}
            >
              {status.loading ? "Syncing..." : "Sync pending now"}
            </button>
          </div>
        </div>

        {status.message && (
          <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {status.message}
          </div>
        )}

        {status.error && (
          <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
            {status.error}
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.key}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.count === 0
                    ? "No pending records"
                    : `${item.count} pending record(s)`}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  item.count === 0
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.count === 0 ? "Synced" : "Pending"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold text-slate-900">How to test offline queue</h3>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <p>1. Stop the backend server.</p>
          <p>2. Save a symptom, appointment, medication, or other record.</p>
          <p>3. The app will keep it locally as pending.</p>
          <p>4. Start the backend again.</p>
          <p>5. Open this page and click Sync pending now.</p>
        </div>

        <button
          onClick={() => go("sync")}
          className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >
          Open sync readiness
        </button>
      </Card>
    </Page>
  );
}


function SyncReadinessPage({
  mother,
  selectedSymptoms,
  customSymptoms,
  symptomHistory,
  vitalsHistory,
  wellnessHistory,
  appointments,
  medications,
  movementHistory,
  emergencyPlan,
  healthRecords,
  postnatalCare,
  supportPeople,
  chatHistory,
  readNotificationIds,
  savedTipIds,
  readTipIds,
  completedANC,
  completedBirth,
  syncSettings,
  setSyncSettings,
  go,
}) {
  const collections = getSyncCollections({
    mother,
    selectedSymptoms,
    customSymptoms,
    symptomHistory,
    vitalsHistory,
    wellnessHistory,
    appointments,
    medications,
    movementHistory,
    emergencyPlan,
    healthRecords,
    postnatalCare,
    supportPeople,
    chatHistory,
    readNotificationIds,
    savedTipIds,
    readTipIds,
    completedANC,
    completedBirth,
  });

  const totalGroups = collections.length;
  const readyGroups = collections.filter((item) => item.status === "Ready").length;
  const totalRecords = collections.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const readinessPercent = Math.round((readyGroups / totalGroups) * 100);

  const updateSyncSetting = (field, value) => {
    setSyncSettings((prev) => ({ ...prev, [field]: value }));
  };

  const simulateSync = async () => {
    const syncTime = new Date().toLocaleString("en-UG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const payload = {
      mother,
      symptomHistory,
      vitalsHistory,
      wellnessHistory,
      appointments,
      medications,
      movementHistory,
      emergencyPlan,
      healthRecords,
      postnatalCare,
      supportPeople,
      chatHistory,
      readNotificationIds,
      savedTipIds,
      readTipIds,
      completedANC,
      completedBirth,
    };

    const sync = await safeBackendSync(() => syncApi.push(payload));

    setSyncSettings((prev) => ({
      ...prev,
      lastSync: syncTime,
      lastSyncStatus: sync.ok ? "Backend sync check successful" : "Backend sync check failed",
    }));
  };

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Sync readiness</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Backend preparation</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            MamaCare is still using localStorage for the prototype. This page prepares the data structure for a future API, database, login accounts, and cloud synchronization without changing the mother-facing experience.
          </p>
        </div>

        <button
          onClick={() => go("backup")}
          className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white"
        >
          Open data backup
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
          <p className="text-sm text-slate-500">Readiness score</p>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{readinessPercent}%</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {readyGroups} of {totalGroups} data groups are ready for mapping.
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Local records tracked</p>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{totalRecords}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Counts include logs, checklists, reminders, saved tips, and setup records.
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Current sync mode</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{syncSettings.syncMode}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Last sync: {syncSettings.lastSync}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-3">
              <Wifi className="h-6 w-6 text-blue-900" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Sync configuration</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                These settings are placeholders for the future backend. They do not send data anywhere yet.
              </p>

              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Device label</span>
                  <input
                    value={syncSettings.deviceLabel}
                    onChange={(e) => updateSyncSetting("deviceLabel", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Example: MamaCare web app"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Future API base URL</span>
                  <input
                    value={syncSettings.apiBaseUrl}
                    onChange={(e) => updateSyncSetting("apiBaseUrl", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Example: https://api.mamacare.health"
                  />
                </label>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Sync mode</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Local only", "Backup ready", "Cloud ready"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSyncSetting("syncMode", mode)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                          syncSettings.syncMode === mode
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-slate-100 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => updateSyncSetting("autoSyncWhenOnline", !syncSettings.autoSyncWhenOnline)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                    syncSettings.autoSyncWhenOnline
                      ? "border-blue-700 bg-blue-50 text-blue-900"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  Auto-sync when online: {syncSettings.autoSyncWhenOnline ? "On" : "Off"}
                </button>

                <button
                  onClick={simulateSync}
                  className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white"
                >
                  Simulate sync check
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3">
              <FileText className="h-6 w-6 text-teal-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Future backend modules</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This is the recommended database/API structure for the next technical phase.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  "Authentication and mother accounts",
                  "Pregnancy profile and gestational tracking",
                  "Symptoms, vitals, movement, and wellness logs",
                  "Appointments, medication reminders, and notifications",
                  "Emergency plan, support people, and clinic visit mode",
                  "Reports, backups, and health records",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <p className="text-sm font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Local data groups</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              These are the localStorage collections that will later map to database tables or API resources.
            </p>
          </div>
          <button
            onClick={() => go("reports")}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Open printable report
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((item) => (
            <div key={item.key} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">Key: {item.key}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                  item.status === "Ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-slate-900">{item.count}</p>
              <p className="text-xs text-slate-500">records/items</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-blue-50">
        <h3 className="font-bold text-slate-900">Important prototype note</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This page prepares the system for backend integration, but it intentionally does not upload any mother’s health information yet. The current prototype remains local-first and safe for classroom demonstration. When the backend is added, authentication, consent, encryption, access control, and health-data privacy rules should be handled before real deployment.
        </p>
      </Card>
    </Page>
  );
}


function BackendContractPage({ go }) {
  const tables = [
    { name: "users", purpose: "Authentication records for mothers and future support accounts", key: "id, role, phone, password_hash" },
    { name: "mother_profiles", purpose: "Main mother profile and pregnancy setup data", key: "user_id, name, phone, week, due_date, location" },
    { name: "symptom_logs", purpose: "Predefined and typed symptom entries with analysis level", key: "mother_id, symptoms, risk_level, notes, logged_at" },
    { name: "vital_logs", purpose: "Blood pressure, temperature, and baby movement status", key: "mother_id, systolic, diastolic, temperature, movement" },
    { name: "wellness_logs", purpose: "Mood, energy, sleep, stress, and emotional wellbeing notes", key: "mother_id, mood, energy, sleep, stress, notes" },
    { name: "appointments", purpose: "ANC appointments, facility, date, time, and notes", key: "mother_id, date, time, facility, notes" },
    { name: "medication_reminders", purpose: "Pregnancy medicine and supplement reminders", key: "mother_id, name, dosage, time, frequency, status" },
    { name: "movement_checks", purpose: "Baby movement counter and movement risk records", key: "mother_id, count, movement_status, analysis" },
    { name: "emergency_plans", purpose: "Facility, transport, support person, and emergency cash plan", key: "mother_id, facility, transport_contact, support_contact" },
    { name: "support_people", purpose: "Trusted family members, transport persons, and village health workers", key: "mother_id, name, relationship, phone, is_primary" },
    { name: "health_records", purpose: "ANC number, blood group, allergies, scan notes, and lab notes", key: "mother_id, anc_number, blood_group, allergies, notes" },
    { name: "postnatal_checks", purpose: "After-birth mother and newborn recovery logs", key: "mother_id, baby_name, bleeding, pain, feeding, newborn_signs" },
  ];

  const endpoints = [
    { method: "POST", path: "/api/auth/register", use: "Create a mother account" },
    { method: "POST", path: "/api/auth/login", use: "Login and return access token" },
    { method: "GET", path: "/api/me", use: "Get logged-in mother profile" },
    { method: "PUT", path: "/api/mother-profile", use: "Update pregnancy profile" },
    { method: "GET", path: "/api/dashboard", use: "Load home dashboard summary" },
    { method: "POST", path: "/api/symptoms", use: "Save symptom log" },
    { method: "POST", path: "/api/vitals", use: "Save vitals and movement status" },
    { method: "POST", path: "/api/wellness", use: "Save wellness check" },
    { method: "POST", path: "/api/appointments", use: "Create ANC appointment" },
    { method: "POST", path: "/api/medications", use: "Create medication reminder" },
    { method: "POST", path: "/api/movement-checks", use: "Save baby movement count" },
    { method: "PUT", path: "/api/emergency-plan", use: "Save emergency and transport plan" },
    { method: "GET", path: "/api/reports/clinic-summary", use: "Generate clinic-ready summary" },
    { method: "POST", path: "/api/sync/push", use: "Upload local changes to server" },
    { method: "GET", path: "/api/sync/pull", use: "Download latest server data" },
  ];

  const phases = [
    "Keep current localStorage prototype working while backend is built.",
    "Create authentication, mother profile, and protected API routes.",
    "Move each localStorage collection into a database table using the mapping below.",
    "Add sync conflict rules so local and cloud records do not overwrite wrongly.",
    "Add consent, encryption, role-based access, audit logs, and data privacy controls before real deployment.",
  ];

  return (
    <Page>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Backend contract</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Database and API structure</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            This screen documents how the current MamaCare frontend should connect to a future backend. It keeps the same mother-focused app while preparing authentication, database tables, API endpoints, and sync rules.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => go("sync")}
            className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-bold text-white"
          >
            Open sync readiness
          </button>
          <button
            onClick={() => go("backup")}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Open data backup
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
          <p className="text-sm text-slate-500">Recommended backend</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Laravel or Node API</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use REST endpoints first. Add realtime sync later only where needed.
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Database choice</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">MySQL / PostgreSQL</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tables should be relational because mother records, logs, and reminders are connected.
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Security priority</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Consent and privacy</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Health data must use authentication, authorization, encryption, and audit logs.
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900">Backend build phases</h3>
        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {phases.map((phase, index) => (
            <div key={phase} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{phase}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Database table contract</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Each table maps to a feature that already exists in the frontend prototype.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
            {tables.length} suggested tables
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100">
          <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="col-span-3">Table</span>
            <span className="col-span-5">Purpose</span>
            <span className="col-span-4">Important fields</span>
          </div>
          {tables.map((table) => (
            <div key={table.name} className="grid grid-cols-12 gap-3 border-t border-slate-100 px-4 py-4 text-sm">
              <span className="col-span-12 font-bold text-slate-900 md:col-span-3">{table.name}</span>
              <span className="col-span-12 leading-6 text-slate-600 md:col-span-5">{table.purpose}</span>
              <span className="col-span-12 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 md:col-span-4">{table.key}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">API endpoint contract</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              These endpoints are the first set the React frontend should connect to when the backend starts.
            </p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
            REST-first design
          </span>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {endpoints.map((endpoint) => (
            <div key={`${endpoint.method}-${endpoint.path}`} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    endpoint.method === "GET"
                      ? "bg-green-100 text-green-700"
                      : endpoint.method === "PUT"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-bold text-slate-900">{endpoint.path}</code>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{endpoint.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="font-bold text-slate-900">Frontend integration rule</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Do not remove localStorage immediately. First create a small data service layer such as <code className="rounded bg-slate-100 px-2 py-1 text-xs">src/services/mamacareApi.js</code>. That service should decide whether to save locally, sync to API, or do both.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            UI page → data service → localStorage now → backend API later
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-blue-50">
          <h3 className="font-bold text-slate-900">Safety note before real deployment</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Because MamaCare stores pregnancy and health information, backend deployment should include consent screens, HTTPS, encrypted passwords, role-based access, audit logs, database backups, and clear emergency disclaimers before using real patient data.
          </p>
        </Card>
      </div>
    </Page>
  );
}


function getModuleHubData(hubId) {
  const hubs = {
    healthHub: {
      eyebrow: "Health tracking",
      title: "Track health",
      subtitle:
        "Log the mother’s daily pregnancy health checks in one place.",
      icon: Activity,
      color: "bg-teal-50 text-teal-700",
      items: [
        {
          id: "log",
          label: "Symptoms",
          subtitle: "Log predefined and custom symptoms",
          icon: Activity,
          color: "bg-red-50 text-red-600",
        },
        {
          id: "vitals",
          label: "Vitals",
          subtitle: "Record blood pressure, temperature, and safety notes",
          icon: Gauge,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "movement",
          label: "Baby movement",
          subtitle: "Count kicks and monitor reduced movement",
          icon: Baby,
          color: "bg-pink-50 text-pink-700",
        },
        {
          id: "wellness",
          label: "Wellness",
          subtitle: "Track mood, sleep, stress, and energy",
          icon: Smile,
          color: "bg-yellow-50 text-yellow-700",
        },
        {
          id: "medications",
          label: "Medication reminders",
          subtitle: "Track supplements and medicine times",
          icon: Pill,
          color: "bg-purple-50 text-purple-700",
        },
      ],
    },
    careHub: {
      eyebrow: "Pregnancy care",
      title: "Appointments & care",
      subtitle:
        "Plan ANC visits, pregnancy preparation, learning, and after-birth care.",
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-900",
      items: [
        {
          id: "anc",
          label: "ANC appointments",
          subtitle: "Book, edit, and prepare for antenatal visits",
          icon: CalendarDays,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "birth",
          label: "Birth preparation",
          subtitle: "Prepare bag, transport, and support steps",
          icon: ClipboardList,
          color: "bg-orange-50 text-orange-700",
        },
        {
          id: "tracker",
          label: "Pregnancy tracker",
          subtitle: "View pregnancy week and baby growth guidance",
          icon: Baby,
          color: "bg-pink-50 text-pink-700",
        },
        {
          id: "tips",
          label: "Daily pregnancy feed",
          subtitle: "Read pregnancy tips and save useful cards",
          icon: Sparkles,
          color: "bg-teal-50 text-teal-700",
        },
        {
          id: "learn",
          label: "Learn",
          subtitle: "Open guides, education, and pregnancy support pages",
          icon: BookOpen,
          color: "bg-indigo-50 text-indigo-700",
        },
        {
          id: "postnatal",
          label: "Postnatal care",
          subtitle: "Track mother recovery and newborn checks",
          icon: Heart,
          color: "bg-rose-50 text-rose-700",
        },
      ],
    },
    safetyHub: {
      eyebrow: "Safety & support",
      title: "Safety center",
      subtitle:
        "Keep emergency actions, risk awareness, and support people together.",
      icon: ShieldAlert,
      color: "bg-red-50 text-red-700",
      items: [
        {
          id: "emergency",
          label: "SOS help",
          subtitle: "Open emergency guidance and contacts quickly",
          icon: Siren,
          color: "bg-red-50 text-red-700",
        },
        {
          id: "risk",
          label: "Risk awareness",
          subtitle: "Review danger signs and watch-level alerts",
          icon: ShieldAlert,
          color: "bg-orange-50 text-orange-700",
        },
        {
          id: "emergencyPlan",
          label: "Emergency plan",
          subtitle: "Facility, transport, cash plan, and support contact",
          icon: MapPinned,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "support",
          label: "Support people",
          subtitle: "Trusted family, partner, transport, or VHT contacts",
          icon: UserRound,
          color: "bg-violet-50 text-violet-700",
        },
      ],
    },
    recordsHub: {
      eyebrow: "Records & clinic",
      title: "Records center",
      subtitle:
        "Keep clinic-ready summaries, records, reports, and journey history together.",
      icon: FileText,
      color: "bg-slate-100 text-slate-700",
      items: [
        {
          id: "records",
          label: "Health records",
          subtitle: "ANC number, blood group, allergies, tests, and notes",
          icon: FileText,
          color: "bg-slate-100 text-slate-700",
        },
        {
          id: "clinicVisit",
          label: "Clinic visit mode",
          subtitle: "Focused screen for hospital or ANC visits",
          icon: ClipboardList,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "reports",
          label: "Reports",
          subtitle: "Printable pregnancy and clinic summaries",
          icon: FileText,
          color: "bg-teal-50 text-teal-700",
        },
        {
          id: "timeline",
          label: "Journey timeline",
          subtitle: "All saved pregnancy activity in order",
          icon: Timeline,
          color: "bg-purple-50 text-purple-700",
        },
        {
          id: "insights",
          label: "Progress insights",
          subtitle: "Pregnancy progress, readiness, and trends",
          icon: HeartPulse,
          color: "bg-pink-50 text-pink-700",
        },
      ],
    },
    systemHub: {
      eyebrow: "System & account",
      title: "System center",
      subtitle:
        "Manage app settings, data, sync, account security, and backend tools.",
      icon: Settings,
      color: "bg-slate-100 text-slate-700",
      items: [
        {
          id: "notifications",
          label: "Notifications",
          subtitle: "View reminders and safety alerts",
          icon: Bell,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "settings",
          label: "Settings",
          subtitle: "Appearance, language, accessibility, and preferences",
          icon: Settings,
          color: "bg-slate-100 text-slate-700",
        },
        {
          id: "security",
          label: "Account security",
          subtitle: "Change password and manage session safety",
          icon: Lock,
          color: "bg-red-50 text-red-700",
        },
        {
          id: "backup",
          label: "Data backup",
          subtitle: "Export, copy, import, or reset prototype data",
          icon: FileText,
          color: "bg-teal-50 text-teal-700",
        },
        {
          id: "offline",
          label: "Offline mode",
          subtitle: "Check online/offline status and local records",
          icon: WifiOff,
          color: "bg-orange-50 text-orange-700",
        },
        {
          id: "pending-sync",
          label: "Pending sync",
          subtitle: "Retry records that were saved while offline",
          icon: RefreshCw,
          color: "bg-yellow-50 text-yellow-700",
        },
        {
          id: "sync",
          label: "Sync readiness",
          subtitle: "Backend mapping and sync preparation dashboard",
          icon: Wifi,
          color: "bg-blue-50 text-blue-700",
        },
        {
          id: "backend",
          label: "Backend contract",
          subtitle: "Developer API and database planning screen",
          icon: FileText,
          color: "bg-slate-100 text-slate-700",
        },
        {
          id: "profile",
          label: "Profile",
          subtitle: "Mother account and pregnancy details",
          icon: UserRound,
          color: "bg-indigo-50 text-indigo-700",
        },
      ],
    },
  };

  return hubs[hubId];
}

function ModuleHubPage({ hubId, go }) {
  const hub = getModuleHubData(hubId);

  if (!hub) {
    return (
      <Page>
        <Card>
          <p className="text-sm text-slate-500">This section is not available.</p>
        </Card>
      </Page>
    );
  }

  const Icon = hub.icon;

  return (
    <Page>
      <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className={`rounded-3xl p-4 ${hub.color}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700">{hub.eyebrow}</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                {hub.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {hub.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hub.items.map((item) => {
          const ItemIcon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-2xl p-3 ${item.color}`}>
                <ItemIcon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.subtitle}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-900">
                Open <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          );
        })}
      </div>
    </Page>
  );
}

function getNavigationGroups() {
  return [
    {
      title: "Main",
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "carePlan", label: "Care plan", icon: ListTodo },
        { id: "timeline", label: "Journey timeline", icon: Timeline },
        { id: "notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "Workspaces",
      items: [
        { id: "healthHub", label: "Track health", icon: Activity },
        { id: "careHub", label: "Appointments & care", icon: CalendarDays },
        { id: "safetyHub", label: "Safety center", icon: ShieldAlert },
        { id: "recordsHub", label: "Records center", icon: FileText },
      ],
    },
    {
      title: "System",
      items: [
        { id: "systemHub", label: "System center", icon: Settings },
        { id: "profile", label: "Profile", icon: UserRound },
      ],
    },
  ];
}

function BottomNav({ active, setActive }) {
  const [showMore, setShowMore] = useState(false);

  const primaryItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "healthHub", label: "Track", icon: Activity },
    { id: "careHub", label: "Care", icon: CalendarDays },
    { id: "emergency", label: "SOS", icon: Siren },
  ];

  const moreGroups = getNavigationGroups();

  const handleNav = (id) => {
    setActive(id);
    setShowMore(false);
  };

  return (
    <>
      {showMore && (
        <div className="mc-mobile-more fixed inset-x-3 bottom-24 z-50 max-h-[70vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl backdrop-blur lg:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-slate-900">MamaCare menu</p>
              <p className="text-xs text-slate-500">Grouped workspaces keep the mobile menu clean.</p>
            </div>
            <button
              onClick={() => setShowMore(false)}
              className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"
            >
              Close
            </button>
          </div>

          <div className="max-h-[58vh] space-y-4 overflow-y-auto p-4">
            {moreGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {group.title}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const selected = active === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                          selected
                            ? "border-blue-900 bg-blue-900 text-white"
                            : "border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="min-w-0 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mc-bottom-nav fixed bottom-4 left-1/2 z-50 w-[94%] max-w-md -translate-x-1/2 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`mc-bottom-tab flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-semibold transition ${
                  selected ? "mc-bottom-tab-active bg-blue-900 text-white" : "mc-bottom-tab-idle text-slate-500"
                }`}
              >
                <Icon className="mb-1 h-5 w-5" />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => setShowMore((prev) => !prev)}
            className={`mc-bottom-tab flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-semibold transition ${
              showMore ? "mc-bottom-tab-active bg-blue-900 text-white" : "mc-bottom-tab-idle text-slate-500"
            }`}
          >
            <Plus className={`mb-1 h-5 w-5 transition-transform ${showMore ? "rotate-45" : ""}`} />
            More
          </button>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar({
  active,
  setActive,
  mother,
  onLogout,
  isCollapsed,
  setIsCollapsed,
}) {
  const navGroups = getNavigationGroups();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white shadow-sm transition-all duration-300 lg:flex lg:flex-col ${
        isCollapsed ? "w-20 px-2 py-4" : "w-72 px-3 py-5"
      }`}
    >
      <div
        className={`flex ${
          isCollapsed
            ? "flex-col items-center justify-center gap-3"
            : "items-center justify-between gap-2 px-1"
        }`}
      >
        <button
          onClick={() => setActive("home")}
          className={`flex min-w-0 items-center rounded-2xl text-left ${
            isCollapsed ? "justify-center" : "flex-1 gap-3"
          }`}
          title="MamaCare Home"
        >
          <div className="rounded-2xl bg-blue-900 p-3 text-white">
            <Baby className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-xl font-extrabold text-slate-900">
                MamaCare
              </p>
              <p className="truncate text-xs font-medium text-slate-500">
                Mother-first dashboard
              </p>
            </div>
          )}
        </button>

        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100"
          title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <ChevronRight
            className={`h-5 w-5 transition-transform ${
              isCollapsed ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>

      <div
        className={`mt-5 rounded-3xl bg-slate-50 ${
          isCollapsed ? "flex justify-center p-2" : "p-3"
        }`}
      >
        {!isCollapsed && (
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Signed in as
          </p>
        )}
        <button
          onClick={() => setActive("profile")}
          className={`flex w-full items-center rounded-2xl bg-white p-3 text-left shadow-sm ${
            isCollapsed ? "mt-0 justify-center" : "mt-2 gap-3"
          }`}
          title={mother.name}
        >
          <div className="rounded-2xl bg-blue-50 p-2">
            <UserRound className="h-5 w-5 text-blue-900" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {mother.name}
              </p>
              <p className="text-xs text-slate-500">View profile</p>
            </div>
          )}
        </button>
      </div>

      <nav
        className={`mt-5 flex-1 overflow-y-auto overflow-x-hidden ${
          isCollapsed ? "space-y-3 pr-0" : "space-y-5 pr-1"
        }`}
      >
        {navGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {group.title}
              </p>
            )}
            {isCollapsed && <div className="mx-auto mb-2 h-px w-10 bg-slate-100" />}
            <div className={isCollapsed ? "flex flex-col items-center gap-1" : "space-y-1"}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const selected = active === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    title={item.label}
                    className={`flex items-center rounded-2xl text-sm font-semibold transition ${
                      isCollapsed
                        ? "h-11 w-11 justify-center p-0"
                        : "w-full gap-3 px-3 py-3 text-left"
                    } ${
                      selected
                        ? "bg-blue-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={onLogout}
        title="Logout"
        className={`mt-4 flex rounded-2xl bg-red-50 text-sm font-bold text-red-600 hover:bg-red-100 ${
          isCollapsed
            ? "h-11 w-11 items-center justify-center self-center p-0"
            : "w-full items-center justify-between px-4 py-3"
        }`}
      >
        {!isCollapsed && <span>Logout</span>}
        <LogOut className="h-4 w-4" />
      </button>
    </aside>
  );
}


function openGlobalMamaCareSearch() {
  window.dispatchEvent(new CustomEvent("mamacare:open-search"));
}

const featureSearchItems = [
  { id: "home", title: "Home", group: "Dashboard", keywords: "dashboard overview today mother" },
  { id: "trackHealth", title: "Track health", group: "Workspace", keywords: "symptoms vitals movement wellness medication health" },
  { id: "log", title: "Symptoms", group: "Track health", keywords: "symptom headache bleeding pain swelling nausea danger signs" },
  { id: "vitals", title: "Vitals", group: "Track health", keywords: "blood pressure temperature bp movement vitals" },
  { id: "movement", title: "Baby movement", group: "Track health", keywords: "kick kicks baby movement count reduced no movement" },
  { id: "wellness", title: "Wellness", group: "Track health", keywords: "mood sleep stress energy mental wellbeing" },
  { id: "medications", title: "Medication reminders", group: "Track health", keywords: "medicine medication iron folic acid supplements reminder" },
  { id: "appointmentsCare", title: "Appointments & care", group: "Workspace", keywords: "anc appointment birth pregnancy tracker learn daily feed postnatal" },
  { id: "anc", title: "ANC appointments", group: "Appointments & care", keywords: "antenatal clinic visit appointment checklist" },
  { id: "ancQuestions", title: "ANC questions builder", group: "Appointments & care", keywords: "clinic questions doctor midwife antenatal prepare ask" },
  { id: "birth", title: "Birth preparation", group: "Appointments & care", keywords: "birth hospital bag delivery checklist transport" },
  { id: "tracker", title: "Pregnancy tracker", group: "Appointments & care", keywords: "week baby size pregnancy progress trimester" },
  { id: "feed", title: "Daily pregnancy feed", group: "Appointments & care", keywords: "tips nutrition danger signs wellness article feed" },
  { id: "learn", title: "Learn", group: "Appointments & care", keywords: "education tips guide pregnancy learning" },
  { id: "postnatal", title: "Postnatal care", group: "Appointments & care", keywords: "after birth baby mother bleeding feeding checkup newborn" },
  { id: "safetyCenter", title: "Safety center", group: "Workspace", keywords: "emergency sos risk support plan safety" },
  { id: "emergency", title: "SOS help", group: "Safety center", keywords: "sos emergency urgent danger help call" },
  { id: "risk", title: "Risk awareness", group: "Safety center", keywords: "risk warning urgent watch danger signs" },
  { id: "emergencyPlan", title: "Emergency plan", group: "Safety center", keywords: "facility transport contact support cash blood group" },
  { id: "support", title: "Support people", group: "Safety center", keywords: "family partner mother sister transport village health worker" },
  { id: "recordsCenter", title: "Records center", group: "Workspace", keywords: "records reports clinic timeline progress" },
  { id: "records", title: "Health records", group: "Records center", keywords: "anc number blood group allergies conditions lab scan injections supplements" },
  { id: "digitalCards", title: "Digital cards", group: "Records center", keywords: "anc card hospital results emergency card postnatal card print" },
  { id: "clinic", title: "Clinic visit mode", group: "Records center", keywords: "hospital clinic visit summary health worker" },
  { id: "reports", title: "Reports", group: "Records center", keywords: "printable summary download copy clinic report" },
  { id: "timeline", title: "Journey timeline", group: "Records center", keywords: "timeline history pregnancy journey events" },
  { id: "insights", title: "Progress insights", group: "Records center", keywords: "dashboard progress insights readiness stats" },
  { id: "carePlan", title: "Smart care plan", group: "Records center", keywords: "todo task care plan next steps personalized" },
  { id: "systemCenter", title: "System center", group: "Workspace", keywords: "settings backup sync notifications profile account" },
  { id: "notifications", title: "Notifications", group: "System center", keywords: "reminders alerts unread bell notification" },
  { id: "settings", title: "Settings", group: "System center", keywords: "appearance dark light font language accessibility" },
  { id: "security", title: "Account security", group: "System center", keywords: "password change logout session account" },
  { id: "backup", title: "Data backup", group: "System center", keywords: "export import backup json reset" },
  { id: "offline", title: "Offline mode", group: "System center", keywords: "connection offline online local data" },
  { id: "pending-sync", title: "Pending sync", group: "System center", keywords: "sync queue pending retry backend" },
  { id: "sync", title: "Sync readiness", group: "System center", keywords: "backend sync readiness api cloud device" },
  { id: "backend", title: "Backend contract", group: "System center", keywords: "api database tables developer backend" },
  { id: "profile", title: "Profile", group: "System center", keywords: "mother profile phone due date location" },
];

function QuickOpen({ isOpen, onClose, go }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();
  const results = featureSearchItems
    .filter((item) => {
      if (!cleanQuery) return true;
      return `${item.title} ${item.group} ${item.keywords}`.toLowerCase().includes(cleanQuery);
    })
    .slice(0, 12);

  const openFeature = (id) => {
    go(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search MamaCare features..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
            />
            <button onClick={onClose} className="rounded-xl bg-white px-3 py-1 text-xs font-bold text-slate-500">
              Esc
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3">
          {results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-bold text-slate-900">No feature found</p>
              <p className="mt-1 text-sm text-slate-500">Try symptoms, ANC, emergency, records, backup, or settings.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openFeature(item.id)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{item.group}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">Open</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          Tip: press Ctrl + K to open search quickly on desktop.
        </div>
      </div>
    </div>
  );
}

function MainApp({ mother, setMother, resetApp, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("mamacare_sidebar_collapsed") === "true";
  });

  const [active, setActive] = useState(() => {
    return localStorage.getItem("mamacare_active_tab") || "home";
  });

  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setQuickOpen(true);
    window.addEventListener("mamacare:open-search", handleOpenSearch);
    return () => window.removeEventListener("mamacare:open-search", handleOpenSearch);
  }, []);

  useEffect(() => {
    const handleQuickOpen = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuickOpen(true);
      }
    };

    window.addEventListener("keydown", handleQuickOpen);
    return () => window.removeEventListener("keydown", handleQuickOpen);
  }, []);

  const [selectedSymptoms, setSelectedSymptoms] = useState(() => {
    const savedSymptoms = localStorage.getItem("mamacare_symptoms");
    return savedSymptoms ? JSON.parse(savedSymptoms) : [];
  });

  const [customSymptoms, setCustomSymptoms] = useState(() => {
    const savedCustomSymptoms = localStorage.getItem("mamacare_custom_symptoms");
    return savedCustomSymptoms ? JSON.parse(savedCustomSymptoms) : [];
  });

  const [symptomHistory, setSymptomHistory] = useState(() => {
    const savedHistory = localStorage.getItem("mamacare_symptom_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [vitalsHistory, setVitalsHistory] = useState(() => {
    const savedVitals = localStorage.getItem("mamacare_vitals_history");
    return savedVitals ? JSON.parse(savedVitals) : [];
  });

  const [wellnessHistory, setWellnessHistory] = useState(() => {
    const savedWellness = localStorage.getItem("mamacare_wellness_history");
    return savedWellness ? JSON.parse(savedWellness) : [];
  });

  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem("mamacare_appointments");
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  const [medications, setMedications] = useState(() => {
    const savedMedications = localStorage.getItem("mamacare_medications");
    return savedMedications ? JSON.parse(savedMedications) : [];
  });

  const [movementHistory, setMovementHistory] = useState(() => {
    const savedMovement = localStorage.getItem("mamacare_movement_history");
    return savedMovement ? JSON.parse(savedMovement) : [];
  });

  const [emergencyPlan, setEmergencyPlan] = useState(() => {
    const savedEmergencyPlan = localStorage.getItem("mamacare_emergency_plan");
    return savedEmergencyPlan ? JSON.parse(savedEmergencyPlan) : defaultEmergencyPlan;
  });

  const [healthRecords, setHealthRecords] = useState(() => {
    const savedHealthRecords = localStorage.getItem("mamacare_health_records");
    return savedHealthRecords ? JSON.parse(savedHealthRecords) : defaultHealthRecords;
  });


  const [postnatalCare, setPostnatalCare] = useState(() => {
    const savedPostnatalCare = localStorage.getItem("mamacare_postnatal_care");
    return savedPostnatalCare ? JSON.parse(savedPostnatalCare) : defaultPostnatalCare;
  });

  const [supportPeople, setSupportPeople] = useState(() => {
    const savedSupportPeople = localStorage.getItem("mamacare_support_people");
    return savedSupportPeople ? JSON.parse(savedSupportPeople) : defaultSupportPeople;
  });


  const [chatHistory, setChatHistory] = useState(() => {
    const savedChatHistory = localStorage.getItem("mamacare_chat_history");
    return savedChatHistory ? JSON.parse(savedChatHistory) : [];
  });

  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    const savedNotifications = localStorage.getItem("mamacare_read_notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState(() => {
    const savedSettings = localStorage.getItem("mamacare_accessibility_settings");
    return savedSettings
      ? { ...defaultAccessibilitySettings, ...JSON.parse(savedSettings) }
      : defaultAccessibilitySettings;
  });

  const [syncSettings, setSyncSettings] = useState(() => {
    const savedSyncSettings = localStorage.getItem("mamacare_sync_settings");
    return savedSyncSettings
      ? { ...defaultSyncSettings, ...JSON.parse(savedSyncSettings) }
      : defaultSyncSettings;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [savedTipIds, setSavedTipIds] = useState(() => {
    const savedTips = localStorage.getItem("mamacare_saved_tips");
    return savedTips ? JSON.parse(savedTips) : [];
  });

  const [readTipIds, setReadTipIds] = useState(() => {
    const readTips = localStorage.getItem("mamacare_read_tips");
    return readTips ? JSON.parse(readTips) : [];
  });

  const [completedANC, setCompletedANC] = useState(() => {
    const savedANC = localStorage.getItem("mamacare_anc_checklist");
    return savedANC ? JSON.parse(savedANC) : [];
  });

  const [completedBirth, setCompletedBirth] = useState(() => {
    const savedBirth = localStorage.getItem("mamacare_birth_checklist");
    return savedBirth ? JSON.parse(savedBirth) : [];
  });

  useEffect(() => {
    localStorage.setItem("mamacare_sidebar_collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("mamacare_active_tab", active);
  }, [active]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_symptoms",
      JSON.stringify(selectedSymptoms)
    );
  }, [selectedSymptoms]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_custom_symptoms",
      JSON.stringify(customSymptoms)
    );
  }, [customSymptoms]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_symptom_history",
      JSON.stringify(symptomHistory)
    );
  }, [symptomHistory]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_vitals_history",
      JSON.stringify(vitalsHistory)
    );
  }, [vitalsHistory]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_wellness_history",
      JSON.stringify(wellnessHistory)
    );
  }, [wellnessHistory]);

  useEffect(() => {
    localStorage.setItem("mamacare_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("mamacare_medications", JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_movement_history",
      JSON.stringify(movementHistory)
    );
  }, [movementHistory]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_emergency_plan",
      JSON.stringify(emergencyPlan)
    );
  }, [emergencyPlan]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_health_records",
      JSON.stringify(healthRecords)
    );
  }, [healthRecords]);


  useEffect(() => {
    localStorage.setItem(
      "mamacare_postnatal_care",
      JSON.stringify(postnatalCare)
    );
  }, [postnatalCare]);

  useEffect(() => {
    localStorage.setItem("mamacare_support_people", JSON.stringify(supportPeople));
  }, [supportPeople]);


  useEffect(() => {
    localStorage.setItem("mamacare_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_read_notifications",
      JSON.stringify(readNotificationIds)
    );
  }, [readNotificationIds]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_accessibility_settings",
      JSON.stringify(accessibilitySettings)
    );
  }, [accessibilitySettings]);

  useEffect(() => {
    localStorage.setItem("mamacare_sync_settings", JSON.stringify(syncSettings));
  }, [syncSettings]);

  useEffect(() => {
    const handle = window.requestAnimationFrame(() => {
      applyLanguageToDocument(accessibilitySettings.language || "English");
    });
    return () => window.cancelAnimationFrame(handle);
  }, [accessibilitySettings.language, active, sidebarCollapsed]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setSystemPrefersDark(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("mamacare_saved_tips", JSON.stringify(savedTipIds));
  }, [savedTipIds]);

  useEffect(() => {
    localStorage.setItem("mamacare_read_tips", JSON.stringify(readTipIds));
  }, [readTipIds]);

  useEffect(() => {
    localStorage.setItem("mamacare_anc_checklist", JSON.stringify(completedANC));
  }, [completedANC]);

  useEffect(() => {
    localStorage.setItem(
      "mamacare_birth_checklist",
      JSON.stringify(completedBirth)
    );
  }, [completedBirth]);

  const risk = useMemo(() => {
    return getCombinedRisk(
      selectedSymptoms,
      customSymptoms.map((item) => item.text),
      vitalsHistory[0],
      wellnessHistory[0],
      movementHistory[0]
    );
  }, [
    selectedSymptoms,
    customSymptoms,
    vitalsHistory,
    wellnessHistory,
    movementHistory,
  ]);

  const notificationItems = useMemo(() => {
    return buildNotificationItems({
      mother,
      risk,
      appointments,
      medications,
      movementHistory,
      wellnessHistory,
      emergencyPlan,
      healthRecords,
      completedANC,
      completedBirth,
    });
  }, [
    mother,
    risk,
    appointments,
    medications,
    movementHistory,
    wellnessHistory,
    emergencyPlan,
    healthRecords,
    completedANC,
    completedBirth,
  ]);

  const unreadNotificationCount = notificationItems.filter(
    (item) => !readNotificationIds.includes(item.id)
  ).length;

  const fontSizeValue =
    typeof accessibilitySettings.textSize === "number"
      ? accessibilitySettings.textSize
      : accessibilitySettings.textSize === "Large"
      ? 18
      : accessibilitySettings.textSize === "Small"
      ? 14
      : 16;

  const isDarkMode =
    accessibilitySettings.appearance === "Dark" ||
    (accessibilitySettings.appearance === "System default" && systemPrefersDark);

  const appearanceClass = isDarkMode
    ? "mamacare-dark bg-slate-950 text-slate-100"
    : "mamacare-light bg-slate-50 text-slate-900";

  const accessibilityClass = [
    "mamacare-app",
    appearanceClass,
    accessibilitySettings.contrastMode ? "contrast-125" : "",
    accessibilitySettings.simplifiedMode ? "[&_.shadow-xl]:shadow-sm [&_.shadow-lg]:shadow-sm [&_.shadow-sm]:shadow-none" : "",
  ].join(" ");

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${accessibilityClass}`}
      style={{
        color: isDarkMode ? "#F8FAFC" : COLORS.text,
        fontSize: `${fontSizeValue}px`,
        "--mc-font-size": `${fontSizeValue}px`,
        "--mc-font-size-xs": `${Math.max(10, fontSizeValue - 4)}px`,
        "--mc-font-size-sm": `${Math.max(12, fontSizeValue - 2)}px`,
      }}
    >
      <style>{`
        .mamacare-app .text-xs { font-size: var(--mc-font-size-xs) !important; }
        .mamacare-app .text-sm { font-size: var(--mc-font-size-sm) !important; }
        .mamacare-app .text-base { font-size: var(--mc-font-size) !important; }
        .mamacare-app input,
        .mamacare-app textarea,
        .mamacare-app select,
        .mamacare-app button { font-size: var(--mc-font-size-sm); }

        .mamacare-dark { background-color: #020617 !important; color: #f8fafc !important; }
        .mamacare-dark .bg-white { background-color: #0f172a !important; }
        .mamacare-dark .bg-slate-50 { background-color: #020617 !important; }
        .mamacare-dark .bg-slate-100 { background-color: #1e293b !important; }
        .mamacare-dark .bg-slate-200 { background-color: #334155 !important; }
        .mamacare-dark .border-slate-100 { border-color: #1e293b !important; }
        .mamacare-dark .border-slate-200 { border-color: #334155 !important; }
        .mamacare-dark .text-slate-950,
        .mamacare-dark .text-slate-900,
        .mamacare-dark .text-slate-800 { color: #f8fafc !important; }
        .mamacare-dark .text-slate-700 { color: #e2e8f0 !important; }
        .mamacare-dark .text-slate-600 { color: #cbd5e1 !important; }
        .mamacare-dark .text-slate-500 { color: #94a3b8 !important; }
        .mamacare-dark .text-slate-400 { color: #94a3b8 !important; }
        .mamacare-dark input,
        .mamacare-dark textarea { color: #f8fafc !important; }
        .mamacare-dark input::placeholder,
        .mamacare-dark textarea::placeholder { color: #94a3b8 !important; }
        .mamacare-dark .bg-blue-50 { background-color: rgba(30, 58, 138, 0.22) !important; }
        .mamacare-dark .bg-sky-50 { background-color: rgba(14, 165, 233, 0.18) !important; }
        .mamacare-dark .bg-teal-50 { background-color: rgba(20, 184, 166, 0.18) !important; }
        .mamacare-dark .bg-green-50 { background-color: rgba(34, 197, 94, 0.16) !important; }
        .mamacare-dark .bg-orange-50 { background-color: rgba(245, 158, 11, 0.16) !important; }
        .mamacare-dark .bg-red-50 { background-color: rgba(239, 68, 68, 0.16) !important; }
        .mamacare-dark .bg-indigo-50 { background-color: rgba(99, 102, 241, 0.18) !important; }
        .mamacare-dark .bg-gradient-to-br,
        .mamacare-dark .bg-gradient-to-r,
        .mamacare-dark .bg-gradient-to-l { background-image: linear-gradient(135deg, #0f172a, #1e293b) !important; }
        .mamacare-dark .text-blue-900,
        .mamacare-dark .text-blue-800,
        .mamacare-dark .text-blue-700 { color: #93c5fd !important; }
        .mamacare-dark .text-teal-700,
        .mamacare-dark .text-teal-600 { color: #5eead4 !important; }
        .mamacare-dark .text-green-700 { color: #86efac !important; }
        .mamacare-dark .text-orange-700,
        .mamacare-dark .text-orange-600 { color: #fdba74 !important; }
        .mamacare-dark .text-red-700,
        .mamacare-dark .text-red-600 { color: #fca5a5 !important; }
        .mamacare-dark .shadow-sm,
        .mamacare-dark .shadow-lg,
        .mamacare-dark .shadow-xl { box-shadow: 0 18px 45px rgba(0,0,0,0.28) !important; }

        .mamacare-dark .mc-bottom-nav {
          background: rgba(15, 23, 42, 0.96) !important;
          border-color: #334155 !important;
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.45) !important;
        }
        .mamacare-dark .mc-bottom-tab-idle {
          color: #cbd5e1 !important;
        }
        .mamacare-dark .mc-bottom-tab-idle:hover {
          background: rgba(51, 65, 85, 0.7) !important;
          color: #f8fafc !important;
        }
        .mamacare-dark .mc-bottom-tab-active {
          background: linear-gradient(135deg, #38bdf8, #14b8a6) !important;
          color: #020617 !important;
        }
        .mamacare-dark .mc-bottom-tab-active svg {
          color: #020617 !important;
        }
        .mamacare-dark .mc-mobile-more {
          background: rgba(15, 23, 42, 0.98) !important;
          border-color: #334155 !important;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
      <DesktopSidebar
        active={active}
        setActive={setActive}
        mother={mother}
        onLogout={onLogout}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div
        className={`min-h-screen w-full px-4 pb-28 pt-6 transition-all duration-300 sm:px-6 lg:pb-8 lg:pt-8 ${
          sidebarCollapsed
            ? "lg:ml-20 lg:w-[calc(100%-5rem)] lg:px-6"
            : "lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8"
        }`}
      >
        {active === "home" && (
          <HomePage
            risk={risk}
            selectedSymptoms={selectedSymptoms}
            customSymptoms={customSymptoms}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            appointments={appointments}
            medications={medications}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            go={setActive}
            mother={mother}
            onLogout={onLogout}
            unreadNotificationCount={unreadNotificationCount}
            setQuickOpen={setQuickOpen}
          />
        )}

        {active === "notifications" && (
          <NotificationsPage
            mother={mother}
            risk={risk}
            appointments={appointments}
            medications={medications}
            movementHistory={movementHistory}
            wellnessHistory={wellnessHistory}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            completedANC={completedANC}
            completedBirth={completedBirth}
            readNotificationIds={readNotificationIds}
            setReadNotificationIds={setReadNotificationIds}
            go={setActive}
          />
        )}

        {active === "insights" && (
          <InsightsDashboardPage
            mother={mother}
            risk={risk}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            appointments={appointments}
            medications={medications}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            completedANC={completedANC}
            completedBirth={completedBirth}
            go={setActive}
          />
        )}

        {active === "healthHub" && <ModuleHubPage hubId="healthHub" go={setActive} />}

        {active === "careHub" && <ModuleHubPage hubId="careHub" go={setActive} />}

        {active === "safetyHub" && <ModuleHubPage hubId="safetyHub" go={setActive} />}

        {active === "recordsHub" && <ModuleHubPage hubId="recordsHub" go={setActive} />}

        {active === "systemHub" && <ModuleHubPage hubId="systemHub" go={setActive} />}

        {active === "digitalCards" && (
          <DigitalCardsPage
            mother={mother}
            risk={risk}
            appointments={appointments}
            medications={medications}
            healthRecords={healthRecords}
            emergencyPlan={emergencyPlan}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            movementHistory={movementHistory}
            go={setActive}
          />
        )}

        {active === "ancQuestions" && (
          <ANCQuestionsPage
            mother={mother}
            risk={risk}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            medications={medications}
            healthRecords={healthRecords}
            emergencyPlan={emergencyPlan}
            go={setActive}
          />
        )}

        {active === "carePlan" && (
          <CarePlanPage
            mother={mother}
            risk={risk}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            appointments={appointments}
            medications={medications}
            movementHistory={movementHistory}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            completedANC={completedANC}
            completedBirth={completedBirth}
            go={setActive}
          />
        )}

        {active === "timeline" && (
          <TimelinePage
            mother={mother}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            appointments={appointments}
            medications={medications}
            movementHistory={movementHistory}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            go={setActive}
          />
        )}

        {active === "tracker" && (
          <TrackerPage mother={mother} go={setActive} />
        )}

        {active === "log" && (
          <LogPage
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
            customSymptoms={customSymptoms}
            setCustomSymptoms={setCustomSymptoms}
            risk={risk}
            symptomHistory={symptomHistory}
            setSymptomHistory={setSymptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            mother={mother}
            go={setActive}
          />
        )}

        {active === "vitals" && (
          <VitalsPage
            vitalsHistory={vitalsHistory}
            setVitalsHistory={setVitalsHistory}
            mother={mother}
            go={setActive}
          />
        )}

        {active === "movement" && (
          <MovementPage
            movementHistory={movementHistory}
            setMovementHistory={setMovementHistory}
            go={setActive}
          />
        )}

        {active === "wellness" && (
          <WellnessPage
            wellnessHistory={wellnessHistory}
            setWellnessHistory={setWellnessHistory}
            go={setActive}
          />
        )}

        {active === "medications" && (
          <MedicationPage
            medications={medications}
            setMedications={setMedications}
            go={setActive}
          />
        )}

        {active === "risk" && (
          <RiskAwarenessPage
            risk={risk}
            selectedSymptoms={selectedSymptoms}
            customSymptoms={customSymptoms}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            mother={mother}
            go={setActive}
          />
        )}


        {active === "tips" && (
          <DailyTipsPage
            mother={mother}
            savedTipIds={savedTipIds}
            setSavedTipIds={setSavedTipIds}
            readTipIds={readTipIds}
            setReadTipIds={setReadTipIds}
            go={setActive}
          />
        )}

        {active === "learn" && <LearnPage go={setActive} />}

        {active === "emergency" && (
          <EmergencyPage
            mother={mother}
            go={setActive}
            emergencyPlan={emergencyPlan}
            supportPeople={supportPeople}
          />
        )}

        {active === "emergencyPlan" && (
          <EmergencyPlanPage
            emergencyPlan={emergencyPlan}
            setEmergencyPlan={setEmergencyPlan}
            mother={mother}
            go={setActive}
          />
        )}

        {active === "anc" && (
          <ANCPage
            mother={mother}
            completedANC={completedANC}
            setCompletedANC={setCompletedANC}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        )}

        {active === "birth" && (
          <BirthPrepPage
            mother={mother}
            completedBirth={completedBirth}
            setCompletedBirth={setCompletedBirth}
          />
        )}

        {active === "support" && (
          <SupportPeoplePage
            supportPeople={supportPeople}
            setSupportPeople={setSupportPeople}
            go={setActive}
          />
        )}

        {active === "records" && (
          <HealthRecordsPage
            healthRecords={healthRecords}
            setHealthRecords={setHealthRecords}
            mother={mother}
            go={setActive}
          />
        )}

        {active === "postnatal" && (
          <PostnatalCarePage
            postnatalCare={postnatalCare}
            setPostnatalCare={setPostnatalCare}
            mother={mother}
            go={setActive}
          />
        )}


        {active === "reports" && (
          <ReportsPage
            mother={mother}
            risk={risk}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            appointments={appointments}
            medications={medications}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            completedANC={completedANC}
            completedBirth={completedBirth}
            go={setActive}
          />
        )}

        {active === "clinicVisit" && (
          <ClinicVisitModePage
            mother={mother}
            risk={risk}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            movementHistory={movementHistory}
            appointments={appointments}
            medications={medications}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            completedANC={completedANC}
            completedBirth={completedBirth}
            go={setActive}
          />
        )}

        {active === "offline" && (
          <OfflineModePage go={setActive} />
        )}

        {active === "security" && (
          <AccountSecurityPage go={setActive} onLogout={onLogout} />
        )}

        {active === "pending-sync" && <PendingSyncPage go={setActive} />}

        {active === "sync" && (
          <SyncReadinessPage
            mother={mother}
            selectedSymptoms={selectedSymptoms}
            customSymptoms={customSymptoms}
            symptomHistory={symptomHistory}
            vitalsHistory={vitalsHistory}
            wellnessHistory={wellnessHistory}
            appointments={appointments}
            medications={medications}
            movementHistory={movementHistory}
            emergencyPlan={emergencyPlan}
            healthRecords={healthRecords}
            postnatalCare={postnatalCare}
            supportPeople={supportPeople}
            chatHistory={chatHistory}
            readNotificationIds={readNotificationIds}
            savedTipIds={savedTipIds}
            readTipIds={readTipIds}
            completedANC={completedANC}
            completedBirth={completedBirth}
            syncSettings={syncSettings}
            setSyncSettings={setSyncSettings}
            go={setActive}
          />
        )}

        {active === "backend" && (
          <BackendContractPage go={setActive} />
        )}

        {active === "backup" && (
          <DataBackupPage resetApp={resetApp} />
        )}

        {active === "settings" && (
          <SettingsPage
            accessibilitySettings={accessibilitySettings}
            setAccessibilitySettings={setAccessibilitySettings}
            go={setActive}
          />
        )}

        {active === "profile" && (
          <ProfilePage
            mother={mother}
            setMother={setMother}
            resetApp={resetApp}
          />
        )}
      </div>

      <QuickOpen
          isOpen={quickOpen}
          onClose={() => setQuickOpen(false)}
          go={setActive}
        />

        <FloatingMamaCareChat
        mother={mother}
        risk={risk}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        vitalsHistory={vitalsHistory}
        wellnessHistory={wellnessHistory}
        movementHistory={movementHistory}
        symptomHistory={symptomHistory}
        healthRecords={healthRecords}
        emergencyPlan={emergencyPlan}
        postnatalCare={postnatalCare}
        go={setActive}
      />

      <BottomNav active={active} setActive={setActive} />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem("mamacare_screen") || "welcome";
  });

  const [mother, setMother] = useState(() => {
    const savedMother = localStorage.getItem("mamacare_mother");
    return savedMother ? JSON.parse(savedMother) : defaultMother;
  });

  useEffect(() => {
    localStorage.setItem("mamacare_screen", screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem("mamacare_mother", JSON.stringify(mother));
  }, [mother]);

  const resetApp = () => {
    localStorage.removeItem("mamacare_screen");
    localStorage.removeItem("mamacare_mother");
    localStorage.removeItem("mamacare_symptoms");
    localStorage.removeItem("mamacare_custom_symptoms");
    localStorage.removeItem("mamacare_symptom_history");
    localStorage.removeItem("mamacare_vitals_history");
    localStorage.removeItem("mamacare_wellness_history");
    localStorage.removeItem("mamacare_appointments");
    localStorage.removeItem("mamacare_medications");
    localStorage.removeItem("mamacare_movement_history");
    localStorage.removeItem("mamacare_emergency_plan");
    localStorage.removeItem("mamacare_health_records");
    localStorage.removeItem("mamacare_postnatal_care");
    localStorage.removeItem("mamacare_support_people");
    localStorage.removeItem("mamacare_chat_history");
    localStorage.removeItem("mamacare_read_notifications");
    localStorage.removeItem("mamacare_accessibility_settings");
    localStorage.removeItem("mamacare_saved_tips");
    localStorage.removeItem("mamacare_read_tips");
    localStorage.removeItem("mamacare_active_tab");
    localStorage.removeItem("mamacare_sidebar_collapsed");
    localStorage.removeItem("mamacare_anc_checklist");
    localStorage.removeItem("mamacare_birth_checklist");
    localStorage.removeItem("mamacare_sync_settings");
    window.location.reload();
  };

  const logout = () => {
    authApi.logout();
    localStorage.setItem("mamacare_screen", "login");
    localStorage.setItem("mamacare_active_tab", "home");
    setScreen("login");
  };

  if (screen === "welcome") {
    return <WelcomePage go={setScreen} />;
  }

  if (screen === "register") {
    return (
      <RegisterPage go={setScreen} mother={mother} setMother={setMother} />
    );
  }

  if (screen === "login") {
    return <LoginPage go={setScreen} setMother={setMother} />;
  }

  if (screen === "setup") {
    return (
      <PregnancySetupPage
        go={setScreen}
        mother={mother}
        setMother={setMother}
      />
    );
  }

  return (
    <MainApp
      mother={mother}
      setMother={setMother}
      resetApp={resetApp}
      onLogout={logout}
    />
  );
}
