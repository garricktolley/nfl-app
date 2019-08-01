// List requirement calls - shows module dependencies
const express = require('express');
const app = express();
const Joi = require('joi');

// Begin middleware
app.use(express.json());  // sets the req.body parameter.  doesn't terminate req/res cycle.
app.use(function(req, res, next){
    console.log(`Logging...`)
});


const players = [
    { id:1 ,  name: "player1"},
    {id:2,  name: 'player2'},
    { id:3,  name: "player3"}
];

const team_stats = [
    { id:1, name: "team 1", pts: 17},
    { id: 2, name: "team 2", pts: 21},
    { id: 3, name: "team 3", pts: 170}
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/players', (req, res) => {
    res.send(players);
});

app.post('/api/players', (req, res) => {
    const { error } = validatePlayer(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const player= {
        id: players.length + 1 ,
        name: req.body.name
    };
    players.push(player);
    res.send(player);
});

app.get('/api/players/:id', (req, res) => {
    const player = players.find( playerObject => playerObject.id === parseInt(req.params.id));
    if (!player) return res.status(404).send(`Player with Given ID wasn't Found`)
    res.send(player)
});

app.put('/api/players/:id', (req, res) => {
    // look up course
    // if false, return 404
    const player = players.find( playerObject => playerObject.id === parseInt(req.params.id))
    if (!player) return res.status(404).send( `Player does not exist`)

    // validate
    // if invalid, return 400 error
    const {error} = validatePlayer(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    // update course
    // return updated course
    player.name = req.body.name;
    res.send(player)
})

app.delete('/api/players/:id', (req, res) => {
    const player = players.find( playerObject => playerObject.id === parseInt(req.params.id))
    if (!player) return res.status(404).send(`player does not exist`)

   const index =  players.indexOf(player)
   players.splice(index, 1);

   res.send(player);

});

function validatePlayer(player) {
    const playerSchema = {
        name: Joi.string().min(3).required()
    }
    return  Joi.validate(player, playerSchema);
};

function validateTeamStats(team) {
    const teamStatsSchema = {
        name: Joi.string().min(3).required(),
        pts: Joi.number().required()
    }
    return Joi.validate(team, teamStatsSchema)
}

// get all team stats
app.get('/api/team_stats', (req, res) => {
    res.send(team_stats);
})

// get the stats for a certain team
app.get('/api/team_stats/:id', (req, res) => {
    const team = team_stats.find(team => team.id === parseInt(req.params.id));
    if (!team) return res.status(404).send(`team not found`)
    res.send(team);
})


app.post('/api/team_stats', (req, res) => {
    const {error} = validateTeamStats(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const team = {
        id: team_stats.length+1,
        name: req.body.name,
        pts: req.body.pts
    }
    team_stats.push(team)
    res.send(team)
})

app.put('/api/team_stats/:id', (req, res) => {
    let team = team_stats.find( team => team.id === parseInt(req.params.id));
    if (!team) return res.status(404).send(`resource does not exist`)

    const {error} = validateTeamStats(req.body);
    if (error) return res.status(400).send(`invalid body`)

    // does not work
    // team = {...team,
    //     name: req.body.name,
    //     pts: req.body.pts
    // }

    // Works in display:
    Object.assign(team, {name: req.body.name, pts: req.body.pts})

    // Also Works in display:
    // team.name = req.body.name;
    // team.pts = req.body.pts;

    res.send(team)
})

app.delete('/api/team_stats/:id', (req, res) => {
    const team = team_stats.find(team => team.id === parseInt(req.params.id))
    if (!team) return res.status(404).send(`team does not exist`)

    const index = team_stats.indexOf(team)
    team_stats.splice(index, 1);

    res.send(team);
})


// PORT - environment variable set outside the application
// To set port in the CLI enter export PORT=5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
});

