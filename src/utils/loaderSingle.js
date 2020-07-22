const DataLoader = require('dataloader');

class Single {
  constructor() {
    this.loaders = {};
  }

  load(model, id) {
    const loader = this.findLoader(model);
    return loader.load(id);
  }
  findLoader(model) {
    if (!this.loaders[model]) {
      this.loaders[model] = new DataLoader(async (ids) => {
        const rows = await model.find().where('_id', ids);
        const lookup = rows.reduce((acc, row) => {
          acc[row.id] = row;
          return acc;
        }, {});

        return ids.map((id) => lookup[id] || null);
      });
    }
    return this.loaders[model];
  }
}

module.exports = Single;
