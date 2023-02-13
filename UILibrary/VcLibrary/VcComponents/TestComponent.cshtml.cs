using Microsoft.AspNetCore.Mvc;
using Rugal.MVC.VcLibrary.Extention.Common;

namespace UILibrary.ViewComponents
{
    public class TestComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(string Param1)
        {
            return this.ClassInvoke(Param1);
        }

    }
}
