const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Helper function to extract the month from a date.
 */
function extractMonth(date) {
  const options = { month: "long" }; // 'long' ensures full month name (e.g., 'January')
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

/**
 * GET /transactions
 * API to list all transactions with search and pagination.
 */
app.get("/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  try {
    const skip = (page - 1) * perPage;

    // Fetch all products from the database
    const allProducts = await prisma.product.findMany();

    // Filter by month if provided
    let filteredProducts = allProducts;
    if (month) {
      filteredProducts = allProducts.filter(
        (product) => extractMonth(product.dateOfSale) === month
      );
    }

    // Filter by search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          (product.price && product.price.toString().includes(search))
      );
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(
      skip,
      skip + parseInt(perPage)
    );

    res.status(200).json({
      success: true,
      data: paginatedProducts,
      totalRecords: filteredProducts.length,
      currentPage: parseInt(page),
      perPage: parseInt(perPage),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /statistics
 * API to get statistics for the selected month.
 */
app.get("/statistics", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ success: false, message: "Month is required" });
  }

  try {
    // Fetch all products from the database
    const allProducts = await prisma.product.findMany();

    // Filter by the provided month
    const filteredProducts = allProducts.filter(
      (product) => extractMonth(product.dateOfSale) === month
    );

    // Calculate statistics
    const totalSaleAmount = filteredProducts.reduce(
      (acc, product) => acc + (product.price || 0),
      0
    );
    const totalSoldItems = filteredProducts.length;
    const totalNotSoldItems = allProducts.length - filteredProducts.length;

    res.status(200).json({
      success: true,
      statistics: {
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /bar-chart
 * API for generating a bar chart with price ranges and item counts for the selected month.
 */
app.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ success: false, message: "Month is required" });
  }

  try {
    // Fetch all products from the database
    const allProducts = await prisma.product.findMany();

    // Filter by the provided month
    const filteredProducts = allProducts.filter(
      (product) => extractMonth(product.dateOfSale) === month
    );

    // Create price ranges
    const priceRanges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901-above", count: 0 },
    ];

    // Group products by price range
    filteredProducts.forEach((product) => {
      const price = product.price || 0;

      if (price <= 100) priceRanges[0].count++;
      else if (price <= 200) priceRanges[1].count++;
      else if (price <= 300) priceRanges[2].count++;
      else if (price <= 400) priceRanges[3].count++;
      else if (price <= 500) priceRanges[4].count++;
      else if (price <= 600) priceRanges[5].count++;
      else if (price <= 700) priceRanges[6].count++;
      else if (price <= 800) priceRanges[7].count++;
      else if (price <= 900) priceRanges[8].count++;
      else priceRanges[9].count++;
    });

    res.status(200).json({
      success: true,
      data: priceRanges,
    });
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /pie-chart
 * API for generating a pie chart with unique categories and item counts for the selected month.
 */

app.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ success: false, message: "Month is required" });
  }

  try {
    // Fetch all products from the database
    const allProducts = await prisma.product.findMany();

    // Filter by the provided month
    const filteredProducts = allProducts.filter(
      (product) => extractMonth(product.dateOfSale) === month
    );

    // Group products by category
    const categoryCount = {};

    filteredProducts.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Convert the category counts to an array of objects for pie chart
    const pieChartData = Object.keys(categoryCount).map((category) => ({
      category,
      count: categoryCount[category],
    }));

    res.status(200).json({
      success: true,
      data: pieChartData,
    });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


app.get("/combined-data", async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).json({ success: false, message: "Month is required" });
    }
  
    try {
      // Fetch statistics
      const statisticsResponse = await prisma.product.findMany();
      const filteredProducts = statisticsResponse.filter(
        (product) => extractMonth(product.dateOfSale) === month
      );
  
      const totalSaleAmount = filteredProducts.reduce(
        (acc, product) => acc + (product.price || 0),
        0
      );
      const totalSoldItems = filteredProducts.length;
      const totalNotSoldItems = statisticsResponse.length - filteredProducts.length;
  
      const statistics = {
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
      };
  
      // Fetch bar chart data
      const priceRanges = [
        { range: "0-100", count: 0 },
        { range: "101-200", count: 0 },
        { range: "201-300", count: 0 },
        { range: "301-400", count: 0 },
        { range: "401-500", count: 0 },
        { range: "501-600", count: 0 },
        { range: "601-700", count: 0 },
        { range: "701-800", count: 0 },
        { range: "801-900", count: 0 },
        { range: "901-above", count: 0 },
      ];
 
      filteredProducts.forEach((product) => {
        const price = product.price || 0;
  
        if (price <= 100) priceRanges[0].count++;
        else if (price <= 200) priceRanges[1].count++;
        else if (price <= 300) priceRanges[2].count++;
        else if (price <= 400) priceRanges[3].count++;
        else if (price <= 500) priceRanges[4].count++;
        else if (price <= 600) priceRanges[5].count++;
        else if (price <= 700) priceRanges[6].count++;
        else if (price <= 800) priceRanges[7].count++;
        else if (price <= 900) priceRanges[8].count++;
        else priceRanges[9].count++;
      });
  
      // Fetch pie chart data
      const categoryCount = {};
  
      filteredProducts.forEach((product) => {
        const category = product.category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
  
      const pieChartData = Object.keys(categoryCount).map((category) => ({
        category,
        count: categoryCount[category],
      }));
  
      // Combine all data and send as response
      res.status(200).json({
        success: true,
        combinedData: {
          statistics,
          barChart: priceRanges,
          pieChart: pieChartData,
        },
      });
    } catch (error) {
      console.error("Error fetching combined data:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
 

/**
 * Start the Express server.
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
