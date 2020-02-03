function eventController(Event) {
  function createLog(req, res) {
    const newEvent = new Event(req.body);
    newEvent.save();
    return res.status(201).json(newEvent);
  }
  function lsLog(req, res) {
    const { query } = req;
    Event.find(query, (err, events) => {
      if (err) {
        return res.send(err);
      }
      return res.json(events);
    });
  }
  function date(req, res) {
    Event.find({
      date: {
        $gte: new Date('2020-01-25'),
        $lt: new Date('2020-03-25'),
      },
    }, (err, events) => {
      if (err) {
        return res.send(err);
      }
      return res.json(events);
    });
  }
  function getLogsByUserId(req, res) {
    Event.findById(req.params.identfier, (err, events) => {
      if (err) {
        return res.send(err);
      }
      return res.json(events);
    });
  }
  function showOneLog(req, res) {
    Event.findById(req.params.logid, (err, log) => {
      if (err) {
        return res.send(err);
      }
      return res.json(log);
    });
  }
  function editLog(req, res) {
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
  }
  function deleteLog(req, res) {
    Event.findById(req.params.logid).remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  }
  return { createLog, lsLog, date, getLogsByUserId, showOneLog, editLog, deleteLog };
}


module.exports = eventController;
