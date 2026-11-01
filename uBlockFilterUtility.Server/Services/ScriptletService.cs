using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using uBlockFilterUtility.DbContexts;
using uBlockFilterUtility.Entities;
using uBlockFilterUtility.Models;

namespace uBlockFilterUtility.Services
{
    public class ScriptletService
    {
        private readonly IDbContextFactory<uBlockContext> _dbContextFactory;

        public ScriptletService(IDbContextFactory<uBlockContext> factory)
        {
            _dbContextFactory = factory;
        }

        #region CRUD

        public async Task<ScriptletModel> Add(string scriptlet)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                var addition = context.Add(new Scriptlet
                {
                    Name = "_DEFAULT_",
                    Template = scriptlet
                });

                await context.SaveChangesAsync();

                return MapEntityToModel(addition.Entity);
            }
        }

        public async Task<ScriptletModel> Update(string scriptlet)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                var entity = context.Scriptlets.FirstOrDefault();

                if (entity == null)
                {
                    return await Add(scriptlet);
                }

                entity.Template = scriptlet;
                context.Update(entity);
                await context.SaveChangesAsync();

                return MapEntityToModel(entity);
            }
        }

        public async Task<bool> Delete(int id)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                return await context.Scriptlets
                    .Where(entry => entry.Id == id)
                    .ExecuteDeleteAsync()
                    .ContinueWith(task => task.IsCompletedSuccessfully && task.Result > 0);
            }
        }

        public async Task<ScriptletModel?> Get(int id)
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                var entity = await context.Scriptlets.FindAsync(id);

                return entity != null ? MapEntityToModel(entity) : null;
            }
        }

        public async Task<IEnumerable<ScriptletModel>> GetList()
        {
            using (var context = _dbContextFactory.CreateDbContext())
            {
                return await context.Scriptlets.Select(entry => MapEntityToModel(entry)).ToListAsync();
            }
        }

        #endregion

        #region Private

        private static ScriptletModel MapEntityToModel(Scriptlet entity)
        {
            return new ScriptletModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Template = entity.Template
            };
        }

        #endregion
    }
}
