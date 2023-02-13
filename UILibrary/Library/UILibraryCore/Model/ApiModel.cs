﻿namespace Rugal.MVC.UILibraryCore.Model
{
    public class ApiGroup
    {
        public string GroupName { get; set; }
        public List<Api> Apis { get; set; } = new List<Api>();
    }
    public class Api
    {
        public string ApiKey { get; set; }
        public string Url { get; set; }
        public string Describe { get; set; }
    }

    public class DeleteApiModel
    {
        public string GroupName { get; set; }
        public string ApiKey { get; set; }
    }
}
