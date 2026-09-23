using Jering.Javascript.NodeJS;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using uBlockFilterUtility.DbContexts;
using uBlockFilterUtility.Entities;
using uBlockFilterUtility.Models;
using uBlockFilterUtility.Server.Settings;

namespace uBlockFilterUtility.Services
{
    public class FilterService
    {
        private readonly IDbContextFactory<uBlockContext> _dbContextFactory;
        private readonly AppSettings _settings;
        private readonly INodeJSService _nodeService;

        public FilterService(IDbContextFactory<uBlockContext> factory, IOptions<AppSettings> settings, INodeJSService nodeService)
        {
            _dbContextFactory = factory;
            _settings = settings.Value;
            _nodeService = nodeService;
        }

        #region CRUD

        public async Task<FilterModel> Add(FilterModel model)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                var addition = context.Add(new Filter
                {
                    Name = model.Name,
                    Template = model.Template,
                    ParametersJson = JsonConvert.SerializeObject(model.Parameters)
                });

                await context.SaveChangesAsync();

                return MapEntityToModel(addition.Entity);
            }
        }

        public async Task<FilterModel> Update(FilterModel model)
        {
            if (!model.Id.HasValue)
            {
                throw new ArgumentNullException(nameof(model.Id));
            }

            using (var context = _dbContextFactory.CreateDbContext())
            {
                var modification = context.Update(new Filter
                {
                    Id = model.Id.Value,
                    Name = model.Name,
                    ParametersJson = JsonConvert.SerializeObject(model.Parameters),
                    Template = model.Template
                });

                await context.SaveChangesAsync();

                return MapEntityToModel(modification.Entity);
            }
        }

        public async Task<bool> Delete(int id)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                return await context.Filters
                    .Where(entry => entry.Id == id)
                    .ExecuteDeleteAsync()
                    .ContinueWith(task => task.IsCompletedSuccessfully && task.Result > 0);
            }
        }

        public async Task<FilterModel?> Get(int id)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                var entity = await context.Filters.FindAsync(id);

                return entity != null ? MapEntityToModel(entity) : null;
            }
        }

        public async Task<IEnumerable<FilterModel>> GetList()
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                return await context.Filters.Select(entry => MapEntityToModel(entry)).ToListAsync();
            }
        }

        #endregion

        #region Methods

        public string GenerateFilters(FilterModel model)
        {
            var modifiedTemplate = model.Template;
            var matchedParams = model.Parameters?
                .Where(entry => modifiedTemplate.Contains($"{{{entry.Key}}}"))
                .ToArray() ?? Array.Empty<KeyValuePair<string, string>>();
            var paramKeys = matchedParams.Select(entry => entry.Key).ToArray();
            var paramValues = matchedParams.Select(entry => entry.Value).ToArray();

            foreach (string key in paramKeys)
            {
                modifiedTemplate = modifiedTemplate.Replace(key, paramKeys.IndexOf(key).ToString());
            }

            return string.Format(modifiedTemplate, paramValues);
        }

        public async Task<bool> IsFilterValid(int filterId)
        {
            var filter = await Get(filterId);

            if (filter == null) throw new ArgumentNullException(nameof(filterId));

            var filters = GenerateFilters(filter).Split(new[] { Environment.NewLine, "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);

            return await _nodeService.InvokeFromFileAsync<bool>(_settings.UboCoreNodeJsCommand, "isValid", args: [filters]);
        }


        #endregion

        #region Private

        private static FilterModel MapEntityToModel(Filter entity)
        {
            return new FilterModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Template = entity.Template,
                Parameters = !string.IsNullOrWhiteSpace(entity.ParametersJson)
                    ? JsonConvert.DeserializeObject<Dictionary<string, string>>(entity.ParametersJson)!
                    : new Dictionary<string, string>()
            };
        }

        #endregion
    }
}
