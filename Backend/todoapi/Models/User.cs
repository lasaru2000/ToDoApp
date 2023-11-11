using System;
using System.ComponentModel.DataAnnotations;
using BCrypt.Net;

namespace todoapi.Models
{
    public class User
    {
        [Key]
        public Guid id { get; set; }
        public string name { get; set; }
        public string password { get; set; }

 
    }
}
