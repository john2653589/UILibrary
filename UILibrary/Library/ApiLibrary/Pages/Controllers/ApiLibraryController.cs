using Microsoft.AspNetCore.Mvc;
using Rugal.MVC.ApiLibrary.Model;
using Rugal.MVC.UILibraryCore.Model;
using System.Text;
using System.Text.RegularExpressions;

namespace Rugal.MVC.ApiLibrary.Pages.Controllers
{
    public partial class ApiLibraryController : Controller
    {
        internal readonly IWebHostEnvironment WebHostEnvironment;
        internal readonly ApiLibrarySetting ApiSetting;
        internal LibraryLayoutModel LayoutModel;
        public ApiLibraryController(
            IWebHostEnvironment _WebHostEnvironment,
            ApiLibrarySetting _ApiSetting,
            LibraryLayoutModel _LayoutModel)
        {
            WebHostEnvironment = _WebHostEnvironment;
            ApiSetting = _ApiSetting;
            LayoutModel = new LibraryLayoutModel()
            {
                LayoutPath = _LayoutModel.LayoutPath,
                Enable_ApiLibrary = true,
                ApiLibraryRoute = "/ApiLibrary/ApiLibrary"
            };
        }

        public virtual IActionResult Index()
        {
            return Redirect(LayoutModel.ApiLibraryRoute);
        }

        public IActionResult ApiLibrary()
        {
            return View(GetViewPath(ApiSetting, "ApiLibrary"), LayoutModel);
        }

        [HttpGet]
        public dynamic List_AllApi() => ReadApiFromJs();

        [HttpPost]
        public dynamic DeleteApi([FromBody] DeleteApiModel Model)
        {
            var AllApi = ReadApiFromJs();
            var GetGroup = AllApi.FirstOrDefault(Item => Item.GroupName == Model.GroupName);
            var GetApi = GetGroup.Apis.FirstOrDefault(Item => Item.ApiKey == Model.ApiKey);
            GetGroup.Apis.Remove(GetApi);

            SaveApiToJs(AllApi);
            return true;
        }

        [HttpPost]
        public dynamic SaveApi([FromBody] List<ApiGroup> Model)
        {
            SaveApiToJs(Model);
            return true;
        }

        internal void SaveApiToJs(List<ApiGroup> Apis)
        {
            var ApiJsPath = ApiSetting.ApiJsPath;
            var GroupSpaceText = "    ";
            var ApiSpaceText = "        ";

            var AllGroupText = Apis
                .Select(Group =>
                {
                    var AllApi = Group.Apis.Select(Api =>
                    {
                        var ApiKey = Api.ApiKey;
                        if (Regex.IsMatch(ApiKey.Replace("_", ""), "[^a-zA-Z0-9]") || Regex.IsMatch(ApiKey, "^[0-9]"))
                            ApiKey = $"'{ApiKey}'";

                        var KeyUrlText = $"{ApiSpaceText}{ApiKey}: '{Api.Url}'";
                        var ApiTotalText = KeyUrlText;
                        if (!string.IsNullOrWhiteSpace(Api.ApiDescribe))
                        {
                            var TotalDescribeText = GenerateJsApiDescribe(ApiSpaceText, Api.ApiDescribe);
                            ApiTotalText = $"{TotalDescribeText}\n{ApiTotalText}";
                        }

                        return ApiTotalText;
                    });
                    var ApiText = string.Join(",\r\n", AllApi);
                    var GroupText = $"{GroupSpaceText}{Group.GroupName}: {{\r\n{ApiText}\r\n    }}";

                    if (!string.IsNullOrWhiteSpace(Group.GroupDescribe))
                    {
                        var GroupDescribeText = GenerateJsApiDescribe(GroupSpaceText, Group.GroupDescribe);
                        GroupText = $"{GroupDescribeText}\n{GroupText}";
                    }
                    return GroupText;
                });

            var GroupText = string.Join(",\r\n\r\n", AllGroupText);
            var JsText = $"const Api = {{\r\n{GroupText}\r\n}}";

            System.IO.File.WriteAllText(ApiJsPath, JsText);
        }
        internal string GenerateJsApiDescribe(string SpaceText, string Describe)
        {
            var DescribeText = "";
            if (!string.IsNullOrWhiteSpace(Describe))
            {
                var AllDescribe = Describe
                    .TrimStart('\n', ' ')
                    .TrimEnd('\n', ' ')
                    .Split("\n")
                    .Select(Item => Item.TrimStart(' ').TrimEnd(' '));

                var FirstDescribeText = $"{SpaceText}/** {AllDescribe.First()}";
                var LastDescribe = AllDescribe
                    .Skip(1)
                    .Select(Describe => $"{SpaceText} * {Describe}");

                var LastDescText = "";
                if (LastDescribe.Any())
                    LastDescText = $"\n{string.Join("\n", LastDescribe)}";

                DescribeText = $"{FirstDescribeText}{LastDescText} */";
            }
            return DescribeText;
        }

        internal List<ApiGroup> ReadApiFromJs()
        {
            var ApiJsPath = ApiSetting.ApiJsPath;
            if (!System.IO.File.Exists(ApiJsPath))
                System.IO.File.WriteAllText(ApiJsPath, "const Api = { \n\n }");

            var OrgText = System.IO.File.ReadAllText(ApiJsPath, Encoding.UTF8);
            var ApiVariableName = OrgText.Split(" ")[1];
            var AllText = OrgText
                .TrimStart('\'', '"', ' ')
                .TrimEnd('\'', '"', ' ');

            while (AllText.Contains("\r\n"))
                AllText = AllText.Replace("\r\n", "\n");

            while (AllText.Contains("\n\n"))
                AllText = AllText.Replace("\n\n", "\n");

            var SplitArray = AllText
                .Split("},")
                .SelectMany(Item =>
                    Item.Split("{").Select(Val => Val.TrimStart('{', '}', '\n').TrimEnd('{', '}', '\n')));

            var Groups = new List<ApiGroup> { };
            foreach (var Item in SplitArray.Skip(0))
            {
                var GetClearText = Item
                    .Replace("        ", "")
                    .Replace("    ", "")
                    .TrimEnd(',');

                if (!GetClearText.Contains(':'))
                    continue;

                var ClearArray = GetClearText.Split(',');
                if (ClearArray.Length == 1 && ClearArray
                    .First()
                    .TrimStart(' ')
                    .TrimEnd(' ')
                    .Last() == ':')
                {
                    var GroupName = ClearArray[0]
                        .Replace(":", "");

                    var GroupDescribe = "";
                    if (GroupName.Contains("*/"))
                    {
                        var DesArray = GroupName.Split("*/");
                        GroupName = DesArray[1];
                        GroupDescribe = DesArray[0]
                            .Replace("/** ", "")
                            .Replace(" * ", "")
                            .TrimStart('\r', '\n', ' ')
                            .TrimEnd('\r', '\n', ' ');
                    }
                    GroupName = GroupName
                        .Replace("\r", "")
                        .Replace("\n", "")
                        .Replace(" ", "");

                    var CreateGroup = new ApiGroup()
                    {
                        GroupDescribe = GroupDescribe,
                        GroupName = GroupName,
                        Apis = new List<Api> { },
                    };
                    Groups.Add(CreateGroup);
                    continue;
                }

                foreach (var ApiItem in ClearArray)
                {
                    var ApiKey = ApiItem
                        .Split(':')[0]
                        .Replace(@"""", "")
                        .Replace("'", "");

                    var Describe = "";
                    if (ApiKey.Contains("*/"))
                    {
                        var DesArray = ApiKey.Split("*/");
                        ApiKey = DesArray[1];
                        Describe = DesArray[0]
                            .Replace("/** ", "")
                            .Replace(" * ", "")
                            .TrimStart('\r', '\n', ' ')
                            .TrimEnd('\r', '\n', ' ');
                    }
                    ApiKey = ApiKey
                        .Replace("\r", "")
                        .Replace("\n", "")
                        .Replace(" ", "");

                    if (string.IsNullOrWhiteSpace(ApiKey))
                        continue;

                    var ApiUrl = "";

                    var UrlSplitParam = new[] {
                        $"{ApiKey}:",
                        $"'{ApiKey}':",
                        @$"""{ApiKey}"":"
                    };
                    foreach (var SplitParam in UrlSplitParam)
                    {
                        if (ApiItem.Contains(SplitParam))
                        {
                            ApiUrl = ApiItem.Split(SplitParam)[1];
                            break;
                        }
                    }

                    ApiUrl = ApiUrl
                        .TrimStart('"', '\'', ' ', '\n')
                        .TrimEnd('"', '\'', ' ', '\n');

                    var CreateApi = new Api()
                    {
                        ApiKey = ApiKey,
                        Url = ApiUrl,
                        ApiDescribe = Describe,
                    };
                    Groups.Last().Apis.Add(CreateApi);
                }
            }

            return Groups;
        }
        internal static string GetViewPath(LibraryPageSetting Setting, string ViewName)
        {
            var IndexPath = $"~/{Setting.ViewsPath}/{ViewName}.cshtml";
            return IndexPath;
        }
    }
}
