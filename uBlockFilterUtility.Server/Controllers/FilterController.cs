using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using System.Text.Json.Nodes;
using uBlockFilterUtility.Models;
using uBlockFilterUtility.Server.Settings;
using uBlockFilterUtility.Services;

namespace uBlockFilterUtility.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]/{id?}")]
    public class FilterController : ControllerBase
    {
        private readonly FilterService _filterService;
        private readonly AppSettings _appSettings;
        private readonly ScriptletService _scriptletService;

        public FilterController(FilterService filterService, IOptions<AppSettings> appSettings, ScriptletService scriptletService)
        {
            _filterService = filterService;
            _appSettings = appSettings.Value;
            _scriptletService = scriptletService;
        }

        [HttpGet]
        public async Task<IActionResult> Filters()
        {
            return new JsonResult(await _filterService.GetList());
        }

        [HttpPost]
        public async Task<IActionResult?> Filter([FromBody]FilterModel model)
        {
            if (model != null)
            {
                if (model.Id.HasValue)
                {
                    return new JsonResult(await _filterService.Update(model));
                }
                else
                {
                    return new JsonResult(await _filterService.Add(model));
                }
            }

            return null;
        }

        [HttpDelete]
        public async Task<IActionResult> Filter(int id)
        {
            return new JsonResult(await _filterService.Delete(id));
        }

        [HttpGet]
        public async Task<IActionResult> Preview(int id)
        {
            var filter = await _filterService.Get(id);
            return new JsonResult(filter != null
                ? _filterService.GenerateFilters(filter)
                : null
            );
        }

        [HttpGet]
        public async Task<IActionResult> Generate()
        {
            var contents = await _filterService.GetList()
                .ContinueWith(task => 
                    string.Join(Environment.NewLine, task.Result.Select(m => _filterService.GenerateFilters(m)))
                );

            Response.Headers.CacheControl = "no-cache";
            Response.Headers.Expires = "0";
            return new FileContentResult(System.Text.Encoding.ASCII.GetBytes(contents), "text/plain");
        }

        [HttpGet]
        public async Task<IActionResult> IsFilterValid(int id)
        {
            bool isValid = await _filterService.IsFilterValid(id);
            return new JsonResult(isValid);
        }

        [HttpGet]
        public async Task<IActionResult> GetAppConfig()
        {
            var config = new
            {
                UpdateListsUrl = $"{_appSettings.UpdateListsUrl}{_appSettings.ListKeysCsv}"
            };

            return new JsonResult(config);
        }

        [HttpGet]
        public async Task<IActionResult> Scriptlet()
        {
            var scriptlets = await _scriptletService.GetList();
            return new JsonResult(scriptlets.FirstOrDefault());
        }

        [HttpPost]
        public async Task<IActionResult> Scriptlet([FromForm]string scriptlet)
        {
            var model = await _scriptletService.Update(scriptlet);
            return new JsonResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> ScriptletJs()
        {
            var scriptletJs = await _scriptletService
                .GetList()
                .ContinueWith(t => t.Result?.FirstOrDefault()?.Template ?? string.Empty);
            return new FileContentResult(System.Text.Encoding.ASCII.GetBytes(scriptletJs), "text/javascript");
        }
    }
}
