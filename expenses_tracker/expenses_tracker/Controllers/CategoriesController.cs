using Microsoft.AspNetCore.Mvc;
using expenses_tracker.Models;
using expenses_tracker.Data;
using Microsoft.EntityFrameworkCore;

namespace expenses_tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // Add a new category
        [HttpPost]
        public async Task<ActionResult<Category>> AddCategory(Category category)
        {
            if (category == null)
            {
                return BadRequest("Category data is required.");
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // Get a list of all categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // Get a single category by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
    }
}
