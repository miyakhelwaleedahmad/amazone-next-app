import React, { useEffect, useState } from "react";

export type CouponFormValues = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number | string;
  expiresAt: string; // yyyy-mm-dd
  active: boolean;
  minOrderAmount: number | string;
  maxUsage: number | string; // 0 = unlimited
  perUserLimit: number | string; // 0 = unlimited
  visibleOnProductPage: boolean;
  badgeText: string;
  applicableProducts: string[]; // array of product ids
};

type Props = {
  initialValues?: Partial<CouponFormValues>;
  onSubmit: (values: CouponFormValues) => Promise<void> | void;
  submitLabel?: string;
  // optional: pass small product list for multi-select (id & label)
  productOptions?: { id: string; label: string }[];
};

export default function CouponForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Save",
  productOptions = [],
}: Props) {
  const [form, setForm] = useState<CouponFormValues>({
    code: initialValues.code || "",
    discountType: (initialValues.discountType as any) || "percentage",
    discountValue: initialValues.discountValue ?? "",
    expiresAt: initialValues.expiresAt || "",
    active: initialValues.active ?? true,
    minOrderAmount: initialValues.minOrderAmount ?? "",
    maxUsage: initialValues.maxUsage ?? "0",
    perUserLimit: initialValues.perUserLimit ?? "0",
    visibleOnProductPage: initialValues.visibleOnProductPage ?? false,
    badgeText: initialValues.badgeText || "Offer available",
    applicableProducts: initialValues.applicableProducts || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // if initialValues change (edit page), sync them
    setForm(prev => ({
      ...prev,
      code: initialValues.code ?? prev.code,
      discountType: (initialValues.discountType as any) ?? prev.discountType,
      discountValue: initialValues.discountValue ?? prev.discountValue,
      expiresAt: initialValues.expiresAt ?? prev.expiresAt,
      active: initialValues.active ?? prev.active,
      minOrderAmount: initialValues.minOrderAmount ?? prev.minOrderAmount,
      maxUsage: initialValues.maxUsage ?? prev.maxUsage,
      perUserLimit: initialValues.perUserLimit ?? prev.perUserLimit,
      visibleOnProductPage: initialValues.visibleOnProductPage ?? prev.visibleOnProductPage,
      badgeText: initialValues.badgeText ?? prev.badgeText,
      applicableProducts: initialValues.applicableProducts ?? prev.applicableProducts,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked } as any));
    } else if (name === "applicableProducts") {
      // store comma separated ids when using textarea fallback
      const arr = value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      setForm(prev => ({ ...prev, applicableProducts: arr } as any));
    } else {
      setForm(prev => ({ ...prev, [name]: value } as any));
    }
  };

  const handleProductToggle = (id: string) => {
    setForm(prev => {
      const exists = prev.applicableProducts.includes(id);
      return {
        ...prev,
        applicableProducts: exists ? prev.applicableProducts.filter(x => x !== id) : [...prev.applicableProducts, id],
      } as any;
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.code || form.code.trim().length < 2) e.code = "Please enter a valid coupon code.";

    const dv = Number(form.discountValue as any);
    if (!form.discountValue || Number.isNaN(dv) || dv <= 0) e.discountValue = "Discount must be greater than 0.";

    if (!form.expiresAt) e.expiresAt = "Please select an expiry date.";
    else {
      const d = new Date(form.expiresAt);
      if (isNaN(d.getTime())) e.expiresAt = "Invalid date.";
      else if (d <= new Date()) e.expiresAt = "Expiry must be a future date.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // normalize numeric values to numbers before sending
    const payload: CouponFormValues = {
      ...form,
      discountValue: Number(form.discountValue as any),
      minOrderAmount: Number(form.minOrderAmount as any) || 0,
      maxUsage: Number(form.maxUsage as any) || 0,
      perUserLimit: Number(form.perUserLimit as any) || 0,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      // try to surface server errors
      const message = err?.message || (err?.response?.data?.message ?? "Failed to save coupon");
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && <div className="text-sm text-red-600">{errors.form}</div>}

      <div>
        <label className="block text-sm font-medium">Coupon Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Discount Type</label>
          <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Discount Value</label>
          <input
            name="discountValue"
            value={String(form.discountValue)}
            onChange={handleChange}
            type="number"
            min={0}
            step="any"
            className="w-full p-2 border rounded"
            required
          />
          {errors.discountValue && <p className="text-xs text-red-600 mt-1">{errors.discountValue}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Expiry Date</label>
        <input name="expiresAt" value={form.expiresAt} onChange={handleChange} type="date" className="w-full p-2 border rounded" required />
        {errors.expiresAt && <p className="text-xs text-red-600 mt-1">{errors.expiresAt}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Min Order Amount</label>
          <input name="minOrderAmount" value={String(form.minOrderAmount)} onChange={handleChange} type="number" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Max Usage (0 = unlimited)</label>
          <input name="maxUsage" value={String(form.maxUsage)} onChange={handleChange} type="number" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Per User Limit (0 = unlimited)</label>
          <input name="perUserLimit" value={String(form.perUserLimit)} onChange={handleChange} type="number" className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input id="active" name="active" checked={form.active} onChange={handleChange} type="checkbox" />
        <label htmlFor="active" className="text-sm">Active</label>

        <input id="visible" name="visibleOnProductPage" checked={form.visibleOnProductPage} onChange={handleChange} type="checkbox" className="ml-4" />
        <label htmlFor="visible" className="text-sm">Visible on product pages</label>
      </div>

      {form.visibleOnProductPage && (
        <div>
          <label className="block text-sm font-medium">Badge Text (shown on product)</label>
          <input name="badgeText" value={form.badgeText} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Applicable Products (optional)</label>
        {productOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border p-2 rounded">
            {productOptions.map(p => (
              <label key={p.id} className="flex items-center space-x-2">
                <input type="checkbox" checked={form.applicableProducts.includes(p.id)} onChange={() => handleProductToggle(p.id)} />
                <span className="text-sm">{p.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            name="applicableProducts"
            value={form.applicableProducts.join(",")}
            onChange={handleChange}
            placeholder="Comma-separated product ids (leave empty for all products)"
            className="w-full p-2 border rounded"
            rows={2}
          />
        )}
        <p className="text-xs text-gray-500 mt-1">Leave empty to apply to all products. You can provide product ids comma-separated or use the checkbox list above.</p>
      </div>

      <div className="flex items-center space-x-3">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {submitting ? "Saving..." : submitLabel}
        </button>

        <button type="button" onClick={() => window.history.back()} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
