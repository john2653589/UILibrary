
using Microsoft.Extensions.FileProviders;
using Rugal.MVC.UILibraryCore.Model;

namespace Rugal.MVC.UILibraryCore.Extention.Startup
{
    public static class StartupExtention
    {
        public static IServiceCollection AddLibraryCore(this IServiceCollection Services,
            string LayoutPath = "Library/UILibraryCore/Pages/Layout/_VcLayout.cshtml",
            string ContentRootPath = "Library/UILibraryCore")
        {
            Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });

            Services.AddSingleton((ServiceProvider) =>
            {
                var LayoutSetting = new LibraryLayoutModel()
                {
                    ContentRootPath = ContentRootPath,
                    LayoutPath = LayoutPath,
                };
                return LayoutSetting;
            });

            return Services;
        }

        public static void UseUILibrary(this WebApplication App)
        {
            var Setting = App.Services.GetService<LibraryLayoutModel>();

            App.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(App.Environment.ContentRootPath, $"{Setting.ContentRootPath}/Pages/js")),
                RequestPath = $"/{Setting.ContentRootPath}/Pages/js"
            });
        }
    }
}