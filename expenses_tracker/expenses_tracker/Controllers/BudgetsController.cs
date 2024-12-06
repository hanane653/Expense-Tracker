using Microsoft.AspNetCore.Mvc;
using expenses_tracker.Models;
using expenses_tracker.Data;
using System.Linq;

namespace expenses_tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BudgetsController(AppDbContext context)
        {
            _context = context;
        }

        // Add or Update User's Budget
        [HttpPost]
        public IActionResult AddOrUpdateBudget(Budget budget)
        {
            if (budget == null || budget.Amount <= 0 || string.IsNullOrEmpty(budget.UserId))
            {
                return BadRequest("Invalid budget data.");
            }

            var existingBudget = _context.Budgets.FirstOrDefault(b => b.UserId == budget.UserId);
            if (existingBudget == null)
            {
                _context.Budgets.Add(budget);
            }
            else
            {
                existingBudget.Amount = budget.Amount;
                _context.Budgets.Update(existingBudget);
            }

            _context.SaveChanges();
            return Ok(budget);
        }

        // Get Budget by User ID
        [HttpGet("{userId}")]
        public IActionResult GetBudget(string userId)
        {
            var budget = _context.Budgets.FirstOrDefault(b => b.UserId == userId);
            if (budget == null)
            {
                return NotFound("Budget not found.");
            }

            return Ok(budget);
        }

        // Check if expenses exceed budget
        [HttpGet("check/{userId}")]
        public IActionResult CheckBudgetExceeded(string userId)
        {
            var budget = _context.Budgets.FirstOrDefault(b => b.UserId == userId);
            if (budget == null)
            {
                return NotFound("Budget not found.");
            }

            var totalSpent = _context.Expenses.Where(e => e.UserId == userId).Sum(e => e.Amount);
            var exceeded = totalSpent > budget.Amount;

            return Ok(new
            {
                BudgetExceeded = exceeded,
                TotalSpent = totalSpent,
                BudgetAmount = budget.Amount,
                RemainingBudget = budget.Amount - totalSpent,
                Message = exceeded ? "Your expenses have exceeded the budget!" : "You are within the budget."
            });
        }
    }
}
