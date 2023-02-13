using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using UILibrary.Models;

namespace UILibrary.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }


    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TestController : ControllerBase
    {
        [HttpPost]
        public dynamic TestPost(TestPostModel Model)
        {
            return Model;
        }

        [HttpGet]
        public dynamic TestGet(string Id, string Title)
        {
            return new
            {
                Id = "ABC",
                Title = "哈哈哈",
            };
        }
    }

    public class TestPostModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
    }

}