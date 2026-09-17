"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CompleteProfilePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/login");
      const { data: profile } = await supabase.from("profiles").select("status, full_name, photo_url, onboarding_completed").eq("id", user.id).single();
      if (!profile || profile.status !== "approved") return router.replace("/pending");
      if (profile.onboarding_completed) return router.replace("/");
      setUserId(user.id);
      setFullName(profile.full_name ?? "");
      if (profile.photo_url) setPreview(profile.photo_url);
    };
    load();
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [router]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOpen(true);
      setError("");
    } catch {
      setError("Impossible d’utiliser la caméra. Autorise-la ou choisis une photo.");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setCameraOpen(false);
    }, "image/jpeg", 0.9);
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");
    setMessage("");
    let photoUrl: string | null = null;

    if (photo) {
      const path = `${userId}/profile-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, photo, { upsert: true, contentType: photo.type });
      if (uploadError) {
        setError("La photo n’a pas pu être envoyée. Vérifie le bucket avatars dans Supabase.");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      photoUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase.from("profiles").update({ full_name: fullName, ...(photoUrl ? { photo_url: photoUrl } : {}), onboarding_completed: true }).eq("id", userId);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage("Profil enregistré.");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-facebook-text">Compléter mon profil</h1>
        <p className="text-sm text-facebook-muted">Compte validé. Ajoute maintenant ton nom et ta photo.</p>
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {preview && <img src={preview} alt="Aperçu" className="w-32 h-32 rounded-full object-cover mx-auto" />}
        <div className="flex gap-2">
          <button type="button" onClick={openCamera} className="flex-1 bg-gray-200 py-2 rounded-lg">📷 Prendre une photo</button>
          <label className="flex-1 bg-gray-200 py-2 rounded-lg text-center cursor-pointer">Choisir une photo<input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" /></label>
        </div>
        {cameraOpen && <div className="space-y-2"><video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" /><button type="button" onClick={takePhoto} className="w-full bg-facebook-blue text-white py-2 rounded-lg">Capturer</button></div>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button disabled={loading} className="w-full bg-facebook-blue text-white py-3 rounded-lg disabled:opacity-60">{loading ? "Enregistrement..." : "Terminer"}</button>
      </form>
    </div>
  );
}
