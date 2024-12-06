using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using expenses_tracker.Models;
using expenses_tracker.Data;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace expenses_tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthenticationController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterModel model)
        {
            // Initialiser l'utilisateur avec FullName et Budget
            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName, // Ajout du FullName
                Budget = model.Budget      // Ajout du Budget
            };

            // Enregistrement de l'utilisateur
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { userId = user.Id, message = "User registered successfully." });

        }


        // User login
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Generate JWT token for the user
            var token = GenerateJwtToken(user);

            return Ok(new { token, userId = user.Id });
        }

        // Generate JWT Token
        private string GenerateJwtToken(User user)
        {
            // Ensure your key is at least 256 bits (32 bytes) long
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKey1234567890!@#$%^&*()_+")); // 256-bit key

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("FullName", user.FullName) // Custom claim
    };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "YourApp",
                audience: "YourApp",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; } // Assurez-vous qu'il est marqué comme requis

        
        public double Budget { get; set; }  // Vous pouvez ajouter une validation de budget ici
    }


    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
