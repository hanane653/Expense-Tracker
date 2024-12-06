using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace expenses_tracker.Models
{
    public class User : IdentityUser
    {

     
        public string FullName { get; set; }
        
        
        public double Budget { get; set; }
        public ICollection<Expense> Expenses { get; set; }
    }
}
