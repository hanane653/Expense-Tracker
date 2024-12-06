using Microsoft.AspNetCore.Mvc;
using expenses_tracker.Models;
using expenses_tracker.Data;
using Microsoft.EntityFrameworkCore;

namespace expenses_tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

        // Add a new expense
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            if (expense == null)
            {
                return BadRequest(new { error = "Expense data is required." });
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(expense.Description) ||
                expense.Amount <= 0 ||
                expense.CategoryId <= 0 ||
                string.IsNullOrWhiteSpace(expense.UserId))
            {
                return BadRequest(new { error = "Invalid expense data." });
            }

            // Set the current date if none is provided
            expense.Date = expense.Date == default ? DateTime.UtcNow : expense.Date;

            // Add the expense to the database
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        // Get a list of all expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            return await _context.Expenses.ToListAsync();
        }

        // Get a single expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // Delete an expense by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Update an expense
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, Expense expense)
        {
            if (id != expense.Id)
            {
                return BadRequest();
            }

            _context.Entry(expense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ExpenseExists(int id)
        {
            return _context.Expenses.Any(e => e.Id == id);
        }
    }
}
