using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using todoapi.data;
using todoapi.Models;
using System.Data;
using System.Threading.Tasks;

namespace todoapi.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }
        //Get :api/user/name/password
        // login 
        [HttpPost("login")]

        public async Task <IActionResult> VerifyUser(User user)
        { //check username exist in databse
            var existingUser = _context.Users.SingleOrDefault(u => u.name == user.name);

            if (existingUser == null)
            {
                // if not exist
                return BadRequest(new {message = "Username or Password Incorrect" });
            }

            // get entered password and verify using bycrypt 
            var userid = existingUser.id;
            string inputPassword = user.password;
            var username = existingUser.name;

            if (BCrypt.Net.BCrypt.Verify(inputPassword, existingUser.password))
            {
                return Ok(new {userid,username,message = "Login Sucess" });
                
            }
            return BadRequest(new {message = "Username or Password Incorrect" });

        }

        //Post:api/user
        //signup
        [HttpPost("signup")]
        public async Task<IActionResult> AddUser(User user)
        {
            // check  username already exist in database
            var existingUser = _context.Users.SingleOrDefault(u => u.name == user.name);

            if (existingUser != null )
            {
                //if username already exist
                return BadRequest(new { message = "Use another username" });
            }
            if (ModelState.IsValid)
            {
                //unique identifier
                user.id = Guid.NewGuid();

                // Hash the user's password before storing it in the database
                string plainTextPassword = user.password; // Get the plain text password from the user model
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);
                user.password = hashedPassword; // Store the hashed password in the User model

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new {  message = "Success" });
            }
            return BadRequest(ModelState);
        }


        //helper method to find user name exist

        private bool UsernameExist (string name)
        {
            return _context.Users.Any (u => u.name == name);
        }


    }
}

