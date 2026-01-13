import { db } from "@/lib/db";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Ayları 0-11 arası başlat ve değerlerini 0 yap
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 = Ocak, 1 = Şubat...
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Grafik kütüphanesinin anlayacağı formata çevir
  const graphData: GraphData[] = [
    { name: "Oca", total: 0 },
    { name: "Şub", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Nis", total: 0 },
    { name: "May", total: 0 },
    { name: "Haz", total: 0 },
    { name: "Tem", total: 0 },
    { name: "Ağu", total: 0 },
    { name: "Eyl", total: 0 },
    { name: "Eki", total: 0 },
    { name: "Kas", total: 0 },
    { name: "Ara", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};