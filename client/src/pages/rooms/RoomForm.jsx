import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { roomService } from "../../services/room.service.js";

const schema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional(),
  pricePerNight: z.coerce.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  capacity: z.coerce.number().min(1),
  status: z.enum(["available", "occupied", "maintenance"])
});

export default function RoomForm({ initial, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || "",
      category: initial?.category || "",
      description: initial?.description || "",
      pricePerNight: initial?.pricePerNight ?? 0,
      imageUrl: initial?.images?.[0] || "",
      capacity: initial?.capacity ?? 2,
      status: initial?.status || "available"
    }
  });

  async function onSubmit(values) {
    const payload = {
      title: values.title,
      category: values.category,
      description: values.description || "",
      pricePerNight: values.pricePerNight,
      images: values.imageUrl ? [values.imageUrl] : [],
      capacity: values.capacity,
      status: values.status
    };

    if (initial?._id) await roomService.update(initial._id, payload);
    else await roomService.create(payload);

    await onSaved();
  }

  async function onDelete() {
    if (!initial?._id) return;
    await roomService.remove(initial._id);
    await onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <Card className="w-full max-w-xl p-6">
        <div className="flex items-center justify-between">
          <div className="font-poppins text-lg font-bold">{initial?._id ? "Edit Room" : "Add Room"}</div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Title" {...register("title")} error={errors.title?.message} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Category" {...register("category")} error={errors.category?.message} />
            <Input label="Price / night" type="number" {...register("pricePerNight")} error={errors.pricePerNight?.message} />
          </div>

          <Input label="Image URL (optional)" {...register("imageUrl")} error={errors.imageUrl?.message} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Capacity" type="number" {...register("capacity")} error={errors.capacity?.message} />
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-slate-700">Status</div>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" {...register("status")}>
                <option value="available">available</option>
                <option value="occupied">occupied</option>
                <option value="maintenance">maintenance</option>
              </select>
              {errors.status?.message ? <div className="mt-1 text-xs text-rose-600">{errors.status.message}</div> : null}
            </label>
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-700">Description</div>
            <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={4} {...register("description")} />
          </label>

          <div className="mt-2 flex flex-col gap-2 md:flex-row md:justify-between">
            {initial?._id ? (
              <Button type="button" variant="secondary" onClick={onDelete}>
                Delete (Deactivate)
              </Button>
            ) : <div />}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}