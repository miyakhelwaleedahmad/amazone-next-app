// src/pages/admin/coupons/edit/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CouponForm from "../_components/couponForm";
import type { CouponFormValues } from "../_components/couponForm";

export default function EditCouponPage() {
  const router = useRouter();
  // router.query.id can be string | string[] | undefined
  const rawId = router.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Use the imported type here so TS knows it's used
  const [initial, setInitial] = useState<Partial<CouponFormValues> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/coupons/${id}`);
        if (!res.ok) throw new Error("Failed to fetch coupon");
        const data = await res.json();

        setInitial({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          expiresAt: data.expiresAt ? data.expiresAt.slice(0, 10) : "",
          active: data.active ?? true,
          minOrderAmount: data.minOrderAmount ?? "",
          maxUsage: data.maxUsage ?? "0",
          perUserLimit: data.perUserLimit ?? "0",
          visibleOnProductPage: data.visibleOnProductPage ?? false,
          badgeText: data.badgeText ?? "Offer available",
          applicableProducts: data.applicableProducts ?? [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load coupon");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Use the type for the form argument so the import is actually used
  const handleUpdate = async (form: CouponFormValues) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountValue: Number(form.discountValue),
          minOrderAmount: Number(form.minOrderAmount) || 0,
          maxUsage: Number(form.maxUsage) || 0,
          perUserLimit: Number(form.perUserLimit) || 0,
        }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Update failed");
      }
      alert("Coupon updated");
      await router.push("/admin/coupons");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to update coupon");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initial) return <p>Coupon not found</p>;

  return <CouponForm initialValues={initial} onSubmit={handleUpdate} submitLabel="Update Coupon" />;
}
