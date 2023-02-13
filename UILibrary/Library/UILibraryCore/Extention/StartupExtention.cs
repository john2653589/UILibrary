
using Rugal.MVC.UILibraryCore.Model;

namespace Rugal.MVC.UILibraryCore.Extention.Startup
{
    public static class StartupExtention
    {
        public static IServiceCollection AddLibraryCore(this IServiceCollection Services, string LayoutPath = @"Library/UILibraryCore/Pages/Layout/_VcLayout.cshtml")
        {
            Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });

            Services.AddSingleton((ServiceProvider) =>
            {
                var LayoutSetting = new LibraryLayoutModel()
                {
                    LayoutPath = LayoutPath,
                };
                return LayoutSetting;
            });

            return Services;
        }
    }
}