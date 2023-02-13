using Rugal.MVC.UILibraryCore.Model;
using Rugal.MVC.ApiLibrary.Model;
using Rugal.MVC.ApiLibrary.Pages.Controllers;
using Rugal.MVC.VcLibrary.Model;

namespace Rugal.MVC.VcLibrary.Pages.Controllers
{
    public partial class VcLibraryController : ApiLibraryController
    {
        internal readonly VcLibrarySetting VcSetting;

        public VcLibraryController(
            IWebHostEnvironment _WebHostEnvironment,
            ApiLibrarySetting _ApiSetting,
            LibraryLayoutModel _LayoutModel,
            VcLibrarySetting _VcSetting) : base(_WebHostEnvironment, _ApiSetting, _LayoutModel)
        {
            VcSetting = _VcSetting;

            LayoutModel = new LibraryLayoutModel()
            {
                LayoutPath = _LayoutModel.LayoutPath,
                Enable_ApiLibrary = true,
                Enable_VcController = true,
                Enable_VcEditor = true,
                ApiLibraryRoute = "/VcLibrary/ApiLibrary",
                VcControllerRoute = "/VcLibrary/VcController",
                VcEditorRoute = "/VcLibrary/VcEditor"
            };
        }
    }
}
