namespace Rugal.MVC.UILibraryCore.Model
{
    public partial class LibraryPageSetting
    {
        public string ContentRootPath { get; set; }
        public string PagePath => $"{ContentRootPath}/Pages";
        public string ViewsPath => $"{PagePath}/Views";
    }

    public partial class LibraryLayoutModel
    {
        public string LayoutPath { get; set; }
        public string ContentRootPath { get; set; }

        public bool Enable_VcEditor { get; set; }
        public string VcEditorRoute { get; set; }

        public bool Enable_VcController { get; set; }
        public string VcControllerRoute { get; set; }

        public bool Enable_ApiLibrary { get; set; }
        public string ApiLibraryRoute { get; set; }
    }
}