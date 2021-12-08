"use strict";

import express, { json } from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
}

app.use(cors(corsOptions))
app.use(json());


// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

// {
//   id: 'ae588a6b-4540-5714-bfe2-a5c2a65f547a',
//   name: 'Jimmy Coder',
//   skills: [ 'javascript', 'es6', 'nodejs', 'express' ]
// }
// {
//   "id": "person1",
//   "name": "Amy Fish",
//   "skills": [ "scala", "go" ]
// }
// {
//   "id": "person1",
//   "name": "Amy Fish",
//   "skills": [ "scala", "go" ]
// }
// {
//   "id": "person1",
//   "name": "Amy Fish",
//   "skills": [ "scala", "go" ]
// }

const candidates = [];

app.post("/candidates", function (req, res) {
  const newCandidate = req.body;

  if (candidates.find((candidate) => candidate.id === newCandidate.id)) {
    res.status(400).send("Candidate already exists");
    return;
  }

  candidates.push(newCandidate);
  res.status(200).send("OK");
});

app.get("/candidates/search", function (req, res) {
  const skillsParam = req.query.skills;

  if (!skillsParam) {
    res.status(400).send("Bad request");
    return;
  }

  const requiredSkills = skillsParam.split(",");

  console.log(requiredSkills);

  const matchedCandidates = candidates
    .map((candidate) => ({
      ...candidate,
      matchedSkills: candidate.skills.reduce(
        (totalMatchedSkills, skill) =>
          requiredSkills.includes(skill) + totalMatchedSkills,
        0
      ),
    }))
    .filter((candidate) => candidate.matchedSkills > 0);

  console.log(matchedCandidates);

  const [bestCandidate] = matchedCandidates.sort(
    (a, b) => b.matchedSkills - a.matchedSkills
  );

  if (!bestCandidate) {
    res.status(404).send("Candidate not found");
  } else {
    res.status(200).send(bestCandidate);
    return;
  }
});

app.get("/api/items", function (req, res) {
  res.send(["Italy", "Spain", "Portugal", "Macedonia"])
});

app.listen(process.env.HTTP_PORT || 42069);
