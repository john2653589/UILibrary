using Microsoft.AspNetCore.Mvc;
using Rugal.MVC.ApiLibrary.Pages.Controllers;
using Rugal.MVC.VcLibrary.Model;

namespace Rugal.MVC.VcLibrary.Pages.Controllers
{
    public partial class VcLibraryController : ApiLibraryController
    {
        public override IActionResult Index()
        {
            return Redirect("/VcLibrary/VcEditor");
        }

        public IActionResult VcEditor()
        {
            return View(GetViewPath(VcSetting, "VcEditor"), LayoutModel);
        }

        [HttpGet]
        public IActionResult GetComponent(string ComponentName)
        {
            return ViewComponent(ComponentName);
        }

        [HttpGet]
        public dynamic GetAllComponents()
        {
            var FilePath = $"{WebHostEnvironment.ContentRootPath}/{VcSetting.VcComponentsPath}";
            if (!Directory.Exists(FilePath))
                return Array.Empty<string>();

            var AllFileName = Directory.GetFiles(FilePath);
            var Ret = AllFileName
                .Select(Item => new FileInfo(Item))
                .Where(Item => Item.Extension.ToLower() == ".cshtml")
                .Select(Item =>
                {
                    var FileName = Item.Name.Replace(Item.Extension, "");
                    return FileName;
                })
                .Where(Item => Item != "");

            return Ret;
        }

        [HttpPost]
        public dynamic SaveComponentView([FromBody] SaveComponentViewModel Model)
        {
            var FilePath = $"{WebHostEnvironment.ContentRootPath}/{VcSetting.VcComponentsPath}/{Model.ComponentName}.cshtml";

            if (System.IO.File.Exists(FilePath))
            {
                System.IO.File.WriteAllLines(FilePath, new string[] { Model.Html });
            }

            return true;
        }

    }
}
