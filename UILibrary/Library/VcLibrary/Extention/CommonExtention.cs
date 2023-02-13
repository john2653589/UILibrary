using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;

namespace Rugal.MVC.VcLibrary.Extention.Common
{
    public static class VcComponentExtention
    {
        public static IViewComponentResult ClassInvoke(this ViewComponent VcComponent, object Param = null)
        {
            var ComponentName = VcComponent.GetType().Name;
            return VcComponent.View($"/VcLibrary/VcComponents/{ComponentName}.cshtml", Param);
        }
    }

    public static class ComponentHelperExtention
    {
        public static Task<IHtmlContent> InvokeAsync(this IViewComponentHelper Component, Enum ComponentType)
        {
            var ComponentName = ComponentType.ToString();
            return Component.InvokeAsync(ComponentName, null);
        }
    }
}
