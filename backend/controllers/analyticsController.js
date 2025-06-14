import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/UserModel.js";
import Product from "../model/ProductModel.js";
import Order from "../model/OrderModel.js";

const getAnalyticsData = async () => {
    const totalUser = await User.countDocuments();
    // const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // it groups all documents together
                totalSales: { $sum: 1 }, // count of total sales
                totalRevenue: { $sum: "$totalAmount" },
                averageOrderValue: { $avg: "$totalAmount" },

            }
        }
    ]);
    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };
    return {
        users: totalUser,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
}
const getDailySalesData = async (startDate, endDate) => {
    const dailySalesData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
                // averageOrderValue: { $avg: "$totalAmount" }
            }
        },
        {
            $sort: { _id: 1 } // Sort by date ascending
        }
    ]);
    const datesInRange = getDatesInRange(startDate, endDate);
    return datesInRange.map(date => {
        // const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const salesData = dailySalesData.find(item => item._id === date);
        return {
            date: dateString,
            totalSales: salesData ? salesData.totalSales : 0,
            totalRevenue: salesData ? salesData.totalRevenue : 0
            // averageOrderValue: salesData ? salesData.averageOrderValue : 0
        };
    });
};
const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

export const getAnalytics = asyncHandler(async (req, res, next) => {
    const analyticsData = await getAnalyticsData(req, res, next);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.json({
        analytics: analyticsData,
        dailySales: dailySalesData,
    });
});

