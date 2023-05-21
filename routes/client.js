const Client = require('../model/client');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

const clientRouter = (app, io) => {
    router.use(bodyParser.json());
  // middleware for uploading images
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/mouhi/Desktop/node/uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  // GET clients
  router.get('/', async (req, res) => {
    try {
      const clients = await Client.find();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // add a client
  router.post('/', upload.single('image'), async (req, res) => {
    const client = new Client({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      image: req.file.path,
      phone: req.body.phone,
      address: req.body.address,
      birthdate: req.body.birthdate
    });

    try {
      const newClient = await client.save();
      io.emit('userAdded', "a new user has been added");
      res.status(201).json(newClient);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a client
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updatedClient = await Client.findByIdAndUpdate(
        id,req.body,
        { new: true } // Set the `new` option to true to return the updated client
      );
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(updatedClient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // Delete a client
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const removedClient = await Client.findByIdAndDelete(id);
            if (!removedClient) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json(removedClient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
  // Get a client
    router.get('/:id', (req, res) => {
        const { id } = req.params;
        Client.findById(id)
            .then((client) => {
                if (!client) {
                    return res.status(404).json({ message: 'Client not found' });
                }
                res.json(client);
            })
            .catch((error) => {
                res.status(500).json({ message: error.message });
            });
    });
  // Register the router middleware
 
  return router;
};

module.exports = clientRouter;
