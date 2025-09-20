/**
 * Calculates total revenue from all orders
 */
export function calculateRevenue(orders: { total: number }[]) {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

/**
 * Calculates monthly revenue from orders
 */
export function calculateMonthlyRevenue(
  orders: { total: number; date: string }[]
) {
  const revenueByMonth: Record<string, number> = {};

  orders.forEach((order) => {
    const month = new Date(order.date).toLocaleString("en-US", { month: "short", year: "numeric" });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + order.total;
  });

  return revenueByMonth;
}
