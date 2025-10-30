require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const FinanceMethod = require('./models/FinanceMethod');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Public User',
    email: 'user@example.com',
    password: 'user123',
    role: 'public'
  }
];

const financeMethods = [
  {
    title: '50/30/20 Budgeting Rule',
    description: 'A simple budgeting method that divides your income into three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
    category: 'Budgeting',
    methodology: '1. Calculate your after-tax income\n2. Allocate 50% to needs (rent, groceries, utilities)\n3. Allocate 30% to wants (entertainment, dining out)\n4. Allocate 20% to savings and debt repayment\n5. Adjust percentages based on your financial situation',
    benefits: [
      'Easy to understand and implement',
      'Ensures you save money consistently',
      'Helps prioritize essential expenses',
      'Flexible and adaptable to different income levels'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Zero-Based Budgeting',
    description: 'A budgeting method where every dollar of income is assigned a specific purpose, ensuring your income minus expenses equals zero.',
    category: 'Budgeting',
    methodology: '1. List all sources of income\n2. List all expenses for the month\n3. Assign every dollar a job\n4. Track spending throughout the month\n5. Adjust as needed',
    benefits: [
      'Gives complete control over your money',
      'Eliminates wasteful spending',
      'Helps achieve specific financial goals',
      'Provides clear picture of financial health'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Emergency Fund Building',
    description: 'Creating a financial safety net to cover unexpected expenses without going into debt.',
    category: 'Saving',
    methodology: '1. Set a savings goal (3-6 months of expenses)\n2. Open a separate high-yield savings account\n3. Start with a small amount if needed\n4. Automate monthly transfers\n5. Increase contributions over time',
    benefits: [
      'Provides financial security',
      'Reduces stress during emergencies',
      'Avoids high-interest debt',
      'Creates peace of mind'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Compound Interest Investing',
    description: 'Investing strategy that leverages the power of compound interest to grow wealth over time.',
    category: 'Investment',
    methodology: '1. Start investing early to maximize compound growth\n2. Choose diversified investments (index funds, ETFs)\n3. Reinvest dividends and gains\n4. Maintain consistent contributions\n5. Stay invested for the long term',
    benefits: [
      'Accelerates wealth growth exponentially',
      'Requires minimal active management',
      'Builds substantial wealth over time',
      'Reduces impact of market volatility'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Debt Snowball Method',
    description: 'A debt repayment strategy that focuses on paying off debts from smallest to largest balance for psychological wins.',
    category: 'Debt Management',
    methodology: '1. List all debts from smallest to largest\n2. Make minimum payments on all debts\n3. Put extra money toward smallest debt\n4. Once smallest debt is paid, move to next smallest\n5. Continue until all debts are eliminated',
    benefits: [
      'Provides motivation through quick wins',
      'Simplifies debt repayment process',
      'Builds momentum for larger debts',
      'Improves financial behavior'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Expense Tracking',
    description: 'Monitoring and recording all spending to understand where your money goes and identify savings opportunities.',
    category: 'Expense Tracking',
    methodology: '1. Choose a tracking method (app, spreadsheet, notebook)\n2. Record every expense immediately\n3. Categorize expenses\n4. Review spending weekly\n5. Identify patterns and adjust spending',
    benefits: [
      'Reveals spending habits',
      'Identifies unnecessary expenses',
      'Helps stay within budget',
      'Provides data for financial decisions'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  }
];

const importData = async () => {
  try {
    // Hash passwords
    for (let i = 0; i < users.length; i++) {
      const salt = await bcrypt.genSalt(10);
      users[i].password = await bcrypt.hash(users[i].password, salt);
    }

    // Clear existing data
    await User.deleteMany();
    await FinanceMethod.deleteMany();

    // Insert users
    await User.insertMany(users);

    // Insert finance methods
    await FinanceMethod.insertMany(financeMethods);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await FinanceMethod.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
