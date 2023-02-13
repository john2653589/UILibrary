
using Rugal.MVC.ApiLibrary.Extention.Startup;
using Rugal.MVC.ApiLibrary.Model;
using Rugal.MVC.VcLibrary.Model;

namespace Rugal.MVC.VcLibrary.Extention.Startup
{
    public static class StartupExtention
    {
        public static IServiceCollection AddVcLibrary(this IServiceCollection Services,
            string ApiJsPath = "wwwroot/ApiLibrary/Api.js",
            string VcComponentsPath = "VcLibrary/VcComponents",
            string VcContentRootPath = "Library/VcLibrary",
            string ApiContentRootPath = "Library/ApiLibrary")
        {
            var VcSetting = new VcLibrarySetting()
            {
                ContentRootPath = VcContentRootPath.TrimEnd('/'),
                VcComponentsPath = VcComponentsPath.TrimEnd('/'),
            };
            var ApiSetting = new ApiLibrarySetting()
            {
                ContentRootPath = ApiContentRootPath.TrimEnd('/'),
                ApiJsPath = ApiJsPath.TrimEnd('/'),
            };
            Services.AddVcLibrary(VcSetting, ApiSetting);
            return Services;
        }

        public static IServiceCollection AddVcLibrary(this IServiceCollection Services,
            VcLibrarySetting VcSetting, ApiLibrarySetting ApiSetting)
        {
            Services.AddApiLibrary(ApiSetting);
            Services.AddSingleton(VcSetting);
            return Services;
        }

    }
}