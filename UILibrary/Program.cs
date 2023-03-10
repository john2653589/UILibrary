using Microsoft.Extensions.FileProviders;
using Rugal.MVC.ApiLibrary.Extention.Startup;
using Rugal.MVC.UILibraryCore.Extention.Startup;
using Rugal.MVC.VcLibrary.Extention.Startup;
using System.Text.Encodings.Web;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddControllersWithViews()
    .AddRazorRuntimeCompilation()
    ;

#region Add UILibrary
builder.Services.AddVcLibrary();
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

#region Use UILibrary
app.UseUILibrary();
#endregion

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

