## CS3043-Supply-Chain-Management-System
The Supply Chain Management System is a Node.js based application designed to effectively navigate the complexities of modern supply chain management. It serves as a comprehensive solution to the challenges of managing products, customers, transportation, and distribution within a supply chain.

### Key Features and Capabilities
1. Customer Interaction <br>
Customers, including wholesalers, retailers, and end customers can seamlessly place orders through the user-friendly interface. To ensure timely delivery, a minimum 7-day lead time for order placement is enforced. Customers can also select their preferred delivery route based on their location.
2. Truck Delivery Management <br>
The system carefully handles the scheduling and routes of delivery trucks. It assigns trucks to pre-planned routes while considering driver and driver assistant schedules. This allocation process adheres to a set of constraints, such as avoiding consecutive truck schedules for drivers.
3. Product Management  <br>
The system provides an intuitive interface for managing an extensive range of products. Each product's details, including name, description, and transport capacity consumption, are meticulously tracked, allowing for efficient allocation of resources during transportation.
4. Optimized Railway Transportation  <br>
The system efficiently manages railway transportation by making maximum use of the capacity allocated to the company from each train trip. When orders exceed the allocated capacity, the system intelligently reschedules the excess orders for the next available trip. This approach ensures that resources are used effectively and orders are delivered as efficiently as possible.
5. Workload Management  <br>
The system enforces strict workload constraints to ensure that drivers do not exceed 40 hours per week and driver assistants do not exceed 60 hours per week.
6. Analytics and Reporting  <br>
 The system offers a comprehensive suite of reports for monitoring and informed decision-making. Reports include quarterly sales data, identification of top-selling items, sales categorized by main cities and routes, tracking of working hours for drivers and driver assistants, and detailed customer order histories.

### To Run the application

1. Navigate to the Project Directory
2. Install the necessary dependencies for the project by running **npm install**
3. To import the SQL files into your MySQL database, use the command: **source /path/to/sql-file.sql** 
4. Database importing order
     + Tables
     + Data
     + Views
     + Events
     + Procedures
     + Triggers
5. To start the application, run **npm start**




