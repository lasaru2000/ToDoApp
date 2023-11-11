using Microsoft.AspNetCore.Mvc;
using todoapi.data;
using todoapi.Models;
using System.Threading.Tasks;
using System.Data;

namespace todoapi.Controllers
{
    [Route("api/content")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private readonly DataContext _context;

        public ContentController(DataContext context)
        {
            _context = context;
        }

        // GET: api/content
        //get content from  database according to id 
        [HttpGet("{id}")]
        public IActionResult GetContent(Guid id)
        {
            // find records
            var content = _context.Content.Where(c => c.id == id);
            if (content == null)
            {
                return NotFound();
            }
            return Ok(content);
        }
        //POST :api/content
        //create new reacord in database with content data
        [HttpPost]
        public async Task  <IActionResult> PostContent(Content content)
        {
            if(ModelState.IsValid)
            {
                _context.Content.Add(content);
                await _context.SaveChangesAsync();
                return Ok(content);
            }
            return BadRequest(ModelState);

        }
        //PUT :api/content/id
        // updating existing content data according to id
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateContent(int id, Content content)
        {
            //Check if id exist in table 
            var existContent = await _context.Content.FindAsync(id);
            if (existContent == null)
            {
                return NotFound();
            }
            // if exist update content
            existContent.title = content.title;
            existContent.description = content.description;
            existContent.priority = content.priority;

            //save changes to database

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DBConcurrencyException)
            {
                if (!contentExists(id))
                {
                    return NotFound(id);
                }
                else
                {
                    throw;
                }

               
            }
            return NoContent();


        }
        //helper method to check content exist
        private bool contentExists(int id)
        {
            return _context.Content.Any(e => e.contentId == id);
        }

        //DELETE : api/content/id
        //delete record from database according to id
        [HttpDelete("{id}")]

        public async Task <IActionResult> DeleteContent (int id)
        {
            //search if id exists
            var content = await _context.Content.FindAsync(id);
            if (content == null)
            {
                return NotFound();
            }
            //save changes in database 
            _context.Content.Remove(content);
            await _context.SaveChangesAsync();
            return NoContent();

        }

    }
}
