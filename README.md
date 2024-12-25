# roxiler-systems

Roxiler Systems E-commerce API
This project provides a set of APIs that allow you to retrieve statistics, bar chart data, and pie chart data for an e-commerce platform. The data is fetched from a MySQL database using Prisma ORM, and all responses are based on product data filtered by month (regardless of the year).

Features
Statistics API: Returns the total sale amount, total sold items, and total not sold items for a given month.
Bar Chart API: Returns the distribution of product prices into predefined price ranges for the selected month.
Pie Chart API: Returns the count of items grouped by their category for the selected month.
Combined Data API: Combines the responses of the three APIs (Statistics, Bar Chart, and Pie Chart) into one combined JSON response.
Prerequisites
Before running this project, you need the following:

Node.js: Ensure Node.js is installed. You can download it from here.
MySQL: Ensure MySQL is installed and running, along with a Products database containing the product table. The schema should have a dateOfSale, price, and category for each product.
Prisma: The project uses Prisma for interacting with the MySQL database.
Steps to Run the Project
Clone the Repository:

git clone git@github.com:akashg7/roxiler-systems.git
cd roxiler-systems
Install Dependencies:

Run the following command to install all the required dependencies:

npm install
Set Up the Prisma Schema:

Ensure your database is correctly set up and the schema in prisma/schema.prisma matches your MySQL setup. If you're using a fresh database, you can apply the migrations:

npx prisma migrate dev
Start the Application:

Run the application using the following command:

npm start
The server should now be running on http://localhost:3000.

API Endpoints
1. GET /statistics
Request
Query Parameter: month (e.g., "January")
Response
Returns total sale amount, total sold items, and total not sold items for the selected month.


{
  "success": true,
  "statistics": {
    "totalSaleAmount": 5000,
    "totalSoldItems": 50,
    "totalNotSoldItems": 10
  }
}
2. GET /bar-chart
Request
Query Parameter: month (e.g., "January")
Response
Returns the price range distribution of products for the selected month.


{
  "success": true,
  "data": [
    { "range": "0-100", "count": 10 },
    { "range": "101-200", "count": 5 },
    { "range": "201-300", "count": 8 },
    { "range": "301-400", "count": 7 },
    { "range": "401-500", "count": 12 },
    { "range": "501-600", "count": 3 },
    { "range": "601-700", "count": 2 },
    { "range": "701-800", "count": 1 },
    { "range": "801-900", "count": 0 },
    { "range": "901-above", "count": 1 }
  ]
}
3. GET /pie-chart
Request
Query Parameter: month (e.g., "January")
Response
Returns the number of items in each category for the selected month.



{
  "success": true,
  "data": [
    { "category": "Electronics", "count": 10 },
    { "category": "Clothing", "count": 15 },
    { "category": "Toys", "count": 5 }
  ]
}
4. GET /combined-data
Request
Query Parameter: month (e.g., "January")
Response
Combines the results from the Statistics, Bar Chart, and Pie Chart APIs into a single response.


{
  "success": true,
  "combinedData": {
    "statistics": {
      "totalSaleAmount": 5000,
      "totalSoldItems": 50,
      "totalNotSoldItems": 10
    },
    "barChart": [
      { "range": "0-100", "count": 10 },
      { "range": "101-200", "count": 5 },
      { "range": "201-300", "count": 8 },
      { "range": "301-400", "count": 7 },
      { "range": "401-500", "count": 12 },
      { "range": "501-600", "count": 3 },
      { "range": "601-700", "count": 2 },
      { "range": "701-800", "count": 1 },
      { "range": "801-900", "count": 0 },
      { "range": "901-above", "count": 1 }
    ],
    "pieChart": [
      { "category": "Electronics", "count": 10 },
      { "category": "Clothing", "count": 15 },
      { "category": "Toys", "count": 5 }
    ]
  }
}
Project Structure


.
├── index.js          # Main server file with API routes
├── prisma            # Prisma schema and migration files
│   ├── schema.prisma # Prisma schema file
│   └── migrations    # Database migrations
├── node_modules      # Node.js dependencies
├── package.json      # Project configuration
└── README.md         # This file
Running Tests
Currently, this project does not include automated tests, but you can manually test the API using Postman or similar tools.

Contributing
Fork the repository.
Create a new branch: git checkout -b feature-name.
Make your changes and commit them: git commit -m 'Add new feature'.
Push to your branch: git push origin feature-name.
Open a pull request.