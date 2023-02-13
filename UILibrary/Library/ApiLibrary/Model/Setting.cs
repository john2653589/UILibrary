using Rugal.MVC.UILibraryCore.Model;

namespace Rugal.MVC.ApiLibrary.Model
{
    public partial class ApiLibrarySetting : LibraryPageSetting
    {
        public string ApiJsPath { get; set; } = "wwwroot/ApiLibrary/Api.js";
    }
}
