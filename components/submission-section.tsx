"use client";

/* eslint-disable @next/next/no-img-element -- Blob/data URL previews from camera upload cannot be optimized by next/image. */

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  LocateFixed,
  MapPin,
  RotateCcw,
  Send,
  UploadCloud
} from "lucide-react";
import { motion } from "framer-motion";
import {
  analyzeIssue,
  districtLabels,
  districts,
  problemLabels,
  problemTypes,
  type DistrictId,
  type GeoPoint,
  type ProblemType
} from "@/lib/ai-analysis";
import { issueFromAnalysis } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { useIssues } from "./issue-provider";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";

export function SubmissionSection() {
  const { addIssue } = useIssues();
  const { t, locale } = useLanguage();
  const [district, setDistrict] = useState<DistrictId>("almaly");
  const [problem, setProblem] = useState<ProblemType>("pothole");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "ready" | "denied">(
    "idle"
  );
  const [isLocating, setIsLocating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    setImageDataUrl(file ? await fileToDataUrl(file) : null);
  }

  function resetPhoto() {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));
    const formData = {
      district,
      location,
      address,
      description,
      selectedProblemType: problem,
      locale
    };
    const result = await analyzeIssue(imageFile, formData);
    const issue = issueFromAnalysis(result, {
      district,
      description,
      address,
      location,
      hasPhoto: Boolean(imageDataUrl),
      photoUrl: imageDataUrl ?? undefined
    });

    addIssue(issue);
    setSubmittedIssueId(issue.id);
    setLoading(false);
    window.setTimeout(() => {
      document
        .getElementById("dashboard")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
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
      className="relative min-h-screen overflow-hidden bg-pearl px-4 pb-20 pt-32 text-ink"
    >
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-civic-mint/16 blur-3xl" />
      <div className="absolute right-0 top-96 h-72 w-72 rounded-full bg-civic-coral/12 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-ink/45">
              {t.sections.citizenKicker}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              {t.sections.citizenTitle}
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/62">
              {t.sections.citizenSubtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className="light-glass mt-10 grid gap-6 rounded-[2rem] p-5 lg:grid-cols-[0.95fr_1.05fr] lg:p-7"
          >
            <div className="space-y-5">
              <Field label={t.form.photo}>
                <div className="rounded-3xl border border-dashed border-ink/16 bg-white/72 p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-ink/[0.04] px-4 py-7 text-center transition hover:bg-ink/[0.07]">
                    <UploadCloud className="size-8 text-ink/52" />
                    <span className="mt-3 text-sm font-extrabold text-ink">
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
                    <div className="mt-4 overflow-hidden rounded-3xl border border-ink/10 bg-ink">
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
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-ink/[0.04] px-4 py-3 text-sm font-semibold text-ink/48">
                      <Camera className="size-4" />
                      {t.form.noPhoto}
                    </div>
                  )}
                </div>
              </Field>
            </div>

            <div className="grid gap-5">
              <Field label={t.form.district}>
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value as DistrictId)}
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
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-extrabold text-white transition hover:bg-ink/88"
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

              <Field label={t.form.address}>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/32" />
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder={t.form.addressPlaceholder}
                    className="h-14 w-full rounded-2xl border border-ink/10 bg-white py-3 pl-12 pr-4 text-base font-semibold outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-civic-cyan/20"
                  />
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
                        "rounded-2xl border px-4 py-3 text-left text-sm font-extrabold transition",
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

              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-4 text-base font-extrabold text-white shadow-glow transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="size-5" />
                {loading ? t.form.analyzing : t.form.submit}
              </motion.button>

              {submittedIssueId ? (
                <div className="rounded-2xl border border-civic-mint/40 bg-civic-mint/14 px-4 py-3 text-center text-sm font-extrabold text-ink">
                  {t.form.submitted}: {submittedIssueId}
                </div>
              ) : null}
            </div>
          </form>
        </Reveal>
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
      <span className="mb-2 block text-sm font-extrabold text-ink/62">{label}</span>
      {children}
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
