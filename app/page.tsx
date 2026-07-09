"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, X, ImagePlus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoRoomId, setPhotoRoomId] = useState<string | null>(null);
  const [form, setForm] = useState({
    hotelId: "",
    roomTypeId: "",
    roomNumber: "",
    floor: "1",
    pricePerNight: "",
  });

  function load() {
    axios.get("/api/admin/rooms").then((res) => setRooms(res.data.data));
  }
  useEffect(load, []);

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/admin/rooms", form);
      toast.success("Room added.");
      setShowForm(false);
      setForm({ hotelId: "", roomTypeId: "", roomNumber: "", floor: "1", pricePerNight: "" });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't add room.");
    } finally {
      setSaving(false);
    }
  }

  async function updatePrice(id: string, pricePerNight: string) {
    try {
      await axios.patch(`/api/admin/rooms/${id}`, { pricePerNight });
      toast.success("Price updated.");
      load();
    } catch {
      toast.error("Couldn't update price.");
    }
  }

  async function setStatus(id: string, status: string) {
    try {
      await axios.patch(`/api/admin/rooms/${id}`, { status });
      toast.success(`Room marked ${status.toLowerCase()}.`);
      load();
    } catch {
      toast.error("Couldn't update room status.");
    }
  }

  async function deactivate(id: string) {
    if (!confirm("Remove this room from listings?")) return;
    try {
      await axios.delete(`/api/admin/rooms/${id}`);
      toast.success("Room removed from listings.");
      load();
    } catch {
      toast.error("Couldn't remove room.");
    }
  }

  async function saveRoomImages(id: string, images: string[]) {
    try {
      await axios.patch(`/api/admin/rooms/${id}`, { images });
      load();
    } catch {
      toast.error("Couldn't update photos.");
    }
  }

  const photoRoom = rooms?.find((r) => r.id === photoRoomId) || null;

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">Rooms</h1>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Close" : "Add room"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={createRoom}
          className="mt-4 grid grid-cols-1 gap-4 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-white)] p-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          <Input label="Hotel ID" required value={form.hotelId} onChange={(e) => setForm({ ...form, hotelId: e.target.value })} />
          <Input label="Room type ID" required value={form.roomTypeId} onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })} />
          <Input label="Room number" required value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          <Input label="Floor" type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
          <Input label="Price / night (KES)" type="number" required value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} />
          <Button type="submit" loading={saving} className="lg:col-span-5 w-fit">
            Save room
          </Button>
          <p className="text-xs text-[var(--color-ink)]/50 lg:col-span-5">
            Tip: create hotels and room types via Prisma Studio (<code>npx prisma studio</code>) or the seed script, then paste their IDs here.
          </p>
        </form>
      )}

      {rooms === null ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-[var(--color-mist)]/40" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-white)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-canvas-soft)] text-xs uppercase tracking-wide text-[var(--color-ink)]/60">
              <tr>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Price/night</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Photos</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-mist)]">
                  <td className="px-5 py-3">#{r.roomNumber} · Floor {r.floor}</td>
                  <td className="px-5 py-3">{r.roomType.name}</td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      defaultValue={r.pricePerNight}
                      onBlur={(e) => e.target.value !== String(r.pricePerNight) && updatePrice(r.id, e.target.value)}
                      className="w-24 rounded-lg border border-[var(--color-mist)] px-2 py-1"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="rounded-lg border border-[var(--color-mist)] px-2 py-1"
                    >
                      {["AVAILABLE", "BOOKED", "MAINTENANCE", "CLEANING"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setPhotoRoomId(r.id)}
                      className="flex items-center gap-1 text-xs font-medium text-[var(--color-gold)] hover:underline"
                    >
                      <ImagePlus size={14} /> {r.images?.length || 0} photo{r.images?.length === 1 ? "" : "s"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => deactivate(r.id)} className="text-xs text-[var(--color-clay)] hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {photoRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-6"
          onClick={() => setPhotoRoomId(null)}
        >
          <div
            className="w-full max-w-lg rounded-[var(--radius-card)] bg-[var(--color-white)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--color-ink)]">
                Photos — Room #{photoRoom.roomNumber}
              </h2>
              <button onClick={() => setPhotoRoomId(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <ImageUploader
                folder="rooms"
                label="Upload room photo"
                onUploaded={(url) => saveRoomImages(photoRoom.id, [...(photoRoom.images || []), url])}
              />
            </div>

            {photoRoom.images?.length ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {photoRoom.images.map((url: string) => (
                  <div key={url} className="group relative h-24 overflow-hidden rounded-xl">
                    <Image src={url} alt="Room photo" fill className="object-cover" unoptimized />
                    <button
                      onClick={() =>
                        saveRoomImages(
                          photoRoom.id,
                          photoRoom.images.filter((i: string) => i !== url)
                        )
                      }
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--color-ink)]/50">
                No photos yet — the room falls back to its room type&apos;s default photos on the site.
              </p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
