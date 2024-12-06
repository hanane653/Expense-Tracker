import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-homie',
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './homie.component.html',
  styleUrls: ['./homie.component.css'],
})
export class HomieComponent {
  isLoggedIn = false;
  isLoginVisible = false;
  isRegisterVisible = false;
  isExpenseListVisible: boolean = false;
  newExpense = {
    description: '',
    amount: 0,
    date: new Date().toISOString(),
    categoryId: null,
    userId: '',
  };
  expenses: any[] = [];
  categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Other' },
  ];
  notification: string | null = null;
  loginModel = { email: '', password: '' };
  registerModel = { email: '', password: '', fullName: '', budget: 0 };
  isFormVisible: boolean = false;

  // Chart properties
  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'], // Customize these colors
        hoverBackgroundColor: ['#ff6666', '#3399ff', '#66ff66', '#ff9933'],
      },
    ],
  };
  chartOptions: ChartOptions = {
    responsive: true,
             
  maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  constructor(private http: HttpClient) {}
  toggleExpenseList() {
    this.isExpenseListVisible = !this.isExpenseListVisible;
  }
  toggleForm() {
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
    this.isFormVisible = !this.isFormVisible;
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }
  

  showLogin() {
    this.isLoginVisible = true;
    this.isRegisterVisible = false;
  }

  showRegister() {
    this.isRegisterVisible = true;
    this.isLoginVisible = false;
  }

  login() {
    this.http.post('http://localhost:7044/api/Authentication/login', this.loginModel).subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.token); // Save token
        this.isLoggedIn = true;
        this.isLoginVisible = false; 
        this.loadExpenses();
        this.notification = 'Logged in successfully';
      },
      error: () => {
        this.notification = 'Login failed. Please try again.';
      },
    });
  }

  register() {
    this.http.post('http://localhost:7044/api/Authentication/register', this.registerModel).subscribe({
      next: () => {
        this.notification = 'Registration successful. You can now log in.';
        this.showLogin();
      },
      error: () => {
        this.notification = 'Registration failed. Please try again.';
      },
    });
  }

  loadExpenses() {
    this.http.get<any[]>('http://localhost:7044/api/Expenses').subscribe({
      next: (data: any[]) => {
        this.expenses = data;
        this.updateChartData(); // Update the chart data when expenses are loaded
      },
      error: () => {
        this.notification = 'Error loading expenses.';
      },
    });
  }

  addExpense() {
    if (!this.newExpense.description || !this.newExpense.amount || !this.newExpense.categoryId) {
      this.notification = 'Please fill in all fields.';
      return;
    }

    const token = localStorage.getItem('authToken'); // Get the token from local storage
    if (!token) {
      this.notification = 'You must be logged in to add an expense.';
      return;
    }

    const userId = this.getUserIdFromToken(token);
    this.newExpense.userId = userId; // Add userId to expense data

    this.http.post('http://localhost:7044/api/Expenses', this.newExpense).subscribe({
      next: (data: any) => {
        this.expenses.push(data);
        this.newExpense = { description: '', amount: 0, date: new Date().toISOString(), categoryId: null, userId: '' };
        this.notification = 'Expense added successfully!';
        this.updateChartData();  
        this.checkBudgetExceeded();
      },
      error: () => {
        this.notification = 'Error adding expense.';
      },
    });
  }

  deleteExpense(expenseId: number) {
    this.http.delete(`http://localhost:7044/api/Expenses/${expenseId}`).subscribe({
      next: () => {
        this.expenses = this.expenses.filter((exp) => exp.id !== expenseId);
        this.notification = 'Expense deleted successfully!';
        this.updateChartData();  
        this.checkBudgetExceeded();
      },
    });
  }

  getUserIdFromToken(token: string): string {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const user = JSON.parse(decoded);
    return user.sub; // Assuming user ID is stored in the 'sub' claim
  }

  // Update chart data based on categorized expenses
  updateChartData() {
    const categoryTotals: { [key: string]: number } = {
      'Food': 0,
      'Transport': 0,
      'Entertainment': 0,
      'Other': 0,
    };

    // Sum expenses by category
    for (let expense of this.expenses) {
      const categoryName = this.categories.find((cat) => cat.id === expense.categoryId)?.name;
      if (categoryName) {
        categoryTotals[categoryName] += expense.amount;
      }
    }

    // Update the chart data
    this.chartData.labels = Object.keys(categoryTotals);
    this.chartData.datasets[0].data = Object.values(categoryTotals);
  }

  // Calculate the total spent and remaining budget
  getTotalSpent(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  getRemainingBudget(): number {
    return this.registerModel.budget - this.getTotalSpent();
  }

  getProgressBarWidth(): string {
    const spent = this.getTotalSpent();
    return `${(spent / this.registerModel.budget) * 100}%`;
  }

  checkBudgetExceeded() {
    if (this.getTotalSpent() > this.registerModel.budget) {
      alert(`Warning: You have exceeded your monthly budget of $${this.registerModel.budget}!`);
    }
  }
}
