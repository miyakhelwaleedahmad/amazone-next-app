import React from "react";
import Link from "next/link";

export interface CouponRowProps {
  coupon: {
    _id: string;
    code: string;
    discountType?: "percentage" | "fixed" | string;
    discountValue?: number;
    expiresAt?: string | Date;
    active?: boolean;
    minOrderAmount?: number;
    usageCount?: number;
    maxUsage?: number;
    visibleOnProductPage?: boolean;
    badgeText?: string;
    applicableProducts?: string[]; // array of product ids
  };
  onDelete: (id: string) => Promise<void> | void;
  onToggleActive?: (id: string, nextActive: boolean) => Promise<void> | void;
}

/**
 * CouponRow - single table row for coupons list
 * - Shows key fields: code, discount, min order, expires, active, usage
 * - Provides Edit (link), Toggle Active, Delete actions
 */
export default function CouponRow({ coupon, onDelete, onToggleActive }: CouponRowProps) {
  const {
    _id,
    code,
    discountType = "percentage",
    discountValue = 0,
    expiresAt,
    active = false,
    minOrderAmount = 0,
    usageCount = 0,
    maxUsage = 0,
    visibleOnProductPage = false,
    badgeText = "Offer available",
    applicableProducts = [],
  } = coupon;

  const formattedExpires = expiresAt ? new Date(expiresAt).toLocaleDateString() : "—";
  const discountLabel =
    discountType === "percentage" ? `${discountValue}%` : `${discountValue} (fixed)`;

  const handleDelete = async () => {
    if (!confirm(`Delete coupon "${code}"? This action cannot be undone.`)) return;
    try {
      await onDelete(_id);
    } catch (err) {
      console.error("Delete coupon error:", err);
      alert("Failed to delete coupon.");
    }
  };

  const handleToggle = async () => {
    if (!onToggleActive) return;
    try {
      await onToggleActive(_id, !active);
    } catch (err) {
      console.error("Toggle active error:", err);
      alert("Failed to update coupon status.");
    }
  };

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="py-3 px-4 align-middle">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{code}</span>
          {visibleOnProductPage && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              {badgeText}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">Products: {applicableProducts.length || "All"}</div>
      </td>

      <td className="py-3 px-4 align-middle">{discountLabel}</td>

      <td className="py-3 px-4 align-middle">
        {minOrderAmount ? <span>Min {minOrderAmount}</span> : <span>—</span>}
      </td>

      <td className="py-3 px-4 align-middle">{formattedExpires}</td>

      <td className="py-3 px-4 align-middle">
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded ${
            active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
        <div className="text-xs text-gray-500 mt-1">
          {usageCount ?? 0}
          {maxUsage ? ` / ${maxUsage}` : ""}
        </div>
      </td>

      <td className="py-3 px-4 align-middle">
        <div className="flex items-center space-x-2">
          <Link href={`/admin/coupons/edit/${_id}`}>
            <a className="px-2 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600">Edit</a>
          </Link>

          <button
            onClick={handleToggle}
            className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            title={active ? "Deactivate coupon" : "Activate coupon"}
          >
            {active ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={handleDelete}
            className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            title="Delete coupon"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
