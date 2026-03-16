const mediaItemSchema = {
  type: 'object',
  required: ['id', 'type', 'title', 'status', 'dateAdded'],
  properties: {
    id: { type: 'string', example: 'abc-123' },
    type: { type: 'string', enum: ['book', 'film'], example: 'book' },
    title: { type: 'string', example: 'Dune' },
    author: { type: 'string', example: 'Frank Herbert', description: 'Books only' },
    director: { type: 'string', example: 'Denis Villeneuve', description: 'Films only' },
    year: { type: 'integer', example: 1965 },
    genre: { type: 'string', example: 'Science Fiction' },
    rating: { type: 'integer', minimum: 1, maximum: 5, example: 5, description: 'Only for completed items' },
    status: { type: 'string', enum: ['completed', 'want'], example: 'completed' },
    notes: { type: 'string', example: 'A classic' },
    coverUrl: { type: 'string', format: 'uri', example: 'https://example.com/cover.jpg' },
    dateAdded: { type: 'string', format: 'date-time' },
    dateCompleted: { type: 'string', format: 'date-time' },
  },
};

const createMediaItemSchema = {
  type: 'object',
  required: ['type', 'title', 'status'],
  properties: {
    type: { type: 'string', enum: ['book', 'film'] },
    title: { type: 'string', example: 'Dune' },
    author: { type: 'string' },
    director: { type: 'string' },
    year: { type: 'integer', example: 1965 },
    genre: { type: 'string' },
    rating: { type: 'integer', minimum: 1, maximum: 5 },
    status: { type: 'string', enum: ['completed', 'want'] },
    notes: { type: 'string' },
    coverUrl: { type: 'string', format: 'uri' },
    dateCompleted: { type: 'string', format: 'date-time' },
  },
};

const updateMediaItemSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['book', 'film'] },
    title: { type: 'string', example: 'Dune' },
    author: { type: 'string' },
    director: { type: 'string' },
    year: { type: 'integer' },
    genre: { type: 'string' },
    rating: { type: 'integer', minimum: 1, maximum: 5 },
    status: { type: 'string', enum: ['completed', 'want'] },
    notes: { type: 'string' },
    coverUrl: { type: 'string', format: 'uri' },
    dateCompleted: { type: 'string', format: 'date-time' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Item not found' },
  },
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The media item ID',
};

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
  },
});

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Media Tracker API',
    version: '1.0.0',
    description: 'REST API for managing books and films in the Media Tracker app.',
  },
  tags: [{ name: 'Items', description: 'Media item operations' }],
  paths: {
    '/api/items': {
      get: {
        tags: ['Items'],
        summary: 'List all items',
        description: 'Returns all media items, optionally filtered by type.',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['book', 'film'] },
            description: 'Filter results by media type',
          },
        ],
        responses: {
          '200': {
            description: 'Array of media items',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/MediaItem' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Items'],
        summary: 'Create a new item',
        description: 'Adds a new book or film. `id` and `dateAdded` are assigned server-side.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateMediaItem' } },
          },
        },
        responses: {
          '201': {
            description: 'Item created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/MediaItem' } },
            },
          },
          '400': errorResponse('Validation error — title is required'),
        },
      },
    },
    '/api/items/{id}': {
      put: {
        tags: ['Items'],
        summary: 'Update an item',
        description: 'Partially updates an existing item by ID.',
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateMediaItem' } },
          },
        },
        responses: {
          '200': {
            description: 'Item updated',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/MediaItem' } },
            },
          },
          '400': errorResponse('Validation error — title cannot be empty'),
          '404': errorResponse('Item not found'),
        },
      },
      delete: {
        tags: ['Items'],
        summary: 'Delete an item',
        description: 'Permanently removes an item by ID.',
        parameters: [idParam],
        responses: {
          '204': { description: 'Item deleted — no content returned' },
          '404': errorResponse('Item not found'),
        },
      },
    },
  },
  components: {
    schemas: {
      MediaItem: mediaItemSchema,
      CreateMediaItem: createMediaItemSchema,
      UpdateMediaItem: updateMediaItemSchema,
      Error: errorSchema,
    },
  },
};
