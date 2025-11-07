"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FieldType = "input" | "textarea" | "select" | "date" | "readonly";

type FieldDefinition = {
  name: keyof ApplicationData;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
};

type StepDefinition = {
  id: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
};

type ApplicationData = {
  timestamp: string;
  fullName: string;
  email: string;
  careerMilestones: string;
  careerTurningPoints: string;
  ventureVision: string;
  ventureGoals: string;
  industryFocus: string;
  targetAudience: string;
  audienceDemographics: string;
  audiencePainPoints: string;
  audienceAge: string;
  differentiation: string;
  uniqueValue: string;
  competitors: string;
  brandImage: string;
  admiredInfluencers: string;
  brandAesthetics: string;
  brandEmotions: string;
  brandPersonality: string;
  brandFontPreference: string;
  scalingGoals: string;
  growthStrategies: string;
  longTermVision: string;
  additionalInfo: string;
  keyDeadlines: string;
  discoveryChannels: string;
  audienceGender: string;
  audienceMaritalStatus: string;
  brandValues: string;
};

const initialData: ApplicationData = {
  timestamp: "",
  fullName: "",
  email: "",
  careerMilestones: "",
  careerTurningPoints: "",
  ventureVision: "",
  ventureGoals: "",
  industryFocus: "",
  targetAudience: "",
  audienceDemographics: "",
  audiencePainPoints: "",
  audienceAge: "",
  differentiation: "",
  uniqueValue: "",
  competitors: "",
  brandImage: "",
  admiredInfluencers: "",
  brandAesthetics: "",
  brandEmotions: "",
  brandPersonality: "",
  brandFontPreference: "",
  scalingGoals: "",
  growthStrategies: "",
  longTermVision: "",
  additionalInfo: "",
  keyDeadlines: "",
  discoveryChannels: "",
  audienceGender: "",
  audienceMaritalStatus: "",
  brandValues: "",
};

const steps: StepDefinition[] = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Tell us who you are.",
    fields: [
      {
        name: "timestamp",
        label: "Submission timestamp",
        type: "readonly",
      },
      {
        name: "fullName",
        label: "Full Name",
        required: true,
        type: "input",
        placeholder: "Your full legal name",
      },
      {
        name: "email",
        label: "Email",
        required: true,
        type: "input",
        placeholder: "you@example.com",
      },
    ],
  },
  {
    id: "career",
    title: "Career Background",
    description: "Share a snapshot of your journey so far.",
    fields: [
      {
        name: "careerMilestones",
        label: "Significant career milestones",
        required: true,
        type: "textarea",
      },
      {
        name: "careerTurningPoints",
        label: "Key turning points in your personal career",
        required: true,
        type: "textarea",
      },
    ],
  },
  {
    id: "vision",
    title: "Vision",
    description: "Let us understand what you want to build.",
    fields: [
      {
        name: "ventureVision",
        label: "What is your vision for this venture?",
        required: true,
        type: "textarea",
      },
      {
        name: "ventureGoals",
        label: "What do you hope to achieve?",
        required: true,
        type: "textarea",
      },
      {
        name: "industryFocus",
        label: "Do you have a specific industry or niche in mind?",
        required: true,
        type: "input",
        placeholder: "e.g., Wellness, Fintech, Creator Tools",
      },
    ],
  },
  {
    id: "audience",
    title: "Target Audience",
    description: "Tell us who you’re speaking to.",
    fields: [
      {
        name: "targetAudience",
        label: "Who do you envision as your target audience?",
        required: true,
        type: "textarea",
      },
      {
        name: "audienceDemographics",
        label: "Demographic details (gender, location, interests, etc.)",
        required: true,
        type: "textarea",
      },
      {
        name: "audiencePainPoints",
        label: "Key needs and pain points",
        required: true,
        type: "textarea",
      },
      {
        name: "audienceAge",
        label: "How old is your target demographic?",
        required: true,
        type: "select",
        options: [
          "18-24",
          "25-34",
          "35-44",
          "45-54",
          "55+",
          "Mixed age ranges",
        ],
      },
    ],
  },
  {
    id: "differentiation",
    title: "Brand Differentiation",
    description: "How will you stand out?",
    fields: [
      {
        name: "differentiation",
        label: "How will you set your venture apart?",
        required: true,
        type: "textarea",
      },
      {
        name: "uniqueValue",
        label: "Unique value propositions (USPs)",
        required: true,
        type: "textarea",
      },
      {
        name: "competitors",
        label: "Competitors you’re monitoring",
        required: true,
        type: "textarea",
      },
    ],
  },
  {
    id: "brand-personality",
    title: "Brand Personality",
    description: "Define the voice and presence of your brand.",
    fields: [
      {
        name: "brandImage",
        label: "Describe the ideal brand image",
        required: true,
        type: "textarea",
      },
      {
        name: "admiredInfluencers",
        label: "Influencers or brands you admire",
        required: true,
        type: "textarea",
      },
      {
        name: "brandAesthetics",
        label: "Branding aesthetics, tone of voice, or visuals",
        required: true,
        type: "textarea",
      },
      {
        name: "brandEmotions",
        label: "Emotions or adjectives your brand should evoke",
        required: true,
        type: "textarea",
      },
      {
        name: "brandPersonality",
        label: "If your brand were a person, which word group best describes them?",
        required: true,
        type: "select",
        options: [
          "Bold, visionary, ambitious",
          "Calm, nurturing, grounding",
          "Playful, curious, unconventional",
          "Sophisticated, refined, timeless",
        ],
      },
      {
        name: "brandFontPreference",
        label: "Which font style best suits your brand?",
        required: true,
        type: "select",
        options: ["Modern Sans", "Elegant Serif", "Bold Display", "Minimal Monospace"],
      },
    ],
  },
  {
    id: "growth",
    title: "Growth & Strategy",
    description: "Outline your path forward.",
    fields: [
      {
        name: "scalingGoals",
        label: "Goals for scaling the business",
        required: true,
        type: "textarea",
      },
      {
        name: "growthStrategies",
        label: "Strategies or channels to explore for growth",
        required: true,
        type: "textarea",
      },
      {
        name: "longTermVision",
        label: "How do you envision your brand evolving long term?",
        required: true,
        type: "textarea",
      },
    ],
  },
  {
    id: "final",
    title: "Final Details",
    description: "Wrap up with anything else we should know.",
    fields: [
      {
        name: "additionalInfo",
        label: "Any other relevant information",
        required: true,
        type: "textarea",
      },
      {
        name: "keyDeadlines",
        label: "Specific deadlines or milestones",
        required: true,
        type: "date",
      },
      {
        name: "discoveryChannels",
        label: "How does your audience discover your social media profile?",
        required: true,
        type: "textarea",
      },
      {
        name: "audienceGender",
        label: "Is your audience primarily male or female?",
        required: true,
        type: "select",
        options: ["Primarily male", "Primarily female", "Balanced mix"],
      },
      {
        name: "audienceMaritalStatus",
        label: "Are they married or single?",
        required: true,
        type: "select",
        options: ["Primarily single", "Primarily married", "Mixed"],
      },
      {
        name: "brandValues",
        label: "Values or principles your brand communicates",
        required: true,
        type: "textarea",
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "wavelaunch-application-data";
const LOCAL_STORAGE_STEP_KEY = "wavelaunch-application-step";

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const totalSteps = steps.length;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedStep = window.localStorage.getItem(LOCAL_STORAGE_STEP_KEY);

    setFormData((prev) => {
      const parsed = storedData ? (JSON.parse(storedData) as ApplicationData) : prev;
      return {
        ...parsed,
        timestamp: parsed.timestamp || new Date().toISOString(),
      };
    });

    if (storedStep) {
      const parsedStep = Number.parseInt(storedStep, 10);
      if (!Number.isNaN(parsedStep) && parsedStep >= 0 && parsedStep < totalSteps) {
        setCurrentStep(parsedStep);
      }
    }
  }, [totalSteps]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_STORAGE_STEP_KEY, String(currentStep));
  }, [currentStep]);

  const currentFields = steps[currentStep].fields;

  const stepIsValid = useMemo(() => {
    return currentFields.every((field) => {
      if (!field.required) return true;
      const value = formData[field.name];
      if (field.name === "email") {
        return /.+@.+\..+/.test(String(value).trim());
      }
      if (field.type === "date") {
        return Boolean(value);
      }
      return String(value ?? "").trim().length > 0;
    });
  }, [currentFields, formData]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateField = (name: keyof ApplicationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!stepIsValid || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast({
        title: "Application submitted",
        description: "Thanks! We'll be in touch within 7 business days.",
      });

      setSubmitted(true);
      setCurrentStep(0);
      setFormData({ ...initialData, timestamp: new Date().toISOString() });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setSubmitted(false);
    setCurrentStep(0);
    setFormData({ ...initialData, timestamp: new Date().toISOString() });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-gray-100">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur transition-colors">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-gray-300 hover:text-white">
              Wavelaunch Studio
            </Link>
            <Button variant="ghost" size="sm" asChild className="text-xs text-gray-300 hover:text-white">
              <Link href="/about">About Wavelaunch Studio</Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
          <Card className="w-full border-white/10 bg-neutral-900/80 text-left">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-white">Thank you for applying</CardTitle>
              <CardDescription className="text-gray-300">
                🎉 Thank you for applying to Wavelaunch Studio. Our team will review your responses and reach out within 7 business days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-400">
                You can save this confirmation for your records or start over to submit a new application.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleStartOver} className="bg-[#7B3FE4] text-white hover:bg-[#6736c1]">
                  Start Over
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white" asChild>
                  <Link href="/">Return home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-gray-300 hover:text-white">
            Wavelaunch Studio
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-xs text-gray-300 hover:text-white">
            <Link href="/about">About Wavelaunch Studio</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Wavelaunch Studio Application</h1>
            <p className="mt-2 text-sm text-gray-400">
              Collaborate with Wavelaunch Studio to launch your next venture. Complete each section to help us understand your goals, audience, and brand.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-gray-400">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-[#7B3FE4] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-neutral-900/80 transition-all duration-300">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg font-semibold text-white">{step.title}</CardTitle>
            <CardDescription className="text-gray-300">{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="transition-opacity duration-300">
            <div className="space-y-6">
              <div className="grid gap-6">
                {step.fields.map((field) => (
                  <FormField
                    key={field.name as string}
                    field={field}
                    value={formData[field.name]}
                    onChange={updateField}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            {currentStep < totalSteps - 1 ? (
              <Button
                className={cn(
                  "bg-[#7B3FE4] text-white hover:bg-[#6736c1]",
                  !stepIsValid && "pointer-events-none opacity-50"
                )}
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))}
                disabled={!stepIsValid}
              >
                Next
              </Button>
            ) : (
              <Button
                className={cn(
                  "bg-[#7B3FE4] text-white hover:bg-[#6736c1]",
                  (!stepIsValid || submitting) && "pointer-events-none opacity-50"
                )}
                onClick={handleSubmit}
                disabled={!stepIsValid || submitting}
              >
                {submitting ? "Submitting..." : "Submit application"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

type FormFieldProps = {
  field: FieldDefinition;
  value: string;
  onChange: (name: keyof ApplicationData, value: string) => void;
};

function FormField({ field, value, onChange }: FormFieldProps) {
  const commonLabel = (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-200">
        {field.label}
        {field.required && <span className="ml-1 text-[#7B3FE4]">*</span>}
      </label>
      {field.description && <p className="text-xs text-gray-400">{field.description}</p>}
    </div>
  );

  switch (field.type) {
    case "readonly":
      return (
        <div className="space-y-2">
          {commonLabel}
          <div className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-gray-300">
            {new Date(value || new Date().toISOString()).toLocaleString()}
          </div>
        </div>
      );
    case "input":
      return (
        <div className="space-y-2">
          {commonLabel}
          <Input
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            placeholder={field.placeholder}
            className="border-white/10 bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:border-[#7B3FE4] focus:ring-[#7B3FE4]"
            type={field.name === "email" ? "email" : "text"}
            required={field.required}
          />
        </div>
      );
    case "date":
      return (
        <div className="space-y-2">
          {commonLabel}
          <Input
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            className="border-white/10 bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:border-[#7B3FE4] focus:ring-[#7B3FE4]"
            type="date"
            required={field.required}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-2">
          {commonLabel}
          <Textarea
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            placeholder={field.placeholder}
            className="min-h-[120px] border-white/10 bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:border-[#7B3FE4] focus:ring-[#7B3FE4]"
            required={field.required}
          />
        </div>
      );
    case "select":
      return (
        <div className="space-y-2">
          {commonLabel}
          <Select
            value={value}
            onValueChange={(selected) => onChange(field.name, selected)}
          >
            <SelectTrigger className="border-white/10 bg-neutral-900 text-gray-100 focus:border-[#7B3FE4] focus:ring-[#7B3FE4]">
              <SelectValue placeholder={field.placeholder ?? "Select an option"} />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-neutral-900 text-gray-100">
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    default:
      return null;
  }
}
