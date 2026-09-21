using Microsoft.AspNetCore.Mvc;
using uBlockFilterUtility.Models;
using uBlockFilterUtility.Services;

namespace uBlockFilterUtility.Server.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class FilterController : ControllerBase
    {
        private readonly FilterService _filterService;

        public FilterController(FilterService filterService)
        {
            _filterService = filterService;
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
        public async Task<IActionResult> Filter([FromQuery]int id)
        {
            return new JsonResult(await _filterService.Delete(id));
        }

        [HttpGet]
        public async Task<IActionResult> Preview([FromQuery] int id)
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

            return new FileContentResult(System.Text.Encoding.ASCII.GetBytes(contents), "text/plain");
        }
    }
}
