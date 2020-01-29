const express = require('express');

function eventRouter(Event) {
  const EvRouter = express.Router();
  EvRouter.route('/logs')
    .post((req, res) => { // Create new log
      const newEvent = new Event(req.body);
      newEvent.save();
      return res.status(201).json(newEvent);
    })
    .get((req, res) => { // List all logs
      const { query } = req;
      Event.find(query, (err, events) => {
        if (err) {
          return res.send(err);
        }
        return res.json(events);
      });
    });

  EvRouter.route('/logs/?userid=identifier')
    .get((req, res) => { // List all logs by userID
      Event.findById(req.params.identfier, (err, events) => {
        if (err) {
          return res.send(err);
        }
        return res.json(events);
      });
    });
  EvRouter.route('/logs/:logid')
    .get((req, res) => { // List list particular log
      Event.findById(req.params.logid, (err, log) => {
        if (err) {
          return res.send(err);
        }
        return res.json(log);
      });
    })
    .put((req, res) => { // Make changes in particular log
      Event.findById(req.params.logid, (err, log) => {
        if (err) {
          return res.send(err);
        }
        log.date = req.body.date;
        log.userid = req.body.userid;
        log.evenDescription = req.body.evenDescription;
        log.save();
        return res.json(log);
      });
    })
    .delete((req, res) => { // Delete particular log
      Event.findById(req.params.logid).remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });
  EvRouter.route('/user/delId')// get user by ID handler
    .delete((req, res) => {
      const tempId = req.params.delId;
      Event.findByIdAndRemove({ userid: tempId });
      return res.sendStatus(204);
    });

  return EvRouter;
}

module.exports = eventRouter;
