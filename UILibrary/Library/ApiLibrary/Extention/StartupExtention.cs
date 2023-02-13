using Rugal.MVC.ApiLibrary.Model;
using Rugal.MVC.UILibraryCore.Extention.Startup;

namespace Rugal.MVC.ApiLibrary.Extention.Startup
{
    public static class StartupExtention
    {
        public static IServiceCollection AddApiLibrary(this IServiceCollection Services,
            string ContentRootPath = "Library/ApiLibrary",
            string ApiJsPath = "wwwroot/ApiLibrary/Api.js")
        {
            var ApiSetting = new ApiLibrarySetting()
            {
                ApiJsPath = ApiJsPath.TrimEnd('/'),
                ContentRootPath = ContentRootPath.TrimEnd('/'),
            };
            Services.AddApiLibrary(ApiSetting);
            return Services;
        }
        public static IServiceCollection AddApiLibrary(this IServiceCollection Services,
           ApiLibrarySetting ApiSetting)
        {
            Services.AddLibraryCore();
            Services.AddSingleton(ApiSetting);
            return Services;
        }
    }
}