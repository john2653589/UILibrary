using Microsoft.AspNetCore.Mvc;
using Rugal.MVC.ApiLibrary.Pages.Controllers;

namespace Rugal.MVC.VcLibrary.Pages.Controllers
{
    public partial class VcLibraryController : ApiLibraryController
    {
        public IActionResult VcController()
        {
            return View(GetViewPath(VcSetting, "VcController"), LayoutModel);
        }
    }
}
