"use client";

/* eslint-disable @next/next/no-img-element -- Blob preview URLs from camera/upload cannot be optimized by next/image. */

import { useEffect, useRef, useState } from "react";
import { Camera, LocateFixed, RotateCcw, Send, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import {
  analyzeIssue,
  districtLabels,
  districts,
  problemLabels,
  problemTypes,
  type AIAnalysisResult,
  type DistrictId,
  type GeoPoint,
  type ProblemType
} from "@/lib/ai-analysis";
import { issueFromAnalysis, type IssueRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";
import { AnalysisResultCard } from "./analysis-result-card";

type SubmissionSectionProps = {
  onIssueCreated: (issue: IssueRecord) => void;
};

export function SubmissionSection({ onIssueCreated }: SubmissionSectionProps) {
  const { t, locale } = useLanguage();
  const [district, setDistrict] = useState<DistrictId>("almaly");
  const [problem, setProblem] = useState<ProblemType>("pothole");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "ready" | "denied">(
    "idle"
  );
  const [isLocating, setIsLocating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleLocation() {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationState("ready");
        setIsLocating(false);
      },
      () => {
        setLocationState("denied");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function resetPhoto() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAnalysis(null);

    await new Promise((resolve) => setTimeout(resolve, 1350));
    const result = await analyzeIssue(imageFile, {
      district,
      location,
      description,
      selectedProblemType: problem,
      locale
    });

    setAnalysis(result);
    onIssueCreated(
      issueFromAnalysis(result, {
        district,
        description,
        location,
        hasPhoto: Boolean(imageFile)
      })
    );
    setLoading(false);

    window.setTimeout(() => {
      document
        .getElementById("analysis")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }

  const locationMessage =
    locationState === "ready"
      ? `${t.form.locationReady}: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}`
      : locationState === "denied"
        ? t.form.locationDenied
        : "";

  return (
    <section
      id="submit"
      className="relative overflow-hidden bg-pearl px-4 py-24 text-ink"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent opacity-10" />
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-civic-mint/16 blur-3xl" />
      <div className="absolute right-0 top-96 h-72 w-72 rounded-full bg-civic-coral/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-ink/45">
              {t.sections.citizenKicker}
            </p>
            <h2 className="mt-4 text-balance text-4xl font-black leading-tight sm:text-6xl">
              {t.sections.citizenTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/62">
              {t.sections.citizenSubtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="light-glass rounded-[2rem] p-5 sm:p-7"
            >
              <div className="grid gap-5">
                <Field label={t.form.district}>
                  <select
                    value={district}
                    onChange={(event) =>
                      setDistrict(event.target.value as DistrictId)
                    }
                    className="h-14 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-ink/30 focus:ring-4 focus:ring-civic-cyan/20"
                  >
                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {districtLabels[locale][item]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t.form.location}>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleLocation}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white transition hover:bg-ink/88"
                    >
                      <LocateFixed
                        className={cn("size-5", isLocating && "animate-pulse")}
                      />
                      {t.form.useLocation}
                    </motion.button>
                    {locationMessage ? (
                      <p
                        className={cn(
                          "flex min-h-12 flex-1 items-center rounded-2xl px-4 text-sm font-semibold",
                          locationState === "ready"
                            ? "bg-civic-mint/18 text-ink"
                            : "bg-civic-coral/14 text-ink"
                        )}
                      >
                        {locationMessage}
                      </p>
                    ) : null}
                  </div>
                </Field>

                <Field label={t.form.photo}>
                  <div className="rounded-3xl border border-dashed border-ink/18 bg-white/70 p-4">
                    <div className="flex flex-col gap-3">
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-ink/[0.04] px-4 py-6 text-center transition hover:bg-ink/[0.07]">
                        <UploadCloud className="size-8 text-ink/52" />
                        <span className="mt-3 text-sm font-black text-ink">
                          {t.form.photo}
                        </span>
                        <span className="mt-1 text-xs font-semibold text-ink/48">
                          {t.form.photoHint}
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="mt-4 w-full text-sm text-ink/62"
                        />
                      </label>

                      {imagePreview ? (
                        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ink">
                          <div className="relative aspect-[4/3] w-full">
                            <img
                              src={imagePreview}
                              alt={t.form.preview}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 p-3">
                            <p className="text-sm font-semibold text-white/76">
                              {t.form.confidenceBoost}
                            </p>
                            <button
                              type="button"
                              onClick={resetPhoto}
                              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
                              aria-label={t.form.reset}
                            >
                              <RotateCcw className="size-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-2xl bg-ink/[0.04] px-4 py-3 text-sm font-semibold text-ink/48">
                          <Camera className="size-4" />
                          {t.form.noPhoto}
                        </div>
                      )}
                    </div>
                  </div>
                </Field>

                <Field label={t.form.problem}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {problemTypes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setProblem(item)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm font-black transition",
                          problem === item
                            ? "border-ink bg-ink text-white shadow-glow"
                            : "border-ink/10 bg-white/70 text-ink/62 hover:border-ink/24 hover:text-ink"
                        )}
                      >
                        {problemLabels[locale][item]}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label={t.form.description}>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={t.form.descriptionPlaceholder}
                    rows={4}
                    className="w-full resize-none rounded-3xl border border-ink/10 bg-white px-4 py-4 text-base font-semibold leading-7 outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-civic-cyan/20"
                  />
                </Field>
              </div>

              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-4 text-base font-black text-white shadow-glow transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="size-5" />
                {loading ? t.form.analyzing : t.form.submit}
              </motion.button>

              <p className="mt-4 text-center text-xs font-semibold text-ink/45">
                {t.misc.readyApi}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.16} id="analysis">
            <AnalysisResultCard result={analysis} loading={loading} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-sm font-black text-ink/62">{label}</span>
      {children}
    </div>
  );
}
