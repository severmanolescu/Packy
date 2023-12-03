using Microsoft.AspNetCore.Mvc;
using Packy.Models;
using System.Diagnostics;

namespace Packy.Controllers
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

        public IActionResult SignUp()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult NewOrder()
        {
            return View();
        }

        public IActionResult ViewOrder()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult UserInfo()
        {
            return View();
        }

        public IActionResult ADM_EditOrder()
        {
            return View();
        }

        public IActionResult ADM_AddDriver()
        {
            return View();
        }

        public IActionResult ADM_DriverInfo()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}