"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReviewModalProps {
  roomId: string;
  roomName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export function ReviewModal({ roomId, roomName, onClose, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }
    setSaving(true);
    try {
      await axios.post("/api/reviews", { roomId, rating, comment });
      toast.success("Thanks for your review!");
      onSubmitted();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't submit your review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--color-white)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-[var(--color-ink)]">Rate your stay</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">{roomName}</p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  size={28}
                  className={
                    n <= (hoverRating || rating)
                      ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                      : "text-[var(--color-mist)]"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What stood out about your stay?"
            className="w-full rounded-xl border border-[var(--color-mist)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
          />

          <Button type="submit" loading={saving} className="w-full">
            Submit review
          </Button>
        </form>
      </div>
    </div>
  );
}
