import resources from './resources';

const express = require('express');
const app = express();
app.locals.resources = [];
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Code Book';

app.locals.resources = resources

app.get('/api/v1/resources', (request, response) => {
  const resources = app.locals.resources;

  response.json({ resources });
});

app.get('/api/v1/resources/:id', (request, response) => {
  const { id } = request.params;

  const resource = app.locals.resources.find(resource => resource.id === parseInt(id));
  if (!resource) {
    return response.sendStatus(404);
  }

  response.status(200).json(resource);
});

app.post('/api/v1/resources', (request, response) => {
  const id = Date.now();
  const resource = request.body;

  for (let requiredParameter of ['name', 'details', 'link', 'intention']) {
    if (!resource[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, details: <String>, link: <String>, intention: <String> }. You're missing a "${requiredParameter}" property.` });
      return
    }
  }

  const { name, details, type, link } = resource;
  app.locals.resources.push({ id, name, details, intention, type, link});
  response.status(201).json({ id, name, details, intention, type, link});
});

app.delete('/api/v1/resources/:id', (request, response) => {
  const { id } = request.params;

  const resourceToDelete = app.locals.resources.find((resource) => {
    return resource.id === parseInt(id)
  });

  if (!resourceToDelete) {
    return response.sendStatus(404);
  }

  const filteredResources = app.locals.resources.filter(resource => resource.id != id);

  app.locals.resources = filteredResources

  response.sendStatus(204);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app